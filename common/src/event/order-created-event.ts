import {Subjects} from "./subjects";
import {OrderStatus} from "../../build";
export interface OrderCreatedEvent{
    subject: Subjects.OrderCreated;

    data: {
        id: string;
        userId: string;
        status: OrderStatus.Created;
        expiresAt: string;
        ticker: {
            id: string;
            price: number
        }
    }
}