// load environment variables 
require('dotenv').config();

const app = require('./app');

// default to port 5000 if not specified
const PORT = process.env.PORT || 5000;

// start the express server 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});