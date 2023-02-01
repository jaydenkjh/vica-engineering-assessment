# Vica Engineering Assessment

Node version: ```v18.13.0```

*Note: Consider using `nvm` if you need to run multiple versions of node https://github.com/nvm-sh/nvm

MongoDB: ```v6.0.4```

## Starting app

### Installing Dependencies
Initial Local MongoDB setup (Only if you do not have mongoDB in your machine) : https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/

Install dependencies
```npm install``` (Run ```npm rebuild``` if there are errors)

### Updating Configs

In this project, the default port is `3000` and the local mongoDB url is `mongodb://127.0.0.1:27017`.

If a different port or connection string is required, update it in the configuration file `config/default.json`

### Starting Project
To start, run
```npm run local```

## Testing App
Please refer to the postman collection in the repo for easy testing for the endpoints. These can be found in the 
`postman` folder inside the repository.

Suggested testing path `User Route - Create User` > `User Request Route - Approve User Request` > 
`Book Routes - Insert Book` > `Borrow Routes - Insert Borrow` > Other endpoints

These routes above contains tests that auto-populates the local variables in postman.

# Explanations 
## Project Structure
### Micro-service
Ideally, the service should be split into microservices (user and book service). However, for simplicity of the assignment,
it will be under the same project. 

### Layered Approach 
The codebase is divided into three categories –  business logic, database, and API routes, 
which fall into three different layers, service layer, controller layer, and data access layer.

Controller layer – This layer defines the API routes.

Service layer – This layer is responsible for executing the business logic.

Data access layer – Responsible for handling database.

## API design
The service uses REST API concept, and will communicate through HTTP requests to perform CRUD operations to the 
mongoDB.

### Client-Server Separation
The server (this service) can only act in one way: responding to the client. Likewise, the client should only be
able to make requests.

### Uniform Interface
All request should follow a common protocol and format. This request contains the HTTP method.

### Stateless
Each request is indepentent of each other in the server

## Code Implementation 
### Configuration and secret keys
Configuration is stored in the configuration folder. However, a secret key vault should be used to hold sensitive
information such as database credentials, host to ensure the security of the services.

### JWT Authentication 
JWT token is used to authenticate user's role. As login is not required to be done in this
assessment, I have generated tokens below to simulate a logged in user's token which
contains the userId and role (the userId is not used in this assessment). 
Copy and paste the below token for further
role testing.

Admin Examples
```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkN2EyZDBjYi0yYTRmLTQ5YTQtYTU2Yy03YzViZTAyNWZkNWIiLCJyb2xlIjoiQWRtaW4ifQ.2T5dgW0My9WsZY7L7yIaDstQum1crcTRFQ7OyGkL1GY```

```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkN2EyZDBjYi0yYTRmLTQ5YTQtYTU2Yy03YzViZTAyNTIyMmIiLCJyb2xlIjoiQWRtaW4ifQ.8qGJAqEvq1g7OoPQSlVfjFaas_5JNpw5hWTOnyFcfls```

Editor Example
```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MzllYTM4My04ODJlLTQwMWEtYTQ3MC0xMWExMzY1YzU1NjMiLCJyb2xlIjoiRWRpdG9yIn0.IdRfWVOidSFBrfO9KlgcAKxOHiUsYf6D4Vh_mk01qmc```

User Example
```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MzllYTM4My04ODJlLTQwMWEtYTQ3MC0xMWExMzY1YzU1NjMiLCJyb2xlIjoiVXNlciJ9.Egyovjx5rmf_qkBapxu3_wssnvXqFwK3v8rGpX9eQg8```

Note: The token is a simple check for role, and there are obviously better ways to authenticate and secure
this, such as using multiple and unique keys, and checking the record in the database. However, for simplicity
sake in the assessment, this simple check will be used.

### Implementation of maker checker (Admin Approval)
The bonus implementation uses a document in the mongoDB, `user-request`. Whenever a request happens to
add, remove or update user, instead of directly making changes to the users, a request is added into the 
user request. Another admin will be able to approve/reject this user request. If approved, the user request
get forwarded back to the user service to be processed.

Refer to `{{vica_host}}/v1/user-request/{{request_id}}` endpoint in the postman / code base for further information.

### Borrow Implementation
Though not stated in the requirement, the borrow document logs the borrow time and return date for each borrow action.
Each borrow/return action updates the log and the book borrow status / last borrower.

## Scalability of project
### Api Versioning

For endpoint routes, versioning is added for easy additional of new version for new requirements

### Load Balancing
When the server starts to experience high traffic, or is expected to experience high traffic, multiple instances
of the DB/server can be added and with the use of a load balance, can be used to distribute traffic to 
the different instances

### MongoDB 
With a huge database, performance/reliability will be required. Techniques like replication can be used for
high availability, and capacity can be increased using techniques like sharding.

### Redis
Depending on future requirements, for example, having a large database, Redis can be used for either 
caching for performance enhancement for certain critical operations, such as user login.

## Other additions
### Unit testing
Framework like Jest can be added to this assessment for testing

### Swagger
Swagger is helpful for teams to understand and test the endpoints