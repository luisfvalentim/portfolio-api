const pool = require("../db");

const SORT_FIELDS = {
  id: "id",
  createdAt: "created_at",
  title: "title",
  done: "done",
};

async function listTasks({
  status,
  search,
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  const SORT_FIELDS = {
    id: "id",
    createdAt: "created_at",
    title: "title",
    done: "done",
  };

  const safeSort = SORT_FIELDS[sort] || "created_at";
  const safeOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

  let where = "";
  const values = [];
  let index = 1;

  if (search) {
    where += `title ILIKE $${index++}`;
    values.push(`%${search}%`);
  }

  if (status === "done") {
    where += where ? " AND done = true" : "done = true";
  }

  if (status === "pending") {
    where += where ? " AND done = false" : "done = false";
  }

  if (where) where = `WHERE ${where}`;

  const countQuery = `SELECT COUNT(*)::int AS total FROM tasks ${where}`;
  const countResult = await pool.query(countQuery, values);
  const total = countResult.rows[0].total;

  const dataQuery = `
    SELECT id, title, done, created_at AS "createdAt"
    FROM tasks
    ${where}
    ORDER BY ${safeSort} ${safeOrder}
    LIMIT $${index} OFFSET $${index + 1}
  `;

  const dataResult = await pool.query(dataQuery, [
    ...values,
    safeLimit,
    offset,
  ]);

  return {
    rows: dataResult.rows,
    total,
    page: safePage,
    limit: safeLimit,
  };
}

async function getTaskById(id) {
  const { rows } = await pool.query(
    'SELECT id, title, done, created_at AS "createdAt" FROM tasks WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function createTask(title) {
  const { rows } = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, done, created_at AS "createdAt"',
    [title]
  );
  return rows[0];
}

async function updateTask(id, { title, done }) {
  const current = await getTaskById(id);
  if (!current) return null;

  const newTitle = title !== undefined ? title : current.title;
  const newDone = done !== undefined ? done : current.done;

  const { rows } = await pool.query(
    'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING id, title, done, created_at AS "createdAt"',
    [newTitle, newDone, id]
  );

  return rows[0];
}

async function deleteTask(id) {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  return result.rowCount; // 0 ou 1
}

module.exports = { listTasks, getTaskById, createTask, updateTask, deleteTask };