// import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

export async function GET(req) {
  try {
    await connectDB();
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];

    if (!token) return new Response(JSON.stringify({ message: "No token" }), { status: 401 });

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET) // Secret Key को एन्कोड करें
    );

    const user = await User.findById(payload.id).select("-password");

    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findById(decoded.id).select("-password");

    // return new Response(JSON.stringify({ user }), { status: 200 });

  } catch (error) {
    // return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 401 });
    console.error("Me API Error:", error.message);
    return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 401 });
  }
}
