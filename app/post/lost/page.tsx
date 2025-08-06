import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import PostItemForm from "@/components/post-item-form"

export default async function PostLostPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Lost Item</h1>
          <p className="text-gray-600">Provide as much detail as possible to help others identify your lost item.</p>
        </div>

        <PostItemForm type="lost" />
      </div>
    </div>
  )
}
