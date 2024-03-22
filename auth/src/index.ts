import 'express-async-errors'
import mongoose from 'mongoose';
import {app} from "./app";

const start = async () => {
    if (!process.env.JWT_KEY){
        throw  new Error('jwt key doesnt exist');
    }
    if (!process.env.MONGO_URL){
        throw  new Error('Mongo url doesnt exist');
    }
    try{
        await mongoose.connect(process.env.MONGO_URL);
      //   await mongoose.connect('mongodb://localhost:27017/auth' );
        console.log("DB connection");
    }catch (err){
        console.log(err);
    }
};
app.listen(3000,() =>{
    console.log('Listening on port 3000');
});
start();