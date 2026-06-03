export function ProgressMeter({
  percent,
  completed,
  total,
  label = 'Overall Progress'
}: {
  percent: number
  completed: number
  total: number
  label?: string
}) {
  return (
    <div className="progress-meter">
      <div className="meter-head">
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="status-line" aria-label={`${percent}% complete`}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="meter-foot">
        <span>{completed} completed</span>
        <span>{total - completed} pending</span>
      </div>
    </div>
  )
}
