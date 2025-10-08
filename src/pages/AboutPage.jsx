import React from "react";
import { Typography, Card, Row, Col } from "antd";
import "../styles/AboutPage.css";

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="about-header">
                    <Title level={2} className="about-title">Giới thiệu HIEUVINHbook</Title>
                    <Text className="about-subtitle">Ươm mầm tri thức – Đồng hành cùng bạn đọc Việt</Text>
                </div>

                <Card className="about-card">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Title level={4}>Sứ mệnh</Title>
                            <Paragraph>
                                Mang đến cho độc giả kho sách phong phú, chính hãng với giá tốt, dịch vụ tận tâm và trải nghiệm mua sắm trực tuyến an toàn, thuận tiện.
                            </Paragraph>
                            <Title level={4}>Giá trị cốt lõi</Title>
                            <ul className="about-list">
                                <li>Chính trực – minh bạch</li>
                                <li>Lấy khách hàng làm trung tâm</li>
                                <li>Sản phẩm chính hãng, nguồn gốc rõ ràng</li>
                            </ul>
                        </Col>
                        <Col xs={24} md={12}>
                            <Title level={4}>Dịch vụ</Title>
                            <ul className="about-list">
                                <li>Giao hàng toàn quốc, hỗ trợ đổi trả 10 ngày</li>
                                <li>Chăm sóc khách hàng 8:00–22:00 mỗi ngày</li>
                                <li>Ưu đãi thành viên, tích điểm đổi quà</li>
                            </ul>
                            <Title level={4}>Liên hệ</Title>
                            <Paragraph>
                                Email: cskh@hieuvinhbook.vn – Hotline: 0966160925 / 0989849396
                            </Paragraph>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default AboutPage;


