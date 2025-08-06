"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send } from "lucide-react"

interface ContactFormProps {
  itemId: number
  receiverId: number
  itemTitle: string
}

export default function ContactForm({ itemId, receiverId, itemTitle }: ContactFormProps) {
  const [formData, setFormData] = useState({
    subject: `Regarding: ${itemTitle}`,
    message: "",
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          receiverId,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData((prev) => ({ ...prev, message: "" }))
      } else {
        setError(data.error || "Failed to send message")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Alert>
        <AlertDescription>Your message has been sent successfully! The owner will be notified.</AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Hi, I think I found your item / I lost a similar item..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        <Send className="h-4 w-4 mr-2" />
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
