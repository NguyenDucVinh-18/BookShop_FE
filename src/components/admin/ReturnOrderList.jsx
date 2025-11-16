import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Image,
  Typography,
  Card,
  Descriptions,
  Badge,
  Tooltip,
  Input,
  Statistic,
  Row,
  Col,
  Divider,
  Avatar,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ShoppingOutlined,
  DollarOutlined,
  FileTextOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  getAllReturnOrdersAPI,
  updateReturnOrderStatusAPI,
} from "../../service/returnOrder.service";
import "../../styles/AdminResponsive.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ReturnOrderList = () => {
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [returnOrders, setReturnOrders] = useState([]);

  const fetchReturnOrders = async () => {
    try {
      const res = await getAllReturnOrdersAPI();
      if (res && res.data) {
        setReturnOrders(res.data.returnOrders);
      }
    } catch (error) {
      console.error("Error fetching return orders:", error);
    }
  };

  useEffect(() => {
    fetchReturnOrders();
  }, []);

  const stats = {
    total: returnOrders.length,
    pending: returnOrders.filter((r) => r.status === "PENDING").length,
    approved: returnOrders.filter((r) => r.status === "APPROVED").length,
    rejected: returnOrders.filter((r) => r.status === "REJECTED").length,
    totalRefund: returnOrders.reduce((sum, r) => sum + r.refundAmount, 0),
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: "#fa8c16",
        icon: <ClockCircleOutlined />,
        text: "Chờ xử lý",
        bgColor: "#fff7e6",
      },
      APPROVED: {
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        text: "Đã duyệt",
        bgColor: "#f6ffed",
      },
      REJECTED: {
        color: "#ff4d4f",
        icon: <CloseCircleOutlined />,
        text: "Từ chối",
        bgColor: "#fff1f0",
      },
      COMPLETED: {
        color: "#1890ff",
        icon: <CheckCircleOutlined />,
        text: "Hoàn thành",
        bgColor: "#e6f7ff",
      },
    };
    return (
      configs[status] || {
        color: "default",
        icon: null,
        text: status,
        bgColor: "#fafafa",
      }
    );
  };

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

  const showDetailModal = (record) => {
    setSelectedReturn(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReturn(null);
  };

  const handleUpdateStatus = async (returnOrderId, status) => {
    try {
      await updateReturnOrderStatusAPI(returnOrderId, status);
      fetchReturnOrders();
      handleModalClose();
    } catch (error) {
      console.error("Error updating return order status:", error);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: ["order", "orderCode"],
      key: "orderCode",
      width: 180,
      fixed: "left",
      render: (text) => (
        <Text strong copyable style={{ whiteSpace: "nowrap" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: ["order", "orderItems"],
      key: "products",
      width: 320,
      render: (items) => (
        <Space direction="vertical" size={8}>
          {items.slice(0, 2).map((item, index) => (
            <Space key={index} size={12}>
              <Image
                src={item.productImage}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <div>
                <div>
                  <Text
                    strong
                    ellipsis
                    style={{ maxWidth: 200, display: "block" }}
                  >
                    {item.productName}
                  </Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  SL: {item.quantity} × {formatCurrency(item.price)}
                </Text>
              </div>
            </Space>
          ))}
          {items.length > 2 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              +{items.length - 2} sản phẩm khác
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Số tiền hoàn",
      dataIndex: "refundAmount",
      key: "refundAmount",
      width: 130,
      align: "right",
      render: (amount) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestDate",
      key: "requestDate",
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showDetailModal(record)}
          style={{ borderRadius: 6 }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-responsive-container" style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Card
          className="admin-card-responsive"
          style={{
            marginBottom: 24,
            borderRadius: 8,
          }}
        >
          <div className="return-order-header-responsive">
            <div>
              <Title level={3} className="admin-title-mobile" style={{ margin: 0, marginBottom: 4 }}>
                Quản lý yêu cầu trả hàng
              </Title>
              <Text type="secondary" className="admin-subtitle-mobile">
                Theo dõi và xử lý các yêu cầu trả hàng
              </Text>
            </div>
            <Space size="large" className="return-order-stats-responsive">
              <Statistic
                title="Chờ xử lý"
                value={stats.pending}
                prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
                valueStyle={{ color: "#fa8c16", fontSize: 24 }}
              />
              <Statistic
                title="Tổng tiền hoàn"
                value={stats.totalRefund}
                formatter={(value) => formatCurrency(value).replace("₫", "")}
                suffix="₫"
                valueStyle={{ color: "#ff4d4f", fontSize: 24 }}
              />
            </Space>
          </div>
        </Card>

        <Card className="admin-card-responsive" style={{ borderRadius: 8 }}>
          <div className="return-order-list-header-responsive">
            <Title level={5} className="admin-title-mobile" style={{ margin: 0 }}>
              Danh sách yêu cầu
            </Title>
            <Space className="return-order-search-responsive">
              <Input
                placeholder="Tìm kiếm mã đơn hàng..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="return-order-search-input"
                allowClear
              />
              <Button icon={<FilterOutlined />}>Lọc</Button>
            </Space>
          </div>

          <div className="admin-table-wrapper">
            <Table
              columns={columns}
              dataSource={returnOrders}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} yêu cầu`,
              }}
              scroll={{ x: "max-content" }}
              size="middle"
            />
          </div>
        </Card>
      </div>

      <Modal
        title="Chi tiết yêu cầu trả hàng"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={() => {
          if (!selectedReturn) return null;

          switch (selectedReturn.status) {
            case "PENDING":
              return [
                <Button key="close" onClick={handleModalClose}>
                  Đóng
                </Button>,
                <Button
                  key="reject"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() =>
                    handleUpdateStatus(selectedReturn.id, "REJECTED")
                  }
                >
                  Từ chối
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() =>
                    handleUpdateStatus(selectedReturn.id, "APPROVED")
                  }
                >
                  Duyệt yêu cầu
                </Button>,
              ];

            case "APPROVED":
              return [
                <Button key="close" onClick={handleModalClose}>
                  Đóng
                </Button>,
                <Button
                  key="reject"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() =>
                    handleUpdateStatus(selectedReturn.id, "REJECTED")
                  }
                >
                  Từ chối
                </Button>,
                <Button
                  key="complete"
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() =>
                    handleUpdateStatus(selectedReturn.id, "COMPLETED")
                  }
                >
                  Hoàn tất hoàn trả
                </Button>,
              ];

            case "REJECTED":
            case "COMPLETED":
            default:
              return [
                <Button key="close" onClick={handleModalClose}>
                  Đóng
                </Button>,
              ];
          }
        }}
        width={900}
      >
        {selectedReturn && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Card title="Thông tin đơn hàng" size="small">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Mã đơn hàng" span={2}>
                  <Text strong copyable>
                    {selectedReturn.order.orderCode}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                  {formatDate(selectedReturn.order.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color="green">Đã giao</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  <Text strong style={{ color: "#1890ff" }}>
                    {formatCurrency(selectedReturn.order.totalAmount)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Thanh toán">
                  <Tag>{selectedReturn.order.paymentMethod}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedReturn.order.address}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" span={2}>
                  <Text copyable>{selectedReturn.order.phone}</Text>
                </Descriptions.Item>
                {selectedReturn.order.note && (
                  <Descriptions.Item label="Ghi chú" span={2}>
                    {selectedReturn.order.note}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Card title="Sản phẩm trả hàng" size="small">
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="small"
              >
                {selectedReturn.order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: 12,
                      border: "1px solid #f0f0f0",
                      borderRadius: 4,
                    }}
                  >
                    <Image
                      src={item.productImage}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                    <div style={{ flex: 1 }}>
                      <Text strong>{item.productName}</Text>
                      <div style={{ marginTop: 8 }}>
                        <Space split={<Divider type="vertical" />}>
                          <Text type="secondary">SL: {item.quantity}</Text>
                          <Text>Đơn giá: {formatCurrency(item.price)}</Text>
                          <Text strong style={{ color: "#ff4d4f" }}>
                            Tổng: {formatCurrency(item.price * item.quantity)}
                          </Text>
                        </Space>
                      </div>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>

            <Card title="Thông tin trả hàng" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Lý do">
                  {selectedReturn.reason}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú khách hàng">
                  {selectedReturn.note}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày yêu cầu">
                  {formatDate(selectedReturn.requestDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền hoàn">
                  <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                    {formatCurrency(selectedReturn.refundAmount)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {(() => {
                    const config = getStatusConfig(selectedReturn.status);
                    return (
                      <Tag color={config.color} icon={config.icon}>
                        {config.text}
                      </Tag>
                    );
                  })()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedReturn.mediaUrls &&
              selectedReturn.mediaUrls.length > 0 && (
                <Card title="Hình ảnh đính kèm" size="small">
                  <Image.PreviewGroup>
                    <Space wrap>
                      {selectedReturn.mediaUrls.map((url, index) => (
                        <Image
                          key={index}
                          src={url}
                          width={150}
                          height={150}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      ))}
                    </Space>
                  </Image.PreviewGroup>
                </Card>
              )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default ReturnOrderList;
