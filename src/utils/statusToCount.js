const statusToCount = (data) => {

    let statusArray;
    if(data !== undefined){
        statusArray = data.map(item => item.status.name);
    }else{
        statusArray = []
    }

    return statusArray;

};

export default statusToCount;