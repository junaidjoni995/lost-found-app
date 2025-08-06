"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Package, Filter } from "lucide-react"
import Image from "next/image"

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

export default function BrowsePage() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, selectedCategory, selectedType])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items")
      const data = await response.json()
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType)
    }

    setFilteredItems(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Search className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
            </Link>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search items, locations, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Item Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lost">Lost Items</SelectItem>
                <SelectItem value="found">Found Items</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredItems.length} {filteredItems.length === 1 ? "Item" : "Items"} Found
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            Showing {selectedType === "all" ? "all" : selectedType} items
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
            <Link href="/auth/register">
              <Button>Sign up to post items</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={item.type === "lost" ? "destructive" : "default"}>{item.type.toUpperCase()}</Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.image_url && (
                    <div className="mb-4">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}

                  <CardDescription className="mb-4 line-clamp-3">{item.description}</CardDescription>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {item.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(item.date_occurred).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Posted by {item.user_name} on {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Link href={`/item/${item.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
