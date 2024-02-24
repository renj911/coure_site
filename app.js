const express = require("express");
const app = express();
const fs = require("fs");
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/views"));

let data = fs.readFileSync("db.json");
let parseData = JSON.parse(data);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/users", (req, res) => {
  res.render("users", { users: parseData });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  for (let user of parseData.users) {
    if (user.email === email && user.password === password) {
      console.log("User exists");
      res.redirect("/users");
      return;
    }
  }
});

app.get("/register", (req, res) => {
  res.render("reg");
});

app.post("/register", (req, res) => {
  let { email, password, password2 } = req.body;
  console.log(email, password, password2);
  console.log(parseData);

  if (password !== password2) {
    res.render("Passwords do not match!");
    return;
  }

  let userExists = false;

  for (let user of parseData.users) {
    if (user.email === email) {
      userExists = true;
      break;
    }
  }

  if (userExists) {
    res.render("User already exists!");
    res.redirect("/");
  } else {
    res.render("User does not exist");
    parseData.users.push({ email, password });
    fs.writeFileSync("db.json", JSON.stringify(parseData, null, 2));
  }
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
