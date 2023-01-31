const
    express = require('express'),
    app = express(),

    /* Initialise config file */
    config = require('config'),

    /* MongoDB */
    mongo = require('./src/datastore/mongo');

/* .ENV import */
require('dotenv').config()
/* Route files */
routes = require('./src/api/routes');
appController = require('./src/services/app-controller')

// Initialise MongoDB
url = config.get('database.mongodb_uri')

const mongoDb = new mongo(url, config)

try {
    mongoDb.init();
} catch (ex) {
    console.error('MongoDB failed to start')
    process.exit(1)
}

// middleware to read body, parse it and place results in req.body
app.use(express.json());             // for application/json
app.use(express.urlencoded({ extended: true }))       // for application/x-www-form-urlencoded

const controller = new appController({mongo: mongoDb, config: config })

// Initialise routes
routes(app, controller)

const port = config.get('server.port')
const name = config.get('server.name')
app.listen(port, () => {
    console.log(`---------- Starting ${name} ----------`)
    console.log(`service listening at http://localhost:${port}`);
});