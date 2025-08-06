import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { messageQueries } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { itemId, receiverId, subject, message } = await request.json()

    if (!itemId || !receiverId || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (user.id === receiverId) {
      return NextResponse.json({ error: "Cannot send message to yourself" }, { status: 400 })
    }

    const result = messageQueries.create.run(itemId, user.id, receiverId, subject, message)

    return NextResponse.json({
      message: "Message sent successfully",
      messageId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
