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
    //let timestamp = new Date();
    // console.log('ORDER: ', { event, timestamp, payload });
  });

  //CUSTOMER ORDER SOCKET EVENTS
  socket.on('customerOrder', (payload) => {
    let customerQueue = candyQueue.read('customer');
    if(!customerQueue){
      let customerKey = candyQueue.store('customer', new Queue());
      customerQueue = candyQueue.read(customerKey);
    }
    console.log('customer queue adding event ' , payload.event);
    customerQueue.store(payload.messageId, payload);

    //allow customer to getAll from vendor que for confirmation msg
    let vendorQueue = candyQueue.read(payload.queueId);
    if(!vendorQueue){
      let vendorKey = candyQueue.store(payload.queueId, new Queue());
      vendorQueue = candyQueue.read(vendorKey);
    }
    //console.log(payload.queueId, 'vendor queue adding event ' , payload.event);
    vendorQueue.store(payload.messageId, payload);

    //allow customer to getAll from driver queue for delivery msg    
    let driverQueue = candyQueue.read('driver');
    if(!driverQueue){
      let driverKey = candyQueue.store('driver', new Queue());
      driverQueue = candyQueue.read(driverKey);
    }
    //console.log('driver queue adding event ' , payload.event);
    driverQueue.store(payload.messageId, payload);
    socket.broadcast.emit('customerOrder', payload);
  });
  //customer is not sending confirmation from getAll grab BUT is thanking driver....
  //listening for confirmation sent from orderhandler to trigger order confirmation from VENDOR
  socket.on('confirmation', (payload) => {

    let customerQueue = candyQueue.read('customer');
    if(!customerQueue){
      let customerKey = candyQueue.store('customer', new Queue());
      customerQueue = candyQueue.read(customerKey);
    }
    console.log('customer queue adding event ' , payload.event);
    customerQueue.store(payload.messageId, payload);


    
    socket.broadcast.emit('confirmation', payload);
  });

  // listens for and relays pickup event
  socket.on('pickup', (payload) => {
    
    let driverQueue = candyQueue.read('driver');
    if(!driverQueue){
      let driverKey = candyQueue.store('driver', new Queue());
      driverQueue = candyQueue.read(driverKey);
    }
    //console.log('driver queue adding event ' , payload.event);
    driverQueue.store(payload.messageId, payload);
    // sends to all clients except vendor
    socket.broadcast.emit('pickup', payload);
  });

  
  socket.on('in-transit', (payload) => {
    socket.broadcast.emit('in-transit', payload);
  });

  //DELIVERED SOCKET EVENTS
  socket.on('delivered', (payload) => {
    let customerQueue = candyQueue.read('customer');
    if(!customerQueue){
      let customerKey = candyQueue.store('customer', new Queue());
      customerQueue = candyQueue.read(customerKey);
    }
    console.log('customer queue adding event ' , payload.event);
    customerQueue.store(payload.messageId, payload);
    
    let vendorQueue = candyQueue.read(payload.queueId);
    if(!vendorQueue){
      let vendorKey = candyQueue.store(payload.queueId, new Queue());
      vendorQueue = candyQueue.read(vendorKey);
    }
    //console.log(payload.queueId, 'vendor queue adding event ' , payload.event);
    vendorQueue.store(payload.messageId, payload);

    socket.broadcast.emit('delivered', payload);
  });

  socket.on('getAll', (payload) => {
    console.log('attempting to get all');
    // const queueNames = Object.keys(candyQueue.data);
    // queueNames.forEach((queueId) => {
    //   console.log('QUEUE', queueId);
    // });
    let currentQueue = candyQueue.read(payload.queueId);
    //console.log(payload.queueId);//, currentQueue.data );

    if(currentQueue && currentQueue.data){
      const ids = Object.keys(currentQueue.data);
      // console.log('ids', ids);
      ids.forEach(messageId => {
        let savedPayload = currentQueue.read(messageId);
        console.log('event', savedPayload.event);
        socket.emit(savedPayload.event, savedPayload);
      });
    }
  });

  socket.on('received', (payload) => {
    //console.log(payload.queueId, 'received ', payload.messageId);
    let currentQueue = candyQueue.read(payload.queueId);
    if(!currentQueue){
      throw new Error('we have payloads, but no queue');
    }
    if(payload.queueId === 'customer'){
      console.log(payload.queueId, 'deleting ', payload.messageId);
    }
    currentQueue.remove(payload.messageId);
  });

});

console.log('listening on PORT:', PORT);
server.listen(PORT);