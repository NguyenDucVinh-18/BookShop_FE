import React from 'react';
import { Button, Input, Form, Divider, message } from 'antd';
import { FacebookOutlined, GoogleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [notification, setNotification] = React.useState({ type: '', message: '', visible: false });

    const showNotification = (type, msg) => {
        setNotification({ type, message: msg, visible: true });
        setTimeout(() => setNotification({ type: '', message: '', visible: false }), 3000);
    };

    const ensureMockUsers = () => {
        const raw = localStorage.getItem('mockUsers');
        if (!raw) {
            const defaults = [
                {
                    id: 1,
                    email: 'test@minhlongbook.vn',
                    password: '123456',
                    fullName: 'Người dùng Minh Long',
                    phone: '0900000000',
                    address: 'Hà Nội',
                    avatar: ''
                }
            ];
            localStorage.setItem('mockUsers', JSON.stringify(defaults));
        }
    };

    React.useEffect(() => {
        ensureMockUsers();
        // Prefill email từ lần đăng nhập trước
        try {
            const lastEmail = localStorage.getItem('lastLoginEmail');
            if (lastEmail) {
                loginForm.setFieldsValue({ email: lastEmail });
            }
        } catch { }

        // Nếu vừa đăng ký xong, hiển thị thông báo góc phải
        const justRegistered = sessionStorage.getItem('justRegistered');
        if (justRegistered === 'true') {
            showNotification('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
            sessionStorage.removeItem('justRegistered');
        }
        const justReset = sessionStorage.getItem('justResetPassword');
        if (justReset === 'true') {
            showNotification('success', 'Mật khẩu đã được đặt lại. Hãy đăng nhập.');
            sessionStorage.removeItem('justResetPassword');
        }
    }, []);

    const onLoginFinish = (values) => {
        try {
            ensureMockUsers();
            const list = JSON.parse(localStorage.getItem('mockUsers') || '[]');
            const found = list.find(u => u.email === values.email && u.password === values.password);
            if (found) {
                // Save auth user (do NOT store password in real apps)
                localStorage.setItem('authUser', JSON.stringify({
                    id: found.id,
                    email: found.email,
                    fullName: found.fullName,
                    phone: found.phone,
                    address: found.address,
                    avatar: found.avatar
                }));

                // Lưu email cuối cùng để prefill lần sau
                localStorage.setItem('lastLoginEmail', values.email);

                // Clear password field when login successful
                loginForm.setFieldsValue({ password: '' });

                // Đánh dấu user vừa đăng nhập thành công
                sessionStorage.setItem('justLoggedIn', 'true');

                // Hiển thị thông báo đăng nhập thành công với thông tin user
                message.success({
                    content: `🎉 Chào mừng ${found.fullName} đăng nhập thành công!`,
                    duration: 3,
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }
                });
                navigate('/');
            } else {
                // Clear password field when login fails
                loginForm.setFieldsValue({ password: '' });

                // Set field errors to display under each field
                if (values.email !== 'test@minhlongbook.vn') {
                    loginForm.setFields([
                        {
                            name: 'email',
                            errors: ['Email không đúng!']
                        }
                    ]);
                } else if (values.password !== '123456') {
                    loginForm.setFields([
                        {
                            name: 'password',
                            errors: ['Mật khẩu không đúng!']
                        }
                    ]);
                } else {
                    // Both email and password are wrong
                    loginForm.setFields([
                        {
                            name: 'email',
                            errors: ['Email hoặc mật khẩu không đúng']
                        },
                        {
                            name: 'password',
                            errors: ['Email hoặc mật khẩu không đúng']
                        }
                    ]);
                }
            }
        } catch (e) {
            console.error('Login error:', e);
            message.error('Có lỗi khi xử lý đăng nhập');
        }
    };

    return (
        <div className="login-page">
            {/* Notification System */}
            {notification.visible && (
                <div
                    className={`notification ${notification.type}`}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        padding: '16px 24px',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 9999,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        backgroundColor: notification.type === 'success' ? '#52c41a' :
                            notification.type === 'error' ? '#ff4d4f' : '#1890ff'
                    }}
                >
                    {notification.message}
                </div>
            )}
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
