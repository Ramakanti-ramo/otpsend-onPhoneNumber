

const express = require('express');
const app = express();
const mysql = require('mysql');
const twilio = require('twilio');

const PORT = 3000;
const accountSid = 'ACCOUNTID';
const authToken = 'AUTHTOKEN';
const phoneNumber = '+17602354255';

// Create MySQL Connection
const dbb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'schoolmanagementsystem'
});

// Connect to MySQL
dbb.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database!');
});

app.use(express.json());

// Create Twilio client
const client = new twilio(accountSid, authToken);

//  notification to student's phone
app.post('/send-notification/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  // Fetch student's phone number from the student_profile table
  const sql = 'SELECT phone FROM student_profile WHERE studentId = ?';
  dbb.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error('Error fetching student phone number:', err);
      return res.status(500).json({ error: 'An error occurred while fetching student phone number' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const studentPhoneNumber = result[0].phone;
    // Send notification to the student's (ramakanti) phone number using Twilio
    client.messages.create({
      body: 'hlo friends,,,, this side Ramakanti ',
      to: studentPhoneNumber,
      from: phoneNumber // Your Twilio phone number
    })
    .then(message => {
      console.log('Notification sent:', message.sid);
      res.status(200).json({ success: true, message: 'Notification sent successfully' });
    })
    .catch(error => {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'An error occurred while sending notification' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
