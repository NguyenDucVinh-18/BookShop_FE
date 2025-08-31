import React, { useState, useEffect, useMemo } from 'react';
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
    literatureBooks,
    summerBooks,
    thieuNhiBooks,
    parentingBooks,
    referenceBooks,
    toysBooks,
    beVaoLop1Books,
    tuDienTranhBooks,
    thuCongTapToBooks,
    phatTrienTriTueBooks,
    truyenCoTichBooks,
    sachHocTapBooks,
    sachKyNangSongBooks,
    sachKhamPhaBooks,
    kyNangGiaoTiepBooks,
    kyNangLanhDaoBooks,
    kyNangQuanLyBooks,
    kyNangMemBooks,
    khoiNghiepBooks,
    marketingBooks,
    quanTriBooks,
    taiChinhBooks,
    chamSocTreBooks,
    dinhDuongBooks,
    giaoDucSomBooks,
    sucKhoeBooks,
    tieuThuyetBooks,
    truyenNganBooks,
    thoCaBooks,
    tacPhamKinhDienBooks,
    toanHocBooks,
    vanHocBooks,
    lichSuBooks,
    diaLyBooks,
    doChoiGiaoDucBooks,
    butVietBooks,
    sachVoBooks,
    dungCuHocTapBooks
} from '../data/books';

