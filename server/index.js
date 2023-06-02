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

  // listens for and relays pickup event
  socket.on('pickup', (payload) => {
    
    let driverQueue = candyQueue.read('driver');
    if(!driverQueue){
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
    // TODO: for lab-13, need to queue "delivered" messaging to the vendor
    let vendorQueue = candyQueue.read(payload.queueId);
    if(!vendorQueue){
      let vendorKey = candyQueue.store(payload.queueId, new Queue());
      vendorQueue = candyQueue.read(vendorKey);
    }
    vendorQueue.store(payload.messageId, payload);

    socket.to(payload.queueId).emit('delivered', payload);
  });

  socket.on('getAll', (payload) => {
    console.log('attempting to get all');
    let currentQueue = candyQueue.read(payload.queueId);
    // console.log(payload.queueId, candyQueue );

    if(currentQueue && currentQueue.data){
      const ids = Object.keys(currentQueue.data);
      // console.log(ids);
      ids.forEach(messageId => {
        let savedPayload = currentQueue.read(messageId);
        socket.emit(savedPayload.event, savedPayload);
      });
    }
  });

  socket.on('received', (payload) => {
    let currentQueue = candyQueue.read(payload.queueId);
    if(!currentQueue){
      throw new Error('we have payloads, but no queue');
    }
    currentQueue.remove(payload.messageId);
  });

});

console.log('listening on PORT:', PORT);
server.listen(PORT);