import React from 'react';

export default function ProductDetailLayout({ gallery, info, details, reviews }) {
    return (
        <div className="py-12 bg-slate-50 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Left Column - Gallery */}
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            {gallery}
                        </div>
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            {info}
                        </div>

                        {details && (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                {details}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom - Reviews */}
                {reviews && (
                    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        {reviews}
                    </div>
                )}
            </div>
        </div>
    );
}
