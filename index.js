const express = require('express');
const app = express();
const port = 3000;

routes = require('./src/routes/routes')

// Initialise routes
routes(app)

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});