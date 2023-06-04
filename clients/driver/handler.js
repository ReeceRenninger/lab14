'use strict';

const pickupOccurred = (payload, socket) => {
  console.log('DRIVER: picked up', payload.order.orderId);
  payload.event = 'in-transit';
  socket.emit('in-transit', payload);
};

const packageDelivered = (payload, socket) => {
  console.log('DRIVER: delivery confirmation', payload.order.orderId);
  payload.event = 'confirmation';
  socket.emit('confirmation', {...payload, event: 'confirmation'});
};

module.exports = { pickupOccurred, packageDelivered };
