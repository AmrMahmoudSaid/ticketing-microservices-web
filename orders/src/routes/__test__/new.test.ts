import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/order";

import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";
import {OrderStatus} from "@amtickets377/common";


it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId})
        .expect(404);

});

it('returns an error if the ticket is reserved', async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "test",
        price:10
    });
    await ticket.save();
    const order = Order.build({
        ticket,
        userId: "sdfgwsdg",
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(400)

});

it('Create order', async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "test",
        price:10
    });
    await ticket.save();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(201)
});

