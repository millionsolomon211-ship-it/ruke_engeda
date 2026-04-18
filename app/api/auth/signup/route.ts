import { handleSignup } from "./signup";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Max 5 signups/OTP emails per hour (3600000ms) per IP
  const rateLimitResponse = checkRateLimit(req, "signup", 5, 3600000);
  
  if (!rateLimitResponse.success) {
    return NextResponse.json(
      { error: `Too many requests. Please try again after ${Math.ceil(rateLimitResponse.retryAfter! / 60)} minutes.` },
      { status: 429 }
    );
  }

  return handleSignup(req);
}
