import "../styles/StatsCard.css";

export default function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="stats-card">
      <div className="stats-header">
        {Icon && <Icon className="stats-icon" />}
        <h3>{title}</h3>
      </div>
      <h1>{value}</h1>
    </div>
  );
}