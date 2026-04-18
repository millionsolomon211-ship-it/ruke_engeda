"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPasswordPage() {
    const [showPass, setShowPass] = useState(false);
    const [passwords, setPasswords] = useState({ new: "", confirm: "" });
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("Passwords do not match!");
            return;
        }
        // Handle logic here
        alert("Password updated successfully!");
        router.push("/login");
    };

    return (
        <div className="form-container">
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

                <button className="form-btn" type="submit">Update Password</button>
            </form>
        </div>
    );
}