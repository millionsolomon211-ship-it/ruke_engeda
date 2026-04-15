"use client";

import Link from "next/link";

export default function VerifyEmailPage() {
    return (
        <div className="form-container">
            <p className="title">Verify Email</p>
            <p className="sub-title">We sent a verification code to your email. Please enter it below.</p>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    className="input"
                    placeholder="Enter OTP"
                    maxLength={6}
                    style={{ textAlign: 'center', letterSpacing: '4px' }}
                    required
                />

                <button className="form-btn" type="submit">Verify Email</button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p className="sign-up-label">
                    Didn't receive the email? <span className="sign-up-link" style={{ cursor: 'pointer' }}>Resend OTP</span>
                </p>
            </div>
        </div>
    );
}