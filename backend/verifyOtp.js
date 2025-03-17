const express = require("express");
const router = express.Router();
const UserModel = require("./models/UserModel");
const { generateToken } = require("./JwtToken");

router.post("/", async (req, res) => {
  const otps = req.body.otps;
  try {
    const doc = await UserModel.findOne({ Otp: otps });
    console.log("/api/auth/verify-otp", otps);
    if (doc === null) {
      res.send("Invalid Otp");
    } else if (doc.ExpiredOtp === "true") {
      res.send("Expired Otp");
    } else {
      res.json({ message: "Success", Email: doc.Email });
      try {
        const token = generateToken(doc._id, doc.Email);
        await UserModel.findOneAndUpdate(
          { Otp: otps },
          { $set: { Otp: "Verified", ExpiredOtp: "true", JWTToken: token } }
        );
      } catch (err) {}
    }
  } catch (err) {
    console.log("error from here");
  }
});

module.exports = router;
