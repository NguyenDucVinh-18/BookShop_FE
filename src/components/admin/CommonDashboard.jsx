import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Avatar,
  List,
  Timeline,
  Select,
  DatePicker,
  Button,
  Badge,
  Tooltip,
  Space,
  Typography
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EyeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  FireOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  BellOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CommonDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Sample data - in real app, this would come from APIs
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalRevenue: 2847590000,
      totalOrders: 1847,
      totalCustomers: 892,
      conversionRate: 3.24,
      revenueChange: 12.5,
      ordersChange: -2.3,
      customersChange: 8.7,
      conversionChange: 1.2
    },
    salesData: [
      { name: 'T2', revenue: 45000000, orders: 124, customers: 87 },
      { name: 'T3', revenue: 52000000, orders: 142, customers: 96 },
      { name: 'T4', revenue: 48000000, orders: 118, customers: 89 },
      { name: 'T5', revenue: 61000000, orders: 167, customers: 112 },
      { name: 'T6', revenue: 55000000, orders: 145, customers: 98 },
      { name: 'T7', revenue: 67000000, orders: 178, customers: 124 },
      { name: 'CN', revenue: 58000000, orders: 156, customers: 103 }
    ],
    categoryData: [
      { name: 'Điện tử', value: 35, color: '#1890ff' },
      { name: 'Thời trang', value: 25, color: '#52c41a' },
      { name: 'Gia dụng', value: 20, color: '#faad14' },
      { name: 'Sách', value: 12, color: '#f5222d' },
      { name: 'Khác', value: 8, color: '#722ed1' }
    ],
    recentOrders: [
      {
        id: '#ORD-2024-001',
        customer: 'Nguyễn Văn A',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        amount: 2850000,
        status: 'completed',
        time: '2 phút trước'
      },
      {
        id: '#ORD-2024-002', 
        customer: 'Trần Thị B',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        amount: 1250000,
        status: 'processing',
        time: '5 phút trước'
      },
      {
        id: '#ORD-2024-003',
        customer: 'Lê Văn C',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        amount: 750000,
        status: 'pending',
        time: '8 phút trước'
      },
      {
        id: '#ORD-2024-004',
        customer: 'Phạm Thị D',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        amount: 3200000,
        status: 'completed',
        time: '12 phút trước'
      }
    ],
    topProducts: [
      {
        name: 'iPhone 15 Pro Max',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
        sales: 245,
        revenue: 610000000,
        growth: 15.2
      },
      {
        name: 'Samsung Galaxy S24',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
        sales: 189,
        revenue: 378000000,
        growth: 8.7
      },
      {
        name: 'MacBook Pro M3',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop',
        sales: 124,
        revenue: 496000000,
        growth: 22.1
      },
      {
        name: 'AirPods Pro',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop',
        sales: 334,
        revenue: 167000000,
        growth: -3.2
      }
    ],
    activities: [
      {
        type: 'order',
        title: 'Đơn hàng mới',
        description: 'Đơn hàng #ORD-2024-001 đã được tạo',
        time: '2 phút trước',
        color: 'blue'
      },
      {
        type: 'payment',
        title: 'Thanh toán thành công',
        description: 'Khách hàng đã thanh toán 2,850,000đ',
        time: '5 phút trước',
        color: 'green'
      },
      {
        type: 'review',
        title: 'Đánh giá mới',
        description: 'Sản phẩm iPhone 15 nhận 5 sao',
        time: '10 phút trước',
        color: 'gold'
      },
      {
        type: 'user',
        title: 'Khách hàng mới',
        description: 'Người dùng mới đã đăng ký',
        time: '15 phút trước',
        color: 'purple'
      },
      {
        type: 'inventory',
        title: 'Cảnh báo tồn kho',
        description: 'Samsung Galaxy S24 sắp hết hàng',
        time: '20 phút trước',
        color: 'red'
      }
    ]
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'success',
      'processing': 'processing',
      'pending': 'warning',
      'cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'completed': 'Hoàn thành',
      'processing': 'Đang xử lý',
      'pending': 'Chờ xử lý',
      'cancelled': 'Đã hủy'
    };
    return texts[status] || status;
  };

  const getActivityIcon = (type) => {
    const icons = {
      'order': <ShoppingCartOutlined />,
      'payment': <DollarCircleOutlined />,
      'review': <TrophyOutlined />,
      'user': <UserOutlined />,
      'inventory': <ExclamationCircleOutlined />
    };
    return icons[type] || <ClockCircleOutlined />;
  };

  const topProductColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.image} size={40} style={{ marginRight: 12 }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.sales} đã bán</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (amount) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Tăng trưởng',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {growth > 0 ? (
            <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 4 }} />
          ) : (
            <ArrowDownOutlined style={{ color: '#f5222d', marginRight: 4 }} />
          )}
          <span style={{ color: growth > 0 ? '#52c41a' : '#f5222d' }}>
            {Math.abs(growth)}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Dashboard Tổng quan
          </Title>
          <Text type="secondary">Chào mừng trở lại! Đây là tổng quan về hoạt động kinh doanh</Text>
        </Col>
        <Col>
          <Space>
            <Select 
              value={timeRange} 
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="7days">7 ngày</Option>
              <Option value="30days">30 ngày</Option>
              <Option value="90days">90 ngày</Option>
              <Option value="1year">1 năm</Option>
            </Select>
            <RangePicker />
            <Button icon={<CalendarOutlined />}>Báo cáo</Button>
          </Space>
        </Col>
      </Row>

      {/* Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng doanh thu"
              value={dashboardData.overview.totalRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarCircleOutlined />}
              suffix={
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  <span style={{ color: '#52c41a', marginLeft: '4px' }}>
                    {dashboardData.overview.revenueChange}%
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng đơn hàng"
              value={dashboardData.overview.totalOrders}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  <ArrowDownOutlined style={{ color: '#f5222d' }} />
                  <span style={{ color: '#f5222d', marginLeft: '4px' }}>
                    {Math.abs(dashboardData.overview.ordersChange)}%
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Khách hàng"
              value={dashboardData.overview.totalCustomers}
              prefix={<UserOutlined />}
              suffix={
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  <span style={{ color: '#52c41a', marginLeft: '4px' }}>
                    {dashboardData.overview.customersChange}%
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tỷ lệ chuyển đổi"
              value={dashboardData.overview.conversionRate}
              suffix="%"
              prefix={<RiseOutlined />}
            />
            <Progress 
              percent={dashboardData.overview.conversionRate * 10} 
              showInfo={false} 
              size="small"
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Biểu đồ doanh thu" 
            loading={loading}
            extra={
              <Select 
                value={selectedMetric} 
                onChange={setSelectedMetric}
                style={{ width: 120 }}
              >
                <Option value="revenue">Doanh thu</Option>
                <Option value="orders">Đơn hàng</Option>
                <Option value="customers">Khách hàng</Option>
              </Select>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip 
                  formatter={(value) => 
                    selectedMetric === 'revenue' ? formatCurrency(value) : value
                  }
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#1890ff" 
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố danh mục" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Đơn hàng gần đây" loading={loading}>
            <List
              dataSource={dashboardData.recentOrders}
              renderItem={(order) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={order.avatar} />}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{order.customer}</span>
                        <Tag color={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ color: '#666', fontSize: '12px' }}>{order.id}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                          <Text strong style={{ color: '#52c41a' }}>
                            {formatCurrency(order.amount)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {order.time}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Sản phẩm bán chạy" loading={loading}>
            <Table
              dataSource={dashboardData.topProducts}
              columns={topProductColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây" loading={loading}>
            <Timeline
              items={dashboardData.activities.map((activity, index) => ({
                color: activity.color,
                dot: getActivityIcon(activity.type),
                children: (
                  <div key={index}>
                    <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                      {activity.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                      {activity.description}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      {activity.time}
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CommonDashboard;