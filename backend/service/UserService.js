const UserModel = require('../models/UserModel.js')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const MailService = require('./MailService.js')
const TokenService = require('../service/TokenService.js')
const UserDTO = require('../dtos/UserDTO.js')
const ApiError = require('../exceptions/ApiErrors.js')

class UserService {
    async registration({password, email}){
        const candidate = await UserModel.findOne({email})
        if(candidate) throw ApiError.BadRequest('Пользователь с таким email уже существует')

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await MailService.sendActivationMail(email, `${process.env.MAIN_URL}/auth/activate/${activationLink}`)

        return await this.generateNewTokens(user)
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user) throw ApiError.BadRequest('Неккоректная ссылка активации')
        user.isActivated = true;
        await user.save();
    }

    async getAll(){
        return await UserModel.find()
    }

    async login(email, password){
        const user = await UserModel.findOne({email})
        if(!user) throw ApiError.BadRequest('Пользователь с таким email и паролем не найден')

        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) throw ApiError.BadRequest('Пользователь с таким email и паролем не найден')

        return await this.generateNewTokens(user)
    }

    async logout(refreshToken){
        const token = await TokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken) throw ApiError.UnauthorizedError()
        const userData = await TokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await TokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB) throw ApiError.UnauthorizedError()
        const user = await UserModel.findById(userData.id)

        return await this.generateNewTokens(user)
    }

    async generateNewTokens(user){
        const userDto = new UserDTO(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }
}

module.exports = new UserService()
