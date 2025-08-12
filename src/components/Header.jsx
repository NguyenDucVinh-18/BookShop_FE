import React, { useState } from 'react';
import { Button, Input, Badge, Dropdown, Menu, Popconfirm } from 'antd';
import { SearchOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined, MenuOutlined, CarOutlined, BookOutlined, HomeOutlined, ReadOutlined, GiftOutlined, FormOutlined, TrophyOutlined, BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [recentReload, setRecentReload] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const menuItems = [
        {
            icon: <HomeOutlined />,
            text: 'TRANG CHỦ',
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
                'Chăm Sóc Thai Kỳ',
                'Nuôi Dạy Con',
                'Dinh Dưỡng',
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
                'Văn Học Nước Ngoài'
            ]
        },
        {
            icon: <ReadOutlined />,
            text: 'SÁCH THAM KHẢO',
            hasSubMenu: true,
            subMenu: [
                'Sách Giáo Khoa',
                'Sách Bài Tập',
                'Sách Tham Khảo',
                'Tài Liệu Học Tập'
            ]
        },
        {
            icon: <GiftOutlined />,
            text: 'ĐỒ CHƠI TRẺ EM - VPP',
            hasSubMenu: true,
            subMenu: [
                'Đồ Chơi Giáo Dục',
                'Đồ Chơi Sáng Tạo',
                'Văn Phòng Phẩm',
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
                    label: item.text,
                    children: item.subMenu.map((subItem, subIndex) => ({
                        key: `${index}-${subIndex}`,
                        label: subItem
                    }))
                };
            } else {
                return {
                    key: index,
                    icon: item.icon,
                    label: item.text
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
                        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
                            <div className="icon-item">
                                <PhoneOutlined className="icon" />
                                <span>Tra cứu đơn hàng</span>
                            </div>
                            <div className="icon-item">
                                <Badge count={0} className="cart-badge">
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
                                    } catch { }
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
                                                            setRecentReload((v) => v + 1);
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
