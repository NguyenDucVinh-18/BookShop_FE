import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

// Import images - using correct file names
import slider1 from '../images/slider_item_1_image.jpg';
import slider2 from '../images/slider_item_2_image.jpg';
import slider3 from '../images/slider_item_3_image.jpg';
import slider5 from '../images/slider_item_5_image.jpg';

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentNewBooksSlide, setCurrentNewBooksSlide] = useState(0);
    const [currentTopSellingSlide, setCurrentTopSellingSlide] = useState(0);

    const images = [slider1, slider2];

    // Auto slide effect for main carousel - every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [images.length]);

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

    // Utility function for price formatting
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Hardcoded data for new sections
    const newBooks = [
        {
            id: 1,
            title: "Sách mới 1",
            author: "Tác giả 1",
            price: 150000,
            image: slider1
        },
        {
            id: 2,
            title: "Sách mới 2",
            author: "Tác giả 2",
            price: 180000,
            image: slider2
        },
        {
            id: 3,
            title: "Sách mới 3",
            author: "Tác giả 3",
            price: 120000,
            image: slider3
        },
        {
            id: 4,
            title: "Sách mới 4",
            author: "Tác giả 4",
            price: 200000,
            image: slider5
        },
        {
            id: 5,
            title: "Sách mới 5",
            author: "Tác giả 5",
            price: 160000,
            image: slider1
        },
        {
            id: 6,
            title: "Sách mới 6",
            author: "Tác giả 6",
            price: 140000,
            image: slider2
        },
        {
            id: 7,
            title: "Sách mới 7",
            author: "Tác giả 7",
            price: 170000,
            image: slider3
        },
        {
            id: 8,
            title: "Sách mới 8",
            author: "Tác giả 8",
            price: 190000,
            image: slider5
        }
    ];

    const topSellingBooks = [
        {
            id: 1,
            title: "Sách bán chạy 1",
            author: "Tác giả 1",
            price: 250000,
            image: slider1
        },
        {
            id: 2,
            title: "Sách bán chạy 2",
            author: "Tác giả 2",
            price: 280000,
            image: slider2
        },
        {
            id: 3,
            title: "Sách bán chạy 3",
            author: "Tác giả 3",
            price: 220000,
            image: slider3
        },
        {
            id: 4,
            title: "Sách bán chạy 4",
            author: "Tác giả 4",
            price: 300000,
            image: slider5
        },
        {
            id: 5,
            title: "Sách bán chạy 5",
            author: "Tác giả 5",
            price: 260000,
            image: slider1
        },
        {
            id: 6,
            title: "Sách bán chạy 6",
            author: "Tác giả 6",
            price: 240000,
            image: slider2
        },
        {
            id: 7,
            title: "Sách bán chạy 7",
            author: "Tác giả 7",
            price: 270000,
            image: slider3
        },
        {
            id: 8,
            title: "Sách bán chạy 8",
            author: "Tác giả 8",
            price: 290000,
            image: slider5
        }
    ];

    return (
        <div className="app">
            <Header />
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
                            ‹
                        </button>
                        <button className="carousel-arrow carousel-next" onClick={nextSlide}>
                            ›
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
            </div>

            <Footer />
        </div>
    );
};

export default HomePage;
