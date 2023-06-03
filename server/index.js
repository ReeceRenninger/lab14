'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;
const Queue = require('./lib/queue');
const candyQueue = new Queue();
const server = new Server();
const candy = server.of('/candy');

// create / allow for connections to the candy namespace
candy.on('connection', (socket) => {
  console.log('connected to the candy namespace', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined the ${room} room`);
  });

  //logger
  socket.onAny((event, payload) => {
    let timestamp = new Date();
    console.log('ORDER: ', { event, timestamp, payload });
  });

  socket.on('customerOrder', (payload) => {
    let customerQueue = candyQueue.read('customerOrder');
    if (!customerQueue) {
      let customerKey = candyQueue.store('customerOrder', new Queue());
      customerQueue = candyQueue.read(customerKey);
    }

    customerQueue.store(payload.messageId, payload);
    socket.broadcast.emit('customerOrder', payload);
  });

  //listening for confirmation sent from orderHandler to trigger order confirmation from VENDOR
  socket.on('confirmation', (payload) => {
    socket.broadcast.emit('confirmation', payload);
  });

  // listens for and relays pickup event
  socket.on('pickup', (payload) => {

    let driverQueue = candyQueue.read('driver');
    if (!driverQueue) {
      let driverKey = candyQueue.store('driver', new Queue());
      driverQueue = candyQueue.read(driverKey);
    }
    driverQueue.store(payload.messageId, payload);
    // sends to all clients except vendor
    socket.broadcast.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let vendorQueue = candyQueue.read(payload.queueId);
    if (!vendorQueue) {
      let vendorKey = candyQueue.store(payload.queueId, new Queue());
      vendorQueue = candyQueue.read(vendorKey);
    }
    vendorQueue.store(payload.messageId, payload);

    socket.broadcast.emit('delivered', payload);
  });

  socket.on('getAll', (payload) => {
    console.log('attempting to get all');
    let currentQueue = candyQueue.read(payload.queueId);
    // console.log(payload.queueId, candyQueue );

    if (currentQueue && currentQueue.data) {
      const ids = Object.keys(currentQueue.data);
      // console.log(ids);
      ids.forEach(messageId => {
        let savedPayload = currentQueue.read(messageId);
        console.log('THIS IS THE saved payload', savedPayload.event);
        socket.broadcast.emit(savedPayload.event, savedPayload);
      });
    }
    else
      console.log('NO queue to get all from!!!');
  });


  socket.on('received', (payload) => {
    let currentQueue = candyQueue.read(payload.queueId);
    if (!currentQueue) {
      throw new Error('we have payloads, but no queue');
    }
    currentQueue.remove(payload.messageId);
  });

});

console.log('listening on PORT:', PORT);
server.listen(PORT);