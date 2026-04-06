const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const postRoutes = require('./routes/postRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const forumRoutes = require('./routes/forumRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/forums', forumRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("GEU MongoDB Connected"))
    .catch(err => console.log("Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));