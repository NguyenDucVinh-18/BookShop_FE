import React, { useEffect } from "react";
import { Typography, Card, Row, Col, Collapse, Divider } from "antd";
import { DollarOutlined, CreditCardOutlined, MobileOutlined } from "@ant-design/icons";
import "../styles/PaymentMethodsPage.css";

const { Title, Paragraph, Text } = Typography;

const PaymentMethodsPage = () => {
    useEffect(() => {
        // Hỗ trợ điều hướng theo hash #cod, #card, #ewallet
        const hash = window.location.hash?.replace('#', '');
        if (!hash) return;
        const el = document.getElementById(hash);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <Title level={2} className="payment-title">Phương thức thanh toán</Title>
                    <Text className="payment-subtitle">Các hình thức thanh toán đang hỗ trợ</Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card className="payment-card">
                            <a id="cod" />
                            <div className="payment-icon"><DollarOutlined /></div>
                            <Title level={4}>Thanh toán khi nhận hàng (COD)</Title>
                            <Paragraph>
                                Bạn thanh toán trực tiếp cho nhân viên giao hàng khi nhận sách. Vui lòng chuẩn bị đủ tiền mặt và kiểm tra sản phẩm trước khi trả tiền.
                            </Paragraph>
                            <Collapse ghost>
                                <Collapse.Panel header="Xem chi tiết cách thực hiện" key="cod-detail">
                                    <ol>
                                        <li>Đặt hàng, chọn phương thức thanh toán: COD.</li>
                                        <li>Kiểm tra điện thoại để nhận cuộc gọi/xác nhận từ nhân viên (nếu cần).</li>
                                        <li>Nhận hàng, kiểm tra tình trạng sách, số lượng, hóa đơn.</li>
                                        <li>Thanh toán tiền mặt cho shipper và nhận biên nhận.</li>
                                    </ol>
                                    <Divider />
                                    <Paragraph strong>Ghi chú</Paragraph>
                                    <ul>
                                        <li>Có thể phụ thu phí thu hộ theo quy định hãng vận chuyển (nếu có).</li>
                                        <li>Chuẩn bị tiền lẻ để việc giao nhận nhanh chóng.</li>
                                    </ul>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="payment-card">
                            <a id="card" />
                            <div className="payment-icon"><CreditCardOutlined /></div>
                            <Title level={4}>Thẻ ngân hàng/Thẻ tín dụng</Title>
                            <Paragraph>
                                (Dự kiến) Chúng tôi đang tích hợp cổng thanh toán để chấp nhận thẻ nội địa và quốc tế. Hiện tại, vui lòng ưu tiên COD.
                            </Paragraph>
                            <Collapse ghost>
                                <Collapse.Panel header="Xem chi tiết (sắp ra mắt)" key="card-detail">
                                    <Paragraph>
                                        Dự kiến hỗ trợ thẻ nội địa Napas, Visa/Mastercard. Giao dịch sẽ được xử lý qua cổng đạt chuẩn bảo mật PCI DSS, OTP 3-D Secure.
                                    </Paragraph>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="payment-card">
                            <a id="ewallet" />
                            <div className="payment-icon"><MobileOutlined /></div>
                            <Title level={4}>Ví điện tử/Chuyển khoản</Title>
                            <Paragraph>
                                (Dự kiến) Hỗ trợ các ví phổ biến và chuyển khoản nhanh 24/7. Thông tin chi tiết sẽ được cập nhật sau.
                            </Paragraph>
                            <Collapse ghost>
                                <Collapse.Panel header="Hướng dẫn chuyển khoản (tham khảo)" key="ewallet-detail">
                                    <ol>
                                        <li>Chọn phương thức “Chuyển khoản/Ví điện tử”.</li>
                                        <li>Nhận thông tin tài khoản/cổng ví ở bước thanh toán.</li>
                                        <li>Chuyển khoản đúng số tiền, nội dung gồm Mã đơn hàng.</li>
                                        <li>Giữ lại chứng từ; đơn sẽ được xác nhận sau khi hệ thống ghi nhận.</li>
                                    </ol>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PaymentMethodsPage;


