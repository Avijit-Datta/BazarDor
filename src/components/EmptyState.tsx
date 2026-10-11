import { Link } from "react-router-dom";

export default function EmptyState({
  emoji = "🛒",
  title,
  subtitle,
}: {
  emoji?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-base-content/15 bg-base-100 px-6 py-16 text-center">
      <span className="text-5xl">{emoji}</span>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-base-content">{title}</h3>
        {subtitle && <p className="text-sm text-base-content/60">{subtitle}</p>}
      </div>
      <Link to="/" className="btn btn-primary btn-sm sm:btn-md mt-2">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
