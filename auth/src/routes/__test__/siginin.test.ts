import request from 'supertest';
import {app} from "../../app";


it('fails if email not exist', async () =>{
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
})

it('login successfully', async () =>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(201);
    const res = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();

});

it('login with wrong password', async ()=>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'passwordd'
        })
        .expect(400);
})