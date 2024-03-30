import express, {Request, Response} from "express";
import {requireAuth,validateRequest, NotFound} from '@amtickets377/common'
import {body} from "express-validator";
import {Ticket} from "../model/ticket";

const router = express.Router();

router.get('/api/tickets/:id', async (req:Request,res:Response)=>{
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket){
        throw new NotFound();
    }
    res.send(ticket);
});

export {router as showTicketRouter};