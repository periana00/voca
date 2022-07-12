import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
const app = express();
const port = 3000;

import firstRouter from './routers/1.js';
import secondRouter from './routers/2.js';

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/1', firstRouter);
app.use('/2', secondRouter);

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

