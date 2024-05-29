import {Publisher, OrderCreatedEvent, Subjects} from "@amtickets377/common";
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject= Subjects.OrderCreated;
}
