const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const blogRouter = require('./routes/blogRoutes');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//CRUD
app.use('/api/blogs', blogRouter);
// Start the server
app.listen(3008, () => {
  console.log('Server started on port 3008');
});
