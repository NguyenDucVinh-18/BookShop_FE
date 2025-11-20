import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Menu, Avatar, Typography, Badge } from "antd";
import {
  CarOutlined,
  DollarOutlined,
  SmileOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  FacebookOutlined,
  ShoppingCartOutlined,
  UpOutlined,
  MessageOutlined,
  RobotOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import "../styles/Footer.css";
import { useNavigate } from "react-router-dom";
import AIChatWidget from "./chat/AIChatWidget";
import StaffChatWidget from "./chat/StaffChatWidget";
import { AuthContext } from "./context/auth.context";
import { getSockJSUrl } from "../utils/websocketHelper";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const { Title, Text } = Typography;

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const customerId = user?.id || 1;
  const stompClientRef = useRef(null);
  const [unRead, setUnRead] = useState(0);

  // Widget visibility state
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);
  const [isStaffChatVisible, setIsStaffChatVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (stompClientRef.current) return;

    const socket = new SockJS(getSockJSUrl("/chat-websocket"));
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({}, () => {
      console.log("✅ Connected WebSocket");

      client.subscribe(`/topic/customer/unread/${customerId}`, (message) => {
        const unreadCount = JSON.parse(message.body);
        setUnRead(unreadCount);
      });

      client.send("/app/getUnread", {}, customerId.toString());
      stompClientRef.current = client;
    });

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect(() =>
          console.log("🔌 Disconnected WebSocket")
        );
      }
      stompClientRef.current = null;
    };
  }, [customerId]);

  const goToCart = () => {
    navigate("/cart");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // AI Chat functions
  const showAIChat = () => {
    setIsStaffChatVisible(false);
    setIsAIChatVisible(true);
  };
  const closeAIChat = () => setIsAIChatVisible(false);

  // Staff Chat functions
  const showStaffChat = () => {
    setIsAIChatVisible(false);
    setIsStaffChatVisible(true);
  };
  const closeStaffChat = () => setIsStaffChatVisible(false);

  // Chat menu items with Badge for unread messages
  const chatMenuItems = [
    {
      key: "staff",
      label: (
        <div className="chat-menu-item">
          <Badge count={unRead} size="small" offset={[10, 0]}>
            <Avatar
              size={32}
              icon={<CustomerServiceOutlined />}
              className="staff-avatar"
            />
          </Badge>
          <span>Chat với nhân viên</span>
        </div>
      ),
      onClick: showStaffChat,
    },
    {
      key: "ai",
      label: (
        <div className="chat-menu-item">
          <Avatar size={32} icon={<RobotOutlined />} className="ai-avatar" />
          <span>Chat với AI</span>
        </div>
      ),
      onClick: showAIChat,
    },
  ];

  const chatMenu = <Menu items={chatMenuItems} className="chat-dropdown-menu" />;

  return (
    <>
      {/* Top Promotional Bar */}
      <div className="promotional-bar">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-item">
              <CarOutlined className="promo-icon" />
              <div className="promo-content">
                <div className="promo-title">MIỄN PHÍ VẬN CHUYỂN</div>
                <div className="promo-subtitle">Free Ship Đơn Hàng Trên 300k</div>
              </div>
            </div>

            <div className="promo-item">
              <DollarOutlined className="promo-icon" />
              <div className="promo-content">
                <div className="promo-title">SHIP COD TOÀN QUỐC</div>
                <div className="promo-subtitle">Thanh toán khi nhận sách</div>
              </div>
            </div>

            <div className="promo-item">
              <SmileOutlined className="promo-icon" />
              <div className="promo-content">
                <div className="promo-title">MIỄN PHÍ ĐỔI TRẢ HÀNG</div>
                <div className="promo-subtitle">trong vòng 10 ngày</div>
              </div>
            </div>

            <div className="promo-item">
              <PhoneOutlined className="promo-icon" />
              <div className="promo-content">
                <div className="promo-title">HOTLINE:</div>
                <div className="promo-subtitle">0966160925 - 0989849396</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            {/* Column 1 - Company Info */}
            <div className="footer-column company-info">
              <div className="footer-logo">
                <div className="footer-logo-icon">HV</div>
                <div className="footer-logo-text">
                  <div className="footer-logo-title">HIEUVINHbook</div>
                  <div className="footer-logo-subtitle">Ươm mầm tri thức</div>
                </div>
              </div>
              {/* Company details */}
              <div className="company-details">
                <p>Công ty TNHH Một Thành viên</p>
                <p>Thương mại & Dịch vụ Văn hóa</p>
                <p>HIEUVINH</p>
              </div>
              {/* Contact */}
              <div className="contact-details">
                <div className="contact-item">
                  <EnvironmentOutlined className="contact-icon" />
                  <span>
                    Văn phòng: LK 02 - 03, Dãy B, KĐT Green Pearl, 378 Minh Khai, Hai Bà Trưng, Hà Nội.
                  </span>
                </div>
                <div className="contact-item">
                  <EnvironmentOutlined className="contact-icon" />
                  <span>
                    Cửa hàng: Gian hàng HIEU VINH Book tại Phố Sách Hà Nội, Phố 19 tháng 12, Hoàn Kiếm, Hà Nội.
                  </span>
                </div>
                <div className="contact-item">
                  <PhoneOutlined className="contact-icon" />
                  <span>0966160925 - 0989849396</span>
                </div>
                <div className="contact-item">
                  <MailOutlined className="contact-icon" />
                  <span>cskh@hieuvinhbook.vn</span>
                </div>
              </div>
            </div>

            {/* Column 2 - News */}
            <div className="footer-column">
              <h3 className="footer-title">TIN TỨC</h3>
              <ul className="footer-links">
                <li><a href="/about">Giới thiệu</a></li>
                <li><a href="/book-reviews">Điểm sách</a></li>
                <li><a href="/careers">Tuyển dụng</a></li>
                <li><a href="/events">Sự kiện</a></li>
                <li><a href="/promotions">Tin khuyến mãi</a></li>
              </ul>
            </div>

            {/* Column 3 - Customer Support */}
            <div className="footer-column">
              <h3 className="footer-title">HỖ TRỢ KHÁCH HÀNG</h3>
              <ul className="footer-links">
                <li><a href="/terms-of-use">Điều khoản sử dụng</a></li>
                <li><a href="/shopping-guide">Hướng dẫn mua hàng</a></li>
                <li><a href="/payment-methods">Phương thức thanh toán</a></li>
                <li><a href="/shipping-methods">Phương thức giao hàng</a></li>
                <li><a href="/return-policy">Chính sách đổi trả</a></li>
                <li><a href="/privacy-policy">Bảo mật thông tin</a></li>
              </ul>
            </div>

            {/* Column 4 - Information */}
            <div className="footer-column">
              <h3 className="footer-title">THÔNG TIN</h3>
              <ul className="footer-links">
                <li><a href="/login">Đăng nhập</a></li>
                <li><a href="/register">Đăng ký</a></li>
                <li><a href="/order-lookup">Tra cứu đơn hàng</a></li>
                <li><a href="/contact">Liên hệ</a></li>
              </ul>
            </div>

            {/* Column 5 - Facebook */}
            <div className="footer-column facebook-section">
              <h3 className="footer-title">KẾT NỐI VỚI HIEUVINH TRÊN FACEBOOK</h3>
              <div className="facebook-widget">
                <div className="facebook-header">
                  <div className="facebook-logo">M</div>
                  <div className="facebook-info">
                    <div className="facebook-name">HIEUVINHBook</div>
                    <div className="facebook-followers">80.609 người theo dõi</div>
                  </div>
                </div>
                <Button type="primary" className="facebook-button" icon={<FacebookOutlined />}>
                  Theo dõi Trang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Strip */}
      <div className="bottom-strip">
        <div className="container">
          <div className="bottom-content">
            <div className="bottom-left">
              <div className="certification">
                <div className="cert-icon">✓</div>
                <span>ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG</span>
              </div>
            </div>
            <div className="bottom-right">
              <span>© Bản quyền thuộc về Công ty TNHH MTV TM và DV Văn Hoá HIEU VINH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        <Button
          className="fab-button cart-fab"
          icon={<ShoppingCartOutlined />}
          shape="circle"
          size="large"
          onClick={goToCart}
        />
        <Button
          className="fab-button scroll-fab"
          icon={<UpOutlined />}
          shape="circle"
          size="large"
          onClick={scrollToTop}
        />
        <Dropdown overlay={chatMenu} placement="topLeft" trigger={["click"]}>
          <Badge count={unRead} size="small" offset={[-2, 2]}>
            <Button
              className="fab-button zalo-fab"
              icon={<MessageOutlined />}
              shape="circle"
              size="large"
            />
          </Badge>
        </Dropdown>
      </div>

      {/* AI Chat Widget */}
      {isAIChatVisible && <AIChatWidget onClose={closeAIChat} />}
      {/* Staff Chat Widget */}
      {isStaffChatVisible && <StaffChatWidget onClose={closeStaffChat} />}
    </>
  );
};

export default Footer;
