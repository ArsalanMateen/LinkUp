import User from "../users/user.model.js";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "../../config/config.js";

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({ error: "Email and password don't match." });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie("t", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "lax",
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch {
    return res.status(401).json({ error: "Could not sign in" });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "signed out" });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
});

// Public profile/list reads can personalize existing follow controls without
// fetching an actor's complete graph. Supplied invalid tokens still return 401.
const optionalSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
  credentialsRequired: false,
});

const hasAuthorization = (req, res, next) => {
  const isAuthorized =
    req.profile &&
    req.auth &&
    req.profile._id.toString() === req.auth._id.toString();

  if (!isAuthorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }

  next();
};

export default { signin, signout, requireSignin, optionalSignin, hasAuthorization };
