import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { genPassword } from "../helper.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//update
router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { _id, userName, profilePic } = request.body;
  console.log(request.body);
  const userNameFromDB = await User.findOne({ userName });
  const user = await User.findOne({ _id });
  //account owner can updtate his/her account
  if (id === _id) {
    if (
      userNameFromDB &&
      user._id.toString() != userNameFromDB._id.toString()
    ) {
      response.status(401).send({ message: "Username already exists" });
      return;
    }
    if (
      request.body.password &&
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(
        request.body.password
      )
    ) {
      response.status(401).send({ message: "Password pattern does not match" });
      return;
    }
    if (request.body.password) {
      request.body.password = await genPassword(request.body.password);
    }
    if (request.body.password && request.body.password.length < 8) {
      response.status(401).send({ msg: "Password Must be longer" });
      return;
    }
    const updatePostUserName = await Post.updateMany(
      { userName: user.userName },
      { $set: { userName, userProfilePic: profilePic } }
    );

    const updateUser = await User.findByIdAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: request.body,
      },
      { new: true }
    );
    response.send(updateUser);
  } else {
    response.status(401).send({ message: "You don't have permission" });
  }
});

//Delete User

router.delete("/:id", async (request, response) => {
  const { id } = request.params;
  const { _id } = request.body;
  //account owner can delete his/her account
  if (id === _id) {
    const user = await User.findById(id); // check if the user is available
    if (user) {
      //if user available
      await Post.deleteMany({ userName: user.userName });
      await User.findByIdAndDelete({ _id: id });
      response.send({ message: "User has been deleted" });
    } else {
      response.status(404).send({ message: "user not found" });
    }
  } else {
    response.status(401).send({ message: "you dont have permission" });
  }
});

//Get User by id
router.get("/:id", async (request, response) => {
  try {
    console.log(request.params.id);

    const value = request.params.id.trim(); // id from params to find particular user

    const user = await User.findById(value); // search user by id
    if (user) {
      const { password, ...others } = user._doc;
      response.send(others);
    } else {
      response.status(404).send({ message: "no user found" });
    }
  } catch (err) {
    response.status(401).send(err);
  }
});

export const usersRouter = router;
