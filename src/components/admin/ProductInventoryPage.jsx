import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Button,
  Progress,
  Tooltip,
  Alert,
} from "antd";
import {
  InboxOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getAllProductsAPI } from "../../service/product.service";
import "../../styles/AdminResponsive.css";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const minStock = 10; // Minimum stock threshold for low stock warning

  const fetchProducts = async () => {
    setLoading(true);
    try {

      const res = await getAllProductsAPI();
      if (res && res.data) {
        setTimeout(() => {
          setProducts(res.data.products);
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalActual: products.reduce((sum, p) => sum + p.stockQuantity, 0),
    totalProcessing: products.reduce((sum, p) => sum + p.processingQuantity, 0),
    totalAvailable: products.reduce((sum, p) => sum + p.availableQuantity, 0),
    lowStock: products.filter(p => (p.stockQuantity !== 0 && p.availableQuantity < minStock)).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length,
  };

  // Get stock status
  const getStockStatus = (product) => {
    if (product.stockQuantity === 0) {
      return { status: "outOfStock", text: "Hết hàng", color: "error" };
    }
    if (product.availableQuantity < minStock) {
      return { status: "lowStock", text: "Sắp hết", color: "warning" };
    }
    return { status: "inStock", text: "Còn hàng", color: "success" };
  };

  const reload = () => {
    setSearchText("");
    setStatusFilter("all");
    fetchProducts();
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      width: 300,
      fixed: "left",
      render: (_, record) => (
        <Space>
          <img
            src={record.imageUrls[0]}
            alt={record.productName}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
          <div>
            <Text strong>{record.productName}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: (
        <Tooltip title="Tổng số lượng thực tế trong kho">
          <Space>
            <InboxOutlined />
            <span>Tồn kho thực tế</span>
          </Space>
        </Tooltip>
      ),
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      width: 150,
      align: "center",
      render: (quantity) => (
        <Tag color="blue" style={{ fontSize: 14, padding: "4px 12px" }}>
          {quantity}
        </Tag>
      ),
    },
    {
      title: (
        <Tooltip title="Số lượng đang xử lý (đã đặt nhưng chưa giao)">
          <Space>
            <ClockCircleOutlined />
            <span>Đang xử lý</span>
          </Space>
        </Tooltip>
      ),
      dataIndex: "processingQuantity",
      key: "processingQuantity",
      width: 150,
      align: "center",
      render: (quantity) => (
        <Tag color="orange" style={{ fontSize: 14, padding: "4px 12px" }}>
          {quantity}
        </Tag>
      ),
    },
    {
      title: (
        <Tooltip title="Số lượng có sẵn để bán (Thực tế - Đang xử lý)">
          <Space>
            <CheckCircleOutlined />
            <span>Có thể bán</span>
          </Space>
        </Tooltip>
      ),
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      width: 150,
      align: "center",
      render: (quantity, record) => {
        const percentage = record.stockQuantity > 0
          ? (quantity / record.stockQuantity) * 100
          : 0;
        return (
          <Space direction="vertical" size={2} style={{ width: "100%" }}>
            <Tag color="green" style={{ fontSize: 14, padding: "4px 12px" }}>
              {quantity}
            </Tag>
            <Progress
              percent={percentage}
              size="small"
              showInfo={false}
              strokeColor="#52c41a"
            />
          </Space>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const status = getStockStatus(record);
        const icons = {
          outOfStock: <WarningOutlined />,
          lowStock: <ClockCircleOutlined />,
          inStock: <CheckCircleOutlined />,
        };
        return (
          <Tag
            icon={icons[status.status]}
            color={status.color}
            style={{ fontSize: 13 }}
          >
            {status.text}
          </Tag>
        );
      },
    },
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchSearch =
      searchText === "" ||
      product.productName.toLowerCase().includes(searchText.toLowerCase())

    let matchStatus = true;
    if (statusFilter === "lowStock") {
      matchStatus = product.availableQuantity < minStock && product.stockQuantity > 0;
    } else if (statusFilter === "outOfStock") {
      matchStatus = product.stockQuantity === 0;
    } else if (statusFilter === "inStock") {
      matchStatus = product.availableQuantity >= minStock;
    }

    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div className="admin-responsive-container">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2} className="admin-title-mobile inventory-title" style={{ marginBottom: 8 }}>
            <InboxOutlined style={{ marginRight: 12 }} />
            Quản lý tồn kho sản phẩm
          </Title>
          <Text type="secondary" className="admin-subtitle-mobile inventory-subtitle" style={{ fontSize: 16 }}>
            Theo dõi số lượng sản phẩm trong kho theo thời gian thực
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="stats-row-mobile product-inventory-stats" style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card className="admin-card-responsive dashboard-stat-card">
              <Statistic
                title="Tổng sản phẩm"
                value={stats.totalProducts}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card className="admin-card-responsive dashboard-stat-card">
              <Statistic
                title="Tồn kho thực tế"
                value={stats.totalActual}
                prefix={<InboxOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card className="admin-card-responsive dashboard-stat-card">
              <Statistic
                title="Đang xử lý"
                value={stats.totalProcessing}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card className="admin-card-responsive dashboard-stat-card">
              <Statistic
                title="Có thể bán"
                value={stats.totalAvailable}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card className="admin-card-responsive dashboard-stat-card">
              <Statistic
                title="Sắp hết hàng"
                value={stats.lowStock}
                prefix={<WarningOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card className="admin-card-responsive dashboard-stat-card">
              <Statistic
                title="Hết hàng"
                value={stats.outOfStock}
                prefix={<WarningOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card className="admin-card-responsive">
          {/* Filters */}
          <Row gutter={[16, 16]} className="admin-filter-section" style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8} className="full-width-mobile">
              <Input
                placeholder="Tìm kiếm sản phẩm"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={12} sm={6} md={4} className="full-width-mobile">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
                size="large"
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="inStock">Còn hàng</Option>
                <Option value="lowStock">Sắp hết</Option>
                <Option value="outOfStock">Hết hàng</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4} className="full-width-mobile">
              <Button
                icon={<ReloadOutlined />}
                onClick={
                  () => reload()
                }
                size="large"
                style={{ width: "100%" }}
              >
                Làm mới
              </Button>
            </Col>
            {/* <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
            >
              Xuất báo cáo Excel
            </Button>
          </Col> */}
          </Row>

          {/* Info Cards */}
          <Row gutter={16} className="inventory-info-cards" style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Card size="small" style={{ background: "#f6ffed", border: "1px solid #b7eb8f" }}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Text strong>Giải thích các chỉ số:</Text>
                  <Space wrap>
                    <Tag icon={<InboxOutlined />} color="blue">
                      <strong>Tồn kho thực tế:</strong> Tổng số lượng thực tế có trong kho
                    </Tag>
                    <Tag icon={<ClockCircleOutlined />} color="orange">
                      <strong>Đang xử lý:</strong> Số lượng đã bán nhưng chưa giao (đơn đang xử lý)
                    </Tag>
                    <Tag icon={<CheckCircleOutlined />} color="green">
                      <strong>Có thể bán:</strong> Số lượng sẵn sàng để bán = Thực tế - Đang xử lý
                    </Tag>
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Table */}
          <div className="admin-table-wrapper product-inventory-table">
            <Table
              columns={columns}
              dataSource={filteredProducts}
              loading={loading}
              rowKey="id"
              pagination={{
                total: filteredProducts.length,
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} sản phẩm`,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              scroll={{ x: 880 }}
              bordered
              rowClassName={(record) => {
                const status = getStockStatus(record);
                if (status.status === "outOfStock") return "row-out-of-stock";
                if (status.status === "lowStock") return "row-low-stock";
                return "";
              }}
            />
          </div>
        </Card>

        <style jsx>{`
        .row-out-of-stock {
          background-color: #fff1f0 !important;
        }
        .row-low-stock {
          background-color: #fffbe6 !important;
        }
        .row-out-of-stock:hover,
        .row-low-stock:hover {
          background-color: #fafafa !important;
        }
      `}</style>
      </div>
    </div>
  );
};

export default ProductInventoryPage;