'use strict';

// let Chance = require('chance');
// let chance = new Chance();
// const store = 'Eva\'s Sugar & Reece\'s Pieces';

// const orderCreator = (socket, order = null) => {
//   if (!order) {
//     order = {
//       store,
//       orderId: chance.guid(),
//       customer: chance.name(),
//       address: chance.address(),
//     };
//   }

//   let payload = {
//     event: 'pickup',
//     messageId: order.orderId,
//     queueId: store,
//     order,
//   };
  
//   socket.emit('confirmation', payload);
//   socket.emit('pickup', payload);
// };

// console.log('VENDOR: ORDER is ready for pickup:', payload);
const confirmOrder = (payload) => console.log('VENDOR: We have received your order:', payload.order.orderId);

const thankCustomer = (payload) => console.log('VENDOR: Thank you for your Eva\'s Sugar & Reece\'s Pieces', payload.order.customer);

module.exports = { thankCustomer, confirmOrder };