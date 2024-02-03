const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const db = require('./models');
const Role = db.role;

//DB Role Init function
const initial = () => {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'user' to roles collection");
        });
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'moderator' to roles collection");
        });
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

let corsOptions = {
    origin: "http://localhost:3000"
  };

const indexRouter = require('./routes/routes');
const userRouter = require('./routes/users/routes');
const recipesRouter = require('./routes/recipes/routes');

const mongoString = process.env.DATABASE_URL

db.mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
    initial();
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', indexRouter)
app.use('/api/recipes', recipesRouter)
require('./routes/auth/routes')(app);
require('./routes/users/routes')(app);

app.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
})

module.exports = app;