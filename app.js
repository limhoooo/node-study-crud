const express = require("express");
const path = require("path");
const morgan = require("morgan");
const accessLogStream = require("./utils/log");

const todoRouter = require("./routes/todo");

const app = express();

app.use(morgan("combined", { stream: accessLogStream }));
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors()); // 모든 도메인에서 요청 허용

app.use(express.json());
app.use("/api/todo", todoRouter);

app.listen(3000, () => {
  console.log("3000 포트 서버 실행");
});
