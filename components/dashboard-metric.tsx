type DashboardMetricProps = {
  label: string;
  value: number;
};

export function DashboardMetric({ label, value }: DashboardMetricProps) {
  return (
    <article className="placeholder-card">
      <h2>{label}</h2>
      <p>{value}</p>
    </article>
  );
}
