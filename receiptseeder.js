const mongoose = require('mongoose');
const Receipt = require('./models/Receipt'); // Update path to the Receipt model
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to seed receipts from CSV
async function seedReceipts() {
  const receipts = [];

  // Read from the CSV file
  fs.createReadStream(path.join(__dirname, 'receipt_seeder_200.csv')) // Ensure this is the correct path
    .pipe(csv())
    .on('data', (row) => {
      receipts.push({
        clientId: row.clientId, // Directly use as a string
        bookingId: row.bookingId,
        uploaded: row.uploaded,
        filename: row.filename,
        filepath: row.filepath,
        uploadedAt: new Date(row.uploadedAt), // Convert to Date object
        __v: Number(row.__v),
      });
    })
    .on('end', async () => {
      try {
        await Receipt.insertMany(receipts);
        console.log('Receipts have been seeded successfully.');
      } catch (error) {
        console.error('Error seeding receipts:', error);
      } finally {
        mongoose.connection.close();
      }
    });
}

// Connect to MongoDB and run the seeder
mongoose.connect('mongodb://localhost:27017/triple')
  .then(() => {
    console.log('MongoDB connected');
    seedReceipts();
  })
  .catch((error) => console.error('MongoDB connection error:', error));
