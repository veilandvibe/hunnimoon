export function getSideLabel(
  side: 'Bride' | 'Groom' | 'Both' | 'Unknown',
  wedding?: { 
    partner1_name?: string
    partner2_name?: string
  }
): string {
  // Fallback defaults
  const defaults = {
    Bride: "Bride's side",
    Groom: "Groom's side",
    Both: "Both sides",
    Unknown: "Unknown"
  }
  
  if (!wedding) return defaults[side]
  
  // Generate labels from partner names
  if (side === 'Bride' && wedding.partner1_name) {
    return `${wedding.partner1_name}'s side`
  }
  if (side === 'Groom' && wedding.partner2_name) {
    return `${wedding.partner2_name}'s side`
  }
  
  return defaults[side]
}
