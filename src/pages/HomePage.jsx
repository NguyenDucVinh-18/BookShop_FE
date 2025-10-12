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
} from "../service/product.service";
import { AuthContext } from "../components/context/auth.context";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
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
  const [vanHocProducts, setVanHocProducts] = useState([]);
  const [dungCuHocSinhProducts, setDungCuHocSinhProducts] = useState([]);
  const fetchProducts = async () => {
    try {
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
                  className={`carousel-dot ${index === currentSlide ? "active" : ""
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
              onClick={() => navigate("/allProduct")}
            >
              Khám phá ngay
            </button>
          </div>
          <div className="hero-image">
            <img src={slider1} alt="Hero" />
          </div>
        </div>

        <ProductCarousel
          title="Sách văn học"
          books={vanHocProducts}
        />

        <ProductCarousel
          title="Dụng cụ học sinh"
          books={dungCuHocSinhProducts}
        />

        {/* Promotional Blocks */}
        <div className="promotional-blocks">
          <div className="promo-block promo-large">
            <div className="promo-content">
              <h3>Khuyến mãi đặc biệt</h3>
              <p>Giảm giá lên đến 50% cho sách bán chạy</p>
              <button
                className="promo-button"
                onClick={() => navigate("/allProduct")}
              >
                Xem ngay
              </button>
            </div>
            <div className="promo-image">
              <img src={slider2} alt="Promo 1" />
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

        {/* Flash Sale Section with Countdown */}
        <div className="flash-sale-section">
          <div className="flash-sale-content">
            <div className="flash-sale-image">
              <img src={slider1} alt="Flash Sale Product" />
              <div className="sale-badge">FLASH SALE</div>
              <div className="flash-sale-overlay">
                <div className="flash-sale-info">
                  <h2 className="flash-sale-title">
                    Sách Bestseller - Giảm 50%
                  </h2>
                  <p className="flash-sale-description">
                    Cuốn sách được yêu thích nhất tháng này với giá cực sốc!
                  </p>
                  <div className="flash-sale-price">
                    <span className="original-price">500.000đ</span>
                    <span className="sale-price">250.000đ</span>
                  </div>
                  <div className="countdown-timer">
                    <h3>Kết thúc sau:</h3>
                    <div className="timer-display">
                      <div className="timer-unit">
                        <span className="timer-number">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                        <span className="timer-label">Giờ</span>
                      </div>
                      <span className="timer-separator">:</span>
                      <div className="timer-unit">
                        <span className="timer-number">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                        <span className="timer-label">Phút</span>
                      </div>
                      <span className="timer-separator">:</span>
                      <div className="timer-unit">
                        <span className="timer-number">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                        <span className="timer-label">Giây</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="flash-sale-button"
                    onClick={() => navigate("/allProduct")}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
