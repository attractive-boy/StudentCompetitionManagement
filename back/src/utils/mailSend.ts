import nodemailer from 'nodemailer'
import defaultConfig from '../config/default'

const transporter = nodemailer.createTransport(defaultConfig.emailConfig)

const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: defaultConfig.emailConfig.auth.user,
    to,
    subject,
    html,
  }
  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error
    }
    return info
  })
}

export default sendMail
