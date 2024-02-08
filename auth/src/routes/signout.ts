import express from 'express';
import {DatabaseConnectionError} from "../errors/database-connection-error";
import {RequestValidationError} from "../errors/request-validation-error";

const router = express.Router();

router.post('/api/users/signout',(res, req) =>{
    console.log("Hi user")
});

export {router as signoutRouter};