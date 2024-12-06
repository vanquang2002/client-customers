import React, { useState, useRef } from 'react';
import AddUserForm from '../components/bookingRoom/addUserForm';
import AddIdentifyForm from '../components/bookingRoom/addIdentifyForm';
import { Col, Row, Button, Container } from 'react-bootstrap';
import AddBookingForm from '../components/bookingRoom/addBookingForm';
import AddServiceForm from '../components/bookingRoom/addServiceForm';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CustomerBookingPage = () => {
    const [userId, setUserId] = useState(null); // To store the created user ID
    const [bookingId, setBookingId] = useState(null); // To store the created booking ID
    const [AgencyId, setAgencyId] = useState(null);
    const [bookingPay, setBookingPpay] = useState(null);
    const userFormRef = useRef(null);           // Reference to the user form
    const identifyFormRef = useRef(null);       // Reference to the identification form
    const bookingFormRef = useRef(null);        // Reference to the booking form (optional for future use)
    const addServiceRef = useRef(null);         // Reference to the AddServiceForm
    const navigate = useNavigate();

    const { locationId } = useParams();


    const [serviceTotal, setServiceTotal] = useState(0);

    // Hàm xử lý khi tổng dịch vụ thay đổi
    const handleServiceTotalChange = (total) => {
        setServiceTotal(total);
    };


    const handleCreateBoth = async () => {
        try {
            // 1. Tạo khách hàng
            const { customerID, agencyID } = await userFormRef.current.createUser();

            if (customerID) {
                setUserId(customerID); // Lưu ID khách hàng
                console.log("Khách hàng đã được tạo với ID");

                // 2. Tạo giấy tờ tùy thân sau khi khách hàng được tạo
                const identifyCreated = await identifyFormRef.current.createIdentify(customerID);
                if (!identifyCreated) {
                    console.log('Tạo giấy tờ tùy thân thất bại.');
                    toast.error('Có lỗi xảy ra khi tạo giấy tờ tùy thân. Vui lòng thử lại.', {
                        position: "top-right",
                    });
                    return; // Dừng thực thi nếu tạo giấy tờ tùy thân thất bại
                }

                // 3. Tạo đặt phòng
                const createdBookingId = await bookingFormRef.current.createBooking(agencyID);
                if (createdBookingId) {
                    setBookingId(createdBookingId); // Lưu ID đặt phòng

                    // 4. Thêm dịch vụ đã chọn vào orderService sau khi đặt phòng được tạo
                    await addServiceRef.current.addService(createdBookingId);
                    console.log('Đặt phòng và dịch vụ đã được tạo thành công!');
                    //5. Xử ký payment
                    handlePayment(createdBookingId, agencyID);
                    navigate('/')
                } else {
                    toast.error('Có lỗi xảy ra khi tạo đặt phòng hoặc dịch vụ. Vui lòng thử lại.', {
                        position: "top-right",
                    });
                    console.log('Đặt phòng và dịch vụ chưa được tạo.');
                }
            } else {
                toast.error('Có lỗi xảy ra khi tạo khách hàng. Vui lòng thử lại.', {
                    position: "top-right",
                });
                console.log('Tạo khách hàng thất bại.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo khách hàng, giấy tờ tùy thân, hoặc đặt phòng:', error);
            toast.error('Có lỗi xảy ra trong quá trình tạo. Vui lòng thử lại.', {
                position: "top-right",
            });
        }
    };


    const handlePayment = async (createdBookingId, agencyID) => {
        try {
            // Assuming you have a method to get the booking details
            const bookingResponse = await axios.get(`${BASE_URL}/bookings/${createdBookingId}`);
            const booking = bookingResponse.data;
            let bookingPrice = booking.price
            if (agencyID) {
                bookingPrice = bookingPrice * 80 / 100
            }
            const response = await axios.post(
                `${BASE_URL}/payment/create-payment-link`,
                {
                    amount: bookingPrice,
                    bookingId: booking._id,
                }
            );

            if (response.status === 200) {
                const { checkoutUrl } = response.data;
                window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            } else {
                console.error('Failed to create payment link');
            }
        } catch (error) {
            console.error('Error creating payment link:', error);
        }
    };
    return (
        <div className="container">
            <ToastContainer />
            <br />
            <Row>
                <Col md="6">
                    {/* User Form */}
                    <AddUserForm ref={userFormRef} />

                    <br />
                    {/* Service Form */}
                    <AddServiceForm
                        ref={addServiceRef}
                        bookingId={bookingId} // Pass booking ID after it's created
                        onServiceTotalChange={handleServiceTotalChange} // Callback for service total
                    />
                </Col>

                <Col>
                    {/* Identification Form */}
                    <AddIdentifyForm ref={identifyFormRef} />
                    <br />
                    {/* Booking Form */}
                    <AddBookingForm
                        ref={bookingFormRef}
                        onBookingCreated={setBookingId}
                        customerID={userId}
                        serviceAmount={serviceTotal}
                        locationId={locationId} // Pass locationId here
                        canInput={true}
                    />

                </Col>
            </Row>
            <Button className='mt-3 ' style={{ backgroundColor: '#81a969', border: 'none', height: '50px', width: '150px' }} onClick={handleCreateBoth} >
                Đặt Phòng Ngay
            </Button>
        </div>
    );
};

export default CustomerBookingPage;
