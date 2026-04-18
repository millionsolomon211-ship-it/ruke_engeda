import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    // Get current session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, country, phoneNumber } = await req.json();

    if (!username || !country || !phoneNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update the user
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username,
        country,
        phoneNumber,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
