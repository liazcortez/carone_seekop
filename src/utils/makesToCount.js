const makesToCount = (data) => {

    let makesArray;
    if(data !== undefined){
        makesArray = data.map(item => item && item.vehicle && item.vehicle.make && item.vehicle.make.name);
    }else{
        makesArray = []
    }

  return makesArray;

};

export default makesToCount;