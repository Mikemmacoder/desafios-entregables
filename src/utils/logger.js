import winston from "winston"
import dotenv from 'dotenv'
dotenv.config()

const customWinstonLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
}
winston.addColors(customWinstonLevels.colors)

const createLogger = env => {
    if (env === 'PROD') {
        return winston.createLogger({
            levels: customWinstonLevels.levels,
            transports: [
                new  winston.transports.File({
                    filename: 'server.log',
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(), 
                        winston.format.colorize()
                    )
                }),
                new  winston.transports.File({
                    filename: 'errors.log',
                    level: 'error',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(), 
                        winston.format.colorize()
                    ),
                })    
            ]
        })
    } else {
        return winston.createLogger({
            levels: customWinstonLevels.levels,
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        })
    }
}

const logger = createLogger(process.env.ENVIRONMENT)

export default logger