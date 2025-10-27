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
  Divider,
  Empty,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  FileTextOutlined,
  ImportOutlined,
  ExportOutlined,
  CalendarOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { getProductByIdAPI } from "../../service/product.service";


const { Title, Text } = Typography;

const ImportExportDetail = ({ slip, onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isImport = slip.typeStockReceipt === "IMPORT";
  console.log("Slip data:", slip);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slip.details || slip.details.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all products concurrently
        const productPromises = slip.details.map(async (detail) => {
          try {
            // Assuming detail has productId field
            const productId = detail.product.id ;
            const response = await getProductByIdAPI(productId);
            
            return {
              key: detail.id,
              id: productId,
              name: response.data?.product?.productName || `Sản phẩm ${productId}`,
              quantity: detail.quantity,
              note: detail.note || "Không có ghi chú",
              supplier: detail.supplier || "Chưa xác định",
              productData: response.data,
            };
          } catch (error) {
            console.error(`Error fetching product ${detail.id}:`, error);
            return {
              key: detail.id,
              id: detail.id,
              name: `Sản phẩm ${detail.id}`,
              quantity: detail.quantity,
              note: detail.note || "Không có ghi chú",
              supplier: detail.supplier || "Chưa xác định",
              error: true,
            };
          }
        });

        const productsData = await Promise.all(productPromises);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
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
      title: "Mã sản phẩm",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id) => (
        <Text strong style={{ color: "#1890ff" }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center",
      render: (quantity) => (
        <Tag color={isImport ? "success" : "warning"} style={{ fontSize: 14 }}>
          {isImport ? "+" : "-"}
          {quantity}
        </Tag>
      ),
    },
    ...(isImport
      ? [
          {
            title: "Nhà cung cấp",
            dataIndex: "supplier",
            key: "supplier",
            width: 200,
            render: (text) => (
              <Space>
                <ShopOutlined />
                <Text>{text}</Text>
              </Space>
            ),
          },
        ]
      : []),
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      render: (text) => <Text type="secondary">{text}</Text>,
    },
  ];

  // Calculate total quantity
  const totalQuantity = products.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

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
              Chi tiết phiếu {isImport ? "nhập kho" : "xuất kho"}
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

      {/* Status and Type Card */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          {isImport ? (
            <Tag
              icon={<ImportOutlined />}
              color="success"
              style={{ fontSize: 16, padding: "8px 16px" }}
            >
              PHIẾU NHẬP KHO
            </Tag>
          ) : (
            <Tag
              icon={<ExportOutlined />}
              color="warning"
              style={{ fontSize: 16, padding: "8px 16px" }}
            >
              PHIẾU XUẤT KHO
            </Tag>
          )}
          <Text strong style={{ fontSize: 16 }}>
            {slip.nameStockReceipt || "Chưa đặt tên phiếu"}
          </Text>
        </Space>
      </Card>

      {/* Information Card */}
      <Card
        title={
          <Text strong style={{ fontSize: 16 }}>
            Thông tin phiếu
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
              {slip.id}
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

          <Descriptions.Item label="Tổng số mặt hàng" span={3}>
            <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
              {products.length} mặt hàng
            </Text>
            {" - "}
            <Text strong style={{ fontSize: 16, color: isImport ? "#52c41a" : "#faad14" }}>
              Tổng số lượng: {isImport ? "+" : "-"}
              {totalQuantity}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú" span={3}>
            <Text>{slip.note || "Không có ghi chú"}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Products Table */}
      <Card
        title={
          <Text strong style={{ fontSize: 16 }}>
            Danh sách sản phẩm {isImport ? "nhập kho" : "xuất kho"}
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
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <Text strong style={{ fontSize: 16 }}>
                      TỔNG CỘNG:
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center">
                    <Tag
                      color={isImport ? "success" : "warning"}
                      style={{ fontSize: 16, padding: "4px 12px" }}
                    >
                      {isImport ? "+" : "-"}
                      {totalQuantity}
                    </Tag>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={2}
                    colSpan={isImport ? 2 : 1}
                  />
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

export default ImportExportDetail;