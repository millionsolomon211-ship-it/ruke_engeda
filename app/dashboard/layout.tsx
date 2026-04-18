"use client";

import { useSession, signOut } from "next-auth/react";
import SplashCursor from '@/components/SplashCursor';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <SplashCursor />
      <header style={{ padding: '20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <div>
           {session?.user?.name && <span style={{ marginRight: '15px' }}>{session.user.name} ({(session.user as any).status})</span>}
           <button onClick={() => signOut({ callbackUrl: '/auth/login' })} style={{ padding: '8px 15px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}>
             Logout
           </button>
        </div>
      </header>
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}
