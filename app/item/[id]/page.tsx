import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { itemQueries } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, User, Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react"
import ContactForm from "@/components/contact-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  const item = itemQueries.getById.get(Number.parseInt(id)) as any

  if (!item) {
    notFound()
  }

  const isOwner = user?.id === item.user_id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/browse" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Browse
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <Badge variant={item.type === "lost" ? "destructive" : "default"} className="text-sm">
                      {item.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                  </div>
                </div>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
                <CardDescription className="text-base">
                  {item.type === "lost" ? "Lost item reported" : "Found item reported"} on{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {item.image_url && (
                  <div>
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Date {item.type === "lost" ? "Lost" : "Found"}</p>
                      <p>{new Date(item.date_occurred).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Posted By
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{item.user_name}</p>
                  <p className="text-sm text-gray-600">Member since {new Date(item.created_at).getFullYear()}</p>
                </div>

                {!isOwner && user && (
                  <div className="space-y-3">
                    {item.user_phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{item.user_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{item.user_email}</span>
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">Sign in to view contact information and send messages</p>
                    <Link href="/auth/login">
                      <Button size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form */}
            {user && !isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contact Owner
                  </CardTitle>
                  <CardDescription>Send a message about this {item.type} item</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm itemId={item.id} receiverId={item.user_id} itemTitle={item.title} />
                </CardContent>
              </Card>
            )}

            {isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Your Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    This is your post. You can manage its status from your dashboard.
                  </p>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full bg-transparent">
                      Go to Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
