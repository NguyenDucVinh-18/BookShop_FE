import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import {
  MailOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "../../styles/EmailVerificationPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { resendVerificationEmail } from "../../service/auth.service";

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const userEmail = location.state?.email || "your-email@example.com";

  // Countdown timer cho nút gửi lại
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      const res = await resendVerificationEmail(userEmail);
      console.log("Resend email response:", res);

      if (res && res.data) {
        message.success("Email xác nhận đã được gửi lại thành công!");
        setCountdown(60);
        setCanResend(false);
      } else {
        message.error("Có lỗi khi gửi lại email. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Resend email error:", error);
      message.error("Có lỗi khi gửi lại email. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    navigate("/register");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <div className="verification-icon">
          <MailOutlined className="mail-icon" />
        </div>

        <h2 className="verification-title">Kiểm tra email của bạn</h2>

        <div className="verification-content">
          <p className="verification-message">
            Chúng tôi đã gửi một liên kết xác nhận đến địa chỉ email:
          </p>
          <div className="email-display">
            <strong>{userEmail}</strong>
          </div>

          <p className="verification-instruction">
            Vui lòng kiểm tra hộp thư của bạn và nhấp vào liên kết để kích hoạt
            tài khoản.
          </p>

          <div className="verification-tips">
            <div className="tip-item">
              <CheckCircleOutlined className="tip-icon" />
              <span>Kiểm tra cả thư mục spam/junk mail</span>
            </div>
          </div>
        </div>

        <div className="verification-actions">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleResendEmail}
            disabled={!canResend}
            loading={loading}
            size="large"
            className="resend-btn"
          >
            {canResend ? "Gửi lại email" : `Gửi lại sau ${countdown}s`}
          </Button>

          <div className="action-links">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToRegister}
              className="back-link"
            >
              Quay lại đăng ký
            </Button>
            <Button
              type="link"
              onClick={handleGoToLogin}
              className="login-link"
            >
              Đã có tài khoản? Đăng nhập
            </Button>
          </div>
        </div>

        <div className="support-info">
          <p>
            Không nhận được email?
            <a href="/support" className="support-link">
              {" "}
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
