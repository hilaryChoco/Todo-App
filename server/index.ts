import "dotenv/config";
import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const ALLOWED_PRIORITIES = ["urgent", "high", "medium", "low"] as const;
type Priority = (typeof ALLOWED_PRIORITIES)[number];

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");  
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err: any) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        completed,
        important,
        priority,
        start_date,
        start_time,
        end_date,
        end_time,
        created_at,
        updated_at
      FROM tasks
      ORDER BY
        completed ASC,
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
          ELSE 5
        END,
        end_date IS NULL,
        end_date,
        end_time,
        created_at DESC
    `);

    const tasks = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      important: row.important,
      priority: row.priority,
      startDate: row.start_date,
      startTime: row.start_time,
      endDate: row.end_date,
      endTime: row.end_time,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/tasks", async (req, res) => {
  const {
    title,
    description,
    important,
    priority,
    startDate,
    startTime,
    endDate,
    endTime,
  } = req.body;


  if (!title || String(title).trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  // Normalisation de la priorité et important
  const normalizedPriority: Priority =
    ALLOWED_PRIORITIES.includes(String(priority).toLowerCase() as Priority)
      ? (String(priority).toLowerCase() as Priority)
      : "medium";

  const normalizedImportant =
    typeof important === "boolean" ? important : false;

  // Insertion DB
  try {
    const result = await pool.query(
      `INSERT INTO tasks
        (title, description, important, priority, start_date, start_time, end_date, end_time)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING
        id, title, description, completed, important, priority,
        start_date, start_time, end_date, end_time,
        created_at, updated_at`,
      [
        String(title).trim(),
        description ?? null,
        normalizedImportant,
        normalizedPriority,
        startDate ?? null,
        startTime ?? null,
        endDate ?? null,
        endTime ?? null,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const {
    title,
    description,
    completed,
    important,
    priority,
    startDate,
    startTime,
    endDate,
    endTime,
  } = req.body;

  // Validation légère : priorité si présente
  let normalizedPriority: Priority | null = null;
  if (priority !== undefined) {
    const p = String(priority).toLowerCase();
    if (!ALLOWED_PRIORITIES.includes(p as Priority)) {
      return res.status(400).json({
        error: `Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(", ")}`,
      });
    }
    normalizedPriority = p as Priority;
  }

  // Validation légère : booleans si présents
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean" });
  }
  if (important !== undefined && typeof important !== "boolean") {
    return res.status(400).json({ error: "important must be a boolean" });
  }

  // Update partiel avec COALESCE (si valeur non fournie -> on garde l'ancienne)
  try {
    const result = await pool.query(
      `UPDATE tasks
       SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         completed = COALESCE($3, completed),
         important = COALESCE($4, important),
         priority = COALESCE($5, priority),
         start_date = COALESCE($6, start_date),
         start_time = COALESCE($7, start_time),
         end_date = COALESCE($8, end_date),
         end_time = COALESCE($9, end_time),
         updated_at = NOW()
       WHERE id = $10
       RETURNING
         id, title, description, completed, important, priority,
         start_date, start_time, end_date, end_time,
         created_at, updated_at`,
      [
        title !== undefined ? String(title).trim() : null,
        description !== undefined ? description : null,
        completed !== undefined ? completed : null,
        important !== undefined ? important : null,
        normalizedPriority !== null ? normalizedPriority : null,
        startDate !== undefined ? startDate : null,
        startTime !== undefined ? startTime : null,
        endDate !== undefined ? endDate : null,
        endTime !== undefined ? endTime : null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ ok: true, deletedId: result.rows[0].id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
