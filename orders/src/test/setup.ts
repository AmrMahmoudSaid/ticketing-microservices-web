import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper')
let mongo: any;
beforeAll(async ()=>{
    jest.clearAllMocks();
    process.env.JWT_KEY='amr.mahmoud';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async ()=>{
    const collections = await mongoose.connection.db.collections();

    for (let co of collections){
        await co.deleteMany({});
    }
});

afterAll(async () =>{
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin =  () =>{
    // Build a JWT payload
    const payload={
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    //Create the JWT
    const token = jwt.sign(payload,process.env.JWT_KEY!);
    //Build session
    const session = {jwt: token};
    //turn that session inti JSON
    const sessionJson = JSON.stringify(session);
    //take Json and encode it
    const  base64 = Buffer.from(sessionJson).toString('base64');
    //return cookie
    return [`session=${base64}`];
}