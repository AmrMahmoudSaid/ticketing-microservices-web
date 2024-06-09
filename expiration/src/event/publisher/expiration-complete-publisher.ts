import {Subjects,Publisher,ExpirationCompleteEvent} from "@amtickets377/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;

}