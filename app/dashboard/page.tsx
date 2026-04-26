"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Basic Role-Based Redirection
    if (status === "authenticated") {
      const userStatus = (session?.user as any)?.status;
      if (userStatus === "admin" || userStatus === "master") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
