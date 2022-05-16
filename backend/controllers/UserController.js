const UserService = require('../service/UserService.js')
const {validationResult} = require("express-validator")
const ApiError = require('../exceptions/ApiErrors.js')

class UserController {
    async registration(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }
            const userData = await UserService.registration(req.body)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async login(req, res, next){
        try {
            const {email, password} = req.body;
            const userData = await  UserService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.cookie('accessToken', userData.accessToken, {maxAge: 30 * 60 * 1000, httpOnly: true})
            return res.send('Вы успешно вошли в аккаунт')
        } catch (e) {
            next(e)
        }
    }
    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.clearCookie('accessToken')
            return res.send('Вы успешно вышли из аккаунта')
        } catch (e) {
            next(e)
        }
    }
    async activate(req, res, next){
        try {
            await UserService.activate(req.params.link)
            res.send('Вы успешно активировали аккаунт')
        } catch (e) {
            next(e)
        }
    }
    async refresh(req, res, next){
        try {
            const {refreshToken} = req.body
            const userData = await  UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.send('Вы успешно вошли в аккаунт')
        } catch (e) {
            next(e)
        }
    }
    async getUsers(req, res, next){
        try {
            res.json(await UserService.getAll())
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new UserController()