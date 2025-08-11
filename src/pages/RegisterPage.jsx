import React from 'react';
import { Button, Input, Form } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
    const [registerForm] = Form.useForm();

    const onRegisterFinish = (values) => {
        console.log('Register values:', values);
        // Handle registration logic here
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2 className="register-title">ĐĂNG KÝ THÀNH VIÊN MỚI</h2>

                <Form
                    form={registerForm}
                    onFinish={onRegisterFinish}
                    layout="vertical"
                    className="register-form"
                >
                    <Form.Item
                        name="lastName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="input-icon" />}
                            placeholder="Họ"
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="firstName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="input-icon" />}
                            placeholder="Tên"
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="input-icon" />}
                            placeholder="Email"
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="input-icon" />}
                            placeholder="Số điện thoại"
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Mật khẩu"
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<KeyOutlined className="input-icon" />}
                            placeholder="Nhập lại mật khẩu"
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="submit-btn"
                            size="large"
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <div className="login-link">
                        Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
