const tasksService = require("../services/tasks.service");

async function list(req, res, next) {
  try {
    const { status, search, page, limit, sort, order } = req.query;

    const result = await tasksService.listTasks({
      status,
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sort: sort || "createdAt",
      order: order || "desc",
    });

    return res.json({
      data: result.rows,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "id inválido" });

    const task = await tasksService.getTaskById(id);
    if (!task) return res.status(404).json({ error: "Task não encontrada" });

    return res.json(task);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const task = await tasksService.createTask(req.body);
    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "id inválido" });

    const task = await tasksService.updateTask(id, req.body);
    return res.json(task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "id inválido" });

    await tasksService.deleteTask(id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };