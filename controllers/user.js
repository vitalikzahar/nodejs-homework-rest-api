const fs = require("node:fs/promises");
const path = require("node:path");
const Jimp = require("jimp");
const { User } = require("../models/user");

async function uploadAvatar(req, res, next) {
  try {
    const { path: tempUpload} = req.file;

    Jimp.read(tempUpload, (err, image) => {
      if (err) throw err;
      image
        .resize(200, 200) 

        .write(tempUpload); 
    });

    await fs.rename(
      req.file.path,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    ).exec();

    if (user === null) {
      return res.status(404).json({ message: "Not authorized" });
    }

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadAvatar };
