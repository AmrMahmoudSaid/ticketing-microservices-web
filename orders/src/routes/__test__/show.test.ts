import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/order";

import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";
import {OrderStatus} from "@amtickets377/common";

it('fetch order for signin user ', async () => {
    const ticket = Ticket.build({
        title: "Ticket",
        price: 100
    });
    await ticket.save();
    const user = global.signin();
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    const {body: fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(order.id).toEqual(fetchOrder.id);
});