import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        console.log("Decoded Token:", decoded);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(401).json({ message: "Unauthorized - Token Verification Failed" });
    }
}