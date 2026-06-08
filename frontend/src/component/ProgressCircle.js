import "../styles/ProgressCircle.css";

export default function ProgressCircle({
  progress
}) {

  let color = "#ef4444";

  if (progress >= 70) {
    color = "#22c55e";
  }
  else if (progress >= 40) {
    color = "#f59e0b";
  }

  return (
    <div
      className="progress-circle"
      style={{
        background: `conic-gradient(
          ${color}
          ${progress * 3.6}deg,
          #e5e7eb 0deg
        )`
      }}
    >
      <div
        className="progress-inner"
      >
        {progress}%
      </div>
    </div>
  );
}