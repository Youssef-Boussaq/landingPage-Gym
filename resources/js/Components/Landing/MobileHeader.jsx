import { User, Bell, Search } from 'lucide-react';

export default function MobileHeader({ user }) {
    return (
        <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4 bg-transparent pointer-events-none md:hidden">
            
            {/* LEFT SIDE: User Profile */}
            <div className="flex items-center pointer-events-auto">
                <a
                    href={user ? "/profile" : "/login"}
                    className="flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 active:scale-95"
                    aria-label="User Profile"
                >
                    {user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={user.name || "User Avatar"} 
                            className="h-11 w-11 rounded-full object-cover border-2 border-white/30 shadow-md" 
                        />
                    ) : (
                        <User className="h-7 w-7 text-[#9de500] drop-shadow-md" />
                    )}
                </a>
            </div>

            {/* RIGHT SIDE: Search & Notification Icons */}
            <div className="flex items-center gap-5 pointer-events-auto">
                
                {/* Search Button */}
                <button
                    type="button"
                    className="flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 active:scale-95"
                    aria-label="Search"
                >
                    <Search className="h-7 w-7 text-white drop-shadow-md" />
                </button>

                {/* Notification Button */}
                <button
                    type="button"
                    className="relative flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 active:scale-95"
                    aria-label="Notifications"
                >
                    <Bell className="h-7 w-7 text-white drop-shadow-md" />
                    
                    {/* Active Notification Indicator Dot */}
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#9de500] ring-2 ring-[#0A0B0D]" />
                </button>

            </div>

        </header>
    );
}