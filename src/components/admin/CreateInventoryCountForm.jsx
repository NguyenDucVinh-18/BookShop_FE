import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  Space,
  Steps,
  Row,
  Col,
  message,
  Tag,
  Badge,
  Empty,
  Modal,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getAllProductsAPI } from "../../service/product.service";
import { createReceiptAPI } from "../../service/inventory.service";
import "../../styles/AdminResponsive.css";
import "../../styles/InventoryCountForm.css";
import { createInventoryCheckAPI } from "../../service/inventoryCheck.service";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Search } = Input;

const CreateInventoryCountForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [searchText, setSearchText] = useState("");
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  // Fetch products từ API
  const fetchProducts = async () => {
    try {
      const res = await getAllProductsAPI();
      if (res && res.data) {
        setProducts(res.data.products);
      }
    } catch (error) {
      message.error("Không thể tải danh sách sản phẩm!");
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter(
    (product) =>
      product.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
      product.id?.toString().includes(searchText)
  );

  // Lấy danh sách sản phẩm đã chọn
  const selectedProductsData = products.filter((product) =>
    selectedProducts.includes(product.id)
  );

  // Thêm sản phẩm vào danh sách
  const handleAddProduct = (productId) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
      // Tự động điền số lượng hệ thống = số lượng tồn kho
      const product = products.find(p => p.id === productId);
      if (product) {
        setProductDetails((prev) => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            systemQuantity: product.stockQuantity || 0,
            actualQuantity: product.stockQuantity || 0,
          },
        }));
      }
      clearError("products");
      message.success("Đã thêm sản phẩm vào danh sách");
    } else {
      message.info("Sản phẩm đã có trong danh sách");
    }
  };

  // Xóa sản phẩm khỏi danh sách
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    const newDetails = { ...productDetails };
    delete newDetails[productId];
    setProductDetails(newDetails);
    message.success("Đã xóa sản phẩm khỏi danh sách");
  };

  // Validate bước 1
  const validateStep1 = () => {
    const errors = {};
    const formValues = form.getFieldsValue();

    if (!formValues.nameInventoryCheckReceipt || formValues.nameInventoryCheckReceipt.trim() === "") {
      errors.nameInventoryCheckReceipt = "Vui lòng nhập tên phiếu kiểm kho!";
    }
    if (selectedProducts.length === 0) {
      errors.products = "Vui lòng chọn ít nhất một sản phẩm!";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate bước 2
  const validateStep2 = () => {
    const errors = {};
    let hasError = false;

    selectedProductsData.forEach((product) => {
      const productId = product.id;
      const details = productDetails[productId] || {};
      const systemQuantity = details.systemQuantity;
      const actualQuantity = details.actualQuantity;

      if (systemQuantity === undefined || systemQuantity === null || systemQuantity < 0) {
        errors[`systemQuantity_${productId}`] = "Vui lòng nhập số lượng hệ thống!";
        hasError = true;
      }
      if (actualQuantity === undefined || actualQuantity === null || actualQuantity < 0) {
        errors[`actualQuantity_${productId}`] = "Vui lòng nhập số lượng thực tế!";
        hasError = true;
      }
    });

    setFormErrors(errors);
    return !hasError;
  };

  // Chuyển sang bước tiếp theo
  const handleNext = () => {
    if (validateStep1()) {
      const formValues = form.getFieldsValue();
      const mergedData = { ...formData, ...formValues };
      setFormData(mergedData);
      setCurrentStep(1);
    }
  };

  // Quay lại bước trước
  const handleBack = () => {
    setCurrentStep(0);
  };

  // Xóa lỗi của field
  const clearError = (field) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Xử lý nút Hủy
  const handleCancel = () => {
    if (currentStep === 0) {
      // Bước 1: Xóa danh sách sản phẩm đã chọn
      if (selectedProducts.length > 0) {
        Modal.confirm({
          title: "Xác nhận",
          icon: <ExclamationCircleOutlined />,
          content: "Bạn có chắc muốn xóa tất cả sản phẩm đã chọn?",
          okText: "Xóa",
          cancelText: "Hủy",
          okButtonProps: { danger: true },
          onOk: () => {
            setSelectedProducts([]);
            setProductDetails({});
            message.success("Đã xóa danh sách sản phẩm đã chọn");
          },
        });
      } else {
        message.info("Chưa có sản phẩm nào được chọn");
      }
    } else {
      // Bước 2: Xóa các trường input đã nhập
      Modal.confirm({
        title: "Xác nhận",
        icon: <ExclamationCircleOutlined />,
        content: "Bạn có chắc muốn xóa tất cả thông tin chi tiết đã nhập?",
        okText: "Xóa",
        cancelText: "Hủy",
        okButtonProps: { danger: true },
        onOk: () => {
          setProductDetails({});
          message.success("Đã xóa thông tin chi tiết sản phẩm");
        },
      });
    }
  };

  // Tạo phiếu kiểm kho
  const handleCreate = async () => {
    try {
      setLoading(true);

      if (!validateStep2()) {
        setLoading(false);
        return;
      }

      const formValues = { ...formData, ...form.getFieldsValue() };

      // Format products theo đúng cấu trúc API
      const products = selectedProductsData.map((product) => {
        const productId = product.id;
        const details = productDetails[productId] || {};

        return {
          productId: productId,
          systemQuantity: details.systemQuantity || 0,
          actualQuantity: details.actualQuantity || 0,
          note: details.note || "",
        };
      });

      //   const payload = {
      //     products: products,
      //     nameInventoryCheckReceipt: formValues.nameInventoryCheckReceipt,
      //     note: formValues.note || "",
      //   };

      //   console.log("📤 Payload:", payload);

      const res = await createInventoryCheckAPI(formValues.nameInventoryCheckReceipt, products, formValues.note || "");

      console.log("📥 Response:", res);

      if (res && res.data) {
        showNotification("success", "Tạo phiếu kiểm kho thành công!");

        // Reset form sau khi tạo thành công
        form.resetFields();
        setSelectedProducts([]);
        setProductDetails({});
        setCurrentStep(0);
        setFormData({});
        setSearchText("");

        if (onSuccess) {
          onSuccess(res.data);
        }
      } else {
        showNotification("error", res.message || "Tạo phiếu kiểm kho thất bại!");
      }
    } catch (error) {
      showNotification("error", "Đã có lỗi xảy ra khi tạo phiếu kiểm kho!");
      console.error("❌ Error creating slip:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Thông tin phiếu kiểm kho",
      icon: <InboxOutlined />,
    },
    {
      title: "Chi tiết sản phẩm",
      icon: <ShoppingCartOutlined />,
    },
  ];

  return (
    <div className="admin-responsive-container inventory-count-page">
      {/* Enhanced Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "12px",
            color: "white",
            fontWeight: "500",
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            backdropFilter: "blur(8px)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                  ? "#ff4d4f"
                  : "#1890ff",
            transform: notification.visible
              ? "translateX(0)"
              : "translateX(100%)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="admin-card-responsive inventory-count-header-card">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className="hide-mobile"
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <PlusOutlined style={{ fontSize: 24, color: "#fff" }} />
          </div>
          <div>
            <Title
              level={2}
              className="admin-title-mobile"
              style={{ margin: 0, color: "#1a1a1a" }}
            >
              Tạo phiếu kiểm kho
            </Title>
            <Text
              type="secondary"
              className="admin-subtitle-mobile"
              style={{ fontSize: 14 }}
            >
              Tạo mới phiếu kiểm kho cho sản phẩm trong kho hàng
            </Text>
          </div>
        </div>
      </div>

      {/* Steps */}
      <Card className="admin-card-responsive inventory-count-steps-card">
        <div className="hide-mobile">
          <Steps current={currentStep} items={steps} />
        </div>
        <div className="show-mobile">
          <Steps current={currentStep} items={steps} size="small" />
        </div>
      </Card>

      <Form form={form} layout="vertical" className="inventory-count-form">
        {currentStep === 0 ? (
          <Row gutter={16} style={{ marginTop: 24 }} className="inventory-count-step-row">
            {/* Left - Form thông tin phiếu */}
            <Col xs={24} xl={8} className="import-export-sidebar">
              <Card
                className="inventory-count-info-card"
                title={
                  <Space>
                    <span style={{ fontSize: 18 }}>📋</span>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>
                      Thông tin phiếu kiểm kho
                    </span>
                  </Space>
                }
                // className="admin-card-responsive"
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  height: "calc(100% - 16px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <Form.Item
                  label={
                    <span style={{ fontWeight: 500, fontSize: 14 }}>
                      Tên phiếu kiểm kho{" "}
                      <span style={{ color: "#ff4d4f" }}>*</span>
                    </span>
                  }
                  name="nameInventoryCheckReceipt"
                  validateStatus={formErrors.nameInventoryCheckReceipt ? "error" : ""}
                  help={formErrors.nameInventoryCheckReceipt}
                >
                  <Input
                    placeholder="Ví dụ: Kiểm kho cuối năm 2025 dãy 2"
                    size="large"
                    onChange={() => clearError("nameInventoryCheckReceipt")}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span style={{ fontWeight: 500, fontSize: 14 }}>
                      Ghi chú
                    </span>
                  }
                  name="note"
                >
                  <TextArea
                    rows={6}
                    placeholder="Nhập ghi chú bổ sung..."
                    style={{ resize: "none" }}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </Card>
            </Col>

            {/* Right - Chọn sản phẩm */}
            <Col xs={24} xl={16}>
              <Row gutter={16} className="inventory-count-product-row">
                {/* Tìm kiếm sản phẩm */}
                <Col xs={24} lg={12}>
                  <Card
                    className="inventory-count-search-card"
                    title={
                      <Space>
                        <span style={{ fontSize: 18 }}>🔍</span>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>
                          Tìm kiếm sản phẩm
                        </span>
                      </Space>
                    }
                    style={{
                      marginBottom: 16,
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Search
                      placeholder="Tìm theo tên hoặc mã sản phẩm..."
                      size="large"
                      prefix={<SearchOutlined />}
                      allowClear
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ marginBottom: 16 }}
                    />

                    <div className="product-list-scroll inventory-count-product-list">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className={`inventory-count-product-item ${selectedProducts.includes(product.id) ? "is-selected" : ""
                              }`}
                            onClick={() => handleAddProduct(product.id)}
                            onMouseEnter={(e) => {
                              if (!selectedProducts.includes(product.id)) {
                                e.currentTarget.style.transform =
                                  "translateY(-2px)";
                                e.currentTarget.style.boxShadow =
                                  "0 4px 12px rgba(0,0,0,0.1)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              if (!selectedProducts.includes(product.id)) {
                                e.currentTarget.style.boxShadow = "none";
                              }
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    marginBottom: 6,
                                    fontSize: 14,
                                    color: "#1a1a1a",
                                  }}
                                >
                                  {product.productName}
                                </div>
                                <Space size="small">
                                  <Tag color="blue" style={{ fontSize: 11 }}>
                                    ID: {product.id}
                                  </Tag>
                                  <Tag
                                    color={
                                      product.stockQuantity === 0
                                        ? "red"
                                        : product.stockQuantity < 10
                                          ? "orange"
                                          : "green"
                                    }
                                    style={{ fontSize: 11 }}
                                  >
                                    Tồn: {product.stockQuantity}
                                  </Tag>
                                </Space>
                              </div>
                              {selectedProducts.includes(product.id) && (
                                <CheckCircleOutlined
                                  style={{ fontSize: 22, color: "#52c41a" }}
                                />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <Empty
                          description="Không tìm thấy sản phẩm"
                          style={{ padding: "40px 0" }}
                        />
                      )}
                    </div>
                  </Card>
                </Col>

                {/* Danh sách đã chọn */}
                <Col xs={24} lg={12}>
                  <Card
                    className="inventory-count-selected-card"
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Space>
                          <span style={{ fontSize: 18 }}>✅</span>
                          <span style={{ fontSize: 16, fontWeight: 600 }}>
                            Đã chọn
                          </span>
                        </Space>
                        <Badge
                          count={selectedProducts.length}
                          style={{
                            backgroundColor: "#52c41a",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          showZero
                        />
                      </div>
                    }
                    style={{
                      marginBottom: 16,
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="selected-products-scroll inventory-count-selected-list">
                      {selectedProductsData.length > 0 ? (
                        selectedProductsData.map((product) => (
                          <div
                            key={product.id}
                            style={{
                              padding: "12px",
                              marginBottom: 8,
                              background: "#fff",
                              borderRadius: 8,
                              border: "1px solid #e8e8e8",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    marginBottom: 6,
                                    fontSize: 14,
                                    color: "#1a1a1a",
                                  }}
                                >
                                  {product.productName}
                                </div>
                                <Tag color="blue" style={{ fontSize: 11 }}>
                                  ID: {product.id}
                                </Tag>
                              </div>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveProduct(product.id)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <Empty
                          description="Chưa chọn sản phẩm nào"
                          style={{ padding: "40px 0" }}
                        />
                      )}
                    </div>
                    {formErrors.products && (
                      <div className="inventory-count-error">
                        <ExclamationCircleOutlined
                          style={{ marginRight: 8, fontSize: 16 }}
                        />
                        {formErrors.products}
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <div style={{ marginTop: 24 }}>
            <Card
              className="inventory-count-detail-card"
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <span style={{ fontSize: 18 }}>📦</span>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>
                      Nhập thông tin chi tiết
                    </span>
                  </Space>
                  <Tag
                    color="blue"
                    style={{
                      fontSize: 13,
                      padding: "6px 14px",
                      borderRadius: 6,
                    }}
                  >
                    {selectedProductsData.length} sản phẩm
                  </Tag>
                </div>
              }
              // className="admin-card-responsive"
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div className="inventory-count-detail-wrapper">
                {selectedProductsData.map((product, index) => {
                  const details = productDetails[product.id] || {};
                  const diff = (details.actualQuantity || 0) - (details.systemQuantity || 0);

                  return (
                    <Card
                      key={product.id}
                      className="inventory-count-product-detail-card"
                    >
                      <Row gutter={16} className="inventory-count-detail-row">
                        <Col span={24}>
                          <div style={{ marginBottom: 16 }}>
                            <Text
                              strong
                              style={{ fontSize: 16, color: "#1a1a1a" }}
                            >
                              {product.productName}
                            </Text>
                            <Tag
                              color="blue"
                              style={{ marginLeft: 8, fontSize: 11 }}
                            >
                              ID: {product.id}
                            </Tag>
                            <Tag
                              color={
                                product.stockQuantity === 0
                                  ? "red"
                                  : product.stockQuantity < 10
                                    ? "orange"
                                    : "green"
                              }
                              style={{ fontSize: 11 }}
                            >
                              Tồn kho: {product.stockQuantity}
                            </Tag>
                            {diff !== 0 && (
                              <Tag
                                color={diff > 0 ? "success" : "error"}
                                style={{ fontSize: 11 }}
                              >
                                Chênh lệch: {diff > 0 ? '+' : ''}{diff}
                              </Tag>
                            )}
                          </div>
                        </Col>
                        <Col xs={24} md={6}>
                          <div style={{ marginBottom: 8 }}>
                            <Text
                              type="secondary"
                              style={{ fontSize: 13, fontWeight: 500 }}
                            >
                              SL hệ thống <span style={{ color: "#ff4d4f" }}>*</span>
                            </Text>
                          </div>
                          <Input
                            placeholder="0"
                            type="number"
                            min={0}
                            size="large"
                            status={
                              formErrors[`systemQuantity_${product.id}`] ? "error" : ""
                            }
                            value={details.systemQuantity ?? ""}
                            onChange={(e) => {
                              clearError(`systemQuantity_${product.id}`);
                              setProductDetails((prev) => ({
                                ...prev,
                                [product.id]: {
                                  ...prev[product.id],
                                  systemQuantity: parseInt(e.target.value) || 0,
                                },
                              }));
                            }}
                          />
                          {formErrors[`systemQuantity_${product.id}`] && (
                            <Text type="danger" style={{ fontSize: 12 }}>
                              {formErrors[`systemQuantity_${product.id}`]}
                            </Text>
                          )}
                        </Col>
                        <Col xs={24} md={6}>
                          <div style={{ marginBottom: 8 }}>
                            <Text
                              type="secondary"
                              style={{ fontSize: 13, fontWeight: 500 }}
                            >
                              SL thực tế <span style={{ color: "#ff4d4f" }}>*</span>
                            </Text>
                          </div>
                          <Input
                            placeholder="0"
                            type="number"
                            min={0}
                            size="large"
                            status={
                              formErrors[`actualQuantity_${product.id}`] ? "error" : ""
                            }
                            value={details.actualQuantity ?? ""}
                            onChange={(e) => {
                              clearError(`actualQuantity_${product.id}`);
                              setProductDetails((prev) => ({
                                ...prev,
                                [product.id]: {
                                  ...prev[product.id],
                                  actualQuantity: parseInt(e.target.value) || 0,
                                },
                              }));
                            }}
                          />
                          {formErrors[`actualQuantity_${product.id}`] && (
                            <Text type="danger" style={{ fontSize: 12 }}>
                              {formErrors[`actualQuantity_${product.id}`]}
                            </Text>
                          )}
                        </Col>
                        <Col xs={24} md={12}>
                          <div style={{ marginBottom: 8 }}>
                            <Text
                              type="secondary"
                              style={{ fontSize: 13, fontWeight: 500 }}
                            >
                              Ghi chú
                            </Text>
                          </div>
                          <Input
                            placeholder="Ghi chú (tùy chọn)"
                            size="large"
                            value={details.note || ""}
                            onChange={(e) => {
                              setProductDetails((prev) => ({
                                ...prev,
                                [product.id]: {
                                  ...prev[product.id],
                                  note: e.target.value,
                                },
                              }));
                            }}
                          />
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Action buttons */}
        <Card className="inventory-count-action-card">
          <div className="inventory-count-action-bar">
            <Button
              className="inventory-count-action-btn"
              size="large"
              onClick={handleCancel}
              style={{ minWidth: 120 }}
            >
              Hủy
            </Button>

            <div className="inventory-count-action-right">
              {currentStep === 1 && (
                <Button
                  className="inventory-count-action-btn"
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBack}
                  style={{ minWidth: 120 }}
                >
                  Quay lại
                </Button>
              )}
              {currentStep === 0 ? (
                <Button
                  type="primary"
                  className="inventory-count-action-btn primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={handleNext}
                  style={{ minWidth: 140, fontWeight: 500 }}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="inventory-count-action-btn primary"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleCreate}
                  style={{
                    minWidth: 140,
                    fontWeight: 500,
                    background: "#52c41a",
                    borderColor: "#52c41a",
                  }}
                >
                  Tạo phiếu
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default CreateInventoryCountForm;