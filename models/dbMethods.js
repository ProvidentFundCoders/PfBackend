const create = (model, data)=>{
    try{
        const entity =  new model(data)
       return entity.save()
        .then((response)=>{
           return response;
        }).catch((err)=>{
            console.log(err)
            return false
        })
    }catch(err){
    console.log(err)
    }
   
}

const findByOne = async (model, query)=>{
    try{
        const result = model.findOne(query);
        return result.then((data)=>{
            if(data === null || data === undefined) return false;
            return data;
         })
         .catch((err)=>{
            console.log(err)
         })
    }catch(err){
       console.log(err)
    }
}

const findAll = (model, query)=>{
    try{
        const result = model.find(query);
        return result.then((data)=>{
            if(data === null) return false;
            return data;
         })
         .catch((err)=>{
            console.log(err)
         })
    }catch(err){
       console.log(err)
    }
}

const updateOneRecord = (model, query, updatedata)=>{
    try{
        const result = model.updateOne(query, {$set: updatedata});
        return result.then(()=>{
           return true
         })
         .catch((err)=>{
            console.log(err)
         })
    }catch(err){
       console.log(err)
    }
}

const dbMethods = {
    create: create,
    findByOne: findByOne,
    updateOneRecord: updateOneRecord,
    findAll: findAll
}

export default dbMethods;
  
