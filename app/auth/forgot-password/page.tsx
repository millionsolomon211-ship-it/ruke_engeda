"use client";

import { useState } from "react";
import Link from "next/link";
import SplashCursor from '@/components/SplashCursor';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP

    return (
        <div className="form-container">
            <SplashCursor />
            <p className="title">{step === 1 ? "Reset Password" : "Verify OTP"}</p>
            <p className="sub-title">
                {step === 1
                    ? "Enter your email to receive a verification code"
                    : "Enter the 6-digit code sent to your email"}
            </p>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
                {step === 1 ? (
                    <>
                        <input type="email" className="input" placeholder="Email Address" required />
                        <button className="form-btn" onClick={() => setStep(2)}>Send OTP</button>
                    </>
                ) : (
                    <>
                        <input type="text" className="input" placeholder="000000" maxLength={6} style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }} required />
                        <button className="form-btn">
                            <Link href="/new-password" style={{ color: 'inherit', textDecoration: 'none' }}>Verify & Continue</Link>
                        </button>
                        <p className="sign-up-label" style={{ textAlign: 'center', cursor: 'pointer' }}>
                            Didn't get a code? <span className="sign-up-link">Resend</span>
                        </p>
                    </>
                )}
            </form>

            <p className="sign-up-label" style={{ marginTop: '25px', textAlign: 'center' }}>
                Back to <Link href="./login" className="sign-up-link">Log in</Link>
            </p>
        </div>
    );
}