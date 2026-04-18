import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// For demo purposes, we will mock email sending if SMTP is not fully configured, 
// but we include nodemailer structure.
import nodemailer from "nodemailer";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string) {
  // In a real app, use environment variables for this config.
  // We will print it to console for now to ensure we can test without real SMTP!
  console.log(`\n\n[MOCK EMAIL] To: ${email} | OTP: ${otp}\n\n`);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    if (process.env.EMAIL_SERVER_USER) {
      await transporter.sendMail({
        from: `"Authentication" <${process.env.EMAIL_SERVER_USER}>`,
        to: email,
        subject: "Your Verification Code",
        html: `<p>Welcome!</p><p>Your 6-digit verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });
      console.log(`Live email sent accurately to: ${email}`);
    }

  } catch (error) {
    console.error("Failed to send OTP email via Nodemailer:", error);
    // Don't throw, we want the flow to continue for testing if SMTP is unconfigured.
  }
}

export async function handleSignup(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Strong password check
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumbers) {
      return NextResponse.json({ 
        error: "Password must contain at least one uppercase letter, one lowercase letter, and one number." 
      }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // status is "user" and image is base64 string automatically from schema defaults
      },
    });

    // Generate OTP
    const otp = generateOTP();
    
    // Check if token exists for this email, delete it to replace
    await prisma.verificationToken.deleteMany({
      where: { email }
    });

    await prisma.verificationToken.create({
      data: {
        email,
        token: otp, // Optionally you could hash this, but finding/matching is easier unhashed for simple OTPs, or you hash and compare. We keep plain for testing right now.
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send OTP
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: "User created. OTP sent." }, { status: 201 });

  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
