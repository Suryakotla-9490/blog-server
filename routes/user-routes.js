import express from "express";
import { follow, getAllUser, getfollowers, getfollowing, login, signup, unfollow } from "../controllers/user-controller.js";

const router = express.Router();

router.get("/", getAllUser);

router.post("/signup", signup);

router.post("/login", login);
router.post('/follow/:id', follow)
router.get('/followers/:id',getfollowers )
router.get('/following/:id', getfollowing)
router.post('/unfollow/:id', unfollow)

export default router;
