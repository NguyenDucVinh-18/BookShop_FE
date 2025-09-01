import React, { useState } from 'react';
import { Layout, Menu, Button, Table, Modal, Form, Input, Tag, Space, Row, Col, Card, Select, InputNumber, message } from 'antd';
import {
    DashboardOutlined,
    BookOutlined,
    UserOutlined,
    BellOutlined,
    SettingOutlined,
    TeamOutlined,
    BarChartOutlined,
    GiftOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';

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

const ManagePage = () => {
    const [selectedKey, setSelectedKey] = useState(() => {
        // Lấy trạng thái menu từ localStorage khi khởi tạo
        const savedMenu = localStorage.getItem('managerSelectedMenu');
        return savedMenu || 'dashboard';
    });

    // Mock data cho 5 phần chung với localStorage
    const [products, setProducts] = useState(() => {
        // Lấy danh sách sản phẩm từ localStorage khi khởi tạo - dùng chung với SalePage
        const savedProducts = localStorage.getItem('saleProducts');
        if (savedProducts) {
            return JSON.parse(savedProducts);
        }
        // Dữ liệu mặc định từ books.js nếu chưa có
        return [];
    });

    // Khởi tạo dữ liệu sản phẩm giống trang Tất cả sản phẩm (đủ cha + con)
    React.useEffect(() => {
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

        localStorage.setItem('saleProducts', JSON.stringify(allBooksData));
        window.dispatchEvent(new Event('saleProductsUpdated'));
        setProducts(allBooksData);
    }, []);

    const [customers, setCustomers] = useState(() => {
        // Lấy danh sách khách hàng từ localStorage khi khởi tạo - dùng chung với SalePage
        const savedCustomers = localStorage.getItem('saleCustomers');
        if (savedCustomers) {
            return JSON.parse(savedCustomers);
        }
        // Dữ liệu mặc định nếu chưa có
        return [
            { id: 1, name: 'Nguyễn Văn D', email: 'nguyenvand@gmail.com', phone: '0123456789', address: 'Hà Nội', status: 'active', joinDate: '2024-01-15' },
            { id: 2, name: 'Trần Thị E', email: 'tranthie@gmail.com', phone: '0987654321', address: 'TP.HCM', status: 'active', joinDate: '2024-02-20' },
            { id: 3, name: 'Lê Văn F', email: 'levanf@gmail.com', phone: '0555666777', address: 'Đà Nẵng', status: 'inactive', joinDate: '2024-03-10' }
        ];
    });

    const [notifications, setNotifications] = useState(() => {
        // Lấy danh sách thông báo từ localStorage khi khởi tạo - dùng chung với SalePage
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

    const [settings, setSettings] = useState(() => {
        // Lấy cài đặt từ localStorage khi khởi tạo - dùng chung với SalePage
        const savedSettings = localStorage.getItem('saleSettings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
        // Dữ liệu mặc định nếu chưa có
        return {
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
        };
    });

    // Mock data cho 3 phần riêng
    const [employees, setEmployees] = useState(() => {
        // Lấy danh sách nhân viên từ localStorage khi khởi tạo
        const savedEmployees = localStorage.getItem('managerEmployees');
        if (savedEmployees) {
            return JSON.parse(savedEmployees);
        }
        // Dữ liệu mặc định nếu chưa có
        return [
            { id: 1, name: 'Nguyễn Văn G', email: 'nguyenvang@gmail.com', phone: '0111222333', position: 'Nhân viên bán hàng', department: 'Sales', status: 'active', joinDate: '2024-01-01' },
            { id: 2, name: 'Trần Thị H', email: 'tranthih@gmail.com', phone: '0444555666', position: 'Quản lý kho', department: 'Warehouse', status: 'active', joinDate: '2024-02-01' },
            { id: 3, name: 'Lê Văn I', email: 'levani@gmail.com', phone: '0777888999', position: 'Kế toán', department: 'Accounting', status: 'active', joinDate: '2024-03-01' }
        ];
    });

    const [statistics, setStatistics] = useState({
        monthlyRevenue: [12000000, 15000000, 18000000, 20000000, 22000000, 25000000],
        monthlyOrders: [150, 180, 200, 220, 250, 280],
        topCategories: [
            { name: 'Sách kỹ năng', sales: 35 },
            { name: 'Sách kinh doanh', sales: 28 },
            { name: 'Sách thiếu nhi', sales: 22 },
            { name: 'Sách văn học', sales: 15 }
        ]
    });

    const [promotions, setPromotions] = useState(() => {
        // Lấy danh sách khuyến mãi từ localStorage khi khởi tạo
        const savedPromotions = localStorage.getItem('managerPromotions');
        if (savedPromotions) {
            return JSON.parse(savedPromotions);
        }
        // Dữ liệu mặc định nếu chưa có
        return [
            { id: 1, name: 'Khuyến mãi mùa hè', discount: 20, startDate: '2024-06-01', endDate: '2024-08-31', status: 'active', description: 'Giảm giá 20% cho tất cả sách thiếu nhi' },
            { id: 2, name: 'Khuyến mãi sinh nhật', discount: 15, startDate: '2024-01-01', endDate: '2024-12-31', status: 'active', description: 'Giảm giá 15% cho khách hàng trong tháng sinh nhật' },
            { id: 3, name: 'Khuyến mãi mới', discount: 10, startDate: '2024-07-01', endDate: '2024-07-31', status: 'inactive', description: 'Giảm giá 10% cho sách mới phát hành' }
        ];
    });

    // useEffect để lắng nghe thay đổi từ SalePage
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
            if (e.key === 'managerEmployees') {
                setEmployees(JSON.parse(e.newValue || '[]'));
            }
            if (e.key === 'managerPromotions') {
                setPromotions(JSON.parse(e.newValue || '[]'));
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
        { id: 1, title: 'Sách Kỹ Năng Sống', author: 'Nguyễn Văn A', price: 150000, category: 'Sách kỹ năng', stock: 50 },
        { id: 2, title: 'Sách Kinh Doanh', author: 'Trần Thị B', price: 200000, category: 'Sách kinh doanh', stock: 30 }
    ];

    // Handlers cho 5 phần chung
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
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleProducts', JSON.stringify(newProducts));
        window.dispatchEvent(new Event('saleProductsUpdated'));
    };

    const handleEditProduct = (productId, updatedProduct) => {
        const newProducts = products.map(p => p.id === productId ? { ...p, ...updatedProduct } : p);
        setProducts(newProducts);
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleProducts', JSON.stringify(newProducts));
        window.dispatchEvent(new Event('saleProductsUpdated'));
    };

    const handleDeleteProduct = (productId) => {
        const newProducts = products.filter(p => p.id !== productId);
        setProducts(newProducts);
        // Lưu vào localStorage - dùng chung với SalePage
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
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleCustomers', JSON.stringify(newCustomers));
    };

    const handleEditCustomer = (customerId, updatedCustomer) => {
        const newCustomers = customers.map(c => c.id === customerId ? { ...c, ...updatedCustomer } : c);
        setCustomers(newCustomers);
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleCustomers', JSON.stringify(newCustomers));
    };

    const handleDeleteCustomer = (customerId) => {
        const newCustomers = customers.filter(c => c.id !== customerId);
        setCustomers(newCustomers);
        // Lưu vào localStorage - dùng chung với SalePage
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
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleNotifications', JSON.stringify(newNotifications));
    };

    const handleEditNotification = (notificationId, updatedNotification) => {
        const newNotifications = notifications.map(n => n.id === notificationId ? { ...n, ...updatedNotification } : n);
        setNotifications(newNotifications);
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleNotifications', JSON.stringify(newNotifications));
    };

    const handleDeleteNotification = (notificationId) => {
        const newNotifications = notifications.filter(n => n.id !== notificationId);
        setNotifications(newNotifications);
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleNotifications', JSON.stringify(newNotifications));
    };

    const handleSaveSettings = async (newSettings) => {
        setSettings(newSettings);
        // Lưu vào localStorage - dùng chung với SalePage
        localStorage.setItem('saleSettings', JSON.stringify(newSettings));
        return Promise.resolve();
    };

    // Handlers cho 3 phần riêng
    const handleAddEmployee = (newEmployee) => {
        // Tìm ID lớn nhất hiện tại và +1 để tránh trùng
        const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) : 0;
        const employee = {
            ...newEmployee,
            id: maxId + 1,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0]
        };
        const newEmployees = [...employees, employee];
        setEmployees(newEmployees);
        // Lưu vào localStorage
        localStorage.setItem('managerEmployees', JSON.stringify(newEmployees));
    };

    const handleEditEmployee = (employeeId, updatedEmployee) => {
        const newEmployees = employees.map(e => e.id === employeeId ? { ...e, ...updatedEmployee } : e);
        setEmployees(newEmployees);
        // Lưu vào localStorage
        localStorage.setItem('managerEmployees', JSON.stringify(newEmployees));
    };

    const handleDeleteEmployee = (employeeId) => {
        const newEmployees = employees.filter(e => e.id !== employeeId);
        setEmployees(newEmployees);
        // Lưu vào localStorage
        localStorage.setItem('managerEmployees', JSON.stringify(newEmployees));
    };

    const handleAddPromotion = (newPromotion) => {
        // Tìm ID lớn nhất hiện tại và +1 để tránh trùng
        const maxId = promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) : 0;
        const promotion = {
            ...newPromotion,
            id: maxId + 1
        };
        const newPromotions = [...promotions, promotion];
        setPromotions(newPromotions);
        // Lưu vào localStorage
        localStorage.setItem('managerPromotions', JSON.stringify(newPromotions));
    };

    const handleEditPromotion = (promotionId, updatedPromotion) => {
        const newPromotions = promotions.map(p => p.id === promotionId ? { ...p, ...updatedPromotion } : p);
        setPromotions(newPromotions);
        // Lưu vào localStorage
        localStorage.setItem('managerPromotions', JSON.stringify(newPromotions));
    };

    const handleDeletePromotion = (promotionId) => {
        const newPromotions = promotions.filter(p => p.id !== promotionId);
        setPromotions(newPromotions);
        // Lưu vào localStorage
        localStorage.setItem('managerPromotions', JSON.stringify(newPromotions));
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
            key: 'employees',
            icon: <TeamOutlined />,
            label: 'Quản lý nhân viên'
        },
        {
            key: 'statistics',
            icon: <BarChartOutlined />,
            label: 'Quản lý thống kê'
        },
        {
            key: 'promotions',
            icon: <GiftOutlined />,
            label: 'Quản lý khuyến mãi'
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
            case 'employees':
                return <EmployeeManagement
                    employees={employees}
                    onAddEmployee={handleAddEmployee}
                    onEditEmployee={handleEditEmployee}
                    onDeleteEmployee={handleDeleteEmployee}
                />;
            case 'statistics':
                return <StatisticsManagement statistics={statistics} />;
            case 'promotions':
                return <PromotionManagement
                    promotions={promotions}
                    onAddPromotion={handleAddPromotion}
                    onEditPromotion={handleEditPromotion}
                    onDeletePromotion={handleDeletePromotion}
                />;
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
                    <h2>MINH LONG MANAGE</h2>
                </div>
                <Menu
                    className="admin-menu"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={({ key }) => {
                        setSelectedKey(key);
                        // Lưu selectedKey vào localStorage
                        localStorage.setItem('managerSelectedMenu', key);
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

// Component quản lý nhân viên
const EmployeeManagement = ({ employees, onAddEmployee, onEditEmployee, onDeleteEmployee }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [form] = Form.useForm();

    const employeeColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
        { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        { title: 'Ngày vào làm', dataIndex: 'joinDate', key: 'joinDate' },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleAdd = () => {
        setEditingEmployee(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        form.setFieldsValue(employee);
        setIsModalVisible(true);
    };

    const handleDelete = (employeeId) => {
        onDeleteEmployee(employeeId);
        message.success('Đã xóa nhân viên thành công!');
    };

    const handleSubmit = (values) => {
        if (editingEmployee) {
            onEditEmployee(editingEmployee.id, values);
            message.success('Cập nhật nhân viên thành công!');
        } else {
            onAddEmployee(values);
            message.success('Thêm nhân viên thành công!');
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div className="employees-content">
            <div className="content-header">
                <h2>Quản lý nhân viên</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm nhân viên
                </Button>
            </div>

            <Table
                dataSource={employees}
                columns={employeeColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            {/* Employee Modal */}
            <Modal
                title={editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên nhân viên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên nhân viên" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="position"
                        label="Chức vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
                    >
                        <Input placeholder="Nhập chức vụ" />
                    </Form.Item>

                    <Form.Item
                        name="department"
                        label="Phòng ban"
                        rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
                    >
                        <Select placeholder="Chọn phòng ban">
                            <Select.Option value="Sales">Sales</Select.Option>
                            <Select.Option value="Warehouse">Warehouse</Select.Option>
                            <Select.Option value="Accounting">Accounting</Select.Option>
                            <Select.Option value="Marketing">Marketing</Select.Option>
                            <Select.Option value="IT">IT</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// Component quản lý thống kê
const StatisticsManagement = ({ statistics }) => {
    return (
        <div className="statistics-content">
            <div className="content-header">
                <h2>Quản lý thống kê</h2>
            </div>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Doanh thu theo tháng" className="stats-card">
                        <div className="chart-placeholder">
                            <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                            <p>Biểu đồ doanh thu theo tháng</p>
                            <p>Dữ liệu: {statistics.monthlyRevenue.map(r => `${(r / 1000000).toFixed(1)}M`).join(', ')}</p>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Đơn hàng theo tháng" className="stats-card">
                        <div className="chart-placeholder">
                            <BarChartOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                            <p>Biểu đồ đơn hàng theo tháng</p>
                            <p>Dữ liệu: {statistics.monthlyOrders.join(', ')}</p>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card title="Top danh mục bán chạy" className="stats-card">
                        <div className="chart-placeholder">
                            <BarChartOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
                            <p>Biểu đồ top danh mục</p>
                            <p>Dữ liệu: {statistics.topCategories.map(c => `${c.name}: ${c.sales}%`).join(', ')}</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Component quản lý khuyến mãi
const PromotionManagement = ({ promotions, onAddPromotion, onEditPromotion, onDeletePromotion }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [form] = Form.useForm();

    const promotionColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên khuyến mãi', dataIndex: 'name', key: 'name' },
        { title: 'Giảm giá', dataIndex: 'discount', key: 'discount', render: (discount) => `${discount}%` },
        { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
        { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleAdd = () => {
        setEditingPromotion(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (promotion) => {
        setEditingPromotion(promotion);
        form.setFieldsValue(promotion);
        setIsModalVisible(true);
    };

    const handleDelete = (promotionId) => {
        onDeletePromotion(promotionId);
        message.success('Đã xóa khuyến mãi thành công!');
    };

    const handleSubmit = (values) => {
        if (editingPromotion) {
            onEditPromotion(editingPromotion.id, values);
            message.success('Cập nhật khuyến mãi thành công!');
        } else {
            onAddPromotion(values);
            message.success('Thêm khuyến mãi thành công!');
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div className="promotions-content">
            <div className="content-header">
                <h2>Quản lý khuyến mãi</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm khuyến mãi
                </Button>
            </div>

            <Table
                dataSource={promotions}
                columns={promotionColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            {/* Promotion Modal */}
            <Modal
                title={editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên khuyến mãi"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi!' }]}
                    >
                        <Input placeholder="Nhập tên khuyến mãi" />
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="Phần trăm giảm giá"
                        rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
                    >
                        <InputNumber
                            placeholder="Nhập phần trăm"
                            style={{ width: '100%' }}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="startDate"
                                label="Ngày bắt đầu"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                            >
                                <Input type="date" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="endDate"
                                label="Ngày kết thúc"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                            >
                                <Input type="date" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Select.Option value="active">Hoạt động</Select.Option>
                            <Select.Option value="inactive">Không hoạt động</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea
                            placeholder="Nhập mô tả khuyến mãi"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingPromotion ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagePage;
