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
  Input,
  Row,
  Col,
  Divider,
  Drawer,
  Select,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllReturnOrdersAPI,
  updateReturnOrderStatusAPI,
} from "../../service/returnOrder.service";
import "../../styles/AdminResponsive.css";
import "../../styles/ReturnOrder.css";
import "../../styles/Dashboard.css";
import { refundOrderAPI } from "../../service/order.service";

const { Title, Text } = Typography;
const { Option } = Select;

const ReturnOrderList = () => {
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [returnOrders, setReturnOrders] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchReturnOrders();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      },
      APPROVED: {
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        text: "Đã duyệt",
      },
      REJECTED: {
        color: "#ff4d4f",
        icon: <CloseCircleOutlined />,
        text: "Từ chối",
      },
      COMPLETED: {
        color: "#1890ff",
        icon: <CheckCircleOutlined />,
        text: "Hoàn thành",
      },
    };
    return configs[status] || { color: "default", icon: null, text: status };
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statCards = [
    {
      title: "Tổng yêu cầu",
      value: stats.total,
      icon: <FileTextOutlined />,
      gradient: "dashboard-gradient-blue",
    },
    {
      title: "Chờ xử lý",
      value: stats.pending,
      icon: <ClockCircleOutlined />,
      gradient: "dashboard-gradient-purple",
    },
    {
      title: "Đã duyệt",
      value: stats.approved,
      icon: <CheckCircleOutlined />,
      gradient: "dashboard-gradient-green",
    },
    {
      title: "Tổng tiền hoàn",
      value: formatCurrency(stats.totalRefund),
      icon: <DollarOutlined />,
      gradient: "dashboard-gradient-pink",
    },
  ];

  const showDetailModal = (record) => {
    setSelectedReturn(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedReturn(null);
    setIsModalVisible(false);
  };

  const handleUpdateStatus = async (returnOrder, status) => {
    try {
      await updateReturnOrderStatusAPI(returnOrder.id, status);
      if (status === "COMPLETED") {
        if (returnOrder.order.paymentMethod === "BANKING" && returnOrder.order.paymentRef) {
          const refundRes = await refundOrderAPI(returnOrder.order.paymentRef, "02");
          console.log("Refund Response:", refundRes);
          if (refundRes.status === "success") {
            console.log("Yêu cầu hoàn tiền đã được gửi thành công");
          } else {
            console.error("Yêu cầu hoàn tiền thất bại:", refundRes.message);
          }
        }
      }
      fetchReturnOrders();
      handleModalClose();
    } catch (error) {
      console.error("Error updating return order status:", error);
    }
  };

  const filteredReturnOrders = returnOrders.filter((item) => {
    const matchesSearch = item.order.orderCode
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: ["order", "orderCode"],
      key: "orderCode",
      render: (text) => (
        <Text strong copyable className="return-order-code">
          {text}
        </Text>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: ["order", "orderItems"],
      key: "products",
      render: (items) => (
        <Space direction="vertical" size={8}>
          {items.slice(0, 2).map((item, index) => (
            <Space key={index} size={12}>
              <Image
                src={item.productImage}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 6 }}
              />
              <div>
                <Text strong style={{ display: "block" }}>
                  {item.productName}
                </Text>
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
      ellipsis: true,
    },
    {
      title: "Số tiền hoàn",
      dataIndex: "refundAmount",
      key: "refundAmount",
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
      render: (date) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showDetailModal(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const renderFilterContent = (isDrawer = false) => (
    <Row
      gutter={[16, 16]}
      align="middle"
      className={`return-filter-row ${
        isDrawer ? "return-filter-row--drawer" : ""
      }`}
    >
      <Col xs={24} sm={12}>
        <Input
          placeholder="Tìm kiếm mã đơn hàng..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="return-filter-input"
        />
      </Col>
      <Col xs={24} sm={12}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: "100%" }}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="PENDING">Chờ xử lý</Option>
          <Option value="APPROVED">Đã duyệt</Option>
          <Option value="COMPLETED">Hoàn thành</Option>
          <Option value="REJECTED">Từ chối</Option>
        </Select>
      </Col>
      {isDrawer && (
        <Col span={24}>
          <div className="return-filter-actions">
            <Button
              type="primary"
              className="return-filter-action-btn"
              onClick={() => setFilterDrawerVisible(false)}
            >
              Áp dụng
            </Button>
            <Button
              className="return-filter-action-btn"
              onClick={() => {
                setSearchText("");
                setStatusFilter("all");
                setFilterDrawerVisible(false);
              }}
            >
              Đặt lại
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );

  const renderMobileCards = () => (
    <div className="return-mobile-list">
      {filteredReturnOrders.length === 0 && (
        <div className="return-empty-state">
          <Text>Không có yêu cầu nào khớp điều kiện.</Text>
        </div>
      )}
      {filteredReturnOrders.map((record) => {
        const config = getStatusConfig(record.status);
        return (
          <Card
            key={record.id}
            className="return-mobile-card"
            bordered={false}
            bodyStyle={{ padding: 16 }}
          >
            <div className="return-mobile-card__header">
              <span className="return-mobile-id">
                #{record.order.orderCode}
              </span>
              <Tag color={config.color} icon={config.icon}>
                {config.text}
              </Tag>
            </div>
            <div className="return-mobile-card__meta">
              <div>
                <Text type="secondary">Số tiền hoàn</Text>
                <div className="return-mobile-amount">
                  {formatCurrency(record.refundAmount)}
                </div>
              </div>
              <div>
                <Text type="secondary">Ngày yêu cầu</Text>
                <div className="return-mobile-date">
                  {formatDate(record.requestDate)}
                </div>
              </div>
            </div>
            <div className="return-mobile-card__reason">
              <Text type="secondary">{record.reason}</Text>
            </div>
            <div className="return-mobile-card__footer">
              <Text type="secondary">
                {record.order.orderItems.length} sản phẩm
              </Text>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => showDetailModal(record)}
              >
                Chi tiết
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="return-page-container">
      <div className="return-content">
        <div className="return-panel">
          <div className="return-header">
            <Title level={isMobile ? 3 : 2} className="return-title">
              🔄 Quản lý yêu cầu trả hàng
            </Title>
            <Text className="return-subtitle">
              Theo dõi và xử lý các yêu cầu hoàn trả từ khách hàng
            </Text>
          </div>

          <Row
            gutter={[16, 16]}
            className="return-stat-grid"
            style={{ marginBottom: 24 }}
          >
            {statCards.map((stat, index) => (
              <Col xs={12} sm={12} md={12} lg={6} key={index}>
                <Card className="return-card return-stat-card" bordered={false}>
                  <div className="return-stat-card-content">
                    <Text className="return-stat-label">{stat.title}</Text>
                    <div className="return-stat-info">
                      <div className="return-stat-value">{stat.value}</div>
                      <div className={`return-stat-icon ${stat.gradient}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="return-card return-filter-card">
            {isMobile ? (
              <>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  block
                  size="large"
                  className="return-mobile-filter-btn"
                  onClick={() => setFilterDrawerVisible(true)}
                >
                  Bộ lọc nâng cao
                </Button>
                <Drawer
                  title="Bộ lọc yêu cầu"
                  placement="bottom"
                  open={filterDrawerVisible}
                  onClose={() => setFilterDrawerVisible(false)}
                  height="auto"
                  className="return-filter-drawer"
                >
                  {renderFilterContent(true)}
                </Drawer>
              </>
            ) : (
              renderFilterContent(false)
            )}
          </Card>

          <Card className="return-card return-table-card">
            {isMobile ? (
              renderMobileCards()
            ) : (
              <div className="return-table-wrapper">
                <Table
                  columns={columns}
                  dataSource={filteredReturnOrders}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} yêu cầu`,
                  }}
                  size="middle"
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        title="Chi tiết yêu cầu trả hàng"
        open={isModalVisible}
        onCancel={handleModalClose}
        className="return-modal return-detail-modal-responsive"
        width={isMobile ? "95%" : 900}
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
                  onClick={() => handleUpdateStatus(selectedReturn, "REJECTED")}
                >
                  Từ chối
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleUpdateStatus(selectedReturn, "APPROVED")}
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
                  onClick={() => handleUpdateStatus(selectedReturn, "REJECTED")}
                >
                  Từ chối
                </Button>,
                <Button
                  key="complete"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() =>
                    handleUpdateStatus(selectedReturn, "COMPLETED")
                  }
                >
                  Hoàn tất hoàn trả
                </Button>,
              ];
            default:
              return [
                <Button key="close" onClick={handleModalClose}>
                  Đóng
                </Button>,
              ];
          }
        }}
      >
        {selectedReturn && (
          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%" }}
            className="return-modal-body"
          >
            <Card title="Thông tin đơn hàng" size="small">
              <Descriptions
                column={isMobile ? 1 : 2}
                bordered
                size="small"
                className="return-detail-descriptions"
                labelStyle={{
                  width: isMobile ? "35%" : "auto",
                  whiteSpace: "normal",
                  fontWeight: 600,
                }}
              >
                <Descriptions.Item label="Mã đơn hàng" span={2}>
                  <Text strong copyable>
                    {selectedReturn.order.orderCode}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                  {formatDate(selectedReturn.order.createdAt)}
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

            <Card
              title="Sản phẩm trả hàng"
              size="small"
              className="return-product-card"
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="small"
              >
                {selectedReturn.order.orderItems.map((item) => (
                  <Card
                    key={item.id}
                    size="small"
                    style={{ marginBottom: "8px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                      <div style={{ marginLeft: "16px", flex: 1 }}>
                        <h4 style={{ margin: 0, marginBottom: "4px" }}>
                          {item.productName}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            color: "#8c8c8c",
                            fontSize: "13px",
                          }}
                        >
                          Số lượng: {item.quantity}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            color: "#52c41a",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          Đơn giá: {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ color: "#ff4d4f", fontSize: "16px" }}>
                          {formatCurrency(item.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                  </Card>
                ))}
              </Space>
            </Card>

            <Card title="Thông tin trả hàng" size="small">
              <Descriptions
                column={isMobile ? 1 : 2}
                bordered
                size="small"
                className="return-detail-descriptions"
                labelStyle={{
                  width: isMobile ? "35%" : "auto",
                  whiteSpace: "normal",
                  fontWeight: 600,
                }}
              >
                <Descriptions.Item label="Lý do">
                  {selectedReturn.reason}
                </Descriptions.Item>
                {selectedReturn.note && (
                  <Descriptions.Item label="Ghi chú khách hàng">
                    {selectedReturn.note}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Ngày yêu cầu">
                  {formatDate(selectedReturn.requestDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền hoàn">
                  <Text strong style={{ color: "#ff4d4f" }}>
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
                          width={120}
                          height={120}
                          style={{ objectFit: "cover", borderRadius: 6 }}
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
