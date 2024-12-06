import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, CardTitle } from "react-bootstrap";
import { IoLocationSharp, IoWifi } from "react-icons/io5";
import "./cs2.css";
import { IoLogoNoSmoking, IoIosRestaurant } from "react-icons/io";
import { MdCleaningServices, MdFamilyRestroom } from "react-icons/md";
import { LuParkingCircle } from "react-icons/lu";
import { TbDisabled } from "react-icons/tb";
import Review from "../../../components/Reviews/review";
import axios from 'axios';
import BookingPage from "../../pageBookingByCustomer";
const CS2 = () => {
    const locationId = "66f6c536285571f28087c16b";
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];


    const [bookingData, setBookingData] = useState({
        taxId: null,
        staffId: null,
        status: 'In Progress',
        payment: 'Chưa Thanh Toán',
        price: 0,
        checkin: today,
        checkout: tomorrow,
        note: ''
    });

    const [customerData, setCustomerData] = useState({
        fullname: '',
        email: '',
        phone: '',
        dob: ''
    });

    const [errors, setErrors] = useState({});
    const [taxes, setTaxes] = useState([]);
    const [roomCategories, setRoomCategories] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [bookingId, setBookingId] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchTaxesAndRoomCategories = async () => {
            try {
                const taxResponse = await axios.get('http://localhost:9999/taxes');
                const roomCategoriesResponse = await axios.get('http://localhost:9999/roomCategories');

                const defaultTax = taxResponse.data.find(tax => tax.code === '000000');

                if (defaultTax) {
                    setBookingData(prevData => ({
                        ...prevData,
                        taxId: defaultTax._id
                    }));
                }

                setTaxes(taxResponse.data);
                setRoomCategories(roomCategoriesResponse.data);

                const initialQuantity = {};
                roomCategoriesResponse.data.forEach(room => {
                    initialQuantity[room._id] = 0;
                });
                setQuantity(initialQuantity);

            } catch (error) {
                console.error('Error fetching taxes or room categories:', error);
            }
        };

        fetchTaxesAndRoomCategories();
    }, []);

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuantityChange = (e, roomId) => {
        setQuantity({
            ...quantity,
            [roomId]: e.target.value
        });
    };

    const handleCustomerChange = (e) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const calculateTotalAmount = () => {
        let total = 0;

        const checkinDate = new Date(bookingData.checkin);
        const checkoutDate = new Date(bookingData.checkout);
        const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

        roomCategories.forEach((room) => {
            const qty = quantity[room._id] || 0;
            if (qty > 0) {
                total += room.price * qty * nights;
            }
        });

        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount();
    }, [bookingData.checkin, bookingData.checkout, quantity]);

    const validateForm = () => {
        const newErrors = {};

        // Fullname validation
        if (!customerData.fullname.trim()) {
            newErrors.fullname = "Full name is required";
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(customerData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation (Vietnamese phone numbers)
        const phonePattern = /^(03|05|07|08|09)\d{8,9}$/;
        if (!phonePattern.test(customerData.phone)) {
            newErrors.phone = "Please enter a valid Vietnamese phone number (10 or 11 digits)";
        }

        // Date of Birth validation (at least 18 years old)
        const today = new Date();
        const dob = new Date(customerData.dob);
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18 || (age === 18 && today < new Date(dob.setFullYear(today.getFullYear() - 18)))) {
            newErrors.dob = "Customer must be at least 18 years old";
        }

        // Check-in date validation
        const checkinDate = new Date(bookingData.checkin);
        if (checkinDate < today.setHours(0, 0, 0, 0)) {
            newErrors.checkin = "Check-in date cannot be in the past";
        }

        // Check-out date validation
        const checkoutDate = new Date(bookingData.checkout);
        if (checkoutDate <= checkinDate) {
            newErrors.checkout = "Check-out date must be at least 1 day after check-in";
        }

        // Room selection validation (at least one room must have quantity > 0)
        const selectedRooms = Object.values(quantity).some(qty => qty > 0);
        if (!selectedRooms) {
            newErrors.roomSelection = "Please select at least one room with a quantity greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form has errors, fix them first.");
            return;
        }

        // Rest of the submit logic
        try {
            // Calculate the total price based on room quantities and nights
            let totalPrice = 0;

            const checkinDate = new Date(bookingData.checkin);
            const checkoutDate = new Date(bookingData.checkout);
            const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24); // convert milliseconds to days

            roomCategories.forEach((room) => {
                const qty = quantity[room._id] || 0;
                if (qty > 0) {
                    totalPrice += room.price * qty * nights;
                }
            });

            setBookingData((prevData) => ({
                ...prevData,
                price: totalPrice,
            }));

            // if (isUpdating && bookingId) {
            //     await axios.put(`http://localhost:9999/bookings/${bookingId}`, { ...bookingData, price: totalPrice });
            //     await axios.put(`http://localhost:9999/customers/${customerId}`, customerData);

            //     const existingOrderRooms = await axios.get(`http://localhost:9999/orderRooms/booking/${bookingId}`);
            //     await handleRoomOrders(existingOrderRooms.data, customerId, bookingId);
            // } else {
            const customerResponse = await axios.post('http://localhost:9999/customers', customerData);
            const bookingResponse = await axios.post('http://localhost:9999/bookings', { ...bookingData, price: totalPrice });

            const newBookingId = bookingResponse.data._id;
            const newCustomerId = customerResponse.data._id;

            setBookingId(newBookingId);
            setCustomerId(newCustomerId);

            setIsUpdating(true);

            await handleRoomOrders([], newCustomerId, newBookingId);
            navigator.push("/listBooking");
        } catch (error) {
            console.error('Error processing booking or room orders:', error);
        }
    };

    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };
    const handleRoomOrders = async (existingOrderRooms, cusId, bookId) => {
        const orderRoomPromises = Object.entries(quantity).map(async ([roomCateId, qty]) => {
            if (qty > 0) {
                const existingOrderRoom = existingOrderRooms.find(orderRoom => orderRoom.roomCateId._id === roomCateId);
                if (existingOrderRoom) {
                    return axios.put(`http://localhost:9999/orderRooms/${existingOrderRoom._id}`, { quantity: qty });
                } else {
                    return axios.post('http://localhost:9999/orderRooms', {
                        roomCateId,
                        customerId: cusId,
                        bookingId: bookId,
                        quantity: qty
                    });
                }
            } else if (qty == 0) {
                const existingOrderRoom = existingOrderRooms.find(orderRoom => orderRoom.roomCateId._id === roomCateId);
                if (existingOrderRoom) {
                    return axios.delete(`http://localhost:9999/orderRooms/${existingOrderRoom._id}`);
                }
            }
            return null;
        });

        await Promise.all(orderRoomPromises);
    };

    // const handleDeleteAll = async () => {
    //     try {
    //         if (bookingId) {
    //             const existingOrderRooms = await axios.get(`http://localhost:9999/orderRooms/booking/${bookingId}`);
    //             const deleteOrderRoomPromises = existingOrderRooms.data.map(orderRoom => {
    //                 return axios.delete(`http://localhost:9999/orderRooms/${orderRoom._id}`);
    //             });
    //             await Promise.all(deleteOrderRoomPromises);

    //             await axios.delete(`http://localhost:9999/bookings/${bookingId}`);
    //             await axios.delete(`http://localhost:9999/customers/${customerId}`);

    //             setBookingId(null);
    //             setCustomerId(null);
    //             setIsUpdating(false);

    //             console.log('Booking, customer, and related order rooms deleted successfully');
    //         }
    //     } catch (error) {
    //         console.error('Error deleting booking, customer, or order rooms:', error);
    //     }
    // };
    return (
        <div className="container">
            <p><a href="/">Trang chủ</a> / <a href="/cs2">Nhà khách Hương Sen cơ sở Đồ Sơn</a></p>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="15px"
                width="15px"
                version="1.1"
                viewBox="0 0 53.867 53.867"
                xmlSpace="preserve"
            >
                <polygon
                    style={{ fill: "#EFCE4A" }}
                    points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
                />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="15px"
                width="15px"
                version="1.1"
                viewBox="0 0 53.867 53.867"
                xmlSpace="preserve"
            >
                <polygon
                    style={{ fill: "#EFCE4A" }}
                    points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
                />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="15px"
                width="15px"
                version="1.1"
                viewBox="0 0 53.867 53.867"
                xmlSpace="preserve"
            >
                <polygon
                    style={{ fill: "#EFCE4A" }}
                    points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
                />
            </svg>
            <h2>Nhà Khách Hương Sen cơ sở Đồ Sơn</h2>
            <div><IoLocationSharp /> 02 Lý Thánh Tông, phường Hải Sơn, Đồ Sơn, Hải Phòng </div>
            <Row>
                <Col md={8}>
                    <div className="gallery-wrapper">
                        <div className="gallery">
                            <div className="big-photo">
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/593310177.jpg?k=a9de1eccb720ce49c1c728d4e170a61ac86176fe66fc1d0a14ba5a5eee6cd1d4&o=&hp=1" alt="Big Gallery Photo" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/567870408.jpg?k=27371f71b87b7c9ce3f291cc6c8cc0f42cec00527b2278fdb3e3d4fc2b8110ae&o=&hp=1" />
                            </div>
                            <div className="small-photos">
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/567876117.jpg?k=f95cb21780be075dc1c95c25fa3dd13e80fad61fa204b719beff72ae2128516c&o=&hp=1" alt="Small Gallery Photo 1" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566929901.jpg?k=6f6814cc043b57c25e817ba0a7cf296ff6e2c41fa305930bc2bdbda731ff1053&o=&hp=1" alt="Small Gallery Photo 2" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566933748.jpg?k=172df76f403386dc8c9c2918f08b2ae446d75a895ead05a6c0b471a7fa5a3470&o=&hp=1" alt="Small Gallery Photo 3" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566929762.jpg?k=3fe4e9c3bc7e380d3ce637950dac2ab3db55cbd75b27eadf8a774ab472bc8b3a&o=&hp=1" alt="Small Gallery Photo 4" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/537943768.jpg?k=31641926c5354eff8417c8e0c6b1f4d853e1d10fe2b7c520a02be9a98a9f3046&o=&hp=1" alt="Small Gallery Photo 5" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566933312.jpg?k=6e307cc2ee27ca8636ebd2def92a1462845fc0c2117471a99ccd82584f20f0d2&o=&hp=1" alt="Small Gallery Photo 5" />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div>
                        <div className="description">
                            <span>
                                {isExpanded
                                    ? (
                                        <>
                                            Nhà Khách Hương Sen nằm tại trung tâm Thành phố Hải Phòng, chỉ cách Vincom Ngô Quyền 12 phút đi bộ, mang đến một không gian nghỉ dưỡng thoải mái với nhiều tiện nghi hiện đại. Chỗ nghỉ cung cấp xe đạp miễn phí, bãi đỗ xe riêng, khu vườn và một phòng chờ chung để thư giãn.<br />
                                            Khách sạn có nhà hàng và bếp chung, đồng thời cung cấp dịch vụ phòng và Wi-Fi miễn phí khắp khuôn viên. Đội ngũ lễ tân hoạt động 24 giờ luôn sẵn sàng hỗ trợ, cung cấp dịch vụ thu đổi ngoại tệ và hỗ trợ khách trong suốt thời gian lưu trú.<br />
                                            Mỗi phòng nghỉ tại Nhà Khách Hương Sen đều được trang bị đầy đủ tiện nghi như điều hòa, bàn làm việc, TV màn hình phẳng và tủ lạnh. Khách cũng có thể thư giãn trên ban công riêng của mình với tầm nhìn ra thành phố.<br />
                                            Phòng tắm riêng trong mỗi phòng có sẵn khăn tắm và ga trải giường sạch sẽ, đảm bảo mang lại sự thoải mái cho khách hàng.<br />
                                            Khách sạn còn có một sân hiên ngoài trời, nơi khách có thể thư giãn và tận hưởng không gian thoáng đãng của khu vực.<br />
                                            Đặc biệt, Nhà Khách Hương Sen nằm gần các điểm tham quan nổi tiếng của Hải Phòng như Nhà hát lớn Hải Phòng (chỉ 1 km) và cách Cảng Tuần Châu 43 km.<br />
                                            Các cặp đôi đánh giá địa điểm này 9,2 điểm, phản ánh sự hài lòng với không gian và dịch vụ tại đây.
                                        </>
                                    )
                                    : (
                                        <>
                                            Nhà Khách Hương Sen nằm tại trung tâm Thành phố Hải Phòng, chỉ cách Vincom Ngô Quyền 12 phút đi bộ, mang đến một không gian nghỉ dưỡng thoải mái với nhiều tiện nghi hiện đại...<br />
                                            Các cặp đôi đánh giá địa điểm này 9,2 điểm, phản ánh sự hài lòng với không gian và dịch vụ tại đây.
                                        </>
                                    )}
                            </span>
                            <a onClick={handleToggle}>
                                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </a>
                        </div>

                    </div>
                    <br />
                    <b>Các tiện nghi được ưa chuộng nhất</b><br />
                    <span><IoLogoNoSmoking /> Phòng không hút thuốc</span>
                    <span><MdCleaningServices /> Dịch vụ phòng</span>
                    <span><LuParkingCircle /> Chỗ để xe miễn phí</span>
                    <span><IoIosRestaurant /> Nhà hàng</span>
                    <br></br>
                    <span><IoWifi /> Wifi miễn phí</span>
                    <span><TbDisabled /> Tiện nghi cho người khuyết tật</span>
                    <span><MdFamilyRestroom /> Phòng gia đình</span>
                    <hr />
                </Col>
                <Col md={4}>
                    <Card>
                        <CardTitle>Rate: 8.5/10</CardTitle>
                        <p>Với hàng trăm đánh giá trên các trang thương mại điện tử.</p>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1866.0053335469233!2d106.794044031783!3d20.709791439580137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a6d0056028bc1%3A0x4adaf0a2080b8106!2zVHJ1bmcgdMOibSBi4buTaSBkxrDhu6FuZyBuZ2hp4buHcCB24bulIEjhuqNpIEjDoCDEkOG7kyBTxqFu!5e0!3m2!1svi!2s!4v1729609082543!5m2!1svi!2s"
                            width="400"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe></Card>
                </Col>
            </Row>
            {/* <Row className="mb-3">
                    
                    <Col>
                        <Form.Group controlId="checkin">
                            <Form.Label>Ngày check-in:</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkin"
                                value={bookingData.checkin}
                                onChange={handleChange}
                                isInvalid={!!errors.checkin}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.checkin}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="checkout">
                            <Form.Label>Ngày check-out:</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkout"
                                value={bookingData.checkout}
                                onChange={handleChange}
                                isInvalid={!!errors.checkout}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.checkout}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <h4>Chọn loại phòng</h4> */}
            {/* {roomCategories.map((room) => (
                    <Row key={room._id} className="mb-3">
                        <Col className='col-6'>
                            <Form.Label>{room.name} - {room.price} VND - {room.locationId.name}</Form.Label>
                        </Col>
                        <Col className='col-2'>
                            <Form.Control
                                type="number"
                                min="0"
                                value={quantity[room._id] || 0}
                                onChange={(e) => handleQuantityChange(e, room._id)}
                            />
                        </Col>
                    </Row>
                ))} */}
            {/* Display room selection error */}
            {/* {errors.roomSelection && (
                    <div className="text-danger mb-3">{errors.roomSelection}</div>
                )} */}
            {/* /===============booking phòng======================== */}
            <BookingPage locationId={locationId} />
            <Review />
        </div>
    );
};

export default CS2;
