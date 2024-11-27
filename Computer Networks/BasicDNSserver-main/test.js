import connectDB from "./db/index.js";
import { recordModel } from "./models/record.model.js";
import { generatedData } from "./generatedData.js";

const connection=connectDB();
console.log(connection);


const insertRecords=async ()=>{
  try
  {
    await recordModel.insertMany(generatedData);
  }
  catch(error)
  {
    console.log(error);
  }
}

insertRecords();