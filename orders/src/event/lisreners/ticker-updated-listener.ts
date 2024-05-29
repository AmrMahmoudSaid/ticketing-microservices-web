import {Listener, TicketUpdatedEvent, Subjects} from "@amtickets377/common";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../models/ticket";
import {queueGroupName} from "./queu-group-name";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TickerUpdated;
    queueGroupName = queueGroupName ;
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const {id, title, price} = data;
        console.log(data);

        const ticket = await Ticket.findByEvent(data);
        if (!ticket){
            throw new Error('Ticket not found');
        }
        ticket.set({title, price});
        await ticket.save();
        msg.ack();
    }
}