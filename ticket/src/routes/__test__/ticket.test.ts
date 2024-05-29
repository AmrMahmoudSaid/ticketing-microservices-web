import {Ticket} from "../../model/ticket";

it('Implements optimistic concurrency control', async () =>{
    const ticket = Ticket.build({
        title: "Ticket",
        price: 10,
        userId: '123'
    });

    await ticket.save();
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    firstInstance!.set({price: 20});
    secondInstance!.set({price: 25});
    await firstInstance!.save();
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }
})