import { NextResponse } from "next/server"
import { itemQueries } from "@/lib/database"

export async function GET() {
  try {
    const items = itemQueries.getAll.all()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}
