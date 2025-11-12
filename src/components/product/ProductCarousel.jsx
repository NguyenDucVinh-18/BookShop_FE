// BookCarousel.jsx
import {
  ZoomInOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// import "../../styles/HomePage.css";
import "../../styles/ProductCarousel.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { addProductToCartAPI } from "../../service/cart.service";

const ProductCarousel = ({ title, books }) => {
  const { user, setUser, fetchCartInfor } = useContext(AuthContext);
  const [currentSlideRender, setCurrentSlideRender] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const navigate = useNavigate();

  // Notification state
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  // Hàm hiển thị thông báo
  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 4000);
  };

  useEffect(() => {
    setCartItems(user.cartDetails || []);
  }, [user]);

  const next = () => {
    setCurrentSlideRender((prev) => (prev + 1) % Math.ceil(books.length / 4));
  };

  const prev = () => {
    setCurrentSlideRender(
      (prev) =>
        (prev - 1 + Math.ceil(books.length / 4)) % Math.ceil(books.length / 4)
    );
  };

  // Function to navigate to product detail page with source category
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleViewDetails = () => {
    if (selectedProduct) {
      handleProductClick(selectedProduct.id);
      closeModal();
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    if (!user.id) {
      showNotification(
        "error",
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng."
      );
      return;
    }
    if (selectedProduct) {
      const res = await addProductToCartAPI(productId, quantity);
      console.log("Add to cart response:", res);
      if (res && res.data) {
        showNotification("success", "Thêm vào giỏ hàng thành công!");
        fetchCartInfor();
        closeModal();
        setIsCartModalVisible(true);
      } else {
        showNotification(
          "error",
          "Thêm vào giỏ hàng thất bại. Vui lòng thử lại."
        );
      }
    } else {
      showNotification("error", "Sản phẩm không hợp lệ. Vui lòng thử lại.");
    }
  };

  // Function to open product modal
  const handleZoomClick = (book) => {
    const normalizedImage =
      book && Array.isArray(book.images) && book.images.length > 0
        ? book.images[0]
        : book?.image;
    setSelectedProduct(book);
    setSelectedImage(0);
    setQuantity(1);
    setIsModalVisible(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Utility function for price formatting
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  return (
    <div className="product-carousel-section">
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
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="section-nav">
          <button className="nav-arrow" onClick={prev}>
            ‹
          </button>
          <button className="nav-arrow" onClick={next}>
            ›
          </button>
        </div>
      </div>

      <div className="books-carousel">
        <div
          className="books-slides"
          style={{ transform: `translateX(-${currentSlideRender * 100}%)` }}
        >
          {Array.from(
            { length: Math.ceil(books.length / 4) },
            (_, slideIndex) => (
              <div key={slideIndex} className="books-slide">
                {books
                  .slice(slideIndex * 4, (slideIndex + 1) * 4)
                  .map((book) => (
                    <div
                      key={book.id}
                      className="book-card"
                      onClick={() => handleProductClick(book.id)}
                    >
                      <div className="book-image">
                        <img src={book.imageUrls[0]} alt={book.title} />
                        {/* Badge giảm giá */}
                        {book.discountPercentage > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              backgroundColor: "#ff4d4f",
                              color: "white",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              zIndex: 1,
                            }}
                          >
                            -{book.discountPercentage}%
                          </div>
                        )}
                        <div className="book-hover-overlay">
                          <div className="hover-icons">
                            <button
                              className="hover-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleZoomClick(book);
                              }}
                            >
                              <ZoomInOutlined />
                            </button>
                            <button
                              className="hover-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(book.id);
                              }}
                            >
                              <EyeOutlined />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="book-info">
                        <h3 className="book-title">{book.productName}</h3>
                        <div className="book-price-container">
                          {book.discountPercentage > 0 ? (
                            <>
                              <div className="price-main">
                                {formatPrice(book.priceAfterDiscount)}
                              </div>
                              <div className="price-original">
                                {formatPrice(book.price)}
                              </div>
                            </>
                          ) : (
                            <div className="price-regular">
                              {formatPrice(book.price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Product Information Modal */}
      {isModalVisible && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>THÔNG TIN SẢN PHẨM</h2>
              <button className="modal-close" onClick={closeModal}>
                <CloseOutlined />
              </button>
            </div>

            <div className="modal-content">
              {/* Left Panel - Product Images */}
              <div className="modal-left">
                {/* Ảnh chính hiển thị theo selectedImage */}
                <div className="modal-main-image">
                  <img
                    src={selectedProduct.imageUrls[selectedImage]}
                    alt={selectedProduct.productName}
                  />
                </div>

                {/* Thumbnail list */}
                <div className="modal-thumbnails">
                  {selectedProduct.imageUrls?.map((image, index) => (
                    <div
                      key={index}
                      className={`modal-thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={image}
                        alt={`${selectedProduct.productName} ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Product Details */}
              <div className="modal-right">
                <h3 className="modal-product-title">
                  {selectedProduct.productName}
                </h3>

                <div className="modal-pricing">
                  {selectedProduct.discountPercentage > 0 ? (
                    <>
                      <div
                        className="modal-current-price"
                        style={{ color: "#ff4d4f" }}
                      >
                        {formatPrice(selectedProduct.priceAfterDiscount)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginTop: "8px",
                        }}
                      >
                        <div className="modal-original-price">
                          {formatPrice(selectedProduct.price)}
                        </div>
                        <div
                          className="modal-discount"
                          style={{
                            backgroundColor: "#ff4d4f",
                            color: "white",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          Giảm {selectedProduct.discountPercentage}%
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className="modal-current-price"
                      style={{ color: "#52c41a" }}
                    >
                      {formatPrice(selectedProduct.price)}
                    </div>
                  )}
                </div>

                <div className="modal-stock">
                  <span style={{ fontWeight: "bold", color: "#555" }}>
                    Tồn kho:{" "}
                  </span>
                  <span
                    style={{
                      color:
                        selectedProduct.availableQuantity > 0
                          ? "#52c41a"
                          : "#ff4d4f",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedProduct.availableQuantity > 0
                      ? `${selectedProduct.availableQuantity} sản phẩm`
                      : "Hết hàng"}
                  </span>
                </div>

                <div className="modal-description">
                  <div
                    className="text-gray-800 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedProduct.description.length > 100
                          ? selectedProduct.description.substring(0, 500) +
                            "..."
                          : selectedProduct.description,
                    }}
                  />
                </div>

                <div className="modal-quantity">
                  <span className="quantity-label">Số lượng</span>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange("decrease")}
                    >
                      <MinusOutlined />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="quantity-input"
                      min="1"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange("increase")}
                    >
                      <PlusOutlined />
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() =>
                      handleAddToCart(selectedProduct.id, quantity)
                    }
                  >
                    Thêm vào giỏ
                  </button>
                  <div className="view-details-link">
                    hoặc{" "}
                    <button
                      className="view-details-btn"
                      onClick={handleViewDetails}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
