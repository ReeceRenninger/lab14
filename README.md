# LAB - Class 14

## Project: Candy/Food Delivery Service

### Author: [Eva Grace Smith](https://github.com/EvaGraceSmith) and [Reece Renninger](https://github.com/ReeceRenninger)

### Problem Domain  

Utilizing a socket server to create a delivery service that allows a customer to connect and send order requests to our candy store that drivers would then respond to and conduct the pickup and delivery.  Upon confirmation of delivery the vendor would send a thank you message to the customer for their order.

Stretch Goals:

- [x]Implement a standard queue
- [ ] allow users to send "thank you notes" to driver after order is received (deleted from queue).

### Links and Resources

- [GitHub Actions ci/cd](https://github.com/ReeceRenninger/lab14/actions/new)
<!-- - [back-end server url](http://xyz.com) (when applicable) -->

### Collaborators

- [Mark Smith](https://github.com/markmrsmith)

### Setup

#### `.env` requirements (where applicable)

env = < port of your choice >


#### How to initialize/run your application (where applicable)

- lab14/ `nodemon`
- /customers `node index.js`
- /candyMaker `node index.js`
- /driver `node index.js`



<!-- #### How to use your library (where applicable)

#### Features / Routes

- Feature One: Details of feature
- GET : `/hello` - specific route to hit -->

#### Tests

npm test will run all available tests

#### UML

![Lab 14 UML](assets/lab14UML.png)