const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [adminProducts, setAdminProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0); // Track selected thumbnail
    const [currentRelatedProductsSlide, setCurrentRelatedProductsSlide] = useState(0);

    // Load and subscribe to admin products for syncing UI pieces (e.g., related products)
    useEffect(() => {
        const readAdminProducts = () => {
            try {
                const raw = localStorage.getItem('saleProducts');
                const list = raw ? JSON.parse(raw) : [];
                setAdminProducts(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error('Error parsing saleProducts:', e);
            }
        };

        readAdminProducts();

        const onUpdate = () => readAdminProducts();
        window.addEventListener('saleProductsUpdated', onUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'saleProducts') onUpdate();
        });

        return () => {
            window.removeEventListener('saleProductsUpdated', onUpdate);
        };
    }, []);

    // Find the product based on ID - ƯU TIÊN Admin Panel data
    useEffect(() => {
        let foundProduct = null;

        // 1. ƯU TIÊN: Tìm trong Admin Panel trước (data mới nhất)
        try {
            const adminProducts = localStorage.getItem('saleProducts');
            if (adminProducts) {
                const parsed = JSON.parse(adminProducts);
                const adminProduct = parsed.find(p => p.id === parseInt(id));

                if (adminProduct) {
                    // Format dữ liệu từ Admin Panel để phù hợp với DetailPage
                    foundProduct = {
                        id: adminProduct.id,
                        title: adminProduct.title || adminProduct.productName,
                        author: Array.isArray(adminProduct.author) ? adminProduct.author.join(', ') : (adminProduct.author || ''),
                        price: Number(adminProduct.price) || 0,
                        image: (Array.isArray(adminProduct.images) && adminProduct.images.length > 0) ? adminProduct.images[0] : (adminProduct.image || ''),
                        images: adminProduct.images || [], // Thêm images array
                        category: adminProduct.category || '',
                        description: adminProduct.description || '',
                        publisherName: adminProduct.publisherName || 'NXB MINHLONG',
                        publicationYear: adminProduct.publicationYear || 2024,
                        pageCount: adminProduct.pageCount || 300,
                        isbn: adminProduct.isbn || '',
                        coverType: adminProduct.coverType || 'bìa mềm',
                        packageDimensions: adminProduct.packageDimensions || '15.5x15.5 cm',
                        weightGrams: adminProduct.weightGrams || 400,
                        stock: adminProduct.stock || 0
                    };
                }
            }
        } catch (error) {
            console.error('Error reading admin products:', error);
        }

        // 2. Nếu không tìm thấy trong Admin Panel → Tìm trong mock data
        if (!foundProduct) {
            const allBooks = [
                ...newBooks,
                ...topSellingBooks,
                ...lifeSkillsBooks,
                ...childrenBooks,
                ...businessBooks,
                ...literatureBooks,
                ...summerBooks,
                ...thieuNhiBooks,
                ...parentingBooks,
                ...referenceBooks,
                ...toysBooks,
                ...beVaoLop1Books,
                ...tuDienTranhBooks,
                ...thuCongTapToBooks,
                ...phatTrienTriTueBooks,
                ...truyenCoTichBooks,
                ...sachHocTapBooks,
                ...sachKyNangSongBooks,
                ...sachKhamPhaBooks,
                ...kyNangGiaoTiepBooks,
                ...kyNangLanhDaoBooks,
                ...kyNangQuanLyBooks,
                ...kyNangMemBooks,
                ...khoiNghiepBooks,
                ...marketingBooks,
                ...quanTriBooks,
                ...taiChinhBooks,
                ...chamSocTreBooks,
                ...dinhDuongBooks,
                ...giaoDucSomBooks,
                ...sucKhoeBooks,
                ...tieuThuyetBooks,
                ...truyenNganBooks,
                ...thoCaBooks,
                ...tacPhamKinhDienBooks,
                ...toanHocBooks,
                ...vanHocBooks,
                ...lichSuBooks,
                ...diaLyBooks,
                ...doChoiGiaoDucBooks,
                ...butVietBooks,
                ...sachVoBooks,
                ...dungCuHocTapBooks
            ];

            foundProduct = allBooks.find(book => book.id === parseInt(id));
        }

        // Debug log để kiểm tra
        if (foundProduct) {
            console.log('🔄 DetailPage: Product found:', {
                id: foundProduct.id,
                title: foundProduct.title,
                image: foundProduct.image,
                source: foundProduct.publisherName === 'NXB MINHLONG' ? 'Admin Panel' : 'Mock Data'
            });
        } else {
            console.log('❌ DetailPage: Product not found for ID:', id);
        }

        setProduct(foundProduct);

        // Auto scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [id]);

    // Lắng nghe thay đổi từ Admin Panel để cập nhật sản phẩm real-time
    useEffect(() => {
        const handleAdminUpdate = () => {
            try {
                const adminProducts = localStorage.getItem('saleProducts');
                if (adminProducts) {
                    const parsed = JSON.parse(adminProducts);
                    const adminProduct = parsed.find(p => p.id === parseInt(id));

                    if (adminProduct) {
                        // Format dữ liệu từ Admin Panel
                        const formattedProduct = {
                            id: adminProduct.id,
                            title: adminProduct.title || adminProduct.productName,
                            author: Array.isArray(adminProduct.author) ? adminProduct.author.join(', ') : (adminProduct.author || ''),
                            price: Number(adminProduct.price) || 0,
                            image: (Array.isArray(adminProduct.images) && adminProduct.images.length > 0) ? adminProduct.images[0] : (adminProduct.image || ''),
                            images: adminProduct.images || [], // Thêm images array
                            category: adminProduct.category || '',
                            description: adminProduct.description || '',
                            publisherName: adminProduct.publisherName || 'NXB MINHLONG',
                            publicationYear: adminProduct.publicationYear || 2024,
                            pageCount: adminProduct.pageCount || 300,
                            isbn: adminProduct.isbn || '',
                            coverType: adminProduct.coverType || 'bìa mềm',
                            packageDimensions: adminProduct.packageDimensions || '15.5x15.5 cm',
                            weightGrams: adminProduct.weightGrams || 400,
                            stock: adminProduct.stock || 0
                        };

                        setProduct(formattedProduct);
                    }
                }
            } catch (error) {
                console.error('Error updating product from admin:', error);
            }
        };

        // Lắng nghe custom event từ Admin Panel
        window.addEventListener('saleProductsUpdated', handleAdminUpdate);

        // Lắng nghe storage event (nếu có tab khác)
        window.addEventListener('storage', (e) => {
            if (e.key === 'saleProducts') {
                handleAdminUpdate();
            }
        });

        return () => {
            window.removeEventListener('saleProductsUpdated', handleAdminUpdate);
            window.removeEventListener('storage', handleAdminUpdate);
        };
    }, [id]);

    // Persist recently viewed products to localStorage
    useEffect(() => {
        if (!product) return;
        try {
            const raw = localStorage.getItem('recentlyViewed');
            const stored = raw ? JSON.parse(raw) : [];
            const list = Array.isArray(stored) ? stored : [];
            const filtered = list.filter((it) => it && it.id !== product.id);
            const entry = { id: product.id, title: product.title, price: product.price, image: product.image };
            const updated = [entry, ...filtered];
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        } catch (error) {
            console.error('Error saving to recently viewed:', error);
        }
    }, [product]);

    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Handle Add to Cart
    const handleAddToCart = () => {
        if (!product) return;

        try {
            // Get existing cart data from localStorage
            const savedCart = localStorage.getItem('shoppingCart');
            let cartData = savedCart ? JSON.parse(savedCart) : { items: [] };

            // Find existing item in cart
            const existingItemIndex = cartData.items.findIndex(item => item.id === product.id);

            if (existingItemIndex >= 0) {
                // Update quantity if item already exists
                cartData.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cartData.items.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }

            // Save updated cart data
            localStorage.setItem('shoppingCart', JSON.stringify(cartData));

            // Trigger custom event to update header cart count
            window.dispatchEvent(new Event('cartUpdated'));

            // Navigate directly to cart page (no alert for better UX)
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
        }
    };

    // Handle Buy Now
    const handleBuyNow = () => {
        if (!product) return;

        try {
            // First, add the item to the main cart (so it appears in cart)
            const savedCart = localStorage.getItem('shoppingCart');
            let cartData = savedCart ? JSON.parse(savedCart) : { items: [] };

            // Find existing item in cart
            const existingItemIndex = cartData.items.findIndex(item => item.id === product.id);

            if (existingItemIndex >= 0) {
                // Update quantity if item already exists
                cartData.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cartData.items.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }

            // Save updated cart data
            localStorage.setItem('shoppingCart', JSON.stringify(cartData));

            // Also store checkout items for direct purchase
            const checkoutItems = [{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            }];

            localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));

            // Trigger custom event to update header cart count
            window.dispatchEvent(new Event('cartUpdated'));

            // Navigate directly to checkout page
            navigate('/checkout');
        } catch (error) {
            console.error('Error processing buy now:', error);
            alert('Có lỗi xảy ra khi xử lý mua hàng!');
        }
    };

    // Handle thumbnail click
    const handleThumbnailClick = (index) => {
        setSelectedImage(index);

        // Cập nhật ảnh chính khi click vào thumbnail
        if (!product) return;

        // Tạo array 5 ảnh giống như trong render
        const currentImages = product.images && Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : [product.image];

        const displayImages = [];
        for (let i = 0; i < 5; i++) {
            if (i < currentImages.length) {
                displayImages.push(currentImages[i]);
            } else {
                // Nếu không đủ 5 ảnh, lặp lại ảnh cuối
                displayImages.push(currentImages[currentImages.length - 1] || product.image);
            }
        }

        if (displayImages[index]) {
            setProduct(prev => ({
                ...prev,
                image: displayImages[index]
            }));
        }
    };

    // Related Products Navigation will be defined after relatedBooks is computed

    // Sidebar "SẢN PHẨM BÁN CHẠY": random từ topSellingBooks mỗi khi đổi sản phẩm (id)
    // Map helper: override mock with admin by id, prefer images[0]
    const mapWithAdmin = React.useCallback((original) => {
        if (!Array.isArray(original) || adminProducts.length === 0) return original;
        return original.map((b) => {
            const ap = adminProducts.find((p) => p.id === b.id);
            if (!ap) return b;
            return {
                ...b,
                ...ap,
                title: ap.title || ap.productName || b.title,
                author: Array.isArray(ap.author) ? ap.author.join(', ') : (ap.author || b.author),
                price: Number(ap.price ?? b.price) || 0,
                image: (Array.isArray(ap.images) && ap.images.length > 0) ? ap.images[0] : (ap.image || b.image),
                images: ap.images || [], // Thêm images array
            };
        });
    }, [adminProducts]);

    const syncedNewBooks = useMemo(() => mapWithAdmin(newBooks), [mapWithAdmin]);
    const syncedTopSellingBooks = useMemo(() => mapWithAdmin(topSellingBooks), [mapWithAdmin]);
    const syncedLifeSkillsBooks = useMemo(() => mapWithAdmin(lifeSkillsBooks), [mapWithAdmin]);
    const syncedChildrenBooks = useMemo(() => mapWithAdmin(childrenBooks), [mapWithAdmin]);
    const syncedBusinessBooks = useMemo(() => mapWithAdmin(businessBooks), [mapWithAdmin]);
    const syncedLiteratureBooks = useMemo(() => mapWithAdmin(literatureBooks), [mapWithAdmin]);

    const bestSellingProducts = useMemo(() => {
        return [...syncedTopSellingBooks]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
    }, [id, syncedTopSellingBooks]);

    // Determine current product category by membership
    const currentCategory = useMemo(() => {
        if (!product) return null;
        if (newBooks.some(b => b.id === product.id)) return 'new';
        if (topSellingBooks.some(b => b.id === product.id)) return 'topSelling';
        if (lifeSkillsBooks.some(b => b.id === product.id)) return 'lifeSkills';
        if (childrenBooks.some(b => b.id === product.id)) return 'children';
        if (businessBooks.some(b => b.id === product.id)) return 'business';
        if (literatureBooks.some(b => b.id === product.id)) return 'literature';
        return null;
    }, [product]);

    // Related dataset: flip mapping by category
    const relatedBooks = useMemo(() => {
        switch (currentCategory) {
            case 'new':
                return syncedTopSellingBooks;
            case 'topSelling':
                return syncedNewBooks;
            case 'lifeSkills':
                return syncedChildrenBooks;
            case 'children':
                return syncedLifeSkillsBooks;
            case 'business':
                return syncedLiteratureBooks;
            case 'literature':
                return syncedBusinessBooks;
            default:
                return syncedTopSellingBooks;
        }
    }, [currentCategory, syncedTopSellingBooks, syncedNewBooks, syncedChildrenBooks, syncedLifeSkillsBooks, syncedBusinessBooks, syncedLiteratureBooks]);

    // Related Products Navigation based on current relatedBooks
    const nextRelatedProducts = () => {
        setCurrentRelatedProductsSlide((prev) => (prev + 1) % Math.ceil(relatedBooks.length / 4));
    };

    const prevRelatedProducts = () => {
        setCurrentRelatedProductsSlide((prev) => (prev - 1 + Math.ceil(relatedBooks.length / 4)) % Math.ceil(relatedBooks.length / 4));
    };

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
                    <span className="breadcrumb-separator"> / </span>
                    <span
                        className="breadcrumb-item clickable"
                        onClick={() => navigate('/allProduct')}
                        style={{ cursor: 'pointer' }}
                    >
                        TẤT CẢ SẢN PHẨM
                    </span>
                    <span className="breadcrumb-separator"> / </span>
                    <span className="breadcrumb-item">{product.title}</span>
                </div>
            </div>

            <div className="container">
                <div className="product-detail">
                    {/* Left Section - Product Images */}
                    <div className="product-images">
                        <div className="main-image">
                            <img
                                src={(() => {
                                    const currentImages = product.images && Array.isArray(product.images) && product.images.length > 0
                                        ? product.images
                                        : [product.image];
                                    return currentImages[selectedImage] || product.image;
                                })()}
                                alt={product.title}
                            />
                        </div>
                        <div className="thumbnail-images">
                            {(() => {
                                // Tạo array 5 ảnh (ảnh chính + 4 ảnh nhỏ)
                                const currentImages = product.images && Array.isArray(product.images) && product.images.length > 0
                                    ? product.images
                                    : [product.image];

                                const displayImages = [];
                                for (let i = 0; i < 5; i++) {
                                    if (i < currentImages.length) {
                                        displayImages.push(currentImages[i]);
                                    } else {
                                        // Nếu không đủ 5 ảnh, lặp lại ảnh cuối
                                        displayImages.push(currentImages[currentImages.length - 1] || product.image);
                                    }
                                }

                                return displayImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => handleThumbnailClick(index)}
                                    >
                                        <img src={image} alt={`${product.title} ${index + 1}`} />
                                    </div>
                                ));
                            })()}
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
                                <span className="spec-value">{product.publisherName || 'NXB MINHLONG'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Kích thước:</span>
                                <span className="spec-value">{product.packageDimensions || '15.5x15.5 cm'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Năm xuất bản:</span>
                                <span className="spec-value">{product.publicationYear || 2024}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Số trang:</span>
                                <span className="spec-value">{product.pageCount || 300}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Khối lượng:</span>
                                <span className="spec-value">{product.weightGrams || 400} grams</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Bìa:</span>
                                <span className="spec-value">{product.coverType || 'bìa mềm'}</span>
                            </div>
                            {product.isbn && (
                                <div className="spec-item">
                                    <span className="spec-label">ISBN:</span>
                                    <span className="spec-value">{product.isbn}</span>
                                </div>
                            )}
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

                        <div className="action-buttons">
                            <Button
                                type="default"
                                className="add-to-cart-btn"
                                size="large"
                                onClick={handleAddToCart}
                            >
                                THÊM VÀO GIỎ
                            </Button>
                            <Button
                                type="default"
                                className="buy-now-btn"
                                size="large"
                                onClick={handleBuyNow}
                            >
                                MUA HÀNG
                            </Button>
                        </div>

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
                                                {product.description ? (
                                                    <p>{product.description}</p>
                                                ) : (
                                                    <>
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
                                                    </>
                                                )}
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
                            {Array.from({ length: Math.ceil(relatedBooks.length / 4) }, (_, slideIndex) => (
                                <div key={slideIndex} className="books-slide">
                                    {relatedBooks.slice(slideIndex * 4, (slideIndex + 1) * 4).map((book) => (
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
