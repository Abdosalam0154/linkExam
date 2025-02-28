export const create=({model,data={}}={})=>{
    const document=model.create(data)
    return document
}
export const find=({model,filter={},select="",populate=[],skip=0,limit=1000}={})=>{
    const document=model.find(filter).select(select).populate(populate).skip(skip).limit(limit)
    return document
}
export const findOne=({model,filter={},select="",populate=[]}={})=>{
    const document=model.findOne(filter).select(select).populate(populate)
    return document
}
export const findById=({model,id="",select="",populate=[]}={})=>{
    const document=model.findById(id).select(select).populate(populate)
    return document
}
export const findByIdAndUpdate=({model,id="",data={},options={},select="",populate=[]}={})=>{
    const document=model.findByIdAndUpdate(id,data,options).select(select).populate(populate)
    return document
}
export const findOneAndUpdate=({model,filter={},data={},options={},select="",populate=[]}={})=>{
    const document=model.findOneAndUpdate(filter,data,options).select(select).populate(populate)
    return document
}
export const updateOne=({model,filter={},data={},options={}}={})=>{
    const document=model.updateOne(filter,data,options)
    return document
}
export const updateMany=({model,filter={},data={},options={}}={})=>{
    const documents=model.updateMany(filter,data,options)
    return documents
}
export const findByIdAndDelete=({model,id="",select="",populate=[]}={})=>{
    const document=model.findByIdAndDelete(id).select(select).populate(populate)
    return document
}
export const findOneAndDelete=({model,filter={},select="",populate=[]}={})=>{
    const document=model.findOneAndDelete(filter).select(select).populate(populate)
    return document
}
export const DeleteOne=({model,filter={}}={})=>{
    const document=model.DeleteOne(filter)
    return document
}
export const DeleteMany=({model,filter={}}={})=>{
    const documents=model.DeleteMany(filter)
    return documents
}