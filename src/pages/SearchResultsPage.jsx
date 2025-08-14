import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Empty, Spin } from 'antd';
import { SearchOutlined, EyeOutlined, ShoppingCartOutlined, ZoomInOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
    newBooks, topSellingBooks, lifeSkillsBooks,
    childrenBooks, businessBooks, literatureBooks
} from '../data/books';
import '../styles/SearchResultsPage.css';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);

    const query = searchParams.get('q');

    // Load cart items from localStorage on component mount
    useEffect(() => {
        const savedCartItems = localStorage.getItem('cartItems');
        if (savedCartItems) {
            try {
                setCartItems(JSON.parse(savedCartItems));
            } catch (error) {
                console.error('Error parsing cart items:', error);
                setCartItems([]);
            }
        }
    }, []);

    // Save cart items to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Combine all books for search
    const allBooks = [
        ...newBooks.map(book => ({ ...book, category: 'new' })),
        ...topSellingBooks.map(book => ({ ...book, category: 'topSelling' })),
        ...lifeSkillsBooks.map(book => ({ ...book, category: 'lifeSkills' })),
        ...childrenBooks.map(book => ({ ...book, category: 'children' })),
        ...businessBooks.map(book => ({ ...book, category: 'business' })),
        ...literatureBooks.map(book => ({ ...book, category: 'literature' }))
    ];

    // Search function
    const performSearch = (searchTerm) => {
        if (!searchTerm.trim()) return [];

        const term = searchTerm.toLowerCase();
        return allBooks.filter(book =>
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term)
        );
    };

    // Search effect
    useEffect(() => {
        if (query) {
            setIsLoading(true);
            // Simulate search delay
            setTimeout(() => {
                const results = performSearch(query);
                setSearchResults(results);
                setIsLoading(false);
            }, 500);
        }
    }, [query]);

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Handle product click
    const handleProductClick = (productId, sourceCategory) => {
        navigate(`/product/${productId}`, { state: { sourceCategory } });
    };

    // Handle zoom click
    const handleZoomClick = (book, sourceCategory) => {
        setSelectedProduct({ ...book, sourceCategory });
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
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (selectedProduct) {
            const existingItem = cartItems.find(item => item.id === selectedProduct.id);

            if (existingItem) {
                setCartItems(prev => prev.map(item =>
                    item.id === selectedProduct.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                ));
            } else {
                const productInfo = { ...selectedProduct, sourceCategory: selectedProduct.sourceCategory || 'general', quantity: quantity };
                setCartItems(prev => [...prev, productInfo]);
            }

            closeModal();
            // Show success message or redirect to cart
            alert('Đã thêm sản phẩm vào giỏ hàng!');
        }
    };

    // Handle view details
    const handleViewDetails = () => {
        if (selectedProduct) {
            handleProductClick(selectedProduct.id, selectedProduct.sourceCategory);
            closeModal();
        }
    };

    // Handle add to cart from hover
    const handleAddToCartFromHover = (book, sourceCategory) => {
        const existingItem = cartItems.find(item => item.id === book.id);

        if (existingItem) {
            setCartItems(prev => prev.map(item =>
                item.id === book.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            const productInfo = { ...book, sourceCategory, quantity: 1 };
            setCartItems(prev => [...prev, productInfo]);
        }

        // Show success message
        alert('Đã thêm sản phẩm vào giỏ hàng!');
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
            <div className="container">
                {/* Search Header */}
                <div className="search-header">
                    <h1>Kết quả tìm kiếm</h1>
                    <div className="search-info">
                        <SearchOutlined className="search-icon" />
                        <span>Tìm kiếm: "{query}"</span>
                        <span className="results-count">({searchResults.length} kết quả)</span>
                    </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 ? (
                    <div className="search-results">
                        <div className="results-grid">
                            {searchResults.map((book) => (
                                <div key={book.id} className="book-card" onClick={() => handleProductClick(book.id, book.category)}>
                                    <div className="book-image">
                                        <img src={book.image} alt={book.title} />
                                        <div className="book-hover-overlay">
                                            <div className="hover-icons">
                                                <button className="hover-icon" onClick={(e) => { e.stopPropagation(); handleZoomClick(book, book.category); }}>
                                                    <ZoomInOutlined />
                                                </button>
                                                <button className="hover-icon" onClick={(e) => { e.stopPropagation(); handleProductClick(book.id, book.category); }}>
                                                    <EyeOutlined />
                                                </button>
                                                <button className="hover-icon" onClick={(e) => { e.stopPropagation(); handleAddToCartFromHover(book, book.category); }}>
                                                    <ShoppingCartOutlined />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="book-info">
                                        <h3 className="book-title">{book.title}</h3>
                                        <p className="book-author">{book.author}</p>
                                        <div className="book-price">{formatPrice(book.price)}</div>
                                        <div className="book-category">{book.category}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <Button type="primary" onClick={() => navigate('/')}>
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
                                    <div className="modal-main-image">
                                        <img src={selectedProduct.image} alt={selectedProduct.title} />
                                    </div>
                                    <div className="modal-thumbnails">
                                        {[selectedProduct.image, selectedProduct.image, selectedProduct.image, selectedProduct.image].map((image, index) => (
                                            <div
                                                key={index}
                                                className={`modal-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                                onClick={() => handleThumbnailClick(index)}
                                            >
                                                <img src={image} alt={`${selectedProduct.title} ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Panel - Product Details */}
                                <div className="modal-right">
                                    <h3 className="modal-product-title">{selectedProduct.title}</h3>

                                    <div className="modal-pricing">
                                        <div className="modal-current-price">{formatPrice(selectedProduct.price)}</div>
                                        <div className="modal-original-price">{formatPrice(selectedProduct.price + 50000)}</div>
                                        <div className="modal-discount">Giảm 20%</div>
                                    </div>

                                    <div className="modal-description">
                                        <p>
                                            {selectedProduct.title} là một cuốn sách hay và bổ ích, được viết bởi {selectedProduct.author}.
                                            Với những hình ảnh sinh động, màu sắc tươi sáng, sách giúp độc giả học hỏi một cách
                                            tự nhiên và thú vị.
                                        </p>
                                    </div>

                                    <div className="modal-specs">
                                        <div className="modal-spec-item">
                                            <span className="spec-label">Nhà cung cấp:</span>
                                            <span className="spec-value">NXB MINHLONG</span>
                                        </div>
                                        <div className="modal-spec-item">
                                            <span className="spec-label">Mã sản phẩm:</span>
                                            <span className="spec-value">{selectedProduct.id}</span>
                                        </div>
                                    </div>

                                    <div className="modal-quantity">
                                        <span className="quantity-label">Số lượng</span>
                                        <div className="quantity-controls">
                                            <button className="quantity-btn" onClick={() => handleQuantityChange('decrease')}>
                                                <MinusOutlined />
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="quantity-input"
                                                min="1"
                                            />
                                            <button className="quantity-btn" onClick={() => handleQuantityChange('increase')}>
                                                <PlusOutlined />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="modal-actions">
                                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                            Thêm vào giỏ
                                        </button>
                                        <div className="view-details-link">
                                            hoặc <button className="view-details-btn" onClick={handleViewDetails}>Xem chi tiết</button>
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
