import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { userQueries, itemQueries, messageQueries } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, MessageCircle, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

export default async function AdminPage() {
  try {
    const admin = await requireAdmin()

    const users = userQueries.getAll.all() as any[]
    const items = itemQueries.getAll.all() as any[]
    const messages = messageQueries.getAll.all() as any[]

    const totalUsers = users.length
    const totalItems = items.length
    const activeItems = items.filter((item) => item.status === "active").length
    const resolvedItems = items.filter((item) => item.status === "resolved").length
    const totalMessages = messages.length
    const unreadMessages = messages.filter((msg) => !msg.is_read).length

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {admin.name}</span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">{users.filter((u) => u.is_admin).length} admin(s)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  {activeItems} active, {resolvedItems} resolved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMessages}</div>
                <p className="text-xs text-muted-foreground">{unreadMessages} unread</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalItems > 0 ? Math.round((resolvedItems / totalItems) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Items successfully reunited</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.is_admin && <Badge variant="secondary">Admin</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Items */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Items</CardTitle>
                <CardDescription>Latest posted items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{item.title}</p>
                          <Badge variant={item.type === "lost" ? "destructive" : "default"}>{item.type}</Badge>
                          <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.location}</p>
                        <p className="text-xs text-gray-500">
                          By {item.user_name} on {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/item/${item.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    redirect("/auth/login")
  }
}
