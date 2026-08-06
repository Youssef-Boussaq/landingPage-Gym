export default function SectionTitle({ title, description }) {
    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold font-inter text-slate-900">{title}</h2>
            {description ? (
                <p className="text-sm text-slate-600">{description}</p>
            ) : null}
        </div>
    );
}
