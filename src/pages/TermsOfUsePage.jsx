import React from "react";
import { Typography, Card, Divider } from "antd";
import "../styles/TermsOfUsePage.css";

const { Title, Paragraph, Text } = Typography;

const TermsOfUsePage = () => {
    return (
        <div className="terms-page">
            <div className="terms-container">
                <div className="terms-header">
                    <Title level={2} className="terms-title">Điều khoản sử dụng</Title>
                    <Text className="terms-subtitle">Cập nhật: {new Date().toLocaleDateString("vi-VN")}</Text>
                </div>

                <Card className="terms-content">
                    <div className="terms-section">
                        <Title level={4}>1. Giới thiệu</Title>
                        <Paragraph>
                            Các Điều khoản sử dụng này điều chỉnh việc truy cập và sử dụng website thương mại điện tử
                            HIEUVINHbook nhằm mua sắm, tra cứu thông tin sách và các dịch vụ liên quan. Bằng việc sử dụng
                            website, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ điều khoản dưới đây.
                        </Paragraph>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>2. Tài khoản và độ tuổi</Title>
                        <ul className="terms-list">
                            <li>Người dùng từ 16 tuổi trở lên được phép tự đăng ký tài khoản. Người dưới 16 tuổi cần sự đồng ý của người giám hộ.</li>
                            <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập, mọi giao dịch phát sinh từ tài khoản được coi là do bạn thực hiện.</li>
                            <li>Thông tin cung cấp phải chính xác, đầy đủ và cập nhật; tài khoản có dấu hiệu gian lận có thể bị tạm khóa.</li>
                        </ul>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>3. Quy trình mua hàng và chấp nhận đơn</Title>
                        <ul className="terms-list">
                            <li>Giá hiển thị đã bao gồm thuế VAT (nếu có), chưa bao gồm phí vận chuyển.</li>
                            <li>Đơn hàng chỉ được xác nhận khi bạn nhận được email/điện thoại xác nhận từ HIEUVINHbook.</li>
                            <li>Trong các trường hợp hiếm gặp (hết hàng, sai giá do lỗi hệ thống), chúng tôi có quyền hủy đơn trước khi giao và sẽ hoàn tiền (nếu đã thanh toán).</li>
                        </ul>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>4. Khuyến mại, mã giảm giá</Title>
                        <ul className="terms-list">
                            <li>Mỗi đơn hàng chỉ áp dụng 01 mã khuyến mại (trừ khi có quy định khác).</li>
                            <li>Mã khuyến mại không có giá trị quy đổi thành tiền mặt, có thể giới hạn theo thời gian/số lượng.</li>
                            <li>Đơn hàng vi phạm điều kiện chương trình có thể bị hủy hoặc thu hồi ưu đãi.</li>
                        </ul>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>5. Hành vi bị nghiêm cấm</Title>
                        <ul className="terms-list">
                            <li>Giả mạo danh tính, can thiệp trái phép vào hệ thống, phát tán mã độc.</li>
                            <li>Đăng tải nội dung vi phạm pháp luật, xâm phạm quyền riêng tư, bản quyền.</li>
                            <li>Thu thập, khai thác dữ liệu trái phép từ website.</li>
                        </ul>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>6. Quyền sở hữu trí tuệ</Title>
                        <Paragraph>
                            Toàn bộ nội dung, thiết kế, hình ảnh, logo, nhãn hiệu trên website thuộc quyền sở hữu của
                            HIEUVINHbook hoặc bên cấp phép. Nghiêm cấm sao chép, sửa đổi, phân phối cho mục đích thương mại
                            nếu không có chấp thuận bằng văn bản.
                        </Paragraph>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>7. Giới hạn trách nhiệm</Title>
                        <Paragraph>
                            Chúng tôi nỗ lực đảm bảo thông tin chính xác nhưng không bảo đảm tuyệt đối về sự đầy đủ, kịp thời.
                            HIEUVINHbook không chịu trách nhiệm đối với các thiệt hại gián tiếp phát sinh do sự cố ngoài tầm kiểm soát
                            (mất kết nối, thiên tai, dịch bệnh, thay đổi chính sách của đơn vị vận chuyển...).
                        </Paragraph>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>8. Luật áp dụng và giải quyết tranh chấp</Title>
                        <Paragraph>
                            Điều khoản được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ ưu tiên giải quyết bằng thương lượng;
                            nếu không thành, sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam.
                        </Paragraph>
                    </div>

                    <Divider />

                    <div className="terms-section">
                        <Title level={4}>9. Thay đổi điều khoản</Title>
                        <Paragraph>
                            HIEUVINHbook có thể cập nhật Điều khoản định kỳ. Thời điểm hiệu lực sẽ được thông báo trên trang này;
                            việc tiếp tục sử dụng đồng nghĩa bạn đồng ý với phiên bản mới.
                        </Paragraph>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TermsOfUsePage;


