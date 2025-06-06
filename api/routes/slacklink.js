import express from "express";
import handler from "../link.js"; // uses the logic you've already built

const router = express.Router();
router.get("/", handler);
export default router;
