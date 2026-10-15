const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Extract token from cookies instead of headers
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token in cookies' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };