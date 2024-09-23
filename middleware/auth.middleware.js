const jwt = require('jsonwebtoken');
const authMiddleWare = (req, res, next) => {
    console.log(req.header('Authorization'))
    if (!req.header('Authorization')) {
      return res.status(401).json({data:{status:false,message:'Access denied. Invalid token.'}});
    }
    const token = req.header('Authorization').split(' ')[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({data:{status:false,message:'Access denied. Invalid token.'}});
    }
    jwt.verify(token, 'mrnelson', (err, user) => {
      if (err) {
        console.log(err)
        return res.status(401).json({data:{status:false,message:'Access denied. Invalid token.'}});
      }
      req.user = user;
      return next();
    });
    return undefined;
  };


  const generateToken = (user) => {

    const payload = {
      id: user.id,
      username: user.username,
    };
    return jwt.sign(payload, 'mrnelson', { expiresIn: '1h' });
  };

  module.exports = {generateToken,authMiddleWare}