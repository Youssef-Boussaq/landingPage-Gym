import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell({ variant = 'light' }) {
    const { notifications = [] } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Optional: click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const bellClass = variant === 'dark'
        ? 'text-white hover:bg-white/10 group-hover:text-slate-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950';

    const unreadCount = notifications.filter(n => n.read_at === null).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Notifications"
                aria-expanded={isOpen}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${bellClass}`}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <NotificationDropdown 
                    notifications={notifications} 
                    onClose={() => setIsOpen(false)} 
                />
            )}
        </div>
    );
}