const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }
    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация акканута',
            text: '',
            html: `
                <div>
                    <h1>Для активации акаунта перейдите по ссылке</h1>
                    <a href="${link}">АКТИВИРОВАТЬ АККАУНТ</a>
                </div>
            `
        })
    }

    async testMail(to){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Тестовое сообщение',
            text: '',
            html: `
                <div>
                    <h1>Тестовое сообщение</h1>
                </div>
            `
        })
    }
}
module.exports = new MailService()