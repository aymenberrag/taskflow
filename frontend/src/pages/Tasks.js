import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../component/TaskCard";
import "../styles/Tasks.css";

const filters = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const params = selectedDate
          ? { date: selectedDate }
          : { filter: activeFilter };
        const query = new URLSearchParams(params).toString();
        const res = await api.get(`/tasks/?${query}`);

        if (!cancelled) {
          setTasks(res.data.tasks || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(
            err.response?.data?.message ||
              "Unable to load tasks. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [activeFilter, selectedDate]);

  const onFilterClick = (filterKey) => {
    setSelectedDate("");
    setActiveFilter(filterKey);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setActiveFilter("all");
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Filter tasks by date and show your work in one place.</p>
        </div>
      </div>

      <div className="tasks-controls">
        <div className="task-tabs">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`task-tab ${activeFilter === filter.key && !selectedDate ? "active" : ""}`}
              onClick={() => onFilterClick(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="date-filter">
          <label htmlFor="task-date">Specific date</label>
          <input
            id="task-date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
          {selectedDate ? (
            <button
              className="clear-date-btn"
              type="button"
              onClick={() => setSelectedDate("")}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {error && <div className="tasks-error">{error}</div>}

      <div className="tasks-grid">
        {loading ? (
          <div className="tasks-loading">Loading tasks…</div>
        ) : tasks.length === 0 ? (
          <div className="tasks-empty">
            No tasks match the selected filter.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
