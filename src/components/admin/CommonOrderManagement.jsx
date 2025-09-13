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
} from "@ant-design/icons";
import { getAllOrdersAPI } from "../../service/order.service";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const CommonOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    paymentMethod: "all",
    dateRange: null,
    searchText: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrdersAPI();
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      //   setOrders(sampleData.data);
      fetchOrders();
      //   setFilteredOrders(sampleData.data);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "processing",
      UNPAID: "warning",
      CANCELED: "error",
      COMPLETED: "success",
      PROCESSING: "blue",
      SHIPPED: "cyan",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: "Đang chờ",
      UNPAID: "Chưa thanh toán",
      CANCELED: "Đã hủy",
      COMPLETED: "Hoàn thành",
      PROCESSING: "Đang xử lý",
      SHIPPED: "Đã giao",
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

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // Payment method filter
    if (filters.paymentMethod !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentMethod === filters.paymentMethod
      );
    }

    // Search text filter
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
        { text: "Đang chờ", value: "PENDING" },
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
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showOrderDetail(record)}
          size="small"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
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
              <Option value="PENDING">Đang chờ</Option>
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

      {/* Error State */}
      {/* {!loading && (
        <Card style={{ marginBottom: '24px', borderColor: '#ff4d4f' }}>
          <div style={{ textAlign: 'center', color: '#ff4d4f' }}>
            <ExclamationCircleOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
            <Button type="primary" onClick={fetchOrders} icon={<ReloadOutlined />}>
              Thử lại
            </Button>
          </div>
        </Card>
      )} */}

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
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: "16px" }}>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <strong style={{ color: "#52c41a", fontSize: "16px" }}>
                  {formatCurrency(selectedOrder.totalAmount)}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {getPaymentMethodText(selectedOrder.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">
                {formatDate(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.address}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phone}
              </Descriptions.Item>
              {selectedOrder.note && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedOrder.note}
                </Descriptions.Item>
              )}
              {selectedOrder.reasonCancel && (
                <Descriptions.Item label="Lý do hủy" span={2}>
                  {selectedOrder.reasonCancel}
                </Descriptions.Item>
              )}
            </Descriptions>

            <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>
              Sản phẩm đặt hàng:
            </h3>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
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
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                    <div style={{ marginLeft: "16px", flex: 1 }}>
                      <h4>{item.productName}</h4>
                      <p>Số lượng: {item.quantity}</p>
                      <p style={{ color: "#52c41a", fontWeight: "bold" }}>
                        Giá: {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ color: "#1890ff" }}>
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommonOrderManagement;
