import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required." }, { status: 400 });
  }

  try {
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!tokenRecord || tokenRecord.expires < new Date()) {
      return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 400 });
    }

    return NextResponse.json({ valid: true, email: tokenRecord.email }, { status: 200 });

  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
