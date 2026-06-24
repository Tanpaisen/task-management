const taskRoute = require('./task.route')
const userRoute = require('./user.route')

const authMiddleware = require('../middleware/auth.middlewre')

module.exports = (app) => {
    app.use('/api/v1/tasks', authMiddleware.auth, taskRoute)

    app.use('/api/v1/users', userRoute)
}