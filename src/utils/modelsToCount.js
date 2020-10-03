const modelsToCount = (data) => {

    let modelsArray;
    if(data !== undefined){
        modelsArray = data.map(item => item && item.vehicle && item.vehicle.model);
    }else{
        modelsArray = []
    }

  return modelsArray;

};

export default modelsToCount;