module.exports = (app) => {

    // Adding versioning for future changes
    const VERSION = {
        v1 : 'v1',
    }

    const PATHS = {
        user: '/user'
    }

    app.get('/', (req, res) => {
        res.send('VICA Engineering Assessment');
    });


    /* User routes */


    /* Book routes */
}