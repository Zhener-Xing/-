// 这是「快递员」的工作手册，只改下面3行！
const MYSQL_HOST = "116.62.36.98"; // 比如 123.45.67.89（之前配MySQL的服务器IP）
const MYSQL_PWD = "@Xze20070325";       // 你之前设的root密码
const MYSQL_DB = "study_experience";     // 你之前建的数据库名（不用改，除非你改了名字）

// 下面的内容不用动，复制就行
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// 允许网页跨域访问
app.use(cors());
// 解析网页提交的信息
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接MySQL数据库（与 user_uploads 表对应：school, major, city, gaokao_year, experience, label, upload_time）
const db = mysql.createConnection({
  host: MYSQL_HOST,
  user: 'root',
  password: MYSQL_PWD,
  database: MYSQL_DB,
  port: 3306,
  charset: 'utf8mb4'
});
// 测试数据库连接
db.connect((err) => {
  if (err) {
    console.log("数据库连接失败：", err);
    return;
  }
  console.log("✅ 数据库连接成功！");
});

// ********** 功能1：接收网页提交的用户信息，存到MySQL **********
app.post('/save-data', (req, res) => {
  // 接收网页传过来的信息（对应你之前建的user_uploads表字段）
  const { school, major, city, gaokao_year, experience, label } = req.body;
  // 把信息插入MySQL表
  const sql = `INSERT INTO user_uploads (school, major, city, gaokao_year, experience, label) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [school, major, city, gaokao_year, experience, label], (err, result) => {
    if (err) {
      res.send({ code: 500, msg: "存数据失败" });
      return;
    }
    res.send({ code: 200, msg: "存数据成功！" });
  });
});

// ********** 功能2：从MySQL取数据，返回给网页展示 **********
app.get('/get-data', (req, res) => {
  // 从MySQL表中读取所有数据
  const sql = `SELECT * FROM user_uploads ORDER BY upload_time DESC`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: "取数据失败" });
      return;
    }
    res.send({ code: 200, data: data }); // 把数据返回给网页
  });
});

// 启动「快递员」服务，监听3000端口
app.listen(3000, () => {
  console.log("✅ 「快递员」已上岗！地址：http://localhost:3000");
});

