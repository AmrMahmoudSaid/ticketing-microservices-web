import express , {Request , Response} from 'express';
import {body } from 'express-validator';
import {validateRequest ,BadRequestError} from "@amtickets377/common";
import {User} from "../models/user";
import {Password} from "../service/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/api/users/signin',[
    body('email')
        .isEmail()
        .withMessage('email must be valid'),

    body('password')
        .trim() // to remove spaces
        .notEmpty()
        .withMessage('You must add a password')
    ],validateRequest
    ,async (req: Request, res: Response) =>{
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});
    if (!existingUser){
        throw new BadRequestError('Invalid credentials');
    }
    const passMatch = await Password.compare(existingUser.password,password);
    if (!passMatch){
        throw new BadRequestError('Invalid credentials');
    }
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },process.env.JWT_KEY!);
    req.session ={
        jwt: userJwt
    };
    res.status(200).send(existingUser);

});

export {router as signinRouter};