import React from "react";
import { Typography, Card, Alert } from "antd";
import { SafetyCertificateOutlined, LockOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import "../styles/PrivacyPolicyPage.css";

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicyPage = () => {
    return (
        <div className="privacy-policy-page">
            <div className="privacy-policy-container">
                <div className="privacy-policy-header">
                    <Title level={2} className="privacy-policy-title">Bảo mật thông tin</Title>
                    <Text className="privacy-policy-subtitle">Cam kết bảo vệ dữ liệu cá nhân của khách hàng</Text>
                </div>

                <Card className="privacy-policy-content">
                    <div className="privacy-section">
                        <Title level={4}>Giới thiệu</Title>
                        <Alert showIcon type="success" className="privacy-alert"
                            message="Cam kết bảo mật"
                            description="Chúng tôi tuân thủ quy định pháp luật về bảo vệ dữ liệu cá nhân và áp dụng biện pháp an toàn thông tin nhiều lớp." />
                    </div>

                    <div className="privacy-section">
                        <Title level={4}>Thông tin thu thập</Title>
                        <ul className="info-list">
                            <li><UserOutlined /> Họ tên, email, số điện thoại, địa chỉ</li>
                            <li><EyeOutlined /> Lịch sử mua hàng, hoạt động trên website</li>
                            <li><LockOutlined /> Thông tin đăng nhập (được mã hóa)</li>
                        </ul>
                    </div>

                    <div className="privacy-section">
                        <Title level={4}>Mục đích sử dụng</Title>
                        <ul className="info-list">
                            <li><SafetyCertificateOutlined /> Xử lý đơn hàng và hỗ trợ khách hàng</li>
                            <li><SafetyCertificateOutlined /> Cải thiện chất lượng dịch vụ</li>
                            <li><SafetyCertificateOutlined /> Bảo mật tài khoản và phòng chống gian lận</li>
                        </ul>
                    </div>

                    <div className="privacy-section">
                        <Title level={4}>Chia sẻ với bên thứ ba</Title>
                        <ul className="info-list">
                            <li>Với đối tác vận chuyển: chỉ chia sẻ tên, số điện thoại, địa chỉ giao hàng.</li>
                            <li>Với cổng thanh toán: thông tin cần thiết để xử lý giao dịch, không lưu số thẻ trên hệ thống.</li>
                            <li>Với cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp.</li>
                        </ul>
                    </div>

                    <div className="privacy-section">
                        <Title level={4}>Quyền của khách hàng</Title>
                        <ul className="info-list">
                            <li>Yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân.</li>
                            <li>Rút lại sự đồng ý xử lý dữ liệu (trong phạm vi pháp luật cho phép).</li>
                            <li>Từ chối nhận thông tin marketing bất cứ lúc nào.</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;


