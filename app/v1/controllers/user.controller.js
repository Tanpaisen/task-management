const User = require('../model/users.model')

const md5 = require('md5')

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

    res.json({
        code: 200,
        token: token,
        message: "Tạo tài khoản thành công!"
    })
}