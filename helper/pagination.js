module.exports = (query, countRecord, objectPage) => {

    if(query.page){
        objectPage.curentPage=parseInt(query.page);
    }

    objectPage.skipPage = (objectPage.curentPage-1)*objectPage.limitPage;

    objectPage.totalPage = Math.ceil(countRecord/objectPage.limitPage);

    return objectPage;
}