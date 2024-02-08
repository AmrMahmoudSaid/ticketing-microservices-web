import express from 'express';

const router = express.Router();

router.get('/api/users/signin',(res, req) =>{
    console.log("Hi user")
});

export {router as signinRouter};