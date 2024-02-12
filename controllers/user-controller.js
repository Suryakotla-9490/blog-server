import User from "../model/User.js";
import bcrypt from "bcryptjs";
export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({}, { name: 1, email: 1, blogs: 1, following: 1, followers: 1 });

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    } else {
      return res.status(200).json(allUsers);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User Already Exists! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "Couldnt Find User By This Email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  return res
    .status(200)
    .json({ message: "Login Successfull", user: existingUser });
};

export const follow = async (req, res) => {
  try {

    const { requestId } = req.body;
    console.log(requestId)
    const existingUserser = await User.findById(req.params.id);
    const UserToFollow = await User.findById(requestId);
    existingUserser.following.push(requestId);
    // if (existingUserser.following.includes(requestId)) {
    //   return res.status(200).send('You are already following this person')
    // }
    await existingUserser.save();
    // if (UserToFollow.followers.includes(req.params.id)) {
    //   return res.status(200).send('You are already following this person')
    // }
    UserToFollow.followers.push(req.params.id);
    await UserToFollow.save();
    return res.status(200).json({ message: "Followed successfull" });
  } catch (err) {
    console.log(err);
  }
};

export const unfollow = async (req, res) => {
  try {
    const { requestId } = req.body;
    const existingUserser = await User.findById(req.params.id);
    const UserToFollow = await User.findById(requestId);
    existingUserser.following.pull(requestId);

    await existingUserser.save();

    UserToFollow.followers.pull(req.params.id);
    await UserToFollow.save();
    return res.status(200).json({ message: "unFollowed successfull" });
  } catch (err) {
    console.log(err);
  }
};

export const getfollowers= async(req, res)=> {
 
try {
  const followers=await User.findById(req.params.id).populate('followers')
  return res.status(200).send(followers)
  
} catch (error) {
  console.log(error)
}
}

export const getfollowing= async(req, res)=> {
  const userid = req.body
try {
  const following=await User.findById(req.params.id).populate('following')
  return res.status(200).send(following)
  
} catch (error) {
  console.log(error)
}
}
