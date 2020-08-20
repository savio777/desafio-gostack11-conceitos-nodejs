const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function testId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json();
  }

  return next();
}

app.use("/repositories/:id", testId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const findIndex = repositories.findIndex((r) => r.id == id);

  if (findIndex < 0) {
    return response.status(400).send(null);
  }

  repositories[findIndex].title = title;
  repositories[findIndex].url = url;
  repositories[findIndex].techs = techs;

  const repo = repositories[findIndex];

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findIndex = repositories.findIndex((r) => r.id == id);

  if (findIndex < 0) {
    return response.status(400).send({ error: "id not found" });
  }

  repositories.splice(findIndex, 1);

  return response.status(204).send(null);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findIndex = repositories.findIndex((r) => r.id == id);

  if (findIndex < 0) {
    return response.status(400).send({ error: "id not found" });
  }

  repositories[findIndex].likes = repositories[findIndex].likes + 1;

  return response.json(repositories[findIndex]);
});

module.exports = app;
