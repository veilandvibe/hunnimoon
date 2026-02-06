import { Tool } from '@/types/tools'

/**
 * IMPORTANT: When adding new tools to this array, ensure the tool page will have proper SEO:
 * 
 * 1. Add the tool object with complete metadata including:
 *    - slug: URL-friendly identifier (used in /tools/[slug])
 *    - name: Display name for the tool
 *    - h1: SEO-optimized H1 heading
 *    - description: Short description for tool listing
 *    - metaDescription: SEO meta description (appears in search results)
 *    - seoContent: Long-form content with h2, content, and faqs
 * 
 * 2. The canonical URL is automatically generated from the slug in:
 *    app/(marketing)/tools/[slug]/page.tsx - generateMetadata function
 * 
 * 3. Create the corresponding component in components/tools/ and add it to
 *    the toolComponents map in app/(marketing)/tools/[slug]/page.tsx
 * 
 * Each tool will automatically get:
 * - Proper canonical URL: /tools/[slug]
 * - Static generation via generateStaticParams
 * - Full SEO metadata in the HTML
 */
export const tools: Tool[] = [
  {
    slug: 'wedding-timeline-generator',
    name: 'Wedding Timeline Generator',
    h1: 'Wedding timeline generator',
    description: 'Wedding timeline generator tools show the general flow of wedding planning from getting engaged through the wedding day. They help couples understand timing without constantly second guessing.',
    category: 'timeline',
    component: 'WeddingTimelineGenerator',
    image: '/images/tools/wedding-timeline-generator.svg',
    metaDescription: 'Wedding timeline generator that shows the planning flow from engagement to the wedding day in a clear, realistic way.',
    seoContent: {
      h2: 'How to think through your wedding planning timeline without losing your mind',
      content: `
        <p>A wedding timeline generator is really just a way to see the whole stretch of planning laid out at once. From the day you get engaged to the day the wedding actually happens. Not perfectly. Just clearly enough that things don't feel like they're sneaking up on you.</p>
        
        <p>Most wedding timeline generator tools aren't trying to be clever. They show the general order things tend to happen in so you're not constantly wondering if you missed something or if you're already late.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How to think through your wedding planning timeline without losing your mind</h2>
        
        <p>Planning a wedding sounds easy until you're actually doing it. At the beginning, it all feels far away. You have time. Then one day it doesn't feel far at all.</p>
        
        <p>A wedding timeline generator helps because it lets you step back and look at the whole thing instead of only what's right in front of you. That alone changes how heavy everything feels.</p>
        
        <p>A lot of couples aren't disorganized. It just feels like everything starts asking for attention at the same time. A timeline helps you see that some things matter now, and some things honestly don't yet.</p>
        
        <p>This isn't about locking yourself into a strict plan. It's more about having a loose sense of what usually comes next so you're not always reacting.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why the full wedding timeline matters more than you think</h2>
        
        <p>Here's what surprises most people. Wedding stress usually isn't about the decisions themselves. It's about timing.</p>
        
        <p>You're usually not stressed because you don't know what you want. You're stressed because you don't know when you're supposed to decide.</p>
        
        <p>When you look at the full timeline, from engagement to the wedding day, that becomes clearer. You can see which choices tend to come early and which ones don't need attention for a while.</p>
        
        <p>Budget is one of those quiet ones. If it's ignored early, it shows up later in ways you didn't expect. Guest count works the same way. It quietly touches almost everything else.</p>
        
        <p>Seeing the whole timeline makes things feel less personal. Instead of thinking you're behind, you start realizing this is just how planning usually feels.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What happens right after you get engaged</h2>
        
        <p>The beginning phase is strange. You're excited. People ask questions. You feel like you should have answers even though nothing feels settled yet.</p>
        
        <p>This part of the timeline is mostly about getting aligned with your partner. Talking through the kind of wedding you both picture. Nothing detailed. Just direction.</p>
        
        <p>Size. General feel. Indoor or outdoor. Things like that.</p>
        
        <p>I remember a friend who booked a venue almost immediately because it felt like progress. They loved it. It wasn't a bad choice. It just quietly shaped everything that came after.</p>
        
        <p>Most wedding timeline generators keep this phase light on purpose. You're setting a direction here, not committing to details.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Early planning and the quiet decisions that matter</h2>
        
        <p>This is when planning starts to feel real. You're far enough out that you still have options, but close enough that choices begin to stick.</p>
        
        <p>Guest list management usually starts here. Not names yet. Just rough numbers. Who absolutely needs to be there. Who might depend on space or budget.</p>
        
        <p>That number affects everything. Budget. Vendors. How formal things feel.</p>
        
        <p>Writing things down helps more than people admit. Even if it's messy. Especially if it's messy.</p>
        
        <p>This is why tools like Hunnimoon focus early on guest list management and budget tracking. Those two things quietly shape the rest of the timeline whether you want them to or not.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">The middle stretch where time feels fake</h2>
        
        <p>This is the stretch people underestimate. The wedding still feels far away, but it's no longer just an idea you talk about.</p>
        
        <p>Weeks blur together here. Sometimes nothing feels urgent. Other times everything does.</p>
        
        <p>This phase is usually about vendor organization. Comparing options. Sending emails. Making a few commitments. Then waiting again.</p>
        
        <p>A timeline helps here because it reminds you that not everything needs attention right now. Some things naturally belong later.</p>
        
        <p>If you've caught yourself wondering whether you should be doing more, this is probably the part you're in.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">When the wedding starts to feel close</h2>
        
        <p>At some point, the wedding stops feeling abstract. Dates feel heavier. Messages feel more serious.</p>
        
        <p>This is usually when RSVP management becomes real. You stop thinking about sending invites and start thinking about who's actually coming.</p>
        
        <p>You notice gaps. People who haven't replied. Decisions that depend on final numbers.</p>
        
        <p>A timeline doesn't remove the pressure here, but it explains it. You're not suddenly bad at planning. You're just in the busy part.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How a timeline helps with decision fatigue</h2>
        
        <p>Decision fatigue shows up quietly. Every choice feels emotional. Even small ones.</p>
        
        <p>A wedding timeline generator helps by narrowing your focus. You're not deciding everything at once. You're only dealing with what belongs in this window.</p>
        
        <p>That alone makes decisions feel lighter.</p>
        
        <p>It also helps couples share the mental load. When both people can see what's ahead, planning stops feeling one sided.</p>
        
        <p>That shift matters more than it sounds.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What a timeline does not do</h2>
        
        <p>It doesn't guarantee a stress free wedding. Anyone who promises that is lying.</p>
        
        <p>It doesn't replace communication. Or flexibility.</p>
        
        <p>And it definitely doesn't mean you're behind if your life doesn't line up perfectly with it.</p>
        
        <p>A timeline is a guide. Not a rulebook.</p>
        
        <p>You're allowed to move things around. You're allowed to skip things that don't matter to you.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Using a timeline alongside simple planning tools</h2>
        
        <p>A timeline works best when it's paired with simple organization, not complicated systems.</p>
        
        <p>Guest list management keeps names and numbers from floating around in your head. Budget tracking keeps expectations grounded. Vendor organization keeps conversations from disappearing.</p>
        
        <p>Hunnimoon focuses on those pieces because they support the timeline without overwhelming it.</p>
        
        <p>You don't need more features. You need fewer unknowns.</p>
        
        <p>That's what a good wedding timeline generator is actually for.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">The goal isn't perfection, it's calm</h2>
        
        <p>The point of mapping out your wedding from engagement to the big day isn't control. It's calm.</p>
        
        <p>Knowing what's ahead lowers the background noise.</p>
        
        <p>You still get surprises. You still change your mind.</p>
        
        <p>But you're not constantly wondering if you forgot something important.</p>
        
        <p>And honestly, that's a better way to plan anything.</p>
      `,
      faqs: [
        {
          question: 'What is a wedding timeline generator',
          answer: 'A wedding timeline generator shows the usual flow of wedding planning from engagement through the wedding day. It helps you understand timing without guessing.'
        },
        {
          question: 'When should a wedding timeline start',
          answer: 'Most timelines start right after engagement. Early conversations tend to shape everything that comes later.'
        },
        {
          question: 'How far ahead should a wedding timeline go',
          answer: 'It usually covers the entire planning period. That could be several months or more than a year depending on the couple.'
        },
        {
          question: 'Is a wedding timeline the same as a checklist',
          answer: 'No. A timeline focuses on when things tend to happen, not a list of tasks you must complete.'
        },
        {
          question: 'Can a wedding timeline change',
          answer: 'Yes. Timelines are meant to move as plans shift. They\'re flexible by nature.'
        },
        {
          question: 'Why does a wedding timeline reduce stress',
          answer: 'It removes uncertainty. Knowing what\'s coming makes decisions feel less urgent.'
        },
        {
          question: 'How does Hunnimoon fit into a wedding timeline',
          answer: 'Hunnimoon supports planning through guest list management, budget tracking, vendor organization, and RSVP management alongside your timeline.'
        },
        {
          question: 'Does Hunnimoon build the timeline for you',
          answer: 'No. Hunnimoon doesn\'t create timelines. It supports the planning pieces that naturally fit within one.'
        },
        {
          question: 'Is a wedding timeline useful for small weddings',
          answer: 'Yes. Even smaller weddings have timing considerations. A timeline helps regardless of size.'
        }
      ]
    }
  },
  {
    slug: 'wedding-day-timeline-generator',
    name: 'Wedding Day Timeline Generator',
    h1: 'Wedding Day Timeline Generator',
    description: 'Use this wedding day timeline generator to create a detailed hour-by-hour schedule for your big day. From getting ready to the final send-off, plan every moment so nothing gets missed.',
    category: 'timeline',
    component: 'WeddingDayTimelineGenerator',
    image: '/images/tools/wedding-day-timeline-generator.svg',
    metaDescription: 'Wedding day timeline generator creates a detailed hour-by-hour schedule from getting ready to send-off so nothing gets missed.',
    seoContent: {
      h2: 'How to Use a Wedding Day Timeline Generator for a Stress-Free Day',
      content: `
        <p>Your wedding day moves fast. Hair and makeup, photos, ceremony, cocktail hour, and reception all packed into a few hours. Without a clear timeline, things run late, vendors get confused, and you miss important moments.</p>

        <p>A wedding day timeline generator fixes this. Maps out your entire day hour by hour so everyone knows where to be and when. Your photographer knows when to show up for getting-ready shots. Your DJ knows when to cue your entrance. Nothing gets skipped because it's all written down.</p>

        <p>Most couples wing it and hope everything works out.</p>

        <p>That's how you end up rushing through photos or cutting cocktail hour short. A timeline keeps your day on track without feeling rigid or stressful.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why You Need an Hour-by-Hour Timeline</h2>

        <p>Your vendors all need to coordinate with each other. If your photographer doesn't know when the ceremony starts, they might miss key shots. If your caterer starts serving dinner too early, guests are still on the dance floor.</p>

        <p>A timeline syncs everyone up. When you share it with your vendors ahead of time, they can plan their work around your schedule. Cuts down on confusion and makes the day run smoother.</p>

        <p>You also need buffer time built in. Things always take longer than you think (trust me). Makeup runs over, photos take extra time, or guests show up late. A good timeline accounts for these delays so you don't feel rushed.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What Happens When You Skip the Planning</h2>

        <p>Without a timeline, your vendors make their own schedule. Your photographer might want to start portraits right after the ceremony, but your venue needs time to flip the space. These conflicts create stress on a day when you want to stay calm.</p>

        <p>You also risk missing photos. Don't schedule time for family portraits? You'll try to squeeze them in somewhere. Then you're scrambling to round up relatives while your cocktail hour starts without you.</p>

        <p>Late starts throw everything off. Ceremony runs 20 minutes behind and suddenly your cocktail hour gets cut short, dinner service gets delayed, and your reception timeline falls apart. One delay creates a domino effect.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How the Wedding Day Timeline Generator Works</h2>

        <p>Start by entering your ceremony time. This is your anchor point. Everything else gets scheduled around when you walk down the aisle.</p>

        <p>Next, add your reception start time. Ceremony and reception at different locations? The tool accounts for travel time. Same place? It factors in the venue flip.</p>

        <p>The generator builds in standard times for each event. Hair and makeup usually takes about 3 hours. Family photos take about an hour. Cocktail hour is one hour. These estimates give you a realistic schedule.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What to Include in Your Timeline</h2>

        <p>Getting ready should start at least 3 hours before your ceremony. This gives you time for hair, makeup, getting dressed, and a few candid photos. Don't cut this short or you'll feel rushed from the start.</p>

        <p>Schedule a first look if you want one. Happens about an hour before the ceremony and gives you a private moment. Also lets you knock out most of your couple portraits before guests arrive.</p>

        <p>Family photos need at least an hour. You're wrangling multiple groups, and people always take longer to gather than you expect. Skip this time and you'll miss important family shots.</p>

        <p>Cocktail hour gives you breathing room. While guests enjoy drinks and appetizers, you finish photos. This also gives the venue staff time to set up your reception space.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Common Mistakes That Throw Off Your Timeline</h2>

        <p>Starting hair and makeup too late is the biggest mistake.</p>

        <p>You think 2 hours is enough, but it's not. When makeup runs over, everything after it gets delayed. Build in extra time at the start of your day.</p>

        <p>Skipping the first look means cramming all your photos into cocktail hour. That's not enough time for couples, wedding party, and family shots. You either rush through photos or show up late to your own reception.</p>

        <p>Not sharing your timeline with vendors creates confusion. Your DJ doesn't know when to start playing music. Your caterer doesn't know when to serve dinner. Send everyone a copy of your timeline at least 2 weeks before the wedding.</p>

        <p>Forgetting about travel time between venues causes problems. It takes longer than you think to get everyone from the ceremony site to the reception. Add at least 30 minutes for travel, even if the venues are close.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How to Share Your Timeline with Your Team</h2>

        <p>Once you generate your timeline, send it to every vendor. Your photographer, videographer, DJ, florist, and caterer all need a copy. They should know the exact time for every event.</p>

        <p>Give your wedding party a simplified version. They don't need every detail, but they should know when to arrive for photos and when key events happen. Keeps everyone on the same page.</p>

        <p>Print a copy for your day-of coordinator or point person. They'll use it to keep your day on track. If something runs late, they can adjust the schedule without bothering you.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">When Your Timeline Needs to Flex</h2>

        <p>Your timeline is a guide. Not a rule.</p>

        <p>If photos are taking longer because the lighting is perfect, take the extra time. You can shorten cocktail hour or skip a few formal shots later.</p>

        <p>Weather can throw things off. Have an outdoor ceremony and it rains? You need a backup plan. Build flexibility into your timeline so you can shift things around if needed.</p>

        <p>Some events can be cut if you're running behind. Bouquet and garter toss are nice but optional. Cake cutting can happen earlier or later. Focus on the moments that matter most to you.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Using a Full Planning Tool for Your Wedding</h2>

        <p>A day-of timeline generator helps, but it doesn't handle everything. You still need to manage your budget, track RSVPs, and organize vendor contacts. That's where a tool like Hunnimoon comes in.</p>

        <p>Hunnimoon keeps your budget, guest list, and vendor info all in one place. When you update your schedule, you can share it directly with vendors. Your partner can access everything too, so you're both always in sync.</p>

        <p>Instead of juggling spreadsheets and notes, everything updates automatically. You can see what's done and what's left without digging through old emails. Try it free for 7 days and see if it makes planning easier.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Tips for Staying on Schedule</h2>

        <p>Assign someone to watch the clock. This can be your coordinator, a bridesmaid, or a family member. Their job is to gently remind you when it's time to move to the next event.</p>

        <p>Don't overbook your day. Try to cram too much in and something will get cut. Focus on the photos and moments that matter most and let go of the rest.</p>

        <p>Start on time. Ceremony scheduled for 3 PM? Start at 3 PM. Guests arrived on time, and they shouldn't wait because you're running late. Respect their time and your timeline stays intact.</p>

        <p>Communicate with your vendors the week before. Confirm all the times with everyone. If someone's schedule changed, you have time to adjust your timeline before the wedding.</p>
      `,
      faqs: [
        {
          question: 'What time should I start getting ready on my wedding day?',
          answer: 'Start hair and makeup at least 3 hours before your ceremony. If your ceremony is at 3 PM, begin getting ready by noon. This gives you time for hair, makeup, getting dressed, and a few photos without feeling rushed.'
        },
        {
          question: 'How much time should I budget for wedding photos?',
          answer: 'Plan for at least 1 hour of family and couple portraits. If you skip the first look, you need even more time. Most photographers recommend 90 minutes to 2 hours for all formal photos on your wedding day.'
        },
        {
          question: 'Do I need a first look if I want to stick to tradition?',
          answer: 'No, a first look is optional. Some couples prefer to see each other for the first time at the ceremony. Just know that skipping it means all your photos happen during cocktail hour, which feels more rushed.'
        },
        {
          question: 'How long does a typical wedding ceremony last?',
          answer: 'Most ceremonies last 20 to 30 minutes. If you have a religious ceremony with full mass, plan for 45 minutes to an hour. Shorter ceremonies give you more time for photos and reception events.'
        },
        {
          question: 'What if my wedding day timeline gets off track?',
          answer: 'Stay calm and adjust. Skip optional events like bouquet toss or cut cocktail hour short. Your day-of coordinator can help shift things around. The important part is enjoying your day, not sticking to every minute.'
        },
        {
          question: 'Should I share my timeline with all my vendors?',
          answer: 'Yes, send your timeline to every vendor at least two weeks before your wedding. They need to know when to set up, when key events happen, and when to break down. This keeps everyone coordinated.'
        },
        {
          question: 'How does Hunnimoon help with wedding day planning?',
          answer: 'Hunnimoon keeps your timeline, vendor contacts, and schedule all in one place. You can share updates with your team instantly, and your partner can access everything too. Try it free for 7 days to see how it works.'
        },
        {
          question: 'What happens during cocktail hour?',
          answer: 'Cocktail hour gives guests drinks and appetizers while you finish photos. It also gives your venue time to flip the ceremony space into the reception setup. Most cocktail hours last one hour.'
        }
      ]
    }
  },
  {
    slug: 'wedding-reception-timeline-generator',
    name: 'Wedding Reception Timeline Generator',
    h1: 'Wedding Reception Timeline Generator',
    description: 'Wedding Reception Timeline Generator helps you map out the flow of your reception so the night makes sense. It turns a rough idea of events into a clear order you can actually picture.',
    category: 'timeline',
    component: 'WeddingReceptionTimelineGenerator',
    image: '/images/tools/wedding-reception-timeline-generator.svg',
    metaDescription: 'Wedding Reception Timeline Generator helps you plan the flow of your reception so dinner, speeches, and dancing feel natural.',
    seoContent: {
      h2: 'How to Build a Wedding Reception Timeline That Actually Works',
      content: `
        <p>The Wedding Reception Timeline Generator exists because the reception is where things quietly fall apart if no one thinks it through. The ceremony ends, people clap, hugs happen, and then suddenly everyone is standing around asking what's next. This tool helps you sketch out a reception timeline that feels natural, not stiff.</p>

        <p>It does not try to control your day. It just gives you a way to think through it. One piece at a time.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why reception timelines feel harder than they should</h2>

        <p>Ceremonies are scripted. Receptions are not.</p>

        <p>Most couples know what moments they want. Dinner, speeches, first dance, cake. The problem is the space between those moments. How long does dinner actually take. When do people sit. When do they get up again.</p>

        <p>This sounds obvious, but the reception is the longest part of the day. It is also the least structured by default. Vendors can guide you, but they all focus on their piece.</p>

        <p>No one is looking at the full picture unless you do.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What a reception timeline really needs to do</h2>

        <p>A good timeline is not about minutes.</p>

        <p>It is about momentum. Guests should feel like the night is moving forward without being rushed. You want enough breathing room for conversations. You also want clear moments where attention shifts.</p>

        <p>The timeline should answer simple questions. When do people eat. When do they listen. When do they dance. When can they leave without feeling awkward.</p>

        <p>If a timeline cannot answer those, it is not useful.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How this generator helps without locking you in</h2>

        <p>The Wedding Reception Timeline Generator works best early.</p>

        <p>You use it when everything is still flexible. Before vendors ask for final run-of-show documents. Before family members start suggesting things.</p>

        <p>It gives you a starting order. You can move pieces around. You can ignore parts that do not apply to you. Nothing helps more than seeing the whole evening written out once.</p>

        <p>Even if you change it later.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">The moments most people underestimate</h2>

        <p>Transitions take time.</p>

        <p>Guests do not teleport from cocktail hour to their seats. Speeches do not magically quiet a room. Dance floors do not fill instantly.</p>

        <p>The generator builds in realistic gaps. Not padding. Just honesty.</p>

        <p>This is where stress usually hides. When things are technically planned but practically rushed.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Dinner timing is where everything shifts</h2>

        <p>Dinner sets the tone for the rest of the night.</p>

        <p>If dinner runs long, dancing starts late. If speeches are stacked awkwardly, people lose focus. If nothing happens during dinner, energy dips.</p>

        <p>The tool helps you decide what happens during dinner and what waits until after. There is no right answer. There is just what fits your crowd.</p>

        <p>Older guests move differently than college friends. Families linger. Friend groups roam.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">A quick personal note on why order matters</h2>

        <p>At a friend's wedding, the speeches came after open dancing.</p>

        <p>Half the room was outside. Some guests were already leaving. The speeches were heartfelt and barely heard.</p>

        <p>No one did anything wrong. They just did not think through the order.</p>

        <p>That is the kind of mistake a simple timeline prevents.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What this tool does not try to solve</h2>

        <p>This generator focuses only on the reception flow.</p>

        <p>It does not manage your guest list. It does not track your budget. It does not organize vendor contacts.</p>

        <p>This tool helps with one piece. Hunnimoon keeps your guest list, budget, vendors, and RSVPs organized.</p>

        <p>They work best together because they stay in their lanes.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Using a timeline without overthinking it</h2>

        <p>You do not need to show your timeline to everyone.</p>

        <p>Share it with your planner or coordinator if you have one. Share it with your DJ. That is usually enough.</p>

        <p>Guests do not need to know the plan. They just need to feel like one exists.</p>

        <p>Once you finish using this tool, you still need to manage guests and budgets. That's where Hunnimoon fits.</p>
      `,
      faqs: [
        {
          question: 'How long should a wedding reception usually last',
          answer: 'Most receptions run four to five hours. That includes dinner, speeches, and dancing. The right length depends on your crowd and venue rules.'
        },
        {
          question: 'Do I need a minute by minute reception timeline',
          answer: 'No. A loose order is usually better. Vendors can handle exact timing once the structure is clear.'
        },
        {
          question: 'Can I change my reception timeline later',
          answer: 'Yes. Most couples adjust it more than once. The goal is clarity, not commitment.'
        },
        {
          question: 'When should speeches happen during the reception',
          answer: 'Many couples place speeches during or right after dinner. This keeps guests seated and attentive. There is flexibility if your crowd prefers a different flow.'
        },
        {
          question: 'Does this tool replace a planner or coordinator',
          answer: 'No. It supports them. It gives you a starting point so conversations are easier.'
        },
        {
          question: 'Is this connected to my guest list or RSVPs',
          answer: 'The generator itself is separate. Hunnimoon handles guest list management and RSVP management in one place.'
        },
        {
          question: 'Can I use this with my budget planning',
          answer: 'The timeline helps you see where time goes. Hunnimoon tracks your budget so you can connect timing decisions to costs.'
        },
        {
          question: 'What if my vendors ask for a final timeline',
          answer: 'This tool helps you prepare for that request. Vendor organization inside Hunnimoon keeps those details easy to share later.'
        }
      ]
    }
  },
  {
    slug: 'wedding-ceremony-vows-writer',
    name: 'Wedding Ceremony Vows Writer',
    h1: 'Wedding Ceremony Vows Writer',
    description: 'The wedding ceremony vows writer supports couples as they write personal vows for their wedding ceremony. It gives structure without taking over your words.',
    category: 'planning',
    component: 'WeddingVowsWriter',
    image: '/images/tools/wedding-vows-writer.svg',
    metaDescription: 'A wedding ceremony vows writer helps couples write clear, personal vows without pressure or overthinking.',
    seoContent: {
      h2: 'A simple way to write wedding vows that actually sound like you',
      content: `
        <p>Writing vows sounds romantic until you sit down to do it. Then it gets quiet. The wedding ceremony vows writer exists for this exact moment. It helps you shape your thoughts when your brain goes blank, but your feelings are very loud.</p>
        
        <p>This isn't about fancy language or perfect lines. It's about saying something real in front of people you love. And yes, that can feel like a lot.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why vows feel harder than people admit</h2>
        
        <p>Here's the thing. Most people have never written vows before. You're expected to be heartfelt, calm, and poetic all at once.</p>
        
        <p>You also know this part of the ceremony matters. People listen closely. Phones come out. The pressure creeps in.</p>
        
        <p>This sounds obvious, but loving someone and explaining that love are two different skills. One comes naturally. The other takes a bit of help.</p>
        
        <p>That's where a wedding ceremony vows writer can help steady things. It doesn't replace your voice. It just gives it a place to land.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What a vows tool actually helps with</h2>
        
        <p>Most couples think a vows tool will write everything for them. That's not really the point.</p>
        
        <p>A good wedding ceremony vows writer helps you organize your thoughts. It nudges you with questions. It reminds you of moments you might forget.</p>
        
        <p>You still choose the words. You still decide what feels right.</p>
        
        <p>It's like talking it out with a friend who knows when to pause and listen.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Starting without the panic</h2>
        
        <p>Blank pages are intimidating. Especially when the topic is your relationship.</p>
        
        <p>The wedding ceremony vows writer breaks the start into smaller pieces. One idea at a time.</p>
        
        <p>You might begin with how you met. Or what surprised you about them. Or what you promise to keep doing.</p>
        
        <p>No rush. No perfect order. Just words showing up slowly.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Keeping your vows personal, not generic</h2>
        
        <p>A common fear is sounding like everyone else. That's fair.</p>
        
        <p>This is where the wedding ceremony vows writer works best. It asks about your specific story.</p>
        
        <p>Inside jokes. Hard years. Quiet habits you love.</p>
        
        <p>If you answer honestly, the result won't feel copied. It'll feel familiar. In a good way.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How long is too long</h2>
        
        <p>This question comes up a lot.</p>
        
        <p>There's no rule, but there is comfort. Most vows land well around one to two minutes when spoken.</p>
        
        <p>The wedding ceremony vows writer helps you trim without losing meaning. You can see where you repeat yourself. It happens to everyone.</p>
        
        <p>Short doesn't mean shallow. It just means clear.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">A quick personal note</h2>
        
        <p>I once helped a friend write vows the night before their wedding. We sat on the floor. Snacks everywhere.</p>
        
        <p>They kept saying they weren't good with words. But once they talked out loud, the words showed up.</p>
        
        <p>A wedding ceremony vows writer works the same way. It listens first. Then it shapes.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Practicing without overthinking</h2>
        
        <p>After writing, reading your vows out loud matters.</p>
        
        <p>You hear what flows and what trips you up. That's normal.</p>
        
        <p>The wedding ceremony vows writer makes edits easier because your structure is already there.</p>
        
        <p>Read them to yourself. Then maybe once to your partner if that feels right.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Fitting vow writing into the rest of planning</h2>
        
        <p>Vows don't exist in a bubble. You're planning a whole wedding.</p>
        
        <p>Some couples use Hunnimoon to manage their guest list, RSVPs, vendors, and budget tracking. Writing vows fits into that same calm planning mindset.</p>
        
        <p>You don't need everything done at once. Just a little progress.</p>
        
        <p>The wedding ceremony vows writer can be one of the quieter, nicer parts of planning.</p>
        
        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">When the tool is enough</h2>
        
        <p>Not everyone needs extra help beyond this.</p>
        
        <p>For many couples, a wedding ceremony vows writer is all it takes to get unstuck.</p>
        
        <p>You write. You tweak. You stop when it feels like you.</p>
        
        <p>And that's usually the moment you're ready.</p>
      `,
      faqs: [
        {
          question: 'What is a wedding ceremony vows writer used for',
          answer: 'It helps couples write personal vows without starting from scratch. The tool guides ideas but keeps your own words front and center.'
        },
        {
          question: 'Can a vows tool make my vows sound fake',
          answer: 'Not if you answer honestly. The tool reflects what you put into it, so your voice still comes through.'
        },
        {
          question: 'How early should we write our vows',
          answer: 'Many couples start a few weeks before the wedding. That gives you time to write, pause, and edit without stress.'
        },
        {
          question: 'Do both partners need to use the same tool',
          answer: 'It helps with balance, but it\'s not required. Some couples prefer different writing styles, and that\'s okay.'
        },
        {
          question: 'How long should vows written with a tool be',
          answer: 'Most couples aim for one to two minutes when spoken. The tool helps you see what to keep and what to cut.'
        },
        {
          question: 'Can we work on vows while planning other things in Hunnimoon',
          answer: 'Yes. Many couples use Hunnimoon for guest list management, RSVP management, vendor organization, and budget tracking alongside vow writing.'
        },
        {
          question: 'Does Hunnimoon write vows for us',
          answer: 'No. Hunnimoon supports planning tasks, while the vows writer helps you shape your own words. You stay in control.'
        },
        {
          question: 'Is a vows tool helpful if we\'re already good with words',
          answer: 'It can still help organize thoughts and avoid rambling. Even confident writers like structure.'
        }
      ]
    }
  }
]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug)
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter(tool => tool.category === category)
}

export function getAllTools(): Tool[] {
  return tools
}
