import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    BookOutlined,
    UserOutlined,
    BellOutlined,
    SettingOutlined
} from '@ant-design/icons';
import CommonDashboard from '../components/admin/CommonDashboard';
import CommonProductManagement from '../components/admin/CommonProductManagement';
import CommonCustomerManagement from '../components/admin/CommonCustomerManagement';
import CommonNotificationManagement from '../components/admin/CommonNotificationManagement';
import CommonSettings from '../components/admin/CommonSettings';
import '../styles/AdminPage.css';

// Import dữ liệu từ books.js
import {
    newBooks, topSellingBooks, lifeSkillsBooks, childrenBooks, businessBooks,
    literatureBooks, summerBooks, thieuNhiBooks, parentingBooks, referenceBooks,
    toysBooks, beVaoLop1Books, tuDienTranhBooks, thuCongTapToBooks,
    phatTrienTriTueBooks, truyenCoTichBooks, sachHocTapBooks, sachKyNangSongBooks,
    sachKhamPhaBooks, kyNangGiaoTiepBooks, kyNangLanhDaoBooks, kyNangQuanLyBooks,
    kyNangMemBooks, khoiNghiepBooks, marketingBooks, quanTriBooks, taiChinhBooks,
    chamSocTreBooks, dinhDuongBooks, giaoDucSomBooks, sucKhoeBooks, tieuThuyetBooks,
    truyenNganBooks, thoCaBooks, tacPhamKinhDienBooks, toanHocBooks, vanHocBooks,
    lichSuBooks, diaLyBooks, doChoiGiaoDucBooks, butVietBooks, sachVoBooks,
    dungCuHocTapBooks
} from '../data/books';

const { Sider, Content } = Layout;

