const generateToken = require("../config/generateToken,js");
const userModel = require("../Models/userModel");

const SignUpController = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  const u = await userModel.findOne({ email });
  if (u) {
    res.status(400);
    throw new Error("You already have account");
  }
  const user = userModel.insertOne({
    name,
    email,
    password,
  });
  if (user) {
    res
      .status(201)
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
  }
};
const LoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);

    throw new Error("Please enter all the fields");
  }
  const user = await userModel.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      message: "Login Successful",
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
};

module.exports = { SignUpController, LoginController };
