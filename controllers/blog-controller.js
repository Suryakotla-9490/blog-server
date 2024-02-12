import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async (req, res) => {
  let blogs;

  try {
    blogs = await Blog.find().populate("author");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (blogs.length === 0) {
    return res.status(404).json({ message: "No Blogs Found" });
  }

  return res.status(200).json(blogs);
};

export const addBlog = async (req, res, next) => {
  const { title, description, author } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(author);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find user by this ID" });
  }

  const blog = new Blog({
    title: title,
    description: description,
    author: existingUser._id, // Set author to existingUser's ID
  });

  try {
    const savedBlog = await blog.save();
    existingUser.blogs.push(savedBlog._id);
    await existingUser.save();
    return res.status(200).json({ blog: savedBlog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable To Update The Blog" });
  }
  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable To Delete" });
  }
  return res.status(200).json({ message: "Successfully Delete" });
};

export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  console.log(userId)
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (err) {
    return console.log(err);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ user: userBlogs });
};


// export const getAllBlogs = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const allBlogs = await Blog.find({ author: { $in: user.following } }).populate('author');

//     return res.status(200).json({ message: 'Successfully retrieved blogs', blogs: allBlogs });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


export const getFollowBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allBlogs = await Blog.find({ author: { $in: user.following } }).populate('author');

    return res.status(200).json({ message: 'Successfully retrieved blogs', blogs: allBlogs });
  } catch (err) {
    console.error('Error fetching blogs:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

