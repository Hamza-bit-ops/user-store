"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const FIXED_USERNAME = "admin"; // apna username rakh lo
  const FIXED_PASSWORD = "12345"; // apna password rakh lo
  const EXPIRY_HOURS = 24;

  // Agar already login hai to redirect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("expiryTime");

    if (token && expiry) {
      const now = new Date().getTime();
      if (now < parseInt(expiry)) {
        router.push("/"); // home page pe bhej do
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("expiryTime");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
      const expiryTime = new Date().getTime() + EXPIRY_HOURS * 60 * 60 * 1000; // 24 hours
      localStorage.setItem("authToken", "loggedin");
      localStorage.setItem("expiryTime", expiryTime.toString());
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
