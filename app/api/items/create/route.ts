import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { itemQueries } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { type, title, description, category, location, date_occurred, image_url } = await request.json()

    if (!type || !title || !description || !category || !location || !date_occurred) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    if (!["lost", "found"].includes(type)) {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 })
    }

    const result = itemQueries.create.run(
      user.id,
      type,
      title,
      description,
      category,
      location,
      date_occurred,
      image_url || null,
    )

    return NextResponse.json({
      message: "Item posted successfully",
      itemId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
