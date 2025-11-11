'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
 const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage('✅ Login successful! Redirecting...');
        setEmail('');
        setPassword('');
        //localStorage.setItem("isLoggedIn", "true");
        setTimeout(() => {
            // window.location.href = "/dashboard";
            router.push("/dashboard"); 
        }, 800);
      } else {
        setIsSuccess(false);
        setMessage(`❌ ${data.message || 'Invalid credentials'}`);
      }

    } catch (error) {
      setIsSuccess(false);
      setMessage('❌ Something went wrong');
    }

  };

  return (
    <div className="flex flex-col items-center py-20">

      <h1 className="text-4xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">

        <input type="email" placeholder="Email" className="border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="relative">

          <input type={showPassword ? "text" : "password"} placeholder="Password" className="border p-2 rounded w-full" value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-gray-600" >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>

        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600">Login</button>

      </form>

      {message && (
        <p className={`mt-4 font-medium ${isSuccess ? 'text-green-500' : 'text-red-500'}`} >  {message} </p>
      )}

    </div>
  );
}



