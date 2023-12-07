const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(403).json({ error: "Token is missing" });
  }

  if (authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.slice(7);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ error: "Invalid token" });
      }

      req.userId = decoded.userId;
      next();
    });
  } else {
    return res.status(401).json({ error: "Invalid token format" });
  }
}

module.exports = verifyToken;
