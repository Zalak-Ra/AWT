// src/server.ts
import dotenv from 'dotenv';
dotenv.config(); // Must run before importing app, so DATABASE_URL is available

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});