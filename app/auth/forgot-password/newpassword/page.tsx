"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SplashCursor from '@/components/SplashCursor';

export default function NewPasswordPage() {
    const [showPass, setShowPass] = useState(false);
    const [passwords, setPasswords] = useState({ new: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(true);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                router.push("/");
                return;
            }

            try {
                const res = await fetch(`/api/auth/verify-reset-token?token=${token}`);
                if (!res.ok) {
                    router.push("/");
                } else {
                    setIsVerifying(false);
                }
            } catch (err) {
                router.push("/");
            }
        };

        verifyToken();
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (passwords.new !== passwords.confirm) {
            setError("Passwords do not match!");
            return;
        }

        if (passwords.new.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: passwords.new })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to reset password");
                setLoading(false);
            } else {
                alert("Password updated successfully!");
                router.push("/auth/login");
            }
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="form-container">
                <SplashCursor />
                <p className="title">Verifying...</p>
            </div>
        );
    }

    return (
        <div className="form-container">
            <SplashCursor />
            <p className="title">New Password</p>
            <p className="sub-title">Please choose a strong password</p>

            <form className="form" onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPass ? "text" : "password"}
                        className="input"
                        placeholder="New Password"
                        style={{ width: '100%' }}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        required
                    />
                </div>

                <input
                    type={showPass ? "text" : "password"}
                    className="input"
                    placeholder="Confirm Password"
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '10px' }}>
                    <input
                        type="checkbox"
                        id="show"
                        onChange={() => setShowPass(!showPass)}
                        style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="show" className="sign-up-label" style={{ cursor: 'pointer' }}>Show Passwords</label>
                </div>

                {error && <p style={{ color: "red", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>{error}</p>}

                <button className="form-btn" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}