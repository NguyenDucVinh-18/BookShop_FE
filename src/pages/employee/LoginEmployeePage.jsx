import React, { useContext, useState } from "react";
import { Button, Input, Form, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import "../../styles/LoginEmployeePage.css";
import { useNavigate } from "react-router-dom";
// import { loginEmployeeAPI } from "../service/auth.service";
import { AuthContext } from "../../components/context/auth.context";
import { loginEmployeeAPI } from "../../service/auth.service";

const LoginEmployeePage = () => {
  const [loginForm] = Form.useForm();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);

  const showNotification = (type, msg) => {
    setNotification({ type, message: msg, visible: true });
    setTimeout(
      () => setNotification({ type: "", message: "", visible: false }),
      3000
    );
  };

  const onLoginFinish = async (values) => {
    try {
      setLoading(true);
      const res = await loginEmployeeAPI(values.username, values.password);

      if (res && res.data) {
        if(res.data.employee.isActive === false) {
            setLoading(false);
            showNotification("error", "Tài khoản nhân viên của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
            return;
        } else {
            localStorage.setItem("access_token", res.data.tokens.accessToken);
            localStorage.setItem("role", res.data.employee.role);
            setUser(res.data.employee);
            
            showNotification("success", res.message || "Đăng nhập thành công");
            
            setTimeout(() => {
              setLoading(false);
              // Điều hướng dựa trên role của nhân viên
              if (res.data.employee.role === "STAFF") {
                navigate("/sale");
                return ;
              } else if (res.data.employee.role === "MANAGER") {
                navigate("/manager");
              }
            }, 1500);
        } 
      } else {
        setLoading(false);
        showNotification("error", res.message || "Đăng nhập thất bại");
      }
    } catch (e) {
      setLoading(false);
      console.error("Login error:", e);
      showNotification("error", "Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="login-employee-page">
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

      <div className="login-employee-container">
        {/* Header Section */}
        <div className="employee-header">
          <div className="employee-icon">
            <UserOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
          </div>
          <h2 className="employee-title">ĐĂNG NHẬP NHÂN VIÊN</h2>
          <p className="employee-subtitle">
            Vui lòng đăng nhập để truy cập hệ thống quản lý
          </p>
        </div>

        {/* Login Form */}
        <div className="employee-form-section">
          <Form
            form={loginForm}
            onFinish={onLoginFinish}
            layout="vertical"
            className="employee-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Tên đăng nhập"
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="employee-submit-btn"
                size="large"
                loading={loading}
                icon={<LoginOutlined />}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="employee-footer">
              <span className="divider-dot">•</span>
              <a href="/" className="back-link">
                Quay lại trang chủ
              </a>
            </div>
          </Form>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <span>🔒</span>
          <p>Đăng nhập được mã hóa và bảo mật</p>
        </div>
      </div>
    </div>
  );
};

export default LoginEmployeePage;