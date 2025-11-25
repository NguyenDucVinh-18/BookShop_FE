import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Button,
  Progress,
  Tooltip,
  Alert,
  Image,
  Empty,
  Pagination,
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
import "../../styles/ProductInventory.css";
import "../../styles/Dashboard.css";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(1);
  const mobilePageSize = 8;
  const minStock = 10; // Minimum stock threshold for low stock warning

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Reset mobile page to 1 when filtered products change
  useEffect(() => {
    setMobileCurrentPage(1);
  }, [searchText, statusFilter]);

  // Scroll to top when page changes (only if page > 1)
  useEffect(() => {
    if (mobileCurrentPage > 1) {
      const element = document.getElementById("inventory-mobile-list");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [mobileCurrentPage]);

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalActual: products.reduce((sum, p) => sum + p.stockQuantity, 0),
    totalProcessing: products.reduce((sum, p) => sum + p.processingQuantity, 0),
    totalAvailable: products.reduce((sum, p) => sum + p.availableQuantity, 0),
    lowStock: products.filter(p => (p.stockQuantity !== 0 && p.availableQuantity < minStock)).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length,
  };

  // Stat cards data
  const statCards = [
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: <ShoppingCartOutlined />,
      gradient: "dashboard-gradient-blue",
    },
    {
      title: "Tồn kho thực tế",
      value: stats.totalActual.toLocaleString("vi-VN"),
      icon: <InboxOutlined />,
      gradient: "dashboard-gradient-purple",
    },
    {
      title: "Đang xử lý",
      value: stats.totalProcessing.toLocaleString("vi-VN"),
      icon: <ClockCircleOutlined />,
      gradient: "dashboard-gradient-pink",
    },
    {
      title: "Có thể bán",
      value: stats.totalAvailable.toLocaleString("vi-VN"),
      icon: <CheckCircleOutlined />,
      gradient: "dashboard-gradient-green",
    },
    {
      title: "Sắp hết hàng",
      value: stats.lowStock,
      icon: <WarningOutlined />,
      gradient: "dashboard-gradient-pink",
    },
    {
      title: "Hết hàng",
      value: stats.outOfStock,
      icon: <WarningOutlined />,
      gradient: "dashboard-gradient-pink",
    },
  ];

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

  const reload = async () => {
    setRefreshing(true);
    setSearchText("");
    setStatusFilter("all");
    await fetchProducts();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
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
    <div className="inventory-page-container">
      <div className="inventory-content">
        <div className="inventory-panel">
          {/* Header */}
          <div className="inventory-header">
            <Title level={2} className="inventory-title">
              Quản lý tồn kho sản phẩm
            </Title>
            <Text className="inventory-subtitle">
              Theo dõi số lượng sản phẩm trong kho theo thời gian thực
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="inventory-stat-grid" style={{ marginLeft: 0, marginRight: 0 }}>
            {statCards.map((stat, index) => (
              <Col xs={12} sm={12} md={12} lg={8} xl={4} key={index} style={{ marginBottom: 0 }}>
                <Card className="inventory-card inventory-stat-card" bordered={false}>
                  <div className="inventory-stat-content">
                    <div className="inventory-stat-info">
                      <Text className="inventory-stat-label">{stat.title}</Text>
                      <div className="inventory-stat-value">{stat.value}</div>
                    </div>
                    <div className={`inventory-stat-icon ${stat.gradient}`}>
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Main Content Card */}
          <Card className="inventory-filter-card">
            {/* Filters */}
            <Row gutter={[16, 16]} className="inventory-filter-row" style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Tìm kiếm sản phẩm"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>
              <Col xs={12} sm={6} md={4}>
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
              <Col xs={12} sm={6} md={4}>
                <Button
                  icon={<ReloadOutlined spin={refreshing} />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    reload();
                  }}
                  size="large"
                  style={{ width: "100%", position: "relative", zIndex: 2 }}
                  type="default"
                  loading={refreshing}
                >
                  Làm mới
                </Button>
              </Col>
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

            {/* Table or Mobile List */}
            {isMobile ? (
              <>
                <div className="inventory-mobile-list" id="inventory-mobile-list">
                  {filteredProducts.length === 0 ? (
                    <div className="inventory-empty-state">
                      <Empty description="Không có sản phẩm nào" />
                    </div>
                  ) : (
                    filteredProducts
                      .slice((mobileCurrentPage - 1) * mobilePageSize, mobileCurrentPage * mobilePageSize)
                      .map((product) => {
                        const status = getStockStatus(product);
                        const statusIcons = {
                          outOfStock: <WarningOutlined />,
                          lowStock: <ClockCircleOutlined />,
                          inStock: <CheckCircleOutlined />,
                        };
                        const percentage = product.stockQuantity > 0
                          ? (product.availableQuantity / product.stockQuantity) * 100
                          : 0;

                        return (
                          <div key={product.id} className="inventory-mobile-card">
                            <div className="inventory-mobile-card__header">
                              <Image
                                src={product.imageUrls?.[0] || "https://via.placeholder.com/60"}
                                alt={product.productName}
                                className="inventory-mobile-image"
                                fallback="https://via.placeholder.com/60"
                                preview={false}
                              />
                              <div className="inventory-mobile-name">{product.productName}</div>
                            </div>
                            <div className="inventory-mobile-card__meta">
                              <div className="inventory-mobile-meta-item">
                                <Text className="inventory-mobile-meta-label">Tồn kho thực tế</Text>
                                <Tag color="blue" className="inventory-mobile-meta-value">
                                  {product.stockQuantity}
                                </Tag>
                              </div>
                              <div className="inventory-mobile-meta-item">
                                <Text className="inventory-mobile-meta-label">Đang xử lý</Text>
                                <Tag color="orange" className="inventory-mobile-meta-value">
                                  {product.processingQuantity}
                                </Tag>
                              </div>
                              <div className="inventory-mobile-meta-item">
                                <Text className="inventory-mobile-meta-label">Có thể bán</Text>
                                <Tag color="green" className="inventory-mobile-meta-value">
                                  {product.availableQuantity}
                                </Tag>
                              </div>
                              <div className="inventory-mobile-meta-item">
                                <Text className="inventory-mobile-meta-label">Tỷ lệ</Text>
                                <Progress
                                  percent={percentage}
                                  size="small"
                                  showInfo={false}
                                  strokeColor="#52c41a"
                                />
                              </div>
                            </div>
                            <div className="inventory-mobile-status">
                              <Tag
                                icon={statusIcons[status.status]}
                                color={status.color}
                                style={{ fontSize: 13 }}
                              >
                                {status.text}
                              </Tag>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
                {filteredProducts.length > mobilePageSize && (
                  <div className="inventory-mobile-pagination">
                    <Pagination
                      current={mobileCurrentPage}
                      total={filteredProducts.length}
                      pageSize={mobilePageSize}
                      onChange={(page) => setMobileCurrentPage(page)}
                      simple
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="inventory-table-wrapper">
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
                  scroll={{ x: "max-content" }}
                  size="middle"
                  bordered
                  rowClassName={(record) => {
                    const status = getStockStatus(record);
                    if (status.status === "outOfStock") return "row-out-of-stock";
                    if (status.status === "lowStock") return "row-low-stock";
                    return "";
                  }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
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
  );
};

export default ProductInventoryPage;