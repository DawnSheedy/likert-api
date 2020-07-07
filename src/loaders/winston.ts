import winston from 'winston';

const LoggerInstance = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.prettyPrint()
    ),
    defaultMeta: { service: 'survey-api' },
    transports: [
        new winston.transports.File({ filename: './../../logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './../../logs/combined.log' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    LoggerInstance.add(new winston.transports.Console());
}

export default LoggerInstance;