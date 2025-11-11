import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json({ message: "Password must be at least 8 characters long and include a number and uppercase letter." }, { status: 400 });
    }
    const newUser = await User.create({ name, email, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, 
    });

    return res;

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Server error during register" }, { status: 500 });
  }
}



