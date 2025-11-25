import React, { useEffect, useMemo, useState } from "react";
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
  Drawer,
  Pagination,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
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
import "../../styles/Dashboard.css"; // Import CSS file

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
  const [allOrders, setAllOrders] = useState([]);
  const [productSold, setProductSold] = useState([]);
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState("2500-01-01");
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [recentPage, setRecentPage] = useState(1);
  const RECENT_PAGE_SIZE = 4;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      setFilterDrawerVisible(false);
    }
  };

  const handleResetFilter = () => {
    setStartDate("2025-01-01");
    setEndDate("2500-01-01");
    setTempStartDate(null);
    setTempEndDate(null);
    setFilterDrawerVisible(false);
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
        setAllOrders(orderResponse.data || []);

        const resProductSold = await getProductsSoldAPI(startDate, endDate);
        const formattedData = Object.entries(resProductSold.data || {}).map(
          ([name, totalSold]) => ({
            name,
            totalSold,
          })
        );
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

  useEffect(() => {
    setRecentPage(1);
  }, [recentOrders]);

  const totalRecentPages = Math.max(
    1,
    Math.ceil(recentOrders.length / RECENT_PAGE_SIZE)
  );

  const filterOrdersByDateRange = (ordersList, start, end) => {
    if (!ordersList || ordersList.length === 0) return [];
    const startTime = dayjs(start).startOf("day").valueOf();
    const endTime = dayjs(end).endOf("day").valueOf();
    return ordersList
      .filter((order) => {
        const orderTime = dayjs(order.createdAt).valueOf();
        return orderTime >= startTime && orderTime <= endTime;
      })
      .sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
  };

  useEffect(() => {
    setRecentOrders(
      filterOrdersByDateRange(allOrders, startDate, endDate)
    );
  }, [allOrders, startDate, endDate]);

  useEffect(() => {
    if (recentPage > totalRecentPages) {
      setRecentPage(totalRecentPages);
    }
  }, [recentPage, totalRecentPages]);

  const paginatedRecentOrders = useMemo(() => {
    const start = (recentPage - 1) * RECENT_PAGE_SIZE;
    return recentOrders.slice(start, start + RECENT_PAGE_SIZE);
  }, [recentOrders, recentPage]);

  const handleRecentPageChange = (page) => {
    setRecentPage(page);
    const section = document.getElementById("dashboard-recent-orders");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const totalRevenue = totalRevenueCompleted + totalRevenueUncompleted;
  const totalOrders =
    totalOrdersDelivered + totalOrdersUncompleted + totalOrdersCanceled;

  const productColumns = [
    {
      title: "STT",
      key: "index",
      width: isMobile ? 50 : 70,
      align: "center",
      render: (text, record, index) => (
        <Text strong style={{ color: "#667eea" }}>
          #{index + 1}
        </Text>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "totalSold",
      key: "totalSold",
      width: isMobile ? 100 : 150,
      align: "center",
      sorter: (a, b) => a.totalSold - b.totalSold,
      defaultSortOrder: "descend",
      render: (value) => <Tag color="purple">{value}</Tag>,
    },
  ];

  const stats = [
    {
      title: "Khách hàng",
      value: totalCustomers,
      icon: <UserOutlined />,
      gradient: "dashboard-gradient-purple",
      description: `${totalEmployees} nhân viên`,
      descriptionIcon: <UserOutlined />,
    },
    {
      title: "Sản phẩm",
      value: totalProduct,
      icon: <ShoppingOutlined />,
      gradient: "dashboard-gradient-pink",
      description: "Đang kinh doanh",
      descriptionIcon: <ShoppingOutlined />,
    },
    {
      title: "Đơn hàng",
      value: totalOrders,
      icon: <ShoppingCartOutlined />,
      gradient: "dashboard-gradient-blue",
      stats: [
        {
          label: "Đã giao",
          value: totalOrdersDelivered,
          icon: <CheckCircleOutlined />,
        },
        {
          label: "Chưa hoàn thành",
          value: totalOrdersUncompleted,
          icon: <ClockCircleOutlined />,
        },
        {
          label: "Hủy/Hoàn trả",
          value: totalOrdersCanceled,
          icon: <CalendarOutlined />,
        },
      ],
    },
    {
      title: "Doanh thu",
      value: formatPrice(totalRevenue),
      icon: <DollarOutlined />,
      gradient: "dashboard-gradient-green",
      stats: [
        {
          label: "Đã thanh toán",
          value: formatPrice(totalRevenueCompleted),
          color: "#52c41a",
        },
        {
          label: "Chưa thanh toán",
          value: formatPrice(totalRevenueUncompleted),
          color: "#faad14",
        },
      ],
    },
  ];

  const orderColumns = [
    {
      title: "Mã",
      dataIndex: "orderCode",
      key: "orderCode",
      width: isMobile ? 60 : 80,
      render: (text) => <Text strong>#{text}</Text>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: isMobile ? 120 : 180,
      render: (text) => (
        <Space size={4}>
          {!isMobile && <CalendarOutlined style={{ color: "#52c41a" }} />}
          <Text>
            {isMobile
              ? new Date(text).toLocaleDateString("vi-VN")
              : formatDate(text)}
          </Text>
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: isMobile ? 100 : 140,
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
      width: isMobile ? 100 : 140,
      render: (status) => {
        const statusConfig = {
          UNPAID: {
            color: "warning",
            text: isMobile ? "Chưa TT" : "Chưa thanh toán",
          },
          PENDING: {
            color: "orange",
            text: isMobile ? "Chờ XN" : "Chờ xác nhận",
          },
          PROCESSING: {
            color: "processing",
            text: isMobile ? "Đang XL" : "Đang xử lý",
          },
          SHIPPING: { color: "cyan", text: "Đang giao" },
          DELIVERED: { color: "success", text: "Đã giao" },
          CANCELED: { color: "error", text: "Đã hủy" },
          REFUND_REQUESTED: {
            color: "gold",
            text: isMobile ? "YC hoàn" : "Yêu cầu hoàn",
          },
          REFUNDING: { color: "blue", text: "Đang hoàn" },
          REFUNDED: { color: "green", text: "Đã hoàn" },
          REFUND_REJECTED: { color: "red", text: "Từ chối" },
        };

        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };

        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const getPickerContainer = (trigger) => {
    const drawerBody = document.querySelector(
      ".dashboard-filter-drawer .ant-drawer-body"
    );
    if (drawerBody && drawerBody.contains(trigger)) {
      return drawerBody;
    }
    return document.body;
  };

  const FilterContent = () => (
    <div className="dashboard-filter-section">
      <div>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          Chọn khoảng thời gian
        </Text>
        <RangePicker
          size="large"
          onChange={handleDateChange}
          value={
            tempStartDate && tempEndDate ? [tempStartDate, tempEndDate] : null
          }
          style={{ borderRadius: "8px", width: "100%" }}
          format="DD/MM/YYYY"
          placeholder={["Từ ngày", "Đến ngày"]}
          getPopupContainer={getPickerContainer}
          allowClear
          showToday
          disabledDate={(current) => {
            // Allow all dates - no restrictions
            return false;
          }}
        />
      </div>
      <div className="dashboard-filter-buttons">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleApplyFilter}
          disabled={!tempStartDate || !tempEndDate}
          className="dashboard-filter-button"
        >
          Áp dụng
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleResetFilter}
          className="dashboard-filter-button"
        >
          Đặt lại
        </Button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Content className="dashboard-content">
        <div className="dashboard-inner">
          {/* Header */}
          <Row
            justify="space-between"
            align="middle"
            className="dashboard-header"
          >
            <Col span={24}>
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Title level={isMobile ? 3 : 2} className="dashboard-title">
                    📊 Dashboard
                  </Title>
                  <Text className="dashboard-subtitle">
                    Tổng quan hoạt động kinh doanh
                  </Text>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  {isMobile ? (
                    <Button
                      type="primary"
                      icon={<FilterOutlined />}
                      onClick={() => setFilterDrawerVisible(true)}
                      block
                      size="large"
                      className="dashboard-mobile-filter-btn"
                    >
                      Lọc theo ngày
                    </Button>
                  ) : (
                    <FilterContent />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Drawer for Mobile */}
          <Drawer
            title="Lọc dữ liệu"
            placement="bottom"
            onClose={() => setFilterDrawerVisible(false)}
            open={filterDrawerVisible}
            height="auto"
            className="dashboard-filter-drawer"
          >
            <FilterContent />
          </Drawer>

          {/* Stat Cards */}
          <Row
            gutter={[isMobile ? 12 : 24, isMobile ? 12 : 24]}
            style={{ marginBottom: isMobile ? 16 : 32 }}
          >
            {stats.map((stat, index) => (
              <Col xs={12} sm={12} md={12} lg={6} key={index}>
                <Card
                  className="dashboard-stat-card dashboard-animate-in"
                  loading={loading}
                >
                  <div className="dashboard-stat-content">
                    <div className="dashboard-stat-info">
                      <Text className="dashboard-stat-label">{stat.title}</Text>
                      <Title
                        level={isMobile ? 5 : 3}
                        className="dashboard-stat-value"
                      >
                        {stat.value}
                      </Title>
                      {!isMobile && (
                        <div className="dashboard-stat-details">
                          {stat.description && (
                            <Text className="dashboard-stat-description">
                              {stat.descriptionIcon}
                              {stat.description}
                            </Text>
                          )}
                          {stat.stats && (
                            <div style={{ marginTop: 8 }}>
                              {stat.stats.map((item, idx) => (
                                <div key={idx} className="dashboard-stat-item">
                                  <Text className="dashboard-stat-item-label">
                                    {item.icon}
                                    {item.label}:
                                  </Text>
                                  <Text
                                    strong
                                    className="dashboard-stat-item-value"
                                    style={{ color: item.color || "#1890ff" }}
                                  >
                                    {item.value}
                                  </Text>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`dashboard-stat-icon ${stat.gradient}`}>
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Chart Card */}
          <Card
            className="dashboard-chart-card dashboard-animate-in"
            loading={loading}
            title={
              <div className="dashboard-chart-header">
                <div className="dashboard-chart-title">
                  <div className="dashboard-chart-title-bar" />
                  <Text className="dashboard-chart-title-text">
                    {showAllProducts
                      ? `Tất cả SP (${productSold.length})`
                      : isMobile
                        ? "Top 10 SP"
                        : "Top 15 Sản phẩm bán chạy"}
                  </Text>
                </div>
                <div className="dashboard-chart-controls">
                  <Text className="dashboard-chart-controls-label">Bảng:</Text>
                  <Switch
                    checked={showAllProducts}
                    onChange={(checked) => setShowAllProducts(checked)}
                    size={isMobile ? "small" : "default"}
                  />
                </div>
              </div>
            }
          >
            <div className="dashboard-chart-wrapper">
              {productSold.length === 0 ? (
                <div className="dashboard-empty-state">
                  <Text type="secondary">
                    Không có sản phẩm trong khoảng thời gian này
                  </Text>
                </div>
              ) : !showAllProducts ? (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 300 : 450}
                  >
                    <BarChart
                      data={productSold.slice(0, isMobile ? 10 : 15)}
                      margin={{
                        top: 20,
                        right: isMobile ? 10 : 30,
                        left: isMobile ? 0 : 20,
                        bottom: isMobile ? 80 : 150,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="colorBar"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#667eea"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="95%"
                            stopColor="#764ba2"
                            stopOpacity={0.9}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={isMobile ? 80 : 140}
                        tick={{ fill: "#666", fontSize: isMobile ? 9 : 11 }}
                      />
                      <YAxis
                        tick={{ fill: "#666", fontSize: isMobile ? 10 : 12 }}
                        width={isMobile ? 40 : 60}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} SP`, "Đã bán"]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      {!isMobile && (
                        <Legend
                          verticalAlign="top"
                          height={36}
                          iconType="circle"
                        />
                      )}
                      <Bar
                        dataKey="totalSold"
                        name="Số lượng đã bán"
                        fill="url(#colorBar)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={isMobile ? 30 : 50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  {productSold.length > (isMobile ? 10 : 15) && (
                    <div className="dashboard-chart-tag">
                      <Tag color="blue">
                        Hiển thị {isMobile ? 10 : 15}/{productSold.length} sản
                        phẩm
                      </Tag>
                    </div>
                  )}
                </>
              ) : (
                <Table
                  columns={productColumns}
                  dataSource={productSold}
                  rowKey="name"
                  pagination={{
                    pageSize: isMobile ? 10 : 20,
                    showSizeChanger: !isMobile,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} / ${total}`,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    simple: isMobile,
                  }}
                  scroll={{ x: isMobile ? 300 : 600 }}
                  size={isMobile ? "small" : "middle"}
                  rowClassName={(record, index) =>
                    index < 3 ? "top-product-row" : ""
                  }
                />
              )}
            </div>
          </Card>

          {/* Recent Orders Table */}
          <Card
            id="dashboard-recent-orders"
            className="dashboard-table-card dashboard-animate-in"
            loading={loading}
            title={
              <div className="dashboard-chart-title">
                <div
                  className="dashboard-chart-title-bar"
                  style={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  }}
                />
                <Text className="dashboard-chart-title-text">
                  Giao dịch trong khoảng thời gian
                </Text>
              </div>
            }
          >
            {isMobile ? (
              <div className="dashboard-recent-orders-mobile-list">
                {paginatedRecentOrders.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <Text type="secondary">Không có giao dịch nào</Text>
                  </div>
                ) : (
                  paginatedRecentOrders.map((order) => {
                    const statusConfig = {
                      UNPAID: {
                        color: "warning",
                        text: "Chưa TT",
                      },
                      PENDING: {
                        color: "orange",
                        text: "Chờ XN",
                      },
                      PROCESSING: {
                        color: "processing",
                        text: "Đang XL",
                      },
                      SHIPPING: { color: "cyan", text: "Đang giao" },
                      DELIVERED: { color: "success", text: "Đã giao" },
                      CANCELED: { color: "error", text: "Đã hủy" },
                      REFUND_REQUESTED: {
                        color: "gold",
                        text: "YC hoàn",
                      },
                      REFUNDING: { color: "blue", text: "Đang hoàn" },
                      REFUNDED: { color: "green", text: "Đã hoàn" },
                      REFUND_REJECTED: { color: "red", text: "Từ chối" },
                    };
                    const config = statusConfig[order.status] || {
                      color: "default",
                      text: order.status,
                    };
                    return (
                      <Card
                        key={order.id}
                        className="dashboard-recent-order-mobile-card"
                        size="small"
                      >
                        <div className="dashboard-recent-order-mobile-card__header">
                          <span className="dashboard-recent-order-mobile-id">
                            #{order.orderCode}
                          </span>
                          <Tag color={config.color}>{config.text}</Tag>
                        </div>
                        <div className="dashboard-recent-order-mobile-card__meta">
                          <div>
                            <Text type="secondary">Ngày đặt</Text>
                            <div className="dashboard-recent-order-mobile-date">
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </div>
                          <div>
                            <Text type="secondary">Số tiền</Text>
                            <div className="dashboard-recent-order-mobile-amount">
                              {formatPrice(order.totalAmount)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="dashboard-table-wrapper">
                {paginatedRecentOrders.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <Text type="secondary">Không có giao dịch nào</Text>
                  </div>
                ) : (
                  <Table
                    columns={orderColumns}
                    dataSource={paginatedRecentOrders}
                    pagination={false}
                    rowKey="id"
                    size="middle"
                  />
                )}
              </div>
            )}
            {recentOrders.length > RECENT_PAGE_SIZE && (
              <div className="dashboard-recent-pagination">
                <Pagination
                  current={recentPage}
                  pageSize={RECENT_PAGE_SIZE}
                  total={recentOrders.length}
                  onChange={handleRecentPageChange}
                  showSizeChanger={false}
                  simple={isMobile}
                  size={isMobile ? "small" : "default"}
                />
              </div>
            )}
          </Card>
        </div>
      </Content>
    </div>
  );
};

export default Dashboard;
