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
import "../../styles/ImportExportDetail.css";

const { Title, Text } = Typography;

const ImportExportDetail = ({ slip, onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isImport = slip.typeStockReceipt === "IMPORT";
  console.log("Slip data:", slip);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
            const productId = detail.product.id;
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

  const renderMobileCards = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="import-export-detail-empty-state">
          <Empty
            description="Phiếu này chưa có sản phẩm nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    return (
      <div className="import-export-detail-mobile-list">
        {products.map((product, index) => (
          <Card key={product.key} className="import-export-detail-mobile-card">
            <div className="import-export-detail-mobile-card__header">
              <div>
                <Text className="import-export-detail-mobile-index">
                  #{index + 1}
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text strong className="import-export-detail-mobile-id">
                    ID: {product.id}
                  </Text>
                </div>
              </div>
              <Tag
                color={isImport ? "success" : "warning"}
                style={{ fontSize: 13 }}
              >
                {isImport ? "+" : "-"}
                {product.quantity}
              </Tag>
            </div>

            <div className="import-export-detail-mobile-card__meta">
              <div className="import-export-detail-mobile-name">
                {product.name}
              </div>
              {isImport && product.supplier && (
                <div className="import-export-detail-mobile-supplier">
                  <Space>
                    <ShopOutlined />
                    <Text>{product.supplier}</Text>
                  </Space>
                </div>
              )}
              {product.note && product.note !== "Không có ghi chú" && (
                <div className="import-export-detail-mobile-note">
                  {product.note}
                </div>
              )}
            </div>
          </Card>
        ))}
        {/* Total Summary */}
        <Card className="import-export-detail-mobile-card" style={{ background: "#fafafa" }}>
          <div style={{ textAlign: "center", padding: "12px" }}>
            <Text strong style={{ fontSize: 16, marginRight: 8 }}>
              TỔNG CỘNG:
            </Text>
            <Tag
              color={isImport ? "success" : "warning"}
              style={{ fontSize: 16, padding: "4px 12px" }}
            >
              {isImport ? "+" : "-"}
              {totalQuantity}
            </Tag>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="import-export-detail-page-container">
      {/* Header with back button */}
      <div className="import-export-detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          size={isMobile ? "middle" : "large"}
          className="import-export-detail-back-btn"
        >
          Quay lại danh sách
        </Button>

        <div className="import-export-detail-title-section">
          <Title level={2} className="import-export-detail-title">
            <FileTextOutlined style={{ marginRight: 12, fontSize: isMobile ? 20 : 24 }} />
            Chi tiết phiếu {isImport ? "nhập kho" : "xuất kho"}
          </Title>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            size={isMobile ? "middle" : "large"}
            onClick={() => window.print()}
            block={isMobile}
          >
            In phiếu
          </Button>
        </div>
      </div>

      {/* Status and Type Card */}
      <Card className="import-export-detail-status-card">
        <Space size="large" wrap>
          {isImport ? (
            <Tag
              icon={<ImportOutlined />}
              color="success"
              style={{ fontSize: isMobile ? 14 : 16, padding: isMobile ? "6px 12px" : "8px 16px" }}
            >
              PHIẾU NHẬP KHO
            </Tag>
          ) : (
            <Tag
              icon={<ExportOutlined />}
              color="warning"
              style={{ fontSize: isMobile ? 14 : 16, padding: isMobile ? "6px 12px" : "8px 16px" }}
            >
              PHIẾU XUẤT KHO
            </Tag>
          )}
          <Text strong style={{ fontSize: isMobile ? 14 : 16 }}>
            {slip.nameStockReceipt || "Chưa đặt tên phiếu"}
          </Text>
        </Space>
      </Card>

      {/* Information Card */}
      <Card
        title={
          <Text strong style={{ fontSize: isMobile ? 14 : 16 }}>
            Thông tin phiếu
          </Text>
        }
        className="import-export-detail-info-card"
      >
        <Descriptions
          column={isMobile ? 1 : { xs: 1, sm: 2, md: 3 }}
          bordered
          className="import-export-detail-descriptions"
          labelStyle={{ width: isMobile ? "35%" : "auto", whiteSpace: "normal" }}
        >
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
          <Text strong style={{ fontSize: isMobile ? 14 : 16 }}>
            Danh sách sản phẩm {isImport ? "nhập kho" : "xuất kho"}
          </Text>
        }
        className="import-export-detail-products-card"
      >
        {isMobile ? (
          renderMobileCards()
        ) : (
          <div className="import-export-detail-table-wrapper">
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
                size="middle"
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
          </div>
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