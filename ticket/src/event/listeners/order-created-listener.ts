import {Listener, OrderCreatedEvent, Subjects} from "@amtickets377/common";
import {queueGroupName} from "./queu-group-name";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../model/ticket";
import {TicketUpdatedPublisher} from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket){
            throw new Error('Ticket not found');
        }
        ticket.set({orderId: data.id});
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            version: ticket.version,
            price: ticket.price,
            userId: ticket.userId,
        });

        msg.ack();
    }
}