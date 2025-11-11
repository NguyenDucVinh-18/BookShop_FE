import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Table,
  DatePicker,
  Space,
  Tag,
  Button,
  Switch,
  Input,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Bar, Line } from "recharts";
import {
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  getProductsSoldAPI,
  getTotalStatisticsAPI,
} from "../../service/statistic.service";
import { getAllOrdersAPI } from "../../service/order.service";
import dayjs from "dayjs";
import "../../styles/AdminResponsive.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrdersDelivered, setTotalOrdersDelivered] = useState(0);
  const [totalOrdersUncompleted, setTotalOrdersUncompleted] = useState(0);
  const [totalOrdersCanceled, setTotalOrdersCanceled] = useState(0);
  const [totalRevenueCompleted, setTotalRevenueCompleted] = useState(0);
  const [totalRevenueUncompleted, setTotalRevenueUncompleted] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productSold, setProductSold] = useState([]);
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState("2500-01-01");
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [searchText, setSearchText] = useState("");

  const formatPrice = (price) => {
    return `${Math.round(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setTempStartDate(dates[0]);
      setTempEndDate(dates[1]);
    } else {
      setTempStartDate(null);
      setTempEndDate(null);
    }
  };

  const handleApplyFilter = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate.format("YYYY-MM-DD"));
      setEndDate(tempEndDate.format("YYYY-MM-DD"));
    }
  };

  const handleResetFilter = () => {
    setStartDate("2025-01-01");
    setEndDate("2500-01-01");
    setTempStartDate(null);
    setTempEndDate(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTotalStatisticsAPI(startDate, endDate);
        setTotalCustomers(res.data.totalCustomers);
        setTotalEmployees(res.data.totalEmployees);
        setTotalProduct(res.data.totalProducts);
        setTotalOrdersDelivered(res.data.totalOrdersDelivered);
        setTotalOrdersUncompleted(res.data.totalOrdersUncompleted);
        setTotalOrdersCanceled(res.data.totalRefundOrCanceledOrders);
        setTotalRevenueCompleted(res.data.totalRevenueCompleted);
        setTotalRevenueUncompleted(res.data.totalRevenueUncompleted);

        const orderResponse = await getAllOrdersAPI();
        const recentOrders = orderResponse.data.slice(0, 10);
        setRecentOrders(recentOrders);

        const resProductSold = await getProductsSoldAPI(startDate, endDate);
        const formattedData = Object.entries(
          resProductSold.data || {}
        ).map(([name, totalSold]) => ({
          name,
          totalSold,
        }));
        // Sắp xếp theo số lượng bán giảm dần
        formattedData.sort((a, b) => b.totalSold - a.totalSold);
        setProductSold(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const totalRevenue = totalRevenueCompleted + totalRevenueUncompleted;
  const totalOrders = totalOrdersDelivered + totalOrdersUncompleted + totalOrdersCanceled;

  // Lọc sản phẩm theo tìm kiếm
  const filteredProducts = productSold.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Columns cho bảng sản phẩm
  const productColumns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (text, record, index) => (
        <Text strong style={{ color: "#667eea" }}>#{index + 1}</Text>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "totalSold",
      key: "totalSold",
      width: 180,
      align: "center",
      sorter: (a, b) => a.totalSold - b.totalSold,
      defaultSortOrder: 'descend',
      render: (value) => (
        <Tag color="purple" style={{ fontSize: "14px", padding: "4px 12px" }}>
          {value} sản phẩm
        </Tag>
      ),
    },
  ];

  const stats = [
    {
      title: "Tổng Khách hàng",
      value: totalCustomers,
      icon: <UserOutlined />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: `${totalEmployees} nhân viên`,
      descriptionIcon: <UserOutlined />,
    },
    {
      title: "Tổng sản phẩm",
      value: totalProduct,
      icon: <ShoppingOutlined />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Đang kinh doanh",
      descriptionIcon: <ShoppingOutlined />,
    },
    {
      title: "Tổng đơn hàng",
      value: totalOrders,
      icon: <ShoppingCartOutlined />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      stats: [
        { label: "Đã giao", value: totalOrdersDelivered, icon: <CheckCircleOutlined /> },
        { label: "Chưa hoàn thành", value: totalOrdersUncompleted, icon: <ClockCircleOutlined /> },
        {label: "Hủy hoặc hoàn trả", value: totalOrdersCanceled, icon: <CalendarOutlined /> },
      ],
    },
    {
      title: "Tổng doanh thu",
      value: formatPrice(totalRevenue),
      icon: <DollarOutlined />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      stats: [
        { label: "Đã thanh toán", value: formatPrice(totalRevenueCompleted), color: "#52c41a" },
        { label: "Chưa thanh toán", value: formatPrice(totalRevenueUncompleted), color: "#faad14" },
      ],
    },
  ];

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 80,
      render: (text) => <Text strong>#{text}</Text>,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (text) => (
        <Space>
          <CalendarOutlined style={{ color: "#52c41a" }} />
          <Text>{formatDate(text)}</Text>
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 140,
      render: (text) => (
        <Text strong style={{ color: "#722ed1" }}>
          {formatPrice(text)}
        </Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const statusConfig = {
          UNPAID: { color: "warning", text: "Chưa thanh toán" },
          PENDING: { color: "orange", text: "Chờ xác nhận" },
          PROCESSING: { color: "processing", text: "Đang xử lý" },
          SHIPPING: { color: "cyan", text: "Đang giao hàng" },
          DELIVERED: { color: "success", text: "Đã giao hàng" },
          CANCELED: { color: "error", text: "Đã hủy" },
          REFUND_REQUESTED: { color: "gold", text: "Yêu cầu hoàn trả" },
          REFUNDING: { color: "blue", text: "Đang hoàn trả" },
          REFUNDED: { color: "green", text: "Đã hoàn trả" },
          REFUND_REJECTED: { color: "red", text: "Từ chối hoàn trả" },
        };
    
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
    
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: "Chưa thanh toán", value: "UNPAID" },
        { text: "Chờ xác nhận", value: "PENDING" },
        { text: "Đang xử lý", value: "PROCESSING" },
        { text: "Đang giao hàng", value: "SHIPPING" },
        { text: "Đã giao hàng", value: "DELIVERED" },
        { text: "Đã hủy", value: "CANCELED" },
        { text: "Yêu cầu hoàn trả", value: "REFUND_REQUESTED" },
        { text: "Đang hoàn trả", value: "REFUNDING" },
        { text: "Đã hoàn trả", value: "REFUNDED" },
        { text: "Từ chối hoàn trả", value: "REFUND_REJECTED" },
      ],
      onFilter: (value, record) => record.status === value,
    }
    
  ];

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  return (
    <div className="admin-responsive-container">
      <Content style={{ margin: "0 16px", overflow: "initial" }}>
        <div
          style={{
            padding: "32px 24px",
            background: "#fff",
            minHeight: "100%",
            borderRadius: "16px",
          }}
        >
          {/* Header */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 32 }}
            className="dashboard-header"
          >
            <Col xs={24} sm={24} md={24} lg={24}>
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Title
                    level={2}
                    className="admin-title-mobile"
                    style={{
                      margin: 0,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    📊 Dashboard
                  </Title>
                  <Text type="secondary" className="admin-subtitle-mobile">
                    Tổng quan hoạt động kinh doanh
                  </Text>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <RangePicker
                      size="large"
                      onChange={handleDateChange}
                      value={tempStartDate && tempEndDate ? [tempStartDate, tempEndDate] : null}
                      style={{ borderRadius: "8px", width: "100%" }}
                      format="DD/MM/YYYY"
                      placeholder={["Từ ngày", "Đến ngày"]}
                    />
                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleApplyFilter}
                        disabled={!tempStartDate || !tempEndDate}
                        style={{ borderRadius: "8px" }}
                      >
                        Lọc dữ liệu
                      </Button>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={handleResetFilter}
                        style={{ borderRadius: "8px" }}
                      >
                        Đặt lại
                      </Button>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Thống kê Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={12} lg={6} key={index}>
                <Card
                  className="admin-card-responsive dashboard-stat-card"
                  style={cardStyle}
                  bodyStyle={{ padding: "24px" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "14px",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {stat.title}
                      </Text>
                      <Title
                        level={3}
                        style={{
                          margin: 0,
                          fontSize: "28px",
                          fontWeight: "bold",
                        }}
                      >
                        {stat.value}
                      </Title>
                      <div style={{ marginTop: "12px" }}>
                        {stat.description && (
                          <Text
                            type="secondary"
                            style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                          >
                            {stat.descriptionIcon}
                            {stat.description}
                          </Text>
                        )}
                        {stat.stats && (
                          <div style={{ marginTop: "8px" }}>
                            {stat.stats.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <Text style={{ fontSize: "12px", color: "#666", display: "flex", alignItems: "center", gap: "4px" }}>
                                  {item.icon}
                                  {item.label}:
                                </Text>
                                <Text strong style={{ fontSize: "12px", color: item.color || "#1890ff" }}>
                                  {item.value}
                                </Text>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        background: stat.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        color: "#fff",
                      }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Biểu đồ sản phẩm bán chạy */}
          <Card
            title={
              <div
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "4px",
                      height: "24px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "2px",
                    }}
                  />
                  <Text strong style={{ fontSize: "18px" }}>
                    {showAllProducts ? `Tất cả sản phẩm (${productSold.length})` : "Top 15 Sản phẩm bán chạy nhất"}
                  </Text>
                </div>
                <Space>
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    Hiển thị bảng:
                  </Text>
                  <Switch
                    checked={showAllProducts}
                    onChange={(checked) => setShowAllProducts(checked)}
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                  />
                </Space>
              </div>
            }
            style={{ ...cardStyle, marginBottom: 24 }}
            bodyStyle={{ padding: "24px" }}
            loading={loading}
            className="admin-card-responsive"
          >
            <div className="dashboard-chart">
              {!showAllProducts ? (
                // Bar Chart cho Top 15
                <>
                  <ResponsiveContainer width="100%" height={450}>
                    <BarChart
                      data={productSold.slice(0, 15)}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 150,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#764ba2" stopOpacity={0.9} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={140}
                        tick={{ fill: "#666", fontSize: 11 }}
                      />
                      <YAxis 
                        tick={{ fill: "#666", fontSize: 12 }}
                        label={{ value: 'Số lượng', angle: -90, position: 'insideLeft', style: { fill: '#666' } }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} sản phẩm`, "Đã bán"]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36} 
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: "20px" }}
                      />
                      <Bar
                        dataKey="totalSold"
                        name="Số lượng đã bán"
                        fill="url(#colorBar)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  {productSold.length > 15 && (
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                      <Tag color="blue" style={{ fontSize: "13px", padding: "6px 12px" }}>
                        Hiển thị 15 trong tổng số {productSold.length} sản phẩm
                      </Tag>
                    </div>
                  )}
                </>
              ) : (
                // Bảng cho tất cả sản phẩm
                <div className="admin-table-wrapper">
                  <Table
                    columns={productColumns}
                    dataSource={productSold}
                    rowKey="name"
                    pagination={{
                      pageSize: 20,
                      showSizeChanger: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
                      pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    style={{ borderRadius: "8px" }}
                    rowClassName={(record, index) => index < 3 ? "top-product-row" : "table-row-hover"}
                    scroll={{ x: 600 }}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Giao dịch gần đây */}
          <Card
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "24px",
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    borderRadius: "2px",
                  }}
                />
                <Text strong style={{ fontSize: "18px" }}>
                  10 Giao dịch gần đây
                </Text>
              </div>
            }
            style={cardStyle}
            bodyStyle={{ padding: "24px" }}
            loading={loading}
            className="admin-card-responsive dashboard-table"
          >
            <div className="admin-table-wrapper">
              <Table
                columns={columns}
                dataSource={recentOrders}
                pagination={false}
                rowKey="id"
                style={{ borderRadius: "8px" }}
                rowClassName={() => "table-row-hover"}
                scroll={{ x: 520 }}
              />
            </div>
          </Card>
        </div>
      </Content>

      <style jsx>{`
        .table-row-hover:hover {
          background-color: #f5f7fa !important;
          cursor: pointer;
        }
        .top-product-row {
          background-color: #fff7e6 !important;
        }
        .top-product-row:hover {
          background-color: #ffe7ba !important;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;