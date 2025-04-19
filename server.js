// server.js (Main server file)
const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Import the userRoutes file

const app = express();
app.use(express.json());

// Use the userRoutes for handling user-related requests
app.use('/users', userRoutes); // This will handle routes like /users/accept/:userId

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
