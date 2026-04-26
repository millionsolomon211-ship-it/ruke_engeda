import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
const ADMIN_KEY = "1q2w3e4r5t";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  const status = (session?.user as any)?.status;
  if (!session || (status !== "admin" && status !== "master")) {
    return false;
  }
  return true;
}

export async function GET() {
  if (!await verifyAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/regions?lim=100`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  try {
    const res = await fetch(`${BACKEND_URL}/api/regions`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 500 });
  }
}
