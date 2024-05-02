import {Publisher, Subjects, TicketCreateEvent} from "@amtickets377/common";

export class TicketCreatePublisher extends Publisher<TicketCreateEvent>{
    readonly subject = Subjects.TicketCreated;

}