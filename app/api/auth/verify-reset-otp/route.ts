import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { email, token: otp }
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (tokenRecord.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // OTP is valid!
    // Delete the OTP token
    await prisma.verificationToken.delete({
      where: { id: tokenRecord.id }
    });

    // Generate a long-lived reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await prisma.verificationToken.create({
      data: {
        email,
        token: resetToken,
        expires,
      },
    });

    return NextResponse.json({ resetToken }, { status: 200 });

  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
