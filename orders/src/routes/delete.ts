import express, {Request, Response} from "express";
import {Order, OrderStatus} from "../models/order";
import {NotAuthorizedError, NotFound, requireAuth} from "@amtickets377/common";
import {OrderCreatedPublisher} from "../event/publisher/order-created-publisher";
import {natsWrapper} from "../nats-wrapper";
import {OrderCancelledPublisher} from "../event/publisher/order-cancelled-publisher";

const router = express.Router();

router.delete('/api/orders/:orderId', async (req: Request, res:Response)=>{
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('ticket');
    if(!order){
        throw new NotFound();
    }
    if (order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });
    res.status(204).send(order);
});

export {router as deleteOrderRouter};