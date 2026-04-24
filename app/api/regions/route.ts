import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get("offset") || "0";
  const lim = searchParams.get("lim") || "5";

  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

  try {
    const res = await fetch(`${backendUrl}/api/regions?offset=${offset}&lim=${lim}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from backend" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

