import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        try {
            const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
            const idx = users.findIndex(u => (u.email || '').toLowerCase() === values.email.toLowerCase());
            if (idx === -1) {
                form.setFields([{ name: 'email', errors: ['Email không tồn tại trong hệ thống'] }]);
                return;
            }
            users[idx] = { ...users[idx], password: values.newPassword };
            localStorage.setItem('mockUsers', JSON.stringify(users));

            // Set a flag so LoginPage shows a top-right notification
            sessionStorage.setItem('justResetPassword', 'true');
            message.success('Đặt lại mật khẩu thành công! Hãy đăng nhập lại.');
            navigate('/login');
        } catch (e) {
            console.error('Reset password error:', e);
            message.error('Có lỗi khi đặt lại mật khẩu');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2 className="register-title">QUÊN MẬT KHẨU</h2>
                <Form form={form} layout="vertical" onFinish={onFinish} className="register-form">
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email đã đăng ký" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                }
                            })
                        ]}
                    >
                        <Input.Password prefix={<KeyOutlined />} placeholder="Xác nhận mật khẩu" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="submit-btn" size="large">Đặt lại mật khẩu</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
