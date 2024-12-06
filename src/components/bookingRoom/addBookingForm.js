import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import SelectRoomCategories from './selectRoomCate';
import { format } from 'date-fns';

const AddBookingForm = forwardRef(({ onBookingCreated, customerID, serviceAmount, locationId, canInput }, ref) => {
    const roomCategoriesRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    const [totalAmount, setTotalAmount] = useState(0);
    const [roomPrices, setRoomPrices] = useState({});
    const [totalRoomsRemaining, setTotalRoomsRemaining] = useState(0);

    const [bookingData, setBookingData] = useState({
        taxId: null,
        staffId: null,
        status: 'Đã đặt',
        payment: 0,
        price: 0,
        checkin: today,
        checkout: tomorrow,
        note: '',
        humans: 1,
        contract: ''
    });

    const handleChange = (e) => {

        const { name, value } = e.target;
        const today = new Date();
        let newErrors = { ...errors };

        // Cập nhật giá trị bookingData trước
        const updatedBookingData = {
            ...bookingData,
            [name]: value
        };

        // Validate "humans"
        if (name === "humans") {
            const humans = Math.max(1, Number(value) || 1); // Ensure minimum is 1
            updatedBookingData.humans = humans;

            // Validation rules
            if (isNaN(humans) || humans < 1) {
                newErrors.humans = "Số lượng người phải là số và không được bé hơn 1";
            } else if (humans > 200) {
                newErrors.humans = "Số lượng người không được vượt quá 200";
            } else {
                delete newErrors.humans;
            }
        }

        if (name === "checkin") {
            const checkinDate = value ? new Date(value) : null; // Kiểm tra nếu ngày không được chọn
            const checkoutDate = updatedBookingData.checkout ? new Date(updatedBookingData.checkout) : null;

            if (!checkinDate) {
                newErrors.checkin = "Vui lòng chọn ngày check-in";
            } else {
                delete newErrors.checkin;

                if (checkoutDate) {
                    if (checkoutDate <= checkinDate) {
                        newErrors.checkout = "Ngày check-out phải sau ngày check-in ít nhất 1 ngày";
                    } else {
                        delete newErrors.checkout;
                    }
                }

                const today = new Date();
                if (checkinDate < today.setHours(0, 0, 0, 0)) {
                    newErrors.checkin = "Ngày check-in không thể là ngày trong quá khứ";
                } else {
                    delete newErrors.checkin;
                }
            }
        }


        if (name === "checkout") {
            const checkoutDate = value ? new Date(value) : null; // Kiểm tra nếu ngày không được chọn
            const checkinDate = updatedBookingData.checkin ? new Date(updatedBookingData.checkin) : null;

            if (!checkoutDate) {
                newErrors.checkout = "Vui lòng chọn ngày check-out";
            } else {
                delete newErrors.checkout;

                const today = new Date();
                if (checkoutDate < today.setHours(0, 0, 0, 0)) {
                    newErrors.checkout = "Ngày check-out không thể là ngày trong quá khứ";
                } else {
                    delete newErrors.checkout;
                }

                if (checkinDate) {
                    if (checkoutDate <= checkinDate) {
                        newErrors.checkout = "Ngày check-out phải sau ngày check-in ít nhất 1 ngày";
                    } else {
                        delete newErrors.checkout;
                    }
                }
            }
        }


        // Cập nhật lỗi và bookingData
        setErrors(newErrors);
        setBookingData(updatedBookingData);
    }


    const calculateTotalAmount = () => {
        let totalRoomAmount = Object.values(roomPrices).reduce((sum, price) => sum + price, 0);
        let total = totalRoomAmount + serviceAmount;

        setTotalAmount(total);

        setBookingData(prevBookingData => ({
            ...prevBookingData,
            price: total
        }));
    };

    useEffect(() => {
        calculateTotalAmount();

    }, [roomPrices, bookingData.checkin, bookingData.checkout, serviceAmount]);

    const handleRoomQuantityChange = (roomId, qty, price) => {
        setRoomPrices(prevPrices => ({
            ...prevPrices,
            [roomId]: price
        }));

    };

    const handleTotalRoomsRemaining = (totalRoomsRemaining) => {
        setTotalRoomsRemaining(totalRoomsRemaining);
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();

        if (isNaN(bookingData.humans) || bookingData.humans < 1) {
            newErrors.humans = "Số lượng người phải là số và không được bé hơn 1";
        } else if (bookingData.humans > 200) {
            newErrors.humans = "Số lượng người không được vượt quá 200";
        }

        if (!bookingData.checkin) {
            newErrors.checkin = "Vui lòng chọn ngày check-in";
        }

        if (!bookingData.checkout) {
            newErrors.checkout = "Vui lòng chọn ngày check-out";
        }
        const checkinDate = new Date(bookingData.checkin);
        if (checkinDate < today.setHours(0, 0, 0, 0)) {
            newErrors.checkin = "Ngày check-in không thể là ngày trong quá khứ";
        }

        const checkoutDate = new Date(bookingData.checkout);
        if (checkoutDate <= checkinDate) {
            newErrors.checkout = "Ngày check-out phải sau ngày check-in ít nhất 1 ngày";
        }

        const selectedRooms = Object.values(roomPrices).some(price => price > 0);
        if (!selectedRooms) {
            newErrors.roomSelection = "Vui lòng chọn ít nhất một phòng với số lượng lớn hơn 0";
            setErrorMessage(newErrors.roomSelection);  // Set error message
        } else {
            setErrorMessage('');  // Clear error message if there are selected rooms
        }

        // Add validation for note field
        if (bookingData.note.length > 700) {
            newErrors.note = "Ghi chú không được vượt quá 700 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createBooking = async (agencyID) => {
        if (!validateForm()) {
            console.log("Form has errors, please fix them before submitting.");
            return;
        }
        try {
            // Calculate the final price, including services
            const finalPrice = totalAmount;

            setBookingData(prevBookingData => ({
                ...prevBookingData,
                price: finalPrice
            }));

            // Create the booking
            const response = await axios.post('http://localhost:9999/bookings', {
                ...bookingData,
                price: finalPrice
            });

            const bookingId = response.data._id; // Get the bookingId from the response

            // Call the function to create order rooms
            const result = await roomCategoriesRef.current.createOrderRoom(bookingId, agencyID);

            if (result === undefined || result === false) {
                // If result is falsy, indicate insufficient rooms
                setErrorMessage('Không đủ số lượng phòng');

                // Optionally delete the booking if rooms couldn't be reserved
                await axios.delete(`http://localhost:9999/bookings/${bookingId}`);
                console.log(`Booking with ID ${bookingId} has been deleted due to insufficient room selection.`);

                return; // Exit the function
            }

            // Trigger callback to notify booking creation
            onBookingCreated(bookingId);
            setBookingData({
                taxId: null,
                staffId: null,
                status: 'Đã đặt',
                payment: 0,
                price: 0,
                checkin: today,
                checkout: tomorrow,
                note: '',
                humans: 1,
                contract: ''
            });
            setErrors({});
            setErrorMessage('');
            setRoomPrices({});
            setTotalAmount(0);
            return bookingId;
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error creating booking');
        }
    };

    useImperativeHandle(ref, () => ({
        createBooking
    }));
    if (!canInput) {
        return (

            <Card id='card'>
                <Card.Header className="abc" style={{ backgroundColor: "#81a969", color: "white" }}>
                    <h5 className="text-white">Chọn Loại Phòng & Số Lượng</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6} className="mx-auto">
                            <Form.Group controlId="checkin">
                                <Form.Label className="d-block text-center">
                                    <strong>Check-in Ngày:</strong>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="checkin"
                                    value={bookingData.checkin}
                                    onChange={handleChange}
                                    isInvalid={!!errors.checkin}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-center">
                                    {errors.checkin}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mx-auto">
                            <Form.Group controlId="checkout">
                                <Form.Label className="d-block text-center">
                                    <strong>Check-out Ngày:</strong>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="checkout"
                                    value={bookingData.checkout}
                                    onChange={handleChange}
                                    isInvalid={!!errors.checkout}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-center">
                                    {errors.checkout}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}>
                            <SelectRoomCategories
                                ref={roomCategoriesRef}
                                checkin={bookingData.checkin}
                                checkout={bookingData.checkout}
                                onQuantityChange={handleRoomQuantityChange}
                                onTotalRoomsRemaining={handleTotalRoomsRemaining}
                                customerID={customerID}
                                locationId={locationId}
                                canInput={canInput}
                            />
                        </Col>
                    </Row>

                </Card.Body>
            </Card>


        );
    }
    return (
        <Card className="mb-2">
            <Card.Header className="text-white" style={{ backgroundColor: '#81a969' }}><h5>Chọn Loại Phòng & Số Lượng</h5></Card.Header>
            <Card.Body>

                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="checkin">
                            <Form.Label><strong>Check-in Ngày: </strong></Form.Label>
                            <Form.Control
                                type="date"
                                name="checkin"
                                value={bookingData.checkin}
                                onChange={handleChange}
                                isInvalid={!!errors.checkin}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{errors.checkin}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="checkout">
                            <Form.Label><strong>Check-out Ngày:</strong></Form.Label>
                            <Form.Control
                                type="date"
                                name="checkout"
                                value={bookingData.checkout}
                                onChange={handleChange}
                                isInvalid={!!errors.checkout}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{errors.checkout}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    {canInput && (<Col md={3}>
                        <Form.Group>
                            <Form.Label><strong>Số lượng người</strong></Form.Label>
                            <Form.Control
                                type='number'
                                min={1}
                                name='humans'
                                value={bookingData.humans}
                                onChange={handleChange}
                                isInvalid={!!errors.humans}


                            />
                            <Form.Control.Feedback type='invalid'>{errors.humans}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>)}

                </Row>

                <SelectRoomCategories
                    ref={roomCategoriesRef}
                    checkin={bookingData.checkin}
                    checkout={bookingData.checkout}
                    onQuantityChange={handleRoomQuantityChange}
                    onTotalRoomsRemaining={handleTotalRoomsRemaining}
                    customerID={customerID}
                    locationId={locationId}
                    canInput={canInput}
                />

                {errorMessage && <Alert variant="danger" className="mt-2">{errorMessage}</Alert>}

                {canInput && (
                    <Row>
                        {/* Note Input Field */}
                        <Row className="mb-3">
                            <Col >
                                <Form.Group controlId="note">
                                    <Form.Label><strong>Ghi chú đặt phòng</strong></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Nhập ghi chú (nếu có)"
                                        name="note"
                                        value={bookingData.note}
                                        onChange={handleChange}
                                        isInvalid={!!errors.note}
                                        disabled={Object.keys(errors).length > 0}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.note}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <p><strong>Tổng Chi phí</strong> = Phí dịch vụ + Phí đặt phòng = {totalAmount} VND</p>
                        </Row>
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
});

export default AddBookingForm;
