import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1d" });

    const res = NextResponse.json({ message: "Login successful!" }, { status: 200 });

   
    res.cookies.set("token", token,  { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",   
      sameSite: "lax",
      path: "/", 
      maxAge: 24 * 60 * 60   
    });

  //   res.cookies.set("token", token,  { 
  //     httpOnly: true, 
  //     // 💡 सुधार: अगर आप localhost पर हैं, तो secure को 'false' रखें।
  //     secure: false, // process.env.NODE_ENV === "production",   
  //     sameSite: "lax", // सुनिश्चित करें कि यह 'lax' है
  //     path: "/", 
  //     maxAge: 24 * 60 * 60   
  //  });

    return res;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error during login" }, { status: 500 });

  }
}


 // res.cookies.set("token", token, {
    //   httpOnly: true, 
    //    prevents JavaScript access (security)
    //     secure: process.env.NODE_ENV === "production", 
    //    only over HTTPS in production
    //    sameSite: "strict", 
    //    prevents CSRF attacks
    //    maxAge: 24 * 60 * 60, 
    //    1 day
    //    path: "/", 
    //    available across site
    // });
