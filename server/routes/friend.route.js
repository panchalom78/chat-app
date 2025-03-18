import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    acceptRequest,
    getRequests,
    getUsersByQuery,
    rejectRequest,
    sendRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendRequest);
router.get("/", protectRoute, getRequests);
router.post("/accept/:id", protectRoute, acceptRequest);
router.post("/reject/:id", protectRoute, rejectRequest);
router.post("/search", protectRoute, getUsersByQuery);

export default router;
