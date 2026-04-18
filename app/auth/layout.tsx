export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const images = [

        "https://images.unsplash.com/photo-1664022379391-8b52fd2653f0?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1629995015838-ea0e985d8d1a?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1667401373119-f9af8c7ccf8e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1668003312545-f433059a0973?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1699535659313-c95cf8111235?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    return (
        <div className="auth-wrapper">
            {/* Persistent Left Sidebar Slider */}
            <div className="slider-container">
                {images.map((src, i) => (
                    <div
                        key={src}
                        className="slide"
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ))}
                <div className="slider-overlay" />
            </div>

            {/* Dynamic Form Area */}
            <main className="form-content-area">
                {children}
            </main>
        </div>
    );
}