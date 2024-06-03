import {Listener, OrderCreatedEvent, Subjects} from "@amtickets377/common";
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    
}