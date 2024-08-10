const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const port = 1000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7982',
  database: 'user_auth'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public', 'Images')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// API endpoint to handle user registration
app.post('/api/register', async (req, res) => {
  const { firstname, lastname, contact, address, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (firstname, lastname, contact, address, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [firstname, lastname, contact, address, email, username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
      return;
    }
    res.status(200).send('User registered successfully');
  });
});

// API endpoint to handle user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// API endpoint to handle truck registration
app.post('/api/register-truck', (req, res) => {
  const { truckNumber, truckType, truckCapacity, truckModel, truckOwner, truckOwnerContact, truckDriver, truckDriverContact, truckStatus } = req.body;
  const query = 'INSERT INTO trucks (truck_number, truck_type, truck_capacity, truck_model, truck_owner, truck_owner_contact, truck_driver, truck_driver_contact, truck_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [truckNumber, truckType, truckCapacity, truckModel, truckOwner, truckOwnerContact, truckDriver, truckDriverContact, truckStatus], (err, result) => {
    if (err) {
      console.error('Error inserting truck data:', err);
      res.status(500).send({ success: false, message: 'Error inserting truck data', error: err });
      return;
    }
    res.status(200).send({ success: true, message: 'Truck registered successfully' });
  });
});

// API endpoint to handle order placement
app.post('/api/place-order', (req, res) => {
  console.log('Received Order Data:', req.body);  // Debugging line to check received data

  const { order_id, name, address, phone, email, item, quantity, weight, distance, cost } = req.body;

  const query = `
      INSERT INTO orders (order_id, name, address, phone, email, item, quantity, weight, distance, cost, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const status = 'Pending'; // Default status for new orders

  db.query(query, [order_id, name, address, phone, email, item, quantity, weight, distance, cost, status], (err, result) => {
      if (err) {
          console.error('Error inserting order data:', err);  // Debugging line for insertion error
          res.status(500).send({ success: false, message: 'Error inserting order data', error: err });
          return;
      }
      console.log('Order Data Inserted:', result);  // Debugging line to confirm successful insertion
      res.status(200).send({ success: true, message: 'Order placed successfully' });
  });
});

// API endpoint to fetch orders data
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching order data:', err);
      res.status(500).send('Error fetching order data');
      return;
    }
    res.status(200).json(results);
  });
});

// API endpoint to update order status
app.post('/api/update-order-status', (req, res) => {
  const { order_id, status } = req.body;

  const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
  db.query(query, [status, order_id], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      res.status(500).send({ success: false, message: 'Error updating order status', error: err });
      return;
    }

    if (result.affectedRows > 0) {
      res.status(200).send({ success: true, message: 'Order status updated successfully' });
    } else {
      res.status(404).send({ success: false, message: 'Order not found' });
    }
  });
});

// API endpoint to fetch all orders
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      res.status(500).send({ success: false, message: 'Error fetching orders' });
      return;
    }
    res.status(200).json(results);
  });
});

// API endpoint to fetch order status by tracking number
app.get('/api/track-order', (req, res) => {
  const { trackingNumber } = req.query;

  const query = 'SELECT status FROM orders WHERE order_id = ?';
  db.query(query, [trackingNumber], (err, results) => {
    if (err) {
      console.error('Error fetching tracking information:', err);
      res.status(500).send({ success: false, message: 'Error fetching tracking information' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ success: false, message: 'Tracking number not found' });
    } else {
      res.status(200).send({ success: true, status: results[0].status });
    }
  });
});

// Serve HTML files from the views directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'About.html'));
});

app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Booking.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Sign_Up.html'));
});

app.get('/tracking', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Tracking.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
