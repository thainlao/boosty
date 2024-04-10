import express from 'express';
import pool from './db.js';
import cors from 'cors';
import authRouter from './routes/auth.js';
import fileUpload from "express-fileupload";
import subRouter from './routes/sub.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('uploads'));

app.use('/api/auth', authRouter)
app.use('/api/sub', subRouter)

async function start() {
    try {
        app.listen(PORT, ()=> console.log(`сервер запущен на ${PORT} порту`))
    } catch (e) {
        console.log(e)
    }
}

start()