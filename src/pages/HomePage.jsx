import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

// Import images - using correct file names
import slider1 from '../images/slider_item_1_image.jpg';
import slider2 from '../images/slider_item_2_image.jpg';
import slider3 from '../images/slider_item_3_image.jpg';
import slider5 from '../images/slider_item_5_image.jpg';

// Import book data from separate file
import {
    newBooks,
    topSellingBooks,
    lifeSkillsBooks,
    childrenBooks,
    businessBooks,
    literatureBooks
} from '../data/books';

const HomePage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentNewBooksSlide, setCurrentNewBooksSlide] = useState(0);
    const [currentTopSellingSlide, setCurrentTopSellingSlide] = useState(0);
    const [currentLifeSkillsSlide, setCurrentLifeSkillsSlide] = useState(0);
    const [currentChildrenSlide, setCurrentChildrenSlide] = useState(0);
    const [currentBusinessSlide, setCurrentBusinessSlide] = useState(0);
    const [currentLiteratureSlide, setCurrentLiteratureSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    const images = [slider1, slider2, slider3, slider5];

    // Auto slide effect for main carousel - every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [images.length]);

    // Countdown timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime.seconds > 0) {
                    return { ...prevTime, seconds: prevTime.seconds - 1 };
                } else if (prevTime.minutes > 0) {
                    return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
                } else if (prevTime.hours > 0) {
                    return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    // Reset timer when it reaches 0
                    return { hours: 23, minutes: 59, seconds: 59 };
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // New Books Navigation
    const nextNewBooks = () => {
        setCurrentNewBooksSlide((prev) => (prev + 1) % Math.ceil(newBooks.length / 4));
    };

    const prevNewBooks = () => {
        setCurrentNewBooksSlide((prev) => (prev - 1 + Math.ceil(newBooks.length / 4)) % Math.ceil(newBooks.length / 4));
    };

    // Top Selling Navigation
    const nextTopSelling = () => {
        setCurrentTopSellingSlide((prev) => (prev + 1) % Math.ceil(topSellingBooks.length / 4));
    };

    const prevTopSelling = () => {
        setCurrentTopSellingSlide((prev) => (prev - 1 + Math.ceil(topSellingBooks.length / 4)) % Math.ceil(topSellingBooks.length / 4));
    };

    // Life Skills Navigation
    const nextLifeSkills = () => {
        setCurrentLifeSkillsSlide((prev) => (prev + 1) % Math.ceil(lifeSkillsBooks.length / 4));
    };

    const prevLifeSkills = () => {
        setCurrentLifeSkillsSlide((prev) => (prev - 1 + Math.ceil(lifeSkillsBooks.length / 4)) % Math.ceil(lifeSkillsBooks.length / 4));
    };

    // Children Books Navigation
    const nextChildren = () => {
        setCurrentChildrenSlide((prev) => (prev + 1) % Math.ceil(childrenBooks.length / 4));
    };

    const prevChildren = () => {
        setCurrentChildrenSlide((prev) => (prev - 1 + Math.ceil(childrenBooks.length / 4)) % Math.ceil(childrenBooks.length / 4));
    };

    // Business Books Navigation
    const nextBusiness = () => {
        setCurrentBusinessSlide((prev) => (prev + 1) % Math.ceil(businessBooks.length / 4));
    };

    const prevBusiness = () => {
        setCurrentBusinessSlide((prev) => (prev - 1 + Math.ceil(businessBooks.length / 4)) % Math.ceil(businessBooks.length / 4));
    };

    // Literature Books Navigation
    const nextLiterature = () => {
        setCurrentLiteratureSlide((prev) => (prev + 1) % Math.ceil(literatureBooks.length / 4));
    };

    const prevLiterature = () => {
        setCurrentLiteratureSlide((prev) => (prev - 1 + Math.ceil(literatureBooks.length / 4)) % Math.ceil(literatureBooks.length / 4));
    };

    // Utility function for price formatting
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Function to navigate to product detail page
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="app">
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
                        <button className="carousel-arrow carousel-prev" onClick={prevSlide}>
                            ←
                        </button>
                        <button className="carousel-arrow carousel-next" onClick={nextSlide}>
                            →
                        </button>

                        {/* Dots Indicator */}
                        <div className="carousel-dots">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
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
                        <p className="hero-subtitle">Hàng nghìn đầu sách chất lượng với giá tốt nhất</p>
                        <button className="hero-button">Khám phá ngay</button>
                    </div>
                    <div className="hero-image">
                        <img src={slider1} alt="Hero" />
                    </div>
                </div>

                {/* New Books Section */}
                <div className="new-books-section">
                    <div className="section-header">
                        <h2 className="section-title">Sách mới</h2>
                        <div className="section-nav">
                            <button className="nav-arrow" onClick={prevNewBooks}>‹</button>
                            <button className="nav-arrow" onClick={nextNewBooks}>›</button>
                        </div>
                    </div>
                    <div className="books-carousel">
                        <div className="books-slides" style={{ transform: `translateX(-${currentNewBooksSlide * 100}%)` }}>
                            {Array.from({ length: Math.ceil(newBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {newBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
                                        <div key={book.id} className="book-card" onClick={() => handleProductClick(book.id)}>
                                            <div className="book-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">{book.author}</p>
                                                <div className="book-price">{formatPrice(book.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Promotional Blocks */}
                <div className="promotional-blocks">
                    <div className="promo-block promo-large">
                        <div className="promo-content">
                            <h3>Khuyến mãi đặc biệt</h3>
                            <p>Giảm giá lên đến 50% cho sách bán chạy</p>
                            <button className="promo-button">Xem ngay</button>
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

                {/* Top Selling Section */}
                <div className="top-selling-section">
                    <div className="section-header">
                        <h2 className="section-title">Sách bán chạy</h2>
                        <div className="section-nav">
                            <button className="nav-arrow" onClick={prevTopSelling}>‹</button>
                            <button className="nav-arrow" onClick={nextTopSelling}>›</button>
                        </div>
                    </div>
                    <div className="books-carousel">
                        <div className="books-slides" style={{ transform: `translateX(-${currentTopSellingSlide * 100}%)` }}>
                            {Array.from({ length: Math.ceil(topSellingBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {topSellingBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
                                        <div key={book.id} className="book-card">
                                            <div className="book-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">{book.author}</p>
                                                <div className="book-price">{formatPrice(book.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Life Skills Section */}
                <div className="new-books-section">
                    <div className="section-header">
                        <h2 className="section-title">Sách kĩ năng sống</h2>
                        <div className="section-nav">
                            <button className="nav-arrow" onClick={prevLifeSkills}>‹</button>
                            <button className="nav-arrow" onClick={nextLifeSkills}>›</button>
                        </div>
                    </div>
                    <div className="books-carousel">
                        <div className="books-slides" style={{ transform: `translateX(-${currentLifeSkillsSlide * 100}%)` }}>
                            {Array.from({ length: Math.ceil(lifeSkillsBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {lifeSkillsBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
                                        <div key={book.id} className="book-card">
                                            <div className="book-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">{book.author}</p>
                                                <div className="book-price">{formatPrice(book.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
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
                                    <h2 className="flash-sale-title">Sách Bestseller - Giảm 50%</h2>
                                    <p className="flash-sale-description">Cuốn sách được yêu thích nhất tháng này với giá cực sốc!</p>
                                    <div className="flash-sale-price">
                                        <span className="original-price">500.000đ</span>
                                        <span className="sale-price">250.000đ</span>
                                    </div>
                                    <div className="countdown-timer">
                                        <h3>Kết thúc sau:</h3>
                                        <div className="timer-display">
                                            <div className="timer-unit">
                                                <span className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                                                <span className="timer-label">Giờ</span>
                                            </div>
                                            <span className="timer-separator">:</span>
                                            <div className="timer-unit">
                                                <span className="timer-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                                <span className="timer-label">Phút</span>
                                            </div>
                                            <span className="timer-separator">:</span>
                                            <div className="timer-unit">
                                                <span className="timer-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                                <span className="timer-label">Giây</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="flash-sale-button">Mua ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Children Books Section */}
                <div className="new-books-section">
                    <div className="section-header">
                        <h2 className="section-title">Sách thiếu nhi</h2>
                        <div className="section-nav">
                            <button className="nav-arrow" onClick={prevChildren}>‹</button>
                            <button className="nav-arrow" onClick={nextChildren}>›</button>
                        </div>
                    </div>
                    <div className="books-carousel">
                        <div className="books-slides" style={{ transform: `translateX(-${currentChildrenSlide * 100}%)` }}>
                            {Array.from({ length: Math.ceil(childrenBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {childrenBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
                                        <div key={book.id} className="book-card">
                                            <div className="book-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">{book.author}</p>
                                                <div className="book-price">{formatPrice(book.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Business Books Section */}
                <div className="new-books-section">
                    <div className="section-header">
                        <h2 className="section-title">Sách kinh doanh</h2>
                        <div className="section-nav">
                            <button className="nav-arrow" onClick={prevBusiness}>‹</button>
                            <button className="nav-arrow" onClick={nextBusiness}>›</button>
                        </div>
                    </div>
                    <div className="books-carousel">
                        <div className="books-slides" style={{ transform: `translateX(-${currentBusinessSlide * 100}%)` }}>
                            {Array.from({ length: Math.ceil(businessBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {businessBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
                                        <div key={book.id} className="book-card">
                                            <div className="book-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">{book.author}</p>
                                                <div className="book-price">{formatPrice(book.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Literature Books Section */}
                <div className="new-books-section">
                    <div className="section-header">
                        <h2 className="section-title">Sách văn học</h2>
                        <div className="section-nav">
                            <button className="nav-arrow" onClick={prevLiterature}>‹</button>
                            <button className="nav-arrow" onClick={nextLiterature}>›</button>
                        </div>
                    </div>
                    <div className="books-carousel">
                        <div className="books-slides" style={{ transform: `translateX(-${currentLiteratureSlide * 100}%)` }}>
                            {Array.from({ length: Math.ceil(literatureBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {literatureBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
                                        <div key={book.id} className="book-card">
                                            <div className="book-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">{book.author}</p>
                                                <div className="book-price">{formatPrice(book.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
