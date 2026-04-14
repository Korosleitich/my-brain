"// Main server file" 
const express = require('express');
const { router: authRoutes, authenticateToken } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.db = null;

app.use('/api/auth', authRoutes);

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected content', user: req.user });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🧠 My Brain API running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: /api/auth/register, /api/auth/login`);
});

module.exports = app;