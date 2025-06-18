const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.userId).select('-password');
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = authMiddleware;
