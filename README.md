# TaskFlow API 

API REST desenvolvida com **Node.js, Express e PostgreSQL**, com arquitetura em camadas e suporte a filtros, paginação e ordenação.

Projeto criado como base para aplicação Full Stack (React + Node).

---

## 🛠 Tecnologias

- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- Nodemon
- Dotenv

---

## 📂 Estrutura do Projeto

```
src/
server.js
db.js
routes/
controllers/
services/
repositories/
```

## Arquitetura em camadas:

- **Routes** → definição das rotas HTTP  
- **Controller** → manipulação de request/response  
- **Service** → regras de negócio  
- **Repository** → acesso ao banco de dados  
- **Database** → PostgreSQL
