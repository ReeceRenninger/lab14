'use strict';

let Chance = require('chance');
let chance = new Chance();
const store = 'Eva\'s Sugar & Reece\'s Pieces';
let orderId = 1;
const orderCreator = (socket, order = null) => {
  if (!order) {
    order = {
      store,
      orderId: orderId++,
      customer: chance.name(),
      address: chance.address(),
    };
  }

  let payload = {
    event: 'order-creation',
    messageId: order.orderId,
    queueId: store,
    order,
  };
  
  console.log('CUSTOMER: Order was requested for', payload.order.orderId);
  payload.event = 'customerOrder';
  socket.emit('customerOrder', payload);
};


module.exports = orderCreator;
