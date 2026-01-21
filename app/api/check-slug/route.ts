import { NextRequest, NextResponse } from 'next/server'
import { init } from '@instantdb/admin'

// Validate environment variables
if (!process.env.NEXT_PUBLIC_INSTANT_APP_ID) {
  throw new Error('NEXT_PUBLIC_INSTANT_APP_ID is not set')
}
if (!process.env.INSTANT_ADMIN_SECRET) {
  throw new Error('INSTANT_ADMIN_SECRET is not set')
}

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_SECRET!,
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')
  
  if (!slug) {
    return NextResponse.json({ exists: false })
  }
  
  try {
    const result = await db.query({ 
      weddings: { 
        $: { 
          where: { 
            wedding_slug: slug 
          } 
        } 
      } 
    })
    
    console.log('Query result:', JSON.stringify(result, null, 2))
    
    // Check if result has data property
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid query result')
    }
    
    // InstantDB Admin returns { weddings: [...] } directly
    const weddings = result.weddings
    const exists = weddings && weddings.length > 0
    
    return NextResponse.json({ exists })
  } catch (error) {
    console.error('Error checking slug:', error)
    // Return an error status instead of false
    return NextResponse.json(
      { error: 'Failed to check slug availability' }, 
      { status: 500 }
    )
  }
}
