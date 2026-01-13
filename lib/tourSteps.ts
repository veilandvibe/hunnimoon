export interface TourStep {
  target: string
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const tourSteps: Record<string, TourStep[]> = {
  dashboard: [
    {
      target: '[data-tour="countdown"]',
      title: 'Wedding Countdown',
      description: 'Your wedding countdown shows days, hours, and minutes remaining until your big day',
      position: 'bottom'
    },
    {
      target: '[data-tour="guest-metrics"]',
      title: 'Guest Metrics',
      description: 'Track total guests, invites sent, and projected attendance at a glance',
      position: 'bottom'
    },
    {
      target: '[data-tour="rsvp-chart"]',
      title: 'RSVP Chart',
      description: 'See who\'s attending, declined, or hasn\'t responded yet with this visual breakdown',
      position: 'bottom'
    },
    {
      target: '[data-tour="budget-overview"]',
      title: 'Budget Overview',
      description: 'Monitor your total budget, spending progress, and remaining funds in real-time',
      position: 'bottom'
    }
  ],

  guests: [
    {
      target: '[data-tour="add-guest"]',
      title: 'Add Guests',
      description: 'Add guests individually with the form or import your entire guest list from a CSV file',
      position: 'bottom'
    },
    {
      target: '[data-tour="household-info"]',
      title: 'Household Grouping',
      description: 'Group guests together as a household for better organization. Household members can RSVP together on your custom RSVP form',
      position: 'bottom'
    },
    {
      target: '[data-tour="search-filter"]',
      title: 'Search & Filter',
      description: 'Quickly find guests by searching their name or filter by side, RSVP status, or household',
      position: 'bottom'
    },
    {
      target: '[data-tour="view-toggle"]',
      title: 'View Options',
      description: 'Switch between compact list view for quick scanning or detailed card view for more information',
      position: 'bottom'
    },
    {
      target: '[data-tour="guest-actions"]',
      title: 'Guest Actions',
      description: 'Click the eye icon to view guest details, pencil to edit their information, or trash to remove them',
      position: 'left'
    }
  ],

  'rsvp-manager': [
    {
      target: '[data-tour="rsvp-metrics"]',
      title: 'RSVP Overview',
      description: 'Quick view of your total responses - see how many guests have confirmed, declined, or are still pending at a glance',
      position: 'bottom'
    },
    {
      target: '[data-tour="rsvp-chart"]',
      title: 'RSVP Status Chart',
      description: 'Visual breakdown of your guest responses - watch your attendance numbers update automatically in real-time',
      position: 'right'
    },
    {
      target: '[data-tour="recent-rsvps"]',
      title: 'Recent RSVPs',
      description: 'See the latest guest responses as they come in - stay updated on who just responded to your invitation',
      position: 'left'
    },
    {
      target: '[data-tour="rsvp-link-section"]',
      title: 'Share Your RSVP Link',
      description: 'Share this unique link with guests so they can RSVP online. Guests can find their names and RSVP for themselves or their household. Their responses automatically update in your system - no manual entry needed!',
      position: 'bottom'
    },
    {
      target: '[data-tour="rsvp-settings"]',
      title: 'Customize Your Form',
      description: 'Customize what questions appear on your RSVP form including meal choices, dietary restrictions, song requests, shuttle needs, and more',
      position: 'bottom'
    }
  ],

  budget: [
    {
      target: '[data-tour="total-budget"]',
      title: 'Set Your Budget',
      description: 'Set your overall wedding budget here. This will be your baseline for tracking spending',
      position: 'bottom'
    },
    {
      target: '[data-tour="spending-metrics"]',
      title: 'Spending Metrics',
      description: 'Track allocated, spent, and remaining funds in real-time. The progress bar shows your spending at a glance',
      position: 'bottom'
    },
    {
      target: '[data-tour="add-category"]',
      title: 'Budget Categories',
      description: 'Add budget categories using our preset options (venue, catering, photography, etc.) or create custom categories',
      position: 'bottom'
    },
    {
      target: '[data-tour="budget-item"]',
      title: 'Track Payments',
      description: 'Mark items as paid to automatically update your spending totals. Edit budgeted amounts and actual costs as needed',
      position: 'left'
    }
  ],

  vendors: [
    {
      target: '[data-tour="add-vendor"]',
      title: 'Add Vendors',
      description: 'Store all your vendor contact information in one place - photographers, florists, caterers, venues, and more',
      position: 'bottom'
    },
    {
      target: '[data-tour="vendor-card"]',
      title: 'Vendor Details',
      description: 'Quick access to vendor details including contact name, email, phone, website, and notes. Edit or delete vendors anytime',
      position: 'left'
    }
  ],

  settings: [
    {
      target: '[data-tour="wedding-details"]',
      title: 'Wedding Details',
      description: 'Edit your wedding date, partner names, and RSVP link slug anytime',
      position: 'bottom'
    },
    {
      target: '[data-tour="retake-tour"]',
      title: 'Help & Support',
      description: 'Need a refresher? You can retake this onboarding tour anytime from here',
      position: 'bottom'
    }
  ]
}

// Helper function to get tour steps for a specific page
export function getTourSteps(pageName: string): TourStep[] | undefined {
  return tourSteps[pageName]
}
