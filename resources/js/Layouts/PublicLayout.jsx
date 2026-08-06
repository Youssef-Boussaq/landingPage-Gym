import Navbar from "@/Components/Landing/Navbar";
import Header from "@/Components/Landing/Header";
import MobileHeader from "@/Components/Landing/MobileHeader";
import { usePage } from "@inertiajs/react";

export default function PublicLayout({ children }) {
    const user = usePage().props.auth?.user;

    return (
        <div className="min-h-screen bg-gradient-to-r from-stone-100 via-neutral-50 to-white">
            <Navbar />

            {/* Mobile */}
            <MobileHeader user={user} />

            {/* Tablet & Desktop */}
            <Header user={user} />

            {children}
        </div>
    );
}