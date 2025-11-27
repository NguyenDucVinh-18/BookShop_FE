import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Image,
  Card,
  Space,
  Select,
  DatePicker,
  Input,
  Row,
  Col,
  Tooltip,
  Badge,
  message,
  Divider,
  Typography,
  Drawer,
} from "antd";
import {
  EyeOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CarOutlined,
} from "@ant-design/icons";
import {
  getAllOrdersAPI,
  updateOrderStatusAPI,
  getOrderBetweenDatesAPI,
} from "../../service/order.service";
import "../../styles/OrderManagement.css";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const createDefaultFilters = () => ({
  status: "all",
  paymentMethod: "all",
  dateRange: null,
  searchText: "",
});

const CommonOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(createDefaultFilters);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPickerContainer = (trigger) => {
    const drawerBody = document.querySelector(
      ".order-filter-drawer .ant-drawer-body"
    );
    if (drawerBody && drawerBody.contains(trigger)) {
      return drawerBody;
    }
    return document.body;
  };


  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let res;
      if (filters.dateRange && filters.dateRange.length === 2) {
        const startDate = filters.dateRange[0].format('YYYY-MM-DD');
        const endDate = filters.dateRange[1].format('YYYY-MM-DD');
        res = await getOrderBetweenDatesAPI(startDate, endDate);
      } else {
        res = await getAllOrdersAPI();
      }
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters.dateRange]);

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "orange",
      UNPAID: "warning",
      CANCELED: "error",
      DELIVERED: "success",
      PROCESSING: "processing",
      SHIPPING: "cyan",
      REFUNDED: "purple",
      REFUND_REQUESTED: "geekblue",
      REFUNDING: "blue",
      REFUND_REJECTED: "red",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: "Chờ xác nhận",
      UNPAID: "Chưa thanh toán",
      CANCELED: "Đã hủy",
      REFUNDED: "Đã hoàn trả",
      DELIVERED: "Hoàn thành",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao hàng",
      REFUND_REQUESTED: "Yêu cầu hoàn trả",
      REFUNDING: "Đang hoàn trả",
      REFUND_REJECTED: "Từ chối hoàn trả",
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      COD: "Thanh toán khi nhận hàng",
      BANKING: "Chuyển khoản ngân hàng",
      CARD: "Thẻ tín dụng",
    };
    return methods[method] || method;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.paymentMethod !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentMethod === filters.paymentMethod
      );
    }

    if (filters.searchText) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(filters.searchText) ||
          order.phone.includes(filters.searchText) ||
          order.address
            .toLowerCase()
            .includes(filters.searchText.toLowerCase()) ||
          order.orderItems.some((item) =>
            item.productName
              .toLowerCase()
              .includes(filters.searchText.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const showEditStatus = (order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setIsEditModalVisible(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateOrderStatusAPI(id, status);
      if (res && res.data) {
        const updatedOrders = orders.map((order) =>
          order.id === id ? { ...order, status: status } : order
        );

        setOrders(updatedOrders);

        const updatedFilteredOrders = filteredOrders.map((order) =>
          order.id === id ? { ...order, status: status } : order
        );
        setFilteredOrders(updatedFilteredOrders);

        showNotification(
          "success",
          `Cập nhật trạng thái đơn hàng #${id} thành công`
        );
        setIsEditModalVisible(false);
        setEditingOrder(null);
        setNewStatus(null);

        fetchOrders();
      } else {
        showNotification(
          "error",
          res.message || "Cập nhật trạng thái thất bại"
        );
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
      console.error("Error updating order status:", error);
    }
  };

  const getOrderStats = () => {
    const stats = orders.reduce(
      (acc, order) => {
        acc.total += order.totalAmount;
        acc.count++;
        acc.byStatus[order.status] = (acc.byStatus[order.status] || 0) + 1;
        return acc;
      },
      { total: 0, count: 0, byStatus: {} }
    );

    return stats;
  };

  const stats = getOrderStats();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      fixed: 'left',
      render: (id) => (
        <Badge count={id} style={{ backgroundColor: "#1890ff" }} />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: "Chờ xác nhận", value: "PENDING" },
        { text: "Đang xử lý", value: "PROCESSING" },
        { text: "Đang giao hàng", value: "SHIPPING" },
        { text: "Hoàn thành", value: "DELIVERED" },
        { text: "Chưa thanh toán", value: "UNPAID" },
        { text: "Đã hủy", value: "CANCELED" },
        { text: "Đã hoàn trả", value: "REFUNDED" },
        { text: "Yêu cầu hoàn trả", value: "REFUND_REQUESTED" },
        { text: "Đang hoàn trả", value: "REFUNDING" },
        { text: "Từ chối hoàn trả", value: "REFUND_REJECTED" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 140,
      render: (amount) => (
        <strong style={{ color: "#52c41a", whiteSpace: "nowrap" }}>{formatCurrency(amount)}</strong>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 150,
      render: (method) => (
        <Tag color={method === "COD" ? "orange" : "blue"}>
          {getPaymentMethodText(method)}
        </Tag>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "orderItems",
      key: "orderItems",
      width: 250,
      render: (items) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 6, fontWeight: 500, color: '#666', fontSize: '13px' }}>
            {items.length} sản phẩm
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {items.slice(0, 2).map((item, index) => (
              <Tooltip key={index} title={`${item.productName} x${item.quantity}`} placement="topLeft">
                <div style={{ 
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <Tag 
                    size="small" 
                    style={{ 
                      margin: 0,
                      display: 'inline-block',
                      maxWidth: '220px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}
                  >
                    {item.productName.length > 30 
                      ? `${item.productName.substring(0, 30)}...` 
                      : item.productName} x{item.quantity}
                  </Tag>
                </div>
              </Tooltip>
            ))}
            {items.length > 2 && (
              <Tooltip title={items.slice(2).map(item => `${item.productName} x${item.quantity}`).join('\n')}>
                <Tag size="small" style={{ margin: 0, color: '#1890ff', borderColor: '#1890ff', cursor: 'pointer' }}>
                  +{items.length - 2} sản phẩm
                </Tag>
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date) => <div style={{ whiteSpace: "nowrap" }}>{formatDate(date)}</div>,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Hành động",
      key: "action",
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => showOrderDetail(record)}
              size="small"
            >
              Chi tiết
            </Button>
          </Tooltip>
          {record.status === "PENDING" && (
            <Tooltip title="Xác nhận đơn hàng">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleStatusChange(record.id, "PROCESSING")}
                size="small"
              >
                Xác nhận
              </Button>
            </Tooltip>
          )}

          {record.status === "PROCESSING" && (
            <Tooltip title="Bắt đầu giao hàng">
              <Button
                type="default"
                icon={<CarOutlined />}
                onClick={() => handleStatusChange(record.id, "SHIPPING")}
                size="small"
                style={{ color: "#1890ff", borderColor: "#1890ff" }}
              >
                Giao hàng
              </Button>
            </Tooltip>
          )}

          {record.status === "SHIPPING" && (
            <Tooltip title="Xác nhận giao thành công">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(record.id, "DELIVERED")}
                size="small"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Hoàn tất
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleResetFilters = () => {
    setFilters(createDefaultFilters());
  };

  const handleCloseDrawer = () => {
    setFilterDrawerVisible(false);
  };

  const renderFilterContent = (isDrawer = false) => (
    <Row
      gutter={[16, 16]}
      align="middle"
      className={`order-filter-row ${isDrawer ? "order-filter-row--drawer" : ""}`}
    >
      <Col xs={24} sm={12} md={6} lg={5} className="full-width-mobile">
        <Select
          placeholder="Trạng thái"
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          style={{ width: "100%" }}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="PENDING">Chờ xác nhận</Option>
          <Option value="PROCESSING">Đang xử lý</Option>
          <Option value="SHIPPING">Đang giao hàng</Option>
          <Option value="DELIVERED">Hoàn thành</Option>
          <Option value="UNPAID">Chưa thanh toán</Option>
          <Option value="CANCELED">Đã hủy</Option>
          <Option value="REFUNDED">Đã hoàn trả</Option>
          <Option value="REFUND_REQUESTED">Yêu cầu hoàn trả</Option>
          <Option value="REFUNDING">Đang hoàn trả</Option>
          <Option value="REFUND_REJECTED">Từ chối hoàn trả</Option>
        </Select>
      </Col>

      <Col xs={24} sm={12} md={6} lg={5} className="full-width-mobile">
        <Select
          placeholder="Thanh toán"
          value={filters.paymentMethod}
          onChange={(value) => handleFilterChange("paymentMethod", value)}
          style={{ width: "100%" }}
        >
          <Option value="all">Tất cả</Option>
          <Option value="COD">COD</Option>
          <Option value="BANKING">Banking</Option>
        </Select>
      </Col>

      <Col xs={24} sm={24} md={12} lg={7} className="full-width-mobile">
        <RangePicker
          placeholder={["Từ ngày", "Đến ngày"]}
          value={filters.dateRange}
          onChange={(dates) => handleFilterChange("dateRange", dates)}
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          getPopupContainer={getPickerContainer}
          allowClear
          showToday
          disabledDate={() => false}
        />
      </Col>

      {!isDrawer && (
        <Col xs={24} sm={12} md={6} lg={2} className="full-width-mobile">
          <Button icon={<FilterOutlined />} style={{ width: "100%" }}>
            <span className="hide-mobile">
              Bộ lọc ({filteredOrders.length}/{orders.length})
            </span>
            <span className="show-mobile">
              Lọc ({filteredOrders.length}/{orders.length})
            </span>
          </Button>
        </Col>
      )}

      {isDrawer && (
        <Col span={24}>
          <div className="order-filter-actions">
            <Button
              type="primary"
              className="order-filter-action-btn"
              onClick={handleCloseDrawer}
            >
              Áp dụng
            </Button>
            <Button
              className="order-filter-action-btn"
              onClick={() => {
                handleResetFilters();
                handleCloseDrawer();
              }}
            >
              Đặt lại
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );

  const statCards = [
    {
      title: "Tổng đơn hàng",
      value: stats.count || 0,
      icon: <ShoppingCartOutlined />,
      gradient: "dashboard-gradient-blue",
    },
    {
      title: "Đang chờ xác nhận",
      value: stats.byStatus.PENDING || 0,
      icon: <ExclamationCircleOutlined />,
      gradient: "dashboard-gradient-purple",
    },
    {
      title: "Đang xử lý",
      value: stats.byStatus.PROCESSING || 0,
      icon: <CheckCircleOutlined />,
      gradient: "dashboard-gradient-green",
    },
    {
      title: "Đang giao hàng",
      value: stats.byStatus.SHIPPING || 0,
      icon: <CarOutlined />,
      gradient: "dashboard-gradient-pink",
    },
  ];

  return (
    <div className="order-page-container">
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "12px",
            color: "white",
            fontWeight: "500",
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            backdropFilter: "blur(8px)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                  ? "#ff4d4f"
                  : "#1890ff",
            transform: notification.visible
              ? "translateX(0)"
              : "translateX(100%)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {notification.message}
        </div>
      )}
      <div className="order-content">
        <div className="order-panel">
          <div className="order-header">
            <Row justify="space-between" align="middle">
              <Col span={24}>
                <Title level={isMobile ? 3 : 2} className="order-title">
                  📦 Quản lý đơn hàng
                </Title>
                <Text className="order-subtitle">
                  Theo dõi trạng thái và xử lý đơn hàng theo thời gian thực
                </Text>
              </Col>
            </Row>
          </div>

          <Row
            gutter={[16, 16]}
            className="order-stat-grid"
            style={{ marginBottom: 24 }}
          >
            {statCards.map((stat, index) => (
              <Col xs={12} sm={12} md={12} lg={6} key={index}>
                <Card
                  className="order-card order-stat-card"
                  bordered={false}
                >
                  <div className="order-stat-content">
                    <div className="order-stat-info">
                      <Text className="order-stat-label">{stat.title}</Text>
                      <div className="order-stat-value">{stat.value}</div>
                    </div>
                    <div className={`order-stat-icon ${stat.gradient}`}>
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Card
            className="order-card order-filter-card"
            style={{ marginBottom: "24px" }}
          >
            {isMobile ? (
              <>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  block
                  size="large"
                  className="order-mobile-filter-btn"
                  onClick={() => setFilterDrawerVisible(true)}
                >
                  Lọc nâng cao
                </Button>
                <Drawer
                  title="Bộ lọc đơn hàng"
                  placement="bottom"
                  open={filterDrawerVisible}
                  onClose={handleCloseDrawer}
                  height="auto"
                  className="order-filter-drawer"
                >
                  {renderFilterContent(true)}
                </Drawer>
              </>
            ) : (
              renderFilterContent(false)
            )}
          </Card>

          <Card className="order-card order-table-card">
            {isMobile ? (
              <div className="order-mobile-list">
                {filteredOrders.length === 0 ? (
                  <div className="order-empty-state">
                    <Text>Không có đơn hàng nào khớp điều kiện.</Text>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="order-mobile-card"
                      bordered={false}
                      bodyStyle={{ padding: 16 }}
                    >
                      <div className="order-mobile-card__header">
                        <span className="order-mobile-id">#{order.id}</span>
                        <Tag color={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Tag>
                      </div>
                      <div className="order-mobile-card__meta">
                        <div>
                          <Text type="secondary">Tổng tiền</Text>
                          <div className="order-mobile-amount">
                            {formatCurrency(order.totalAmount)}
                          </div>
                        </div>
                        <div>
                          <Text type="secondary">Ngày tạo</Text>
                          <div className="order-mobile-date">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="order-mobile-card__footer">
                        <Text type="secondary">
                          {order.orderItems.length} sản phẩm ·{" "}
                          {getPaymentMethodText(order.paymentMethod)}
                        </Text>
                        <Space size={8}>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => showOrderDetail(order)}
                          >
                            Chi tiết
                          </Button>
                          {order.status === "PENDING" && (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() =>
                                handleStatusChange(order.id, "PROCESSING")
                              }
                            >
                              Xác nhận
                            </Button>
                          )}
                          {order.status === "PROCESSING" && (
                            <Button
                              type="default"
                              size="small"
                              onClick={() =>
                                handleStatusChange(order.id, "SHIPPING")
                              }
                            >
                              Giao hàng
                            </Button>
                          )}
                          {order.status === "SHIPPING" && (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() =>
                                handleStatusChange(order.id, "DELIVERED")
                              }
                            >
                              Hoàn thành
                            </Button>
                          )}
                        </Space>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="order-table-wrapper">
                <Table
                  columns={columns}
                  dataSource={filteredOrders}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn hàng`,
                  }}
                  size="middle"
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={isMobile ? "95%" : 900}
        className="order-detail-modal-responsive"
      >
        {selectedOrder && (
          <div
            className="order-detail-modal-body"
          >
            <Descriptions
              bordered
              column={isMobile ? 1 : 2}
              style={{ marginBottom: "24px" }}
              className="order-detail-descriptions"
              labelStyle={{ width: isMobile ? "35%" : "auto", whiteSpace: "normal" }}
            >
              <Descriptions.Item label="Trạng thái" className="order-detail-compact">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán" className="order-detail-payment">
                <Text>
                  {getPaymentMethodText(selectedOrder.paymentMethod)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo" className="order-detail-compact">
                {formatDate(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" className="order-detail-phone">
                <Text copyable style={{ whiteSpace: "nowrap", fontFamily: "monospace" }}>
                  {selectedOrder.phone}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2} className="order-detail-address">
                {selectedOrder.address}
              </Descriptions.Item>
              {selectedOrder.note && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedOrder.note}
                </Descriptions.Item>
              )}
              {selectedOrder.cancelReason && (
                <Descriptions.Item label="Lý do hủy" span={2}>
                  <Text type="danger">{selectedOrder.cancelReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>
              Sản phẩm đặt hàng ({selectedOrder.orderItems.length} sản phẩm):
            </h3>
            <div style={{ marginBottom: "24px" }}>
              {selectedOrder.orderItems.map((item) => (
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
                      <h4>{item.productName}</h4>
                      <p>Số lượng: {item.quantity}</p>
                      <p style={{ color: "#52c41a", fontWeight: "bold" }}>
                        Đơn giá: {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ color: "#1890ff", fontSize: "16px" }}>
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h4
                style={{
                  color: "#1890ff",
                  marginBottom: "20px",
                  fontSize: "18px",
                }}
              >
                💰 Chi tiết thanh toán
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: "15px" }}>
                    Tạm tính ({selectedOrder.orderItems.length} sản phẩm)
                  </Text>
                  <Text style={{ fontSize: "15px", fontWeight: 500 }}>
                    {selectedOrder.orderItems
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toLocaleString("vi-VN")}{" "}
                    ₫
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: "15px" }}>Phí vận chuyển</Text>
                  <Text
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#52c41a",
                    }}
                  >
                    {selectedOrder.shippingFee
                      ? `${selectedOrder.shippingFee.toLocaleString("vi-VN")} ₫`
                      : "Miễn phí"}
                  </Text>
                </div>

                {selectedOrder.discountPercent > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Text style={{ fontSize: "15px" }}>Giảm giá</Text>
                      {selectedOrder.promotion && (
                        <Tag color="red" style={{ margin: 0 }}>
                          {selectedOrder.promotion.code}
                        </Tag>
                      )}
                      <Tag color="volcano" style={{ margin: 0 }}>
                        -{selectedOrder.discountPercent}%
                      </Tag>
                    </div>
                    <Text
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#ff4d4f",
                      }}
                    >
                      -
                      {(
                        (selectedOrder.orderItems.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        ) *
                          selectedOrder.discountPercent) /
                        100
                      ).toLocaleString("vi-VN")}{" "}
                      ₫
                    </Text>
                  </div>
                )}

                <Divider style={{ margin: "8px 0" }} />

                <div className="order-detail-total">
                  <span>Tổng thanh toán</span>
                  <strong>
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={`Chỉnh sửa trạng thái đơn hàng #${editingOrder?.id}`}
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingOrder(null);
        }}
        footer={null}
        width={500}
      >
        {editingOrder && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p>
                <strong>Đơn hàng:</strong> #{editingOrder.id}
              </p>
              <p>
                <strong>Khách hàng:</strong> {editingOrder.phone}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {formatCurrency(editingOrder.totalAmount)}
              </p>
              <p>
                <strong>Trạng thái hiện tại:</strong>
                <Tag
                  color={getStatusColor(editingOrder.status)}
                  style={{ marginLeft: "8px" }}
                >
                  {getStatusText(editingOrder.status)}
                </Tag>
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label>
                <strong>Chọn trạng thái mới:</strong>
              </label>
              <Select
                style={{ width: "100%", marginTop: "8px" }}
                placeholder="Chọn trạng thái mới"
                value={newStatus}
                onChange={setNewStatus}
              >
                <Option value="PENDING">
                  <Tag color={getStatusColor("PENDING")}>Chờ xác nhận</Tag>
                </Option>
                <Option value="PROCESSING">
                  <Tag color={getStatusColor("PROCESSING")}>Đang xử lý</Tag>
                </Option>
                <Option value="SHIPPING">
                  <Tag color={getStatusColor("SHIPPING")}>Đang giao hàng</Tag>
                </Option>
                <Option value="DELIVERED">
                  <Tag color={getStatusColor("DELIVERED")}>Hoàn thành</Tag>
                </Option>
              </Select>
            </div>

            <div style={{ textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => {
                    setIsEditModalVisible(false);
                    setEditingOrder(null);
                    setNewStatus(null);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(editingOrder.id, newStatus)}
                >
                  Cập nhật
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommonOrderManagement;