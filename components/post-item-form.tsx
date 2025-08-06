"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const categories = [
  "Electronics",
  "Personal Items",
  "Clothing",
  "Jewelry",
  "Documents",
  "Keys",
  "Pets",
  "Sports Equipment",
  "Books",
  "Other",
]

interface PostItemFormProps {
  type: "lost" | "found"
}

export default function PostItemForm({ type }: PostItemFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date_occurred: "",
    image_url: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

    if (!formData.category) {
      setError("Please select a category")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/items/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError(data.error || "Failed to create post")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{type} Item Details</CardTitle>
        <CardDescription>Fill out the form below to post your {type} item.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Item Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={`What ${type === "lost" ? "did you lose" : "did you find"}?`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description including color, size, brand, distinctive features..."
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_occurred">Date {type === "lost" ? "Lost" : "Found"} *</Label>
              <Input
                id="date_occurred"
                name="date_occurred"
                type="date"
                value={formData.date_occurred}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={`Where ${type === "lost" ? "did you lose it" : "did you find it"}? (e.g., Central Park, NYC)`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500">
              Add a photo to help with identification. You can upload to any image hosting service and paste the URL
              here.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Posting..." : `Post ${type.charAt(0).toUpperCase() + type.slice(1)} Item`}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
