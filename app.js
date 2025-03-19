const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const morgan = require("morgan");
const accessLogStream = require("./utils/log");

const app = express();

app.use(morgan("combined", { stream: accessLogStream }));
app.use("/", express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use((req, res, next) => {
  console.log("미들웨어 작동");
  next();
});

app.set("port", process.env.PORT || 3000);

// static 으로 대체
// app.get("/", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

app.get("/todo", async (req, res) => {
  const fileJson = await fs.readFile(path.join(__dirname, "db/db.json"));
  res.status(200).json(JSON.parse(fileJson));
});

app.post("/todo", async (req, res) => {
  try {
    const fileJson = await fs.readFile(path.join(__dirname, "db/db.json"));
    const id = Date.now();
    let fileJsonList = [...JSON.parse(fileJson), { ...req.body, id }];

    await fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(fileJsonList)
    );
    res.json({ message: "Todo added", todo: req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to update file" });
  }
});

app.delete("/todo", async (req, res) => {
  const fileJson = await fs.readFile(path.join(__dirname, "db/db.json"));
  let fileJsonList = JSON.parse(fileJson);
  const filterList = fileJsonList.filter((item) => item.id !== req.body.id);

  await fs.writeFile(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(filterList)
  );
  res.json({ message: "Todo delete", todo: req.body });
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")} 가동중`);
});
