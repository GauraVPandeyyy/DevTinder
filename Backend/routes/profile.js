const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const { profileUpdateValidation } = require("../validators/userValidator");
const { validationResult } = require("express-validator");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      user: user,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `failed- ${error.message}`,
    });
  }
});

//update profile

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("profileImage"),
  profileUpdateValidation,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const loggedInUser = req.user;

      // 🔥 Allowed fields (UPDATED)
      const isAllowedData = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "jobTitle",
      ];

      // 🔥 Convert types (IMPORTANT)
      if (req.body.age) {
        req.body.age = Number(req.body.age);
      }

      // 🔥 Filter only allowed fields
      const updateData = {};
      Object.keys(req.body).forEach((key) => {
        if (isAllowedData.includes(key)) {
          updateData[key] = req.body[key];
        }
      });

      // 🔥 CASE 1: IMAGE EXISTS
      if (req.file) {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "devtinder/profile",
          },
          async (error, result) => {
            if (error) {
              return res.status(500).json({
                success: false,
                message: "Image upload failed",
              });
            }

            // 🔥 Update image URL
            loggedInUser.photoUrl = result.secure_url;

            // 🔥 Update other fields (if any)
            Object.assign(loggedInUser, updateData);

            await loggedInUser.save();

            return res.status(200).json({
              success: true,
              message: "Profile updated successfully",
              data: loggedInUser,
            });
          },
        );

        stream.end(req.file.buffer);
        return;
      }

      // 🔥 CASE 2: ONLY TEXT UPDATE
      if (Object.keys(updateData).length > 0) {
        Object.assign(loggedInUser, updateData);
        await loggedInUser.save();

        return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          data: loggedInUser,
        });
      }

      // 🔥 CASE 3: NOTHING SENT
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
);

module.exports = profileRouter;

module.exports = profileRouter;
