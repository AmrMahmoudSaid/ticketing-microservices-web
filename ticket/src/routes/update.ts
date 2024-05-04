import express,{Request, Response} from "express";
import {body} from "express-validator";
import {validateRequest,NotAuthorizedError,requireAuth,NotFound} from '@amtickets377/common';
import {Ticket} from "../model/ticket";
import {TicketUpdatedPublisher} from "../event/publisher/ticket-updated-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.put('/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({gt: 0})
            .withMessage("invalid price ")
    ],validateRequest,
    async (req: Request, res: Response) =>{
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket){
        throw new NotFound();
    }
    if (ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })
    res.send(ticket);
});

export {router as updateTicketRouter};
