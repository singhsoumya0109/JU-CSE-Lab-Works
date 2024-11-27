import mongoose from "mongoose";

const recordSchema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
    },
    type:
    {
        type:String,
        required:true
    },
    target:
    {
        type:String
    },
    text:
    {
        type:String
    },
    priority:
    {
        type:Number
    }
});

const recordModel=mongoose.model('Record',recordSchema);
export {recordModel};