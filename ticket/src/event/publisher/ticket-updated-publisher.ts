import {Publisher, Subjects, TicketUpdatedEvent} from "@amtickets377/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TickerUpdated;
}