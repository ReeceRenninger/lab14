'use strict';

const pickupOccurred = (payload, socket) => {
  console.log('DRIVER: picked up', payload.order.orderId);
  payload.event = 'in-transit';
  socket.emit('in-transit', payload);
};

const packageDelivered = (payload, socket) => {
  console.log('DRIVER: delivered', payload.order.orderId);
  payload.event = 'delivered';
  socket.emit('delivered', {...payload, event: 'delivered'});
};

module.exports = { pickupOccurred, packageDelivered };
