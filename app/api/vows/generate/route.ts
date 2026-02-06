import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { checkRateLimit } from '@/lib/admin-helpers'

// Force this route to be dynamic (not statically rendered)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface VowGenerationRequest {
  partnerName: string
  tone: string
  length: string
  relationshipLength?: string
  themes?: string[]
  additionalNotes?: string
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 5 requests per minute per IP
    const identifier = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(identifier, 5)) {
      return NextResponse.json(
        { error: 'Give it a few seconds before generating again.' },
        { status: 429 }
      )
    }

    const body: VowGenerationRequest = await req.json()

    // Validate required fields
    if (!body.partnerName || !body.tone || !body.length) {
      return NextResponse.json(
        { error: 'Partner name, tone, and length are required' },
        { status: 400 }
      )
    }

    // Build the system prompt (static)
    const systemPrompt = `You are helping write wedding ceremony vows.

These vows are spoken out loud.
They should sound like a real person talking.
Not like a poem.
Not like a movie speech.

Use simple words.
Use short sentences.
Leave breathing room with line breaks.

Do not be perfect.
Slight imperfections are good.

Do not use em dashes.
Do not use fancy metaphors.
Do not sound formal unless the tone asks for it.

This is a draft.
Not final vows.`

    // Build the user prompt (dynamic)
    const themesText = body.themes && body.themes.length > 0 
      ? body.themes.join(', ') 
      : 'Not specified'

    const userPrompt = `Write wedding ceremony vows as a spoken draft.

Partner name:
${body.partnerName}

Tone:
${body.tone}

Length:
${body.length}

How long we have been together:
${body.relationshipLength || 'Not specified'}

Themes to include:
${themesText}

Additional notes or moments to include naturally:
${body.additionalNotes || 'Not specified'}

Writing guidelines:
- Write like a real person speaking
- One idea per sentence
- Use contractions
- Leave natural pauses with line breaks
- Avoid clichés
- Avoid poetic language
- No em dashes
- Grade school reading level
- Include 2 to 4 promises
- Promises should be clear and simple
- Flow naturally between ideas
- Do not explain the vows
- Do not mention these instructions

Structure guidance:
- Start with a natural opening
- Reflect briefly on the relationship
- Move into promises
- End with a clear closing choice or commitment

This is a draft meant to be edited.`

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.75,
      max_tokens: 1000,
    })

    const generatedVows = completion.choices[0]?.message?.content || ''

    if (!generatedVows) {
      return NextResponse.json(
        { error: 'Failed to generate vows. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vows: generatedVows })

  } catch (error: any) {
    console.error('Error generating vows:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate vows. Please try again.' },
      { status: 500 }
    )
  }
}
