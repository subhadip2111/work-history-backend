const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors=require('cors');
const port = process.env.PORT;
const allRoutes = require('./routes/route.js');
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api', allRoutes);

app.listen((port), () => {
  console.log(`Server is running on http://localhost:${port}`);
});