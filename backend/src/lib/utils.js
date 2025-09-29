 import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (id, res) => {
    const { JWT_SECRET, NODE_ENV } = ENV;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (!NODE_ENV) {    
        throw new Error('NODE_ENV is not defined in environment variables');
    }
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: NODE_ENV === "development" ? false : true,
        sameSite: "strict",
    });
};
