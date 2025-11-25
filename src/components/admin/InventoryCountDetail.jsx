import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Descriptions,
  Empty,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "../../styles/InventoryCountDetail.css";

const { Title, Text } = Typography;

const InventoryCountDetail = ({ slip, onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  console.log("Slip data:", slip);

  // Process product details from slip
  useEffect(() => {
    const processProductDetails = async () => {
      if (!slip.details || slip.details.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productsData = slip.details.map((detail) => {
          const diff = detail.actualQuantity - detail.systemQuantity;

          return {
            key: detail.id,
            id: detail.product.id,
            name: detail.product.productName,
            systemQuantity: detail.systemQuantity,
            actualQuantity: detail.actualQuantity,
            difference: diff,
            note: detail.note || "Không có ghi chú",
            productData: detail.product,
          };
        });

        setProducts(productsData);
      } catch (error) {
        console.error("Error processing product details:", error);
      } finally {
        setLoading(false);
      }
    };

    processProductDetails();
  }, [slip]);

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã SP",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => (
        <Text strong style={{ color: "#1890ff" }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "SL Hệ thống",
      dataIndex: "systemQuantity",
      key: "systemQuantity",
      width: 120,
      align: "center",
      render: (qty) => (
        <Tag color="blue" style={{ fontSize: 14 }}>
          {qty}
        </Tag>
      ),
    },
    {
      title: "SL Thực tế",
      dataIndex: "actualQuantity",
      key: "actualQuantity",
      width: 120,
      align: "center",
      render: (qty) => (
        <Tag color="green" style={{ fontSize: 14 }}>
          {qty}
        </Tag>
      ),
    },
    {
      title: "Chênh lệch",
      dataIndex: "difference",
      key: "difference",
      width: 120,
      align: "center",
      render: (diff) => {
        if (diff === 0) {
          return (
            <Tag color="default" icon={<CheckCircleOutlined />} style={{ fontSize: 14 }}>
              Khớp
            </Tag>
          );
        }
        return (
          <Tag
            color={diff > 0 ? "success" : "error"}
            icon={<WarningOutlined />}
            style={{ fontSize: 14 }}
          >
            {diff > 0 ? "+" : ""}{diff}
          </Tag>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      render: (text) => <Text type="secondary">{text}</Text>,
    },
  ];

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    matched: products.filter(p => p.difference === 0).length,
    surplus: products.filter(p => p.difference > 0).length,
    deficit: products.filter(p => p.difference < 0).length,
    totalSystemQty: products.reduce((sum, item) => sum + (item.systemQuantity || 0), 0),
    totalActualQty: products.reduce((sum, item) => sum + (item.actualQuantity || 0), 0),
    totalDifference: products.reduce((sum, item) => sum + (item.difference || 0), 0),
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderMobileProducts = () => (
    <div className="inventory-count-detail-mobile-list">
      {products.map((item) => (
        <Card key={item.key} className="inventory-count-detail-mobile-card" size="small">
          <div className="inventory-count-detail-mobile-card__header">
            <Text strong>#{item.id}</Text>
            <Tag color={item.difference === 0 ? "success" : item.difference > 0 ? "blue" : "error"}>
              {item.difference === 0 ? "Khớp" : `${item.difference > 0 ? "+" : ""}${item.difference}`}
            </Tag>
          </div>
          <div className="inventory-count-detail-mobile-name">{item.name}</div>
          <div className="inventory-count-detail-mobile-meta">
            <div>
              <Text type="secondary">SL hệ thống</Text>
              <div>{item.systemQuantity}</div>
            </div>
            <div>
              <Text type="secondary">SL thực tế</Text>
              <div>{item.actualQuantity}</div>
            </div>
          </div>
          {item.note && item.note !== "Không có ghi chú" && (
            <div className="inventory-count-detail-mobile-note">
              <Text type="secondary">Ghi chú:</Text> {item.note}
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  return (
    <div className="inventory-count-detail-page">
      <div className="inventory-count-detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          size="large"
          className="inventory-count-detail-back"
        >
          Quay lại danh sách
        </Button>

        <div className="inventory-count-detail-title-wrap">
          <div className="inventory-count-detail-title-info">
            <FileTextOutlined className="inventory-count-detail-title-icon" />
            <div>
              <Title level={2} className="inventory-count-detail-title">
                Chi tiết phiếu kiểm kho
              </Title>
              <Text className="inventory-count-detail-subtitle">
                Theo dõi toàn bộ thông tin và kết quả kiểm kho
              </Text>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            size="large"
            onClick={() => window.print()}
            className="inventory-count-detail-print-btn"
          >
            In phiếu
          </Button>
        </div>
      </div>

      <Card className="inventory-count-detail-status-card">
        <Space size="large" wrap>
          <Tag icon={<CheckCircleOutlined />} color="processing" className="inventory-count-detail-status-tag">
            PHIẾU KIỂM KHO
          </Tag>
          <Text strong className="inventory-count-detail-name">
            {slip.nameInventoryCheckReceipt || "Chưa đặt tên phiếu"}
          </Text>
        </Space>
      </Card>

      <Card className="inventory-count-detail-info-card" title="Thông tin phiếu kiểm kho" bordered={false}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
          <Descriptions.Item
            label={
              <Space>
                <FileTextOutlined />
                <span>Mã phiếu</span>
              </Space>
            }
          >
            <Text strong style={{ color: "#1890ff" }}>
              #{slip.id}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined />
                <span>Ngày tạo</span>
              </Space>
            }
          >
            {new Date(slip.createdAt).toLocaleString("vi-VN")}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <UserOutlined />
                <span>Người tạo</span>
              </Space>
            }
          >
            Admin
          </Descriptions.Item>

          <Descriptions.Item label="Tổng số sản phẩm" span={3}>
            <Space size="large" wrap>
              <Text strong className="inventory-count-detail-quantity">
                {stats.totalProducts} sản phẩm
              </Text>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Khớp: {stats.matched}
              </Tag>
              <Tag color="warning" icon={<WarningOutlined />}>
                Thừa: {stats.surplus}
              </Tag>
              <Tag color="error" icon={<WarningOutlined />}>
                Thiếu: {stats.deficit}
              </Tag>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú" span={3}>
            <Text>{slip.note || "Không có ghi chú"}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={16} className="inventory-count-detail-stats">
        <Col xs={24} sm={8}>
          <Card className="inventory-count-detail-stat-card">
            <Text type="secondary">Tổng SL Hệ thống</Text>
            <Title level={3} className="inventory-count-detail-stat-value blue">
              {stats.totalSystemQty}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="inventory-count-detail-stat-card">
            <Text type="secondary">Tổng SL Thực tế</Text>
            <Title level={3} className="inventory-count-detail-stat-value green">
              {stats.totalActualQty}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="inventory-count-detail-stat-card">
            <Text type="secondary">Tổng Chênh lệch</Text>
            <Title
              level={3}
              className={`inventory-count-detail-stat-value ${stats.totalDifference === 0 ? "green" : stats.totalDifference > 0 ? "blue" : "red"
                }`}
            >
              {stats.totalDifference > 0 ? "+" : ""}
              {stats.totalDifference}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card
        className="inventory-count-detail-table-card"
        title="Danh sách sản phẩm kiểm kho"
        bordered={false}
      >
        {loading ? (
          <div className="inventory-count-detail-loading">
            <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
          </div>
        ) : products.length > 0 ? (
          isMobile ? (
            renderMobileProducts()
          ) : (
            <Table
              columns={columns}
              dataSource={products}
              pagination={false}
              size="middle"
              className="inventory-count-detail-table"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <Text strong>TỔNG CỘNG:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      <Tag color="blue" className="inventory-count-detail-summary-tag">
                        {stats.totalSystemQty}
                      </Tag>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="center">
                      <Tag color="green" className="inventory-count-detail-summary-tag">
                        {stats.totalActualQty}
                      </Tag>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="center">
                      <Tag
                        color={stats.totalDifference === 0 ? "default" : stats.totalDifference > 0 ? "success" : "error"}
                        className="inventory-count-detail-summary-tag"
                      >
                        {stats.totalDifference > 0 ? "+" : ""}
                        {stats.totalDifference}
                      </Tag>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} />
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          )
        ) : (
          <Empty description="Phiếu này chưa có sản phẩm nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .ant-btn,
          .ant-breadcrumb {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InventoryCountDetail;