import React, { useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const AddIdentifyForm = forwardRef(({ }, ref) => {
    const [identifycationData, setIdentifycationData] = useState({
        name: '',
        code: '',
        dateStart: '',
        dateEnd: '',
        location: '',
        customerID: null
    });
    const [errors, setErrors] = useState({});

    const handleIdentifycationChange = (e) => {
        setIdentifycationData({
            ...identifycationData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();

        const normalizeDate = (date) => {
            const normalized = new Date(date);
            normalized.setHours(0, 0, 0, 0);
            return normalized;
        };

        // Kiểm tra mã định danh (ID code)
        if (!identifycationData.code) {
            newErrors.code = "Mã định danh là bắt buộc.";
        }

        // Kiểm tra ngày hết hạn (Expiry date)
        if (!identifycationData.dateEnd) {
            newErrors.dateEnd = "Ngày hết hạn là bắt buộc.";
        }

        // Kiểm tra loại giấy tờ và mã định danh
        if (!identifycationData.name) {
            newErrors.name = "Loại giấy tờ là bắt buộc.";
        } else {
            const identifycationStartDate = normalizeDate(new Date(identifycationData.dateStart));
            const identifycationEndDate = normalizeDate(new Date(identifycationData.dateEnd));

            switch (identifycationData.name) {
                case "Căn Cước Công Dân":
                    if (!identifycationData.code || !/^[0-9]{12}$/.test(identifycationData.code)) {
                        newErrors.code = "Mã Căn Cước Công Dân phải gồm 12 chữ số.";
                    }

                    // Kiểm tra ngày hết hạn cho Căn Cước Công Dân
                    if (!identifycationData.dateEnd) {
                        newErrors.dateEnd = "Ngày hết hạn là bắt buộc.";
                    } else {
                        const fiveYearsLater = new Date(identifycationStartDate);
                        fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);

                        if (identifycationEndDate <= identifycationStartDate) {
                            newErrors.dateEnd = "Ngày hết hạn phải sau ngày cấp.";
                        } else if (identifycationEndDate.getTime() !== fiveYearsLater.getTime()) {
                            newErrors.dateEnd = "Ngày hết hạn phải cách ngày cấp đúng 5 năm.";
                        } else {
                            const dateEnd = new Date(identifycationData.dateEnd);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Đặt thời gian của hôm nay là 0:00
                            if (dateEnd < today) {
                                newErrors.dateEnd = "Giấy tờ đã hết hạn.";
                            }
                        }
                    }
                    break;
                case "Giấy Phép Lái Xe":
                    if (!identifycationData.code || !/^[0-9]{12}$/.test(identifycationData.code)) {
                        newErrors.code = "Mã Giấy Phép Lái Xe phải gồm 12 chữ số.";
                    }

                    if (!identifycationData.dateEnd) {
                        newErrors.dateEnd = "Ngày hết hạn là bắt buộc.";
                    } else {
                        const fiveYearsLater = new Date(identifycationStartDate);
                        fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);
                        const hunderYearsLater = new Date(identifycationStartDate);
                        hunderYearsLater.setFullYear(hunderYearsLater.getFullYear() + 100);
                        const tenYearsLater = new Date(identifycationStartDate);
                        tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

                        if (identifycationEndDate <= identifycationStartDate) {
                            newErrors.dateEnd = "Ngày hết hạn phải sau ngày cấp.";
                        } else if (
                            identifycationEndDate.getTime() !== fiveYearsLater.getTime() &&
                            identifycationEndDate.getTime() !== hunderYearsLater.getTime() &&
                            identifycationEndDate.getTime() !== tenYearsLater.getTime()) {
                            newErrors.dateEnd = "Phải cách ngày cấp đúng 5 năm hoặc 10 năm.(Vô hạn =100 năm)";
                        }
                        else {
                            const dateEnd = new Date(identifycationData.dateEnd);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Đặt thời gian của hôm nay là 0:00
                            if (dateEnd < today) {
                                newErrors.dateEnd = "Giấy tờ đã hết hạn.";
                            }
                        }
                    }
                    break;

                case "Hộ Chiếu":
                    if (!identifycationData.code || !/^[A-Z][0-9]{7}$/.test(identifycationData.code)) {
                        newErrors.code = "Mã Hộ Chiếu phải gồm 8 ký tự, bắt đầu bằng chữ cái in hoa, tiếp theo là 7 số.";
                    }

                    if (!identifycationData.dateEnd) {
                        newErrors.dateEnd = "Ngày hết hạn là bắt buộc.";
                    } else {
                        const fiveYearsLater = new Date(identifycationStartDate);
                        fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);
                        const tenYearsLater = new Date(identifycationStartDate);
                        tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

                        if (identifycationEndDate <= identifycationStartDate) {
                            newErrors.dateEnd = "Ngày hết hạn phải sau ngày cấp.";
                        } else if (identifycationEndDate.getTime() !== fiveYearsLater.getTime() && identifycationEndDate.getTime() !== tenYearsLater.getTime()) {
                            newErrors.dateEnd = "Phải cách ngày cấp đúng 5 năm hoặc 10 năm.";
                        } else {
                            const dateEnd = new Date(identifycationData.dateEnd);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Đặt thời gian của hôm nay là 0:00
                            if (dateEnd < today) {
                                newErrors.dateEnd = "Giấy tờ đã hết hạn.";
                            }
                        }
                    }
                    break;

                default:
                    newErrors.name = "Loại giấy tờ không hợp lệ.";
            }
        }

        // Kiểm tra ngày cấp (Start date)
        if (!identifycationData.dateStart) {
            newErrors.dateStart = "Ngày cấp là bắt buộc.";
        } else {
            const identifycationStartDate = normalizeDate(new Date(identifycationData.dateStart));
            if (identifycationStartDate > today) {
                newErrors.dateStart = "Ngày cấp không thể sau ngày hôm nay.";
            }
        }

        // Kiểm tra nơi cấp (Issuing location)
        // const locationPattern = /^[A-Za-zÀ-ÿ0-9]+([ ,.-][A-Za-zÀ-ÿ0-9]+)*$/;
        const locationPattern = /^[A-Za-zÀ-ÿà-ỹ0-9]+([ ,.-][A-Za-zÀ-ÿà-ỹ0-9]+)*$/;


        if (!identifycationData.location.trim()) {
            newErrors.location = "Nơi cấp là bắt buộc.";
        } else if (!locationPattern.test(identifycationData.location)) {
            newErrors.location = "Nơi cấp chỉ được chứa chữ cái, số, và các ký tự như ',', '.', '-' với 1 dấu cách giữa các từ.(VD: 123 Main St, City-Name.)";
        } else if (identifycationData.location.length > 200) {
            newErrors.location = "Nơi cấp không được vượt quá 200 ký tự.";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };





    const createIdentify = async (customerID) => {
        if (!validateForm()) {
            console.log("Form has errors, please fix them before submitting.");
            return null; // Return null to indicate failure
        }
        try {
            // Send data to the server with the provided `customerID`
            const response = await fetch('http://localhost:9999/identifycations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...identifycationData, // Other form data
                    customerID: customerID, // Add customer ID
                }),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }


            // Parse the response
            const responseData = await response.json();
            console.log("Identifycation created successfully!");

            // // Reset form state
            // setIdentifycationData({
            //     name: '',
            //     code: '',
            //     dateStart: '',
            //     dateEnd: '',
            //     location: '',
            //     customerID: null
            // });

            setErrors({}); // Clear errors
            // Return the created identifycation ID
            return responseData._id;
        } catch (error) {
            console.error('Error creating identifycation:', error);
            return null; // Return null to indicate failure
        }
    };


    useImperativeHandle(ref, () => ({
        createIdentify
    }));

    return (
        <Card className="shadow-sm mb-3">
            <Card.Header className=" text-white" style={{ backgroundColor: '#81a969' }}><h5>Thêm Giấy Tờ Định Danh</h5></Card.Header>
            <Card.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Loại giấy tờ định danh</strong></Form.Label>
                                <Form.Select
                                    name='name'
                                    value={identifycationData.name}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.name}
                                >
                                    <option value="">Chọn loại giấy tờ</option>
                                    <option value="Căn Cước Công Dân">Căn Cước Công Dân</option>
                                    <option value="Hộ Chiếu">Hộ Chiếu</option>
                                    <option value="Giấy Phép Lái Xe">Giấy Phép Lái Xe</option>
                                </Form.Select>
                                <Form.Control.Feedback type='invalid'>
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Mã định danh</strong></Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Nhập mã định danh'
                                    name='code'
                                    value={identifycationData.code}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.code}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.code}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Ngày cấp</strong></Form.Label>
                                <Form.Control
                                    type='date'
                                    name='dateStart'
                                    value={identifycationData.dateStart}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.dateStart}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.dateStart}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Ngày hết hạn</strong></Form.Label>
                                <Form.Control
                                    type='date'
                                    name='dateEnd'
                                    value={identifycationData.dateEnd}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.dateEnd}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.dateEnd}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Nơi cấp</strong></Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Nhập nơi cấp'
                                    name='location'
                                    value={identifycationData.location}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.location}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.location}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                </Form>
            </Card.Body>
        </Card>
    );
});

export default AddIdentifyForm;
