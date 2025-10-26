import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Button,
  DatePicker,
  Space,
  Tag,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Bar } from "recharts";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productSold, setProductSold] = useState([]);
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2500-01-01");
  const [loading, setLoading] = useState(false);

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
      setStartDate(dates[0].format("YYYY-MM-DD"));
      setEndDate(dates[1].format("YYYY-MM-DD"));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTotalStatisticsAPI(startDate, endDate);
        setTotalCustomers(res.data.totalCustomers);
        setTotalEmployees(res.data.totalEmployees);
        setTotalProduct(res.data.totalProducts);
        setTotalOrder(res.data.totalOrders);
        setTotalRevenue(res.data.totalRevenue);

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
        setProductSold(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  console.log("Product Sold Data:", recentOrders);

  const stats = [
    {
      title: "Tổng Khách hàng",
      value: totalCustomers,
      icon: <UserOutlined />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      prefix: "+12%",
      trend: "up",
    },
    {
      title: "Tổng sản phẩm",
      value: totalProduct,
      icon: <ShoppingOutlined />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      prefix: "+8%",
      trend: "up",
    },
    {
      title: "Tổng hóa đơn",
      value: totalOrder,
      icon: <ShoppingCartOutlined />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      prefix: "+23%",
      trend: "up",
    },
    {
      title: "Doanh thu",
      value: formatPrice(totalRevenue),
      icon: <DollarOutlined />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      prefix: "+15%",
      trend: "up",
    },
  ];

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text) => <Text strong>#{text}</Text>,
    },
    // {
    //   title: "Khách hàng",
    //   dataIndex: "customer",
    //   key: "customer",
    //   render: (text) => (
    //     <Space>
    //       <UserOutlined style={{ color: "#1890ff" }} />
    //       <Text>{text}</Text>
    //     </Space>
    //   ),
    // },
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
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
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
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusConfig = {
          PROCESSING: { color: "processing", text: "Đang xử lý" },
          PENDING: { color: "orange", text: "Đang xử lý" },
          CANCELED: { color: "error", text: "Đã hủy" },
          SHIPPING: { color: "cyan", text: "Đang giao hàng" },
          DELIVERED: { color: "success", text: "Đã giao hàng" },
          UNPAID: { color: "warning", text: "Chưa thanh toán" },
        };

        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };

        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const statCardHoverStyle = {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
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
            <Col xs={24} sm={24} md={16} lg={16}>
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
              <Text type="secondary" className="admin-subtitle-mobile">Tổng quan hoạt động kinh doanh</Text>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} className="dashboard-date-picker">
              <RangePicker
                size="large"
                onChange={handleDateChange}
                style={{ borderRadius: "8px", width: "100%" }}
                format="DD/MM/YYYY"
              />
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
                      <div style={{ marginTop: "8px" }}>
                        <Text
                          style={{
                            color: stat.trend === "up" ? "#52c41a" : "#ff4d4f",
                            fontSize: "12px",
                          }}
                        >
                          {stat.trend === "up" ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )}{" "}
                          {stat.prefix}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: "12px", marginLeft: "4px" }}
                        >
                          so với tháng trước
                        </Text>
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
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
                  Sản phẩm bán chạy
                </Text>
              </div>
            }
            style={{ ...cardStyle, marginBottom: 24 }}
            bodyStyle={{ padding: "24px" }}
            loading={loading}
            className="admin-card-responsive"
          >
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={productSold}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 150,
                  }}
                >
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} sản phẩm`, "Đã bán"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar
                    dataKey="totalSold"
                    name="Số lượng đã bán"
                    fill="url(#colorBar)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
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
                  Giao dịch gần đây
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
      `}</style>
    </div>
  );
};

export default Dashboard;
