import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
export const signup = async  (req, res) => {
    const {fullname, email, password} = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }
        if( password.length < 6 ) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: 'Invalid email format'});
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({message: 'Email is already registered'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const passwordToStore = hashedPassword;
        // Create new user
        const newUser = new User({ fullname, email, password: passwordToStore });
        if(newUser){
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);
            
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilePicture: newUser.profilePicture,
                message: 'User registered successfully'});
        }
        
        
    } catch (error) {
        console.error('Error occurred during signup:', error);
        return res.status(500).json({message: 'Internal server error'});
    }

}