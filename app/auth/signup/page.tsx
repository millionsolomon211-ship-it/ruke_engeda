"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SplashCursor from '@/components/SplashCursor';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "An error occurred");
                setLoading(false);
                return;
            }

            // Redirect to OTP verification
            router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
            
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <SplashCursor />
            <p className="title">Create account</p>

            {error && <p style={{ color: "red", fontSize: "12px", textAlign: "center", marginBottom: "10px" }}>{error}</p>}

            <form className="form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="input" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
                <input 
                    type="email" 
                    className="input" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    className="input" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <button className="form-btn" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>

            <p className="sign-up-label" style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account?
                <Link href="./login" className="sign-up-link"> Log in</Link>
            </p>

            <div className="buttons-container">
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#747474' }}>OR</div>

                <button
                    className="google-login-button"
                    onClick={() => signIn("google")}
                    type="button"
                >
                    <svg viewBox="0 0 48 48" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    <span>Sign up with Google</span>
                </button>
            </div>
        </div>
    );
}