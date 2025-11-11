

import { jwtVerify } from "jose";
import { NextResponse } from "next/server";


export default async function verifyToken(req) {
  try {
   
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify( // 💡 await का उपयोग करें
      token,
      new TextEncoder().encode(process.env.JWT_SECRET) // Secret Key को Uint8Array में एन्कोड करें
    );
    return payload;

  } catch (error) {
    return null;
  }
}