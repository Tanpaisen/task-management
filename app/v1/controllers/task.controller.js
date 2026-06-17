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

    //Sắp xếp theo tiêu chí
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }
    //End Sắp xếp theo tiêu chí


    const tasks = await Task.find(find).sort(sort)

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