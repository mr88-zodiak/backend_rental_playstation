require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db/db");
const { Model } = require("objection");
const port = 5000;
const cookies = require("cookie-parser");
const route = require("./router/router");
const app = express();

Model.knex(db);

// middleware
app.use(express.json());
app.use(cookies());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());

app.use("/", route);

app.listen(port, () => console.log("http://localhost:" + port));

// app.listen(port, () => {
//   db.raw("select 1=1 as test")
//     .then((data) => {
//       console.log("koneksi db: ", data.rows[0].test);
//       console.log("DB User yang digunakan:", process.env.DB_USER);
//     })
//     .catch((err) => console.log(err));
// });

// module.exports = app;
