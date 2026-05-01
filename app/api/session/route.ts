import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ userId: null }, { status: 200 });
  }
  return NextResponse.json({ userId: session.userId }, { status: 200 });
}
