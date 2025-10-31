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

const { Title, Text } = Typography;

const InventoryCountDetail = ({ slip, onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header with back button */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          size="large"
          style={{ marginBottom: 16 }}
        >
          Quay lại danh sách
        </Button>

        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ marginBottom: 8 }}>
              <FileTextOutlined style={{ marginRight: 12 }} />
              Chi tiết phiếu kiểm kho
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              size="large"
              onClick={() => window.print()}
            >
              In phiếu
            </Button>
          </Col>
        </Row>
      </div>

      {/* Status Card */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <Tag
            icon={<CheckCircleOutlined />}
            color="processing"
            style={{ fontSize: 16, padding: "8px 16px" }}
          >
            PHIẾU KIỂM KHO
          </Tag>
          <Text strong style={{ fontSize: 16 }}>
            {slip.nameInventoryCheckReceipt || "Chưa đặt tên phiếu"}
          </Text>
        </Space>
      </Card>

      {/* Information Card */}
      <Card
        title={
          <Text strong style={{ fontSize: 16 }}>
            Thông tin phiếu kiểm kho
          </Text>
        }
        style={{ marginBottom: 24 }}
      >
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
              <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
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

      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text type="secondary">Tổng SL Hệ thống</Text>
              <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                {stats.totalSystemQty}
              </Title>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text type="secondary">Tổng SL Thực tế</Text>
              <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
                {stats.totalActualQty}
              </Title>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text type="secondary">Tổng Chênh lệch</Text>
              <Title 
                level={3} 
                style={{ 
                  margin: 0, 
                  color: stats.totalDifference === 0 ? "#52c41a" : stats.totalDifference > 0 ? "#1890ff" : "#ff4d4f" 
                }}
              >
                {stats.totalDifference > 0 ? "+" : ""}{stats.totalDifference}
              </Title>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Card
        title={
          <Text strong style={{ fontSize: 16 }}>
            Danh sách sản phẩm kiểm kho
          </Text>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
          </div>
        ) : products.length > 0 ? (
          <Table
            columns={columns}
            dataSource={products}
            pagination={false}
            bordered
            scroll={{ x: 1000 }}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <Text strong style={{ fontSize: 16 }}>
                      TỔNG CỘNG:
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center">
                    <Tag color="blue" style={{ fontSize: 16, padding: "4px 12px" }}>
                      {stats.totalSystemQty}
                    </Tag>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">
                    <Tag color="green" style={{ fontSize: 16, padding: "4px 12px" }}>
                      {stats.totalActualQty}
                    </Tag>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">
                    <Tag 
                      color={stats.totalDifference === 0 ? "default" : stats.totalDifference > 0 ? "success" : "error"}
                      style={{ fontSize: 16, padding: "4px 12px" }}
                    >
                      {stats.totalDifference > 0 ? "+" : ""}{stats.totalDifference}
                    </Tag>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        ) : (
          <Empty
            description="Phiếu này chưa có sản phẩm nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
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