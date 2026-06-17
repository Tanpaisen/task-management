module.exports  = (query) => {
    const filterSearch = {
        keyword: ""
    };
    if(query.keyword){
        filterSearch.keyword = query.keyword;
        filterSearch.regex = new RegExp(query.keyword, 'i');
        
    }
    return filterSearch;
}