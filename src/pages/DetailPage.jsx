import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, Tabs, Tag, Divider, Rate, Avatar, Image, message } from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "../styles/DetailPage.css";
import {
  getAllProductsAPI,
  getProductByIdAPI,
} from "../service/product.service";
import { addProductToCartAPI } from "../service/cart.service";
import { AuthContext } from "../components/context/auth.context";
import ProductCarousel from "../components/product/ProductCarousel";
import { getReviewsByProductIdAPI } from "../service/review.service";

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
  const [listReviews, setListReviews] = useState([]);

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
    fetchReviews(id);
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

  const fetchReviews = async (productId) => {
    const res = await getReviewsByProductIdAPI(productId);
    if (res && res.data) {
      setListReviews(res.data.reviews || []);
    } else {
      setListReviews([]);
    }
  };

  console.log("reviews", listReviews);

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
      { label: "Cấp độ", value: product.gradeLevel, icon: "🎓" },
      { label: "Nhà cung cấp", value: product.supplierName, icon: "🏷️" },
      { label: "Tác giả", value: product.authorNames?.join(", "), icon: "👤" },
      { label: "NXB", value: product.publisherName, icon: "🏢" },
      { label: "Năm XB", value: product.publicationYear, icon: "📅" },
      {
        label: "Trọng lượng",
        value: product.weightGrams ? `${product.weightGrams}g` : null,
        icon: "⚖️",
      },
      {
        label: "Kích thước",
        value: product.packageDimensions
          ? `${product.packageDimensions} cm`
          : null,
        icon: "📏",
      },
      { label: "Số trang", value: product.pageCount, icon: "📄" },
      { label: "Hình thức", value: product.coverType, icon: "📖" },
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
          <span className="breadcrumb-item active">{product.productName}</span>
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
                  className={`modal-thumbnail ${selectedImage === index ? "active" : ""
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
                  {product.discountPercentage > 0
                    ? formatPrice(product.priceAfterDiscount)
                    : formatPrice(product.price)
                  }
                </span>
                {product.discountPercentage > 0 && (
                  <span className="original-price">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <Tag color="red" className="discount-tag">
                  -{product.discountPercentage}%
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
                label: `⭐ Đánh giá (${listReviews?.length || 0})`,
                children: (
                  <div className="tab-content">
                    {!listReviews || listReviews.length === 0 ? (
                      // Empty state
                      <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: '#fafafa',
                        borderRadius: '12px'
                      }}>
                        <ClockCircleOutlined style={{ fontSize: 48, color: '#ccc' }} />
                        <p style={{ marginTop: '16px', color: '#999', fontSize: '16px' }}>
                          Chưa có đánh giá nào cho sản phẩm này
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Tổng quan đánh giá */}
                        <div style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '16px',
                          padding: '32px',
                          marginBottom: '32px',
                          color: 'white'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr',
                            gap: '40px',
                            alignItems: 'center'
                          }}>
                            {/* Điểm trung bình */}
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '8px' }}>
                                {(() => {
                                  const sum = listReviews.reduce((acc, review) => acc + review.rating, 0);
                                  return (sum / listReviews.length).toFixed(1);
                                })()}
                              </div>
                              <Rate
                                disabled
                                value={parseFloat((() => {
                                  const sum = listReviews.reduce((acc, review) => acc + review.rating, 0);
                                  return (sum / listReviews.length).toFixed(1);
                                })())}
                                style={{ fontSize: '24px' }}
                              />
                              <div style={{ marginTop: '12px', fontSize: '16px', opacity: 0.9 }}>
                                {listReviews.length} đánh giá
                              </div>
                            </div>

                            {/* Phân bố rating */}
                            <div>
                              {[5, 4, 3, 2, 1].map(star => {
                                const count = listReviews.filter(review => review.rating === star).length;
                                const percentage = listReviews.length > 0 ? (count / listReviews.length) * 100 : 0;

                                return (
                                  <div key={star} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '8px'
                                  }}>
                                    <div style={{ width: '80px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <span>{star}</span>
                                      <Rate disabled count={1} value={1} style={{ fontSize: '14px' }} />
                                    </div>
                                    <div style={{
                                      flex: 1,
                                      height: '8px',
                                      background: 'rgba(255,255,255,0.3)',
                                      borderRadius: '4px',
                                      overflow: 'hidden'
                                    }}>
                                      <div style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        background: 'white',
                                        transition: 'width 0.3s'
                                      }} />
                                    </div>
                                    <div style={{ width: '50px', textAlign: 'right' }}>
                                      {count}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Danh sách đánh giá */}
                        <div>
                          {listReviews.map((review) => (
                            <div key={review.id} style={{
                              background: '#fff',
                              borderRadius: '12px',
                              padding: '24px',
                              marginBottom: '20px',
                              border: '1px solid #e8e8e8',
                              transition: 'box-shadow 0.3s',
                            }}>
                              {/* Header: Avatar + Tên + Rating */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '16px'
                              }}>
                                <Avatar size={48} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                                    {review.userName}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Rate disabled value={review.rating} style={{ fontSize: '16px' }} />
                                    <span style={{ color: '#999', fontSize: '14px' }}>
                                      {new Date(review.reviewDate).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Comment */}
                              {review.comment && (
                                <div style={{
                                  marginBottom: review.mediaUrls && review.mediaUrls.length > 0 ? '16px' : '0',
                                  lineHeight: '1.6',
                                  color: '#333',
                                  fontSize: '15px'
                                }}>
                                  {review.comment}
                                </div>
                              )}

                              {/* Media (Ảnh/Video) */}
                              {review.mediaUrls && review.mediaUrls.length > 0 && (
                                <div style={{
                                  display: 'flex',
                                  gap: '12px',
                                  flexWrap: 'wrap'
                                }}>
                                  <Image.PreviewGroup>
                                    {review.mediaUrls.map((url, index) => {
                                      const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

                                      if (isVideo) {
                                        return (
                                          <video
                                            key={index}
                                            src={url}
                                            controls
                                            style={{
                                              width: '120px',
                                              height: '120px',
                                              objectFit: 'cover',
                                              borderRadius: '8px',
                                              border: '1px solid #e8e8e8'
                                            }}
                                          />
                                        );
                                      }

                                      return (
                                        <Image
                                          key={index}
                                          src={url}
                                          alt={`Review media ${index + 1}`}
                                          width={120}
                                          height={120}
                                          style={{
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '1px solid #e8e8e8'
                                          }}
                                        />
                                      );
                                    })}
                                  </Image.PreviewGroup>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ),
              },
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
