import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with retry
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/peerceptiv";

async function connectWithRetry(): Promise<void> {
  const maxRetries = 10;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("Connected to MongoDB");
      return;
    } catch (err) {
      console.log(`MongoDB connection attempt ${i}/${maxRetries} failed. Retrying in 3s...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.error("Could not connect to MongoDB");
  process.exit(1);
}

// Task model
interface ITask {
  title: string;
  completed: boolean;
  createdAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model<ITask>("Task", taskSchema);

// Routes
app.get("/health", async (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ status: "ok", database: dbStatus });
});

app.get("/api/tasks", async (_req: Request, res: Response) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post("/api/tasks", async (req: Request, res: Response) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(task);
});

app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

const PORT = Number(process.env.PORT) || 4000;
connectWithRetry().then(() => {
  app.listen(PORT, () => console.log(`API on port ${PORT}`));
});