import React from 'react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
   const location = useLocation();
   const { bookingDetails } = location.state;

   if (!bookingDetails) {
      return <div>Loading...</div>;
   }

   const { bookingCode, tourName, totalAmount } = bookingDetails;

   return (
      <div className="checkout">
         <h2>Checkout</h2>
         <div className="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Booking Code:</strong> {bookingCode}</p>
            <p><strong>Tour Name:</strong> {tourName}</p>
            <p><strong>Total Amount:</strong> ${totalAmount}</p>
         </div>
         <div className="payment-details">
            <h3>Payment QR Code</h3>
            {/* Generate QR Code based on payment details */}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${bookingCode}&size=200x200`} alt="QR Code" />
            <p>Scan QR Code to make payment</p>
         </div>
      </div>
   );
};

export default Checkout;
