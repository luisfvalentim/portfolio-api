const express = require("express");
const cors = require("cors");
require("dotenv").config();

const tasksRoutes = require("./routes/tasks.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API rodando 🚀" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/tasks", tasksRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  return res.status(status).json({
    error: err.message || "Erro interno",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));