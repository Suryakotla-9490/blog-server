import express from "express";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  getById,
  getByUserId,
  getFollowBlogs,
  updateBlog,
} from "../controllers/blog-controller.js";
const blogRoute = express.Router();

blogRoute.get("/allBlogs/", getAllBlogs);
blogRoute.get("/followBlogs/:id", getFollowBlogs);
blogRoute.post("/add", addBlog);
blogRoute.put("/update/:id", updateBlog);
blogRoute.get("/:id", getById);
blogRoute.delete("/:id", deleteBlog);
blogRoute.get("/user/:id", getByUserId);

export default blogRoute;
