const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const TWILIO_ACCOUNT_SID = '';
const TWILIO_AUTH_TOKEN = '';
const TWILIO_SERVICE_SID = '';

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

const sendOtp = async (req, res) => {
  const  phoneNumber = req.body.phoneNumber;

  try {
    const result = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });
    res.status(200).send({
      success: true,
      message: `OTP sent successfully`,
      payload: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: `Error in sending otp: ${err.message}`,
    });
  }
};

const verifyOtp = async (req, res) => {
  const  phoneNumber= req.body.phoneNumber;
  const otp = req.body.otp;
  try {
    const result = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${phoneNumber}`,
        code: otp,
      });
    res.status(200).send({
      success: true,
      message: `OTP verified successfully`,
      payload: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: `Error in verifying otp: ${err.message}`,
    });
  }
};

app.post("/send-otp", sendOtp);
app.post("/verify-otp", verifyOtp);



app.listen(PORT, () => console.log(`listening on PORT ${PORT}...`));
