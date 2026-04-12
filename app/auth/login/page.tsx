"use client"; // Required because we are using a button click (onClick)

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <h1>Sign In</h1>
      <p>Click below to login with your Google account</p>
      
      <button 
        onClick={() => signIn("google")} 
        style={{ 
          padding: '12px 24px', 
          backgroundColor: '#4285F4', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Login with Google
      </button>
    </div>
  );
}
