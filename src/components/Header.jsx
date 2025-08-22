import React, { useState, useEffect } from 'react';
import { Button, Input, Badge, Dropdown, Menu, Popconfirm } from 'antd';
import { SearchOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined, MenuOutlined, CarOutlined, BookOutlined, HomeOutlined, ReadOutlined, GiftOutlined, FormOutlined, TrophyOutlined, BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItemCount, setCartItemCount] = useState(0);

    // Load cart items count from localStorage on component mount
    useEffect(() => {
        const loadCartCount = () => {
            try {
                const savedCart = localStorage.getItem('shoppingCart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    const count = parsedCart.items ? parsedCart.items.length : 0;
                    setCartItemCount(count);
                } else {
                    setCartItemCount(0);
                }
            } catch (error) {
                console.error('Error loading cart count:', error);
                setCartItemCount(0);
            }
        };

        // Load initially
        loadCartCount();

        // Listen for storage changes (when localStorage is modified from other components)
        const handleStorageChange = (e) => {
            if (e.key === 'shoppingCart') {
                loadCartCount();
            }
        };

        // Listen for custom event when cart is updated
        const handleCartUpdated = () => {
            loadCartCount();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cartUpdated', handleCartUpdated);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdated', handleCartUpdated);
        };
    }, []);

    const menuItems = [
        {
            icon: <HomeOutlined />,
            text: 'TRANG CHỦ',
            hasSubMenu: false
        },
        {
            icon: <BookOutlined />,
            text: 'TẤT CẢ SẢN PHẨM',
            hasSubMenu: false
        },
        {
            icon: <BookOutlined />,
            text: 'HÈ ĐỌC - HÈ KHÁC BIỆT',
            hasSubMenu: false
        },
        {
            icon: <BookOutlined />,
            text: 'SÁCH MẦM NON',
            hasSubMenu: true,
            subMenu: [
                'Bé Vào Lớp 1',
                'Từ Điển Tranh',
                'Thủ Công - Tập Tô',
                'Phát Triển Trí Tuệ'
            ]
        },
        {
            icon: <BookOutlined />,
            text: 'SÁCH THIẾU NHI',
            hasSubMenu: true,
            subMenu: [
                'Truyện Cổ Tích',
                'Sách Học Tập',
                'Sách Kỹ Năng Sống',
                'Sách Khám Phá'
            ]
        },
        {
            icon: <BookOutlined />,
            text: 'SÁCH KĨ NĂNG',
            hasSubMenu: true,
            subMenu: [
                'Kỹ Năng Giao Tiếp',
                'Kỹ Năng Lãnh Đạo',
                'Kỹ Năng Quản Lý',
                'Kỹ Năng Mềm'
            ]
        },
        {
            icon: <BookOutlined />,
            text: 'SÁCH KINH DOANH',
            hasSubMenu: true,
            subMenu: [
                'Marketing',
                'Quản Trị',
                'Tài Chính',
                'Khởi Nghiệp'
            ]
        },
        {
            icon: <BookOutlined />,
            text: 'SÁCH MẸ VÀ BÉ',
            hasSubMenu: true,
            subMenu: [
                'Chăm Sóc Trẻ',
                'Dinh Dưỡng',
                'Giáo Dục Sớm',
                'Sức Khỏe'
            ]
        },
        {
            icon: <BookOutlined />,
            text: 'SÁCH VĂN HỌC',
            hasSubMenu: true,
            subMenu: [
                'Tiểu Thuyết',
                'Truyện Ngắn',
                'Thơ Ca',
                'Tác Phẩm Kinh Điển'
            ]
        },
        {
            icon: <ReadOutlined />,
            text: 'SÁCH THAM KHẢO',
            hasSubMenu: true,
            subMenu: [
                'Toán Học',
                'Văn Học',
                'Lịch Sử',
                'Địa Lý'
            ]
        },
        {
            icon: <GiftOutlined />,
            text: 'ĐỒ CHƠI TRẺ EM - VPP',
            hasSubMenu: true,
            subMenu: [
                'Đồ Chơi Giáo Dục',
                'Bút Viết',
                'Sách Vở',
                'Dụng Cụ Học Tập'
            ]
        },
        {
            icon: <FormOutlined />,
            text: 'NOTEBOOK',
            hasSubMenu: true,
            subMenu: [
                'Sổ Tay',
                'Sổ Ghi Chép',
                'Sổ Kế Hoạch',
                'Sổ Tự Do'
            ]
        },
        {
            icon: <TrophyOutlined />,
            text: 'TOP BEST SELLER',
            hasSubMenu: false
        },
        {
            icon: <BellOutlined />,
            text: 'TIN TỨC/BLOG',
            hasSubMenu: true,
            subMenu: [
                'Tin Tức Sách',
                'Bài Viết Hay',
                'Review Sách',
                'Góc Chia Sẻ'
            ]
        },
        {
            icon: <ExclamationCircleOutlined />,
            text: 'SÁCH MỚI',
            hasSubMenu: false
        },
        {
            icon: <ExclamationCircleOutlined />,
            text: 'SÁCH SẮP PHÁT HÀNH',
            hasSubMenu: false
        }
    ];

    // Create Ant Design menu items
    const createMenuItems = () => {
        return menuItems.map((item, index) => {
            if (item.hasSubMenu) {
                return {
                    key: index,
                    icon: item.icon,
                    label: (
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn event bubble
                                // Handle parent category click
                                let parentCategory = '';
                                if (item.text === 'SÁCH MẦM NON') {
                                    parentCategory = 'children';
                                } else if (item.text === 'SÁCH THIẾU NHI') {
                                    parentCategory = 'thieu-nhi';
                                } else if (item.text === 'SÁCH KĨ NĂNG') {
                                    parentCategory = 'lifeSkills';
                                } else if (item.text === 'SÁCH KINH DOANH') {
                                    parentCategory = 'business';
                                } else if (item.text === 'SÁCH MẸ VÀ BÉ') {
                                    parentCategory = 'parenting';
                                } else if (item.text === 'SÁCH VĂN HỌC') {
                                    parentCategory = 'literature';
                                } else if (item.text === 'SÁCH THAM KHẢO') {
                                    parentCategory = 'reference';
                                } else if (item.text === 'ĐỒ CHƠI TRẺ EM - VPP') {
                                    parentCategory = 'toys';
                                }

                                if (parentCategory) {
                                    navigate(`/allProduct?category=${parentCategory}`);
                                }
                            }}
                            style={{ cursor: 'pointer', width: '100%' }}
                        >
                            {item.text}
                        </div>
                    ),
                    children: item.subMenu.map((subItem, subIndex) => ({
                        key: `${index}-${subIndex}`,
                        label: subItem,
                        onClick: () => {
                            let subCategory = '';
                            if (subItem === 'Bé Vào Lớp 1') {
                                subCategory = 'be-vao-lop-1';
                            } else if (subItem === 'Từ Điển Tranh') {
                                subCategory = 'tu-dien-tranh';
                            } else if (subItem === 'Thủ Công - Tập Tô') {
                                subCategory = 'thu-cong-tap-to';
                            } else if (subItem === 'Phát Triển Trí Tuệ') {
                                subCategory = 'phat-trien-tri-tue';
                            } else if (subItem === 'Truyện Cổ Tích') {
                                subCategory = 'truyen-co-tich';
                            } else if (subItem === 'Sách Học Tập') {
                                subCategory = 'sach-hoc-tap';
                            } else if (subItem === 'Sách Kỹ Năng Sống') {
                                subCategory = 'sach-ky-nang-song';
                            } else if (subItem === 'Sách Khám Phá') {
                                subCategory = 'sach-kham-pha';
                            } else if (subItem === 'Kỹ Năng Giao Tiếp') {
                                subCategory = 'ky-nang-giao-tiep';
                            } else if (subItem === 'Kỹ Năng Lãnh Đạo') {
                                subCategory = 'ky-nang-lanh-dao';
                            } else if (subItem === 'Kỹ Năng Quản Lý') {
                                subCategory = 'ky-nang-quan-ly';
                            } else if (subItem === 'Kỹ Năng Mềm') {
                                subCategory = 'ky-nang-mem';
                            } else if (subItem === 'Khởi Nghiệp') {
                                subCategory = 'khoi-nghiep';
                            } else if (subItem === 'Marketing') {
                                subCategory = 'marketing';
                            } else if (subItem === 'Quản Trị') {
                                subCategory = 'quan-tri';
                            } else if (subItem === 'Tài Chính') {
                                subCategory = 'tai-chinh';
                            } else if (subItem === 'Chăm Sóc Trẻ') {
                                subCategory = 'cham-soc-tre';
                            } else if (subItem === 'Dinh Dưỡng') {
                                subCategory = 'dinh-duong';
                            } else if (subItem === 'Giáo Dục Sớm') {
                                subCategory = 'giao-duc-som';
                            } else if (subItem === 'Sức Khỏe') {
                                subCategory = 'suc-khoe';
                            } else if (subItem === 'Tiểu Thuyết') {
                                subCategory = 'tieu-thuyet';
                            } else if (subItem === 'Truyện Ngắn') {
                                subCategory = 'truyen-ngan';
                            } else if (subItem === 'Thơ Ca') {
                                subCategory = 'tho-ca';
                            } else if (subItem === 'Tác Phẩm Kinh Điển') {
                                subCategory = 'tac-pham-kinh-dien';
                            } else if (subItem === 'Toán Học') {
                                subCategory = 'toan-hoc';
                            } else if (subItem === 'Văn Học') {
                                subCategory = 'van-hoc';
                            } else if (subItem === 'Lịch Sử') {
                                subCategory = 'lich-su';
                            } else if (subItem === 'Địa Lý') {
                                subCategory = 'dia-ly';
                            } else if (subItem === 'Đồ Chơi Giáo Dục') {
                                subCategory = 'do-choi-giao-duc';
                            } else if (subItem === 'Bút Viết') {
                                subCategory = 'but-viet';
                            } else if (subItem === 'Sách Vở') {
                                subCategory = 'sach-vo';
                            } else if (subItem === 'Dụng Cụ Học Tập') {
                                subCategory = 'dung-cu-hoc-tap';
                            }

                            if (subCategory) {
                                navigate(`/allProduct?category=${subCategory}`);
                            }
                        }
                    }))
                };
            } else {
                // Add onClick handler for menu items without submenu
                let onClickHandler = undefined;
                if (item.text === 'TRANG CHỦ') {
                    onClickHandler = () => {
                        // Clear cart notes when going to home page
                        const currentCart = localStorage.getItem('shoppingCart');
                        if (currentCart) {
                            try {
                                const parsedCart = JSON.parse(currentCart);
                                // Keep only items, remove notes
                                localStorage.setItem('shoppingCart', JSON.stringify({
                                    items: parsedCart.items || []
                                }));
                            } catch (error) {
                                console.error('Error clearing cart notes:', error);
                            }
                        }
                        navigate('/');
                    };
                } else if (item.text === 'TẤT CẢ SẢN PHẨM') {
                    onClickHandler = () => navigate('/allProduct');
                } else if (item.text === 'HÈ ĐỌC - HÈ KHÁC BIỆT') {
                    onClickHandler = () => navigate('/allProduct?category=summer');
                } else if (item.text === 'TOP BEST SELLER') {
                    onClickHandler = () => navigate('/allProduct?category=bestselling');
                } else if (item.text === 'SÁCH MỚI') {
                    onClickHandler = () => navigate('/allProduct?category=new');
                } else if (item.text === 'SÁCH SẮP PHÁT HÀNH') {
                    onClickHandler = () => navigate('/allProduct?category=upcoming');
                }

                return {
                    key: index,
                    icon: item.icon,
                    label: item.text,
                    onClick: onClickHandler
                };
            }
        });
    };

    // Search function
    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Navigate to search results page with query
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery(''); // Clear search input after search
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            {/* Top Bar - Dark Purple */}
            <div className="top-bar">
                <div className="container">
                    {/* Top bar content if needed */}
                </div>
            </div>

            {/* Main Header - White */}
            <header className="main-header">
                <div className="container">
                    <div className="header-content">
                        {/* Logo */}
                        <div className="logo" onClick={() => {
                            // Clear cart notes when going to home page
                            const currentCart = localStorage.getItem('shoppingCart');
                            if (currentCart) {
                                try {
                                    const parsedCart = JSON.parse(currentCart);
                                    // Keep only items, remove notes
                                    localStorage.setItem('shoppingCart', JSON.stringify({
                                        items: parsedCart.items || []
                                    }));
                                } catch (error) {
                                    console.error('Error clearing cart notes:', error);
                                }
                            }
                            navigate('/');
                        }} style={{ cursor: 'pointer' }}>
                            <div className="logo-icon">📚</div>
                            <div className="logo-text">
                                <div className="logo-title">MINHLONGbook</div>
                                <div className="logo-subtitle">Ươm mầm tri thức</div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="search-section">
                            <div className="search-container">
                                <Input
                                    placeholder="Tìm kiếm..."
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button
                                    type="primary"
                                    className="search-button"
                                    onClick={handleSearch}
                                    disabled={!searchQuery.trim()}
                                >
                                    <SearchOutlined />
                                    Tìm kiếm
                                </Button>
                            </div>
                        </div>

                        {/* User Icons */}
                        <div className="user-icons">
                            <div className="icon-item" onClick={() => navigate('/order-lookup')} style={{ cursor: 'pointer' }}>
                                <PhoneOutlined className="icon" />
                                <span>Tra cứu đơn hàng</span>
                            </div>
                            <div className="icon-item" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
                                <Badge count={cartItemCount} className="cart-badge">
                                    <ShoppingCartOutlined className="icon" />
                                </Badge>
                                <span>Giỏ hàng</span>
                            </div>
                            <div className="icon-item">
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: 'login',
                                                icon: <FormOutlined />,
                                                label: 'Đăng nhập',
                                                onClick: () => navigate('/login')
                                            },
                                            {
                                                key: 'register',
                                                icon: <UserOutlined />,
                                                label: 'Đăng ký',
                                                onClick: () => navigate('/register')
                                            }
                                        ]
                                    }}
                                    trigger={['click']}
                                    placement="bottomRight"
                                    overlayStyle={{ zIndex: 1000 }}
                                >
                                    <div className="icon-item">
                                        <UserOutlined className="icon" />
                                        <span>Tài khoản</span>
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Bar - Light Gray */}
            <div className="navigation-bar">
                <div className="container">
                    <div className="nav-content">
                        {/* Menu with Dropdown */}
                        <div className="menu-section">
                            <Dropdown
                                menu={{ items: createMenuItems() }}
                                trigger={['hover']}
                                placement="bottomLeft"
                                overlayStyle={{ zIndex: 1000 }}
                            >
                                <div className="menu-trigger">
                                    <MenuOutlined className="menu-icon" />
                                    <span>DANH MỤC SÁCH</span>
                                </div>
                            </Dropdown>
                        </div>

                        {/* Info Links */}
                        <div className="info-links">
                            <Dropdown
                                trigger={["hover"]}
                                placement="bottom"
                                dropdownRender={() => {
                                    let items = [];
                                    try {
                                        const raw = localStorage.getItem('recentlyViewed');
                                        items = raw ? JSON.parse(raw) : [];
                                    } catch (error) {
                                        console.error('Error loading recently viewed:', error);
                                    }
                                    return (
                                        <div className="recent-dropdown">
                                            <div className="recent-actions-top">
                                                <Button size="small" type="link" onClick={() => navigate('/recently-viewed')}>Xem tất cả</Button>
                                                {items && items.length > 0 && (
                                                    <Popconfirm
                                                        title="Xóa tất cả sản phẩm đã xem?"
                                                        okText="Xóa"
                                                        cancelText="Hủy"
                                                        okButtonProps={{ danger: true }}
                                                        placement="bottomRight"
                                                        onConfirm={() => {
                                                            localStorage.removeItem('recentlyViewed');
                                                            // Force re-render by updating state
                                                            // Emit custom event to notify other components
                                                            window.dispatchEvent(new Event('localStorageCleared'));
                                                        }}
                                                    >
                                                        <Button size="small" type="link" danger>Xóa tất cả</Button>
                                                    </Popconfirm>
                                                )}
                                            </div>
                                            <div className="recent-grid">
                                                {(!items || items.length === 0) && (
                                                    <div className="recent-empty">Chưa có sản phẩm đã xem</div>
                                                )}
                                                {items && items.slice(0, 5).map((p) => (
                                                    <div key={p.id} className="recent-card" onClick={() => navigate(`/product/${p.id}`)}>
                                                        <div className="recent-image"><img src={p.image} alt={p.title} /></div>
                                                        <div className="recent-title">{p.title}</div>
                                                        <div className="recent-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }}
                            >
                                <span className="info-link" style={{ cursor: 'pointer' }}>Sản phẩm đã xem</span>
                            </Dropdown>
                            <div className="info-item">
                                <CarOutlined className="info-icon" />
                                <span>Ship COD Trên Toàn Quốc</span>
                            </div>
                            <div className="info-item">
                                <CarOutlined className="info-icon" />
                                <span>Free Ship Đơn Hàng Trên 300k</span>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="contact-info">
                            <PhoneOutlined className="contact-icon" />
                            <span>0966160925 / 0989 849 396</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
