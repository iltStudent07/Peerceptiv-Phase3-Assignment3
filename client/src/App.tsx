import { useState, useEffect } from "react";

const API = "/api";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface HealthStatus {
  status: string;
  database: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    loadTasks();
    fetch("/health").then((r) => r.json()).then(setHealth);
  }, []);

  async function loadTasks() {
    const res = await fetch(`${API}/tasks`);
    setTasks(await res.json());
  }

  async function addTask(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    loadTasks();
  }

  async function toggleTask(task: Task) {
    await fetch(`${API}/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    loadTasks();
  }

  async function deleteTask(id: string) {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Docker Compose Task Manager</h1>
      {health && (
        <p style={{ color: "#888", fontSize: "0.9rem" }}>
          API: {health.status} | DB: {health.database}
        </p>
      )}
      <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "8px 16px", background: "#2574a9", color: "white", border: "none", borderRadius: 4 }}>
          Add
        </button>
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li key={t._id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t)} />
            <span style={{ flex: 1, textDecoration: t.completed ? "line-through" : "none", color: t.completed ? "#999" : "#333" }}>
              {t.title}
            </span>
            <button onClick={() => deleteTask(t._id)} style={{ color: "#c0392b", border: "none", background: "none", cursor: "pointer" }}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
