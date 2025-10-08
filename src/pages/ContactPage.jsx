import React from "react";
import { Typography, Card, Row, Col, Form, Input, Button, message } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "../styles/ContactPage.css";

const { Title, Paragraph, Text } = Typography;

const ContactPage = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // Tạm thời chỉ hiển thị thông báo. Có thể nối API gửi mail/CRM sau.
        console.log("Contact form submitted:", values);
        message.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.");
        form.resetFields();
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <Title level={2} className="contact-title">Liên hệ</Title>
                    <Text className="contact-subtitle">Bạn cần hỗ trợ? Hãy gửi thông tin, HIEUVINHbook sẽ phản hồi trong 24h</Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={14}>
                        <Card className="contact-card">
                            <Title level={4}>Gửi yêu cầu hỗ trợ</Title>
                            <Form
                                layout="vertical"
                                form={form}
                                onFinish={onFinish}
                                requiredMark={false}
                            >
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                                            <Input placeholder="Nguyễn Văn A" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                                            <Input placeholder="0966 160 925" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Email không hợp lệ" }]}>
                                    <Input placeholder="email@domain.com" />
                                </Form.Item>
                                <Form.Item label="Nội dung" name="message" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
                                    <Input.TextArea rows={5} placeholder="Mô tả vấn đề bạn gặp phải hoặc yêu cầu hỗ trợ" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Gửi liên hệ</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} md={10}>
                        <Card className="contact-info-card">
                            <Title level={4}>Thông tin liên hệ</Title>
                            <div className="contact-info-item">
                                <EnvironmentOutlined className="contact-info-icon" />
                                <div>
                                    <div>12 Nguyễn Văn Bảo, Phường Hạnh Thông, Quận Gò Vấp, TP. HCM</div>
                                    <div>Số 10 Nguyễn Văn Dung, Phường An Nhơn, Quận Gò Vấp, TP. HCM</div>
                                    <div>Số 20, Đường 53, Phường An Hội Tây, Quận Gò Vấp, TP. HCM</div>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <PhoneOutlined className="contact-info-icon" />
                                <div>0966 160 925 - 0989 849 396 • (028) 6675 1142</div>
                            </div>
                            <div className="contact-info-item">
                                <MailOutlined className="contact-info-icon" />
                                <div>cskh@hieuvinhbook.vn</div>
                            </div>
                            <Paragraph className="contact-note">Thời gian hỗ trợ: 8:00 - 22:00 (Tất cả các ngày)</Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ContactPage;


