'use strict';

let Chance = require('chance');
let chance = new Chance();
const store = 'Eva\'s Sugar & Reece\'s Pieces';

const orderCreator = (socket, order = null) => {
  if (!order) {
    order = {
      store,
      orderId: chance.guid(),
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
  
  console.log('CUSTOMER: Order was requested:', payload.order.orderId);
  socket.emit('customerOrder', payload);
};


module.exports = orderCreator;
