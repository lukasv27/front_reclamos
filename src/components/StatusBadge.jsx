const variantClass = {
  pending:     'badge--pending',
  'in-progress': 'badge--in-progress',
  solved:      'badge--solved',
}

export default function StatusBadge({ status, children }) {
  return (
    <span className={`badge ${variantClass[status] ?? ''}`}>
      {children}
    </span>
  )
}
