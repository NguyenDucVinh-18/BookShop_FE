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
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);

    // Shopping Cart Modal state - giống HomePage
    const [isCartModalVisible, setIsCartModalVisible] = useState(false);
    const [cartNotes, setCartNotes] = useState('');

    const query = searchParams.get('q');
    const [adminProducts, setAdminProducts] = useState([]);

    // Load and keep admin products in sync (Sale/Manage Panel updates)
    useEffect(() => {
        const readAdmin = () => {
            try {
                const raw = localStorage.getItem('saleProducts');
                const list = raw ? JSON.parse(raw) : [];
                setAdminProducts(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error('Search page: error reading saleProducts', e);
                setAdminProducts([]);
            }
        };

        readAdmin();
        const onUpdate = () => readAdmin();
        window.addEventListener('saleProductsUpdated', onUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'saleProducts') onUpdate();
        });
        return () => {
            window.removeEventListener('saleProductsUpdated', onUpdate);
        };
    }, []);

    // Load cart items from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart.items || []);
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                setCartItems([]);
            }
        }
    }, []);

    // Save cart items to localStorage whenever cartItems changes
    useEffect(() => {
        if (cartItems.length > 0) {
            const cartData = {
                items: cartItems
            };
            localStorage.setItem('shoppingCart', JSON.stringify(cartData));
        } else {
            localStorage.removeItem('shoppingCart');
        }

        // Emit custom event to notify Header component about cart update
        window.dispatchEvent(new Event('cartUpdated'));
    }, [cartItems]);

    // Combine all books for search with admin overrides and additions
    const allBooks = React.useMemo(() => {
        // 1) base from mock datasets with explicit category
        const base = [
            ...newBooks.map(b => ({ ...b, category: 'new' })),
            ...topSellingBooks.map(b => ({ ...b, category: 'topSelling' })),
            ...lifeSkillsBooks.map(b => ({ ...b, category: 'lifeSkills' })),
            ...childrenBooks.map(b => ({ ...b, category: 'children' })),
            ...businessBooks.map(b => ({ ...b, category: 'business' })),
            ...literatureBooks.map(b => ({ ...b, category: 'literature' }))
        ];

        if (!adminProducts || adminProducts.length === 0) return base;

        // 2) override by id from admin, normalize fields, prefer images[0]
        const idToIndex = new Map();
        base.forEach((item, idx) => idToIndex.set(item.id, idx));

        const usedIds = new Set();
        const normalizedAdmin = adminProducts.map(ap => ({
            ...ap,
            id: ap.id,
            title: ap.title || ap.productName,
            author: Array.isArray(ap.author) ? ap.author.join(', ') : (ap.author || ''),
            price: Number(ap.price) || 0,
            image: (Array.isArray(ap.images) && ap.images.length > 0) ? ap.images[0] : (ap.image || ''),
            category: ap.category || 'new'
        }));

        normalizedAdmin.forEach((ap) => {
            usedIds.add(ap.id);
            if (idToIndex.has(ap.id)) {
                base[idToIndex.get(ap.id)] = { ...base[idToIndex.get(ap.id)], ...ap };
            }
        });

        // 3) append admin-only items not in mock
        const adminOnly = normalizedAdmin.filter(ap => !idToIndex.has(ap.id));
        return [...base, ...adminOnly];
    }, [adminProducts]);

    // Search function
    const performSearch = React.useCallback((searchTerm) => {
        if (!searchTerm.trim()) return [];

        const term = searchTerm.toLowerCase();
        return allBooks.filter(book => {
            const title = (book.title || '').toLowerCase();
            const author = (book.author || '').toLowerCase();
            const category = (book.category || '').toLowerCase();
            const idStr = String(book.id || '');
            return title.includes(term) || author.includes(term) || category.includes(term) || idStr.includes(term);
        });
    }, [allBooks]);

    // Search effect
    useEffect(() => {
        if (query) {
            setIsLoading(true);
            // Simulate search delay
            setTimeout(() => {
                const results = performSearch(query);
                setSearchResults(results);
                setCurrentPage(1);
                setIsLoading(false);
            }, 500);
        }
    }, [query, performSearch]);

    // Derived pagination values
    const totalPages = Math.max(1, Math.ceil(searchResults.length / pageSize));
    const clampedPage = Math.min(currentPage, totalPages);
    const startIndex = (clampedPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, searchResults.length);
    const visibleResults = searchResults.slice(startIndex, endIndex);

    const goToPage = (page) => {
        const next = Math.min(Math.max(1, page), totalPages);
        setCurrentPage(next);
        // scroll to top of results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
        const normalizedImage = (book && Array.isArray(book.images) && book.images.length > 0)
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
                const normalizedImage = (selectedProduct && Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0)
                    ? selectedProduct.images[0]
                    : selectedProduct?.image;
                const productInfo = { ...selectedProduct, image: normalizedImage, sourceCategory: selectedProduct.sourceCategory || 'general', quantity: quantity };
                setCartItems(prev => [...prev, productInfo]);
            }

            closeModal();
            setIsCartModalVisible(true);
        }
    };

    // Handle view details
    const handleViewDetails = () => {
        if (selectedProduct) {
            handleProductClick(selectedProduct.id, selectedProduct.sourceCategory);
            closeModal();
        }
    };

    // Shopping Cart Functions - giống HomePage
    const handleRemoveFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
        setCartNotes('');
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
        } else {
            setCartItems(prev => prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const closeCartModal = () => {
        setIsCartModalVisible(false);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleContinueShopping = () => {
        closeCartModal();
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
            const normalizedImage = (book && Array.isArray(book.images) && book.images.length > 0)
                ? book.images[0]
                : book?.image;
            const productInfo = { ...book, image: normalizedImage, sourceCategory, quantity: 1 };
            setCartItems(prev => [...prev, productInfo]);
        }

        setIsCartModalVisible(true);
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
                            {visibleResults.map((book) => (
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
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button className="page-btn" disabled={clampedPage === 1} onClick={() => goToPage(clampedPage - 1)}>Trước</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button key={p} className={`page-btn ${p === clampedPage ? 'active' : ''}`} onClick={() => goToPage(p)}>{p}</button>
                                ))}
                                <button className="page-btn" disabled={clampedPage === totalPages} onClick={() => goToPage(clampedPage + 1)}>Sau</button>
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

                {/* Shopping Cart Modal - giống HomePage */}
                {isCartModalVisible && (
                    <div className="cart-modal-overlay" onClick={closeCartModal}>
                        <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="cart-modal-header">
                                <h2>Giỏ Hàng</h2>
                                <div className="cart-header-actions">
                                    {cartItems.length > 0 && (
                                        <button className="cart-clear-all-btn" onClick={clearCart}>
                                            Xóa tất cả
                                        </button>
                                    )}
                                    <button className="cart-modal-close" onClick={closeCartModal}>
                                        ×
                                    </button>
                                </div>
                            </div>

                            <div className="cart-modal-content">
                                {cartItems.length === 0 ? (
                                    <div className="cart-empty">
                                        <p>Giỏ hàng trống</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="cart-table">
                                            <div className="cart-table-header">
                                                <div className="cart-header-cell">Sản phẩm</div>
                                                <div className="cart-header-cell">Mô Tả</div>
                                                <div className="cart-header-cell">Giá</div>
                                                <div className="cart-header-cell">Số Lượng</div>
                                                <div className="cart-header-cell">Tổng</div>
                                                <div className="cart-header-cell">Xóa</div>
                                            </div>

                                            {cartItems.map((item) => (
                                                <div key={item.id} className="cart-table-row">
                                                    <div className="cart-product-cell">
                                                        <img src={item.image} alt={item.title} className="cart-product-image" />
                                                    </div>
                                                    <div className="cart-description-cell">
                                                        <p>Sách: {item.title}</p>
                                                        <p>Tác giả: {item.author}</p>
                                                    </div>
                                                    <div className="cart-price-cell">
                                                        {formatPrice(item.price)}
                                                    </div>
                                                    <div className="cart-quantity-cell">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                            min="1"
                                                            className="cart-quantity-input"
                                                        />
                                                    </div>
                                                    <div className="cart-total-cell">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </div>
                                                    <div className="cart-delete-cell">
                                                        <button
                                                            onClick={() => handleRemoveFromCart(item.id)}
                                                            className="cart-delete-btn"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="cart-notes">
                                            <label>Chú Thích:</label>
                                            <textarea
                                                value={cartNotes}
                                                onChange={(e) => setCartNotes(e.target.value)}
                                                placeholder="Ghi chú cho đơn hàng..."
                                                className="cart-notes-textarea"
                                            />
                                        </div>

                                        <div className="cart-summary">
                                            <div className="cart-total">
                                                <strong>Tổng {formatPrice(calculateTotal())}</strong>
                                            </div>

                                            <div className="cart-actions">
                                                <button className="cart-view-btn" onClick={() => { closeCartModal(); navigate('/cart'); }}>
                                                    XEM GIỎ HÀNG
                                                </button>
                                                <button className="cart-continue-btn" onClick={handleContinueShopping}>
                                                    TIẾP TỤC MUA HÀNG
                                                </button>
                                                <button className="cart-checkout-btn" onClick={() => {
                                                    // Save notes to localStorage only when user actually goes to checkout
                                                    if (cartNotes.trim() !== '') {
                                                        const currentCart = localStorage.getItem('shoppingCart');
                                                        if (currentCart) {
                                                            try {
                                                                const parsedCart = JSON.parse(currentCart);
                                                                const cartData = {
                                                                    ...parsedCart,
                                                                    notes: cartNotes
                                                                };
                                                                localStorage.setItem('shoppingCart', JSON.stringify(cartData));
                                                            } catch (error) {
                                                                console.error('Error updating cart with notes:', error);
                                                            }
                                                        }
                                                    }
                                                    navigate('/checkout');
                                                }}>
                                                    THANH TOÁN
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;
