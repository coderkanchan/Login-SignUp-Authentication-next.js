'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');

        if (res.ok) {
          const data = await res.json();
         
          setUserName(data.user.name);
        } else {
          
          console.error("Could not fetch user data, redirecting...");
         
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); 

  return (
    <div className="text-center py-20">

      {isLoading ? (
        <h1 className="text-3xl font-bold">Loading...</h1>
      ) : (
        
        <h1 className="text-3xl font-bold">Welcome, {userName} 🎉</h1>
      )}


      <button
        onClick={async () => {
       
          try {
            await fetch('/api/logout', { method: 'POST' });
          } catch (error) {
            console.error("Logout failed:", error);
          }
          router.push("/login");
        }}
        className="bg-red-600 text-white mt-4 px-6 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
