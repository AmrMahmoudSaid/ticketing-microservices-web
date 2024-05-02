import {Subjects} from "./subjects";

export interface TicketCreateEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    };
}