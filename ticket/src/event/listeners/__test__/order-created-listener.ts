import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../model/ticket";
import mongoose from "mongoose";
import {OrderCreatedEvent, OrderStatus} from "@amtickets377/common";
import {Message} from "node-nats-streaming";

const setup = async () =>{
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        title: 'test',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();
    const data: OrderCreatedEvent['data']= {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "asfassf",
        expiresAt: "ad",
        ticket:{
            id: ticket.id,
            price: ticket.price
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return {data,listener,msg,ticket};
}

it('set the userId of the ticket ', async () => {
    const {listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);
    expect(updateTicket!.orderId).toEqual(data.id);
});