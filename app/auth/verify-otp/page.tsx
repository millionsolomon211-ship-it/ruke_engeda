"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import SplashCursor from '@/components/SplashCursor';

function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const type = searchParams.get("type") || "verification"; // "verification" or "reset"
    
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        if (!email) return;
        setLoading(true);
        setError("");
        
        try {
            // If it's a reset flow, we call the forgot-password API again to resend
            const endpoint = type === "reset" ? "/api/auth/forgot-password" : "/api/auth/resend-otp";
            
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || "Failed to resend OTP");
            } else {
                setError("A new OTP was sent!"); 
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (type === "reset") {
                // Password reset specific OTP verification
                const res = await fetch("/api/auth/verify-reset-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp })
                });
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Invalid OTP");
                    setLoading(false);
                } else {
                    // Success: redirect to new password page with the token
                    router.push(`/auth/forgot-password/newpassword?token=${data.resetToken}`);
                }
            } else {
                // Default email verification (signup) flow
                const result = await signIn("credentials", {
                    redirect: false,
                    type: "otp",
                    email: email,
                    otp: otp
                });

                if (result?.error) {
                    setError(result.error);
                    setLoading(false);
                } else {
                    router.push("/auth/user_info");
                    router.refresh();
                }
            }
            
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                className="input" 
                placeholder="6-digit OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required 
            />
            <button className="form-btn" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="sign-up-label" style={{ textAlign: 'center', cursor: 'pointer', marginTop: '15px' }} onClick={handleResend}>
                Didn't get a code? <span className="sign-up-link">Resend</span>
            </p>
            {error && <p style={{ color: error.includes("sent") ? "green" : "red", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>{error}</p>}
        </form>
    );
}


export default function VerifyOtpPage() {
    return (
        <div className="form-container">
            <SplashCursor />
            <p className="title">Verify Email</p>
            <p className="sub-title">Enter the code sent to your email</p>
            <Suspense fallback={<p>Loading...</p>}>
                <VerifyOtpForm />
            </Suspense>
        </div>
    );
}
