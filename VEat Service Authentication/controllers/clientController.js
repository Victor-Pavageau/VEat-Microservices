const jwt = require("jsonwebtoken");
const Log = require('../middleware/logMiddleware')
const { getUserByEmail, comparePasswords} = require("./authController")

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(200).json({ message: "User not found" });
      }
    
      if (user.user.type != 'Client') {
        return res.status(200).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await comparePasswords(
        password,
        user.user.password
      );
  
      if (!isPasswordValid) {
        return res.status(200).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign({ userId: user.user.uid }, process.env.JWT_SECRET, {
        noTimestamp: true,
        expiresIn: "2h",
      });
  
      Log.log("info", `User connexion ${user.user.uid}`)
      res.status(200).json({ token });
    } catch (error) {
      Log.log("notice", `${error.message}`)
      res.status(200).json({ message: "Failed to login" });
    }
  };

module.exports = { login,};
