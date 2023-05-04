const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bycryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const auth = require("../middlewares/auth");

//Sign UP
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same name already Exists!" });
    }

    const hashedPassword = await bycryptjs.hash(password, 8);
    let user = new User({
      email,
      password: hashedPassword,
      name,
    });

    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Sign In
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with such mail does not Exists!" });
    }
    const isMatch = await bycryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password!" });
    }
    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if(!token) return res.json(false);
    const verified = jwt.verify(token, 'passwordkey');
    if(!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if(!user) return res.json(false);
    res.json(true);
  }
  catch(e){
    res.status(500).json({ error: e.message });
  }
})


//get user data
authRouter.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  req.json({...user._doc, token: req.token});
})
module.exports = authRouter;