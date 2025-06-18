const Footer = () => {
    return (
        <>
            <footer className="bg-[#f9f8f7] text-gray-700 px-4 sm:px-6 py-10 mt-16 items-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                    {/* Account */}
                    <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800">Account</h3>
                        <ul className="space-y-2">
                            <li><a href="/login" className="hover:underline">Log In</a></li>
                            <li><a href="/register" className="hover:underline">Sign Up</a></li>
                        </ul>
                    </div>

                    {/* Get Help */}
                    <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800">Get Help</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Help Center</a></li>
                            <li><a href="#" className="hover:underline">Return Policy</a></li>
                            <li><a href="#" className="hover:underline">Shipping Info</a></li>
                            <li><a href="#" className="hover:underline">Bulk Orders</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800">Connect</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Facebook</a></li>
                            <li><a href="#" className="hover:underline">Twitter</a></li>
                        </ul>
                    </div>

                    {/* Email Subscription */}
                    <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800">Stay Updated</h3>
                        <form className="flex w-full max-w-md border border-gray-300 rounded overflow-hidden">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-3 py-2 text-sm focus:outline-none"
                            />
                            <button className="bg-gray-800 text-white px-4 hover:bg-black transition-colors">
                                →
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 border-t pt-6 text-xs text-center text-gray-500">
                    © 2025 All Rights Reserved by Group01
                </div>
            </footer>

        </>
    )
}

export default Footer