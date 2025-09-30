import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, Tabs, Tag, Divider } from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  HeartOutlined,
  ShareAltOutlined,
  TruckOutlined,
  StarOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "../styles/DetailPage.css";
import {
  getAllProductsAPI,
  getProductByIdAPI,
} from "../service/product.service";
import { addProductToCartAPI } from "../service/cart.service";
import { AuthContext } from "../components/context/auth.context";
import ProductCarousel from "../components/product/ProductCarousel";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, fetchCartInfor } = useContext(AuthContext);
  const [productToCheckout, setProductToCheckout] = useState([]);
  const [listProducts, setListProducts] = useState([]);

  // Notification state
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 4000);
  };

  useEffect(() => {
    fetchProductDetails();
    fetchProductRelated();
  }, [id]);

  const fetchProductRelated = async () => {
    const res = await getAllProductsAPI();
    if (res && res.data) {
      setListProducts(res.data.products || []);
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    const res = await getProductByIdAPI(id);
    if (res && res.data) {
      setProduct(res.data.product);
      setProductToCheckout([
        {
          ...res.data.product,
          quantity: 1,
        },
      ]);
    } else {
      setProduct(null);
    }
    setLoading(false);
  };

  const handleAddToCart = async (productId, quantity) => {
    if (product) {
      const res = await addProductToCartAPI(productId, quantity);
      if (res && res.data) {
        showNotification("success", "Đã thêm vào giỏ hàng thành công!");
        fetchCartInfor();
      } else {
        showNotification("error", "Thêm vào giỏ hàng thất bại!");
      }
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate("/checkout", { state: { cartItems: productToCheckout } });
  };

  const handleQuantityChange = (type) => {
    setProductToCheckout((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((item, index) => {
        if (index === 0) {
          let newQuantity = item.quantity;
          if (type === "increase") {
            newQuantity += 1;
          } else if (type === "decrease" && item.quantity > 1) {
            newQuantity -= 1;
          }
          setQuantity(newQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Render product specifications
  const renderSpecs = () => {
    const specs = [
      { label: "Tác giả", value: product.authorNames?.join(", "), icon: "👤" },
      { label: "Nhà xuất bản", value: product.publisherName, icon: "🏢" },
      { label: "Năm xuất bản", value: product.publicationYear, icon: "📅" },
      { label: "Số trang", value: product.pageCount, icon: "📄" },
      { label: "Hình thức", value: product.coverType, icon: "📖" },
      {
        label: "Kích thước",
        value: product.packageDimensions
          ? `${product.packageDimensions} cm`
          : null,
        icon: "📏",
      },
      {
        label: "Trọng lượng",
        value: product.weightGrams ? `${product.weightGrams}g` : null,
        icon: "⚖️",
      },
      { label: "Màu sắc", value: product.color, icon: "🎨" },
      { label: "Chất liệu", value: product.material, icon: "🧵" },
      {
        label: "Nơi sản xuất",
        value: product.manufacturingLocation,
        icon: "🏭",
      },
    ];

    return specs
      .filter((spec) => spec.value)
      .map((spec, index) => (
        <div key={index} className="spec-item">
          {/* <span className="spec-icon">{spec.icon}</span> */}
          <span className="spec-label">{spec.label}</span>
          <span className="spec-value">{spec.value}</span>
        </div>
      ));
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="error-container">
            <h2>❌ Sản phẩm không tìm thấy</h2>
            <p>Không thể tìm thấy sản phẩm với ID: {id}</p>
            <Button type="primary" onClick={() => navigate("/")}>
              Quay về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                ? "#ff4d4f"
                : "#1890ff",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container">
          <span
            className="breadcrumb-item clickable"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          <span className="breadcrumb-separator"> / </span>
          <span
            className="breadcrumb-item clickable"
            onClick={() => navigate("/allProduct")}
          >
            Tất cả sản phẩm
          </span>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-item active">{product.title}</span>
        </div>
      </div>

      <div className="container">
        {/* Main Product Section */}
        <div className="product-detail">
          {/* Left - Images */}
          <div className="product-images">
            <div className="main-image-wrapper">
              <div className="main-image">
                <img
                  src={product.imageUrls[selectedImage]}
                  alt={product.productName}
                />
              </div>
              {product.stock > 0 && product.stock < 10 && (
                <Tag color="orange" className="stock-badge">
                  Chỉ còn {product.stock} sản phẩm
                </Tag>
              )}
            </div>
            <div className="thumbnail-images">
              {product.imageUrls?.map((image, index) => (
                <div
                  key={index}
                  className={`modal-thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image}
                    alt={`${product.productName} ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.productName}</h1>
              <Tag color="blue" className="product-tag">
                Chính hãng
              </Tag>
            </div>

            {/* Price Section */}
            <div className="product-pricing">
              <div className="price-wrapper">
                <span className="current-price">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="original-price">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount && (
                <Tag color="red" className="discount-tag">
                  -{product.discount}%
                </Tag>
              )}
            </div>

            <Divider />

            {/* Specifications */}
            <div className="product-specs">
              <h3 className="section-title">📋 Thông tin chi tiết</h3>
              <div className="specs-grid">{renderSpecs()}</div>
            </div>

            <Divider />

            {/* Quantity */}
            {/* <div className="quantity-section">
              <span className="quantity-label">Số lượng:</span>
              <div className="quantity-controls">
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => handleQuantityChange("decrease")}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                />
                <Input value={quantity} className="quantity-input" readOnly />
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => handleQuantityChange("increase")}
                  className="quantity-btn"
                />
              </div>
              <span className="stock-info">
                {product.stock > 0
                  ? `${product.stock} sản phẩm có sẵn`
                  : "Hết hàng"}
              </span>
            </div> */}

            <div className="quantity-selector">
              <span className="quantity-label">Số lượng</span>
              <div className="quantity-controls">
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => handleQuantityChange("decrease")}
                  className="quantity-btn"
                />
                <Input value={quantity} className="quantity-input" readOnly />
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => handleQuantityChange("increase")}
                  className="quantity-btn"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button
                type="default"
                size="large"
                icon={<ShoppingCartOutlined />}
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product.id, quantity)}
              >
                Thêm vào giỏ
              </Button>
              <Button
                type="primary"
                size="large"
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>
            </div>

            {/* Quick Actions */}
            {/* <div className="quick-actions">
              <Button icon={<HeartOutlined />} className="action-btn">
                Yêu thích
              </Button>
              <Button icon={<ShareAltOutlined />} className="action-btn">
                Chia sẻ
              </Button>
            </div> */}

            {/* Services */}
            {/* <div className="services-section">
              <h3 className="section-title">🎁 Dịch vụ & Ưu đãi</h3>
              <div className="service-list">
                <div className="service-item">
                  <TruckOutlined className="service-icon" />
                  <div className="service-content">
                    <strong>Giao hàng nhanh</strong>
                    <p>Giao tận nơi trong 3-7 ngày</p>
                  </div>
                </div>
                <div className="service-item">
                  <StarOutlined className="service-icon" />
                  <div className="service-content">
                    <strong>Freeship toàn quốc</strong>
                    <p>Đơn hàng từ 300.000đ</p>
                  </div>
                </div>
                <div className="service-item">
                  <GiftOutlined className="service-icon" />
                  <div className="service-content">
                    <strong>Tặng bookmark</strong>
                    <p>Cho sách kỹ năng & văn học</p>
                  </div>
                </div>
                <div className="service-item">
                  <SafetyOutlined className="service-icon" />
                  <div className="service-content">
                    <strong>Đổi trả dễ dàng</strong>
                    <p>Trong vòng 7 ngày</p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Promotions */}
            {/* <div className="promotions-section">
              <div className="promotion-item">
                <CheckCircleOutlined /> Giảm 40-70% cho sản phẩm xả kho
              </div>
              <div className="promotion-item">
                <CheckCircleOutlined /> Voucher 20K cho đơn từ 500K
              </div>
            </div> */}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-tabs">
          <Tabs
            defaultActiveKey="description"
            items={[
              {
                key: "description",
                label: "📝 Mô tả sản phẩm",
                children: (
                  <div className="tab-content">
                    <h3 className="content-title">{product.productName}</h3>
                    <div className="product-description max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                      {product?.description ? (
                        <div
                          className="text-gray-800 leading-relaxed text-lg"
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">
                          Chưa có mô tả cho sản phẩm này.
                        </p>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: "reviews",
                label: "⭐ Đánh giá",
                children: (
                  <div className="tab-content">
                    <div className="reviews-empty">
                      <ClockCircleOutlined
                        style={{ fontSize: 48, color: "#ccc" }}
                      />
                      <p>Chưa có đánh giá nào cho sản phẩm này</p>
                      {/* <Button type="primary">Viết đánh giá đầu tiên</Button> */}
                    </div>
                  </div>
                ),
              },
              // {
              //   key: "policy",
              //   label: "📋 Chính sách",
              //   children: (
              //     <div className="tab-content">
              //       <h4>Chính sách đổi trả</h4>
              //       <ul>
              //         <li>Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi</li>
              //         <li>Hoàn tiền 100% nếu sản phẩm không đúng mô tả</li>
              //         <li>Hỗ trợ đổi size/màu miễn phí</li>
              //       </ul>
              //       <h4>Chính sách bảo hành</h4>
              //       <ul>
              //         <li>Bảo hành chính hãng theo quy định nhà sản xuất</li>
              //         <li>Hỗ trợ kỹ thuật 24/7</li>
              //       </ul>
              //     </div>
              //   ),
              // },
            ]}
          />
        </div>

        {/* Related Products */}
        {listProducts.length > 0 && (
          <ProductCarousel title="Sản phẩm liên quan" books={listProducts} />
        )}
      </div>
    </div>
  );
};

export default DetailPage;
