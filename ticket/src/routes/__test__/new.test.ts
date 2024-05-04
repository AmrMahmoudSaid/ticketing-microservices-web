import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../model/ticket";
import {natsWrapper} from "../../nats-wrapper";

it('can accessed if the user is signed in', async () =>{
    const res = await request(app)
        .post('/api/tickets')
        .send({});

    expect(res.status).toEqual(401);
});

it('return a status other 401 if user is signed in' , async ()=>{
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin() )
        .send({});

    expect(res.status).not.toEqual(401);
});

it('return an error if an invalid title is provided',async ()=>{

    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin() )
        .send({
            title:'',
            price: 10
        })
        .expect(400);
});

it('return an error if an invalid price is provided',async ()=>{
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin() )
        .send({
            title:'',
            price: 10
        })
        .expect(400);
});

it('return an error if an invalid title is provided',async ()=>{
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin() )
        .send({
            title:'sdfsdg'
        })
        .expect(400);
});

it('create ticket',async ()=>{
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin() )
        .send({
            title:'sdfsdg',
            price: 50
        })
        .expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(50);
});

it('Publish an event', async () =>{
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin() )
        .send({
            title:'sdfsdg',
            price: 50
        })
        .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})