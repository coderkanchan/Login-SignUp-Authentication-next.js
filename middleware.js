// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value;

//   const protectedRoutes = ["/dashboard"]; // add more protected pages here

//   if (protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//       return NextResponse.next();
//     } catch (err) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }



// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   //const token = req.cookies.get("token")?.value;
//   const url = req.nextUrl.clone();

//   const cookieHeader = req.headers.get('cookie') || '';
//   const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

//   // list of routes that require authentication
//   const protectedRoutes = ["/dashboard"];

//   const isProtected = protectedRoutes.some((path) =>
//     url.pathname.startsWith(path)
//   );

//   if (isProtected) {
//     if (!token) {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }

//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//       return NextResponse.next();
//     } catch (err) {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*"], // ✅ ensures middleware only runs for these routes
// };




// middleware.js

// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const url = req.nextUrl.clone();

//   // 💡 1. Headers से JWT Token को सुरक्षित रूप से पढ़ें
//   // यह सुनिश्चित करता है कि आपके पास सबसे नया token है 
//   const cookieHeader = req.headers.get('cookie') || '';
//   const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];


//   // 2. Protected Routes और Public/Auth Routes की सूची
//   const protectedRoutes = ["/dashboard"];
//   const authRoutes = ["/login", "/signup"];

//   const isProtected = protectedRoutes.some((path) =>
//     url.pathname.startsWith(path)
//   );
//   const isAuthRoute = authRoutes.some((path) =>
//     url.pathname.startsWith(path)
//   );

//   let isValidToken = false;
//   if (token) {
//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//       isValidToken = true;
//       console.log("✅ Token is Valid for URL:", url.pathname); // सर्वर कंसोल में देखें
//     } catch (err) {
//       // यदि token अमान्य या expired है, तो isValidToken false रहेगा
//       console.log("❌ Token is INVALID for URL:", url.pathname, "Error:", err.message); // सर्वर कंसोल में देखें
//       isValidToken = false;
//     }
//   }


//   // 3. Authentication Logic

//   // A. यदि उपयोगकर्ता Protected Route (जैसे /dashboard) पर है
//   if (isProtected) {
//     if (!isValidToken) {
//       url.pathname = "/login";
//       return NextResponse.redirect(url); // लॉग इन नहीं है, तो /login पर भेजें
//     }
//     return NextResponse.next(); // लॉग इन है, तो जारी रखें
//   }

//   // B. यदि उपयोगकर्ता Auth Route (/login, /signup) पर है और उसके पास मान्य Token है
//   if (isAuthRoute && isValidToken) {
//     url.pathname = "/dashboard";
//     return NextResponse.redirect(url); // पहले से लॉग इन है, तो /dashboard पर भेजें
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/signUp"], // ✅ अब यह login/signup को भी ट्रैक करेगा
// };













// middleware.js

import { NextResponse } from "next/server";
// ❌ import jwt from "jsonwebtoken";  <-- इसे हटा दें
import { jwtVerify } from "jose"; // ✅ jose को इम्पोर्ट करें

export function middleware(req) {
  const url = req.nextUrl.clone();

  // JWT Token को headers से मैन्युअल रूप से पढ़ें
  const cookieHeader = req.headers.get('cookie') || '';
  const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/login", "/signup"];

  const isProtected = protectedRoutes.some((path) => url.pathname.startsWith(path));
  const isAuthRoute = authRoutes.some((path) => url.pathname.startsWith(path));

  let isValidToken = false;

  if (token) {
    try {
      // ✅ jose का उपयोग करें, जो Edge Runtime के साथ काम करता है
      jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET) // Secret Key को Uint8Array में एन्कोड करना ज़रूरी है
      );
      isValidToken = true;
      console.log("✅ Token is Valid for URL:", url.pathname); // अब यह error नहीं देगा
    } catch (err) {
      console.log("❌ Token is INVALID for URL:", url.pathname, "Error:", err.message);
      isValidToken = false;
    }
  }

  // A. यदि उपयोगकर्ता Protected Route पर है
  if (isProtected) {
    if (!isValidToken) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // B. यदि उपयोगकर्ता Auth Route पर है और उसके पास मान्य Token है
  if (isAuthRoute && isValidToken) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};