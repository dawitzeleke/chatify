import express from 'express';
// const express = require('express');
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';
import {connectDB} from './lib/db.js';
import { ENV } from './lib/env.js';
import cors from 'cors';


dotenv.config();
const app = express();
const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json({limit: '5mb'}));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes); 
app.use('/api/messages', messageRoutes);

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", (req, res) => (
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  ))
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
