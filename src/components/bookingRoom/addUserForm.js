import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Form, Row, Col, Card, Button, Alert } from 'react-bootstrap';

const AddUserForm = forwardRef(({ }, ref) => {
    const [customerData, setCustomerData] = useState({
        fullname: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [bookingType, setBookingType] = useState(''); // Track "khách lẻ" or "khách đoàn"
    const [agencyData, setAgencyData] = useState({
        customerId: '',
        name: '',
        phone: '',
        address: '',
        stk: '',
        code: ''
    });

    const handleCustomerChange = (e) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const handleAgencyChange = (e) => {
        setAgencyData({
            ...agencyData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        // const namePattern = /^[A-Za-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+(\s[A-Za-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)*$/;
        const namePattern = /^([A-ZÀ-Ý][a-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]*|[a-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)(\s([A-ZÀ-Ý][a-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]*|[a-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+))*$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^(03|05|07|08|09)\d{8,9}$/;
        // const locationPattern = /^[A-Za-zÀ-ÿ0-9]+([ ,.-][A-Za-zÀ-ÿ0-9]+)*$/;
        const locationPattern = /^[A-Za-zÀ-ÿà-ỹ0-9]+([ ,.-][A-Za-zÀ-ÿà-ỹ0-9]+)*$/;
        const today = new Date();

        // Customer validation
        if (!customerData.fullname.trim()) {
            newErrors.fullname = "Họ và tên là bắt buộc.";
        } else if (!namePattern.test(customerData.fullname)) {
            newErrors.fullname = "Họ và tên chỉ được chứa chữ cái và chỉ có một dấu cách giữa các từ, không được viết hoa giữa hoặc cuối từ";
        } else if (customerData.fullname.length > 100) {
            newErrors.fullname = "Họ và tên không được vượt quá 100 ký tự.";
        }

        if (!emailPattern.test(customerData.email)) {
            newErrors.email = "Vui lòng nhập email hợp lệ";
        } else if (customerData.email.length > 100) {
            newErrors.email = "Email không được vượt quá 100 ký tự.";
        }

        if (!phonePattern.test(customerData.phone)) {
            newErrors.phone = "Vui lòng nhập số điện thoại hợp lệ";
        }

        if (!customerData.dob) {
            newErrors.dob = "Ngày tháng năm sinh là bắt buộc";
        } else {
            const dob = new Date(customerData.dob);
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18 || (age === 18 && today < new Date(dob.setFullYear(today.getFullYear() - 18)))) {
                newErrors.dob = "Khách hàng phải từ 18 tuổi trở lên";
            }
            if (age > 100 || (age === 100 && today < new Date(dob.setFullYear(today.getFullYear() - 100)))) {
                newErrors.dob = "Khách hàng phải dưới 100 tuổi";
            }
        }

        if (!customerData.gender) {
            newErrors.gender = "Vui lòng chọn giới tính";
        }


        if (!customerData.address.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ";
        } else if (!locationPattern.test(customerData.address)) {
            newErrors.address = "Địa chỉ chứa chữ cái, số, và các ký tự như ',', '.', '-' với 1 dấu cách giữa các từ.(VD: 123 Main St, City-Name.)";
        } else if (customerData.address.length > 200) {
            newErrors.address = "Địa chỉ không được vượt quá 200 ký tự.";
        }

        // Group booking validation (only if bookingType is 'Group')
        if (bookingType === 'Group') {
            // Agency validation
            if (!agencyData.name.trim()) {
                newErrors.agencyName = "Tên đơn vị là bắt buộc";
            } else if (!namePattern.test(agencyData.agencyName)) {
                newErrors.agencyName = "Tên đơn vị chứa chữ cái và chỉ có một dấu cách giữa các từ, không được viết hoa giữa hoặc cuối từ";
            } else if (agencyData.name.length > 100) {
                newErrors.agencyName = "Tên đơn vị không được vượt quá 100 ký tự.";
            }

            if (!phonePattern.test(agencyData.phone)) {
                newErrors.agencyPhone = "Số điện thoại đơn vị không hợp lệ";
            }

            if (!agencyData.address.trim()) {
                newErrors.agencyAddress = "Địa chỉ đơn vị là bắt buộc";
            } else if (!locationPattern.test(agencyData.address)) {
                newErrors.agencyAddress = "Địa chỉ đơn vị chứa chữ cái, số, và các ký tự như ',', '.', '-' với 1 dấu cách giữa các từ.(VD: 123 Main St, City-Name.)";
            } else if (agencyData.address.length > 200) {
                newErrors.agencyAddress = "Địa chỉ đơn vị không được vượt quá 200 ký tự.";
            }

            if (!agencyData.stk.trim()) {
                newErrors.agencyStk = "Số tài khoản ngân hàng là bắt buộc";
            } else {
                const stkPattern = /^[^\s]+( [^\s]+)*: \d+$/; // Kiểm tra định dạng
                if (!stkPattern.test(agencyData.stk)) {
                    newErrors.agencyStk = "Định dạng số tài khoản không hợp lệ. Ví dụ hợp lệ: 'Tên Ngân Hàng: 123456789'";
                }
            }

            const agencyCodePattern = /^[A-Za-z0-9]+$/;

            // Kiểm tra mã đơn vị
            if (!agencyData.code.trim()) {
                newErrors.agencyCode = "Mã đơn vị là bắt buộc.";
            } else if (!agencyCodePattern.test(agencyData.code)) {
                newErrors.agencyCode = "Mã đơn vị chỉ được chứa chữ cái và số, không có ký tự đặc biệt.";
            } else if (agencyData.code.length > 50) {
                newErrors.agencyCode = "Mã đơn vị không được vượt quá 50 ký tự.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const createUser = async () => {
        if (!validateForm()) {
            console.log("Form has errors, please fix them before submitting.");
            return null;
        }
        setLoading(true);

        try {
            // Create Customer
            const userResponse = await fetch('http://localhost:9999/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });

            if (!userResponse.ok) {
                throw new Error('An error occurred while creating the customer.');
            }

            const userResponseData = await userResponse.json();
            const customerID = userResponseData._id;

            if (bookingType === 'Group') {
                // Include customerID in the agencyData
                const agencyPayload = { ...agencyData, customerId: customerID };

                // Create Agency
                const agencyResponse = await fetch('http://localhost:9999/agencies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(agencyPayload),
                });

                if (!agencyResponse.ok) {
                    throw new Error('An error occurred while creating the agency.');
                }

                const agencyResponseData = await agencyResponse.json();
                const agencyID = agencyResponseData._id;

                return { customerID, agencyID };
            }

            return { customerID, agencyID: null };
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Expose methods and data to parent component
    useImperativeHandle(ref, () => ({
        createUser
    }));

    return (
        <Card className="shadow-sm">
            <Card.Header as="h5" className=" text-white" style={{ backgroundColor: '#81a969' }}>Thông tin khách hàng</Card.Header>
            <Card.Body>
                <Form>
                    {/* Existing customer details form */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="fullname">
                                <Form.Label><strong>Họ và tên</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fullname"
                                    value={customerData.fullname}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.fullname}
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fullname}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="email">
                                <Form.Label><strong>Email</strong></Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={customerData.email}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.email}
                                    placeholder="Nhập email"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="phone">
                                <Form.Label><strong>Số điện thoại</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={customerData.phone}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.phone}
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="dob">
                                <Form.Label><strong>Ngày tháng năm sinh</strong></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={customerData.dob}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.dob}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.dob}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="gender">
                                <Form.Label><strong>Giới tính</strong></Form.Label>
                                <Form.Control
                                    as="select"
                                    name="gender"
                                    value={customerData.gender}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.gender}
                                    required
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.gender}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="address">
                                <Form.Label><strong>Địa chỉ</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={customerData.address}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.address}
                                    placeholder="Nhập địa chỉ"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>


                    <Button
                        variant="outline-primary"
                        className="mt-3"
                        onClick={() => setBookingType(bookingType === 'Group' ? '' : 'Group')}
                    >
                        {bookingType === 'Group' ? 'Khách đoàn' : 'Khách lẻ'}
                    </Button>

                    {bookingType === 'Group' && (
                        <>
                            <Alert variant="info" className="mt-3">
                                Khách đoàn cần lập hợp đồng tạm thời và cọc trước 20% giá trị tiền phòng.
                            </Alert>
                            <Row className="mb-3 mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="agencyName">
                                        <Form.Label><strong>Tên đơn vị</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={agencyData.name}
                                            onChange={handleAgencyChange}
                                            placeholder="Nhập tên đơn vị"
                                            isInvalid={!!errors.agencyName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.agencyName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="agencyPhone">
                                        <Form.Label><strong>SĐT Đơn vị</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={agencyData.phone}
                                            onChange={handleAgencyChange}
                                            placeholder="Nhập số điện thoại"
                                            isInvalid={!!errors.agencyPhone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.agencyPhone}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="agencyAddress">
                                        <Form.Label><strong>Địa chỉ đơn vị</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={agencyData.address}
                                            onChange={handleAgencyChange}
                                            placeholder="Nhập địa chỉ"
                                            isInvalid={!!errors.agencyAddress}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.agencyAddress}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="agencyStk">
                                        <Form.Label><strong>Ngân hàng + Số tài khoản (STK)</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="stk"
                                            value={agencyData.stk}
                                            onChange={handleAgencyChange}
                                            placeholder="Nhập ngân hàng + STK"
                                            isInvalid={!!errors.agencyStk}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.agencyStk}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="agencyCode">
                                        <Form.Label><strong>Mã đơn vị</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="code"
                                            value={agencyData.code}
                                            onChange={handleAgencyChange}
                                            placeholder="Nhập mã đơn vị"
                                            isInvalid={!!errors.agencyCode}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.agencyCode}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
});

export default AddUserForm;