import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { itemQueries, messageQueries } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search, MessageCircle, Package, Clock, CheckCircle } from "lucide-react"
import LogoutButton from "@/components/logout-button"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userItems = itemQueries.getByUser.all(user.id) as any[]
  const userMessages = messageQueries.getByUser.all(user.id, user.id) as any[]

  const activeItems = userItems.filter((item) => item.status === "active")
  const resolvedItems = userItems.filter((item) => item.status === "resolved")
  const unreadMessages = userMessages.filter((msg) => !msg.is_read && msg.receiver_id === user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              {user.is_admin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeItems.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedItems.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userItems.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/post/lost">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-red-500" />
                  Report Lost Item
                </CardTitle>
                <CardDescription>Post details about an item you've lost</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/post/found">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-green-500" />
                  Report Found Item
                </CardTitle>
                <CardDescription>Post details about an item you've found</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/browse">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-500" />
                  Browse Items
                </CardTitle>
                <CardDescription>Search through lost and found items</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Items */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Recent Posts</CardTitle>
              <Link href="/dashboard/items">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {userItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No items posted yet</p>
                  <Link href="/post/lost">
                    <Button className="mt-4" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Item
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant={item.type === "lost" ? "destructive" : "default"}>{item.type}</Badge>
                          <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.location}</p>
                        <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      <Link href={`/item/${item.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Messages</CardTitle>
              <Link href="/dashboard/messages">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {userMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userMessages.slice(0, 3).map((message) => (
                    <div key={message.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{message.subject}</h4>
                        {!message.is_read && message.receiver_id === user.id && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {message.sender_id === user.id ? "To" : "From"}:{" "}
                        {message.sender_id === user.id ? message.receiver_name : message.sender_name}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
