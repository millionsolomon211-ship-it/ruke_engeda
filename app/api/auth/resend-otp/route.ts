import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "../signup/signup";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Use rate limits: slightly higher than sign up, but bounded. 3 per 5 min.
  const rateLimitResponse = checkRateLimit(req, "resend_otp", 3, 5 * 60 * 1000);
  
  if (!rateLimitResponse.success) {
    return NextResponse.json(
      { error: `Too many requests. Please try again after ${Math.ceil(rateLimitResponse.retryAfter! / 60)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified." }, { status: 400 });
    }

    // Wipe any existing tokens
    await prisma.verificationToken.deleteMany({
      where: { email }
    });

    const otp = generateOTP();
    await prisma.verificationToken.create({
      data: {
        email,
        token: otp,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: "A new OTP has been sent!" }, { status: 200 });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
