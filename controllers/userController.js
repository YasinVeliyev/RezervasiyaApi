const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.register = async (req, res, next) => {
  let { username, password, email } = req.body;
  try {
    const user = await User.create({ username, password, email });

    res.status(201).json({ msg: "success" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  let { email, password } = req.body;
  User.findOne({ email }, { validaton: false })
    .then(async (user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        let token = await jwt.sign(JSON.stringify({ username: user.username, email }), process.env["SECRET_KEY"]);
        return res.status(200).json({ token });
      } else {
        res.status(400).json({ msg: "Email və ya şifrə səhvdir" });
      }
    })
    .catch((err) => {
      next(error);
    });
};
