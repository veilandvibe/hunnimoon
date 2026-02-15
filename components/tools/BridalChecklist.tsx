'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Copy, Download, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface ChecklistItem {
  text: string
  category?: 'do' | 'buy' | 'schedule' | 'confirm'
}

interface ChecklistSection {
  title: string
  items: ChecklistItem[]
}

type WeddingType = 'traditional' | 'intimate' | 'micro'
type PlanningDepth = 'simple' | 'detailed' | 'everything'

export default function BridalChecklist() {
  const [weddingDate, setWeddingDate] = useState('')
  const [weddingType, setWeddingType] = useState<WeddingType>('traditional')
  const [planningDepth, setPlanningDepth] = useState<PlanningDepth>('detailed')
  
  // Outfit & Beauty checkboxes
  const [traditionalGown, setTraditionalGown] = useState(false)
  const [multipleOutfits, setMultipleOutfits] = useState(false)
  const [veilAccessory, setVeilAccessory] = useState(false)
  const [shapewear, setShapewear] = useState(false)
  const [professionalHair, setProfessionalHair] = useState(false)
  const [professionalMakeup, setProfessionalMakeup] = useState(false)
  const [ownHair, setOwnHair] = useState(false)
  const [ownMakeup, setOwnMakeup] = useState(false)
  const [hairTrial, setHairTrial] = useState(false)
  const [makeupTrial, setMakeupTrial] = useState(false)
  const [nails, setNails] = useState(false)
  const [lashes, setLashes] = useState(false)
  const [brows, setBrows] = useState(false)
  const [skinPrep, setSkinPrep] = useState(false)
  const [jewelry, setJewelry] = useState(false)
  const [backupShoes, setBackupShoes] = useState(false)
  const [gettingReadyOutfit, setGettingReadyOutfit] = useState(false)
  
  // Personal Planning checkboxes
  const [personalVows, setPersonalVows] = useState(false)
  const [bridalShower, setBridalShower] = useState(false)
  const [bachelorette, setBachelorette] = useState(false)
  const [traveling, setTraveling] = useState(false)
  const [honeymoon, setHoneymoon] = useState(false)
  const [emotionalCare, setEmotionalCare] = useState(false)
  const [purchaseTracking, setPurchaseTracking] = useState(false)
  
  const [generatedChecklist, setGeneratedChecklist] = useState<ChecklistSection[] | null>(null)

  const calculateDaysUntilWedding = (date: string): number => {
    const wedding = new Date(date)
    const today = new Date()
    const diff = wedding.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  const generateChecklist = () => {
    if (!weddingDate) {
      toast.error('Please select your wedding date')
      return
    }

    const daysUntil = calculateDaysUntilWedding(weddingDate)
    const sections: ChecklistSection[] = []
    const isMicro = weddingType === 'micro'

    // Determine timeline structure based on days until wedding
    if (daysUntil > 365) {
      // More than 12 months - Full timeline
      generateFullTimeline(sections, isMicro)
    } else if (daysUntil >= 180) {
      // 6-12 months
      generateMediumTimeline(sections, isMicro)
    } else if (daysUntil >= 60) {
      // 2-6 months
      generateShortTimeline(sections, isMicro)
    } else {
      // Less than 2 months - Urgent
      generateUrgentTimeline(sections, isMicro)
    }

    // Add purchase tracking if selected
    if (purchaseTracking) {
      addPurchaseTracking(sections)
    }

    setGeneratedChecklist(sections)
    toast.success('Your personal bridal checklist is ready!')
  }

  const generateFullTimeline = (sections: ChecklistSection[], isMicro: boolean) => {
    // RIGHT NOW
    const rightNow: ChecklistItem[] = [
      { text: 'Decide overall bridal look direction', category: 'do' },
      { text: 'Create inspiration folder', category: 'do' },
      { text: 'Research dress styles', category: 'do' },
    ]
    
    if (traditionalGown || planningDepth === 'everything') {
      rightNow.push({ text: 'Book dress shopping appointments', category: 'schedule' })
    }
    
    if (planningDepth === 'everything') {
      rightNow.push({ text: 'Appointment dates added to calendar', category: 'confirm' })
    }
    
    sections.push({ title: 'Right Now', items: rightNow })

    // 9-12 MONTHS BEFORE
    const months9to12: ChecklistItem[] = []
    
    if (traditionalGown) {
      months9to12.push(
        { text: 'Choose wedding dress', category: 'do' },
        { text: 'Wedding dress', category: 'buy' }
      )
    }
    
    if (veilAccessory) {
      months9to12.push(
        { text: 'Choose veil or hair accessory', category: 'do' },
        { text: 'Veil or hair accessory', category: 'buy' }
      )
    }
    
    if (planningDepth === 'detailed' || planningDepth === 'everything') {
      months9to12.push(
        { text: 'Choose shoes', category: 'do' },
        { text: 'Shoes', category: 'buy' }
      )
    }
    
    if (jewelry) {
      months9to12.push({ text: 'Decide jewelry', category: 'do' }, { text: 'Jewelry', category: 'buy' })
    }
    
    if (professionalHair || planningDepth === 'everything') {
      months9to12.push(
        { text: 'Choose hairstyle direction', category: 'do' },
        { text: 'Book hair stylist', category: 'schedule' }
      )
    }
    
    if (professionalMakeup || planningDepth === 'everything') {
      months9to12.push(
        { text: 'Choose makeup direction', category: 'do' },
        { text: 'Book makeup artist', category: 'schedule' }
      )
    }
    
    if (traditionalGown) {
      months9to12.push(
        { text: 'Dress measurement appointment', category: 'schedule' },
        { text: 'Dress production timeline', category: 'confirm' }
      )
    }
    
    sections.push({ title: '9–12 Months Before', items: months9to12 })

    // 6-9 MONTHS BEFORE
    const months6to9: ChecklistItem[] = []
    
    if (multipleOutfits) {
      months6to9.push(
        { text: 'Plan reception outfit', category: 'do' },
        { text: 'Reception outfit', category: 'buy' }
      )
    }
    
    if (gettingReadyOutfit || planningDepth === 'everything') {
      months6to9.push(
        { text: 'Choose getting-ready outfit', category: 'do' },
        { text: 'Bridal robe or getting-ready outfit', category: 'buy' }
      )
    }
    
    if (shapewear || planningDepth === 'detailed' || planningDepth === 'everything') {
      months6to9.push(
        { text: 'Decide undergarments', category: 'do' },
        { text: 'Undergarments and shapewear', category: 'buy' }
      )
    }
    
    if (personalVows) {
      months6to9.push({ text: 'Begin vow draft', category: 'do' })
    }
    
    if (backupShoes || planningDepth === 'everything') {
      months6to9.push({ text: 'Backup flats or comfort shoes', category: 'buy' })
    }
    
    if (hairTrial || (professionalHair && planningDepth !== 'simple')) {
      months6to9.push(
        { text: 'Hair trial', category: 'schedule' },
        { text: 'Trial date confirmed', category: 'confirm' }
      )
    }
    
    if (makeupTrial || (professionalMakeup && planningDepth !== 'simple')) {
      months6to9.push(
        { text: 'Makeup trial', category: 'schedule' },
        { text: 'Trial date confirmed', category: 'confirm' }
      )
    }
    
    if (traditionalGown) {
      months6to9.push(
        { text: 'Alteration appointment', category: 'schedule' },
        { text: 'Alteration timeline', category: 'confirm' }
      )
    }
    
    sections.push({ title: '6–9 Months Before', items: months6to9 })

    // 3-6 MONTHS BEFORE
    const months3to6: ChecklistItem[] = []
    
    if (personalVows) {
      months3to6.push({ text: 'Finalize vows', category: 'do' })
    }
    
    if (traditionalGown && planningDepth !== 'simple') {
      months3to6.push(
        { text: 'Practice walking in shoes', category: 'do' },
        { text: 'Learn bustle mechanism', category: 'do' }
      )
    }
    
    if (planningDepth === 'detailed' || planningDepth === 'everything') {
      months3to6.push({ text: 'Plan emergency kit contents', category: 'do' })
    }
    
    if (planningDepth !== 'simple') {
      months3to6.push(
        { text: 'Touch-up makeup', category: 'buy' },
        { text: 'Fashion tape', category: 'buy' },
        { text: 'Stain remover pen', category: 'buy' },
        { text: 'Band-aids', category: 'buy' },
        { text: 'Mini sewing kit', category: 'buy' },
        { text: 'Deodorant', category: 'buy' },
        { text: 'Blotting papers', category: 'buy' },
        { text: 'Breath mints', category: 'buy' }
      )
    }
    
    if (traditionalGown) {
      months3to6.push({ text: 'Final fitting', category: 'schedule' })
    }
    
    if (nails) {
      months3to6.push({ text: 'Nail appointment', category: 'schedule' })
    }
    
    if (lashes || brows) {
      months3to6.push({ text: 'Lash and/or brow appointment', category: 'schedule' })
    }
    
    if (skinPrep && planningDepth === 'everything') {
      months3to6.push({ text: 'Spray tan (optional)', category: 'schedule' })
    }
    
    if (traditionalGown) {
      months3to6.push(
        { text: 'Dress pickup date', category: 'confirm' },
        { text: 'Beauty appointment times', category: 'confirm' }
      )
    }
    
    sections.push({ title: '3–6 Months Before', items: months3to6 })

    // 1-3 MONTHS BEFORE
    const months1to3: ChecklistItem[] = []
    
    if (!isMicro && (bridalShower || planningDepth === 'everything')) {
      months1to3.push(
        { text: 'Choose shower outfit', category: 'do' },
        { text: 'Track shower purchases', category: 'do' },
        { text: 'Confirm shower date', category: 'confirm' }
      )
    }
    
    if (!isMicro && (bachelorette || planningDepth === 'everything')) {
      months1to3.push(
        { text: 'Choose bachelorette outfit', category: 'do' },
        { text: 'Confirm bachelorette travel', category: 'confirm' },
        { text: 'Pack bachelorette event items', category: 'do' }
      )
    }
    
    if (planningDepth !== 'simple') {
      months1to3.push(
        { text: 'Pack day-of bag', category: 'do' },
        { text: 'Delegate items to bridesmaid or family', category: 'do' }
      )
    }
    
    if (personalVows) {
      months1to3.push({ text: 'Print vow card', category: 'do' })
    }
    
    if (honeymoon) {
      months1to3.push({ text: 'Pack honeymoon bag', category: 'do' })
    }
    
    if (professionalHair) {
      months1to3.push({ text: 'Hair stylist arrival time', category: 'confirm' })
    }
    
    if (professionalMakeup) {
      months1to3.push({ text: 'Makeup artist arrival time', category: 'confirm' })
    }
    
    if (planningDepth !== 'simple') {
      months1to3.push(
        { text: 'Getting-ready location address', category: 'confirm' },
        { text: 'Transportation time', category: 'confirm' }
      )
    }
    
    if (traditionalGown) {
      months1to3.push({ text: 'Dress pickup confirmation', category: 'confirm' })
    }
    
    sections.push({ title: '1–3 Months Before', items: months1to3 })

    // FINAL MONTH
    const finalMonth: ChecklistItem[] = []
    
    if (traditionalGown) {
      finalMonth.push({ text: 'Final dress fitting', category: 'do' })
    }
    
    if (planningDepth !== 'simple') {
      finalMonth.push(
        { text: 'Break in shoes fully', category: 'do' },
        { text: 'Prepare accessory layout', category: 'do' },
        { text: 'Prepare wedding morning timeline', category: 'do' }
      )
    }
    
    if (traditionalGown) {
      finalMonth.push({ text: 'Alterations complete', category: 'confirm' })
    }
    
    if (professionalHair || professionalMakeup) {
      finalMonth.push({ text: 'Beauty confirmations', category: 'confirm' })
    }
    
    if (traveling || planningDepth === 'everything') {
      finalMonth.push({ text: 'Transportation confirmations', category: 'confirm' })
    }
    
    sections.push({ title: 'Final Month', items: finalMonth })

    // FINAL WEEK
    const finalWeek: ChecklistItem[] = []
    
    if (traditionalGown) {
      finalWeek.push({ text: 'Steam dress (or confirm steaming)', category: 'do' })
    }
    
    if (jewelry || planningDepth !== 'simple') {
      finalWeek.push({ text: 'Lay out jewelry', category: 'do' })
    }
    
    finalWeek.push(
      { text: 'Pack rings', category: 'do' },
      { text: 'Hydrate', category: 'do' },
      { text: 'Sleep', category: 'do' }
    )
    
    if (emotionalCare) {
      finalWeek.push(
        { text: 'Block quiet time', category: 'do' },
        { text: 'Avoid adding new tasks', category: 'do' },
        { text: 'Let small imperfections go', category: 'do' }
      )
    }
    
    if (traveling) {
      finalWeek.push(
        { text: 'Confirm dress transport plan', category: 'confirm' },
        { text: 'Pack garment bag', category: 'do' },
        { text: 'Confirm airline carry-on policy', category: 'confirm' }
      )
    }
    
    if (honeymoon) {
      finalWeek.push(
        { text: 'Confirm honeymoon bookings', category: 'confirm' },
        { text: 'Print travel confirmations', category: 'do' },
        { text: 'Confirm passport validity', category: 'confirm' },
        { text: 'Pack travel documents', category: 'do' }
      )
    }
    
    sections.push({ title: 'Final Week', items: finalWeek })
  }

  const generateMediumTimeline = (sections: ChecklistSection[], isMicro: boolean) => {
    // RIGHT NOW
    const rightNow: ChecklistItem[] = [
      { text: 'Decide overall bridal look direction', category: 'do' },
      { text: 'Create inspiration folder', category: 'do' },
    ]
    
    if (traditionalGown) {
      rightNow.push(
        { text: 'Choose wedding dress', category: 'do' },
        { text: 'Wedding dress', category: 'buy' }
      )
    }
    
    sections.push({ title: 'Right Now', items: rightNow })

    // 6-9 MONTHS BEFORE
    const months6to9: ChecklistItem[] = []
    
    if (veilAccessory) {
      months6to9.push({ text: 'Veil or hair accessory', category: 'buy' })
    }
    
    if (planningDepth !== 'simple') {
      months6to9.push({ text: 'Shoes', category: 'buy' })
    }
    
    if (jewelry) {
      months6to9.push({ text: 'Jewelry', category: 'buy' })
    }
    
    if (professionalHair) {
      months6to9.push({ text: 'Book hair stylist', category: 'schedule' })
    }
    
    if (professionalMakeup) {
      months6to9.push({ text: 'Book makeup artist', category: 'schedule' })
    }
    
    if (multipleOutfits) {
      months6to9.push({ text: 'Reception outfit', category: 'buy' })
    }
    
    if (shapewear) {
      months6to9.push({ text: 'Undergarments and shapewear', category: 'buy' })
    }
    
    if (hairTrial && professionalHair) {
      months6to9.push({ text: 'Hair trial', category: 'schedule' })
    }
    
    if (makeupTrial && professionalMakeup) {
      months6to9.push({ text: 'Makeup trial', category: 'schedule' })
    }
    
    if (traditionalGown) {
      months6to9.push({ text: 'Alteration appointment', category: 'schedule' })
    }
    
    sections.push({ title: '6–9 Months Before', items: months6to9 })

    // 3-6 MONTHS BEFORE
    const months3to6: ChecklistItem[] = []
    
    if (personalVows) {
      months3to6.push({ text: 'Finalize vows', category: 'do' })
    }
    
    if (planningDepth !== 'simple') {
      months3to6.push(
        { text: 'Touch-up makeup', category: 'buy' },
        { text: 'Fashion tape', category: 'buy' },
        { text: 'Stain remover pen', category: 'buy' },
        { text: 'Emergency kit supplies', category: 'buy' }
      )
    }
    
    if (traditionalGown) {
      months3to6.push({ text: 'Final fitting', category: 'schedule' })
    }
    
    if (nails) {
      months3to6.push({ text: 'Nail appointment', category: 'schedule' })
    }
    
    if (lashes || brows) {
      months3to6.push({ text: 'Lash/brow appointment', category: 'schedule' })
    }
    
    sections.push({ title: '3–6 Months Before', items: months3to6 })

    // 1-3 MONTHS BEFORE
    const months1to3: ChecklistItem[] = []
    
    if (planningDepth !== 'simple') {
      months1to3.push({ text: 'Pack day-of bag', category: 'do' })
    }
    
    if (personalVows) {
      months1to3.push({ text: 'Print vow card', category: 'do' })
    }
    
    if (professionalHair || professionalMakeup) {
      months1to3.push({ text: 'Beauty arrival times', category: 'confirm' })
    }
    
    if (traditionalGown) {
      months1to3.push({ text: 'Dress pickup confirmation', category: 'confirm' })
    }
    
    sections.push({ title: '1–3 Months Before', items: months1to3 })

    // FINAL MONTH
    const finalMonth: ChecklistItem[] = []
    
    if (traditionalGown) {
      finalMonth.push(
        { text: 'Final dress fitting', category: 'do' },
        { text: 'Break in shoes fully', category: 'do' }
      )
    }
    
    if (planningDepth !== 'simple') {
      finalMonth.push({ text: 'Prepare accessory layout', category: 'do' })
    }
    
    finalMonth.push({ text: 'Beauty and vendor confirmations', category: 'confirm' })
    
    sections.push({ title: 'Final Month', items: finalMonth })

    // FINAL WEEK
    const finalWeek: ChecklistItem[] = []
    
    if (traditionalGown) {
      finalWeek.push({ text: 'Steam dress', category: 'do' })
    }
    
    finalWeek.push(
      { text: 'Lay out jewelry and accessories', category: 'do' },
      { text: 'Pack rings', category: 'do' },
      { text: 'Hydrate and rest', category: 'do' }
    )
    
    if (emotionalCare) {
      finalWeek.push({ text: 'Block quiet time and breathe', category: 'do' })
    }
    
    if (traveling) {
      finalWeek.push(
        { text: 'Confirm dress transport', category: 'confirm' },
        { text: 'Pack garment bag', category: 'do' }
      )
    }
    
    if (honeymoon) {
      finalWeek.push(
        { text: 'Confirm honeymoon bookings', category: 'confirm' },
        { text: 'Pack travel documents', category: 'do' }
      )
    }
    
    sections.push({ title: 'Final Week', items: finalWeek })
  }

  const generateShortTimeline = (sections: ChecklistSection[], isMicro: boolean) => {
    // IMMEDIATE PRIORITIES
    const immediate: ChecklistItem[] = []
    
    if (traditionalGown) {
      immediate.push(
        { text: 'Finalize dress choice if not done', category: 'do' },
        { text: 'Schedule urgent alterations', category: 'schedule' }
      )
    }
    
    if (professionalHair && !hairTrial) {
      immediate.push({ text: 'Book hair stylist NOW', category: 'schedule' })
    }
    
    if (professionalMakeup && !makeupTrial) {
      immediate.push({ text: 'Book makeup artist NOW', category: 'schedule' })
    }
    
    if (planningDepth !== 'simple') {
      immediate.push(
        { text: 'Shoes', category: 'buy' },
        { text: 'Undergarments', category: 'buy' },
        { text: 'Emergency kit supplies', category: 'buy' }
      )
    }
    
    if (veilAccessory) {
      immediate.push({ text: 'Veil or hair accessory', category: 'buy' })
    }
    
    if (jewelry) {
      immediate.push({ text: 'Jewelry', category: 'buy' })
    }
    
    sections.push({ title: 'Immediate Priorities', items: immediate })

    // NEXT 30 DAYS
    const next30: ChecklistItem[] = []
    
    if (personalVows) {
      next30.push({ text: 'Finalize vows', category: 'do' })
    }
    
    if (nails) {
      next30.push({ text: 'Schedule nail appointment', category: 'schedule' })
    }
    
    if (lashes || brows) {
      next30.push({ text: 'Schedule lash/brow appointment', category: 'schedule' })
    }
    
    if (traditionalGown) {
      next30.push(
        { text: 'Break in shoes daily', category: 'do' },
        { text: 'Learn bustle', category: 'do' }
      )
    }
    
    if (planningDepth !== 'simple') {
      next30.push({ text: 'Pack day-of bag', category: 'do' })
    }
    
    if (professionalHair || professionalMakeup) {
      next30.push({ text: 'Confirm beauty arrival times', category: 'confirm' })
    }
    
    sections.push({ title: 'Next 30 Days', items: next30 })

    // FINAL MONTH
    const finalMonth: ChecklistItem[] = []
    
    if (traditionalGown) {
      finalMonth.push(
        { text: 'Final fitting', category: 'schedule' },
        { text: 'Confirm dress pickup', category: 'confirm' }
      )
    }
    
    if (planningDepth !== 'simple') {
      finalMonth.push({ text: 'Prepare accessory layout', category: 'do' })
    }
    
    finalMonth.push({ text: 'All vendor confirmations', category: 'confirm' })
    
    if (traveling) {
      finalMonth.push({ text: 'Confirm dress transport plan', category: 'confirm' })
    }
    
    if (honeymoon) {
      finalMonth.push({ text: 'Confirm honeymoon bookings', category: 'confirm' })
    }
    
    sections.push({ title: 'Final Month', items: finalMonth })

    // FINAL WEEK
    const finalWeek: ChecklistItem[] = []
    
    if (traditionalGown) {
      finalWeek.push({ text: 'Steam dress', category: 'do' })
    }
    
    finalWeek.push(
      { text: 'Lay out all accessories', category: 'do' },
      { text: 'Pack rings', category: 'do' },
      { text: 'Hydrate and sleep', category: 'do' }
    )
    
    if (emotionalCare) {
      finalWeek.push({ text: 'Block quiet time - you need it', category: 'do' })
    }
    
    sections.push({ title: 'Final Week', items: finalWeek })
  }

  const generateUrgentTimeline = (sections: ChecklistSection[], isMicro: boolean) => {
    // URGENT NOW
    const urgentNow: ChecklistItem[] = []
    
    if (traditionalGown) {
      urgentNow.push({ text: 'Rush alterations if needed', category: 'schedule' })
    }
    
    if (professionalHair) {
      urgentNow.push({ text: 'Confirm hair stylist availability', category: 'confirm' })
    }
    
    if (professionalMakeup) {
      urgentNow.push({ text: 'Confirm makeup artist availability', category: 'confirm' })
    }
    
    urgentNow.push(
      { text: 'Buy any missing accessories NOW', category: 'buy' },
      { text: 'Emergency kit supplies', category: 'buy' }
    )
    
    if (ownHair) {
      urgentNow.push({ text: 'Practice hair style', category: 'do' })
    }
    
    if (ownMakeup) {
      urgentNow.push({ text: 'Do makeup trial run', category: 'do' })
    }
    
    sections.push({ title: 'Urgent Now', items: urgentNow })

    // NEXT 2 WEEKS
    const next2Weeks: ChecklistItem[] = []
    
    if (traditionalGown) {
      next2Weeks.push(
        { text: 'Break in shoes every day', category: 'do' },
        { text: 'Practice walking in dress', category: 'do' }
      )
    }
    
    next2Weeks.push({ text: 'Pack day-of bag', category: 'do' })
    
    if (personalVows) {
      next2Weeks.push({ text: 'Print vow card', category: 'do' })
    }
    
    if (nails) {
      next2Weeks.push({ text: 'Schedule nails', category: 'schedule' })
    }
    
    next2Weeks.push({ text: 'Confirm all vendor times', category: 'confirm' })
    
    sections.push({ title: 'Next 2 Weeks', items: next2Weeks })

    // FINAL WEEK
    const finalWeek: ChecklistItem[] = []
    
    if (traditionalGown) {
      finalWeek.push({ text: 'Steam or press dress', category: 'do' })
    }
    
    finalWeek.push(
      { text: 'Lay out everything you need', category: 'do' },
      { text: 'Pack rings', category: 'do' },
      { text: 'Hydrate constantly', category: 'do' },
      { text: 'Sleep as much as possible', category: 'do' }
    )
    
    if (emotionalCare) {
      finalWeek.push({ text: 'Take deep breaths - you\'ve got this', category: 'do' })
    }
    
    if (traveling) {
      finalWeek.push({ text: 'Confirm dress is packed carefully', category: 'confirm' })
    }
    
    sections.push({ title: 'Final Week', items: finalWeek })
  }

  const addPurchaseTracking = (sections: ChecklistSection[]) => {
    const purchases: ChecklistItem[] = [
      { text: 'Dress' },
      { text: 'Alterations' },
      { text: 'Shoes' },
      { text: 'Veil / headpiece' },
      { text: 'Jewelry' },
      { text: 'Undergarments' },
    ]
    
    if (multipleOutfits) {
      purchases.push({ text: 'Reception outfit' })
    }
    
    if (hairTrial) {
      purchases.push({ text: 'Hair trial' })
    }
    
    if (makeupTrial) {
      purchases.push({ text: 'Makeup trial' })
    }
    
    if (nails || lashes || brows) {
      purchases.push({ text: 'Nails / beauty appointments' })
    }
    
    purchases.push(
      { text: 'Emergency kit supplies' },
      { text: 'Travel items' }
    )
    
    sections.push({ title: 'Bridal Purchases to Track', items: purchases })
  }

  const handleCopyChecklist = () => {
    if (!generatedChecklist) return

    let text = 'Your Personal Bridal Checklist\n\n'
    
    generatedChecklist.forEach(section => {
      text += `${section.title}\n`
      section.items.forEach(item => {
        text += `☐ ${item.text}\n`
      })
      text += '\n'
    })
    
    text += 'Created with Hunnimoon'

    navigator.clipboard.writeText(text)
    toast.success('Checklist copied to clipboard!')
  }

  const handleDownloadPDF = () => {
    if (!generatedChecklist) return

    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126)
    doc.text('Your Personal Bridal Checklist', 20, 25)
    
    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const weddingDateFormatted = new Date(weddingDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const weddingTypeLabel = weddingType === 'micro' ? 'Micro Wedding/Elopement' : 
                            weddingType === 'intimate' ? 'Intimate Wedding' : 
                            'Traditional Wedding'
    doc.text(`${weddingTypeLabel} | ${weddingDateFormatted}`, 20, 33)
    
    let y = 50
    
    generatedChecklist.forEach(section => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      
      // Section title
      doc.setFontSize(14)
      doc.setTextColor(212, 71, 126)
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, 20, y)
      y += 8
      
      // Items
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.setFont('helvetica', 'normal')
      
      section.items.forEach(item => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        
        // Checkbox
        doc.rect(20, y - 3, 3, 3)
        
        // Item text
        const lines = doc.splitTextToSize(item.text, 165)
        doc.text(lines, 26, y)
        y += lines.length * 5
      })
      
      y += 5 // Space between sections
    })
    
    // Footer on all pages
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Created with Hunnimoon', 105, 285, { align: 'center' })
    }
    
    doc.save('bridal-checklist.pdf')
    toast.success('PDF downloaded!')
  }

  const handleReset = () => {
    setWeddingDate('')
    setWeddingType('traditional')
    setPlanningDepth('detailed')
    setTraditionalGown(false)
    setMultipleOutfits(false)
    setVeilAccessory(false)
    setShapewear(false)
    setProfessionalHair(false)
    setProfessionalMakeup(false)
    setOwnHair(false)
    setOwnMakeup(false)
    setHairTrial(false)
    setMakeupTrial(false)
    setNails(false)
    setLashes(false)
    setBrows(false)
    setSkinPrep(false)
    setJewelry(false)
    setBackupShoes(false)
    setGettingReadyOutfit(false)
    setPersonalVows(false)
    setBridalShower(false)
    setBachelorette(false)
    setTraveling(false)
    setHoneymoon(false)
    setEmotionalCare(false)
    setPurchaseTracking(false)
    setGeneratedChecklist(null)
    toast.success('Form reset')
  }

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-pink-light rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-pink-primary mb-6">
          Create Your Personal Bridal Checklist
        </h2>

        {/* Section 1: Wedding Date */}
        <div>
          <label className="block text-sm font-semibold text-pink-primary mb-2">
            Wedding Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="w-full px-4 py-3 border-2 border-pink-primary/20 rounded-xl focus:border-pink-primary focus:outline-none text-pink-primary"
              style={{
                minHeight: '48px',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                colorScheme: 'light'
              }}
            />
            {!weddingDate && (
              <div className="absolute inset-0 flex items-center px-4 pointer-events-none hidden sm:flex">
                <span className="text-pink-primary/40 text-base">YYYY-MM-DD</span>
              </div>
            )}
          </div>
          <p className="text-xs text-pink-primary/60 mt-1">
            We'll calculate the right timeline based on your date
          </p>
        </div>

        {/* Section 2: Wedding Type */}
        <div>
          <Select
            label="Wedding Type"
            value={weddingType}
            onChange={(e) => setWeddingType(e.target.value as WeddingType)}
            options={[
              { value: 'traditional', label: 'Traditional wedding' },
              { value: 'intimate', label: 'Intimate wedding (20-50 guests)' },
              { value: 'micro', label: 'Micro wedding/Elopement (under 20 guests)' }
            ]}
          />
        </div>

        {/* Section 3: Planning Depth */}
        <div>
          <Select
            label="Planning Depth"
            value={planningDepth}
            onChange={(e) => setPlanningDepth(e.target.value as PlanningDepth)}
            options={[
              { value: 'simple', label: 'Simple essentials' },
              { value: 'detailed', label: 'Detailed checklist' },
              { value: 'everything', label: 'Everything included' }
            ]}
          />
        </div>

        {/* Section 4: Outfit & Beauty */}
        <div>
          <label className="block text-sm font-semibold text-pink-primary mb-3">
            Outfit & Beauty
          </label>
          <div className="space-y-3">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={traditionalGown}
                onChange={(e) => setTraditionalGown(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm wearing a traditional gown</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={multipleOutfits}
                onChange={(e) => setMultipleOutfits(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I have multiple outfits (ceremony + reception)</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={veilAccessory}
                onChange={(e) => setVeilAccessory(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm wearing a veil or hair accessory</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={shapewear}
                onChange={(e) => setShapewear(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I need shapewear/undergarments</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={professionalHair}
                onChange={(e) => setProfessionalHair(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want professional hair</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={professionalMakeup}
                onChange={(e) => setProfessionalMakeup(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want professional makeup</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={ownHair}
                onChange={(e) => setOwnHair(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm doing my own hair</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={ownMakeup}
                onChange={(e) => setOwnMakeup(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm doing my own makeup</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={hairTrial}
                onChange={(e) => setHairTrial(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want hair trial</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={makeupTrial}
                onChange={(e) => setMakeupTrial(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want makeup trial</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={nails}
                onChange={(e) => setNails(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm getting nails done</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={lashes}
                onChange={(e) => setLashes(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm getting lashes done</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={brows}
                onChange={(e) => setBrows(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm getting brows done</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={skinPrep}
                onChange={(e) => setSkinPrep(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm doing skin prep leading up</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={jewelry}
                onChange={(e) => setJewelry(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm wearing special jewelry</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={backupShoes}
                onChange={(e) => setBackupShoes(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I need backup shoes</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={gettingReadyOutfit}
                onChange={(e) => setGettingReadyOutfit(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want a getting-ready outfit</span>
            </label>
          </div>
        </div>

        {/* Section 5: Personal Planning */}
        <div>
          <label className="block text-sm font-semibold text-pink-primary mb-3">
            Personal Planning
          </label>
          <div className="space-y-3">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={personalVows}
                onChange={(e) => setPersonalVows(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm writing personal vows</span>
            </label>
            
            {weddingType !== 'micro' && (
              <>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bridalShower}
                    onChange={(e) => setBridalShower(e.target.checked)}
                    className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
                  />
                  <span className="ml-3 text-pink-primary">I'm planning my own bridal shower</span>
                </label>
                
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bachelorette}
                    onChange={(e) => setBachelorette(e.target.checked)}
                    className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
                  />
                  <span className="ml-3 text-pink-primary">I'm planning my own bachelorette</span>
                </label>
              </>
            )}
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={traveling}
                onChange={(e) => setTraveling(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I'm traveling for my wedding</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={honeymoon}
                onChange={(e) => setHoneymoon(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want honeymoon reminders included</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={emotionalCare}
                onChange={(e) => setEmotionalCare(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want emotional/self-care reminders</span>
            </label>
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={purchaseTracking}
                onChange={(e) => setPurchaseTracking(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-primary border-pink-primary/30 rounded focus:ring-pink-primary"
              />
              <span className="ml-3 text-pink-primary">I want a purchase tracking section</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateChecklist}
          size="lg"
          fullWidth
        >
          Generate My Bridal Checklist
        </Button>
      </div>

      {/* Generated Checklist Output */}
      {generatedChecklist && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-pink-primary">
              Your Personal Bridal Checklist
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopyChecklist}
                className="p-2 text-pink-primary hover:bg-pink-light rounded-lg transition-colors"
                title="Copy Checklist"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={handleDownloadPDF}
                className="p-2 text-pink-primary hover:bg-pink-light rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-pink-primary hover:bg-pink-light rounded-lg transition-colors"
                title="Reset"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {generatedChecklist.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xl font-bold text-pink-primary mb-4">
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-3">
                      <div className="mt-1 w-4 h-4 border-2 border-pink-primary/30 rounded flex-shrink-0"></div>
                      <span className="text-pink-primary/80">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
