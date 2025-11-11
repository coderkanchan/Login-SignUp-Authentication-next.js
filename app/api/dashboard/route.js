import { NextResponse } from "next/server";
import  verifyToken  from "@/lib/verifyToken";

export async function GET(req) {
  const user = await verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
  }

  return NextResponse.json({ message: `Welcome ${user.email}!` });
}
