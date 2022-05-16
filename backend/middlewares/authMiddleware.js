const ApiError = require('../exceptions/ApiErrors.js')
const tokenService = require('../service/TokenService.js')
module.exports = function (req, res, next){
    try {
        const {accessToken} = req.cookies
        if(!accessToken) return next(ApiError.UnauthorizedError())
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData) return next(ApiError.UnauthorizedError())

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}