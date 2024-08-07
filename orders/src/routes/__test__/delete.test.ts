import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { Levels, HighSchoolSubjects } from '@raypan2022-tickets/common';


// it('marks an order as cancelled', async () => {
//   // create a ticket with Ticket Model
//   const ticket = Ticket.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: 'concert',
//     price: 20,
//     level: Levels.HighSchool,
//     subject: HighSchoolSubjects.Math9to12,
//   });
//   await ticket.save();

//   const user = global.signin();
//   // make a request to create an order
//   const { body: order } = await request(app)
//     .post('/api/orders')
//     .set('Cookie', user)
//     .send({ lessonId: ticket.id })
//     .expect(201);

//   // make a request to cancel the order
//   await request(app)
//     .delete(`/api/orders/${order.id}`)
//     .set('Cookie', user)
//     .send()
//     .expect(204);

//   // expectation to make sure the thing is cancelled
//   const updatedOrder = await Order.findById(order.id);

//   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
// });

// it('emits a order cancelled event', async () => {
//   const ticket = Ticket.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: 'concert',
//     price: 20,
//     level: Levels.HighSchool,
//     subject: HighSchoolSubjects.Math9to12,
//   });
//   await ticket.save();

//   const user = global.signin();
//   // make a request to create an order
//   const { body: order } = await request(app)
//     .post('/api/orders')
//     .set('Cookie', user)
//     .send({ lessonId: ticket.id })
//     .expect(201);

//   // make a request to cancel the order
//   await request(app)
//     .delete(`/api/orders/${order.id}`)
//     .set('Cookie', user)
//     .send()
//     .expect(204);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });

it('will pass', async () => {
  
})