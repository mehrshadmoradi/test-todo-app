import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// In-memory data store (for simplicity)
let todos = [
  {
    _id: Math.floor(Math.random() * 1000000).toString(),
    title: "task 6",
    description: "description 6",
    start_time: "08:30",
    end_time: "09:30",
    is_completed: true,
  },
  {
    _id: Math.floor(Math.random() * 1000000).toString(),
    title: "task 5",
    description: "description 5",
    start_time: "07:00",
    end_time: "08:00",
    is_completed: false,
  },
  {
    _id: Math.floor(Math.random() * 1000000).toString(),
    title: "task 4",
    description: "description 4",
    start_time: "05:30",
    end_time: "06:30",
    is_completed: false,
  },
  {
    _id: Math.floor(Math.random() * 1000000).toString(),
    title: "task 3",
    description: "description 3",
    start_time: "04:00",
    end_time: "05:00",
    is_completed: false,
  },
  {
    _id: Math.floor(Math.random() * 1000000).toString(),
    title: "task 2",
    description: "description 2",
    start_time: "02:30",
    end_time: "03:30",
    is_completed: true,
  },
  {
    _id: Math.floor(Math.random() * 1000000).toString(),
    title: "task 1",
    description: "description 1",
    start_time: "01:00",
    end_time: "02:00",
    is_completed: false,
  },
];

// Create a to-do (C)
app.post("/todos", (req, res) => {
  const { title, description, start_time, end_time } = req.body;

  if (isOverlapping(start_time, end_time)) {
    return res
      .status(400)
      .json({ message: "Time slot overlaps with an existing task." });
  }

  const todo = {
    _id: Math.floor(Math.random() * 1000000).toString(),
    title,
    description,
    start_time,
    end_time,
    is_completed: false,
  };

  todos.unshift(todo);
  res.status(201).json(todo);
});

// Get all to-dos (R)
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Update a to-do (U)
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;
  const index = todos.findIndex((t) => t._id === id);

  if (index === -1) {
    return res.status(404).json({ message: "To-do not found" });
  }

  if (isOverlapping(start_time, end_time, id)) {
    return res
      .status(400)
      .json({ message: "Time slot overlaps with an existing task." });
  }

  todos[index] = { ...todos[index], ...req.body };
  res.json(todos[index]);
});

// Delete a to-do (D)
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((t) => t.id !== id);
  res.status(204).send();
});

const isOverlapping = (startTime, endTime, excludeId) => {
  return todos.some((todo) => {
    if (excludeId && todo._id === excludeId) return false; // Skip the current todo being updated

    return (
      (startTime >= todo.start_time && startTime < todo.end_time) || // Overlaps start
      (endTime > todo.start_time && endTime <= todo.end_time) || // Overlaps end
      (startTime <= todo.start_time && endTime >= todo.end_time) // Completely overlaps
    );
  });
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
