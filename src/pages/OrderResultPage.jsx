import React, { useState, useEffect, useContext } from "react";
import {
  Result,
  Card,
  Descriptions,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Divider,
  Row,
  Col,
  Spin,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
  HomeOutlined,
  ShoppingOutlined,
  CopyOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { getOrderByIdAPI, repaymentOrderAPI } from "../service/order.service";
import "../styles/OrderResultPage.css";

const { Title, Text } = Typography;

const OrderResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { user } = useContext(AuthContext);

  const fetchOrderData = async (orderId) => {
    setLoading(true);
    try {
      const response = await getOrderByIdAPI(orderId);
      setOrderData(response.data);
      if(response.data.promotion){
        const discount = response.data.promotion.discountPercent;
        const disAmount = response.data.orderItems.reduce((sum, item) => {
          const actualPrice =
            item.discountPercentage > 0
              ? item.priceAfterDiscount
              : item.price;
          return sum + (actualPrice * item.quantity * discount) / 100;
        }, 0);
        setDiscountAmount(disAmount);
      }
      setError(null);
    } catch (err) {
      setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  console.log("order data", orderData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const orderIdParam = urlParams.get("orderId");
    setOrderStatus(status);
    if (orderIdParam) {
      fetchOrderData(orderIdParam);
    }
  }, []);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "CONFIRMED":
        return "blue";
      case "SHIPPING":
        return "cyan";
      case "DELIVERED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(`${orderData.orderId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoHome = () => {
    navigate(`/`);
  };

  const repaymentOrder = async (orderId) => {
    const res = await repaymentOrderAPI(orderId);
    console.log("res:", res);
    if (res && res.data) {
      window.location.href = res.data;
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={record.productImage}
            alt={text}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #f0f0f0",
            }}
          />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price, record) => (
        <div>
          <Text strong style={{ color: "#1890ff" }}>
            {record.discountPercentage > 0
              ? formatCurrency(record.priceAfterDiscount)
              : formatCurrency(price)}
          </Text>
          {record.discountPercentage > 0 && (
            <div>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  textDecoration: "line-through",
                  color: "#999",
                }}
              >
                {formatCurrency(price)}
              </Text>
              <Tag color="red" size="small" style={{ marginLeft: 4 }}>
                -{record.discountPercentage}%
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity) => <Tag color="blue">{quantity}</Tag>,
    },
    {
      title: "Thành tiền",
      key: "subtotal",
      align: "right",
      render: (_, record) => {
        const actualPrice =
          record.discountPercentage > 0
            ? record.priceAfterDiscount
            : record.price;
        return (
          <Text strong style={{ color: "#f5222d", fontSize: 16 }}>
            {formatCurrency(actualPrice * record.quantity)}
          </Text>
        );
      },
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải thông tin đơn hàng...</Text>
        </div>
      </div>
    );
  }

  // Error state or failed status
  if (error || orderStatus === "fail") {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
        <Result
          icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
          status="error"
          title={
            <div>
              <Title level={2} style={{ color: "#ff4d4f", margin: 0 }}>
                {orderStatus === "fail"
                  ? "Thanh toán không thành công!"
                  : "Có lỗi xảy ra!"}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {error || "Đã có lỗi xảy ra trong quá trình thanh toán"}
              </Text>
            </div>
          }
          extra={
            <Space size="middle">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                size="large"
                onClick={() => repaymentOrder(orderData.id)}
              >
                Thử lại
              </Button>
              <Button
                icon={<HomeOutlined />}
                size="large"
                onClick={handleGoHome}
              >
                Về trang chủ
              </Button>
            </Space>
          }
        />

        {orderStatus === false && (
          <Alert
            message="Thông tin chi tiết"
            description={
              <div>
                <p>• Vui lòng kiểm tra lại thông tin thanh toán</p>
                <p>• Đảm bảo kết nối internet ổn định</p>
                <p>• Liên hệ hotline: 1900-xxxx nếu vấn đề vẫn tiếp tục</p>
                <p>
                  • Mã đơn hàng tham khảo:{" "}
                  {orderId && `DH${orderId.padStart(6, "0")}`}
                </p>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginTop: 24, textAlign: "left" }}
          />
        )}
      </div>
    );
  }

  // No order data
  if (!orderData) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
        <Result
          status="404"
          title="Không tìm thấy thông tin đơn hàng"
          subTitle="Đơn hàng có thể đã được xóa hoặc không tồn tại."
          extra={
            <Space>
              <Button type="primary" onClick={handleGoHome}>
                Về trang chủ
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  // Success state
  return (
    <div className="order-result-container">
      {/* Invoice Header - Only visible when printing */}
      <div className="print-content">
        <div className="invoice-header">
          <div className="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
          <div className="invoice-subtitle">
            HIEUVINHbook - Ươm mầm tri thức
          </div>
          <div className="invoice-subtitle">
            Địa chỉ: LK 02 - 03, Dãy B, KĐT Green Pearl, 378 Minh Khai, Hai Bà
            Trưng, Hà Nội
          </div>
          <div className="invoice-subtitle">
            Hotline: 0966160925 - 0989849396 | Email: cskh@hieuvinhbook.vn
          </div>
        </div>

        {/* Customer Information for Invoice */}
        <div className="invoice-customer">
          <div className="customer-title">THÔNG TIN KHÁCH HÀNG</div>
          <div className="customer-info">
            <div>
              <strong>Tên khách hàng:</strong> {user.username}
            </div>
            <div>
              <strong>Địa chỉ:</strong> {orderData.address}
            </div>
            <div>
              <strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}
            </div>
            <div>
              <strong>Email:</strong> {user.email || "Chưa cập nhật"}
            </div>
            <div>
              <strong>Mã đơn hàng:</strong> {orderData.id}
            </div>
            <div>
              <strong>Ngày đặt:</strong> {formatDate(orderData.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Success Result */}
      <Result
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        status="success"
        title={
          <div>
            <Title level={2} style={{ color: "#52c41a", margin: 0 }}>
              Đặt hàng thành công!
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Cảm ơn bạn đã tin tưởng và mua hàng tại cửa hàng của chúng tôi
            </Text>
          </div>
        }
        extra={
          <Space size="middle">
            <Button
              type="primary"
              icon={<HomeOutlined />}
              size="large"
              onClick={handleGoHome}
            >
              Về trang chủ
            </Button>
            <Button
              icon={<PrinterOutlined />}
              size="large"
              onClick={handlePrint}
            >
              In hóa đơn
            </Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]}>
        {/* Order Information */}
        <Col xs={24} lg={12}>
          <Card
            title="Thông tin đơn hàng"
            bordered={false}
            style={{ height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label="Mã đơn hàng"
                labelStyle={{ fontWeight: 600 }}
              >
                <Space>
                  <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                    {orderData.id}
                  </Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    size="small"
                    onClick={handleCopyOrderId}
                    title="Sao chép mã đơn hàng"
                  />
                </Space>
              </Descriptions.Item>

              <Descriptions.Item
                label="Thời gian đặt hàng"
                labelStyle={{ fontWeight: 600 }}
              >
                {formatDate(orderData.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item
                label="Trạng thái"
                labelStyle={{ fontWeight: 600 }}
              >
                <Tag
                  color={getStatusColor(orderData.orderStatus)}
                  style={{ fontSize: 14 }}
                >
                  {getStatusText(orderData.status)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label="Phương thức thanh toán"
                labelStyle={{ fontWeight: 600 }}
              >
                <Tag color="green">
                  {orderData.paymentMethod === "COD"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : orderData.paymentMethod}
                </Tag>
              </Descriptions.Item>

              {orderData.note && (
                <Descriptions.Item
                  label="Ghi chú"
                  labelStyle={{ fontWeight: 600 }}
                >
                  {orderData.note}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Shipping Information */}
        <Col xs={24} lg={12}>
          <Card
            title="Thông tin giao hàng"
            bordered={false}
            style={{ height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label="Người nhận"
                labelStyle={{ fontWeight: 600 }}
              >
                <Text strong>{user.username}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label="Địa chỉ giao hàng"
                labelStyle={{ fontWeight: 600 }}
              >
                <Text>{orderData.address}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label="Dự kiến giao hàng"
                labelStyle={{ fontWeight: 600 }}
              >
                <Text type="secondary">3-5 ngày làm việc</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Order Items */}
      <Card
        title={`Chi tiết đơn hàng (${orderData.orderItems.length} sản phẩm)`}
        style={{ marginTop: 24 }}
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={orderData.orderItems}
          rowKey="id"
          pagination={false}
          size="middle"
        />

        <Divider />

        <Row justify="end">
          <Col xs={24} sm={12} md={8}>
            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: 8 }}>
                <Text>Tạm tính: </Text>
                <Text strong>
                  {formatCurrency(
                    orderData.orderItems.reduce((sum, item) => {
                      const actualPrice =
                        item.discountPercentage > 0
                          ? item.priceAfterDiscount
                          : item.price;
                      return sum + actualPrice * item.quantity;
                    }, 0)
                  )}
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>Phí vận chuyển: </Text>
                <Text strong>{formatCurrency(orderData.shippingFee)}</Text>
              </div>
              
              {discountAmount > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <Text>Giảm giá: </Text>
                  <Text strong style={{ color: "#52c41a" }}>
                    -{formatCurrency(discountAmount)}
                  </Text>
                </div>
              )}
              <Divider style={{ margin: "12px 0" }} />
              <div>
                <Text style={{ fontSize: 18 }}>Tổng cộng: </Text>
                <Text strong style={{ fontSize: 20, color: "#f5222d" }}>
                  {formatCurrency(orderData.totalAmount)}
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Additional Information */}
      <Card
        title="Thông tin quan trọng"
        style={{ marginTop: 24 }}
        bordered={false}
      >
        <div style={{ lineHeight: 1.8 }}>
          <Text>
            • Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn
            trong vòng 24h để xác nhận đơn hàng.
            <br />
            • Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của
            tôi".
            <br />
            • Với phương thức thanh toán COD, bạn chỉ cần thanh toán khi nhận
            được hàng.
            <br />• Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ hotline:
            1900-xxxx hoặc email: support@example.com
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default OrderResultPage;
