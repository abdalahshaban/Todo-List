var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("./models/todos");
let todosSchema = mongoose.model("todos");

// var MongoClient = require('mongodb').MongoClient;
mongoose
  .connect("mongodb://localhost:27017/todoapp", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("db connected");
  });

// var url = 'mongodb://localhost:27017/todoapp';
var app = express();

app.get("/", (req, res, next) => {
  todosSchema.find({}, (err, data) => {
    if (!err) {
      console.log(data);
      res.render("index", {
        todos: data
      });
    } else {
      return console.log(err);
    }
  });
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.post("/todo/add", (req, res) => {
  // console.log(req.body);

  let todo = new todosSchema({
    text: req.body.text,
    body: req.body.body
  });
  // console.log(event);
  todo.save((err, data) => {
    if (!err) {
      console.log("toDo Add");
      console.log(data);

      res.redirect("/");
    } else {
      return console.log(err);
    }
  });
});

app.delete("/todo/del/:id", (req, res) => {
  console.log(req.params.id);

  todosSchema.deleteOne(
    {
      _id: req.params.id
    },
    (err, data) => {
      if (!err) {
        console.log("del");
        res.sendStatus(200);
      } else {
        return console.log(err);
      }
    }
  );
});

app.get("/todo/edit/:id", (req, res) => {
  todosSchema.findOne({ _id: req.params.id }, (error, data) => {
    if (!error) {
      res.render("edit", { todo: data });
    } else {
      return console.log(error);
    }
  });
});

app.post("/todo/edit/:id", (req, res) => {
  console.log(req.params.id);
  todosSchema.update(
    {
      _id: req.params.id
    },
    {
      $set: {
        text: req.body.text,
        body: req.body.body
      }
    },
    (error, file) => {
      if (!error) {
        console.log("update done");

        res.redirect("/");
      } else {
        return console.log(error);
      }
    }
  );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("server is connected...3000");
});

module.exports = app;
