const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  {
    flags: "a", // 'a' = 기존 파일에 추가 (append)
  }
);

module.exports = accessLogStream;
