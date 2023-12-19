import dotenv from 'dotenv';
dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT
    },
    mongo: {
        uri: process.env.MONGO_URI,
        dbname: process.env.MONGO_DB_NAME
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASS
    },
    nodemailer: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    },
    jwt: {
        privateKey: process.env.JWT_PRIVATE_KEY,
        cookieName: process.env.JWT_COOKIE_NAME 
    },
    github: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL 
    },
    persistence: process.env.PERSISTENCE || "FILE"
}