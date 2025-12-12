import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/eduapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

const courseSchema = new mongoose.Schema({ name: String });
const Course = mongoose.model("Course", courseSchema);

app.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

app.listen(3003, () => console.log("Course service running on 3003"));
