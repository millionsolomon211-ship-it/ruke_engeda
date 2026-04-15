"use client";

import { useRouter } from "next/navigation";

export default function UserInfoPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to save user data goes here
        alert("Profile updated!");
        router.push("/dashboard"); // Or wherever your home page is
    };

    return (
        <div className="form-container">
            <p className="title">Complete Profile</p>
            <p className="sub-title">Just a few more details to get you started</p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        className="input"
                        placeholder="Username"
                        required
                    />
                </div>

                <div className="input-group">
                    <select
                        className="input"
                        style={{ appearance: 'none', color: '#747474' }}
                        required
                        defaultValue=""
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
                        required
                    />
                </div>

                <button className="form-btn" type="submit" style={{ marginTop: '10px' }}>
                    Finish Setup
                </button>
            </form>

            <p className="sign-up-label" style={{ marginTop: '20px', textAlign: 'center' }}>
                You can update these later in settings.
            </p>
        </div>
    );
}