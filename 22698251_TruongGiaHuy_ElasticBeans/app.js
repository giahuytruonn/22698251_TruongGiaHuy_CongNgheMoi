const express = require('express');
const path = require('path');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});
