const storesToCount = (data) => {

    let storesArray;
    if(data !== undefined){
        storesArray = data.map(item => item && item.store && item.store.make.name + ' ' + item.store.name);
    }else{
        storesArray = []
    }

  return storesArray;

};

export default storesToCount;