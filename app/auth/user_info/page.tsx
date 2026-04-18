"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import SplashCursor from '@/components/SplashCursor';

export default function UserInfoPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    
    const [username, setUsername] = useState("");
    const [country, setCountry] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, country, phoneNumber }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "An error occurred");
                setLoading(false);
                return;
            }

            await update({
                username,
                country,
                phoneNumber
            });

            router.push("/dashboard"); 
            router.refresh();
        } catch(err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <SplashCursor />
            <p className="title">Complete Profile</p>
            <p className="sub-title">Just a few more details to get you started</p>
            
            {error && <p style={{ color: "red", fontSize: "12px", textAlign: "center", marginBottom: "10px" }}>{error}</p>}

            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        className="input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <select
                        className="input"
                        style={{ appearance: 'none', color: '#747474' }}
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="" disabled>Select Country</option>
                        <option value="US">United States</option>
                        <option value="ET">Ethiopia</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        {/* Add more countries as needed */}
                    </select>
                </div>

                <div className="input-group">
                    <input
                        type="tel"
                        className="input"
                        placeholder="Phone Number (e.g. +1...)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <button className="form-btn" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                    {loading ? "Saving..." : "Finish Setup"}
                </button>
            </form>

            <p className="sign-up-label" style={{ marginTop: '20px', textAlign: 'center' }}>
                You can update these later in settings.
            </p>
        </div>
    );
}