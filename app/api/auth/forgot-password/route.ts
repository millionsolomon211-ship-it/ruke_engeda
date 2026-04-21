import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "../signup/signup";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: 3 attempts per 15 mins for forgot password initiation
  const rateLimitResponse = checkRateLimit(req, "forgot_password", 3, 15 * 60 * 1000);
  
  if (!rateLimitResponse.success) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again after ${Math.ceil(rateLimitResponse.retryAfter! / 60)} minutes.` },
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

    // Security: Do not reveal if the email exists or not. 
    // However, to follow the USER's specific flow "search it in the db then if fide it send otp", 
    // I will return a success message even if not found to prevent user enumeration, 
    // but internally only send email if user exists.
    if (!user) {
      // We still return 200 to avoid revealing registered users, but we do nothing.
      return NextResponse.json({ message: "If an account exists for this email, an OTP has been sent." }, { status: 200 });
    }

    // Wipe any existing tokens for this email
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

    return NextResponse.json({ message: "OTP sent to your email." }, { status: 200 });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
