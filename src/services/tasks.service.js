const repo = require("../repositories/tasks.repository");

async function listTasks(query) {
  return repo.listTasks(query);
}

async function getTaskById(id) {
  return repo.getTaskById(id);
}

async function createTask({ title }) {
  if (!title || typeof title !== "string" || !title.trim()) {
    const err = new Error("title é obrigatório (string não vazia)");
    err.statusCode = 400;
    throw err;
  }
  return repo.createTask(title.trim());
}

async function updateTask(id, { title, done }) {
  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    const err = new Error("title deve ser string não vazia");
    err.statusCode = 400;
    throw err;
  }
  if (done !== undefined && typeof done !== "boolean") {
    const err = new Error("done deve ser boolean");
    err.statusCode = 400;
    throw err;
  }

  const updated = await repo.updateTask(id, {
    title: title !== undefined ? title.trim() : undefined,
    done,
  });

  if (!updated) {
    const err = new Error("Task não encontrada");
    err.statusCode = 404;
    throw err;
  }

  return updated;
}

async function deleteTask(id) {
  const rowCount = await repo.deleteTask(id);
  if (rowCount === 0) {
    const err = new Error("Task não encontrada");
    err.statusCode = 404;
    throw err;
  }
}

module.exports = { listTasks, getTaskById, createTask, updateTask, deleteTask };