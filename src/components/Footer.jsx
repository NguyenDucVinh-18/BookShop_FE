import React from 'react';
import { Button, Space } from 'antd';
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
    MessageOutlined
} from '@ant-design/icons';
import '../styles/Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                                <div className="promo-subtitle">cho đơn hàng trên 300,000 VNĐ</div>
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
                                <div className="footer-logo-icon">ML</div>
                                <div className="footer-logo-text">
                                    <div className="footer-logo-title">MINHLONGbook</div>
                                    <div className="footer-logo-subtitle">Ươm mầm tri thức</div>
                                </div>
                            </div>

                            <div className="company-details">
                                <p>Công ty TNHH Một Thành viên</p>
                                <p>Thương mại & Dịch vụ Văn hóa</p>
                                <p>Minh Long</p>
                                <p>Mã Số Thuế: 0102726224</p>
                            </div>

                            <div className="contact-details">
                                <div className="contact-item">
                                    <EnvironmentOutlined className="contact-icon" />
                                    <span>Văn phòng: LK 02 - 03, Dãy B, KĐT Green Pearl, 378 Minh Khai, Hai Bà Trưng, Hà Nội.</span>
                                </div>
                                <div className="contact-item">
                                    <EnvironmentOutlined className="contact-icon" />
                                    <span>Cửa hàng: Gian hàng Minh Long Book tại Phố Sách Hà Nội, Phố 19 tháng 12, Hoàn Kiếm, Hà Nội.</span>
                                </div>
                                <div className="contact-item">
                                    <PhoneOutlined className="contact-icon" />
                                    <span>0966160925 - 0989849396</span>
                                </div>
                                <div className="contact-item">
                                    <MailOutlined className="contact-icon" />
                                    <span>cskh@minhlongbook.vn</span>
                                </div>
                                <div className="contact-item">
                                    <EnvironmentOutlined className="contact-icon" />
                                    <span>Chi nhánh Miền Nam: 33 Đỗ Thừa Tự, Tân Quý, Tân Phú, Thành phố Hồ Chí Minh, Việt Nam</span>
                                </div>
                                <div className="contact-item">
                                    <PhoneOutlined className="contact-icon" />
                                    <span>0286 675 1142</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 - News */}
                        <div className="footer-column">
                            <h3 className="footer-title">TIN TỨC</h3>
                            <ul className="footer-links">
                                <li><a href="#">Giới thiệu</a></li>
                                <li><a href="#">Điểm sách</a></li>
                                <li><a href="#">Tuyển dụng</a></li>
                                <li><a href="#">Sự kiện</a></li>
                                <li><a href="#">Tin khuyến mại</a></li>
                            </ul>
                        </div>

                        {/* Column 3 - Customer Support */}
                        <div className="footer-column">
                            <h3 className="footer-title">HỖ TRỢ KHÁCH HÀNG</h3>
                            <ul className="footer-links">
                                <li><a href="#">Điều khoản sử dụng</a></li>
                                <li><a href="#">Hướng dẫn mua hàng</a></li>
                                <li><a href="#">Phương thức thanh toán</a></li>
                                <li><a href="#">Phương thức giao hàng</a></li>
                                <li><a href="#">Chính sách đổi trả</a></li>
                                <li><a href="#">Bảo mật thông tin</a></li>
                            </ul>
                        </div>

                        {/* Column 4 - Information */}
                        <div className="footer-column">
                            <h3 className="footer-title">THÔNG TIN</h3>
                            <ul className="footer-links">
                                <li><a href="#">Đăng nhập</a></li>
                                <li><a href="#">Đăng ký</a></li>
                                <li><a href="#">Tra cứu đơn hàng</a></li>
                                <li><a href="#">Liên hệ</a></li>
                            </ul>
                        </div>

                        {/* Column 5 - Facebook */}
                        <div className="footer-column facebook-section">
                            <h3 className="footer-title">KẾT NỐI VỚI MINH LONG TRÊN FACEBOOK</h3>
                            <div className="facebook-widget">
                                <div className="facebook-header">
                                    <div className="facebook-logo">M</div>
                                    <div className="facebook-info">
                                        <div className="facebook-name">MINH LONG Book</div>
                                        <div className="facebook-followers">80.609 người theo dõi</div>
                                    </div>
                                </div>
                                <Button
                                    type="primary"
                                    className="facebook-button"
                                    icon={<FacebookOutlined />}
                                >
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
                            <span>© Bản quyền thuộc về Công ty TNHH MTV TM và DV Văn Hoá Minh Long</span>
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
                />
                <Button
                    className="fab-button scroll-fab"
                    icon={<UpOutlined />}
                    shape="circle"
                    size="large"
                    onClick={scrollToTop}
                />
                <Button
                    className="fab-button zalo-fab"
                    icon={<MessageOutlined />}
                    shape="circle"
                    size="large"
                />
            </div>
        </>
    );
};

export default Footer;
