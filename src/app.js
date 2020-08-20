const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs: techs.split(", "), likes: 0 };

  repositories.push(repo);

  return response.json({ repo });
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const findIndex = repositories.findIndex((r) => r.id == id);
  const findRepo = repositories.find((r) => r.id == id);

  const repo = {
    id,
    title,
    url,
    techs: techs.split(", "),
    likes: findRepo.likes,
  };

  repositories[findIndex] = repo;

  return response.json({ repo });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findIndex = repositories.findIndex((r) => r.id == id);

  repositories.splice(findIndex, 1);

  return response.json({ deleted: id });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findIndex = repositories.findIndex((r) => r.id == id);
  const findRepo = repositories.find((r) => r.id == id);

  const repo = {
    id,
    title: findRepo.title,
    url: findRepo.url,
    techs: findRepo.techs,
    likes: findRepo.likes + 1,
  };

  repositories[findIndex] = repo;

  return response.json({ repo });
});

module.exports = app;
