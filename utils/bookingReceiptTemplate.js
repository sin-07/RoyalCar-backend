export function getBookingReceiptHTML({ booking, car, user }) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RoyalCar Booking Receipt</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #faf5ff 0%, #ffffff 60%);
      margin: 0;
      padding: 0;
      color: #222;
      -webkit-print-color-adjust: exact;
    }

    .container {
      max-width: 800px;
      margin: 20px auto;
      background: #fff;
      border-radius: 14px;
      border: 2px solid #a78bfa;
      padding: 28px 40px;
      box-sizing: border-box;
    }

    /* Header */
    h1 {
      color: #6d28d9;
      font-size: 24px;
      text-align: center;
      margin-bottom: 6px;
    }
    .subtitle {
      text-align: center;
      color: #666;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .section {
      margin-bottom: 18px;
    }

    .label {
      color: #555;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    .value {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    /* Tables */
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      font-size: 13px;
    }
    .details-table th {
      background: #ede9fe;
      color: #6d28d9;
      font-weight: 600;
      padding: 8px 10px;
      text-align: left;
      border-bottom: 2px solid #c4b5fd;
      font-size: 13px;
    }
    .details-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #f0f0f0;
    }
    .details-table tr:nth-child(even) td {
      background: #faf5ff;
    }

    /* Footer */
    .footer {
      text-align: center;
      font-size: 12px;
      color: #6d28d9;
      margin-top: 24px;
      line-height: 1.4;
    }
    .footer a {
      color: #7c3aed;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>RoyalCar Booking Receipt</h1>
    <div class="subtitle">Premium Car Rental Service</div>

    <!-- Booking Info -->
    <div class="section">
      <div class="label">Booking ID</div>
      <div class="value">${booking._id}</div>
      <div class="label">Date</div>
      <div class="value">${new Date(booking.createdAt).toLocaleString()}</div>
    </div>

    <!-- Car Details -->
    <div class="section">
      <table class="details-table">
        <tr><th colspan="2">Car Details</th></tr>
        <tr><td>Brand</td><td>${car.brand}</td></tr>
        <tr><td>Model</td><td>${car.model}</td></tr>
        <tr><td>Year</td><td>${car.year}</td></tr>
        <tr><td>Category</td><td>${car.category}</td></tr>
        <tr><td>Fuel Type</td><td>${car.fuel_type}</td></tr>
        <tr><td>Transmission</td><td>${car.transmission}</td></tr>
        <tr><td>Seats</td><td>${car.seating_capacity}</td></tr>
      </table>
    </div>

    <!-- Customer Details -->
    <div class="section">
      <table class="details-table">
        <tr><th colspan="2">Customer Details</th></tr>
        <tr><td>Name</td><td>${user.name}</td></tr>
        <tr><td>Email</td><td>${user.email}</td></tr>
      </table>
    </div>

    <!-- Booking Details -->
    <div class="section">
      <table class="details-table">
        <tr><th colspan="2">Booking Details</th></tr>
        <tr><td>Pickup Location</td><td>${booking.pickupLocation}</td></tr>
        <tr><td>Drop Location</td><td>${booking.dropLocation}</td></tr>
        <tr><td>Start Date</td><td>${new Date(booking.startDate).toLocaleString()}</td></tr>
        <tr><td>End Date</td><td>${new Date(booking.endDate).toLocaleString()}</td></tr>
        <tr><td>Total Amount</td><td><strong>₹${booking.totalAmount}</strong></td></tr>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer">
      Thank you for booking with <strong>RoyalCar</strong>!<br/>
      For support, contact <a href="mailto:support@royalcar.co.in">support@royalcar.co.in</a><br/>
      © 2025 RoyalCar. All rights reserved.
    </div>
  </div>
</body>
</html>

  `;
}
