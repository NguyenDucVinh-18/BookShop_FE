import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Popconfirm,
  Space,
  Tag,
  Image,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  Badge,
  Tooltip,
  Avatar,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  ShoppingOutlined,
  BookOutlined,
  FileTextOutlined,
  PictureOutlined,
  DollarOutlined,
  InboxOutlined,
  StarOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import {
  createProductAPI,
  getAllProductsAPI,
  updateDiscountPercentageAPI,
  updateProductAPI,
  deleteProductAPI,
  addImagesToProductAPI,
  removeImageFromProductAPI,
} from "../../service/product.service";
import { getAllCategoriesAPI } from "../../service/category.service";
import "../../styles/ProductManagement.css";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Dragger } = Upload;

const CommonProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [currentImageFileList, setCurrentImageFileList] = useState([]);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  // State cho view modal
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);

  // State cho discount modal
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [discountingProduct, setDiscountingProduct] = useState(null);
  const [discountForm] = Form.useForm();

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  const [form] = Form.useForm();

  // Product types with icons and colors
  const productTypes = [
    {
      value: "BOOK",
      label: "Sách",
      icon: <BookOutlined />,
      color: "#1890ff",
    },
    {
      value: "COMIC",
      label: "Truyện",
      icon: <FileTextOutlined />,
      color: "#52c41a",
    },
    {
      value: "STATIONERY",
      label: "Văn phòng phẩm",
      icon: <EditOutlined />,
      color: "#fa8c16",
    },
  ];

  // Statistics calculation
  const getStatistics = () => {
    let totalProducts;
    if (products && products.length) {
      totalProducts = products.length;
      const totalValue = products.reduce(
        (sum, product) => sum + product.price * product.stockQuantity,
        0
      );
      const lowStockCount = products.filter(
        (product) => product.stockQuantity < 10
      ).length;

      return { totalProducts, totalValue, lowStockCount };
    } else {
      return { totalProducts: 0, totalValue: 0, lowStockCount: 0 };
    }
  };

  const statistics = getStatistics();

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await getAllProductsAPI();
      if (res && res.data) {
        setProducts(res.data.products);
      } else {
        message.error("Không thể lấy danh sách sản phẩm");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  const fetchCategories = async () => {
    const res = await getAllCategoriesAPI();
    if (res && res.data) {
      setCategories(res.data.categories);
    } else {
      message.error("Không thể lấy danh sách danh mục");
    }
  };

  // Enhanced table columns
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrls",
      key: "image",
      width: 90,
      render: (imageUrls, record) => (
        <div style={{ position: "relative" }}>
          <Avatar
            shape="square"
            size={64}
            src={
              imageUrls && imageUrls[0]
                ? imageUrls[0]
                : "https://via.placeholder.com/64x64?text=No+Image"
            }
            icon={<PictureOutlined />}
            style={{
              border: "2px solid #f0f0f0",
              borderRadius: "8px",
            }}
          />
          {imageUrls && imageUrls.length > 1 && (
            <Badge
              count={imageUrls.length}
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                backgroundColor: "#1890ff",
              }}
            />
          )}
        </div>
      ),
    },
    {
      title: "Thông tin sản phẩm",
      key: "productInfo",
      width: 250,
      render: (_, record) => (
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
            {record.productName}
          </Title>
          <div style={{ marginTop: 8 }}>
            {record.authorNames && record.authorNames.length > 0 && (
              <Text style={{ fontSize: "11px", color: "#666" }}>
                Tác giả: {record.authorNames.join(", ")}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Loại & Danh mục",
      key: "typeCategory",
      width: 160,
      render: (_, record) => {
        const productType = productTypes.find(
          (pt) => pt.value === record.productType
        );
        return (
          <Space direction="vertical" size="small">
            <Tag
              color={productType?.color || "default"}
              icon={productType?.icon}
              style={{ borderRadius: "6px", fontWeight: "500" }}
            >
              {productType ? productType.label : record.productType}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "Giá & Tồn kho",
      key: "priceStock",
      width: 160,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            {record.discountPercentage > 0 ? (
              <Space direction="vertical" size={0}>
                <Text delete type="secondary" style={{ fontSize: "12px" }}>
                  {record.price?.toLocaleString("vi-VN")} đ
                </Text>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <DollarOutlined style={{ color: "#ff4d4f" }} />
                  <Text strong style={{ color: "#ff4d4f", fontSize: "14px" }}>
                    {record.priceAfterDiscount?.toLocaleString("vi-VN")} đ
                  </Text>
                  <Tag color="red" style={{ margin: 0, fontSize: "11px" }}>
                    -{record.discountPercentage}%
                  </Tag>
                </div>
              </Space>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <DollarOutlined style={{ color: "#52c41a", marginRight: 4 }} />
                <Text strong style={{ color: "#52c41a", fontSize: "14px" }}>
                  {record.price?.toLocaleString("vi-VN")} đ
                </Text>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <InboxOutlined
              style={{
                color: record.stockQuantity < 10 ? "#ff4d4f" : "#1890ff",
                marginRight: 4,
              }}
            />
            <Text
              style={{
                color: record.stockQuantity < 10 ? "#ff4d4f" : "#1890ff",
                fontWeight: record.stockQuantity < 10 ? "bold" : "normal",
              }}
            >
              Kho: {record.stockQuantity} {record.stockQuantity < 10 && "⚠️"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => viewProduct(record)}
              size="small"
              style={{ borderRadius: "6px" }}
            >
              <span className="hide-mobile">Xem</span>
            </Button>
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => editProduct(record)}
              size="small"
              style={{ borderRadius: "6px" }}
            />
          </Tooltip>

          <Tooltip title="Cập nhật giảm giá">
            <Button
              type="dashed"
              icon={<PercentageOutlined />}
              onClick={() => updateDiscount(record)}
              size="small"
              style={{
                borderRadius: "6px",
                color: "#faad14",
                borderColor: "#faad14",
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                style={{ borderRadius: "6px" }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setSelectedProductType("BOOK");
    setCurrentImageFileList([]);
    form.resetFields();
    form.setFieldsValue({ images: [] });
    setModalVisible(true);
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setSelectedProductType(product.productType);
    
    // Chuyển đổi imageUrls thành fileList để hiển thị
    const existingImages = product.imageUrls?.map((url, index) => ({
      uid: `existing-${index}`,
      name: `image-${index}`,
      status: 'done',
      url: url,
      isExisting: true, // Đánh dấu là ảnh đã tồn tại
    })) || [];
    
    setCurrentImageFileList(existingImages);
    
    form.setFieldsValue({
      ...product,
      categoryId: product.category?.id,
      authors: product.authorNames || [],
    });
    setModalVisible(true);
  };

  const handleImageUpload = ({ fileList }) => {
    setCurrentImageFileList(fileList);
  };

  const handleImageRemove = async (file) => {
    // Nếu là ảnh đã tồn tại trên server, gọi API xóa
    if (file.isExisting && editingProduct) {
      try {
        const response = await removeImageFromProductAPI(editingProduct.id, encodeURIComponent(file.url));
        
        if (response.data) {
          message.success("Xóa ảnh thành công");
          // Cập nhật lại danh sách ảnh trong editingProduct
          const updatedImageUrls = editingProduct.imageUrls.filter(url => url !== file.url);
          setEditingProduct({...editingProduct, imageUrls: updatedImageUrls});
          
          // Cập nhật fileList trong state
          const updatedFileList = currentImageFileList.filter(
            (f) => f.uid !== file.uid
          );
          setCurrentImageFileList(updatedFileList);
          return true;
        } else {
          message.error(result.message || "Xóa ảnh thất bại");
          return false; // Ngăn không cho xóa khỏi UI
        }
      } catch (error) {
        message.error("Có lỗi xảy ra khi xóa ảnh");
        console.error("Error deleting image:", error);
        return false;
      }
    }
    
    // Nếu là ảnh mới chưa upload, chỉ xóa khỏi UI
    const updatedFileList = currentImageFileList.filter(
      (f) => f.uid !== file.uid
    );
    setCurrentImageFileList(updatedFileList);
    return true;
  };

  const handleImagePreview = (file) => {
    if (file.url || file.preview) {
      const imageUrl = file.url || file.preview;
      const imgWindow = window.open();
      imgWindow.document.write(
        `<img src="${imageUrl}" alt="preview" style="max-width: 100%; height: auto;" />`
      );
    }
  };

  const viewProduct = (product) => {
    console.log("Viewing product:", product);
    setViewingProduct(product);
    setViewModalVisible(true);
  };

  const updateDiscount = (product) => {
    setDiscountingProduct(product);
    discountForm.setFieldsValue({
      discountPercentage: product.discountPercentage || 0,
    });
    setDiscountModalVisible(true);
  };

  const handleDiscountSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await updateDiscountPercentageAPI(
        discountingProduct.id,
        values.discountPercentage
      );
      if (res && res.data) {
        // Cập nhật local state
        const updatedProducts = products.map((p) => {
          if (p.id === discountingProduct.id) {
            const priceAfterDiscount =
              p.price * (1 - values.discountPercentage / 100);
            return {
              ...p,
              discountPercentage: values.discountPercentage,
              priceAfterDiscount: Math.round(priceAfterDiscount),
            };
          }
          return p;
        });

        setProducts(updatedProducts);
        showNotification("success", "Cập nhật giảm giá thành công!");
        setDiscountModalVisible(false);
        discountForm.resetFields();
      } else {
        showNotification("error", res.message || "Cập nhật giảm giá thất bại!");
      }
    } catch (error) {
      showNotification("error", "Cập nhật giảm giá thất bại!");
      console.error("Lỗi cập nhật giảm giá:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      // const res = await deleteProductAPI(id);
      // if (res && res.status === "success") {
      //   setProducts(products.filter((p) => p.id !== id));
      //   message.success("Xóa sản phẩm thành công");
      // } else {
      //   message.error(res.message || "Xóa sản phẩm thất bại");
      // }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      if (editingProduct) {
        // Chế độ chỉnh sửa
        
        // Bước 1: Thêm ảnh mới nếu có
        const newImages = currentImageFileList.filter(file => !file.isExisting && file.originFileObj);
        
        if (newImages.length > 0) {
          const token = localStorage.getItem("token");
          const imageFormData = new FormData();
          
          newImages.forEach((file) => {
            imageFormData.append("images", file.originFileObj);
          });
          
          const imageResponse = await addImagesToProductAPI(editingProduct.id, imageFormData);
          
        }
        
        const updateData = {
          ...values,
          id: editingProduct.id,
        };

        console.log("Update data:", updateData);
        
        const res = await updateProductAPI(editingProduct.id, updateData);
        console.log("Update response:", res);
        
        if (res && res.status === "success") {
          showNotification("success", "Cập nhật sản phẩm thành công!");
          form.resetFields();
          setCurrentImageFileList([]);
          setEditingProduct(null);
          setSelectedProductType("BOOK");
          setModalVisible(false);
          fetchProduct(); 
        } else {
          showNotification("error", res.message || "Cập nhật sản phẩm thất bại");
        }
        
      } else {
        const formData = new FormData();

        formData.append(
          "request",
          new Blob([JSON.stringify(values)], { type: "application/json" })
        );

        if (currentImageFileList && currentImageFileList.length > 0) {
          currentImageFileList.forEach((file) => {
            if (file.originFileObj) {
              formData.append("images", file.originFileObj);
            }
          });
        }

        const res = await createProductAPI(formData);

        if (res.status === "success") {
          message.success("Tạo sản phẩm thành công!");
          form.resetFields();
          setCurrentImageFileList([]);
          form.setFieldsValue({ images: [] });
          showNotification("success", res.message || "Tạo sản phẩm thành công!");
          setModalVisible(false);
          fetchProduct();
        } else {
          showNotification("error", res.message || "Tạo sản phẩm thất bại");
        }
      }
    } catch (error) {
      showNotification("error", "Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Lỗi xử lý sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductTypeFields = () => {
    switch (selectedProductType) {
      case "BOOK":
      case "COMIC":
        return (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fafafa",
              borderRadius: "12px",
              marginBottom: 16,
            }}
          >
            <Title level={5} style={{ marginBottom: 16, color: "#1890ff" }}>
              <BookOutlined /> Thông tin chi tiết{" "}
              {selectedProductType === "BOOK" ? "sách" : "truyện"}
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="publisherName"
                  label="Nhà xuất bản"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nhập tên nhà xuất bản" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="publicationYear" label="Năm xuất bản">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="2024"
                    min={1900}
                    max={new Date().getFullYear()}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="authors"
              label="Tác giả"
              rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
            >
              <Select
                mode="tags"
                placeholder="Nhập tên tác giả (Enter để thêm nhiều tác giả)"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
                allowClear
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="supplierName" label="Tên nhà cung cấp">
                  <Input placeholder="Nhập tên nhà cung cấp" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="pageCount" label="Số trang">
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="Số trang"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="coverType" label="Loại bìa">
                  <Select placeholder="Chọn loại bìa">
                    <Option value="Bìa mềm">📖 Bìa mềm</Option>
                    <Option value="Bìa cứng">📚 Bìa cứng</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {selectedProductType === "COMIC" && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="ageRating" label="Độ tuổi phù hợp">
                    <Input placeholder="VD: 6+, 12+, 16+" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="genres" label="Thể loại">
                    <Input placeholder="VD: Hành động, Phiêu lưu, Tình cảm" />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </div>
        );
      case "STATIONERY":
        return (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff7e6",
              borderRadius: "12px",
              marginBottom: 16,
            }}
          >
            <Title level={5} style={{ marginBottom: 16, color: "#fa8c16" }}>
              <EditOutlined /> Thông tin văn phòng phẩm
            </Title>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="color" label="Màu sắc">
                  <Input placeholder="VD: Đỏ, Xanh, Đa màu" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="material" label="Chất liệu">
                  <Input placeholder="VD: Nhựa, Kim loại, Giấy" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="manufacturingLocation" label="Nơi sản xuất">
                  <Input placeholder="VD: Việt Nam, Trung Quốc" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="admin-responsive-container"
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
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

      {/* Statistics Cards */}
      <Row gutter={24} className="stats-row-mobile" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="admin-card-responsive"
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              color: "white",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng sản phẩm
                </span>
              }
              value={statistics.totalProducts}
              valueStyle={{
                color: "#fff",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              prefix={<ShoppingOutlined style={{ color: "#fff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="admin-card-responsive"
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              border: "none",
              color: "white",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng giá trị
                </span>
              }
              value={statistics.totalValue}
              suffix="đ"
              valueStyle={{
                color: "#fff",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              prefix={<DollarOutlined style={{ color: "#fff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="admin-card-responsive"
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              border: "none",
              color: "white",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Sắp hết hàng
                </span>
              }
              value={statistics.lowStockCount}
              valueStyle={{
                color: "#fff",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              prefix={<InboxOutlined style={{ color: "#fff" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <ShoppingOutlined
              style={{ marginRight: 12, fontSize: "24px", color: "#1890ff" }}
            />
            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
              Quản lý sản phẩm
            </Title>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
            loading={loading}
            style={{
              borderRadius: "8px",
              height: "40px",
              fontWeight: "500",
              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
            }}
          >
            <span className="hide-mobile">Thêm sản phẩm</span>
            <span className="show-mobile">Thêm</span>
          </Button>
        }
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <div className="admin-table-wrapper">
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            loading={loading}
            scroll={{ x: 860 }}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} sản phẩm`,
              style: { marginTop: "24px" },
            }}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
            }}
            rowClassName={() => "table-row-hover"}
          />
        </div>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        title={
          <div
            style={{ display: "flex", alignItems: "center", padding: "8px 0" }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#1890ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              {editingProduct ? (
                <EditOutlined style={{ color: "white", fontSize: "20px" }} />
              ) : (
                <PlusOutlined style={{ color: "white", fontSize: "20px" }} />
              )}
            </div>
            <div>
              <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </Title>
              <Text type="secondary">
                {editingProduct
                  ? "Chỉnh sửa thông tin sản phẩm"
                  : "Nhập đầy đủ thông tin sản phẩm"}
              </Text>
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingProduct(null);
          setCurrentImageFileList([]);
          form.resetFields();
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "24px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ productType: "BOOK" }}
        >
          {/* Basic Information Section */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fafafa",
              borderRadius: "12px",
              marginBottom: 24,
              border: "1px solid #f0f0f0",
            }}
          >
            <Title level={5} style={{ marginBottom: 16, color: "#1890ff" }}>
              <StarOutlined /> Thông tin cơ bản
            </Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="productType"
                  label="Loại sản phẩm"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại sản phẩm" },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại sản phẩm"
                    onChange={setSelectedProductType}
                    size="large"
                  >
                    {productTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {type.icon}
                          <span style={{ marginLeft: 8 }}>{type.label}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="categoryId"
                  label="Danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
                >
                  <Select placeholder="Chọn danh mục" size="large">
                    {categories.map((category) =>
                      category.subCategories ? (
                        <Select.OptGroup
                          key={category.id}
                          label={category.categoryName}
                        >
                          {category.subCategories.map((sub) => (
                            <Option key={sub.id} value={sub.id}>
                              {sub.categoryName}
                            </Option>
                          ))}
                        </Select.OptGroup>
                      ) : (
                        <Option key={category.id} value={category.id}>
                          {category.categoryName}
                        </Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input
                placeholder="Nhập tên sản phẩm..."
                size="large"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Form.Item name="description" label="Mô tả sản phẩm">
              <TextArea
                rows={4}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
          </div>

          {/* Image Upload Section */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff7e6",
              borderRadius: "12px",
              marginBottom: 24,
              border: "1px solid #ffe7ba",
            }}
          >
            <Title level={5} style={{ marginBottom: 16, color: "#fa8c16" }}>
              <PictureOutlined /> Hình ảnh sản phẩm
            </Title>

            <Form.Item name="images" label="">
              <Dragger
                fileList={currentImageFileList}
                onChange={handleImageUpload}
                onRemove={handleImageRemove}
                onPreview={handleImagePreview}
                beforeUpload={() => false}
                multiple={true}
                listType="picture-card"
                style={{
                  borderRadius: "12px",
                  border: "2px dashed #fa8c16",
                  backgroundColor: "#fff",
                }}
              >
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <PictureOutlined
                    style={{
                      fontSize: "48px",
                      color: "#fa8c16",
                      marginBottom: 16,
                    }}
                  />
                  <Title
                    level={5}
                    style={{ color: "#fa8c16", marginBottom: 8 }}
                  >
                    {editingProduct ? "Thêm ảnh mới hoặc xóa ảnh cũ" : "Kéo thả hoặc click để tải ảnh"}
                  </Title>
                  <Text type="secondary">
                    {editingProduct 
                      ? "Ảnh cũ có thể xóa bằng nút X. Ảnh mới sẽ được thêm vào"
                      : "Hỗ trợ nhiều ảnh, định dạng JPG, PNG, GIF"}
                  </Text>
                </div>
              </Dragger>
            </Form.Item>
          </div>

          {/* Price and Stock Section */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f6ffed",
              borderRadius: "12px",
              marginBottom: 24,
              border: "1px solid #b7eb8f",
            }}
          >
            <Title level={5} style={{ marginBottom: 16, color: "#52c41a" }}>
              <DollarOutlined /> Giá & Tồn kho
            </Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Giá bán (VNĐ)"
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    min={0}
                    step={1000}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="0"
                    prefix="₫"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="stockQuantity"
                  label="Số lượng tồn kho"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="packageDimensions" label="Kích thước đóng gói">
                  <Input
                    placeholder="VD: 20x15x3 cm"
                    size="large"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="weightGrams" label="Trọng lượng (gram)">
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Dynamic Product Type Fields */}
          {renderProductTypeFields()}

          {/* Action Buttons */}
          <div
            style={{
              textAlign: "right",
              paddingTop: "24px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Space size="large">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingProduct(null);
                  setCurrentImageFileList([]);
                  form.resetFields();
                }}
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "120px",
                  height: "48px",
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "120px",
                  height: "48px",
                  fontWeight: "500",
                  boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                }}
              >
                {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View Product Modal */}
      <Modal
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setViewingProduct(null);
        }}
        width={900}
        footer={null}
        title={
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            {viewingProduct &&
              productTypes.find((pt) => pt.value === viewingProduct.productType)
                ?.icon}
            <span
              style={{ marginLeft: 8, fontSize: "18px", fontWeight: "bold" }}
            >
              Chi tiết sản phẩm
            </span>
          </div>
        }
        style={{ top: 20 }}
        bodyStyle={{ padding: "24px" }}
      >
        {viewingProduct && (
          <div>
            <Row gutter={24}>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <Image
                    width="100%"
                    style={{ borderRadius: "12px", maxWidth: "250px" }}
                    src={
                      viewingProduct.imageUrls?.[0] ||
                      "https://via.placeholder.com/250x350?text=No+Image"
                    }
                    fallback="https://via.placeholder.com/250x350?text=No+Image"
                  />
                  {viewingProduct.imageUrls &&
                    viewingProduct.imageUrls.length > 1 && (
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">
                          +{viewingProduct.imageUrls.length - 1} ảnh khác
                        </Text>
                      </div>
                    )}
                </div>
              </Col>
              <Col span={16}>
                <div style={{ padding: "0 16px" }}>
                  <Title
                    level={3}
                    style={{ marginBottom: 16, color: "#1890ff" }}
                  >
                    {viewingProduct.productName}
                  </Title>

                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                      <Card size="small" style={{ backgroundColor: "#f6ffed" }}>
                        <Statistic
                          title="Giá bán"
                          value={viewingProduct.price}
                          suffix="đ"
                          valueStyle={{ color: "#52c41a" }}
                          prefix={<DollarOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" style={{ backgroundColor: "#f0f5ff" }}>
                        <Statistic
                          title="Tồn kho"
                          value={viewingProduct.stockQuantity}
                          valueStyle={{
                            color:
                              viewingProduct.stockQuantity < 10
                                ? "#ff4d4f"
                                : "#1890ff",
                          }}
                          prefix={<InboxOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Tag
                        color={
                          productTypes.find(
                            (pt) => pt.value === viewingProduct.productType
                          )?.color
                        }
                        icon={
                          productTypes.find(
                            (pt) => pt.value === viewingProduct.productType
                          )?.icon
                        }
                        style={{ padding: "4px 12px", borderRadius: "16px" }}
                      >
                        {
                          productTypes.find(
                            (pt) => pt.value === viewingProduct.productType
                          )?.label
                        }
                      </Tag>
                      <Tag
                        style={{ padding: "4px 12px", borderRadius: "16px" }}
                      >
                        {viewingProduct.category?.name || "Chưa phân loại"}
                      </Tag>
                    </Space>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Mô tả:</Text>
                    <div
                      style={{
                        marginTop: 8,
                        padding: "12px",
                        backgroundColor: "#fafafa",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Text>
                        <div
                          className="text-gray-800 leading-relaxed text-lg"
                          dangerouslySetInnerHTML={{
                            __html: viewingProduct.description,
                          }}
                        />
                      </Text>
                    </div>
                  </div>
                  <>
                    <Divider orientation="left">
                      <BookOutlined /> Thông tin sản phẩm
                    </Divider>
                    <Row gutter={[16, 12]}>
                      {viewingProduct.supplierName && (
                        <Col span={12}>
                          <Text strong>Nhà cung cấp:</Text>
                          <div>{viewingProduct.supplierName}</div>
                        </Col>
                      )}
                      {viewingProduct.publisherName && (
                        <Col span={12}>
                          <Text strong>Nhà xuất bản:</Text>
                          <div>{viewingProduct.publisherName}</div>
                        </Col>
                      )}
                      {viewingProduct.authorNames?.length > 0 && (
                        <Col span={12}>
                          <Text strong>Tác giả:</Text>
                          <div>{viewingProduct.authorNames.join(", ")}</div>
                        </Col>
                      )}
                      {viewingProduct.publicationYear && (
                        <Col span={12}>
                          <Text strong>Năm xuất bản:</Text>
                          <div>{viewingProduct.publicationYear}</div>
                        </Col>
                      )}
                      {viewingProduct.pageCount && (
                        <Col span={12}>
                          <Text strong>Số trang:</Text>
                          <div>{viewingProduct.pageCount}</div>
                        </Col>
                      )}
                      {viewingProduct.coverType && (
                        <Col span={12}>
                          <Text strong>Loại bìa:</Text>
                          <div>{viewingProduct.coverType}</div>
                        </Col>
                      )}
                      {viewingProduct.color && (
                        <Col span={12}>
                          <Text strong>Màu sắc:</Text>
                          <div>{viewingProduct.color}</div>
                        </Col>
                      )}
                      {viewingProduct.material && (
                        <Col span={12}>
                          <Text strong>Chất liệu:</Text>
                          <div>{viewingProduct.material}</div>
                        </Col>
                      )}
                      {viewingProduct.manufacturingLocation && (
                        <Col span={12}>
                          <Text strong>Nơi sản xuất:</Text>
                          <div>{viewingProduct.manufacturingLocation}</div>
                        </Col>
                      )}
                      {viewingProduct.weightGrams && (
                        <Col span={12}>
                          <Text strong>Trọng lượng:</Text>
                          <div>{viewingProduct.weightGrams} gram</div>
                        </Col>
                      )}
                      {viewingProduct.packageDimensions && (
                        <Col span={12}>
                          <Text strong>Kích thước:</Text>
                          <div>{viewingProduct.packageDimensions}</div>
                        </Col>
                      )}
                    </Row>
                  </>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Discount Modal */}
      <Modal
        title={
          <div
            style={{ display: "flex", alignItems: "center", padding: "8px 0" }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#faad14",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              <PercentageOutlined
                style={{ color: "white", fontSize: "20px" }}
              />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, color: "#faad14" }}>
                Cập nhật giảm giá
              </Title>
              <Text type="secondary">{discountingProduct?.productName}</Text>
            </div>
          </div>
        }
        open={discountModalVisible}
        onCancel={() => {
          setDiscountModalVisible(false);
          discountForm.resetFields();
        }}
        width={500}
        footer={null}
      >
        <Form
          form={discountForm}
          layout="vertical"
          onFinish={handleDiscountSubmit}
          style={{ marginTop: 24 }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fffbf0",
              borderRadius: "12px",
              marginBottom: 24,
              border: "1px solid #ffe7ba",
            }}
          >
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card size="small" style={{ backgroundColor: "#fff" }}>
                  <Statistic
                    title="Giá gốc"
                    value={discountingProduct?.price}
                    suffix="đ"
                    valueStyle={{ color: "#8c8c8c", fontSize: "16px" }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ backgroundColor: "#fff" }}>
                  <Statistic
                    title="Giảm giá hiện tại"
                    value={discountingProduct?.discountPercentage || 0}
                    suffix="%"
                    valueStyle={{ color: "#faad14", fontSize: "16px" }}
                  />
                </Card>
              </Col>
            </Row>

            <Form.Item
              name="discountPercentage"
              label="Phần trăm giảm giá"
              rules={[
                { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  message: "Giá trị phải từ 0 đến 100",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                size="large"
                placeholder="Nhập phần trăm giảm giá"
                suffix="%"
              />
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
              {() => {
                const discount =
                  discountForm.getFieldValue("discountPercentage") || 0;
                const originalPrice = discountingProduct?.price || 0;
                const finalPrice = originalPrice * (1 - discount / 100);

                return (
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f6ffed",
                      border: "1px solid #b7eb8f",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Text type="secondary">Giá sau giảm</Text>
                      <Title
                        level={3}
                        style={{ margin: "8px 0", color: "#52c41a" }}
                      >
                        {Math.round(finalPrice).toLocaleString("vi-VN")} đ
                      </Title>
                      {discount > 0 && (
                        <Tag color="success">
                          Tiết kiệm{" "}
                          {Math.round(
                            originalPrice - finalPrice
                          ).toLocaleString("vi-VN")}{" "}
                          đ
                        </Tag>
                      )}
                    </div>
                  </Card>
                );
              }}
            </Form.Item>
          </div>

          <div
            style={{
              textAlign: "right",
              paddingTop: "16px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Space size="large">
              <Button
                onClick={() => {
                  setDiscountModalVisible(false);
                  discountForm.resetFields();
                }}
                size="large"
                style={{ borderRadius: "8px", minWidth: "100px" }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "100px",
                  backgroundColor: "#faad14",
                  borderColor: "#faad14",
                }}
              >
                Cập nhật
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <style jsx global>{`
        .table-row-hover:hover {
          background-color: #f5f5f5;
          transform: translateY(-2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
          color: #1890ff;
          border-bottom: 2px solid #1890ff;
        }

        .ant-table-tbody > tr > td {
          padding: 16px;
        }

        .ant-card-head-title {
          font-weight: 600;
        }

        .ant-modal-header {
          border-radius: 16px 16px 0 0;
        }

        .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }

        .ant-upload-drag:hover {
          border-color: #fa8c16;
          background-color: #fff7e6;
        }

        .ant-form-item-label > label {
          font-weight: 500;
          color: #262626;
        }

        .ant-btn-primary {
          background: linear-gradient(135deg, #40a9ff, #1890ff);
          border: none;
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        }

        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #1890ff, #096dd9);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
        }

        .product-detail-modal .ant-modal-content {
          overflow: hidden;
        }

        .product-detail-modal .ant-modal-close {
          color: white;
          font-size: 20px;
        }

        .product-detail-modal .ant-modal-close:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
};

export default CommonProductManagement;