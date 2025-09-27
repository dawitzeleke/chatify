 import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("jwt", token, {
        maxage: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "strict",
    });
};
