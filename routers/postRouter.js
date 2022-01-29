import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

//Create Post
router.post("/", async (request, response) => {
  const { title, description, userName, photo, categories, userProfilePic } =
    request.body;
  const titleFromDb = await Post.findOne({ title });

  if (titleFromDb) {
    response.status(401).send({ message: "Title not available" });
    return;
  }
  if (!userName) {
    response.status(401).send({ message: "User Name required" });
    return;
  }
  if (!title) {
    response.status(401).send({ message: "Title required" });
    return;
  }
  if (!description) {
    response.status(401).send({ message: "description required" });
    return;
  }
  const data = {
    title,
    description,
    userName,
    photo,
    categories,
    userProfilePic,
  };
  const post = new Post(data);
  const addPost = await post.save();
  response.send(addPost);
});

//Edit Post
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { userName } = request.body;
    const post = await Post.findById(id);
    if (post && post.userName === userName) {
      const editPost = await Post.findByIdAndUpdate(
        id,
        { $set: request.body },
        { new: true }
      );
      response.send({ message: "post updated successfully", editPost });
    } else {
      response.status(401).send({ message: "you dont have permission" });
    }
  } catch (err) {
    response.send(err);
  }
});

//Delete Post
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { userName } = request.body;
    const post = await Post.findById(id);
    if (post && post.userName === userName) {
      const deletePost = await post.delete();
      response.send({ message: "post has been deleted" });
    } else {
      response.status(401).send({ message: "you dont have permission" });
    }
  } catch (err) {
    response.send(err);
  }
});

//Get Post By Id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const post = await Post.findById(id);
    if (!post) {
      response.status(404).send({ message: "no post found" });
      return;
    }
    response.send(post);
  } catch (err) {
    response.send(err);
  }
});

//Get All Post
router.get("/", async (request, response) => {
  const { userName } = request.query;
  if (userName) {
    const post = await Post.find({ userName }).sort({ createdAt: -1 });
    response.send(post);
  } else {
    const post = await Post.find().sort({ createdAt: -1 });
    response.send(post);
  }
});
export const PostRouter = router;
