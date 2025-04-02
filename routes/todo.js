const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { Comment } = require("../models"); // Comment 모델 가져오기

const router = express.Router();

const DB_PATH = path.join(__dirname, "../db/db.json");

// 파일 읽기 함수
const readDB = async () => {
  const fileJson = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(fileJson);
};

// 파일 쓰기
const writeDB = async (data) => {
  // db 폴더 없으면 만들어주는 코드 필요할듯듯
  await fs.writeFile(DB_PATH, JSON.stringify(data));
};

router.get("/", async (req, res) => {
  const fileJson = await readDB();
  // const fileJson = await Comment.findAll({});
  console.log(fileJson);
  const comments = fileJson.map((comment) => ({
    id: comment.id,
    name: comment.name,
  }));

  console.log(comments);
  res.status(200).json(comments);
});

router.post("/", async (req, res) => {
  try {
    const fileJson = await readDB();
    const id = Date.now();
    let fileJsonList = [...fileJson, { ...req.body, id }];
    await writeDB(fileJsonList);
    // await Comment.create({
    //   comment: req.body.name,
    //   commenter: 1,
    // });

    console.log();
    res.json({ message: "Todo added", todo: req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to update file" });
  }
});

router.delete("/", async (req, res) => {
  const fileJson = await readDB();
  const filterList = fileJson.filter((item) => item.id !== req.body.id);
  await writeDB(filterList);
  res.json({ message: "Todo delete", todo: req.body });
});

module.exports = router;
