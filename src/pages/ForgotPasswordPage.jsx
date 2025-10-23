import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  KeyOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  findByEmailAPI,
  removeResetPasswordOtpAPI,
  resetPasswordAPI,
  sendResetPasswordOtpAPI,
} from "../service/auth.service";

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: verify code, 3: new password
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        if (next === 0 && user?.email) {
          removeResetPasswordOtp(user.email);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, user]);


  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const onSubmitEmail = async (values) => {
    try {
      setLoading(true);
      setEmail(values.email);
      const resUser = await findByEmailAPI(values.email);
      if (!resUser || !resUser.data) {
        showNotification("error", "Không tìm thấy người dùng với email này");
        return;
      }

      const resOtp = await sendResetPasswordOtpAPI(values.email);
      if (resOtp && resOtp.data) {
        showNotification("success", resOtp.message || "Đã gửi mã xác nhận");

        const updatedUser = await findByEmailAPI(values.email);
        if (updatedUser && updatedUser.data) {
          const userData = updatedUser.data.user || updatedUser.data;
          setUser(userData);
          setVerificationCode(userData.verificationCode);
        }

        setCountdown(60);
        setStep(2);
        form.resetFields();
      } else {
        showNotification("error", resOtp.message || "Gửi mã xác nhận thất bại");
      }
    } catch (e) {
      console.error("Error:", e);
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCode = (values) => {
    if (String(values.code).trim() !== String(verificationCode).trim()) {
      showNotification("error", "Mã xác nhận không đúng");
      return;
    }
    showNotification("success", "Xác nhận mã thành công");
    setStep(60);
    setStep(3);
    form.resetFields();
  };

  const removeResetPasswordOtp = async (email) => {
    try {
      const res = await removeResetPasswordOtpAPI(email);
      if (res && res.data) {
        setVerificationCode("");
        console.log("Đã xóa OTP khi hết hạn:", email);
      } else {
        console.warn("Không thể xóa OTP:", res?.data?.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API xóa OTP:", error);
    }
  };


  const onSubmitNewPassword = async (values) => {
    try {
      const res = await resetPasswordAPI(
        email,
        values.newPassword,
        verificationCode
      );
      if (res && res.data) {
        showNotification(
          "success",
          res.message || "Đặt lại mật khẩu thành công"
        );
        // Đợi 2 giây để người dùng thấy thông báo trước khi chuyển trang
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showNotification("error", res.message || "Đặt lại mật khẩu thất bại");
        return;
      }
    } catch (e) {
      console.error("Reset password error:", e);
      message.error("Có lỗi khi đặt lại mật khẩu");
    }
  };

  const handleResendCode = async () => {
    try {
      if (countdown > 0) return;

      if (!user || !user.email) {
        showNotification(
          "error",
          "Không tìm thấy email người dùng để gửi lại mã"
        );
        return;
      }

      setLoading(true);
      const res = await sendResetPasswordOtpAPI(user.email);
      if (res && res.data) {
        showNotification("success", res.message || "Đã gửi lại mã xác nhận");
        const updatedUser = await findByEmailAPI(user.email);
        if (updatedUser && updatedUser.data) {
          const userData = updatedUser.data.user || updatedUser.data;
          setUser(userData);
          setVerificationCode(userData.verificationCode);
        }
        setCountdown(60);
      } else {
        showNotification(
          "error",
          res.message || "Gửi lại mã xác nhận thất bại"
        );
      }
    } catch (error) {
      console.error("Lỗi gửi lại mã xác nhận:", error);
      showNotification("error", "Không thể gửi lại mã xác nhận");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Enhanced Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "12px",
            color: "white",
            fontWeight: "500",
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            backdropFilter: "blur(8px)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                  ? "#ff4d4f"
                  : "#1890ff",
            transform: notification.visible
              ? "translateX(0)"
              : "translateX(100%)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {notification.message}
        </div>
      )}
      <div className="register-container">
        <h2 className="register-title">QUÊN MẬT KHẨU</h2>

        {/* Bước 1: Nhập email */}
        {step === 1 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmitEmail}
            className="register-form"
          >
            <p style={{ textAlign: "center", marginBottom: 20, color: "#666" }}>
              Nhập email để nhận mã xác nhận
            </p>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email đã đăng ký"
                size="large"
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
                Gửi mã xác nhận
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Bước 2: Nhập mã xác nhận */}
        {step === 2 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmitCode}
            className="register-form"
          >
            <p style={{ textAlign: "center", marginBottom: 20, color: "#666" }}>
              Mã xác nhận đã được gửi đến
              <br />
              <strong>{email}</strong>
            </p>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác nhận!" },
                { len: 6, message: "Mã xác nhận có 6 chữ số" },
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="Nhập mã 6 chữ số"
                size="large"
                maxLength={6}
              />
            </Form.Item>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              {countdown > 0 ? (
                <span style={{ color: "#999" }}>
                  Gửi lại mã sau {countdown}s
                </span>
              ) : (
                <Button type="link" onClick={handleResendCode}>
                  Gửi lại mã xác nhận
                </Button>
              )}
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-btn"
                size="large"
                loading={loading}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Bước 3: Nhập mật khẩu mới */}
        {step === 3 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmitNewPassword}
            className="register-form"
          >
            <p style={{ textAlign: "center", marginBottom: 20, color: "#666" }}>
              Đặt mật khẩu mới cho tài khoản
            </p>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Tối thiểu 6 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu mới"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined />}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-btn"
                size="large"
              >
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
