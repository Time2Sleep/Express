const Router = require('express').Router
const UserController = require('./../controllers/UserController.js')
const router = new Router()
const {body} = require("express-validator")
const authMiddleware = require('../middlewares/authMiddleware.js')

router.post(
    '/registration',
[
            body('email').isEmail(),
            body('password', "Пароль должен быть длиннее 4 и короче 16 символов").isLength({max: 16, min: 4})
        ],
        UserController.registration
)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)
router.get('/users', authMiddleware, UserController.getUsers)

module.exports = router