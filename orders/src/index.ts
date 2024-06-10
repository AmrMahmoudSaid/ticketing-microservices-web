import 'express-async-errors'
import mongoose from 'mongoose';
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import {TicketCreatedListener} from "./event/lisreners/ticket-created-listener";
import {TicketUpdatedListener} from "./event/lisreners/ticker-updated-listener";
import {ExpirationCompleteListener} from "./event/lisreners/expiration-complete-listener";
import {PaymentCreatedListener} from "./event/lisreners/payment-created-listener";

const start = async () => {
    if (!process.env.JWT_KEY){
        throw  new Error('jwt key doesnt exist');
    }
    if (!process.env.MONGO_URL){
        throw  new Error('Mongo url doesnt exist');
    }
    if (!process.env.NATS_URL){
        throw  new Error('NATS_URL doesnt exist');
    }
    if (!process.env.NATS_CLUSTER_ID){
        throw  new Error('NATS_CLUSTER_ID doesnt exist');
    }
    if (!process.env.NATS_CLIENT_ID){
        throw  new Error('NATS_CLIENT_ID doesnt exist');
    }
    try{
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close',()=>{
            console.log('nats connection closed!');
        });
        process.on('SIGTERM', ()=> natsWrapper.client.close());
        process.on('SIGINT', ()=> natsWrapper.client.close());
        new TicketUpdatedListener(natsWrapper.client).listen();
        new TicketCreatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        await mongoose.connect("mongodb://orders-mongo-srv:27017/tickets");
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