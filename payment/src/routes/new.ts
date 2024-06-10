import express, {Request, Response} from "express";
import {body} from "express-validator";
import {requireAuth, validateRequest, BadRequestError, NotAuthorizedError, OrderStatus} from "@amtickets377/common";
import {Order} from "../models/order";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";
import {PaymentCreatedPublisher} from "../events/publishers/payment-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()

], validateRequest, async (request: Request, response: Response) => {
    const {token, orderId} = request.body;
    const order = await Order.findById(orderId);
    if (!order){
        throw new Error("Order not found");
    }
    if (order.userId !== request.currentUser!.id){
        throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled){
        throw new BadRequestError('cannot pay for cancelled order');
    }
    const charge = await stripe.charges.create({
        amount: order.price * 100,
        currency: 'usd',
        source: token,
    })
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    });
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        stripeId: charge.id,
        orderId: payment.orderId
    })
    response.status(201).send({id: payment.id});
});

export {router as createChargeRouter};