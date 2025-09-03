const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors=require('cors');
const port = process.env.PORT;
const crypto = require("crypto");
const allRoutes = require('./routes/route.js');
app.use(express.json());
app.use(cors({
  origin: "*", // your frontend URL
  credentials: true
}))
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

function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  const hmac = crypto
    .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return `sha256=${hmac}` === signature;
}
app.post("/github/webhook", (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.headers["x-github-event"];
  const payload = req.body;

  switch (event) {
    case "push":
      console.log(`📦 Push by ${payload.pusher.name} in ${payload.repository.full_name}`);
      break;
    case "pull_request":
      console.log(`🔀 PR ${payload.action} by ${payload.pull_request.user.login}`);
      break;
    case "create":
      if (payload.ref_type === "branch") {
        console.log(`🌱 Branch created: ${payload.ref} in ${payload.repository.full_name}`);
      }
      break;
    default:
      console.log(`ℹ️ Event received: ${event}`);
  }

  res.sendStatus(200);
});

app.listen((port), () => {
  console.log(`Server is running on http://localhost:${port}`);
});