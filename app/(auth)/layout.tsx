export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-8">
            <div className="flex flex-col md:flex-row bg-gray-900 shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full transform transition duration-500">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="/login.png"
                        alt="Authentication"
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-300"
                    />
                </div>

                {/* Children Section */}
                <div className="w-full md:w-1/2 p-6 sm:p-10 flex items-center justify-center text-white">
                    {children}
                </div>
            </div>
        </div>
    );
}