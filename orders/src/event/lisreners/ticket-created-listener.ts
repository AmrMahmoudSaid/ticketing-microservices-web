import {Listener, TicketCreateEvent, Subjects} from "@amtickets377/common";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../models/ticket";
import {queueGroupName} from "./queu-group-name";

export class TicketCreatedListener extends Listener<TicketCreateEvent>{
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketCreateEvent["data"], msg: Message) {
        const {id, title, price} = data;
        console.log(title);
        const ticket = Ticket.build({
            id, title, price
        });
        await ticket.save();
        msg.ack();
    }
}