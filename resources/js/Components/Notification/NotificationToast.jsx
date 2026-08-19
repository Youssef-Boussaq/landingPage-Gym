import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function NotificationToast() {

    const {
        notification = null,
    } = usePage().props;

    const [visible, setVisible] = useState(false);

    useEffect(() => {

        if (!notification) {
            setVisible(false);
            return;
        }

        setVisible(true);

    }, [notification]);

    if (!notification || !visible) {
        return null;
    }

    return (
        <div
            className="
                fixed
                right-5
                top-5
                z-[9999]

                w-[360px]
                max-w-[calc(100vw-2rem)]
            "
        >
            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200

                    bg-white

                    p-4

                    shadow-2xl
                "
            >
                <div className="flex items-start gap-3">

                    {/* ==================================================
                        ICON
                    ================================================== */}

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center

                            rounded-full
                            bg-green-100

                            text-green-600
                        "
                    >
                        <Bell className="h-5 w-5" />
                    </div>

                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="min-w-0 flex-1">

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-3
                            "
                        >
                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                {notification.title}
                            </h3>

                            <button
                                type="button"
                                onClick={() => setVisible(false)}
                                className="
                                    text-slate-400
                                    transition
                                    hover:text-slate-600
                                "
                                aria-label="Fermer"
                            >
                                <X className="h-4 w-4" />
                            </button>
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
            </div>
        </div>
    );
}