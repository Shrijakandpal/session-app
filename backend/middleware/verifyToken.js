import jwt from 'jsonwebtoken';
const verifyToken=(req,res,next)=>{
    const bearerHeader= req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          
      if (err) {
        console.log('error',err);
        return res.status(403).json({ message: 'Invalid token' });

      }

      req.user = decoded; 
      next();
    });
  } else {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }
};

export default verifyToken;