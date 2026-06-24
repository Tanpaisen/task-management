const Task = require('../model/tasks.model')

const paginationHelper = require('../../../helper/pagination')
const searchHelper = require('../../../helper/filter-search')


//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {

    const find = {
        deleted: false,
        $or: [
            {createdBy: req.user.id},
            {listUser: req.user.id}
        ]
    }

    //pagination
    const objectTask = {
        currentPage: 1,
        limitPage: req.query.limit || 2,
    }

    const countTask = await Task.countDocuments({ 
        deleted: false,
        $or: [
            {createdBy: req.user.id},
            {listUser: req.user.id}
        ]
    })

    paginationHelper(
        req.query,
        countTask,
        objectTask
    )
    //End pagination


    //Lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status
    }
    //End lọc theo trạng thái

    //Sắp xếp theo tiêu chí
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }
    //End Sắp xếp theo tiêu chí

    //Tìm kiếm
    const keyword = req.query.keyword
    if (keyword) {
        const search = searchHelper(req.query);

        find.title = search.regex;
    }
    //End Tìm kiếm


    const tasks = await Task.find(find).sort(sort).skip(objectTask.skipPage).limit(objectTask.limitPage)

    res.json(tasks)
}

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false,
    }).select('id title status content timeStart timeFinish')
    res.json(task)
}

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id: id,
        }, {
            status: status
        })

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công",
        })
    } catch {
        res.json({
            code: 404,
            message: "Cập nhật trạng thái thất bại"
        })
    }

}

//[PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;
        switch (key) {
            case 'status':
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value,
                })
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                })
                break;
            case 'deleteMany':
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                })
                res.json({
                    code: 200,
                    message: "Xóa công việc thành công"
                })
                break;
            default:
                res.json({
                    code: 400,
                    message: "Tiêu chí cập nhật không hợp lệ"
                })
        }

    } catch {
        res.json({
            code: 404,
            message: "Cập nhật thất bại"
        })
    }

}

//[POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id
        const task = new Task(req.body);
        task.save();

        res.json({
            code: 200,
            message: "Tạo công việc thành công",
        })
    } catch {
        res.json({
            code: 404,
            message: "Cập nhật trạng thái thất bại"
        })
    }

}

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        },
            req.body
        )

        res.json({
            code: 200,
            message: "Chỉnh sửa công việc thành công",
        })
    } catch {
        res.json({
            code: 404,
            message: "Cập nhật trạng thái thất bại"
        })
    }

}

//[DELETE] /api/v1/tasks/deleteOne/:id
module.exports.deleteOne = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        }, {
            deleted: true
        })

        res.json({
            code: 200,
            message: "Xóa 1 công việc thành công",
        })
    } catch {
        res.json({
            code: 404,
            message: "Cập nhật trạng thái thất bại"
        })
    }

}