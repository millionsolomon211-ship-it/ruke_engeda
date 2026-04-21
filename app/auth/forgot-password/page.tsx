"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SplashCursor from '@/components/SplashCursor';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                // Success: redirect to OTP verification page
                router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=reset`);
            }
        } catch (err) {
            setError("Failed to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <SplashCursor />
            <p className="title">Reset Password</p>
            <p className="sub-title">Enter your email to receive a verification code</p>

            <form className="form" onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    className="input" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <button className="form-btn" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                </button>
                {error && <p style={{ color: "red", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>{error}</p>}
            </form>

            <p className="sign-up-label" style={{ marginTop: '25px', textAlign: 'center' }}>
                Back to <Link href="./login" className="sign-up-link">Log in</Link>
            </p>
        </div>
    );
}