import { type NextRequest, NextResponse } from "next/server"
import { userQueries } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = userQueries.findByEmail.get(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const result = userQueries.create.run(email, hashedPassword, name, phone || null)
    const userId = result.lastInsertRowid as number

    const token = generateToken(userId)
    const cookieStore = await cookies()

    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: userId,
        email,
        name,
        is_admin: false,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
