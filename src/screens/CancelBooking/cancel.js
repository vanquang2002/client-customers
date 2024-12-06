import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const PaymentCancel = () => {
  const { id } = useParams();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    color: '#b43a3a',
    backgroundColor: '#ffe6e6',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '20px auto',
    border: '1px solid #f5bcbc',
  };

  const headingStyle = {
    fontSize: '2rem',
    marginBottom: '10px',
  };

  const paragraphStyle = {
    fontSize: '1.2rem',
  };

  const { bookingId } = useParams();
  const [message, setMessage] = useState('Processing your payment...');
  const [booking, setBooking] = useState(null);


  useEffect(() => {
    console.log(bookingId);
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`);
        setBooking(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching booking:", error.message);
        setMessage('An error occurred while fetching your booking');
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const createCancel = async () => {
      if (!booking) return;

      console.log("Current booking status before payment:", booking.status); // Log trạng thái hiện tại

      try {


        const updateBookingResponse = await axios.delete(`${BASE_URL}/bookings/all/${booking._id}`);
        if (updateBookingResponse.data) {
          setMessage(`${booking._id} đã được hủy thành công`);

        } else {
          setMessage('có lỗi, đơn đặt không tồn tại');
        }


      } catch (error) {
        console.error("Error creating payment:", error.message);
        console.error("API error:", error.response ? error.response.data : error.message);
        setMessage('Có vấn đề xảy ra khi hủy đơn');
      }
    };

    createCancel();
  }, [booking]);
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>{message}{ }</h1>

    </div>
  );
};

export default PaymentCancel;
