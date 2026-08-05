module.exports = {
    level: process.env.LOG_LEVEL || 'debug', // niveles: trace, debug, info, warn, error, fatal
    exposeInContext: process.env.NODE_ENV !== 'production',
    requests: process.env.NODE_ENV !== 'production',
};
