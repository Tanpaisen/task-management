const Task = require('../model/tasks.model')


//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {

    const find = {
        deleted: false,
    }

    //Lọc theo trạng thái
    if ( req.query.status ) {
        find.status = req.query.status
    }
    //End lọc theo trạng thái

    const tasks = await Task.find(find)

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