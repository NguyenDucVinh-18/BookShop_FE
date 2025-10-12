import React, { useEffect } from "react";
import { Typography, Card, Row, Col, Collapse, Divider } from "antd";
import { CarOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "../styles/ShippingMethodsPage.css";

const { Title, Paragraph, Text } = Typography;

const ShippingMethodsPage = () => {
    useEffect(() => {
        const hash = window.location.hash?.replace('#', '');
        if (!hash) return;
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);
    return (
        <div className="shipping-page">
            <div className="shipping-container">
                <div className="shipping-header">
                    <Title level={2} className="shipping-title">Phương thức giao hàng</Title>
                    <Text className="shipping-subtitle">Hình thức vận chuyển và thời gian dự kiến</Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card className="shipping-card">
                            <a id="standard" />
                            <div className="shipping-icon"><CarOutlined /></div>
                            <Title level={4}>Giao tiêu chuẩn</Title>
                            <Paragraph>
                                Áp dụng toàn quốc. Thời gian 2–5 ngày làm việc tùy khu vực. Phí theo bảng cước của đơn vị vận chuyển.
                            </Paragraph>
                            <Collapse ghost>
                                <Collapse.Panel header="Chi tiết" key="std-detail">
                                    <ul>
                                        <li>Nội thành: 1–2 ngày; ngoại thành/ tỉnh: 3–5 ngày.</li>
                                        <li>Phí dựa trên trọng lượng/khối lượng quy đổi và địa chỉ giao.</li>
                                        <li>Giao giờ hành chính; có thể hẹn lại nếu bạn bận.</li>
                                    </ul>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="shipping-card">
                            <a id="express" />
                            <div className="shipping-icon"><ClockCircleOutlined /></div>
                            <Title level={4}>Giao nhanh</Title>
                            <Paragraph>
                                (Tùy khu vực) Giao trong 24–48 giờ. Phụ thu theo chính sách hãng vận chuyển tại thời điểm đặt hàng.
                            </Paragraph>
                            <Collapse ghost>
                                <Collapse.Panel header="Chi tiết" key="exp-detail">
                                    <ul>
                                        <li>Áp dụng tại TP lớn và một số tuyến liên tỉnh.</li>
                                        <li>Đơn đặt trước 15:00 sẽ ưu tiên giao trong 24–48 giờ.</li>
                                        <li>Phụ thu theo hãng vận chuyển; hiển thị ở bước thanh toán.</li>
                                    </ul>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="shipping-card">
                            <a id="pickup" />
                            <div className="shipping-icon"><EnvironmentOutlined /></div>
                            <Title level={4}>Nhận tại cửa hàng</Title>
                            <Paragraph>
                                Bạn có thể đặt online và đến cửa hàng để nhận sách. Vui lòng gọi trước để được chuẩn bị hàng.
                            </Paragraph>
                            <Collapse ghost>
                                <Collapse.Panel header="Quy trình" key="pickup-detail">
                                    <ol>
                                        <li>Đặt hàng, chọn phương thức nhận tại cửa hàng.</li>
                                        <li>Chờ SMS/điện thoại xác nhận “Hàng sẵn sàng”.</li>
                                        <li>Đến cửa hàng trong 48 giờ, cung cấp SĐT/mã đơn để nhận.</li>
                                    </ol>
                                    <Divider />
                                    <ul>
                                        <li>Hàng được giữ tối đa 48 giờ kể từ lúc thông báo.</li>
                                        <li>Có thể nhờ người thân nhận giúp (cung cấp SĐT đặt hàng).</li>
                                    </ul>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ShippingMethodsPage;


