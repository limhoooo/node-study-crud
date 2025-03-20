const express = require("express");
const path = require("path");
const morgan = require("morgan");
const accessLogStream = require("./utils/log");
const todoRouter = require("./routes/todo.js");
const app = express();

app.use(morgan("combined", { stream: accessLogStream }));

app.use("/", express.static(path.join(__dirname, "public")));

// app.use("/", (req, res, next) => {
//   if(req.session.id) {
//     express.static(path.join(__dirname, "public"))(req, res, next)
//   }else {
//     next()
//   }
// });

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

app.use("/todo", todoRouter);

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")} 가동중`);
});
