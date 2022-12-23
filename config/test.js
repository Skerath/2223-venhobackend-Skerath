module.exports = {
    port: 9000,
    log: {
        level: 'silly',
        disabled: true,
    },
    cors: {
        origins: ['http://localhost:3000'],
        maxAge: 3 * 60 * 60,
    },
    database: {
        hostname: "localhost",
        port: "3306",
        username: "dbdev",
        name: "venho_dev",
        password: "dbdev",
        isDevelopment: "false"
    },
};