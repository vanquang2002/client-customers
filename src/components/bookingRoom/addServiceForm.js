import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const AddServiceForm = forwardRef(({ bookingId, onServiceTotalChange }, ref) => {
    const [otherServices, setOtherServices] = useState([]);
    const [orderServicesData, setOrderServicesData] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [serviceQuantity, setServiceQuantity] = useState(1);
    const [selectedServiceDescription, setSelectedServiceDescription] = useState("");
    const [selectedServicePrice, setSelectedServicePrice] = useState();
    const [serviceNote, setServiceNote] = useState(""); // Ghi chú cho dịch vụ đang chọn
    const [serviceDate, setServiceDate] = useState("");
    const [serviceTimeSlot, setServiceTimeSlot] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [formError, setFormError] = useState("");
    const [expandedNotes, setExpandedNotes] = useState([]);

    useEffect(() => {
        const fetchOtherServices = async () => {
            try {
                const response = await axios.get('http://localhost:9999/otherServices');
                // Lọc và chỉ lấy các dịch vụ chưa bị xóa (isDeleted === false)
                const filteredServices = response.data
                    .filter(service => !service.isDeleted && service.price !== 1000) // Lọc các dịch vụ chưa bị xóa
                    .map(service => ({
                        otherServiceId: service._id,
                        name: service.name,
                        price: service.price,
                        description: service.description,
                    }));
                setOtherServices(filteredServices);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách dịch vụ:', error);
            }
        };
        fetchOtherServices();
    }, []);


    const calculateTotalAmount = () => {
        const total = orderServicesData.reduce((sum, service) => {
            const serviceDetails = otherServices.find(s => s.otherServiceId === service.otherServiceId);
            return serviceDetails ? sum + serviceDetails.price * service.serviceQuantity : sum;
        }, 0);
        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount();
    }, [orderServicesData]);

    useEffect(() => {
        if (onServiceTotalChange) {
            onServiceTotalChange(totalAmount);
        }
    }, [totalAmount, onServiceTotalChange]);

    const handleServiceChange = (serviceId) => {
        setSelectedService(serviceId);
        const serviceDetails = otherServices.find(service => service.otherServiceId === serviceId);
        setSelectedServiceDescription(serviceDetails?.description || "");
        setSelectedServicePrice(serviceDetails?.price || "")
    };
    const toggleNoteExpansion = (index) => {
        setExpandedNotes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // Remove index if already expanded
                : [...prev, index] // Add index if not expanded
        );
    };


    const handleAddService = () => {
        if (!serviceDate || !serviceTimeSlot) {
            setFormError("Vui lòng chọn cả ngày và thời gian cho dịch vụ.");
            return;
        }

        setFormError(""); // Clear error if the input is valid

        // Parse the selected time slot into hours and minutes
        const [hours, minutes] = serviceTimeSlot.split(':').map(Number);

        // Combine the selected date with the chosen time
        const combinedDateTime = new Date(serviceDate);
        combinedDateTime.setHours(hours, minutes, 0, 0);

        // Adjust the time to UTC+7 (Vietnam time)
        const vietnamTime = new Date(combinedDateTime.getTime() - combinedDateTime.getTimezoneOffset() * 60000);

        // Format the date and time to ISO string
        const formattedTime = vietnamTime.toISOString();

        // Find an existing service with the same ID and time
        const existingService = orderServicesData.find(
            service =>
                service.otherServiceId === selectedService &&
                new Date(service.time).getTime() === new Date(formattedTime).getTime()
        );

        if (existingService) {
            // If the service exists and the time is the same, update the quantity and note
            setOrderServicesData(prevData =>
                prevData.map(service =>
                    service.otherServiceId === selectedService &&
                        new Date(service.time).getTime() === new Date(formattedTime).getTime()
                        ? {
                            ...service,
                            serviceQuantity: service.serviceQuantity + parseInt(serviceQuantity, 10),
                            note: service.note
                                ? `${service.note} ${serviceNote}` // Concatenate the new note if it exists
                                : serviceNote, // Add the new note if it's not present
                        }
                        : service
                )
            );
        } else {
            // If the service does not exist, create a new service entry
            setOrderServicesData(prevData => [
                ...prevData,
                {
                    otherServiceId: selectedService,
                    serviceQuantity: parseInt(serviceQuantity, 10),
                    note: serviceNote, // Add the note
                    time: formattedTime, // Use the formatted time
                },
            ]);
        }

        // Reset the form fields
        setSelectedService("");
        setServiceQuantity(1);
        setSelectedServiceDescription("");
        setServiceNote(""); // Reset the note
    };




    const handleRemoveService = (index) => {
        setOrderServicesData(prevData => prevData.filter((_, i) => i !== index));
        calculateTotalAmount();
    };

    const addService = async (bookingId) => {
        try {
            const promises = orderServicesData.map(service => {
                // // Adjust time to UTC+7
                // const localTime = new Date(service.time); // Local time of the service
                // const vietnamTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000); // Adjust by local offset
                // const formattedTime = vietnamTime.toISOString(); // Convert to ISO 8601

                return axios.post('http://localhost:9999/orderServices', {
                    otherServiceId: service.otherServiceId,
                    bookingId,
                    note: service.note, // Ghi chú
                    quantity: service.serviceQuantity,
                    time: service.time, // Post time in Vietnam timezone (UTC+7)
                });
            });

            await Promise.all(promises);
            // Sau khi thêm dịch vụ thành công, clear orderServicesData
            setOrderServicesData([]);
            console.log("Thêm dịch vụ và ghi chú thành công!");
            // Tính lại tổng giá dịch vụ sau khi clear
            calculateTotalAmount();
            return true
        } catch (error) {
            console.error('Lỗi khi thêm dịch vụ:', error);
            return false
        }
    };

    useImperativeHandle(ref, () => ({
        addService,
    }));

    const handleChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt giờ phút giây về 0 để so sánh chính xác

        if (selectedDate < today) {
            setFormError("Không được chọn ngày trong quá khứ.");
        } else {
            setFormError('');
        }
        setServiceDate(e.target.value);
    };
    return (
        <Card className="mb-4">
            <Card.Header className='text-white' style={{ backgroundColor: '#81a969' }}>
                <h5 >Dịch Vụ & Số lần Sử Dụng</h5>
            </Card.Header>
            <Card.Body>
                <Row className="mt-3 align-items-end">
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Chọn dịch vụ</Form.Label>
                            <Form.Select
                                className="text-center"
                                style={{ height: '50px' }}
                                value={selectedService}
                                onChange={(e) => handleServiceChange(e.target.value)}
                            >
                                <option value="">Chọn dịch vụ</option>
                                {otherServices.map(service => (
                                    <option key={service.otherServiceId} value={service.otherServiceId}>
                                        {service.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="text-center">
                            <Form.Label>Mô tả</Form.Label>
                            <div className="text-muted border" style={{ height: '50px', overflowY: 'auto' }}>
                                <small>{selectedServiceDescription || "Mô tả dịch vụ"}</small>
                            </div>
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                className="text-center"
                                style={{ height: '50px' }}
                                type="number"
                                min="1"
                                max="200"  // Giới hạn số lượng không quá 200
                                value={serviceQuantity}
                                onChange={(e) => setServiceQuantity(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    {/* Hiển thị lỗi khi số lượng không hợp lệ */}
                    {(serviceQuantity <= 0 || serviceQuantity > 200 || isNaN(serviceQuantity)) && (
                        <div style={{ color: 'red', fontSize: '14px', textAlign: 'right' }}>
                            Số lượng phải từ 1 đến 200
                        </div>
                    )}
                </Row>

                <Row className="mt-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Ghi chú dịch vụ</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Ghi chú cho dịch vụ đang chọn (300 ký tự)"
                                value={serviceNote}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 300) {
                                        setServiceNote(value); // Chỉ cập nhật khi <= 300 ký tự
                                    }
                                }}
                            />
                            <Form.Text className="text-muted">
                                {serviceNote.length}/300 ký tự
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Ngày sử dụng</Form.Label>
                            <Form.Control
                                type="date"
                                value={serviceDate}
                                onChange={handleChange} // Gọi handleChange khi thay đổi giá trị
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Thời gian</Form.Label>
                            <Form.Select
                                value={serviceTimeSlot}
                                onChange={(e) => setServiceTimeSlot(e.target.value)}
                            >
                                <option value="">Chọn thời gian</option>
                                <option value="7:00">Sáng (7:00)</option>
                                <option value="11:00">Trưa (11:00)</option>
                                <option value="14:00">Chiều (14:00)</option>
                                <option value="18:00">Tối (18:00)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>


                {/* Display error message */}
                {formError && (
                    <Row className="mt-2">
                        <Col>
                            <div style={{ color: 'red', fontSize: '14px' }}>{formError}</div>
                        </Col>
                    </Row>
                )}
                <Button
                    className="mt-3"
                    onClick={handleAddService}
                    disabled={!selectedService || serviceQuantity <= 0 || serviceQuantity > 200 || !!formError}
                    style={{ backgroundColor: '#81a969', border: 'none', height: '40px', width: '130px' }}
                >
                    Thêm dịch vụ
                </Button>
                {orderServicesData.length > 0 && (
                    <div className="mt-4">
                        <table className="table table-striped text-center">
                            <thead>
                                <tr>
                                    <th>DV đã chọn</th>
                                    <th>Số lượng</th>
                                    <th>Thời gian</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderServicesData.map((service, index) => {
                                    const serviceDetails = otherServices.find(s => s.otherServiceId === service.otherServiceId);
                                    return (
                                        <React.Fragment key={`${service.otherServiceId}-${service.time}-${index}`}>
                                            {/* Main Row */}
                                            <tr>
                                                <td>{serviceDetails?.name}</td>
                                                <td>{service.serviceQuantity}</td>
                                                <td>
                                                    {(() => {
                                                        const date = service.time;
                                                        const formattedDate = date.replace('T', ',').split('.')[0]; // Remove milliseconds and replace T
                                                        const [datePart, timePart] = formattedDate.split(',');
                                                        const [year, month, day] = datePart.split('-');
                                                        return `${day}-${month}-${year}, ${timePart.slice(0, 5)}`; // Format as DD-MM-YYYY, HH:mm
                                                    })()}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleRemoveService(index)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </td>
                                            </tr>

                                            {/* Note Row */}
                                            <tr>
                                                <td colSpan="4">
                                                    <div
                                                        style={{
                                                            padding: '5px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            textAlign: 'left',
                                                            position: 'relative',
                                                        }}
                                                    >
                                                        {/* Display truncated or full note */}
                                                        <div
                                                            style={{
                                                                maxHeight: expandedNotes.includes(index) ? 'none' : '35px', // Toggle height
                                                                overflowY: expandedNotes.includes(index) ? 'visible' : 'hidden', // Hide overflow unless expanded
                                                                textOverflow: 'ellipsis', // Add ellipsis when collapsed
                                                                display: expandedNotes.includes(index) ? 'block' : 'inline', // Adjust layout
                                                            }}
                                                        >
                                                            {expandedNotes.includes(index)
                                                                ? service.note || "Không có ghi chú"
                                                                : (service.note || "Không có ghi chú").slice(0, 100) + (service.note && service.note.length > 100 ? "..." : "")}
                                                        </div>

                                                        {/* Button position based on state */}
                                                        {service.note && service.note.length > 100 && (
                                                            <div
                                                                style={{
                                                                    marginTop: expandedNotes.includes(index) ? '5px' : '0', // Add space for "See Less"
                                                                    textAlign: expandedNotes.includes(index) ? 'right' : 'left', // Align for consistency
                                                                    display: expandedNotes.includes(index) ? 'block' : 'inline', // Change line position
                                                                }}
                                                            >
                                                                <button
                                                                    onClick={() => toggleNoteExpansion(index)}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none',
                                                                        color: '#007bff',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    {expandedNotes.includes(index) ? 'Thu gọn' : 'Xem thêm'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>



                        </table>
                    </div>
                )}
                <h6 className="mt-4">{selectedServicePrice !== 1000 ? "Tổng giá dịch vụ:" : "Tổng phụ phí:"} {totalAmount.toLocaleString()} VND</h6>
            </Card.Body>
        </Card >
    );
});

export default AddServiceForm;
