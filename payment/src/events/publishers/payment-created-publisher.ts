import { Subjects, Publisher, PaymentCreatedEvent } from '@amtickets377/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
