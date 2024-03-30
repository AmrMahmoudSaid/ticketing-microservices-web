import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('return a 404 if the ticket is not found', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('return a ticket if the ticket is found', async ()=>{
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'test',
            price: 20
        })
        .expect(201);
    const ticketReq = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()
        .expect(200);
    expect(ticketReq.body.title).toEqual('test');
    expect(ticketReq.body.price).toEqual(20);
});