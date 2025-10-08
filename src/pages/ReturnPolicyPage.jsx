import React from "react";
import { Typography, Card, Timeline, Alert, Table, Tag } from "antd";
import "../styles/ReturnPolicyPage.css";

const { Title, Paragraph, Text } = Typography;

const ReturnPolicyPage = () => {
    const data = [
        { key: "1", condition: "Sách lỗi in ấn, rách, thiếu trang", status: "Đổi trả miễn phí", color: "green" },
        { key: "2", condition: "Không đúng mô tả", status: "Đổi trả miễn phí", color: "green" },
        { key: "3", condition: "Hư hỏng do vận chuyển", status: "Đổi trả miễn phí", color: "green" },
        { key: "4", condition: "Khách đổi ý (≤ 7 ngày)", status: "Đổi trả có phí", color: "orange" },
        { key: "5", condition: "Đã sử dụng/đọc", status: "Không đổi trả", color: "red" },
        { key: "6", condition: "> 10 ngày nhận hàng", status: "Không đổi trả", color: "red" }
    ];

    const columns = [
        { title: "Điều kiện", dataIndex: "condition", key: "condition" },
        { title: "Trạng thái", dataIndex: "status", key: "status", render: (v, r) => <Tag color={r.color}>{v}</Tag> }
    ];

    return (
        <div className="return-policy-page">
            <div className="return-policy-container">
                <div className="return-policy-header">
                    <Title level={2} className="return-policy-title">Chính sách đổi trả</Title>
                    <Text className="return-policy-subtitle">Đổi trả miễn phí trong 10 ngày đối với sách lỗi</Text>
                </div>

                <Card className="return-policy-content">
                    <div className="policy-section">
                        <Title level={4}>Tổng quan</Title>
                        <Paragraph>
                            HIEUVINHbook hỗ trợ đổi trả linh hoạt để bảo vệ quyền lợi khách hàng khi mua sách online.
                            Thời hạn yêu cầu đổi/ trả: trong vòng 10 ngày kể từ khi nhận hàng theo trạng thái giao hàng.
                        </Paragraph>
                        <Alert showIcon type="success" className="policy-alert"
                            message="Cam kết chất lượng" description="Nếu sách lỗi, chúng tôi đổi trả miễn phí trong 10 ngày." />
                    </div>

                    <div className="policy-section">
                        <Title level={4}>Điều kiện đổi trả</Title>
                        <Table dataSource={data} columns={columns} pagination={false} className="return-conditions-table" />
                    </div>

                    <div className="policy-section">
                        <Title level={4}>Quy trình xử lý</Title>
                        <Timeline className="return-timeline"
                            items={[
                                { children: "Liên hệ hotline/email yêu cầu đổi trả" },
                                { children: "Cung cấp mã đơn hàng, ảnh chụp tình trạng sách" },
                                { children: "Xác nhận từ nhân viên và hướng dẫn" },
                                { children: "Gửi sách về địa chỉ quy định hoặc hẹn thu hồi (nếu có)" },
                                { children: "Kiểm tra chất lượng, xác định nguyên nhân" },
                                { children: "Hoàn tiền hoặc gửi sách mới" }
                            ]}
                        />
                    </div>

                    <div className="policy-section">
                        <Title level={4}>Phí đổi trả</Title>
                        <Paragraph>
                            Miễn phí khi lỗi do nhà sản xuất/vận chuyển. Trường hợp khách đổi ý: phụ thu phí 2 chiều vận chuyển theo biểu phí hãng vận chuyển tại thời điểm xử lý.
                        </Paragraph>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ReturnPolicyPage;


