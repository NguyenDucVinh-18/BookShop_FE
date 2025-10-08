import React from "react";
import { Typography, Card, Steps, Row, Col, Alert } from "antd";
import { SearchOutlined, ShoppingCartOutlined, CreditCardOutlined, TruckOutlined } from "@ant-design/icons";
import "../styles/ShoppingGuidePage.css";

const { Title, Paragraph, Text } = Typography;

const ShoppingGuidePage = () => {
    const steps = [
        { title: "Tìm kiếm", description: "Tìm sách theo tên, tác giả, danh mục", icon: <SearchOutlined /> },
        { title: "Thêm giỏ hàng", description: "Chọn số lượng rồi thêm vào giỏ", icon: <ShoppingCartOutlined /> },
        { title: "Thanh toán", description: "Điền thông tin và xác nhận đơn", icon: <CreditCardOutlined /> },
        { title: "Nhận hàng", description: "Theo dõi và nhận sách tại nhà", icon: <TruckOutlined /> }
    ];

    return (
        <div className="shopping-guide-page">
            <div className="shopping-guide-container">
                <div className="shopping-guide-header">
                    <Title level={2} className="shopping-guide-title">Hướng dẫn mua hàng</Title>
                    <Text className="shopping-guide-subtitle">Các bước mua sách online tại HIEUVINHbook</Text>
                </div>

                <Card className="shopping-guide-content">
                    <div className="shopping-section">
                        <Title level={4}>Quy trình mua hàng chuẩn</Title>
                        <Steps direction="vertical" size="large" current={-1} items={steps} className="shopping-steps" />
                    </div>

                    <div className="shopping-section">
                        <Title level={4}>Hướng dẫn chi tiết</Title>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                                <Card className="guide-card">
                                    <Title level={5}>1. Tìm kiếm hiệu quả</Title>
                                    <ul className="guide-list">
                                        <li>Nhập từ khóa rõ ràng (tên sách/tác giả/ISBN).</li>
                                        <li>Dùng bộ lọc: danh mục, nhà xuất bản, mức giá, đánh giá.</li>
                                        <li>Vào trang chi tiết để xem mô tả, số trang, kích thước, năm XB.</li>
                                    </ul>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card className="guide-card">
                                    <Title level={5}>2. Thanh toán an toàn</Title>
                                    <ul className="guide-list">
                                        <li>Kiểm tra giỏ hàng, áp mã giảm giá (nếu có).</li>
                                        <li>Điền chính xác họ tên, điện thoại, địa chỉ (ghi chú tòa, thôn/xóm...).</li>
                                        <li>Chọn phương thức thanh toán phù hợp (COD, ví điện tử/thẻ nếu mở sau).</li>
                                    </ul>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <div className="shopping-section">
                        <Title level={4}>Lưu ý quan trọng</Title>
                        <Alert showIcon type="info" className="guide-alert"
                            message="Có thể mua không cần đăng ký; tuy nhiên, đăng ký giúp theo dõi đơn, lưu địa chỉ giao hàng và nhận ưu đãi thành viên." />
                        <Alert showIcon type="warning" className="guide-alert"
                            message="Nếu cần đổi địa chỉ sau khi đặt, hãy liên hệ hotline trong 30 phút để được hỗ trợ." />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ShoppingGuidePage;


