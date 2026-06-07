export default function MetricCard({ icon, iconBg, iconColor, label, value, meta, metaColor = 'text-on-surface-variant' }) {
  return (
    <article className="card rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-sm">
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
        </div>
        <span className={`font-label-sm text-label-sm ${metaColor}`}>{meta}</span>
      </div>
      <p className="font-label-sm text-label-sm text-on-secondary-container uppercase tracking-wider mb-xs">
        {label}
      </p>
      <h2 className="font-h2 text-h2 text-on-surface">{value}</h2>
    </article>
  )
}
