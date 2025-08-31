import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Radio } from 'antd';
import { AppstoreOutlined, BarsOutlined, EyeOutlined, ShoppingCartOutlined, ZoomInOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { newBooks, topSellingBooks, lifeSkillsBooks, childrenBooks, businessBooks, literatureBooks, summerBooks, thieuNhiBooks, parentingBooks, referenceBooks, toysBooks, beVaoLop1Books, tuDienTranhBooks, thuCongTapToBooks, phatTrienTriTueBooks, truyenCoTichBooks, sachHocTapBooks, sachKyNangSongBooks, sachKhamPhaBooks, kyNangGiaoTiepBooks, kyNangLanhDaoBooks, kyNangQuanLyBooks, kyNangMemBooks, khoiNghiepBooks, marketingBooks, quanTriBooks, taiChinhBooks, chamSocTreBooks, dinhDuongBooks, giaoDucSomBooks, sucKhoeBooks, tieuThuyetBooks, truyenNganBooks, thoCaBooks, tacPhamKinhDienBooks, toanHocBooks, vanHocBooks, lichSuBooks, diaLyBooks, doChoiGiaoDucBooks, butVietBooks, sachVoBooks, dungCuHocTapBooks } from '../data/books';

import '../styles/AllProductsPage.css';

const AllProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
    const [selectedPublisher, setSelectedPublisher] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default'); // Changed from 'new' to 'default'
    const [selectedCategory, setSelectedCategory] = useState(''); // Add selectedCategory state
    const [viewMode, setViewMode] = useState(() => {
        try {
            const saved = localStorage.getItem('allProductsViewMode');
            return saved === 'list' || saved === 'grid' ? saved : 'grid';
        } catch (e) {
            return 'grid';
        }
    }); // 'grid' or 'list'

    // Submenu states
    const [expandedCategories, setExpandedCategories] = useState([]);

    // Get unique publishers (mock data for now)
    const publishers = ['Minh Long tổng hợp', 'Thanh niên', 'Văn hóa thông tin', 'Hồng Bàng', 'Mỹ Thuật', 'Đại học Sư Phạm', 'NXB Phụ nữ Việt Nam', 'ĐHQG Hà Nội', 'NXB Văn Học', 'Đại học Sư phạm'];

    // Get all books from all categories with category tags and fallbacks
    const datedNow = Date.now();
    const tagBooks = (arr, category) =>
        (arr || []).map((b, idx) => ({
            ...b,
            category, // 'new' | 'bestselling' | 'lifeSkills' | ...
            // Provide fallbacks so sorts and filters work with mock data
            releaseDate: b.releaseDate || new Date(datedNow - (idx + 1) * 86400000).toISOString(),
            discount: typeof b.discount === 'number' ? b.discount : (b.id ? (b.id % 35) : (idx % 35)),
            publisher: b.publisher || publishers[(b.id ? b.id : idx) % publishers.length]
        }));

    const allBooks = [
        ...tagBooks(newBooks, 'new'),
        ...tagBooks(topSellingBooks, 'bestselling'),
        ...tagBooks(summerBooks, 'summer'),

        // Include parent category datasets so tab "Tất cả" truly shows everything
        ...tagBooks(childrenBooks, 'children'),
        ...tagBooks(businessBooks, 'business'),
        ...tagBooks(literatureBooks, 'literature'),
        ...tagBooks(thieuNhiBooks, 'thieu-nhi'),
        ...tagBooks(parentingBooks, 'parenting'),
        ...tagBooks(referenceBooks, 'reference'),
        ...tagBooks(toysBooks, 'toys'),
        ...tagBooks(lifeSkillsBooks, 'lifeSkills'),

        // Subcategory books - aggregated by parent filters
        ...tagBooks(beVaoLop1Books, 'be-vao-lop-1'),
        ...tagBooks(tuDienTranhBooks, 'tu-dien-tranh'),
        ...tagBooks(thuCongTapToBooks, 'thu-cong-tap-to'),
        ...tagBooks(phatTrienTriTueBooks, 'phat-trien-tri-tue'),
        ...tagBooks(truyenCoTichBooks, 'truyen-co-tich'),
        ...tagBooks(sachHocTapBooks, 'sach-hoc-tap'),
        ...tagBooks(sachKyNangSongBooks, 'sach-ky-nang-song'),
        ...tagBooks(sachKhamPhaBooks, 'sach-kham-pha'),
        ...tagBooks(kyNangGiaoTiepBooks, 'ky-nang-giao-tiep'),
        ...tagBooks(kyNangLanhDaoBooks, 'ky-nang-lanh-dao'),
        ...tagBooks(kyNangQuanLyBooks, 'ky-nang-quan-ly'),
        ...tagBooks(kyNangMemBooks, 'ky-nang-mem'),
        ...tagBooks(khoiNghiepBooks, 'khoi-nghiep'),
        ...tagBooks(marketingBooks, 'marketing'),
        ...tagBooks(quanTriBooks, 'quan-tri'),
        ...tagBooks(taiChinhBooks, 'tai-chinh'),
        ...tagBooks(chamSocTreBooks, 'cham-soc-tre'),
        ...tagBooks(dinhDuongBooks, 'dinh-duong'),
        ...tagBooks(giaoDucSomBooks, 'giao-duc-som'),
        ...tagBooks(sucKhoeBooks, 'suc-khoe'),
        ...tagBooks(tieuThuyetBooks, 'tieu-thuyet'),
        ...tagBooks(truyenNganBooks, 'truyen-ngan'),
        ...tagBooks(thoCaBooks, 'tho-ca'),
        ...tagBooks(tacPhamKinhDienBooks, 'tac-pham-kinh-dien'),
        ...tagBooks(toanHocBooks, 'toan-hoc'),
        ...tagBooks(vanHocBooks, 'van-hoc'),
        ...tagBooks(lichSuBooks, 'lich-su'),
        ...tagBooks(diaLyBooks, 'dia-ly'),
        ...tagBooks(doChoiGiaoDucBooks, 'do-choi-giao-duc'),
        ...tagBooks(butVietBooks, 'but-viet'),
        ...tagBooks(sachVoBooks, 'sach-vo'),
        ...tagBooks(dungCuHocTapBooks, 'dung-cu-hoc-tap')
    ];

    // Prefer data from Admin saved in localStorage for realtime sync
    const readAdminBooks = () => {
        try {
            const raw = localStorage.getItem('saleProducts');
            if (!raw) return [];
            const arr = JSON.parse(raw) || [];

            // Debug: Log dữ liệu gốc từ localStorage
            if (arr.length > 0) {
                console.log('🔄 AllProductsPage: Raw data from localStorage:', {
                    firstProduct: {
                        id: arr[0].id,
                        title: arr[0].title,
                        images: arr[0].images,
                        image: arr[0].image
                    }
                });
            }

            return (arr || []).map((p, idx) => ({
                id: p.id,
                title: p.title || p.productName || `Sản phẩm ${p.id || idx}`,
                author: Array.isArray(p.author) ? p.author.join(', ') : (p.author || (Array.isArray(p.author_name) ? p.author_name.join(', ') : p.author_name) || ''),
                price: Number(p.price) || 0,
                // SỬA LOGIC XỬ LÝ HÌNH ẢNH - Ưu tiên images array từ admin
                image: (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : (p.image || ''),
                category: (p.category || '').toString(),
                releaseDate: p.releaseDate || new Date(datedNow - (idx + 1) * 86400000).toISOString(),
                discount: typeof p.discount === 'number' ? p.discount : ((p.id || idx) % 35),
                publisher: p.publisher || p.publisherName || publishers[(p.id ? p.id : idx) % publishers.length]
            }));
        } catch (e) { return []; }
    };

    const [adminBooks, setAdminBooks] = useState(readAdminBooks());

    // Listen for changes from Admin (storage or custom event)
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'saleProducts') {
                console.log('🔄 AllProductsPage: Storage event detected, updating admin books');
                setAdminBooks(readAdminBooks());
            }
        };
        const onCustom = () => {
            console.log('🔄 AllProductsPage: Custom event detected, updating admin books');
            setAdminBooks(readAdminBooks());
        };

        // Thêm cơ chế backup: kiểm tra localStorage mỗi 2 giây
        const intervalCheck = setInterval(() => {
            const currentData = localStorage.getItem('saleProducts');
            if (currentData) {
                try {
                    const parsed = JSON.parse(currentData);
                    // So sánh với adminBooks hiện tại để phát hiện thay đổi
                    if (JSON.stringify(parsed) !== JSON.stringify(adminBooks)) {
                        console.log('🔄 AllProductsPage: Interval check detected changes, updating admin books');
                        setAdminBooks(readAdminBooks());
                    }
                } catch (e) {
                    console.error('Error parsing localStorage data:', e);
                }
            }
        }, 2000);

        window.addEventListener('storage', onStorage);
        window.addEventListener('saleProductsUpdated', onCustom);

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('saleProductsUpdated', onCustom);
            clearInterval(intervalCheck);
        };
    }, [adminBooks]);

    const sourceBooks = (adminBooks && adminBooks.length > 0) ? adminBooks : allBooks;

    // Debug: Log dữ liệu hình ảnh để kiểm tra
    useEffect(() => {
        if (adminBooks && adminBooks.length > 0) {
            console.log('🔄 AllProductsPage: Admin books loaded:', adminBooks.length, 'products');
            // Log sản phẩm đầu tiên để kiểm tra hình ảnh
            if (adminBooks[0]) {
                console.log('🔄 AllProductsPage: First product image data:', {
                    id: adminBooks[0].id,
                    title: adminBooks[0].title,
                    image: adminBooks[0].image,
                    hasImage: !!adminBooks[0].image
                });
            }
        }
    }, [adminBooks]);

    // Filter and sort books
    const filteredBooks = sourceBooks.filter(book => {
        const matchesPublisher = selectedPublisher === '' || book.publisher === selectedPublisher;
        const matchesPrice = selectedPriceRange === '' || checkPriceRange(book.price, selectedPriceRange);
        const matchesSearch = searchQuery === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter - handle both parent and subcategories
        let matchesCategory = true;
        if (selectedCategory !== '') {
            switch (selectedCategory) {
                // Parent categories - show all subcategory products (aggregated)
                case 'children': // SÁCH MẦM NON
                    matchesCategory = ['be-vao-lop-1', 'tu-dien-tranh', 'thu-cong-tap-to', 'phat-trien-tri-tue'].includes(book.category);
                    break;
                case 'thieu-nhi': // SÁCH THIẾU NHI
                    matchesCategory = ['truyen-co-tich', 'sach-hoc-tap', 'sach-ky-nang-song', 'sach-kham-pha'].includes(book.category);
                    break;
                case 'lifeSkills': // SÁCH KĨ NĂNG
                    matchesCategory = ['ky-nang-giao-tiep', 'ky-nang-lanh-dao', 'ky-nang-quan-ly', 'ky-nang-mem'].includes(book.category);
                    break;
                case 'business': // SÁCH KINH DOANH
                    matchesCategory = ['khoi-nghiep', 'marketing', 'quan-tri', 'tai-chinh'].includes(book.category);
                    break;
                case 'parenting': // SÁCH MẸ VÀ BÉ
                    matchesCategory = ['cham-soc-tre', 'dinh-duong', 'giao-duc-som', 'suc-khoe'].includes(book.category);
                    break;
                case 'literature': // SÁCH VĂN HỌC
                    matchesCategory = ['tieu-thuyet', 'truyen-ngan', 'tho-ca', 'tac-pham-kinh-dien'].includes(book.category);
                    break;
                case 'reference': // SÁCH THAM KHẢO
                    matchesCategory = ['toan-hoc', 'van-hoc', 'lich-su', 'dia-ly'].includes(book.category);
                    break;
                case 'toys': // ĐỒ CHƠI TRẺ EM - VPP
                    matchesCategory = ['do-choi-giao-duc', 'but-viet', 'sach-vo', 'dung-cu-hoc-tap'].includes(book.category);
                    break;
                default:
                    // Subcategories - exact match
                    matchesCategory = book.category === selectedCategory;
            }
        }

        // Top tabs filter - only apply when no specific category is selected
        const matchesTab = selectedCategory === '' ? (
            (sortBy === 'new' && book.category === 'new') ||
            (sortBy === 'bestselling' && book.category === 'bestselling') ||
            (sortBy !== 'new' && sortBy !== 'bestselling')
        ) : true; // If category is selected, ignore tab filter

        return matchesPublisher && matchesPrice && matchesSearch && matchesCategory && matchesTab;
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

    // Reset to first page when filters change and scroll to products
    useEffect(() => {
        setCurrentPage(1);
        setTimeout(() => {
            const pageHeader = document.querySelector('.page-header');
            if (pageHeader) {
                pageHeader.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        }, 80);
    }, [selectedPublisher, selectedPriceRange, searchQuery, sortBy, selectedCategory]); // Add selectedCategory

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

    // Handle URL query parameters for category and sortBy
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryFromUrl = searchParams.get('category');
        const sortByFromUrl = searchParams.get('sortBy');

        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
            // Reset to first page when category changes
            setCurrentPage(1);
            // Reset sortBy to default when selecting a category to avoid filter conflicts
            setSortBy('default');

            // Auto-expand submenu based on category
            if (['be-vao-lop-1', 'tu-dien-tranh', 'thu-cong-tap-to', 'phat-trien-tri-tue'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('mam-non') ? prev : [...prev, 'mam-non']);
            } else if (['truyen-co-tich', 'sach-hoc-tap', 'sach-ky-nang-song', 'sach-kham-pha'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('thieu-nhi') ? prev : [...prev, 'thieu-nhi']);
            } else if (['ky-nang-giao-tiep', 'ky-nang-lanh-dao', 'ky-nang-quan-ly', 'ky-nang-mem'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('ki-nang') ? prev : [...prev, 'ki-nang']);
            } else if (['khoi-nghiep', 'marketing', 'quan-tri', 'tai-chinh'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('kinh-doanh') ? prev : [...prev, 'kinh-doanh']);
            } else if (['cham-soc-tre', 'dinh-duong', 'giao-duc-som', 'suc-khoe'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('me-va-be') ? prev : [...prev, 'me-va-be']);
            } else if (['tieu-thuyet', 'truyen-ngan', 'tho-ca', 'tac-pham-kinh-dien'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('van-hoc') ? prev : [...prev, 'van-hoc']);
            } else if (['toan-hoc', 'van-hoc', 'lich-su', 'dia-ly'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('tham-khao') ? prev : [...prev, 'tham-khao']);
            } else if (['do-choi-giao-duc', 'but-viet', 'sach-vo', 'dung-cu-hoc-tap'].includes(categoryFromUrl)) {
                setExpandedCategories(prev => prev.includes('do-choi') ? prev : [...prev, 'do-choi']);
            }
        }

        // Handle sortBy parameter from URL
        if (sortByFromUrl) {
            setSortBy(sortByFromUrl);
            setCurrentPage(1);
            // Clear category selection when using sortBy to avoid conflicts
            setSelectedCategory('');
        }
    }, [location.search]);

    // Persist view mode across reloads
    useEffect(() => {
        try {
            localStorage.setItem('allProductsViewMode', viewMode);
        } catch (e) { }
    }, [viewMode]);

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
        // Lấy ảnh đại diện (ảnh đầu tiên) từ images array
        const normalizedImage = (product && Array.isArray(product.images) && product.images.length > 0)
            ? product.images[0]
            : product?.image;

        // Đảm bảo product có đầy đủ thông tin hình ảnh
        const productWithImages = {
            ...product,
            image: normalizedImage,
            // Đảm bảo images array tồn tại
            images: product.images && Array.isArray(product.images) && product.images.length > 0
                ? product.images
                : [normalizedImage],
            sourceCategory: 'allProducts'
        };

        setSelectedProduct(productWithImages);
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
            const allImages = selectedProduct.images && Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
                ? selectedProduct.images
                : [selectedProduct.image];

            if (allImages[index]) {
                setSelectedProduct(prev => ({
                    ...prev,
                    image: allImages[index]
                }));
            }
        }
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
                const normalizedImage = (selectedProduct && Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0)
                    ? selectedProduct.images[0]
                    : selectedProduct?.image;
                const productInfo = { ...selectedProduct, image: normalizedImage, sourceCategory: selectedProduct.sourceCategory || 'allProducts', quantity: quantity };
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
            const normalizedImage = (product && Array.isArray(product.images) && product.images.length > 0)
                ? product.images[0]
                : product?.image;
            setCartItems(prev => [...prev, { ...product, image: normalizedImage, sourceCategory: 'allProducts', quantity: 1 }]);
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

    // Fallback description for list view
    const getBookDescription = (book) => {
        if (book.description && typeof book.description === 'string') return book.description;
        return `${book.title} là một cuốn sách hay và bổ ích của ${book.author}. Nội dung được trình bày rõ ràng, phù hợp nhiều đối tượng độc giả.`;
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

    // Helper for filters to scroll into view
    const scrollToProductsTop = () => {
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    };

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page

        // Reset sortBy to default when selecting a category to avoid filter conflicts
        if (category !== '') {
            setSortBy('default');
        }
    };

    // Handle tab selection
    const handleTabClick = (tab) => {
        setSortBy(tab);
        setCurrentPage(1); // Reset to first page

        // Reset category when selecting "Tất cả" tab
        if (tab === 'default') {
            setSelectedCategory('');
        }
    };

    // Helper to get display name for category
    const getCategoryDisplayName = (category) => {
        switch (category) {
            case 'summer':
                return 'HÈ ĐỌC - HÈ KHÁC BIỆT';
            case 'children':
                return 'SÁCH MẦM NON';
            case 'thieu-nhi':
                return 'SÁCH THIẾU NHI';
            case 'lifeSkills':
                return 'SÁCH KĨ NĂNG';
            case 'business':
                return 'SÁCH KINH DOANH';
            case 'parenting':
                return 'SÁCH MẸ VÀ BÉ';
            case 'literature':
                return 'SÁCH VĂN HỌC';
            case 'reference':
                return 'SÁCH THAM KHẢO';
            case 'toys':
                return 'ĐỒ CHƠI TRẺ EM - VPP';

            // SÁCH MẦM NON subcategories
            case 'be-vao-lop-1':
                return 'Bé Vào Lớp 1';
            case 'tu-dien-tranh':
                return 'Từ Điển Tranh';
            case 'thu-cong-tap-to':
                return 'Thủ Công - Tập Tô';
            case 'phat-trien-tri-tue':
                return 'Phát Triển Trí Tuệ';

            // SÁCH THIẾU NHI subcategories
            case 'truyen-co-tich':
                return 'Truyện Cổ Tích';
            case 'sach-hoc-tap':
                return 'Sách Học Tập';
            case 'sach-ky-nang-song':
                return 'Sách Kỹ Năng Sống';
            case 'sach-kham-pha':
                return 'Sách Khám Phá';

            // SÁCH KĨ NĂNG subcategories
            case 'ky-nang-giao-tiep':
                return 'Kỹ Năng Giao Tiếp';
            case 'ky-nang-lanh-dao':
                return 'Kỹ Năng Lãnh Đạo';
            case 'ky-nang-quan-ly':
                return 'Kỹ Năng Quản Lý';
            case 'ky-nang-mem':
                return 'Kỹ Năng Mềm';

            // SÁCH KINH DOANH subcategories
            case 'khoi-nghiep':
                return 'Khởi Nghiệp';
            case 'marketing':
                return 'Marketing';
            case 'quan-tri':
                return 'Quản Trị';
            case 'tai-chinh':
                return 'Tài Chính';

            // SÁCH MẸ VÀ BÉ subcategories
            case 'cham-soc-tre':
                return 'Chăm Sóc Trẻ';
            case 'dinh-duong':
                return 'Dinh Dưỡng';
            case 'giao-duc-som':
                return 'Giáo Dục Sớm';
            case 'suc-khoe':
                return 'Sức Khỏe';

            // SÁCH VĂN HỌC subcategories
            case 'tieu-thuyet':
                return 'Tiểu Thuyết';
            case 'truyen-ngan':
                return 'Truyện Ngắn';
            case 'tho-ca':
                return 'Thơ Ca';
            case 'tac-pham-kinh-dien':
                return 'Tác Phẩm Kinh Điển';

            // SÁCH THAM KHẢO subcategories
            case 'toan-hoc':
                return 'Toán Học';
            case 'van-hoc':
                return 'Văn Học';
            case 'lich-su':
                return 'Lịch Sử';
            case 'dia-ly':
                return 'Địa Lý';

            // ĐỒ CHƠI TRẺ EM - VPP subcategories
            case 'do-choi-giao-duc':
                return 'Đồ Chơi Giáo Dục';
            case 'but-viet':
                return 'Bút Viết';
            case 'sach-vo':
                return 'Sách Vở';
            case 'dung-cu-hoc-tap':
                return 'Dụng Cụ Học Tập';

            default:
                return 'Tất cả sản phẩm';
        }
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
                    <span className="breadcrumb-link" onClick={() => navigate('/allProduct')}>Danh mục</span>
                    <span>/</span>
                    <span className="breadcrumb-current">{getCategoryDisplayName(selectedCategory) || 'Tất cả sản phẩm'}</span>
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
                                <div className="category-item" onClick={() => handleCategorySelect('summer')}>
                                    <span className="category-arrow">→</span>
                                    <span>HÈ ĐỌC - HÈ KHÁC BIỆT</span>
                                </div>
                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('mam-non')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('children')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'children' ? 'selected' : ''}
                                    >
                                        SÁCH MẦM NON
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('mam-non')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('mam-non') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'be-vao-lop-1' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('be-vao-lop-1')}
                                    >
                                        Bé Vào Lớp 1
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'tu-dien-tranh' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('tu-dien-tranh')}
                                    >
                                        Từ Điển Tranh
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'thu-cong-tap-to' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('thu-cong-tap-to')}
                                    >
                                        Thủ Công - Tập Tô
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'phat-trien-tri-tue' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('phat-trien-tri-tue')}
                                    >
                                        Phát Triển Trí Tuệ
                                    </div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('thieu-nhi')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('thieu-nhi')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'thieu-nhi' ? 'selected' : ''}
                                    >
                                        SÁCH THIẾU NHI
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('thieu-nhi')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('thieu-nhi') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'truyen-co-tich' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('truyen-co-tich')}
                                    >
                                        Truyện Cổ Tích
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'sach-hoc-tap' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('sach-hoc-tap')}
                                    >
                                        Sách Học Tập
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'sach-ky-nang-song' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('sach-ky-nang-song')}
                                    >
                                        Sách Kỹ Năng Sống
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'sach-kham-pha' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('sach-kham-pha')}
                                    >
                                        Sách Khám Phá
                                    </div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('ki-nang')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('lifeSkills')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'lifeSkills' ? 'selected' : ''}
                                    >
                                        SÁCH KĨ NĂNG
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('ki-nang')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('ki-nang') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'ky-nang-giao-tiep' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('ky-nang-giao-tiep')}
                                    >
                                        Kỹ Năng Giao Tiếp
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'ky-nang-lanh-dao' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('ky-nang-lanh-dao')}
                                    >
                                        Kỹ Năng Lãnh Đạo
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'ky-nang-quan-ly' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('ky-nang-quan-ly')}
                                    >
                                        Kỹ Năng Quản Lý
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'ky-nang-mem' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('ky-nang-mem')}
                                    >
                                        Kỹ Năng Mềm
                                    </div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('kinh-doanh')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('business')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'business' ? 'selected' : ''}
                                    >
                                        SÁCH KINH DOANH
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('kinh-doanh')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('kinh-doanh') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'khoi-nghiep' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('khoi-nghiep')}
                                    >
                                        Khởi Nghiệp
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'marketing' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('marketing')}
                                    >
                                        Marketing
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'quan-tri' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('quan-tri')}
                                    >
                                        Quản Trị
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'tai-chinh' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('tai-chinh')}
                                    >
                                        Tài Chính
                                    </div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('me-va-be')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('parenting')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'parenting' ? 'selected' : ''}
                                    >
                                        SÁCH MẸ VÀ BÉ
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('me-va-be')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('me-va-be') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'cham-soc-tre' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('cham-soc-tre')}
                                    >
                                        Chăm Sóc Trẻ
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'dinh-duong' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('dinh-duong')}
                                    >
                                        Dinh Dưỡng
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'giao-duc-som' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('giao-duc-som')}
                                    >
                                        Giáo Dục Sớm
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'suc-khoe' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('suc-khoe')}
                                    >
                                        Sức Khỏe
                                    </div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('van-hoc')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('literature')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'literature' ? 'selected' : ''}
                                    >
                                        SÁCH VĂN HỌC
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('van-hoc')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('van-hoc') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'tieu-thuyet' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('tieu-thuyet')}
                                    >
                                        Tiểu Thuyết
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'truyen-ngan' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('truyen-ngan')}
                                    >
                                        Truyện Ngắn
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'tho-ca' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('tho-ca')}
                                    >
                                        Thơ Ca
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'tac-pham-kinh-dien' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('tac-pham-kinh-dien')}
                                    >
                                        Tác Phẩm Kinh Điển
                                    </div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('tham-khao')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('reference')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'reference' ? 'selected' : ''}
                                    >
                                        SÁCH THAM KHẢO
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('tham-khao')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('tham-khao') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'toan-hoc' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('toan-hoc')}
                                    >
                                        Toán Học
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'van-hoc' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('van-hoc')}
                                    >
                                        Văn Học
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'lich-su' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('lich-su')}
                                    >
                                        Lịch Sử
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'dia-ly' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('dia-ly')}
                                    >
                                        Địa Lý
                                    </div>
                                </div>

                                <div className="category-item has-submenu" onClick={() => toggleSubmenu('do-choi')}>
                                    <span className="category-arrow">→</span>
                                    <span
                                        onClick={() => handleCategorySelect('toys')}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedCategory === 'toys' ? 'selected' : ''}
                                    >
                                        ĐỒ CHƠI TRẺ EM - VPP
                                    </span>
                                    <span className="expand-icon" onClick={() => toggleSubmenu('do-choi')} style={{ cursor: 'pointer', marginLeft: 'auto' }}>▼</span>
                                </div>
                                <div className={`submenu ${expandedCategories.includes('do-choi') ? 'expanded' : ''}`}>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'do-choi-giao-duc' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('do-choi-giao-duc')}
                                    >
                                        Đồ Chơi Giáo Dục
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'but-viet' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('but-viet')}
                                    >
                                        Bút Viết
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'sach-vo' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('sach-vo')}
                                    >
                                        Sách Vở
                                    </div>
                                    <div
                                        className={`submenu-item ${selectedCategory === 'dung-cu-hoc-tap' ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect('dung-cu-hoc-tap')}
                                    >
                                        Dụng Cụ Học Tập
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Filter */}
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">LỌC SẢN PHẨM</h3>

                            {/* Publisher Filter */}
                            <div className="filter-group">
                                <h4 className="filter-subtitle">NHÀ XUẤT BẢN</h4>
                                <Radio.Group value={selectedPublisher} onChange={(e) => setSelectedPublisher(e.target.value)}>
                                    <div className="radio-list">
                                        <label className="radio-item">
                                            <Radio value="" />
                                            <span>Tất cả</span>
                                        </label>
                                        {publishers.map(publisher => (
                                            <label key={publisher} className="radio-item">
                                                <Radio value={publisher} />
                                                <span>{publisher}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Radio.Group>
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
                            <h1 className="page-title">
                                {selectedCategory ? getCategoryDisplayName(selectedCategory) : 'TẤT CẢ SẢN PHẨM'}
                            </h1>

                            {/* Tabs + Actions (no in-page search) */}
                            <div className="controls">
                                <div className="page-tabs">
                                    <button className={`tab-btn ${sortBy === 'default' ? 'active' : ''}`} onClick={() => handleTabClick('default')}>Tất cả</button>
                                    <button className={`tab-btn ${sortBy === 'new' ? 'active' : ''}`} onClick={() => handleTabClick('new')}>Mới / Nổi bật</button>
                                    <button className={`tab-btn ${sortBy === 'bestselling' ? 'active' : ''}`} onClick={() => handleTabClick('bestselling')}>Bán chạy nhất</button>
                                    <button className={`tab-btn ${sortBy === 'discount' ? 'active' : ''}`} onClick={() => handleTabClick('discount')}>Giảm giá nhiều</button>
                                    <button className={`tab-btn ${sortBy === 'price-high' ? 'active' : ''}`} onClick={() => handleTabClick('price-high')}>Giá cao</button>
                                    <button className={`tab-btn ${sortBy === 'price-low' ? 'active' : ''}`} onClick={() => handleTabClick('price-low')}>Giá thấp</button>
                                </div>
                                <div className="header-actions">
                                    <div className="view-mode">
                                        <Button
                                            type={viewMode === 'grid' ? 'primary' : 'default'}
                                            icon={<AppstoreOutlined />}
                                            onClick={() => setViewMode('grid')}
                                            className="view-btn"
                                        />
                                        <Button
                                            type={viewMode === 'list' ? 'primary' : 'default'}
                                            icon={<BarsOutlined />}
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
                                    <div key={book.id} className={`book-card ${viewMode === 'list' ? 'list' : ''}`} onClick={() => handleProductClick(book.id, 'allProducts')}>
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
                                            {viewMode === 'list' ? (
                                                <div className="book-meta">
                                                    <div className="meta-row"><span className="meta-label">Mã sản phẩm:</span><span className="meta-value">{book.id}</span></div>
                                                    <div className="meta-row"><span className="meta-label">NXB:</span><span className="meta-value">NXB MINHLONG</span></div>
                                                    <div className="meta-row"><span className="meta-label">Tác giả:</span><span className="meta-value">{book.author}</span></div>
                                                    <div className="meta-row description"><span className="meta-label">Mô tả ngắn:</span><span className="meta-value">{getBookDescription(book)}</span></div>
                                                </div>
                                            ) : (
                                                <p className="book-author">Tác giả: {book.author}</p>
                                            )}
                                            <div className="book-price">
                                                {viewMode === 'list' ? (
                                                    <>
                                                        <span className="price-label">Giá:</span>
                                                        <span className="price-value">{formatPrice(book.price)}</span>
                                                    </>
                                                ) : (
                                                    formatPrice(book.price)
                                                )}
                                            </div>
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
                                {selectedCategory && ` thuộc danh mục "${getCategoryDisplayName(selectedCategory)}"`}
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
                                    {/* Hiển thị ảnh chính + 4 ảnh nhỏ từ sản phẩm */}
                                    {(() => {
                                        // Lấy tất cả ảnh từ sản phẩm
                                        const allImages = selectedProduct.images && Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
                                            ? selectedProduct.images
                                            : [selectedProduct.image];

                                        // Tạo array 5 ảnh (ảnh chính + 4 ảnh nhỏ)
                                        const displayImages = [];
                                        for (let i = 0; i < 5; i++) {
                                            if (i < allImages.length) {
                                                displayImages.push(allImages[i]);
                                            } else {
                                                // Nếu không đủ 5 ảnh, lặp lại ảnh cuối
                                                displayImages.push(allImages[allImages.length - 1] || selectedProduct.image);
                                            }
                                        }

                                        return displayImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className={`modal-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                                onClick={() => handleThumbnailClick(index)}
                                            >
                                                <img src={image} alt={`${selectedProduct.title} ${index + 1}`} />
                                            </div>
                                        ));
                                    })()}
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
