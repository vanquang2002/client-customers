import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const SaveHistory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get bookingId, note, and user from location state
    const location = useLocation();
    const { bookingId, note, path } = location.state || {};

    // Ref to track if saveToHistory has been called already
    const hasSaved = useRef(false);

    // Function to save booking history
    const saveToHistory = async () => {
        if (hasSaved.current) return; // Prevent multiple calls
        hasSaved.current = true; // Mark as called to prevent further execution

        setLoading(true);
        setError(null);
        console.log('Saving history...');

        try {


            // Fetch booking details
            const bookingResponse = await axios.get(`http://localhost:9999/bookings/${bookingId}`);
            const bookingData = bookingResponse.data;

            // Fetch related orderServices for the booking
            const orderServicesResponse = await axios.get(`http://localhost:9999/orderServices/booking/${bookingId}`);
            const orderServicesData = orderServicesResponse.data;

            // Prepare data to save in history
            const historyData = {
                bookingId,
                old_info: {
                    booking: bookingData,
                    orderServices: orderServicesData
                },
                note: note || 'Updated booking and services',
            };

            // Send the data to history
            await axios.post('http://localhost:9999/histories', historyData);


            // Navigate to the provided path
            if (path) {
                navigate(path);
            } else {
                throw new Error('Path is not provided for navigation.');
            }
        } catch (error) {
            console.error('Error saving history:', error);
            setError(error.message || 'Error saving history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Run saveToHistory when bookingId is available
    useEffect(() => {
        if (bookingId && !hasSaved.current) {
            saveToHistory();
        } else {
            setError('Booking ID is missing. Unable to save history.');
        }
    }, [bookingId]);

    return (
        <div>
            {loading ? (
                <p>Saving history...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>History saved for booking {bookingId}</p>
            )}
        </div>
    );
};

export default SaveHistory;
