import express, {Request, Response} from "express";
import {requireAuth,validateRequest} from '@amtickets377/common'
import {body} from "express-validator";
import {Ticket} from "../model/ticket";
import {TicketCreatePublisher} from "../event/publisher/ticket-create-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post('/api/tickets',requireAuth,[
    body('title')
        .notEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({gt: 0})
        .withMessage("invalid price ")
],validateRequest,async (req:Request, res: Response) =>{
    const {title,price} = req.body;
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();
    await new TicketCreatePublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: title.title,
        price: ticket.price,
        userId: ticket.userId
    });
    res.status(201).send(ticket);
});

export {router as createTicketRouter};