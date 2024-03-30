import express,{Request, Response} from "express";
import {body} from "express-validator";
import {validateRequest,NotAuthorizedError,requireAuth,NotFound} from '@amtickets377/common';
import {Ticket} from "../model/ticket";

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
    res.send(ticket);
});

export {router as updateTicketRouter};
