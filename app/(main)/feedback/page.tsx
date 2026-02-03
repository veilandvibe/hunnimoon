'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useWedding } from '@/components/providers/WeddingProvider'
import db from '@/lib/instant'
import { MessageSquare, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const categoryOptions = [
  { value: '', label: 'Select a category' },
  { value: 'general', label: 'General Message' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
]

export default function FeedbackPage() {
  const { user } = db.useAuth()
  const { wedding } = useWedding()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill user data
  useEffect(() => {
    if (user && wedding) {
      setFormData(prev => ({
        ...prev,
        name: wedding.partner1_name || '',
        email: user.email || '',
      }))
    }
  }, [user, wedding])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields are filled
    if (!formData.name || !formData.email || !formData.category || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      
      const response = await fetch('/api/emails/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          category: formData.category,
          message: formData.message,
          userId: user?.id,
          weddingId: wedding?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send feedback')
      }

      toast.success("Thanks for your feedback! We'll review it soon.")
      
      // Reset message and category, keep name and email
      setFormData(prev => ({
        ...prev,
        category: '',
        message: '',
      }))
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to send feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
          Feedback
        </h1>
        <p className="text-pink-primary/60 mt-1">
          Got ideas to make Hunnimoon even better? Let us know!
        </p>
      </div>

      {/* Feedback Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} className="text-pink-primary" />
            </div>
            <h2 className="text-xl font-black text-pink-primary">
              Share Your Thoughts
            </h2>
          </div>

          <Input
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
          />

          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            disabled
            placeholder="your.email@example.com"
          />

          <Select
            label="Category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categoryOptions}
          />

          <Textarea
            label="Message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Share your thoughts..."
            rows={6}
          />

          <Button 
            type="submit" 
            fullWidth 
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Feedback'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
