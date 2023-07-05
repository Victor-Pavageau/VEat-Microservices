const jwt = require("jsonwebtoken");
const Log = require('../middleware/logMiddleware')
const RevokedToken = require("../models/revokeSchema");

const logout = (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decodedToken = jwt.decode(token);
    console.log(decodedToken);
    const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
    addToBlacklist(token, expiresIn);

    Log.log("info", `User logout ${decodedToken.userId}`)
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    Log.log("notice", `${error.message}`)
    res.status(200).json({ message: "Failed to logout" });
  }
};

const addToBlacklist = async (token, expiresIn) => {
  const revokedToken = new RevokedToken({
    token,
    expiresIn,
  });

  await revokedToken.save();
};

const isTokenRevoked = async (token) => {
  const revokedToken = await RevokedToken.findOne({ token });
  return revokedToken !== null;
};

module.exports = { logout, isTokenRevoked, addToBlacklist };
