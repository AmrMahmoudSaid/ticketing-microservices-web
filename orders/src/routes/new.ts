import mongoose from "mongoose";
import express, {Request, Response} from "express";
import {BadRequestError, NotFound, OrderStatus, requireAuth, validateRequest} from "@amtickets377/common";
import {body} from 'express-validator'
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {OrderCreatedPublisher} from "../event/publisher/order-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();
const EXPIRATION_TIME = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticker id must be provided')
], validateRequest,
    async (req: Request, res:Response)=>{
        const ticket = await Ticket.findById(req.body.ticketId);
        if (!ticket){
            throw new NotFound();
        }
        const existingOrder = await ticket.isReserved();
        if (!existingOrder) {
            throw new BadRequestError("Ticket is already reserved");
        }
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_TIME);
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expirationDate,
            ticket
        });
        await order.save();
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: OrderStatus.Created,
            version: order.version,
            userId: req.currentUser!.id,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });
        res.status(201).send(order);
});

export {router as newOrderRouter};