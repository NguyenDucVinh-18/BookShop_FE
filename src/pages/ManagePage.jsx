import React, { useContext, useState } from 'react';
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
    PlusOutlined,
    FileTextOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';

import CommonDashboard from '../components/admin/CommonDashboard';
import CommonProductManagement from '../components/admin/CommonProductManagement';
import CommonCustomerManagement from '../components/admin/CommonCustomerManagement';
import CommonNotificationManagement from '../components/admin/CommonNotificationManagement';
import CommonSettings from '../components/admin/CommonSettings';
import '../styles/AdminPage.css';

import EmployeeManagement from '../components/admin/EmployeeManagement';
import { AuthContext } from '../components/context/auth.context';
import CommonOrderManagement from '../components/admin/CommonOrderManagement';
import CommonCategoryManagement from '../components/admin/CommonCategoryManagement';

const { Sider, Content } = Layout;


const ManagePage = () => {
      const { user, setUser } = useContext(AuthContext);
    const [selectedKey, setSelectedKey] = useState(() => {
        // Lấy trạng thái menu từ localStorage khi khởi tạo
        const savedMenu = localStorage.getItem('managerSelectedMenu');
        return savedMenu || 'dashboard';
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
            key: 'orders',
            icon: <FileTextOutlined />,
            label: 'Quản lý hóa đơn'
        },
        {
            key: 'products',
            icon: <BookOutlined />,
            label: 'Quản lý sản phẩm'
        },
        {
            key: 'categories',
            icon: <AppstoreAddOutlined  />,
            label: 'Quản lý danh mục'
        },
        {
            key: 'customers',
            icon: <UserOutlined />,
            label: 'Quản lý khách hàng'
        },
        {
            key: 'employees',
            icon: <TeamOutlined />,
            label: 'Quản lý nhân viên'
        },
        {
            key: 'notifications',
            icon: <BellOutlined />,
            label: 'Quản lý thông báo'
        },
        {
            key: 'promotions',
            icon: <GiftOutlined />,
            label: 'Quản lý khuyến mãi'
        },
        {
            key: 'statistics',
            icon: <BarChartOutlined />,
            label: 'Quản lý thống kê'
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
                    <CommonDashboard/>
                );
            case 'orders':
                return (
                    <CommonOrderManagement/>
                );
            case 'products':
                return (
                    <CommonProductManagement/>
                );
            case 'categories':
                return (
                    <CommonCategoryManagement/>
                );
            case 'customers':
                return (
                    <CommonCustomerManagement/>
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
                return <EmployeeManagement/>;
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
                return <CommonDashboard />;
        }
    };

    return (
        <Layout className="admin-layout">
            <Sider width={280} className="admin-sider">
                <div className="admin-logo">
                    <h2>MINH LONG MANAGE</h2>
                    <h2>{user.username}</h2>
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
