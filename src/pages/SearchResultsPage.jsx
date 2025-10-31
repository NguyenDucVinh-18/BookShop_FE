import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Empty, Spin } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  ZoomInOutlined,
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  newBooks,
  topSellingBooks,
  lifeSkillsBooks,
  childrenBooks,
  businessBooks,
  literatureBooks,
} from "../data/books";
import "../styles/SearchResultsPage.css";
import { getAllProductsAPI, getProductsByNameAPI } from "../service/product.service";
import { addProductToCartAPI } from "../service/cart.service";
import { AuthContext } from "../components/context/auth.context";

const SearchResultsPage = () => {
  const { user, setUser, fetchCartInfor } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const query = searchParams.get("q");

  const fetchProductResults = async () => {
    if(query === "tat-ca-san-pham") {
      const res = await getAllProductsAPI();
      if (res && res.data) {
        setSearchResults(res.data.products);
      } else {
          setSearchResults([]);
      }
      return ;
    }
    const res = await getProductsByNameAPI(query);
    if (res && res.data) {
      setSearchResults(res.data.products);
    } else {
        setSearchResults([]);
    }
  };

  console.log("SearchResultsPage:", searchResults);

  

  // Search effect
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate search delay
      setTimeout(() => {
        fetchProductResults();
        setCurrentPage(1);
        setIsLoading(false);
      }, 500);
    }
  }, [query]);

  // Derived pagination values
  const totalPages = Math.max(1, Math.ceil((searchResults?.length) / pageSize));  
  const clampedPage = Math.min(currentPage, totalPages);
  const startIndex = (clampedPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, searchResults?.length);
  const visibleResults = searchResults?.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    // scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle product click
  const handleProductClick = (productId, sourceCategory) => {
    navigate(`/product/${productId}`, { state: { sourceCategory } });
  };

  // Handle zoom click
  const handleZoomClick = (book, sourceCategory) => {
    const normalizedImage =
      book && Array.isArray(book.images) && book.images.length > 0
        ? book.images[0]
        : book?.image;
    setSelectedProduct({ ...book, image: normalizedImage, sourceCategory });
    setSelectedImage(0);
    setQuantity(1);
    setIsModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (productId, quantity) => {
    if(!user.id){
      showNotification("error", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    if (selectedProduct) {
      const res = await addProductToCartAPI(productId, quantity);
      console.log("Add to cart response:", res);
      if (res && res.data) {
        showNotification("success", "Thêm vào giỏ hàng thành công!");
        fetchCartInfor();
        closeModal();
        // setIsCartModalVisible(true);
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

  // Handle view details
  const handleViewDetails = () => {
    if (selectedProduct) {
      handleProductClick(selectedProduct.id, selectedProduct.sourceCategory);
      closeModal();
    }
  };

  if (isLoading) {
    return (
      <div className="search-results-page">
        <div className="container">
          <div className="loading-container">
            <Spin size="large" />
            <p>Đang tìm kiếm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
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
      <div className="container">
        {/* Search Header */}
        <div className="search-header">
          <h1>Kết quả tìm kiếm</h1>
          <div className="search-info">
            <SearchOutlined className="search-icon" />
            <span>Tìm kiếm: "{query}"</span>
            <span className="results-count">
              ({searchResults?.length} kết quả)
            </span>
          </div>
        </div>

        {/* Search Results */}
        {searchResults?.length > 0 ? (
          <div className="search-results">
            <div className="results-grid">
              {visibleResults.map((book) => (
                <div
                  key={book.id}
                  className="book-card"
                  onClick={() => handleProductClick(book.id, book.category)}
                >
                  <div className="book-image">
                    <img src={book.imageUrls[0]} alt={book.productName} />
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
                            handleProductClick(book.id, "allProducts");
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
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <button
                  className="pagination-btn"
                  disabled={clampedPage === 1}
                  onClick={() => goToPage(clampedPage - 1)}
                >
                  ← Trước
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        className={`pagination-number ${
                          p === clampedPage ? "active" : ""
                        }`}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
                <button
                  className="pagination-btn"
                  disabled={clampedPage === totalPages}
                  onClick={() => goToPage(clampedPage + 1)}
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-results">
            <Empty
              description={
                <div>
                  <p>Không tìm thấy kết quả nào cho "{query}"</p>
                  <p>Vui lòng thử từ khóa khác</p>
                </div>
              }
            />
            <Button type="primary" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
          </div>
        )}

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

                  <div className="modal-description">
                    <div
                      className="text-gray-800 leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{
                        __html: selectedProduct.description,
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
    </div>
  );
};

export default SearchResultsPage;
