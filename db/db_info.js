module.exports = (function () {
    return {
        web: { // real server db info
            host: 'newticker.iptime.org',
            port: '3308',
            user: 'web',
            password: 'mju12345',
            database: 'medic',
            connectTimeout: 20000,
            acquireTimeout: 20000
        }
    }
})();