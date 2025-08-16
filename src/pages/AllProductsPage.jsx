import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Radio, Input, Select } from 'antd';
import { SearchOutlined, EyeOutlined, ShoppingCartOutlined, ZoomInOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { newBooks, topSellingBooks, lifeSkillsBooks, childrenBooks, businessBooks, literatureBooks } from '../data/books';

import '../styles/AllProductsPage.css';

const { Option } = Select;

const AllProductsPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isCartModalVisible, setIsCartModalVisible] = useState(false);
    const [cartNotes, setCartNotes] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter states
    const [selectedPublishers, setSelectedPublishers] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('new');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Submenu states
    const [expandedCategories, setExpandedCategories] = useState([]);

    // Get all books from all categories
    const allBooks = [
        ...(newBooks || []),
        ...(topSellingBooks || []),
        ...(lifeSkillsBooks || []),
        ...(childrenBooks || []),
        ...(businessBooks || []),
        ...(literatureBooks || [])
    ];

    // Get unique publishers (mock data for now)
    const publishers = ['Minh Long tổng hợp', 'Thanh niên', 'Văn hóa thông tin', 'Hồng Bàng', 'Mỹ Thuật', 'Đại học Sư Phạm', 'NXB Phụ nữ Việt Nam', 'ĐHQG Hà Nội', 'NXB Văn Học', 'Đại học Sư phạm'];

    // Filter and sort books
    const filteredBooks = allBooks.filter(book => {
        const matchesPublisher = selectedPublishers.length === 0 || selectedPublishers.includes(book.publisher);
        const matchesPrice = selectedPriceRange === '' || checkPriceRange(book.price, selectedPriceRange);
        const matchesSearch = searchQuery === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesPublisher && matchesPrice && matchesSearch;
    });

    // Sort books
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        switch (sortBy) {
            case 'new':
                return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
            case 'bestselling':
                return (b.soldCount || 0) - (a.soldCount || 0);
            case 'discount':
                return (b.discount || 0) - (a.discount || 0);
            case 'price-high':
                return b.price - a.price;
            case 'price-low':
                return a.price - b.price;
            default:
                return 0;
        }
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = sortedBooks.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPublishers, selectedPriceRange, searchQuery, sortBy]);

    // Price range checking
    function checkPriceRange(price, range) {
        switch (range) {
            case 'under-100k':
                return price < 100000;
            case '100k-200k':
                return price >= 100000 && price <= 200000;
            case '200k-300k':
                return price > 200000 && price <= 300000;
            case '300k-400k':
                return price > 300000 && price <= 400000;
            case 'over-400k':
                return price > 400000;
            default:
                return true;
        }
    }

    // Load cart from localStorage
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

    // Save cart to localStorage whenever cartItems changes
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

    // Product modal functions
    const handleZoomClick = (product) => {
        setSelectedProduct({ ...product, sourceCategory: 'allProducts' });
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
    };

    // Function to handle quantity change
    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Cart functions
    const handleAddToCart = (product) => {
        if (selectedProduct) {
            const existingItem = cartItems.find(item => item.id === selectedProduct.id);

            if (existingItem) {
                setCartItems(prev => prev.map(item =>
                    item.id === selectedProduct.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                ));
            } else {
                const productInfo = { ...selectedProduct, sourceCategory: selectedProduct.sourceCategory || 'allProducts', quantity: quantity };
                setCartItems(prev => [...prev, productInfo]);
            }

            closeModal();
            setIsCartModalVisible(true);
        }
    };

    const handleAddToCartFromHover = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            setCartItems(prev => prev.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems(prev => [...prev, { ...product, sourceCategory: 'allProducts', quantity: 1 }]);
        }

        setIsCartModalVisible(true);
    };

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

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Handle product click
    const handleProductClick = (productId, sourceCategory = 'allProducts') => {
        navigate(`/product/${productId}`, { state: { sourceCategory } });
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of page header with smooth animation
        setTimeout(() => {
            const pageHeader = document.querySelector('.page-header');
            if (pageHeader) {
                pageHeader.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }, 100); // Small delay to ensure state update completes
    };

    // Submenu functions
    const toggleSubmenu = (category) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="all-products-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <div className="container">
                    <span className="breadcrumb-link" onClick={() => navigate('/')}>Trang chủ</span>
                    <span>/</span>
                    <span className="breadcrumb-link" onClick={() => navigate('/')}>Danh mục</span>
                    <span>/</span>
                    <span className="breadcrumb-current">Tất cả sản phẩm</span>
                </div>
            </div>

            <div className="container">
                <div className="page-content">
                    {/* Left Sidebar */}
                    <div className="sidebar">
                        {/* Product Categories */}
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">DANH MỤC SẢN PHẨM</h3>
                            <div className="category-list">
                                <div className="category-item" onClick={() => navigate('/')}>
                                    <span className="category-arrow">→</span>
                                    <span>TRANG CHỦ</span>
                                </div>
                                <div className="category-item">
                                    <span className="category-arrow">→</span>
                                    <span>HÈ ĐỌC - HÈ KHÁC BIỆT</span>
                                </div>
                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('mam-non')}>
                                    <span className="category-arrow">→</span>
                                    <span>SÁCH MẦM NON</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('mam-non') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Bé Vào Lớp 1</div>
                                    <div className="submenu-item">Từ Điển Tranh</div>
                                    <div className="submenu-item">Thủ Công - Tập Tô</div>
                                    <div className="submenu-item">Phát Triển Trí Tuệ</div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('thieu-nhi')}>
                                    <span className="category-arrow">→</span>
                                    <span>SÁCH THIẾU NHI</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('thieu-nhi') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Truyện Cổ Tích</div>
                                    <div className="submenu-item">Sách Học Tập</div>
                                    <div className="submenu-item">Sách Kỹ Năng Sống</div>
                                    <div className="submenu-item">Sách Khám Phá</div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('ki-nang')}>
                                    <span className="category-arrow">→</span>
                                    <span>SÁCH KĨ NĂNG</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('ki-nang') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Kỹ Năng Giao Tiếp</div>
                                    <div className="submenu-item">Kỹ Năng Lãnh Đạo</div>
                                    <div className="submenu-item">Kỹ Năng Quản Lý</div>
                                    <div className="submenu-item">Kỹ Năng Mềm</div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('kinh-doanh')}>
                                    <span className="category-arrow">→</span>
                                    <span>SÁCH KINH DOANH</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('kinh-doanh') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Khởi Nghiệp</div>
                                    <div className="submenu-item">Marketing</div>
                                    <div className="submenu-item">Quản Trị</div>
                                    <div className="submenu-item">Tài Chính</div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('me-va-be')}>
                                    <span className="category-arrow">→</span>
                                    <span>SÁCH MẸ VÀ BÉ</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('me-va-be') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Chăm Sóc Trẻ</div>
                                    <div className="submenu-item">Dinh Dưỡng</div>
                                    <div className="submenu-item">Giáo Dục Sớm</div>
                                    <div className="submenu-item">Sức Khỏe</div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('van-hoc')}>
                                    <span className="category-arrow">→</span>
                                    <span>SÁCH VĂN HỌC</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('van-hoc') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Tiểu Thuyết</div>
                                    <div className="submenu-item">Truyện Ngắn</div>
                                    <div className="submenu-item">Thơ Ca</div>
                                    <div className="submenu-item">Tác Phẩm Kinh Điển</div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('tham-khao')}>
                                    <span className="category-arrow">→</span>
                                    <span>SÁCH THAM KHẢO</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('tham-khao') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Toán Học</div>
                                    <div className="submenu-item">Văn Học</div>
                                    <div className="submenu-item">Lịch Sử</div>
                                    <div className="submenu-item">Địa Lý</div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('do-choi')}>
                                    <span className="category-arrow">→</span>
                                    <span>ĐỒ CHƠI TRẺ EM - VPP</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('do-choi') ? 'expanded' : ''}`}>
                                    <div className="submenu-item">Đồ Chơi Giáo Dục</div>
                                    <div className="submenu-item">Bút Viết</div>
                                    <div className="submenu-item">Sách Vở</div>
                                    <div className="submenu-item">Dụng Cụ Học Tập</div>
                                </div>
                            </div>
                        </div>

                        {/* Product Filter */}
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">LỌC SẢN PHẨM</h3>

                            {/* Publisher Filter */}
                            <div className="filter-group">
                                <h4 className="filter-subtitle">NHÀ XUẤT BẢN</h4>
                                <div className="checkbox-list">
                                    {publishers.map(publisher => (
                                        <label key={publisher} className="checkbox-item">
                                            <Checkbox
                                                checked={selectedPublishers.includes(publisher)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPublishers(prev => [...prev, publisher]);
                                                    } else {
                                                        setSelectedPublishers(prev => prev.filter(p => p !== publisher));
                                                    }
                                                }}
                                            />
                                            <span>{publisher}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="filter-group">
                                <h4 className="filter-subtitle">GIÁ</h4>
                                <Radio.Group
                                    value={selectedPriceRange}
                                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                                >
                                    <div className="radio-list">
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
                            <h1 className="page-title">TẤT CẢ SẢN PHẨM</h1>

                            {/* Search and Sort Controls */}
                            <div className="controls">
                                <div className="search-control">
                                    <Input
                                        placeholder="Tìm kiếm sản phẩm..."
                                        prefix={<SearchOutlined />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>

                                <div className="sort-controls">
                                    <Select
                                        value={sortBy}
                                        onChange={setSortBy}
                                        className="sort-select"
                                    >
                                        <Option value="new">Mới / Nổi bật</Option>
                                        <Option value="bestselling">Bán chạy nhất</Option>
                                        <Option value="discount">Giảm giá nhiều</Option>
                                        <Option value="price-high">Giá cao</Option>
                                        <Option value="price-low">Giá thấp</Option>
                                    </Select>

                                    <div className="view-mode">
                                        <Button
                                            type={viewMode === 'grid' ? 'primary' : 'default'}
                                            icon={<SearchOutlined />}
                                            onClick={() => setViewMode('grid')}
                                            className="view-btn"
                                        />
                                        <Button
                                            type={viewMode === 'list' ? 'primary' : 'default'}
                                            icon={<SearchOutlined />}
                                            onClick={() => setViewMode('list')}
                                            className="view-btn"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid - Using HomePage style layout */}
                        <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                            {currentBooks.length > 0 ? (
                                currentBooks.map((book) => (
                                    <div key={book.id} className="book-card" onClick={() => handleProductClick(book.id, 'allProducts')}>
                                        <div className="book-image">
                                            <img src={book.image} alt={book.title} />
                                            <div className="book-hover-overlay">
                                                <div className="hover-icons">
                                                    <button className="hover-icon" onClick={(e) => { e.stopPropagation(); handleZoomClick(book); }}>
                                                        <ZoomInOutlined />
                                                    </button>
                                                    <button className="hover-icon" onClick={(e) => { e.stopPropagation(); handleProductClick(book.id, 'allProducts'); }}>
                                                        <EyeOutlined />
                                                    </button>
                                                    <button className="hover-icon" onClick={(e) => { e.stopPropagation(); handleAddToCartFromHover(book); }}>
                                                        <ShoppingCartOutlined />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-info">
                                            <h3 className="book-title">{book.title}</h3>
                                            <p className="book-author">{book.author}</p>
                                            <div className="book-price">{formatPrice(book.price)}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                                    <h3>Không tìm thấy sản phẩm nào</h3>
                                    <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                {/* Previous button */}
                                {currentPage > 1 && (
                                    <Button
                                        className="page-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        Trước
                                    </Button>
                                )}

                                {/* Page numbers */}
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;

                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <Button
                                                key={pageNumber}
                                                className={`page-btn ${pageNumber === currentPage ? 'active' : ''}`}
                                                onClick={() => handlePageChange(pageNumber)}
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    }

                                    // Show dots for gaps
                                    if (
                                        pageNumber === currentPage - 2 ||
                                        pageNumber === currentPage + 2
                                    ) {
                                        return <span key={pageNumber} className="page-dots">...</span>;
                                    }

                                    return null;
                                })}

                                {/* Next button */}
                                {currentPage < totalPages && (
                                    <Button
                                        className="page-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Sau
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Show total items info */}
                        <div className="pagination-info">
                            <p>
                                Hiển thị {startIndex + 1}-{Math.min(endIndex, sortedBooks.length)}
                                trong tổng số {sortedBooks.length} sản phẩm
                            </p>
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
                                        hoặc <button className="view-details-btn" onClick={() => {
                                            closeModal();
                                            handleProductClick(selectedProduct.id, selectedProduct.sourceCategory);
                                        }}>Xem chi tiết</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Shopping Cart Modal */}
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
    );
};

export default AllProductsPage;
