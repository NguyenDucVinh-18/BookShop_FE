import React, { useState } from 'react';
import { Button, Input, Badge } from 'antd';
import { SearchOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined, MenuOutlined, CarOutlined, BookOutlined, HomeOutlined, PlayCircleOutlined, UserSwitchOutlined, ShopOutlined, HeartOutlined, FileTextOutlined, ReadOutlined, GiftOutlined, FormOutlined, TrophyOutlined, BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import '../styles/Header.css';

const Header = () => {
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const [hoveredSubMenu, setHoveredSubMenu] = useState(null);

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
                        <div className="logo">
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
                                />
                                <Button type="primary" className="search-button">
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
                                <UserOutlined className="icon" />
                                <span>Tài khoản</span>
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
                        <div
                            className="menu-section"
                            onMouseEnter={() => setIsMenuHovered(true)}
                            onMouseLeave={() => {
                                setIsMenuHovered(false);
                                setHoveredSubMenu(null);
                            }}
                        >
                            <MenuOutlined className="menu-icon" />
                            <span>DANH MỤC SÁCH</span>

                            {/* Dropdown Menu */}
                            {isMenuHovered && (
                                <div className="dropdown-menu">
                                    {menuItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`dropdown-item ${hoveredSubMenu === index ? 'hovered' : ''}`}
                                            onMouseEnter={() => setHoveredSubMenu(index)}
                                            onMouseLeave={() => setHoveredSubMenu(null)}
                                        >
                                            <span className="dropdown-icon">{item.icon}</span>
                                            <span className="dropdown-text">{item.text}</span>
                                            {item.hasSubMenu && <span className="dropdown-arrow">&gt;</span>}

                                            {/* Sub Menu */}
                                            {item.hasSubMenu && hoveredSubMenu === index && (
                                                <div className="sub-menu">
                                                    <div className="sub-menu-header">
                                                        <span className="sub-menu-title">{item.text}</span>
                                                    </div>
                                                    {item.subMenu.map((subItem, subIndex) => (
                                                        <div key={subIndex} className="sub-menu-item">
                                                            <span className="sub-menu-arrow">►</span>
                                                            <span className="sub-menu-text">{subItem}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Links */}
                        <div className="info-links">
                            <span className="info-link">Sản phẩm đã xem</span>
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
