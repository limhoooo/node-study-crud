const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const requestIp = require("request-ip");

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
  // const fileJson = await readDB();

  const fileJson = await Comment.findAll({});
  const comments = fileJson.map((comment) => ({
    id: comment.id,
    name: comment.comment,
    ip: comment.ip,
  }));

  res.status(200).json(comments);
});

router.post("/", async (req, res) => {
  try {
    const comment = req.body.name;

    if (!comment || comment.trim() === "") {
      return res.status(500).json({ error: "Comment cannot be empty" });
    }

    await Comment.create({
      comment: req.body.name,
      ip: requestIp.getClientIp(req),
    });

    res.json({ message: "Todo added", todo: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update file" });
  }
});

router.delete("/", async (req, res) => {
  // const fileJson = await readDB();
  // const filterList = fileJson.filter((item) => item.id !== req.body.id);
  // await writeDB(filterList);
  const findComment = await Comment.findAll({
    attributes: ["comment", "ip"],
    where: {
      id: req.body.id,
    },
  });

  if (findComment[0].ip !== requestIp.getClientIp(req)) {
    return res.status(500).json({ message: "다른사용자의 댓글입니다 ㅋㅋ" });
  }

  await Comment.destroy({
    where: { id: req.body.id },
  });
  res.json({ message: "삭제되었습니다", todo: req.body });
});

module.exports = router;
