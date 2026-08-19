import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

export default function NotificationBell({
    variant = 'light',
}) {
    const {
        auth,
        notifications = [],
        notifications_count = 0,
    } = usePage().props;

    const [isOpen, setIsOpen] = useState(false);

    const isAuthenticated = !!auth?.user;

    /*
    |--------------------------------------------------------------------------
    | Bell appearance
    |--------------------------------------------------------------------------
    */

    const bellClass =
        variant === 'dark'
            ? `
                text-white
                hover:bg-white/10
                group-hover:text-slate-700
            `
            : `
                text-slate-600
                hover:bg-slate-100
                hover:text-slate-950
            `;

    /*
    |--------------------------------------------------------------------------
    | Mark one notification as read
    |--------------------------------------------------------------------------
    */

    const markAsRead = (notificationId) => {
        router.post(
            route('notifications.read', notificationId),
            {},
            {
                preserveScroll: true,
                preserveState: false,

                onSuccess: () => {
                    setIsOpen(false);
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Mark all notifications as read
    |--------------------------------------------------------------------------
    */

    const markAllAsRead = () => {
        router.post(
            route('notifications.read-all'),
            {},
            {
                preserveScroll: true,
                preserveState: false,

                onSuccess: () => {
                    setIsOpen(false);
                },
            }
        );
    };

    return (
        <div className="relative">

            {/* ==========================================================
                BELL
            ========================================================== */}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Notifications"
                aria-expanded={isOpen}
                className={`
                    relative
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    transition
                    ${bellClass}
                `}
            >
                <Bell className="h-5 w-5" />

                {/* ======================================================
                    UNREAD BADGE
                ====================================================== */}

                {notifications_count > 0 && (
                    <span
                        className="
                            absolute
                            -right-0.5
                            -top-0.5

                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center

                            rounded-full
                            bg-red-500

                            px-1

                            text-[10px]
                            font-bold
                            leading-none
                            text-white
                        "
                    >
                        {notifications_count > 99
                            ? '99+'
                            : notifications_count}
                    </span>
                )}
            </button>

            {/* ==========================================================
                DROPDOWN
            ========================================================== */}

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div
                        className="
                            absolute
                            right-0
                            z-50
                            mt-3

                            w-[360px]
                            max-w-[calc(100vw-2rem)]

                            overflow-hidden

                            rounded-2xl
                            border
                            border-slate-200

                            bg-white

                            shadow-2xl
                        "
                    >

                        {/* ==================================================
                            HEADER
                        ================================================== */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between

                                border-b
                                border-slate-100

                                px-4
                                py-3
                            "
                        >
                            <div>
                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    Notifications
                                </h3>

                                {notifications_count > 0 ? (
                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {notifications_count}{' '}
                                        notification
                                        {notifications_count > 1
                                            ? 's'
                                            : ''}{' '}
                                        non lue
                                        {notifications_count > 1
                                            ? 's'
                                            : ''}
                                    </p>
                                ) : (
                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Vous êtes à jour
                                    </p>
                                )}
                            </div>

                            {notifications_count > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="
                                        text-xs
                                        font-medium
                                        text-blue-600
                                        transition
                                        hover:text-blue-700
                                    "
                                >
                                    Tout lire
                                </button>
                            )}
                        </div>

                        {/* ==================================================
                            LIST
                        ================================================== */}

                        <div className="max-h-[420px] overflow-y-auto">

                            {notifications.length === 0 ? (

                                <div
                                    className="
                                        px-4
                                        py-10
                                        text-center
                                    "
                                >
                                    <div
                                        className="
                                            mx-auto
                                            mb-3
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center

                                            rounded-full
                                            bg-slate-100

                                            text-xl
                                        "
                                    >
                                        <Bell className="h-5 w-5 text-slate-400" />
                                    </div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-slate-700
                                        "
                                    >
                                        Aucune notification
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Vous êtes à jour.
                                    </p>
                                </div>

                            ) : (

                                notifications.map((notification) => (

                                    <button
                                        key={notification.id}
                                        type="button"
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                        className="
                                            block
                                            w-full

                                            border-b
                                            border-slate-100

                                            px-4
                                            py-4

                                            text-left

                                            transition
                                            hover:bg-slate-50
                                        "
                                    >
                                        <div className="flex gap-3">

                                            {/* Icon */}

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center

                                                    rounded-full
                                                    bg-blue-50

                                                    text-blue-600
                                                "
                                            >
                                                <Bell className="h-4 w-4" />
                                            </div>

                                            {/* Content */}

                                            <div className="min-w-0 flex-1">

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-3
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {notification.title}
                                                    </p>

                                                    {!notification.read_at && (
                                                        <span
                                                            className="
                                                                mt-1
                                                                h-2
                                                                w-2
                                                                shrink-0
                                                                rounded-full
                                                                bg-blue-600
                                                            "
                                                        />
                                                    )}
                                                </div>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        leading-5
                                                        text-slate-600
                                                    "
                                                >
                                                    {notification.message}
                                                </p>

                                                {notification.order_number && (
                                                    <p
                                                        className="
                                                            mt-2
                                                            text-xs
                                                            font-medium
                                                            text-slate-400
                                                        "
                                                    >
                                                        {notification.order_number}
                                                    </p>
                                                )}

                                            </div>

                                        </div>
                                    </button>

                                ))

                            )}

                        </div>

                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <div
                            className="
                                border-t
                                border-slate-100

                                px-4
                                py-3

                                text-center
                            "
                        >
                            {notifications_count > 0 ? (

                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="
                                        text-xs
                                        font-medium
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    Marquer toutes comme lues
                                </button>

                            ) : (

                                <span
                                    className="
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Aucune notification non lue
                                </span>

                            )}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}