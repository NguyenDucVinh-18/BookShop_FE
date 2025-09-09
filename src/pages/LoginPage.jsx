import React, { useContext, useState } from 'react';
import { Button, Input, Form, Divider, message } from 'antd';
import { FacebookOutlined, GoogleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../service/auth.service';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [notification, setNotification] = React.useState({ type: '', message: '', visible: false });
    const [loading, setLoading] = useState(false);
    const {user, setUser } = useContext(AuthContext);

    const showNotification = (type, msg) => {
        setNotification({ type, message: msg, visible: true });
        setTimeout(() => setNotification({ type: '', message: '', visible: false }), 3000);
    };


    const onLoginFinish = async (values) => {
        try {
            const res = await loginAPI(values.email, values.password);
            if (res && res.data) {
                if(res.data.user.isEnabled === false) {
                    setLoading(true);
                    showNotification('error', 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản.');
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/email-verification', { state: { email: values.email } });
                    }, 1500); 
                }
                else{
                    localStorage.setItem("access_token", res.data.tokens.accessToken);
                    localStorage.setItem("role", res.data.user.role);
                    setUser(res.data.user);
                    setLoading(true);
                    showNotification('success', res.message || 'Đăng nhập thành công');
                    setTimeout(() => {
                        setLoading(false);
                        if(res.data.user.role === 'STAFF'){
                            navigate('/sale');
                            return;
                        }
                        else if(res.data.user.role === 'MANAGER'){
                            navigate('/manager');
                            return;
                        } else if(res.data.user.role === 'CUSTOMER'){
                            navigate('/');
                            return;
                        }
                    }, 1500);
                }
                
            } else {
                showNotification('error', res.message || 'Đăng nhập thất bại');
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
                            // rules={[
                            //     { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            //     { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            // ]}
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
                                loading={loading}
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
