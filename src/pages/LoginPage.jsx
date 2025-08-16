import React from 'react';
import { Button, Input, Form, Divider } from 'antd';
import { FacebookOutlined, GoogleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [loginForm] = Form.useForm();

    const onLoginFinish = (values) => {
        console.log('Login values:', values);
        // Handle login logic here
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Social Login Section */}
                <div className="social-login-section">
                    <h2 className="social-login-title">ĐĂNG NHẬP BẰNG 2 cách</h2>
                    <div className="social-buttons">
                        <Button
                            type="primary"
                            className="facebook-btn"
                            icon={<FacebookOutlined />}
                            size="large"
                        >
                            Facebook
                        </Button>
                        <Button
                            type="primary"
                            className="google-btn"
                            icon={<GoogleOutlined />}
                            size="large"
                        >
                            Google
                        </Button>
                    </div>
                </div>

                {/* Divider */}
                <Divider className="divider">
                    <span className="divider-text">HOẶC</span>
                </Divider>

                {/* Login Form */}
                <div className="login-form-section">
                    <h3 className="form-title">ĐĂNG NHẬP</h3>
                    <Form
                        form={loginForm}
                        onFinish={onLoginFinish}
                        layout="vertical"
                        className="login-form"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="input-icon" />}
                                placeholder="Email của bạn"
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
                                placeholder="Nhập mật khẩu"
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
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div className="forgot-password">
                            <a href="/forgot-password">Quên mật khẩu?</a>
                        </div>

                        <div className="register-link">
                            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                        </div>
                    </Form>
                </div>

                {/* Zalo Logo */}
                <div className="zalo-logo">
                    <div className="zalo-icon">💬</div>
                    <span>Zalo</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
