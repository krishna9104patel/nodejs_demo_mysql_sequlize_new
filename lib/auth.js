const nodemailer = require("nodemailer");
const dayjs = require("dayjs");
const crypto = require("crypto");
const iv = crypto.randomBytes(16);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "krishna9104patel@gmail.com",
    pass: "pclm knzr pgzq kovd",
  },
  port: 587,
  secure: false,
});

async function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(
    process.env.CRYPTO_ENCRYPT_DECRYPT_ALGORITHM,
    Buffer.from(process.env.CRYPTO_ENCRYPT_DECRYPT_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function encrypt(text) {
  let cipher = crypto.createCipheriv(
    process.env.CRYPTO_ENCRYPT_DECRYPT_ALGORITHM,
    Buffer.from(process.env.CRYPTO_ENCRYPT_DECRYPT_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

async function generateEncryptedVerifyLink(user) {
  const userDetails = {
    id: user.id,
    name: user.name,
    expireIn: dayjs(),
  };
  try {
    var encryptedStr = await encrypt(JSON.stringify(userDetails));
    return encryptedStr;
  } catch (error) {
    return { success: false, message: "Token generation error" };
  }
}

async function sendEmailWithLink(email, link, text, subject) {
  const mailOptions = {
    from: "krishna.patel@tecocraft.com",
    to: email,
    subject: subject,
    text: text + " " + link,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: " + error);
    } else {
    }
  });
}

module.exports = {
  decrypt,
  encrypt,
  sendEmailWithLink,
  generateEncryptedVerifyLink,
};
