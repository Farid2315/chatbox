import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if AppUser already exists
    const existingAppUser = await prisma.appUser.findFirst({
      where: { authUserId: session.user.id },
    });

    if (existingAppUser) {
      return NextResponse.json({ success: true, message: "AppUser already exists" });
    }

    // Create AppUser record
    await prisma.appUser.create({
      data: {
        email: session.user.email!,
        name: session.user.name || "Unknown User",
        role: "AGENT", // Default role for new users
        authUserId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, message: "AppUser created successfully" });
  } catch (error) {
    console.error("Error creating AppUser:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 