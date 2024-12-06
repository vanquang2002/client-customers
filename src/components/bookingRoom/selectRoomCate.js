import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Card, Container } from 'react-bootstrap';

const SelectRoomCategories = forwardRef(({ checkin, checkout, customerID, onQuantityChange, onTotalRoomsRemaining, locationId, canInput }, ref) => {
    const [roomCategories, setRoomCategories] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [remainingRooms, setRemainingRooms] = useState({});
    const [nights, setNights] = useState(1);
    const [selectedRooms, setSelectedRooms] = useState([]);

    useEffect(() => {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const diffTime = checkoutDate - checkinDate;
        const calculatedNights = diffTime / (1000 * 60 * 60 * 24);
        setNights(calculatedNights > 0 ? calculatedNights : 1);
    }, [checkin, checkout]);

    const fetchRoomData = async () => {
        try {
            const roomCategoriesResponse = await axios.get('http://localhost:9999/roomCategories');
            const filteredRoomCategories = roomCategoriesResponse.data.filter(room => room.locationId._id === locationId);
            setRoomCategories(filteredRoomCategories);

            const bookedRoomsResponse = await axios.get(`http://localhost:9999/orderRooms/totalbycategory/?checkInDate=${checkin}&checkOutDate=${checkout}`);
            const bookedRoomsMap = {};
            bookedRoomsResponse.data.forEach(item => {
                bookedRoomsMap[item.roomCateId] = item.totalRooms;
            });

            const totalRoomsResponse = await axios.get('http://localhost:9999/rooms/category/totals');
            const initialRemainingRooms = {};
            totalRoomsResponse.data.categoryTotals.forEach(room => {
                const totalRooms = room.totalRooms;
                const bookedRooms = bookedRoomsMap[room.roomCateId] || 0;
                initialRemainingRooms[room.roomCateId] = totalRooms - bookedRooms;
            });

            setRemainingRooms(initialRemainingRooms);
            const totalRoomsRemaining = Object.values(initialRemainingRooms).reduce((sum, rooms) => sum + rooms, 0);
            onTotalRoomsRemaining(totalRoomsRemaining);

            return initialRemainingRooms; // Return the updated remaining rooms
        } catch (error) {
            console.error('Error fetching room data:', error);
            throw error;
        }
    };



    useEffect(() => {
        fetchRoomData();
    }, [checkin, checkout, onTotalRoomsRemaining, locationId]);

    useEffect(() => {
        // Cập nhật giá trị price cho tất cả các phòng khi nights thay đổi
        Object.keys(quantity).forEach(roomId => {
            const room = roomCategories.find(r => r._id === roomId);
            if (room) {
                const newPrice = room.price * quantity[roomId] * nights;
                onQuantityChange(roomId, quantity[roomId], newPrice);
            }
        });
    }, [nights]); // Chạy lại khi nights 

    const handleQuantityChange = (e, roomId) => {
        const value = Math.max(0, Math.min(Number(e.target.value), remainingRooms[roomId] || 0));
        const room = roomCategories.find(r => r._id === roomId);
        const price = room ? room.price * value * nights : 0;

        setQuantity(prevQuantity => {
            if (prevQuantity[roomId] === value) return prevQuantity; // Không thay đổi gì
            return {
                ...prevQuantity,
                [roomId]: value,
            };
        });

        setSelectedRooms(prevSelectedRooms => {
            const updatedRooms = [...prevSelectedRooms];
            const roomIndex = updatedRooms.findIndex(room => room.roomCateId === roomId);

            if (roomIndex >= 0) {
                if (value === 0) {
                    updatedRooms.splice(roomIndex, 1);
                } else {
                    updatedRooms[roomIndex].quantity = value;
                    updatedRooms[roomIndex].price = price; // Cập nhật giá trị mới
                }
            } else if (value > 0) {
                updatedRooms.push({ roomCateId: roomId, quantity: value, price });
            }

            return updatedRooms;
        });

        onQuantityChange(roomId, value, price);
    };


    const groupedRooms = roomCategories.reduce((groups, room) => {
        const location = room.locationId?.name || 'Unknown Location';
        if (!groups[location]) {
            groups[location] = [];
        }
        groups[location].push(room);
        return groups;
    }, {});

    const createOrderRoom = async (bookingId) => {
        try {
            const updatedRemainingRooms = await fetchRoomData(); // Fetch the latest data

            // Check for invalid room selections
            const invalidSelections = selectedRooms.filter(room => {
                const available = updatedRemainingRooms[room.roomCateId] || 0;
                return room.quantity > available;
            });

            if (invalidSelections.length > 0) {
                // alert('Some room selections exceed the available number of rooms. Please adjust your selections.');
                return false; // Return false to indicate failure
            }

            // Check if no rooms were selected
            if (!selectedRooms.length) {
                alert('No rooms selected.');
                return false; // Return false to indicate failure
            }

            // Create room orders
            const orderRoomPromises = selectedRooms.map(room => {
                return axios.post('http://localhost:9999/orderRooms', {
                    roomCateId: room.roomCateId,
                    customerId: customerID,
                    bookingId: bookingId,
                    quantity: room.quantity,
                    receiveRoom: checkin,
                    returnRoom: checkout
                });
            });

            await Promise.all(orderRoomPromises);
            console.log('Order rooms created successfully.');

            // Reset state
            setQuantity({});
            setSelectedRooms([]);
            fetchRoomData(); // Refresh room data after reset
            return true; // Return true to indicate success
        } catch (error) {
            console.error('Error creating order rooms:', error);
            alert('An error occurred while creating room orders. Please try again.');
            // return false; // Return false to indicate failure
        }
    };

    useImperativeHandle(ref, () => ({
        createOrderRoom,
    }));


    return (
        <div>
            {Object.keys(groupedRooms).map(location => (
                <Card key={location} className="mb-2">
                    <Card.Header className='text-center'>
                        <h5>{location}</h5>
                    </Card.Header>
                    <Card.Body>
                        {groupedRooms[location].map(room => {
                            const remainingRoomCount = remainingRooms[room._id] || 0;
                            const qty = quantity[room._id] || 0;
                            const totalRoomPrice = room.price * qty * nights;
                            if (canInput) {
                                return (
                                    <Row key={room._id} className="mb-3">
                                        <Col className="col-8">
                                            <Form.Label><strong>{room.name}</strong> - (giá 1 đêm: {room.price} VND)</Form.Label>
                                            <h6 className='text-secondary'>  Phòng còn trống: {Math.max(0, remainingRoomCount)}  <br />Tổng chi phí {qty} phòng: {totalRoomPrice} VND</h6>
                                        </Col>
                                        <Col className="col-2 d-flex align-items-center">

                                            <Form.Control
                                                type="number"
                                                min="0"
                                                max={remainingRoomCount}
                                                value={qty}
                                                onChange={(e) => handleQuantityChange(e, room._id)}
                                                required
                                            />

                                        </Col>
                                    </Row>
                                );
                            }
                            // Form for when `canInput` is false (static display)
                            return (
                                <Card className="mb-3 shadow-sm border-0">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={6} className="d-flex flex-column">
                                                <h5 className="text-primary fw-bold mb-2">{room.name}</h5>
                                                <p className="text-secondary mb-0">
                                                    Giá 1 đêm: <strong>{room.price.toLocaleString()} VND</strong>
                                                </p>
                                            </Col>
                                            <Col md={6} className="text-end">
                                                <p className="text-muted mb-1">
                                                    <strong>Phòng còn trống:</strong> {remainingRoomCount}
                                                </p>
                                                <p className="text-muted">{room.description}</p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
});

export default SelectRoomCategories;
