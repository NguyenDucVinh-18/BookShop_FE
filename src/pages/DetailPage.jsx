import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Badge, Tabs } from 'antd';
import { MinusOutlined, PlusOutlined, HeartOutlined, ShareAltOutlined, TruckOutlined, StarOutlined, CheckCircleOutlined, GiftOutlined } from '@ant-design/icons';
import '../styles/DetailPage.css';

// Import book data to find the specific product
import {
    newBooks,
    topSellingBooks,
    lifeSkillsBooks,
    childrenBooks,
    businessBooks,
    literatureBooks
} from '../data/books';

const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0); // Track selected thumbnail
    const [currentRelatedProductsSlide, setCurrentRelatedProductsSlide] = useState(0);

    // Find the product based on ID from all book arrays
    useEffect(() => {
        const allBooks = [
            ...newBooks,
            ...topSellingBooks,
            ...lifeSkillsBooks,
            ...childrenBooks,
            ...businessBooks,
            ...literatureBooks
        ];

        const foundProduct = allBooks.find(book => book.id === parseInt(id));
        setProduct(foundProduct);

        // Auto scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Handle thumbnail click
    const handleThumbnailClick = (index) => {
        setSelectedImage(index);
    };

    // Related Products Navigation
    const nextRelatedProducts = () => {
        setCurrentRelatedProductsSlide((prev) => (prev + 1) % Math.ceil(newBooks.length / 4));
    };

    const prevRelatedProducts = () => {
        setCurrentRelatedProductsSlide((prev) => (prev - 1 + Math.ceil(newBooks.length / 4)) % Math.ceil(newBooks.length / 4));
    };

    // Best selling products for sidebar (using random products from newBooks)
    const bestSellingProducts = newBooks
        .sort(() => Math.random() - 0.5) // Randomize the array
        .slice(0, 4); // Take only 4 products

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Show loading or error if product not found
    if (!product) {
        return (
            <div className="detail-page">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <h2>Sản phẩm không tìm thấy</h2>
                        <p>Không thể tìm thấy sản phẩm với ID: {id}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Create array of images (main image + variations)
    const productImages = [
        product.image,
        product.image, // You can replace these with different image variations
        product.image,
        product.image
    ];

    return (
        <div className="detail-page">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <div className="container">
                    <span
                        className="breadcrumb-item clickable"
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        Trang chủ
                    </span>
                    <span className="breadcrumb-separator"> &gt; </span>
                    <span className="breadcrumb-item">TẤT CẢ SẢN PHẨM</span>
                    <span className="breadcrumb-separator"> &gt; </span>
                    <span className="breadcrumb-item">{product.title}</span>
                </div>
            </div>

            <div className="container">
                <div className="product-detail">
                    {/* Left Section - Product Images */}
                    <div className="product-images">
                        <div className="main-image">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.title}
                            />
                        </div>
                        <div className="thumbnail-images">
                            {productImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => handleThumbnailClick(index)}
                                >
                                    <img src={image} alt={`${product.title} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Product Information */}
                    <div className="product-info">
                        <div className="read-sample">
                            <Button type="link" className="read-sample-btn">
                                Đọc Thử <span className="arrow">↓</span>
                            </Button>
                        </div>

                        <h1 className="product-title">
                            {product.title}
                        </h1>

                        <div className="product-code">
                            Mã sản phẩm: {product.id}
                        </div>

                        <div className="product-specs">
                            <div className="spec-item">
                                <span className="spec-label">Tác giả:</span>
                                <span className="spec-value">{product.author}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">NXB:</span>
                                <span className="spec-value">NXB MINHLONG</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Kích thước:</span>
                                <span className="spec-value">15.5x15.5 cm</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Năm xuất bản:</span>
                                <span className="spec-value">2024</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Số trang:</span>
                                <span className="spec-value">300</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Khối lượng:</span>
                                <span className="spec-value">400 grams</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Bìa:</span>
                                <span className="spec-value">bìa mềm</span>
                            </div>
                        </div>

                        <div className="product-pricing">
                            <div className="current-price">{formatPrice(product.price)}</div>
                            <div className="original-price">{formatPrice(product.price + 50000)}</div>
                            <div className="discount">Giảm 20%</div>
                        </div>

                        <div className="quantity-selector">
                            <span className="quantity-label">Số lượng</span>
                            <div className="quantity-controls">
                                <Button
                                    icon={<MinusOutlined />}
                                    onClick={() => handleQuantityChange('decrease')}
                                    className="quantity-btn"
                                />
                                <Input
                                    value={quantity}
                                    className="quantity-input"
                                    readOnly
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => handleQuantityChange('increase')}
                                    className="quantity-btn"
                                />
                            </div>
                        </div>

                        <Button type="primary" className="add-to-cart-btn" size="large">
                            THÊM VÀO GIỎ
                        </Button>

                        <div className="services">
                            <h4>Dịch vụ của chúng tôi</h4>
                            <div className="service-item">
                                <TruckOutlined className="service-icon" />
                                <span>Giao tận nhà trong 3 - 7 ngày làm việc.</span>
                            </div>
                            <div className="service-item">
                                <StarOutlined className="service-icon" />
                                <span>Miễn phí giao hàng Toàn Quốc cho đơn hàng trên 300k.</span>
                            </div>
                        </div>

                        <div className="promotions">
                            <h4>Dịch vụ & Khuyến mãi</h4>
                            <div className="promotion-item">
                                <CheckCircleOutlined className="promotion-icon" />
                                <span>Đối với sản phầm giảm 40% - 50% - 70% (sản phẩm xả kho): Mỗi khách hàng được mua tối đa 3 sản phẩm/ 1 mặt hàng/ 1 đơn hàng</span>
                            </div>
                            <div className="promotion-item">
                                <GiftOutlined className="promotion-icon" />
                                <span>Tặng kèm Bookmark (đánh dấu trang) cho các sách Kĩ năng sống, Kinh doanh, Mẹ và Bé, Văn học</span>
                            </div>
                            <div className="promotion-item">
                                <GiftOutlined className="promotion-icon" />
                                <span>FREESHIP cho đơn hàng từ 300K trở lên</span>
                            </div>
                            <div className="promotion-item">
                                <GiftOutlined className="promotion-icon" />
                                <span>Tặng kèm 1 VOUCHER 20K cho đơn từ 500K trở lên</span>
                            </div>
                        </div>

                        <div className="social-actions">
                            <Button icon={<HeartOutlined />} className="like-btn">
                                Thích 0
                            </Button>
                            <Button icon={<ShareAltOutlined />} className="share-btn">
                                Chia sẻ
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Tabs and Best Selling Products */}
                <div className="product-bottom">
                    <div className="main-content">
                        <Tabs
                            defaultActiveKey="description"
                            items={[
                                {
                                    key: 'description',
                                    label: 'MÔ TẢ',
                                    children: (
                                        <div className="tab-content">
                                            <h3 className="tab-title">SÁCH: {product.title}</h3>
                                            <div className="product-description">
                                                <p>
                                                    {product.title} là một cuốn sách hay và bổ ích, được viết bởi {product.author}.
                                                    Với những hình ảnh sinh động, màu sắc tươi sáng, sách giúp độc giả học hỏi một cách
                                                    tự nhiên và thú vị.
                                                </p>
                                                <p>
                                                    Cuốn sách này bao gồm nhiều chủ đề quen thuộc và thiết thực. Mỗi chương đều có
                                                    nội dung rõ ràng và dễ hiểu, phù hợp với nhiều đối tượng độc giả khác nhau.
                                                </p>
                                                <p>
                                                    Sách được in trên giấy chất lượng cao, bìa mềm an toàn. Đây là món quà
                                                    ý nghĩa giúp độc giả phát triển kiến thức và khả năng tư duy.
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    key: 'comments',
                                    label: 'BÌNH LUẬN',
                                    children: (
                                        <div className="tab-content">
                                            <p>Chưa có bình luận nào cho sản phẩm này.</p>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    {/* Right Sidebar - Best Selling Products */}
                    <div className="sidebar">
                        <h3 className="sidebar-title">SẢN PHẨM BÁN CHẠY</h3>
                        <div className="best-selling-products">
                            {bestSellingProducts.map((book) => (
                                <div
                                    key={book.id}
                                    className="product-card"
                                    onClick={() => navigate(`/product/${book.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="product-image">
                                        <img src={book.image} alt={book.title} />
                                    </div>
                                    <div className="product-details">
                                        <h4 className="product-title">{book.title}</h4>
                                        <div className="product-prices">
                                            <span className="original-price">{formatPrice(book.price + 50000)}</span>
                                            <span className="sale-price">{formatPrice(book.price)}</span>
                                        </div>
                                        <div className="discount-badge">-20%</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Xem thêm button */}
                        <div className="view-more-section">
                            <Button type="link" className="view-more-btn">
                                Xem thêm
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="related-products-section">
                    <div className="section-header">
                        <h2 className="section-title">SẢN PHẨM LIÊN QUAN</h2>
                        <div className="section-nav">
                            <button className="nav-arrow" onClick={prevRelatedProducts}>‹</button>
                            <button className="nav-arrow" onClick={nextRelatedProducts}>›</button>
                        </div>
                    </div>
                    <div className="books-carousel">
                        <div className="books-slides" style={{ transform: `translateX(-${currentRelatedProductsSlide * 100}%)` }}>
                            {Array.from({ length: Math.ceil(newBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {newBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
                                        <div key={book.id} className="book-card" onClick={() => navigate(`/product/${book.id}`)}>
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

export default DetailPage;
