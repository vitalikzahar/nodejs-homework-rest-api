const crypto = require("node:crypto");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const gravatar = require("gravatar");
const sendEmail = require("../helpers/sendEmail");

async function register(req, res, next) {
  const { password, email, subscription } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = crypto.randomUUID();
    await sendEmail({
      to: email,
      subject: "Welcome to LIst of contacts",
      html: `To confirm your registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your registration please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    await User.create({
      email,
      subscription,
      verificationToken,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).json({
      user: { email: email, subscription: subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user === null) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    if (user.verify !== true) {
      return res.status(401).send({ message: "Your account is not verified" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    await User.findByIdAndUpdate(user._id, { token }).exec();

    res.send({ token });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }).exec();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  const authHeader = req.headers.authorization;
  const [token] = authHeader.split(" ", 2);

  try {
    const user = await User.findOne({ token }).exec();

    if (user === null) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
}
async function verify(req, res, next) {
  const { verificationToken } = req.params;
  console.log(req.params);

  try {
    const user = await User.findOne({
      verificationToken: verificationToken,
    }).exec();

    if (user === null) {
      return res.status(404).json({ message: "Not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function verifyRepeat(req, res, next) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }
    const user = await User.findOne({
      email: email,
    }).exec();
    console.log(user);

    if (user.verify === true) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    await sendEmail({
      to: email,
      subject: "Welcome to LIst of contacts",
      html: `To confirm your registration please click on the <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your registration please open the link http://localhost:3000/api/users/verify/${user.verificationToken}`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current, verify, verifyRepeat };
