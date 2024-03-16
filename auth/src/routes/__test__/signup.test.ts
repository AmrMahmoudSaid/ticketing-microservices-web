import request from 'supertest';
import {app} from "../../app";

it('return a 201 on successful signup', async () =>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(201);
});

it('return 400 with an invalid email', async ()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'asfasfas',
            password: 'password'
        })
        .expect(400);
});

it('return 400 with an invalid password', async ()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'pas'
        })
        .expect(400);
});

it('return 400 with an missing email and password', async ()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email: '',
            password: ''
        })
        .expect(400);
});

it('disallows duplicate emails', async ()=>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'amr@gmail.com',
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'amr@gmail.com',
            passowrd: 'password'
        })
        .expect(400);
});

it('sets acookie after successful signup', async ()=>{
    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    expect(res.get('Set-Cookie')).toBeDefined();
});