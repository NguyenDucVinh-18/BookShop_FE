import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

import slider1 from "../assets/images/slider_item_1_image.jpg";
import slider2 from "../assets/images/slider_item_2_image.jpg";
import slider3 from "../assets/images/slider_item_3_image.jpg";
import slider5 from "../assets/images/slider_item_5_image.jpg";

import ProductCarousel from "../components/product/ProductCarousel";
import {
  getAllProductsAPI,
  getProductByParentCategoryAPI,
  getTopDiscountedProductsAPI,
} from "../service/product.service";
import { AuthContext } from "../components/context/auth.context";
import { getPromotionsActiveAPI } from "../service/promotion.service";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [endTimestamp, setEndTimestamp] = useState(() => {
    // Ưu tiên lấy từ localStorage để giữ nguyên mốc giữa các lần reload
    const KEY = "SALE_END_TS";
    const saved = Number(localStorage.getItem(KEY));
    const nowMs = Date.now();
    if (saved && saved > nowMs) {
      return saved;
    }
    const now = new Date();
    const end = new Date();
    // Mặc định: cuối ngày hôm nay, nếu đã qua thì cuối ngày hôm sau
    end.setHours(23, 59, 59, 999);
    if (end.getTime() <= now.getTime()) {
      end.setDate(end.getDate() + 1);
    }
    localStorage.setItem(KEY, String(end.getTime()));
    return end.getTime();
  });

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

  const images = [slider1, slider2, slider3, slider5];

  const fetchPromotions = async () => {
    try {
      const res = await getPromotionsActiveAPI();
      if (res && res.data) {
        setPromotions(res.data.promotions || []);
      } else {
        setPromotions([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải khuyến mãi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Countdown timer updater
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let diff = endTimestamp - now;
      if (diff <= 0) {
        // Hết hạn: đặt mốc mới 24h tới và lưu lại để đồng bộ các lần reload
        const newEnd = now + 24 * 60 * 60 * 1000;
        setEndTimestamp(newEnd);
        localStorage.setItem("SALE_END_TS", String(newEnd));
        diff = newEnd - now;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    // Gọi ngay để đồng bộ UI và sau đó mỗi giây
    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [endTimestamp]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const [listProducts, setListProducts] = useState([]);
  const [topDiscountedProducts, setTopDiscountedProducts] = useState([]);
  const [vanHocProducts, setVanHocProducts] = useState([]);
  const [dungCuHocSinhProducts, setDungCuHocSinhProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      fetchPromotions();
      getTopDiscountedProducts(12);
      setVanHocProducts(await getProductByParentCategory(1));
      setDungCuHocSinhProducts(await getProductByParentCategory(41));
      const res = await getAllProductsAPI();
      if (res && res.data) {
        setListProducts(res.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getProductByParentCategory = async (parentCategoryId) => {
    try {
      const res = await getProductByParentCategoryAPI(parentCategoryId);
      if (res && res.data) {
        return res.data.products || [];
      }
    } catch (error) {
      console.error("Error fetching products by parent category:", error);
      return [];
    }
  };

  const getTopDiscountedProducts = async (limit) => {
    try{
      const res = await getTopDiscountedProductsAPI(limit);
      if (res && res.data) {
        setTopDiscountedProducts(res.data.products || []);
      } else {
        setTopDiscountedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching top discounted products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Lấy khuyến mãi đang active
  const activePromo = promotions.find((p) => p.status === "ACTIVE");

  return (
    <div className="app">
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
      <div className="main-content">
        {/* Carousel/Slider Section */}
        <div className="carousel-container">
          <div className="carousel-wrapper">
            <div
              className="carousel-slides"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <img src={image} alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              className="carousel-arrow carousel-prev"
              onClick={prevSlide}
            >
              ←
            </button>
            <button
              className="carousel-arrow carousel-next"
              onClick={nextSlide}
            >
              →
            </button>

            {/* Dots Indicator */}
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Khám phá thế giới sách</h1>
            <p className="hero-subtitle">
              Hàng nghìn đầu sách chất lượng với giá tốt nhất
            </p>
            <button
              className="hero-button"
              onClick={() => {
                navigate("/search?q=tat-ca-san-pham");
                window.scrollTo(0, 0);
              }}
            >
              Khám phá ngay
            </button>
          </div>
          <div className="hero-image">
            <img src={slider1} alt="Hero" />
          </div>
        </div>

          {/* Promotional Blocks */}
          <div className="promotional-blocks">
          <div className="promo-block promo-large">
            <div className="promo-content">
              {loading ? (
                <>
                  <h3>Đang tải...</h3>
                  <p>Vui lòng chờ</p>
                </>
              ) : activePromo ? (
                <>
                  <h3>{activePromo.name}</h3>
                  {/* <p className="promo-description">{activePromo.description}</p> */}
                  <div className="promo-details">
                    <span className="promo-discount">
                      Giảm {activePromo.discountPercent}% tổng hóa đơn
                    </span>
                    <span className="promo-code">Nhập mã: {activePromo.code}</span>
                  </div>
                  <p className="promo-date">
                    Từ ngày {formatDate(activePromo.startDate)}  đến ngày {" "}
                    {formatDate(activePromo.endDate)}
                  </p>
                </>
              ) : (
                <>
                  <h3>Khuyến mãi đặc biệt</h3>
                  <p>Hiện chưa có chương trình nào đang diễn ra</p>
                </>
              )}
              <button
                className="promo-button"
                onClick={() => {
                  navigate("/promotions");
                  window.scrollTo(0, 0);
                }}
              >
                Xem tất cả khuyến mãi
              </button>
            </div>
            <div className="promo-image">
              <img src={slider2} alt="Khuyến mãi" />
            </div>
          </div>
          <div className="promo-blocks-small">
            <div className="promo-block promo-small">
              <div className="promo-content">
                <h4>Sách giáo khoa</h4>
                <p>Đầy đủ các bộ sách từ lớp 1-12</p>
              </div>
            </div>
            <div className="promo-block promo-small">
              <div className="promo-content">
                <h4>Sách ngoại ngữ</h4>
                <p>Tiếng Anh, Nhật, Hàn, Trung</p>
              </div>
            </div>
          </div>
        </div>

        <ProductCarousel title="Giảm giá sâu" books={topDiscountedProducts} />

        <ProductCarousel title="Sách văn học" books={vanHocProducts} />

        <ProductCarousel
          title="Dụng cụ học sinh"
          books={dungCuHocSinhProducts}
        />

      

      </div>
    </div>
  );
};

export default HomePage;
