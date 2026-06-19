const User = require('../model/users.model')
const ForgotPassword = require('../model/forgot-password.model')

const md5 = require('md5')

const generateHelper = require('../../../helper/generate')
const sendMailHelper = require('../../../helper/sendMail')


//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    const email = req.body.email;
    const phone = req.body.phone;

    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: email,
        deleted: false
    })

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại!"
        })
        return;
    }

    const existPhone = await User.findOne({
        phone: phone,
        deleted: false
    })

    if (existPhone) {
        res.json({
            code: 400,
            message: "Số điện thoại đã tồn tại!"
        })
        return;
    }

    const user = new User(req.body);
    await user.save();

    const token = user.tokenUser;

    //Nếu fe k gửi token
    res.cookie('token', token)

    res.json({
        code: 200,
        token: token,
        message: "Tạo tài khoản thành công!"
    })
}

//[POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
        email: email,
        deleted: false,
    })

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        })
        return;
    }

    if (password !== user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu!"
        })
        return;
    }

    res.cookie('token', user.tokenUser)

    res.json({
        code: 200,
        token: user.tokenUser,
        message: "Đăng nhập thành công!"
    })
}

//[POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        res.json({
            code: 400,
            message: "email không chính xác!"
        })
        return;
    }

    const expireTo = 5

    const otp = generateHelper.generateRandomNumber(6)
    const objectForgot = {
        email: email,
        otp: otp,
        expireAt: Date.now() + expireTo * 60,
    }
    const forgotPassword = new ForgotPassword(objectForgot)
    forgotPassword.save()


    //Neu lay duoc ma thi gui qua otp qua gmail
    const subject = "Mã OTP xác nhận mật khẩu"
    const html = `
           Mã OTP xác nhận của bạn là: <b> ${otp} </b>. Mã xác nhận có hiệu lực 3 phút. Vui lòng không chia sẻ mã với bất kỳ ai!
        `
    sendMailHelper.sendMail(email, subject, html)

    res.json({
        code: 200,
    })
}