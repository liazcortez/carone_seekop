const usersToCount = (data) => {

    let usersArray;
    if(data !== undefined){
        usersArray = data.map(item => item && item.agent ? item.agent.name : 'none');
    }else{
        usersArray = []
    }

  return usersArray;

};

export default usersToCount;