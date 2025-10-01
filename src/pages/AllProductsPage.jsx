import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button, Radio } from "antd";
import {
  AppstoreOutlined,
  BarsOutlined,
  EyeOutlined,
  ZoomInOutlined,
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

import "../styles/AllProductsPage.css";
import {
  getCategoryBySlugAPI,
  getParentCategoriesAPI,
  getSubCategoriesAPI,
} from "../service/category.service";
import { getProductByCategoryNameAPI } from "../service/product.service";
import { addProductToCartAPI } from "../service/cart.service";
import { AuthContext } from "../components/context/auth.context";

const AllProductsPage = () => {
  const navigate = useNavigate();
  const { parentSlug, slug } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [listParentCategories, setListParentCategories] = useState([]);
  const [listSubCategories, setListSubCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const { fetchCartInfor } = useContext(AuthContext);

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

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleParentClick = (parent) => {
    const subs = getSubCategories(parent.id);
    if (subs.length > 0) {
      toggleCategory(parent.id);
    }
  };

  const getSubCategories = (parentId) => {
    return listSubCategories.filter(
      (sub) => sub.parentCategory.id === parentId
    );
  };

  const [listProducts, setListProducts] = useState([]);

  const fetchCategoriesFromParams = async () => {
    const listSub = await getSubCategoriesAPI();
    if (listSub && listSub.data) {
      setListSubCategories(listSub.data.categories || []);
    }
    const listParent = await getParentCategoriesAPI();
    if (listParent && listParent.data) {
      setListParentCategories(listParent.data.categories || []);
    }

    const res = await getProductByCategoryNameAPI(parentSlug, slug);
    if (res && res.data) {
      setListProducts(res.data.products || []);
    }

    if (parentSlug) {
      const resParent = await getCategoryBySlugAPI(parentSlug);
      if (resParent && resParent.data) {
        setParentCategory(resParent.data.category);
      }
    }
    if (slug) {
      const resSub = await getCategoryBySlugAPI(slug);
      if (resSub && resSub.data) {
        setSubCategory(resSub.data.category);
      }
    }
  };

  useEffect(() => {
    fetchCategoriesFromParams();
    // fetchProductsFromParams();
  }, [parentSlug, slug]);

  const handleViewDetails = () => {
    if (selectedProduct) {
      handleProductClick(selectedProduct.id);
      closeModal();
    }
  };

  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [viewMode, setViewMode] = useState(() => {
    try {
      const saved = localStorage.getItem("allProductsViewMode");
      return saved === "list" || saved === "grid" ? saved : "grid";
    } catch (e) {
      return "grid";
    }
  });

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

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);

    // Cập nhật ảnh chính khi click vào thumbnail
    if (selectedProduct) {
      const allImages =
        selectedProduct.images &&
        Array.isArray(selectedProduct.images) &&
        selectedProduct.images.length > 0
          ? selectedProduct.images
          : [selectedProduct.image];

      if (allImages[index]) {
        setSelectedProduct((prev) => ({
          ...prev,
          image: allImages[index],
        }));
      }
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Cart functions
  const handleAddToCart = async (productId, quantity) => {
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

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle product click
  const handleProductClick = (productId, sourceCategory = "allProducts") => {
    navigate(`/product/${productId}`, { state: { sourceCategory } });
  };

  return (
    <div className="all-products-page">
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
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <span className="breadcrumb-link" onClick={() => navigate("/")}>
            Trang chủ
          </span>
          {parentSlug && (
            <>
              <span>/</span>
              <span
                className="breadcrumb-link"
                onClick={() => navigate(`/productCategory/${parentSlug}`)}
              >
                {parentCategory.categoryName}
              </span>
            </>
          )}
          {slug && (
            <>
              <span>/</span>
              <span
                className="breadcrumb-link"
                onClick={() =>
                  navigate(`/productCategory/${parentSlug}/${slug}`)
                }
              >
                {subCategory.categoryName}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          {/* Left Sidebar */}
          <div className="sidebar">
            {/* Product Filter */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">LỌC SẢN PHẨM</h3>

              {/* Publisher Filter */}
              <div className="min-h-screen bg-gray-50 p-6">
                {listParentCategories.map((parent) => {
                  const subs = getSubCategories(parent.id);
                  const isExpanded = expandedCategories.has(parent.id);
                  const hasChildren = subs.length > 0;

                  return (
                    <div key={parent.id}>
                      {/* Parent Category */}
                      <div
                        className={`py-2 px-4 cursor-pointer transition-colors ${
                          parentCategory === parent.id && !subCategory
                            ? "bg-blue-100 text-blue-800 font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleParentClick(parent)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {parent.categoryName}
                          </span>
                          {hasChildren && (
                            <span className="text-sm text-gray-500">
                              ({subs.length})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sub Categories */}
                      {hasChildren && isExpanded && (
                        <div className="bg-gray-50">
                          {subs.map((sub) => (
                            <div
                              key={sub.id}
                              className={`py-2 px-4 pl-8 cursor-pointer transition-colors ${
                                subCategory === sub.id
                                  ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() =>
                                navigate(
                                  `/productCategory/${parent.slug}/${sub.slug}`
                                )
                              }
                            >
                              {sub.categoryName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="filter-group">
                <h4 className="filter-subtitle">GIÁ</h4>
                <Radio.Group
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                >
                  <div className="radio-list">
                    <label className="radio-item">
                      <Radio value="" />
                      <span>Tất cả</span>
                    </label>
                    <label className="radio-item">
                      <Radio value="under-100k" />
                      <span>Dưới 100,000₫</span>
                    </label>
                    <label className="radio-item">
                      <Radio value="100k-200k" />
                      <span>100,000₫ - 200,000₫</span>
                    </label>
                    <label className="radio-item">
                      <Radio value="200k-300k" />
                      <span>200,000₫ - 300,000₫</span>
                    </label>
                    <label className="radio-item">
                      <Radio value="300k-400k" />
                      <span>300,000₫ - 400,000₫</span>
                    </label>
                    <label className="radio-item">
                      <Radio value="over-400k" />
                      <span>Trên 400,000₫</span>
                    </label>
                  </div>
                </Radio.Group>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {/* Page Header */}
            <div className="page-header">
              <div className="controls">
                <div className="header-actions">
                  <div className="view-mode">
                    <Button
                      type={viewMode === "grid" ? "primary" : "default"}
                      icon={<AppstoreOutlined />}
                      onClick={() => setViewMode("grid")}
                      className="view-btn"
                    />
                    <Button
                      type={viewMode === "list" ? "primary" : "default"}
                      icon={<BarsOutlined />}
                      onClick={() => setViewMode("list")}
                      className="view-btn"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - Using HomePage style layout */}
            <div
              className={`products-grid ${
                viewMode === "list" ? "list-view" : ""
              }`}
            >
              {listProducts.length > 0 ? (
                listProducts.map((book) => (
                  <div
                    key={book.id}
                    className={`book-card ${viewMode === "list" ? "list" : ""}`}
                    onClick={() => handleProductClick(book.id, "allProducts")}
                  >
                    <div className="book-image">
                      <img src={book.imageUrls[0]} alt={book.productName} />
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
                      <div className="book-price">
                        {viewMode === "list" ? (
                          <>
                            <span className="price-label">Giá:</span>
                            <span className="price-value">
                              {formatPrice(book.price)}
                            </span>
                          </>
                        ) : (
                          formatPrice(book.price)
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "40px",
                    color: "#666",
                  }}
                >
                  <h3>Không tìm thấy sản phẩm nào</h3>
                  <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              )}
            </div>
          </div>
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
                  <div className="modal-current-price">
                    {formatPrice(selectedProduct.price)}
                  </div>
                  {/* <div className="modal-original-price">
                    {formatPrice(selectedProduct.price + 50000)}
                  </div>
                  <div className="modal-discount">Giảm 20%</div> */}
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
  );
};

export default AllProductsPage;
