const jwt = require("jsonwebtoken");

function issueJWT(user) {
  const id = user.id;

  const expiresIn = "2d";

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.SECRET);

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401);
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      res.status(403);
    }
    req.user = user;
    next();
  });
};

module.exports.authenticateToken = authenticateToken;
module.exports.issueJWT = issueJWT;
