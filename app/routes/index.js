const pincodeRouter = require('./pincode')
const serviceRouter = require('./services')
function route(app) {
    app.use('/v1/shopcard', pincodeRouter)
    app.use('/v1', serviceRouter)
}   

module.exports = route;