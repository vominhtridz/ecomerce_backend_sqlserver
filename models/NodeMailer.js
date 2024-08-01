// Import the Nodemailer libra
import nodemailer from'nodemailer'
// Create a transporter object
export let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "trilove151@gmail.com",
    pass: "demy wwts yuau uucy",
  },
})

