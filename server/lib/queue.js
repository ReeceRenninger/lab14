'use strict';

//!!! STRETCH GOAL TO IMPLEMENT THIS

class Queue {
  constructor(){
    this.data = {};
  }

  store(key,value ){
    this.data[key] = value;
    console.log('Something was stored in queue'); // here for testing que adding
    return key;
  }

  read(key){
    return this.data[key];
  }

  remove(key){
    let value = this.data[key];
    delete this.data[key];
    console.log('Something was removed from queue'); // test que deletion
    return value; // returns what was deleted
  }
}

module.exports = Queue;