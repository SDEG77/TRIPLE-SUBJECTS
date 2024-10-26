const mongoose = require('mongoose');
const Booking = require('./models/Booking'); // Update path as necessary
const fs = require('fs');
const csv = require('csv-parser');

async function seedBookings() {
  const bookings = [];

  fs.createReadStream('./corrected_bookings_data_with_totals.csv') // Ensure path has .csv extension
    .pipe(csv())
    .on('data', (row) => {
      // Convert total to number if it includes a currency symbol
      const total = parseFloat(row.total.replace(/[^\d.-]/g, ''));

      // Parse date and check for validity
      const date = new Date(row.date);
      if (isNaN(date)) {
        console.warn(`Skipping row with invalid date: ${row.date}`);
        return; // Skip this row if date is invalid
      }

      bookings.push({
        client_id: row.client_id,
        receipt_uploaded: row.receipt_uploaded,
        package: row.package,
        service: row.service,
        addOns: row['addOns[0]'] ? [row['addOns[0]']] : [],
        date: date,
        time: row.time,
        status: row.status,
        payment_status: row.payment_status,
        total: total,
      });
    })
    .on('end', async () => {
      try {
        await Booking.insertMany(bookings);
        console.log('Bookings have been seeded successfully.');
      } catch (error) {
        console.error('Error seeding bookings:', error);
      } finally {
        mongoose.connection.close();
      }
    });
}

// Connect to MongoDB and run the seeder
mongoose.connect('mongodb://localhost:27017/triple', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    seedBookings();
  })
  .catch((error) => console.error('MongoDB connection error:', error));
