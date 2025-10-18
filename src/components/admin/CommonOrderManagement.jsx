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
  Statistic,
  Tooltip,
  Badge,
  message,
  Divider,
  Typography,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  getAllOrdersAPI,
  updateOrderStatusAPI,
} from "../../service/order.service";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Text } = Typography;

const CommonOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    paymentMethod: "all",
    dateRange: null,
    searchText: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrdersAPI();
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchOrders();
      setLoading(false);
    }, 1000);
  }, []);

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
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: "Chờ xác nhận",
      UNPAID: "Chưa thanh toán",
      CANCELED: "Đã hủy",
      DELIVERED: "Hoàn thành",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao hàng",
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
      } else {
        showNotification("error", res.message || "Cập nhật trạng thái thất bại");
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
      render: (id) => (
        <Badge count={id} style={{ backgroundColor: "#1890ff" }} />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: "Chờ xác nhận", value: "PENDING" },
        { text: "Đang xử lý", value: "PROCESSING" },
        { text: "Đã giao", value: "SHIPPED" },
        { text: "Hoàn thành", value: "COMPLETED" },
        { text: "Chưa thanh toán", value: "UNPAID" },
        { text: "Đã hủy", value: "CANCELED" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (amount) => (
        <strong style={{ color: "#52c41a" }}>{formatCurrency(amount)}</strong>
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
      width: 200,
      render: (items) => (
        <div>
          <span>{items.length} sản phẩm</span>
          <div style={{ marginTop: 4 }}>
            {items.slice(0, 2).map((item, index) => (
              <Tag key={index} size="small">
                {item.productName} x{item.quantity}
              </Tag>
            ))}
            {items.length > 2 && <Tag size="small">...</Tag>}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
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
                danger
                icon={<CheckOutlined />}
                onClick={() => handleStatusChange(record.id, "PROCESSING")}
                size="small"
              >
                Xác nhận
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Chỉnh sửa trạng thái">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditStatus(record)}
              size="small"
            >
              Edit
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Enhanced Notification System */}
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
      <h1
        style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "bold" }}
      >
        Quản lý đơn hàng
      </h1>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.count}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.total}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang chờ xử lý"
              value={stats.byStatus.PENDING || 0}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.byStatus.CANCELED || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="PROCESSING">Đang xử lý</Option>
              <Option value="SHIPPED">Đã giao</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="UNPAID">Chưa thanh toán</Option>
              <Option value="CANCELED">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={4}>
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
          <Col span={6}>
            <Search
              placeholder="Tìm theo ID, SĐT, địa chỉ..."
              onSearch={(value) => handleFilterChange("searchText", value)}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
              enterButton
            />
          </Col>
          <Col span={4}>
            <Button icon={<FilterOutlined />}>
              Bộ lọc ({filteredOrders.length}/{orders.length})
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {selectedOrder && (
          <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px" }}>
            <Descriptions bordered column={2} style={{ marginBottom: "24px" }}>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {getPaymentMethodText(selectedOrder.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">
                {formatDate(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
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

            {/* Chi tiết thanh toán */}
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

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Tạm tính */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: "15px" }}>
                    Tạm tính ({selectedOrder.orderItems.length} sản phẩm)
                  </Text>
                  <Text style={{ fontSize: "15px", fontWeight: 500 }}>
                    {selectedOrder.orderItems
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toLocaleString("vi-VN")}{" "}
                    ₫
                  </Text>
                </div>

                {/* Phí vận chuyển */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: "15px" }}>Phí vận chuyển</Text>
                  <Text style={{ fontSize: "15px", fontWeight: 500, color: "#52c41a" }}>
                    {selectedOrder.shippingFee
                      ? `${selectedOrder.shippingFee.toLocaleString("vi-VN")} ₫`
                      : "Miễn phí"}
                  </Text>
                </div>

                {/* Giảm giá (nếu có) */}
                {selectedOrder.discountPercent > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                    <Text style={{ fontSize: "15px", fontWeight: 500, color: "#ff4d4f" }}>
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

                {/* Tổng thanh toán */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                >
                  <Text style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                    Tổng thanh toán
                  </Text>
                  <Text style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Status Modal */}
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