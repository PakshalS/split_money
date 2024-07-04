const jwt = require('jsonwebtoken');
SECRET_KEY= '9J#4@^h$dG7%KsP&!l*2zNqJ^e@8XsT5'

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Access Denied: Invalid Token' });
  }
};


module.exports = authenticateJWT;