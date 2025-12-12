const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

app.use(cors({ 
  origin: process.env.CLIENT_URL, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

const passport = require('./config/passport');
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    require('./models/User');
    require('./models/Question');
    require('./models/TestConfig');
    require('./models/TestResult');
    require('./models/Attempt');
    
    console.log('Models Loaded');
  })
  .catch((err) => console.error('MongoDB Error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'AptiSure API Running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});