const SalePage = () => {
    // Khởi tạo dữ liệu sản phẩm từ books.js - LUÔN cập nhật dữ liệu mới
    React.useEffect(() => {
        // Seed theo đúng tập sản phẩm của trang Tất cả sản phẩm (gồm danh mục cha + con)
        const datedNow = Date.now();
        const tagBooks = (arr, category) => (arr || []).map((b, idx) => ({
            ...b,
            category,
            status: 'active',
            images: [b.image],
            description: b.description || `Mô tả chi tiết về ${b.title}`,
            publisher: b.publisher || 'Nhà xuất bản Minh Long',
            publicationYear: b.publicationYear || Math.floor(Math.random() * 10) + 2015,
            pageCount: b.pageCount || Math.floor(Math.random() * 200) + 100,
            isbn: b.isbn || `ISBN-${Math.floor(Math.random() * 9000000000000) + 1000000000000}`,
            stock: b.stock || 50,
            releaseDate: b.releaseDate || new Date(datedNow - (idx + 1) * 86400000).toISOString()
        }));

        const allBooksData = [
            ...tagBooks(newBooks, 'new'),
            ...tagBooks(topSellingBooks, 'bestselling'),
            ...tagBooks(summerBooks, 'summer'),
            // Parent categories
            ...tagBooks(childrenBooks, 'children'),
            ...tagBooks(businessBooks, 'business'),
            ...tagBooks(literatureBooks, 'literature'),
            ...tagBooks(thieuNhiBooks, 'thieu-nhi'),
            ...tagBooks(parentingBooks, 'parenting'),
            ...tagBooks(referenceBooks, 'reference'),
            ...tagBooks(toysBooks, 'toys'),
            ...tagBooks(lifeSkillsBooks, 'lifeSkills'),
            // Subcategories
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

        const existed = localStorage.getItem('saleProducts');
        if (!existed) {
            localStorage.setItem('saleProducts', JSON.stringify(allBooksData));
            window.dispatchEvent(new Event('saleProductsUpdated'));
            setProducts(allBooksData);
        } else {
            setProducts(JSON.parse(existed));
        }
    }, []);

    const [selectedKey, setSelectedKey] = useState(() => {
        // Lấy selectedKey từ localStorage hoặc mặc định là 'dashboard'
        const savedSelectedKey = localStorage.getItem('saleSelectedMenu');
        return savedSelectedKey || 'dashboard';
    });

    // Đọc dữ liệu từ localStorage hoặc dùng dữ liệu mặc định
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('saleProducts');
        if (savedProducts) {
            return JSON.parse(savedProducts);
        }
        // Dữ liệu mặc định từ books.js nếu chưa có trong localStorage
        return [];
    });

    // Đọc dữ liệu khách hàng từ localStorage hoặc dùng dữ liệu mặc định
    const [customers, setCustomers] = useState(() => {
        const savedCustomers = localStorage.getItem('saleCustomers');
        if (savedCustomers) {
            return JSON.parse(savedCustomers);
        }
        // Dữ liệu mặc định nếu chưa có trong localStorage
        return [
            { id: 1, name: 'Nguyễn Văn D', email: 'nguyenvand@gmail.com', phone: '0123456789', address: 'Hà Nội', status: 'active', joinDate: '2024-01-15' },
            { id: 2, name: 'Trần Thị E', email: 'tranthie@gmail.com', phone: '0987654321', address: 'TP.HCM', status: 'active', joinDate: '2024-02-20' },
            { id: 3, name: 'Lê Văn F', email: 'levanf@gmail.com', phone: '0555666777', address: 'Đà Nẵng', status: 'inactive', joinDate: '2024-03-10' }
        ];
    });

    // Đọc dữ liệu thông báo từ localStorage hoặc dùng dữ liệu mặc định
    const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('saleNotifications');
        if (savedNotifications) {
            return JSON.parse(savedNotifications);
        }
        // Dữ liệu mặc định nếu chưa có
        return [
            { id: 1, title: 'Khuyến mãi mùa hè', content: 'Giảm giá 20% cho tất cả sách thiếu nhi', type: 'promotion', status: 'active', createdAt: '2024-06-01' },
            { id: 2, title: 'Bảo trì hệ thống', content: 'Hệ thống sẽ bảo trì từ 2h-4h sáng', type: 'maintenance', status: 'active', createdAt: '2024-06-02' }
        ];
    });

    const [settings, setSettings] = useState({
        companyName: 'MINH LONG BOOKSHOP',
        companyPhone: '0123456789',
        companyEmail: 'info@minhlong.com',
        companyAddress: '123 Đường ABC, Quận 1, TP.HCM',
        companyDescription: 'Nhà sách Minh Long - Nơi tri thức lan tỏa',
        systemLanguage: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        currency: 'VND',
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        autoBackup: true
    });

    // useEffect để lắng nghe thay đổi từ ManagePage
    React.useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'saleProducts') {
                setProducts(JSON.parse(e.newValue || '[]'));
            }
            if (e.key === 'saleCustomers') {
                setCustomers(JSON.parse(e.newValue || '[]'));
            }
            if (e.key === 'saleNotifications') {
                setNotifications(JSON.parse(e.newValue || '[]'));
            }
            if (e.key === 'saleSettings') {
                setSettings(JSON.parse(e.newValue || {}));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const stats = {
        totalProducts: products.length,
        pendingOrders: 5,
        totalRevenue: 15000000,
        totalCustomers: customers.length
    };

    const recentOrders = [
        { id: 1, customerName: 'Nguyễn Văn D', phone: '0123456789', total: 350000, status: 'Chờ xử lý', date: '2024-06-01' },
        { id: 2, customerName: 'Trần Thị E', phone: '0987654321', total: 280000, status: 'Đã xử lý', date: '2024-06-02' }
    ];

    const topProducts = [
        { id: 1, title: 'Sách Kỹ Năng Sống', author: 'Nguyễn Văn A', price: 150000, category: 'Sách kỹ năng', stock: 50, images: ['/src/assets/images/slider_item_1_image.jpg'] },
        { id: 2, title: 'Sách Kinh Doanh', author: 'Trần Thị B', price: 200000, category: 'Sách kinh doanh', stock: 30, images: ['/src/assets/images/slider_item_2_image.jpg'] }
    ];

    // Handlers
    const handleAddProduct = (newProduct) => {
        // Tìm ID lớn nhất hiện tại và +1 để tránh trùng
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        const product = {
            ...newProduct,
            id: maxId + 1,
            status: 'active'
        };
        const newProducts = [...products, product];
        setProducts(newProducts);
        // Lưu vào localStorage
        localStorage.setItem('saleProducts', JSON.stringify(newProducts));
        window.dispatchEvent(new Event('saleProductsUpdated'));
    };

    const handleEditProduct = (productId, updatedProduct) => {
        const newProducts = products.map(p => p.id === productId ? { ...p, ...updatedProduct } : p);
        setProducts(newProducts);
        // Lưu vào localStorage
        localStorage.setItem('saleProducts', JSON.stringify(newProducts));
        window.dispatchEvent(new Event('saleProductsUpdated'));
    };

    const handleDeleteProduct = (productId) => {
        const newProducts = products.filter(p => p.id !== productId);
        setProducts(newProducts);
        // Lưu vào localStorage
        localStorage.setItem('saleProducts', JSON.stringify(newProducts));
        window.dispatchEvent(new Event('saleProductsUpdated'));
    };

    const handleAddCustomer = (newCustomer) => {
        // Tìm ID lớn nhất hiện tại và +1 để tránh trùng
        const maxId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) : 0;
        const customer = {
            ...newCustomer,
            id: maxId + 1,
            joinDate: new Date().toISOString().split('T')[0]
        };
        const newCustomers = [...customers, customer];
        setCustomers(newCustomers);
        // Lưu vào localStorage
        localStorage.setItem('saleCustomers', JSON.stringify(newCustomers));
    };

    const handleEditCustomer = (customerId, updatedCustomer) => {
        const newCustomers = customers.map(c => c.id === customerId ? { ...c, ...updatedCustomer } : c);
        setCustomers(newCustomers);
        // Lưu vào localStorage
        localStorage.setItem('saleCustomers', JSON.stringify(newCustomers));
    };

    const handleDeleteCustomer = (customerId) => {
        const newCustomers = customers.filter(c => c.id !== customerId);
        setCustomers(newCustomers);
        // Lưu vào localStorage
        localStorage.setItem('saleCustomers', JSON.stringify(newCustomers));
    };

    const handleAddNotification = (newNotification) => {
        // Tìm ID lớn nhất hiện tại và +1 để tránh trùng
        const maxId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) : 0;
        const notification = {
            ...newNotification,
            id: maxId + 1,
            createdAt: new Date().toISOString().split('T')[0]
        };
        const newNotifications = [...notifications, notification];
        setNotifications(newNotifications);
        // Lưu vào localStorage
        localStorage.setItem('saleNotifications', JSON.stringify(newNotifications));
    };

    const handleEditNotification = (notificationId, updatedNotification) => {
        const newNotifications = notifications.map(n => n.id === notificationId ? { ...n, ...updatedNotification } : n);
        setNotifications(newNotifications);
        // Lưu vào localStorage
        localStorage.setItem('saleNotifications', JSON.stringify(newNotifications));
    };

    const handleDeleteNotification = (notificationId) => {
        const newNotifications = notifications.filter(n => n.id !== notificationId);
        setNotifications(newNotifications);
        // Lưu vào localStorage
        localStorage.setItem('saleNotifications', JSON.stringify(newNotifications));
    };

    const handleSaveSettings = async (newSettings) => {
        setSettings(newSettings);
        // Lưu vào localStorage
        localStorage.setItem('saleSettings', JSON.stringify(newSettings));
        return Promise.resolve();
    };

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
        },
        {
            key: 'products',
            icon: <BookOutlined />,
            label: 'Quản lý sản phẩm'
        },
        {
            key: 'customers',
            icon: <UserOutlined />,
            label: 'Quản lý khách hàng'
        },
        {
            key: 'notifications',
            icon: <BellOutlined />,
            label: 'Quản lý thông báo'
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt'
        }
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case 'dashboard':
                return (
                    <CommonDashboard
                        stats={stats}
                        recentOrders={recentOrders}
                        topProducts={topProducts}
                    />
                );
            case 'products':
                return (
                    <CommonProductManagement
                        products={products}
                        onAddProduct={handleAddProduct}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                );
            case 'customers':
                return (
                    <CommonCustomerManagement
                        customers={customers}
                        onEditCustomer={handleEditCustomer}
                        onAddCustomer={handleAddCustomer}
                        onDeleteCustomer={handleDeleteCustomer}
                    />
                );
            case 'notifications':
                return (
                    <CommonNotificationManagement
                        notifications={notifications}
                        onAddNotification={handleAddNotification}
                        onEditNotification={handleEditNotification}
                        onDeleteNotification={handleDeleteNotification}
                    />
                );
            case 'settings':
                return (
                    <CommonSettings
                        settings={settings}
                        onSaveSettings={handleSaveSettings}
                    />
                );
            default:
                return <CommonDashboard stats={stats} recentOrders={recentOrders} topProducts={topProducts} />;
        }
    };

    return (
        <Layout className="admin-layout">
            <Sider width={280} className="admin-sider">
                <div className="admin-logo">
                    <h2>MINH LONG SALE</h2>
                </div>
                <Menu
                    className="admin-menu"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={({ key }) => {
                        setSelectedKey(key);
                        // Lưu selectedKey vào localStorage
                        localStorage.setItem('saleSelectedMenu', key);
                    }}
                />
            </Sider>
            <Layout>
                <Content className="admin-content">
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default SalePage;
