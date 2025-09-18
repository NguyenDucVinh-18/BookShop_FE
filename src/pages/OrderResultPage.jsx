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
import { useLocation } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";

const { Title, Text } = Typography;

const OrderResultPage = () => {
  const location = useLocation();
  const orderData = location.state?.orderData || [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
    const { user } = useContext(AuthContext);
  

  console.log("Order Data from state:", orderData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    // const orderIdParam = urlParams.get('orderId');

    setOrderStatus(status === "true");
    // setOrderId(orderIdParam);

    // If orderData is passed as prop, use it directly
    // if (propOrderData) {
    //   setOrderData(propOrderData);
    //   setLoading(false);
    //   return;
    // }

    // If we have orderId from URL, fetch order data
    // if (orderIdParam) {
    //   fetchOrderData(orderIdParam);
    // } else {
    //   setError('Không tìm thấy thông tin đơn hàng');
    //   setLoading(false);
    // }
  }, []);

  console.log("Order Status:", orderStatus);

  // Mock API call to fetch order data
  //   const fetchOrderData = async (orderIdParam) => {
  //     setLoading(true);
  //     try {
  //       // Simulate API call - Replace this with your actual API call
  //       await new Promise(resolve => setTimeout(resolve, 1000));

  //       // Mock response based on orderId
  //       const mockData = {
  //         ...mockOrderData,
  //         orderId: parseInt(orderIdParam) || mockOrderData.orderId
  //       };

  //       setOrderData(mockData);
  //       setError(null);
  //     } catch (err) {
  //       setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.');
  //       setOrderData(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

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

  const handleRetry = () => {
    if (orderId) {
      fetchOrderData(orderId);
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(
      `${orderData.orderId}`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    // Navigate to products page - replace with your navigation logic
    console.log("Continue shopping");
  };

  const handleGoHome = () => {
    // Navigate to home page - replace with your navigation logic
    console.log("Go to home");
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
      render: (price) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatCurrency(price)}
        </Text>
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
      render: (_, record) => (
        <Text strong style={{ color: "#f5222d", fontSize: 16 }}>
          {formatCurrency(record.price * record.quantity)}
        </Text>
      ),
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
  if (error || orderStatus === false) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
        <Result
          icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
          status="error"
          title={
            <div>
              <Title level={2} style={{ color: "#ff4d4f", margin: 0 }}>
                {orderStatus === false
                  ? "Đặt hàng thất bại!"
                  : "Có lỗi xảy ra!"}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {error ||
                  "Đã có lỗi xảy ra trong quá trình xử lý đơn hàng của bạn"}
              </Text>
            </div>
          }
          extra={
            <Space size="middle">
              {orderId && (
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={handleRetry}
                >
                  Thử lại
                </Button>
              )}
              <Button
                icon={<HomeOutlined />}
                size="large"
                onClick={handleGoHome}
              >
                Về trang chủ
              </Button>
              <Button
                icon={<ShoppingOutlined />}
                size="large"
                onClick={handleContinueShopping}
              >
                Tiếp tục mua hàng
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
              <Button onClick={handleContinueShopping}>
                Tiếp tục mua hàng
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  // Success state
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
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
              icon={<ShoppingOutlined />}
              size="large"
              onClick={handleContinueShopping}
            >
              Tiếp tục mua hàng
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
                   {orderData.orderId}
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
                  {getStatusText(orderData.orderStatus)}
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
                <Text>{orderData.shippingAddress}</Text>
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
                    orderData.orderItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>Phí vận chuyển: </Text>
                <Text strong>Miễn phí</Text>
              </div>
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
