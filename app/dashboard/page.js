'use client';

import { useState, useEffect } from "react"; // useState और useEffect इम्पोर्ट करें
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest"); // 💡 State जोड़ें
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. /api/me को कॉल करने के लिए एक async फंक्शन
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');

        if (res.ok) {
          const data = await res.json();
          // 2. प्राप्त नाम को State में सेट करें
          setUserName(data.user.name);
        } else {
          // यदि Token अमान्य हो, तो Middleware को काम करना चाहिए,
          // लेकिन क्लाइंट-साइड पर सुरक्षा के लिए Logout कर सकते हैं।
          console.error("Could not fetch user data, redirecting...");
          // router.push("/login"); // Middleware के कारण इसकी जरूरत नहीं है
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); // कॉम्पोनेंट माउंट होने पर सिर्फ एक बार कॉल करें

  return (
    <div className="text-center py-20">

      {isLoading ? (
        <h1 className="text-3xl font-bold">Loading...</h1>
      ) : (
        // 3. State से नाम प्रदर्शित करें
        <h1 className="text-3xl font-bold">Welcome, {userName} 🎉</h1>
      )}


      <button
        onClick={async () => {
          // ... (Logout लॉजिक)
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
