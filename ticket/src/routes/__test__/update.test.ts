import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../model/ticket";
import mongoose from "mongoose";
import {natsWrapper} from "../../nats-wrapper";
it('return a 404 if id does not exist',async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',global.signin())
        .send({
            title: 'test',
            price:20
        })
        .expect(404);
});

it('return a 401 if user not authenticated',async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test',
            price:20
        })
        .expect(401);
});

it('return a 401 if user not own the ticket',async ()=>{
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'test',
            price:20
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title:'test2',
            price:20
        })
        .expect(401);

});

it('return a 400 if user provides an invalid title or price',async ()=>{
    const cookie= global.signin();
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'test',
            price:20
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'',
            price:20
        })
        .expect(400);
});

it('return a 200 update',async ()=>{
    const cookie= global.signin();
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'test',
            price:20
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'newTest',
            price:200
        })
        .expect(200);

    const ticketRes = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send();
    expect(ticketRes.body.title).toEqual('newTest');
    expect(ticketRes.body.price).toEqual(200);
});

it('Publish event ' , async ()=>{
    const cookie= global.signin();
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'test',
            price:20
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'newTest',
            price:200
        })
        .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

