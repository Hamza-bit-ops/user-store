"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("expiryTime");

    if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("expiryTime");
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Checking Auth...</div>;
  }

  return <>{children}</>;
}
