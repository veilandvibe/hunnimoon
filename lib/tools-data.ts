import { Tool } from '@/types/tools'

export const tools: Tool[] = [
  {
    slug: 'wedding-timeline-generator',
    name: 'Wedding Timeline Generator',
    h1: 'Wedding Timeline Generator',
    description: 'Use this wedding timeline generator to plan every step from engagement to your big day. Get organized with month-by-month tasks and never miss an important deadline.',
    category: 'timeline',
    component: 'WeddingTimelineGenerator',
    image: '/images/tools/wedding-timeline-generator.svg',
    seoContent: {
      h2: 'How to Use a Wedding Timeline Generator to Plan Your Big Day',
      content: `
        <p>Most couples start planning with no clear timeline. You book a venue, then realize you forgot about the photographer. Or invitations get ordered too late and suddenly you're paying for rush shipping. A wedding timeline generator fixes this by showing you exactly what to do and when.</p>

        <p>Here's the thing. Wedding planning is not complicated. It just has a lot of moving parts.</p>

        <p>When you don't have a system, small tasks slip through the cracks. You forget to book transportation or order bridesmaid dresses until it's almost too late. That stress builds up fast.</p>

        <p>A timeline generator walks you through the process in order. It tells you what to handle first, what can wait, and what deadlines actually matter. You stop guessing and start checking things off a list.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why Do Most Couples Mess Up Their Wedding Timeline</h2>

        <p>The biggest mistake? Starting with the fun stuff.</p>

        <p>You want to pick flowers and cake flavors, but those decisions don't matter if you don't have a venue booked. Priorities get mixed up, and you end up scrambling later.</p>

        <p>Another problem is underestimating how long things take. Ordering a wedding dress can take six months when you factor in fittings and alterations. Wait too long and you're stuck with limited options or paying extra for rush orders.</p>

        <p>People also forget about the small tasks that add up. Hotel blocks, save-the-dates, hair and makeup trials, vendor confirmations. When you don't track these, something always gets missed.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What a Wedding Timeline Generator Does For You</h2>

        <p>A timeline generator breaks your planning into phases. Starts with the big decisions like venue and vendors, then moves into details like invitations. Each phase has a deadline based on your wedding date.</p>

        <p>You enter your wedding date and the tool calculates how much time you have. If you're 12 months out, it shows you what to do now and what to save for later. Only have six months? It adjusts the timeline to focus on urgent tasks first.</p>

        <p>The tool also accounts for lead times. Photographers book up fast, so you need to secure one early (like really early). Invitations take weeks to print and mail, so you can't wait until the last minute. The generator builds these buffer periods into your schedule.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How to Use the Timeline Generator</h2>

        <p>Start by entering your wedding date. Already engaged? Add your engagement date too. This gives the tool a full picture of how much time you have.</p>

        <p>Next, choose your planning style. Want a relaxed pace? The tool spreads tasks out more. In a hurry? It compresses the timeline and shows you what to prioritize.</p>

        <p>Once you generate the timeline, you get a month-by-month breakdown. Each section lists the tasks you should complete during that period. Print it, save it, or use it as a checklist.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What to Do After You Generate Your Timeline</h2>

        <p>The timeline is a guide. Not a rigid schedule.</p>

        <p>Life happens. Plans change. If you fall behind, don't panic. Focus on the tasks that have the biggest impact, like venue, catering, and photography.</p>

        <p>Some tasks can flex if needed. You can order favors later or skip them entirely. You can simplify your decor or cut back on extras. The timeline helps you see what matters most when you need to make trade-offs.</p>

        <p>Share the timeline with your partner too. Wedding planning works better when both of you know what needs to happen. Keeps everyone on the same page and cuts down on miscommunication.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">When a Timeline Generator Is Not Enough</h2>

        <p>A timeline generator is a great starting point, but it doesn't replace a full planning system. You still need to track your budget, manage your guest list, and organize vendor contacts. That's where a tool like Hunnimoon comes in.</p>

        <p>Hunnimoon keeps your entire wedding in one place. Budget tracking, guest management, RSVP tracking, vendor organization all synced together. Instead of juggling spreadsheets and notes, everything updates automatically.</p>

        <p>You can also share access with your partner, so both of you can see what's done and what's left. Cuts down on the back-and-forth and makes planning feel less overwhelming. Try it free for seven days to see if it fits your needs.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Common Timeline Mistakes to Avoid</h2>

        <p>Don't wait too long to book your venue. Popular venues fill up a year or more in advance. Have a specific location in mind? That should be your first priority after setting your budget.</p>

        <p>Don't skip the engagement photos. These are usually included with your photography package, and you can use them for save-the-dates. Schedule them early so you have time to get the images back.</p>

        <p>Don't forget about your marriage license. Each state has different requirements and waiting periods. Some licenses expire after about 60 days, so you need to time this carefully (trust me on this).</p>

        <p>Don't leave your seating chart until the last minute. This task takes longer than you think, especially if you have family dynamics to navigate. Start working on it as soon as you have your final guest count.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How Far in Advance Should You Start Planning</h2>

        <p>Most couples start planning 12 to 18 months before their wedding. Gives you enough time to book popular vendors without feeling rushed. Shorter timeline? It's still doable, you just need to move faster on the big decisions.</p>

        <p>For a six-month timeline, focus on venue, catering, and photography first. These are the hardest to book on short notice. Everything else can be handled in the remaining months if you stay organized.</p>

        <p>Have more than 18 months? Don't feel like you need to do everything right away. Spread out your tasks so you don't burn out. Use the extra time to research vendors and compare options without pressure.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why Staying Organized Makes Planning Easier</h2>

        <p>Wedding planning is stressful when you don't know what's next. A timeline generator removes that uncertainty. You always know what to focus on, which makes the process feel manageable instead of overwhelming.</p>

        <p>When you have a clear plan, you also avoid last-minute panic. You're not scrambling to find a florist two months before the wedding or realizing you forgot to order programs. Everything gets handled at the right time.</p>

        <p>Organization also saves you money. When you plan ahead, you have time to compare prices and negotiate with vendors. Rush orders and last-minute bookings almost always cost more.</p>
      `,
      faqs: [
        {
          question: 'How far in advance should I start planning my wedding?',
          answer: 'Most couples start planning 12 to 18 months before their wedding date. This gives you enough time to book popular venues and vendors without feeling rushed. If you have a shorter timeline, don\'t worry. A wedding timeline generator helps you prioritize the most important tasks first.'
        },
        {
          question: 'What are the first things to do when planning a wedding?',
          answer: 'Start by setting your budget and creating a guest list. These two decisions affect almost everything else. Once you know your numbers, you can book your venue and start looking at vendors. A timeline generator walks you through these steps in the right order.'
        },
        {
          question: 'Can I plan a wedding in 6 months?',
          answer: 'Yes, you can plan a wedding in 6 months. You need to move fast on venue and vendor bookings since availability gets tight. Focus on the essentials first and skip anything that feels optional. A timeline generator helps you stay on track when time is short.'
        },
        {
          question: 'What tasks should I complete 3 months before the wedding?',
          answer: 'Three months out, finalize your guest list and send invitations. Confirm details with all your vendors and schedule final fittings. This is also when you should finalize your ceremony and reception timeline. Most couples feel the pressure build around this point.'
        },
        {
          question: 'Do I need a wedding planner if I use a timeline generator?',
          answer: 'A timeline generator helps you stay organized, but it doesn\'t replace a planner. If you want someone to handle logistics on your wedding day or negotiate with vendors, a planner is worth it. For couples on a budget, a timeline tool plus a day-of coordinator works well.'
        },
        {
          question: 'How does Hunnimoon help with wedding planning?',
          answer: 'Hunnimoon keeps your entire wedding in one place. You get timeline tracking, budget management, guest lists, and vendor contacts all together. Instead of juggling spreadsheets and apps, everything syncs automatically. You can try it free for 7 days.'
        },
        {
          question: 'What happens if I fall behind on my wedding timeline?',
          answer: 'Falling behind happens to most couples. The key is knowing which tasks matter most. Venue, photographer, and catering should be your top priorities. Everything else can flex if needed. A good timeline tool shows you what to tackle first when you are running late.'
        },
        {
          question: 'Can my partner access the same wedding timeline?',
          answer: 'Yes, if you use a shared planning tool like Hunnimoon. Both of you can see the timeline, update tasks, and track progress together. This keeps everyone on the same page and cuts down on miscommunication. Shared access is included in the free trial.'
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
    description: 'Use this wedding reception timeline generator to build a minute-by-minute schedule for your celebration. Plan your grand entrance, toasts, dances, and dinner service so everything flows smoothly.',
    category: 'timeline',
    component: 'WeddingReceptionTimelineGenerator',
    image: '/images/tools/wedding-reception-timeline-generator.svg',
    seoContent: {
      h2: 'How to Create the Perfect Wedding Reception Timeline',
      content: `
        <p>Your reception should feel fun. Not rushed.</p>

        <p>When events are poorly timed, dinner gets cold, dancing feels short, or your photographer misses key moments. A wedding reception timeline generator fixes this by giving you a clear schedule for every part of your celebration.</p>

        <p>Most couples assume their DJ or venue coordinator will handle the timing. That works until your caterer starts serving dinner while guests are still dancing, or your cake cutting happens when half your guests are in the bathroom. A timeline keeps everyone coordinated.</p>

        <p>You don't need to micromanage every minute. You just need a plan that tells your vendors when to move from one event to the next. Keeps your reception flowing without making it feel rigid or over-scheduled.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why Your Reception Needs a Timeline</h2>

        <p>Your DJ, photographer, and caterer all work on different schedules. The DJ wants to keep guests dancing. The photographer needs time for formal shots. The caterer wants to serve dinner while it's hot. Without a timeline, these priorities clash.</p>

        <p>A reception timeline syncs everyone up. Your DJ knows when to make announcements. Your photographer knows when to be ready for the first dance or cake cutting. Your caterer knows when to start plating food.</p>

        <p>Guests also appreciate knowing what to expect. See dinner service starting and they know to grab a seat. Hear the DJ announce the last dance and they know the night is ending soon. A timeline makes your reception feel organized without being stiff.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What Happens When You Wing Your Reception</h2>

        <p>Without a plan, things drag on too long or get skipped entirely. Toasts run for 30 minutes when they should take 10. Or you forget about cake cutting until the end of the night when half your guests already left.</p>

        <p>Your reception also feels disjointed. Guests don't know if dinner is happening or if they should keep dancing. They're hungry but don't want to miss the first dance. Clear timing fixes this confusion.</p>

        <p>Vendors get frustrated when there's no schedule. Your photographer waits around not knowing when the next event happens. Your DJ fills dead air because no one told them what's next. Wastes time and makes your reception feel chaotic.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">How the Reception Timeline Generator Works</h2>

        <p>Start by entering when your reception begins. Usually after cocktail hour, so most receptions start around 6 or 7 PM. If your venue has specific timing, use that as your start time.</p>

        <p>Next, choose how long your reception will last. Most receptions run 4 to 5 hours. Shorter receptions feel rushed. Longer receptions mean paying your vendors for extra time and hoping guests stay late.</p>

        <p>The tool asks which events you want to include. Not every couple does bouquet toss or parent dances. Pick what matters to you, and the generator builds a timeline around those events.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Breaking Down Your Reception Events</h2>

        <p>Your grand entrance kicks things off. This is when you walk into your reception as a married couple. Keep it short, around 5 to 10 minutes. Guests are excited to see you, but they're also ready to eat and celebrate.</p>

        <p>First dance usually happens right after your entrance. Some couples do toasts first, but most want to dance while guests are still settling in. Gives your photographer a clear shot without people walking around.</p>

        <p>Toasts should be kept short. Plan for 15 to 20 minutes total. Have more than 3 people speaking and things drag on (trust me). Coordinate with your speakers ahead of time so they know to keep it brief.</p>

        <p>Dinner service takes about an hour. Plated meal? Service goes faster. Buffets take longer because guests line up. Your caterer can tell you how long service will take based on your guest count.</p>

        <p>Cake cutting happens after dinner. Quick photo op that takes 5 to 10 minutes. Some couples skip this entirely and just have staff cut the cake behind the scenes.</p>

        <p>Parent dances come next. Father-daughter and mother-son dances usually take 10 minutes combined. Want to invite all parents or skip this tradition? Adjust your timeline accordingly.</p>

        <p>Open dancing is the bulk of your reception. This is when guests hit the dance floor and have fun. Plan for at least 2 hours of open dancing. This is why people stay at weddings.</p>

        <p>Bouquet and garter toss are optional. Want to do them? Schedule them about 30 minutes before the end of your reception. Gives guests a heads-up that the night is winding down.</p>

        <p>Last dance and send-off close out your night. Your final moment with all your guests before you leave. Budget about 15 minutes for this.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Common Reception Timing Mistakes</h2>

        <p>Starting dinner too late makes guests cranky. Cocktail hour ends at 7 PM but dinner doesn't start until 8 PM? People get hungry. Schedule dinner service to start within 15 to 30 minutes of your grand entrance.</p>

        <p>Letting toasts run too long kills momentum. One long toast after another makes guests zone out. Set a time limit with your speakers ahead of time. Three toasts at 5 minutes each is plenty.</p>

        <p>Waiting too long to cut the cake means guests miss it. Schedule cake cutting at the very end of the night and half your guests will already be gone. Do it after dinner while everyone is still there.</p>

        <p>Not leaving enough time for dancing is a mistake. Pack too many formal events into your reception and dancing gets squeezed. Guests want to dance more than they want to watch you throw a bouquet.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Sharing Your Timeline with Vendors</h2>

        <p>Send your reception timeline to your DJ, photographer, videographer, and caterer at least 2 weeks before the wedding. They need to know when each event happens so they can prepare.</p>

        <p>Your DJ uses the timeline to plan music and make announcements. They'll cue your entrance song, first dance, and last dance based on your schedule. Timeline changes? Let them know right away.</p>

        <p>Your photographer needs the timeline to position themselves for key shots. If they know when cake cutting happens, they're ready with their camera. Surprises make them miss important moments.</p>

        <p>Your caterer coordinates dinner service with your timeline. Want dinner served right after toasts? They need to know that. Want a longer cocktail hour? They adjust their prep time.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">When to Adjust Your Reception Flow</h2>

        <p>Reception running behind? Skip optional events. Bouquet toss and garter toss can go. Cake cutting can be simplified. Focus on keeping dinner on schedule and giving guests plenty of dance time.</p>

        <p>If toasts are dragging on, your DJ or coordinator should step in. A polite signal to wrap up keeps things moving. Long speeches kill energy, and getting that energy back is hard.</p>

        <p>Weather can affect outdoor receptions. Planned an outdoor dinner and it rains? Your venue needs to shift everything inside. Have a backup timeline ready for weather delays.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Using Hunnimoon to Manage Your Reception</h2>

        <p>A reception timeline generator gets you started, but managing your entire wedding takes more. You need to track vendors, coordinate with your photographer, and keep your budget in check. That's where Hunnimoon helps.</p>

        <p>Hunnimoon keeps your vendor contacts and wedding schedule all in one place. You can share your timeline with vendors directly. Your partner can see everything too, so you're both on the same page.</p>

        <p>Instead of emailing vendors back and forth, you update your schedule once and everyone sees it. Try it free for 7 days to see if it fits your needs.</p>

        <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Tips for a Smooth Reception Flow</h2>

        <p>Don't overload the first hour. Try to fit your grand entrance, first dance, toasts, and dinner all into the first 60 minutes and it feels rushed. Spread events out so guests can enjoy each moment.</p>

        <p>Give guests a break between formal events. After toasts and dinner, let people digest and chat before jumping into parent dances. A 10-minute buffer keeps your reception from feeling like a checklist.</p>

        <p>End on a high note. Schedule your last dance when energy is still high. Wait until everyone is tired and your send-off feels flat. Most receptions peak around hour 3 or 4.</p>

        <p>Trust your vendors to manage the details. Timeline says cake cutting at 8:30 PM? Your DJ will cue you. You don't need to watch the clock all night. That's what your coordinator and vendors are for.</p>
      `,
      faqs: [
        {
          question: 'How long should a wedding reception last?',
          answer: 'Most receptions last 4 to 5 hours. This gives you enough time for dinner, toasts, dances, and plenty of open dancing. Shorter receptions feel rushed, and longer receptions mean paying vendors extra for overtime.'
        },
        {
          question: 'When should we do our first dance?',
          answer: 'Most couples do their first dance right after their grand entrance, before toasts or dinner. This gives your photographer a clear shot while guests are still settling in. Some couples wait until after dinner, but doing it early keeps momentum going.'
        },
        {
          question: 'How long should wedding toasts be?',
          answer: 'Keep toasts to 15 to 20 minutes total. If you have three speakers, that is about 5 minutes each. Longer toasts make guests lose interest, and getting energy back after long speeches is hard.'
        },
        {
          question: 'Do we have to do a bouquet and garter toss?',
          answer: 'No, bouquet and garter toss are optional. Many couples skip them. If you want to do them, schedule them about 30 minutes before the end of your reception. This signals to guests that the night is winding down.'
        },
        {
          question: 'What if our reception timeline gets off schedule?',
          answer: 'Stay flexible and cut optional events if needed. Skip bouquet toss or shorten open dancing. The important thing is keeping dinner on time and making sure guests have fun. Your coordinator can help adjust on the fly.'
        },
        {
          question: 'Should we share our timeline with the wedding party?',
          answer: 'Yes, give your wedding party a simplified version of your timeline. They don\'t need every detail, but they should know when key events happen like toasts, dances, and cake cutting. This keeps everyone prepared.'
        },
        {
          question: 'How does Hunnimoon help with reception planning?',
          answer: 'Hunnimoon keeps your reception timeline, vendor contacts, and schedule all in one place. You can share updates with vendors instantly, and both you and your partner stay synced. Try it free for 7 days.'
        },
        {
          question: 'When should dinner service start at a wedding reception?',
          answer: 'Start dinner service within 15 to 30 minutes of your grand entrance. If your reception starts at 6 PM, aim to have dinner served by 6:30 PM. Waiting too long makes guests hungry and cranky.'
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
