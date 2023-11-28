import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/post-codealong"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Create Model
const Task = mongoose.model('Task', {
  text: {
    type: String,
    required: true,
    minlength: 5
  },
  complete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//API
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(tasks);
});

//this is where we take the data from the client and add it to the database
app.post('/tasks', async (req, res) => {
  //Retrieve the info sent by the client to our API endpoint
  const { text, complete } = req.body; //in postman specify that the body will be a json object, which decomposes into text and complete (take that json body and give us text and complete)

  //Use our mongoose model to create the database entry
  const task = new Task({ text, complete });

  try {
    //Success case
    const savedTask = await task.save();
    res.status(200).json(savedTask);
  } catch (err) {
    //Gives the user a messagend and returns the errors that mongo gives us back
    res.status(400).json({ message: 'Could not save task to the Database', errors: err.errors });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
