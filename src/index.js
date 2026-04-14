const express = require('express');
const { router: authRoutes, authenticateToken } = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.db = null;

app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);  // <-- Add this line

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected content', user: req.user });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🧠 My Brain API running on http://localhost:3000`);
  console.log(`📝 Health check: http://localhost:3000/health`);
  console.log(`🔐 Auth endpoints: /api/auth/register, /api/auth/login`);
  console.log(`📤 Upload endpoints: /api/upload, /api/upload-multiple`);
});

module.exports = app;