import {Subjects, Publisher, OrderCancelledEvent} from "@amtickets377/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
}