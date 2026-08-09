import React from 'react';

export default function ProductTags({ tags = [] }) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-6">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                >
                    {tag.name || tag}
                </span>
            ))}
        </div>
    );
}
