import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL || "https://service-lime-gamma.vercel.app";
const ADMIN_KEY = "1q2w3e4r5t";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  const status = (session?.user as any)?.status;
  if (!session || (status !== "admin" && status !== "master")) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();

    const res = await fetch(`${BACKEND_URL}/api/upload/location`, {
      method: "POST",
      headers: {
        "x-admin-key": ADMIN_KEY
      },
      body: formData // Forward the multi-part form data
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Upload proxy error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
