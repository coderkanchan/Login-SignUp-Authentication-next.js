
import { NextResponse } from "next/server";

import { jwtVerify } from "jose"; 

export function middleware(req) {
  const url = req.nextUrl.clone();

  const cookieHeader = req.headers.get('cookie') || '';
  const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/login", "/signup"];

  const isProtected = protectedRoutes.some((path) => url.pathname.startsWith(path));
  const isAuthRoute = authRoutes.some((path) => url.pathname.startsWith(path));

  let isValidToken = false;

  if (token) {
    try {
     
      jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET) 
      );
      isValidToken = true;
      console.log("✅ Token is Valid for URL:", url.pathname); //
    } catch (err) {
      console.log("❌ Token is INVALID for URL:", url.pathname, "Error:", err.message);
      isValidToken = false;
    }
  }

  if (isProtected) {
    if (!isValidToken) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAuthRoute && isValidToken) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};