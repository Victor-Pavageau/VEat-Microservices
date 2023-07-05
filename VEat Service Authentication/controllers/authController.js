const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const Log = require('../middleware/logMiddleware')
const axios = require("axios");
require("dotenv").config();

const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(
      `http://user-service:4000/users/email/${email}`
    );
    return response.data;
  } catch (error) {
    Log.log("notice", `${error.message}`)
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

const comparePasswords = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      throw new Error("Invalid arguments for password comparison");
    }
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    throw new Error(`Failed to compare passwords: ${w}`);
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await getUserByEmail(email);

//     if (!user) {
//       return res.status(200).json({ message: "User not found" });
//     }

//     const isPasswordValid = await comparePasswords(
//       password,
//       user.user.password
//     );

//     if (!isPasswordValid) {
//       return res.status(200).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ userId: user.user.uid }, process.env.JWT_SECRET, {
//       noTimestamp: true,
//       expiresIn: "1h",
//     });

//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(401).json({ message: "Failed to login" });
//   }
// };
module.exports = { getUserByEmail, comparePasswords};
