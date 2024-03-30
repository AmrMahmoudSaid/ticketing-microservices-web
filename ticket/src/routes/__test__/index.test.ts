import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../model/ticket";
const createTicket = ()=>{
    return request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title: 'test',
            price:20
        });
};
it('can fetch list of tickets', async ()=>{
    await createTicket();
    await createTicket();
    await createTicket();

    const res = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);
    expect(res.body.length).toEqual(3);
})