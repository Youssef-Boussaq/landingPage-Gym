import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { useEffect, useState } from 'react';

function isVideoFile(file) {
    if (!file) {
        return false;
    }

    if (file.type?.startsWith('video/')) {
        return true;
    }

    return /\.(mp4|webm)$/i.test(file.name || '');
}

export default function CategoryForm({
    form,
    parentOptions = [],
    existingMedia = [],
    submitLabel,
    onSubmit,
}) {
    const [previews, setPreviews] = useState([]);
    const [slugTouched, setSlugTouched] = useState(Boolean(form.data.slug));

    useEffect(() => {
        const files = form.data.media || [];
        const next = files.map((file) => ({
            url: URL.createObjectURL(file),
            isVideo: isVideoFile(file),
            name: file.name,
        }));
        setPreviews(next);

        return () => next.forEach((item) => URL.revokeObjectURL(item.url));
    }, [form.data.media]);

    const remainingExisting = existingMedia.filter(
        (item) => !(form.data.removed_media_ids || []).includes(item.id)
    );

    const onFiles = (event) => {
        form.setData('media', Array.from(event.target.files || []));
        form.setData('primary_index', 0);
        form.setData('existing_primary_id', null);
    };

    const removeNewFile = (index) => {
        const next = [...(form.data.media || [])];
        next.splice(index, 1);
        form.setData('media', next);
        if (form.data.primary_index >= next.length) {
            form.setData('primary_index', 0);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <InputLabel value="Name" />
                <input
                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                    value={form.data.name}
                    onChange={(event) => {
                        form.setData('name', event.target.value);
                        if (!slugTouched) {
                            form.setData(
                                'slug',
                                event.target.value
                                    .toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9]+/g, '-')
                                    .replace(/(^-|-$)/g, '')
                            );
                        }
                    }}
                />
                <InputError message={form.errors.name} className="mt-1" />
            </div>

            <div>
                <InputLabel value="Slug" />
                <input
                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                    value={form.data.slug}
                    onChange={(event) => {
                        setSlugTouched(true);
                        form.setData('slug', event.target.value);
                    }}
                    placeholder="generated from name if empty"
                />
                <InputError message={form.errors.slug} className="mt-1" />
            </div>

            <div>
                <InputLabel value="Parent category" />
                <select
                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                    value={form.data.parent_id ?? ''}
                    onChange={(event) => form.setData('parent_id', event.target.value === '' ? '' : Number(event.target.value))}
                >
                    <option value="">No parent</option>
                    {parentOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <InputError message={form.errors.parent_id} className="mt-1" />
            </div>

            <div>
                <InputLabel value="Alt text" />
                <input
                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                    value={form.data.alt_text}
                    onChange={(event) => form.setData('alt_text', event.target.value)}
                    placeholder="Used for newly uploaded media"
                />
                <InputError message={form.errors.alt_text} className="mt-1" />
            </div>

            {remainingExisting.length > 0 && (
                <div>
                    <InputLabel value="Existing media" />
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {remainingExisting.map((item) => {
                            const isPrimary = form.data.existing_primary_id
                                ? form.data.existing_primary_id === item.id
                                : item.is_primary;

                            return (
                                <div key={item.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                    {item.type === 'video' ? (
                                        <video src={item.url} controls className="h-32 w-full object-cover" />
                                    ) : (
                                        <img src={item.url} alt={item.alt_text || ''} className="h-32 w-full object-cover" />
                                    )}
                                    <div className="flex items-center justify-between gap-1 p-2">
                                        <span className="text-[10px] font-bold uppercase text-slate-500">{item.type}</span>
                                        {isPrimary && (
                                            <span className="rounded-full bg-[#9de500] px-2 py-0.5 text-[10px] font-black text-slate-950">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-1 p-2 pt-0">
                                        <button
                                            type="button"
                                            className="rounded bg-white px-2 py-1 text-[10px] font-bold"
                                            onClick={() => form.setData('existing_primary_id', item.id)}
                                        >
                                            Make primary
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded bg-rose-600 px-2 py-1 text-[10px] font-bold text-white"
                                            onClick={() => form.setData('removed_media_ids', [...form.data.removed_media_ids, item.id])}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div>
                <InputLabel value="Upload media" />
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,.jpg,.jpeg,.png,.webp,.mp4,.webm"
                    className="mt-1 block w-full text-sm"
                    onChange={onFiles}
                />
                <p className="mt-1 text-xs text-slate-400">Images: jpg, jpeg, png, webp (5 MB). Videos: mp4, webm (20 MB).</p>
                <InputError message={form.errors.media} className="mt-1" />
                {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {previews.map((item, index) => (
                            <div key={item.url} className="relative overflow-hidden rounded-xl border border-slate-200">
                                {item.isVideo ? (
                                    <video src={item.url} controls className="h-32 w-full object-cover" />
                                ) : (
                                    <img src={item.url} alt="" className="h-32 w-full object-cover" />
                                )}
                                <div className="flex items-center justify-between p-2">
                                    <span className="truncate text-[10px] text-slate-500">{item.name}</span>
                                    {form.data.primary_index === index && !form.data.existing_primary_id && (
                                        <span className="rounded-full bg-[#9de500] px-2 py-0.5 text-[10px] font-black text-slate-950">
                                            Primary
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1 p-2 pt-0">
                                    <button
                                        type="button"
                                        className="rounded bg-white px-2 py-1 text-[10px] font-bold"
                                        onClick={() => {
                                            form.setData('primary_index', index);
                                            form.setData('existing_primary_id', null);
                                        }}
                                    >
                                        Make primary
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded bg-rose-600 px-2 py-1 text-[10px] font-bold text-white"
                                        onClick={() => removeNewFile(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={form.processing}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-[#9de500]"
            >
                {form.processing ? 'Saving…' : submitLabel}
            </button>
        </form>
    );
}
