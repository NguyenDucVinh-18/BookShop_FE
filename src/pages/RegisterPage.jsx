import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  KeyOutlined,
  PhoneFilled,
} from "@ant-design/icons";
import "../styles/RegisterPage.css";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../service/auth.service";

const RegisterPage = () => {
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = React.useState({
    type: "",
    message: "",
    visible: false,
  });

  const showNotification = (type, msg) => {
    setNotification({ type, message: msg, visible: true });
    setTimeout(
      () => setNotification({ type: "", message: "", visible: false }),
      3000
    );
  };

  const onRegisterFinish = async (values) => {
    try {
      setLoading(true);
      const res = await registerAPI(
        values.username,
        values.email,
        values.phone,
        values.password
      );
      if (res && res.data) {
        console.log("Register response:", res);
        showNotification('success', res.message || 'Đăng nhập thành công');
        setTimeout(() => {
            setLoading(false);
            navigate("/email-verification", { 
              state: { 
                email: values.email,
                username: values.username
              } 
            });
          }, 1500);
      } else {
        showNotification('error', res.message || 'Đăng ký thất bại');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Register error:", e);
      message.error("Có lỗi khi đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <div className="register-page">
      {/* Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                ? "#ff4d4f"
                : "#1890ff",
          }}
        >
          {notification.message}
        </div>
      )}
      <div className="register-container">
        <h2 className="register-title">ĐĂNG KÝ THÀNH VIÊN MỚI</h2>

        <Form
          form={registerForm}
          onFinish={onRegisterFinish}
          layout="vertical"
          className="register-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Họ và tên"
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
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
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<PhoneFilled className="input-icon" />}
              placeholder="Số điện thoại"
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
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
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
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
              loading={loading}
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
