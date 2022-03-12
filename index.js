const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

db.serialize(function () {
  db.run(
    "CREATE TABLE IF NOT EXISTS speaker (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, title TEXT, about TEXT, workplace TEXT)",
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Table created successfully");
    }
  );

  const insertQuery = `INSERT INTO speaker (name, title, about, workplace) VALUES (?, ?, ?, ?)`;
  db.run(
    insertQuery,
    ["John Doe", "CEO", "John Doe is a CEO", "Google"],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );

  db.run(
    insertQuery,
    ["Jane Doe", "COO", "Jane Doe is a COO", "Facebook"],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );

  db.run(
    insertQuery,
    ["John Smith", "CTO", "John Smith is a CTO", "Apple"],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );

  db.run(
    insertQuery,
    ["Jane Smith", "CMO", "Jane Smith is a CMO", "Microsoft"],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );
});

app.get("/api/speakers", (req, res) => {
  db.all("SELECT * FROM speaker", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
});

app.get("/api/speaker/:id", (req, res) => {
  db.get(`SELECT * FROM speaker WHERE id = ${req.params.id}`, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(row);
  });
});

app.post("/api/speaker", (req, res) => {
  const { name, title, about, workplace } = req.body;
  db.run(
    `INSERT INTO speaker (name, title, about, workplace) VALUES (?, ?, ?, ?)`,
    [name, title, about, workplace],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );
  res.status(200).send({ message: "Successfully inserted speaker!" });
});

app.put("/api/speaker", (req, res) => {
  const { id, name, title, about, workplace } = req.body;
  db.run(
    `UPDATE speaker SET name = ?, title = ?, about = ?, workplace = ? WHERE id = ?`,
    [name, title, about, workplace, id],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Updated a row.");
      }
    }
  );
  res.status(200).send({ message: "Successfully updated speaker!" });
});

app.delete("/api/speaker/:id", (req, res) => {
  db.run(`DELETE FROM speaker WHERE id = ${req.params.id}`, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Deleted a row.");
  });
  res.status(200).send({ message: "Successfully deleted speaker!" });
});

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/speakers", (req, res) => {
  db.all("SELECT id, name, workplace FROM speaker", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("speakers", { title: "Speakers", speakers: rows });
  });
});

app.post("/speakers", (req, res) => {
  const { name, title, about, workplace } = req.body;
  db.run(
    `INSERT INTO speaker (name, title, about, workplace) VALUES (?, ?, ?, ?)`,
    [name, title, about, workplace],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );
  res.redirect("/speakers");
});

app.get("/speaker/:id", (req, res) => {
  db.get(
    `SELECT * FROM speaker WHERE id = "${req.params.id}" limit 1`,
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("speaker", { speaker: row });
    }
  );
});

app.post("/speaker/update/:id", (req, res) => {
  const { name, title, about, workplace } = req.body;
  db.run(
    `UPDATE speaker SET name = ?, title = ?, about = ?, workplace = ? WHERE id = ?`,
    [name, title, about, workplace, req.params.id],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Updated a row.");
      }
    }
  );
  res.redirect("/speakers");
});

app.get("/speaker/delete/:id", (req, res) => {
  db.run(`DELETE FROM speaker WHERE id = ${req.params.id}`, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Deleted a row.");
  });
  res.redirect("/speakers");
});

app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});
