import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import {
  ExclamationCircleOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "../../styles/VerifyFailed.css";

export default function VerifyFailed() {
  const navigate = useNavigate();

  const handleResendEmail = () => {
    navigate("/email-verification");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleBackToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="verify-failed-page">
      <div className="verify-failed-container">
        <div className="failed-icon-wrapper">
          <ExclamationCircleOutlined className="failed-icon" />
        </div>

        <h2 className="failed-title">Xác thực không thành công</h2>

        <div className="failed-content">
          <p className="failed-message">
            Rất tiếc, liên kết xác thực của bạn có thể đã hết hạn hoặc không hợp
            lệ.
          </p>

          <div className="failed-reasons">
            <h4>Có thể do các nguyên nhân sau:</h4>
            <ul>
              <li>Liên kết đã được sử dụng trước đó</li>
              <li>Liên kết bị hỏng hoặc không đầy đủ</li>
              <li>Tài khoản đã được kích hoạt</li>
            </ul>
          </div>
        </div>

        <div className="failed-actions">
          <div className="secondary-actions">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={handleBackToLogin}
              className="back-login-btn"
            >
              Về trang đăng nhập
            </Button>

            <Button
              type="link"
              onClick={handleBackToRegister}
              className="back-register-btn"
            >
              Đăng ký tài khoản mới
            </Button>
          </div>
        </div>

        {/* <div className="failed-footer">
          <p>
            Vẫn gặp vấn đề? 
            <a href="/support" className="support-link"> Liên hệ hỗ trợ kỹ thuật</a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
