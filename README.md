# Structure

### Router (Using Node.js and Express)
> Router receives http requests and forwards them to the controller
> Receives data from the Controller and bundles it in http responses that it sends

### Controller
> Creates, reads, updates, and deletes data models defined with the Mongoose library
> Fulfills requests received

### Data models (using Mongoose)
> Creates data models the controller uses

### Database (using MongoDB)
> User profiles and sessions information will reside here
> Document database where each record and its associated data is thought of as a "document"

#### Mongoose ORM
> Mongoose makes it easy to move data between app and MongoDB database
> Mongoose allows the creation of schemas for the data and provides facilities for connecting to MongoDB and validating, saving, updating, deleting, and retrieving instances of the schemas



## User Authentication

### Controller (responds to following requests)
> Register user
> Log on a user
> Log off a user
> Initiate a password reset for a user
> Finalize a password reset for a user

### Models
#### Api-Response
> Data transfer class that helps move data out of the controller
#### Api-Messages
> Defines causes for when ApiResponse instance does not succeed
#### User-Profile
> Data sent in the extras property of an ApiResponse instance can include a read-only version of the user's profile
> Helps pass user data from database to the outer layers of the backend without exposing sensitive information such as hash and salt values
