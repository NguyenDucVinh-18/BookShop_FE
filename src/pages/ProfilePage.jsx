import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Upload, Tabs, Avatar, Tag, Card, List, Space, Typography, Divider, Modal, message } from 'antd';
import '../styles/ProfilePage.css';
import { UploadOutlined, ShoppingCartOutlined, ClockCircleOutlined, CarOutlined, CheckCircleOutlined, CloseCircleOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';

const { Text, Title } = Typography;

const PROFILE_KEY = 'userProfile';



// Hàm helper để lấy icon trạng thái đơn hàng
const getStatusIcon = (status) => {
    switch (status) {
        case 'pending':
            return <ClockCircleOutlined style={{ color: '#faad14' }} />;
        case 'processing':
            return <ShoppingCartOutlined style={{ color: '#1890ff' }} />;
        case 'shipping':
            return <CarOutlined style={{ color: '#722ed1' }} />;
        case 'delivered':
            return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        case 'cancelled':
            return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
        default:
            return <ClockCircleOutlined />;
    }
};

// Hàm helper để lấy màu trạng thái đơn hàng
const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'processing':
            return 'processing';
        case 'shipping':
            return 'purple';
        case 'delivered':
            return 'success';
        case 'cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const defaultProfile = {
    username: '',
    email: '',
    phone: '',
    avatar: ''
};

// Lấy đơn hàng từ localStorage và giỏ hàng
const getOrdersFromCart = () => {
    try {
        // Lấy đơn hàng đã đặt từ localStorage
        const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');

        // Lấy giỏ hàng hiện tại từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        let orders = [];

        // Nếu có đơn hàng đã đặt, thêm vào danh sách
        if (allOrders.length > 0) {
            // Xử lý từng đơn hàng để đảm bảo có thông tin khách hàng đúng format
            orders = allOrders.map(order => {
                // Nếu đơn hàng có customerInfo (từ CheckoutPage), sử dụng thông tin đó
                if (order.customerInfo) {
                    return {
                        ...order,
                        customerName: order.customerInfo.fullName || 'Chưa có thông tin',
                        customerPhone: order.customerInfo.phone || 'Chưa có thông tin',
                        customerEmail: order.customerInfo.email || 'Chưa có thông tin',
                        customerAddress: order.customerInfo.address || 'Chưa có thông tin',
                        customerProvince: order.customerInfo.city || 'Chưa có thông tin',
                        customerDistrict: order.customerInfo.district || 'Chưa có thông tin'
                    };
                }
                // Nếu đơn hàng có thông tin trực tiếp (từ logic cũ), giữ nguyên
                return order;
            });
        }

        // Nếu có sản phẩm trong giỏ hàng, tạo đơn hàng tạm thời
        if (cart.length > 0) {
            // Lấy thông tin khách hàng từ profile hiện tại
            const authUser = localStorage.getItem('authUser');
            let customerInfo = {};

            if (authUser) {
                try {
                    const userData = JSON.parse(authUser);
                    customerInfo = {
                        customerName: userData.fullName || 'Chưa có thông tin',
                        customerPhone: userData.phone || 'Chưa có thông tin',
                        customerEmail: userData.email || 'Chưa có thông tin',
                        customerAddress: userData.address || 'Chưa có thông tin'
                    };

                    // Parse địa chỉ để lấy tỉnh/thành phố và quận/huyện
                    if (userData.address) {
                        const addressParts = userData.address.split(',').map(part => part.trim());
                        if (addressParts.length >= 2) {
                            customerInfo.customerProvince = addressParts[addressParts.length - 1] || 'Chưa có thông tin';
                            customerInfo.customerDistrict = addressParts[addressParts.length - 2] || 'Chưa có thông tin';
                        } else {
                            customerInfo.customerProvince = 'Chưa có thông tin';
                            customerInfo.customerDistrict = 'Chưa có thông tin';
                        }
                    } else {
                        customerInfo.customerProvince = 'Chưa có thông tin';
                        customerInfo.customerDistrict = 'Chưa có thông tin';
                    }
                } catch (e) {
                    console.error('Error parsing authUser:', e);
                }
            }

            const currentOrder = {
                id: 'CART_' + Date.now(),
                orderDate: new Date().toISOString().split('T')[0],
                orderTime: new Date().toLocaleTimeString('vi-VN'),
                totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
                status: 'pending',
                statusText: 'Chưa thanh toán',
                items: cart.map(item => ({
                    name: item.name || item.title || 'Sản phẩm',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    image: item.image || item.images?.[0] || 'https://via.placeholder.com/60x80'
                })),
                ...customerInfo
            };

            // Thêm đơn hàng từ giỏ hàng vào đầu danh sách
            orders.unshift(currentOrder);
        }

        // Nếu không có đơn hàng nào, thêm một số đơn hàng mẫu để demo
        if (orders.length === 0) {
            // Lấy thông tin khách hàng từ profile hiện tại cho đơn hàng mẫu
            const authUser = localStorage.getItem('authUser');
            let customerInfo = {};

            if (authUser) {
                try {
                    const userData = JSON.parse(authUser);
                    customerInfo = {
                        customerName: userData.fullName || 'Nguyễn Văn A',
                        customerPhone: userData.phone || '0123456789',
                        customerEmail: userData.email || 'nguyenvana@example.com',
                        customerAddress: userData.address || '123 Đường ABC, Phường 1, Quận 1',
                        customerProvince: 'TP. Hồ Chí Minh',
                        customerDistrict: 'Quận 1'
                    };
                } catch (e) {
                    console.error('Error parsing authUser for sample orders:', e);
                    customerInfo = {
                        customerName: 'Nguyễn Văn A',
                        customerPhone: '0123456789',
                        customerEmail: 'nguyenvana@example.com',
                        customerAddress: '123 Đường ABC, Phường 1, Quận 1',
                        customerProvince: 'TP. Hồ Chí Minh',
                        customerDistrict: 'Quận 1'
                    };
                }
            } else {
                customerInfo = {
                    customerName: 'Nguyễn Văn A',
                    customerPhone: '0123456789',
                    customerEmail: 'nguyenvana@example.com',
                    customerAddress: '123 Đường ABC, Phường 1, Quận 1',
                    customerProvince: 'TP. Hồ Chí Minh',
                    customerDistrict: 'Quận 1'
                };
            }

            const sampleOrders = [
                {
                    id: 'ORD002',
                    orderDate: '2024-01-10',
                    orderTime: '14:30:00',
                    totalAmount: 320000,
                    status: 'processing',
                    statusText: 'Đang xử lý',
                    items: [
                        {
                            name: 'Dụng cụ học tập - bộ thước kẻ',
                            price: 320000,
                            quantity: 1,
                            image: 'https://via.placeholder.com/60x80'
                        }
                    ],
                    customerName: customerInfo.customerName,
                    customerPhone: customerInfo.customerPhone,
                    customerEmail: customerInfo.customerEmail,
                    customerAddress: customerInfo.customerAddress,
                    customerProvince: customerInfo.customerProvince,
                    customerDistrict: customerInfo.customerDistrict
                },
                {
                    id: 'ORD003',
                    orderDate: '2024-01-08',
                    orderTime: '09:15:00',
                    totalAmount: 180000,
                    status: 'shipping',
                    statusText: 'Đang giao',
                    items: [
                        {
                            name: 'Sách giáo khoa Toán 10',
                            price: 180000,
                            quantity: 1,
                            image: 'https://via.placeholder.com/60x80'
                        }
                    ],
                    customerName: customerInfo.customerName,
                    customerPhone: customerInfo.customerPhone,
                    customerEmail: customerInfo.customerEmail,
                    customerAddress: customerInfo.customerAddress,
                    customerProvince: customerInfo.customerProvince,
                    customerDistrict: customerInfo.customerDistrict
                },
                {
                    id: 'ORD004',
                    orderDate: '2024-01-05',
                    orderTime: '16:45:00',
                    totalAmount: 550000,
                    status: 'delivered',
                    statusText: 'Đã giao',
                    items: [
                        {
                            name: 'Bộ sách văn học',
                            price: 350000,
                            quantity: 1,
                            image: 'https://via.placeholder.com/60x80'
                        },
                        {
                            name: 'Vở ghi chép',
                            price: 200000,
                            quantity: 1,
                            image: 'https://via.placeholder.com/60x80'
                        }
                    ],
                    customerName: customerInfo.customerName,
                    customerPhone: customerInfo.customerPhone,
                    customerEmail: customerInfo.customerEmail,
                    customerAddress: customerInfo.customerAddress,
                    customerProvince: customerInfo.customerProvince,
                    customerDistrict: customerInfo.customerDistrict
                },
                {
                    id: 'ORD005',
                    orderDate: '2024-01-03',
                    orderTime: '11:20:00',
                    totalAmount: 280000,
                    status: 'cancelled',
                    statusText: 'Đã hủy',
                    items: [
                        {
                            name: 'Sách tham khảo',
                            price: 280000,
                            quantity: 1,
                            image: 'https://via.placeholder.com/60x80'
                        }
                    ],
                    customerName: customerInfo.customerName,
                    customerPhone: customerInfo.customerPhone,
                    customerEmail: customerInfo.customerEmail,
                    customerAddress: customerInfo.customerAddress,
                    customerProvince: customerInfo.customerProvince,
                    customerDistrict: customerInfo.customerDistrict
                }
            ];

            orders = sampleOrders;
        }

        return orders;
    } catch (error) {
        console.error('Error getting orders:', error);
        return [];
    }
};

// Component hiển thị đơn hàng
const OrderItem = ({ order, onOrderClick }) => {

    return (
        <Card
            style={{ marginBottom: 16, borderRadius: 8, cursor: 'pointer' }}
            bodyStyle={{ padding: 16 }}
            onClick={() => onOrderClick(order)}
            hoverable
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                    <Text strong>Mã đơn hàng: {order.id}</Text>
                    <br />
                    <Text type="secondary">Ngày đặt: {order.orderDate}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Tag color={getStatusColor(order.status)} icon={getStatusIcon(order.status)}>
                        {order.statusText}
                    </Tag>
                    <br />
                    <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                        {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </Text>
                </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <List
                dataSource={order.items}
                renderItem={item => (
                    <List.Item style={{ padding: '8px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: 60, height: 80, objectFit: 'cover', marginRight: 12, borderRadius: 4 }}
                            />
                            <div style={{ flex: 1 }}>
                                <Text strong>{item.name}</Text>
                                <br />
                                <Text type="secondary">
                                    {item.price.toLocaleString('vi-VN')} ₫ x {item.quantity}
                                </Text>
                            </div>
                        </div>
                    </List.Item>
                )}
            />

            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    👆 Click để xem chi tiết đơn hàng
                </Text>
            </div>
        </Card>
    );
};

// Component hiển thị danh sách đơn hàng theo trạng thái
const OrdersTab = () => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);

    useEffect(() => {
        // Lấy đơn hàng mỗi khi component mount hoặc khi cần refresh
        const loadOrders = () => {
            const ordersData = getOrdersFromCart();
            setOrders(ordersData);
        };

        loadOrders();

        // Lắng nghe sự thay đổi của giỏ hàng và đơn hàng để cập nhật
        const handleCartChange = () => {
            loadOrders();
        };

        const handleOrderCreated = () => {
            loadOrders();
        };

        window.addEventListener('storage', handleCartChange);
        window.addEventListener('orderCreated', handleOrderCreated);

        return () => {
            window.removeEventListener('storage', handleCartChange);
            window.removeEventListener('orderCreated', handleOrderCreated);
        };
    }, []);

    const statusOptions = [
        { value: 'all', label: 'Tất cả', count: orders.length },
        { value: 'pending', label: 'Chưa thanh toán', count: orders.filter(o => o.status === 'pending').length },
        { value: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
        { value: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
        { value: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
        { value: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
    ];

    const filteredOrders = selectedStatus === 'all'
        ? orders
        : orders.filter(order => order.status === selectedStatus);

    // Xử lý click vào đơn hàng để hiển thị modal
    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setIsOrderModalVisible(true);
    };

    // Xử lý đóng modal
    const handleCloseOrderModal = () => {
        setIsOrderModalVisible(false);
        setSelectedOrder(null);
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ marginBottom: 16 }}>Theo dõi đơn hàng</Title>
                <Space wrap>
                    {statusOptions.map(option => (
                        <Button
                            key={option.value}
                            type={selectedStatus === option.value ? 'primary' : 'default'}
                            onClick={() => setSelectedStatus(option.value)}
                            style={{ borderRadius: 20 }}
                        >
                            {option.label} ({option.count})
                        </Button>
                    ))}
                </Space>
            </div>

            {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <ShoppingCartOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                    <br />
                    <Text type="secondary">Không có đơn hàng nào</Text>
                </div>
            ) : (
                <div>
                    {filteredOrders.map(order => (
                        <OrderItem
                            key={order.id}
                            order={order}
                            onOrderClick={handleOrderClick}
                        />
                    ))}
                </div>
            )}

            {/* Modal chi tiết đơn hàng */}
            <Modal
                title={
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: 0, color: '#1890ff' }}>📋 Chi tiết đơn hàng</h3>
                    </div>
                }
                open={isOrderModalVisible}
                onCancel={handleCloseOrderModal}
                footer={null}
                width={800}
                centered
            >
                {selectedOrder && (
                    <div style={{ padding: '20px 0' }}>
                        {/* Header đơn hàng */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            border: '1px solid #e9ecef'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                                        Mã đơn hàng: {selectedOrder.id}
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        📅 Ngày đặt: {selectedOrder.orderDate}
                                    </Text>
                                    {selectedOrder.orderTime && (
                                        <>
                                            <br />
                                            <Text type="secondary">
                                                🕐 Giờ đặt: {selectedOrder.orderTime}
                                            </Text>
                                        </>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Tag
                                        color={getStatusColor(selectedOrder.status)}
                                        icon={getStatusIcon(selectedOrder.status)}
                                        style={{ fontSize: '14px', padding: '8px 16px' }}
                                    >
                                        {selectedOrder.statusText}
                                    </Tag>
                                    <br />
                                    <Text strong style={{ fontSize: '20px', color: '#1890ff', marginTop: '8px' }}>
                                        {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
                                    </Text>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin khách hàng */}
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ color: '#1890ff', marginBottom: '16px' }}>
                                👤 Thông tin khách hàng
                            </h4>
                            <div style={{
                                background: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Họ và tên:</Text>
                                        <br />
                                        <Text strong>{selectedOrder.customerName || 'Chưa có thông tin'}</Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Số điện thoại:</Text>
                                        <br />
                                        <Text strong>{selectedOrder.customerPhone || 'Chưa có thông tin'}</Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Email:</Text>
                                        <br />
                                        <Text strong>{selectedOrder.customerEmail || 'Chưa có thông tin'}</Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Địa chỉ:</Text>
                                        <br />
                                        <Text strong>{selectedOrder.customerAddress || 'Chưa có thông tin'}</Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Tỉnh/Thành phố:</Text>
                                        <br />
                                        <Text strong>{selectedOrder.customerProvince || 'Chưa có thông tin'}</Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Quận/Huyện:</Text>
                                        <br />
                                        <Text strong>{selectedOrder.customerDistrict || 'Chưa có thông tin'}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ color: '#1890ff', marginBottom: '16px' }}>
                                🛍️ Sản phẩm đã đặt
                            </h4>
                            <div style={{
                                background: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                {selectedOrder.items.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '16px',
                                            borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #e9ecef' : 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px'
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '80px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                                                {item.name}
                                            </Text>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text type="secondary">
                                                    {item.price.toLocaleString('vi-VN')} ₫ x {item.quantity}
                                                </Text>
                                                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Thông tin giao hàng và thanh toán */}
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ color: '#1890ff', marginBottom: '16px' }}>
                                🚚 Thông tin giao hàng & Thanh toán
                            </h4>
                            <div style={{
                                background: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phương thức giao hàng:</Text>
                                        <br />
                                        <Text strong>
                                            {selectedOrder.shippingInfo?.method === 'express' ? '🚀 Giao hàng nhanh (1-2 ngày)' :
                                                selectedOrder.shippingInfo?.method === 'standard' ? '📦 Giao hàng tiêu chuẩn (2-3 ngày)' :
                                                    'Chưa có thông tin'}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phí giao hàng:</Text>
                                        <br />
                                        <Text strong>
                                            {selectedOrder.shippingInfo?.fee ?
                                                selectedOrder.shippingInfo.fee === 0 ? '🆓 Miễn phí' :
                                                    `${selectedOrder.shippingInfo.fee.toLocaleString('vi-VN')} ₫` :
                                                'Chưa có thông tin'}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phương thức thanh toán:</Text>
                                        <br />
                                        <Text strong>
                                            {selectedOrder.paymentInfo?.method === 'cod' ? '💵 Thanh toán khi nhận hàng (COD)' :
                                                selectedOrder.paymentInfo?.method === 'bank' ? '🏦 Chuyển khoản ngân hàng' :
                                                    selectedOrder.paymentInfo?.method === 'momo' ? '💜 Thanh toán qua MoMo' :
                                                        selectedOrder.paymentInfo?.method === 'vnpay' ? '💙 Thanh toán qua VNPay' :
                                                            'Chưa có thông tin'}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Loại hóa đơn:</Text>
                                        <br />
                                        <Text strong>
                                            {selectedOrder.paymentInfo?.invoiceType === 'personal' ? '👤 Hóa đơn cá nhân' :
                                                selectedOrder.paymentInfo?.invoiceType === 'company' ? '🏢 Hóa đơn công ty' :
                                                    'Chưa có thông tin'}
                                        </Text>
                                    </div>
                                    {selectedOrder.shippingInfo?.estimatedDelivery && (
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Thời gian dự kiến:</Text>
                                            <br />
                                            <Text strong>📅 {selectedOrder.shippingInfo.estimatedDelivery}</Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tóm tắt đơn hàng */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #e9ecef'
                        }}>
                            <h4 style={{ color: '#1890ff', marginBottom: '16px', textAlign: 'center' }}>
                                💰 Tóm tắt đơn hàng
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: '18px' }}>Tổng thanh toán:</Text>
                                <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
                                    {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
                                </Text>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Component quản lý địa chỉ giao hàng
const AddressesTab = () => {
    const [addresses, setAddresses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = () => {
        try {
            const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
            setAddresses(savedAddresses);
        } catch (error) {
            console.error('Error loading addresses:', error);
            setAddresses([]);
        }
    };

    const saveAddresses = (newAddresses) => {
        try {
            localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
            setAddresses(newAddresses);
        } catch (error) {
            console.error('Error saving addresses:', error);
        }
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        form.setFieldsValue(address);
        setIsModalVisible(true);
    };

    const handleDeleteAddress = (addressId) => {
        const newAddresses = addresses.filter(addr => addr.id !== addressId);
        saveAddresses(newAddresses);
        message.success('Đã xóa địa chỉ thành công!');
    };

    const handleSetDefault = (addressId) => {
        const newAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));
        saveAddresses(newAddresses);
        message.success('Đã đặt địa chỉ mặc định!');
    };

    const handleSubmitAddress = (values) => {
        try {
            console.log('Submitting address form with values:', values);

            let newAddresses;

            if (editingAddress) {
                // Cập nhật địa chỉ
                newAddresses = addresses.map(addr =>
                    addr.id === editingAddress.id
                        ? { ...values, id: addr.id, isDefault: addr.isDefault }
                        : addr
                );
                message.success('Đã cập nhật địa chỉ thành công!');

                // Nếu đây là địa chỉ từ thông tin cá nhân, cập nhật profile
                if (editingAddress.note === 'Địa chỉ từ thông tin cá nhân') {
                    console.log('=== UPDATING PROFILE FROM ADDRESS ===');
                    console.log('Updating profile with address:', values);

                    try {
                        // Cập nhật authUser
                        const authUser = localStorage.getItem('authUser');
                        if (authUser) {
                            const currentAuthUser = JSON.parse(authUser);
                            const updatedAuthUser = {
                                ...currentAuthUser,
                                fullName: values.fullName,
                                phone: values.phone,
                                address: values.street
                            };
                            localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
                            console.log('Updated authUser:', updatedAuthUser);

                            // Cập nhật mockUsers
                            const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                            const userIndex = mockUsers.findIndex(u => u.id === currentAuthUser.id);
                            if (userIndex !== -1) {
                                mockUsers[userIndex] = {
                                    ...mockUsers[userIndex],
                                    fullName: values.fullName,
                                    phone: values.phone,
                                    address: values.street
                                };
                                localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                                console.log('Updated mockUsers:', mockUsers);
                            }

                            // Dispatch event để ProfilePage cập nhật
                            window.dispatchEvent(new Event('authUserUpdated'));

                            // Thông báo thành công
                            setTimeout(() => {
                                message.info('Đã cập nhật thông tin cá nhân từ địa chỉ giao hàng!');
                            }, 1000);
                        }
                    } catch (e) {
                        console.error('Error updating profile from address:', e);
                    }
                }
            } else {
                // Thêm địa chỉ mới
                const newAddress = {
                    ...values,
                    id: 'ADDR_' + Date.now(),
                    isDefault: addresses.length === 0 // Địa chỉ đầu tiên sẽ là mặc định
                };
                newAddresses = [...addresses, newAddress];
                message.success('Đã thêm địa chỉ thành công!');
            }

            saveAddresses(newAddresses);
            setIsModalVisible(false);
            form.resetFields();

        } catch (error) {
            console.error('Error saving address:', error);
            message.error('Có lỗi khi lưu địa chỉ!');
        }
    };

    // Lắng nghe sự thay đổi của địa chỉ từ Profile
    useEffect(() => {
        const handleAddressesUpdated = () => {
            console.log('AddressesUpdated event received, reloading addresses...');
            loadAddresses();
        };

        window.addEventListener('addressesUpdated', handleAddressesUpdated);
        return () => window.removeEventListener('addressesUpdated', handleAddressesUpdated);
    }, []);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ marginBottom: 16 }}>Quản lý địa chỉ giao hàng</Title>
                <p style={{ color: '#666', marginBottom: 16 }}>
                    Quản lý các địa chỉ giao hàng của bạn. Địa chỉ mặc định sẽ được tự động chọn khi đặt hàng.
                </p>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddAddress}
                    style={{ marginBottom: 16 }}
                >
                    Thêm địa chỉ mới
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <EnvironmentOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                    <br />
                    <Text type="secondary">Bạn chưa có địa chỉ nào</Text>
                    <br />
                    <Button type="link" onClick={handleAddAddress}>
                        Thêm địa chỉ đầu tiên
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {addresses.map((address) => (
                        <Card
                            key={address.id}
                            style={{
                                border: address.isDefault ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                borderRadius: 8
                            }}
                            bodyStyle={{ padding: 16 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        <Text strong style={{ fontSize: 16, marginRight: 16 }}>
                                            {address.fullName}
                                        </Text>
                                        <Text type="secondary">
                                            {address.phone}
                                        </Text>
                                        {address.isDefault && (
                                            <Tag color="success" style={{ marginLeft: 12 }}>
                                                Mặc định
                                            </Tag>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: 8 }}>
                                        <Text>{address.street}</Text>
                                        <br />
                                        <Text type="secondary">
                                            {address.ward}, {address.district}, {address.province}
                                        </Text>
                                    </div>

                                    {address.note && (
                                        <Text type="secondary" style={{ fontStyle: 'italic' }}>
                                            Ghi chú: {address.note}
                                        </Text>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 16 }}>
                                    {!address.isDefault && (
                                        <Button
                                            size="small"
                                            onClick={() => handleSetDefault(address.id)}
                                        >
                                            Đặt mặc định
                                        </Button>
                                    )}
                                    <Button
                                        size="small"
                                        onClick={() => handleEditAddress(address)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        size="small"
                                        danger
                                        onClick={() => handleDeleteAddress(address.id)}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitAddress}
                >
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item
                            name="fullName"
                            label="Họ và tên người nhận"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="street"
                        label="Số nhà, tên đường"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input placeholder="Ví dụ: 123 Nguyễn Văn Linh" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item
                            name="ward"
                            label="Phường/Xã"
                            rules={[{ required: true, message: 'Vui lòng nhập phường/xã!' }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Ví dụ: Phường 7" />
                        </Form.Item>
                        <Form.Item
                            name="district"
                            label="Quận/Huyện"
                            rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Ví dụ: Quận 8" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="province"
                        label="Tỉnh/Thành phố"
                        rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}
                    >
                        <Input placeholder="Ví dụ: TP. Hồ Chí Minh" />
                    </Form.Item>

                    <Form.Item
                        name="note"
                        label="Ghi chú (không bắt buộc)"
                    >
                        <Input.TextArea
                            placeholder="Ví dụ: Địa chỉ nhà riêng, công ty..."
                            rows={2}
                        />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingAddress ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

const ProfilePage = () => {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [avatarFileList, setAvatarFileList] = useState([]);
    const [profile, setProfile] = useState(defaultProfile);
    const [notification, setNotification] = useState({ type: '', message: '', visible: false });
    const [activeTab, setActiveTab] = useState('info');
    const {user, setUser } = useContext(AuthContext);

    // Hàm hiển thị thông báo
    const showNotification = (type, message) => {
        setNotification({ type, message, visible: true });
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            setNotification({ type: '', message: '', visible: false });
        }, 3000);
    };

    useEffect(() => {
        try {
            // Đọc thông tin từ authUser (người dùng đã đăng nhập)
            const authUser = localStorage.getItem('access_token');
            if (authUser) {
                const userData = user
                // Cập nhật profile state với thông tin người dùng
                const userProfile = {
                    fullName: userData.username || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    avatar: userData.avatarUrl || ''
                };

                setProfile(userProfile);
                form.setFieldsValue(userProfile);

                if (userProfile.avatar) {
                    setAvatarFileList([{ uid: '-1', name: 'avatar', url: userProfile.avatar }]);
                }
            } else {
                console.log('No authUser found, user not logged in');
            }

            // Khôi phục tab hiện tại từ localStorage
            const savedTab = localStorage.getItem('profileActiveTab');
            if (savedTab) {
                setActiveTab(savedTab);
                console.log('Restored active tab:', savedTab);
            }
        } catch (e) {
            console.error('Error loading user profile:', e);
        }
    }, [user, form]);

    // // Lắng nghe sự thay đổi từ AddressesTab
    // useEffect(() => {
    //     const handleAuthUserUpdated = () => {
    //         console.log('AuthUserUpdated event received, reloading profile...');
    //         try {
    //             const authUser = localStorage.getItem('authUser');
    //             if (authUser) {
    //                 const userData = JSON.parse(authUser);
    //                 console.log('Reloading profile from updated authUser:', userData);

    //                 const userProfile = {
    //                     fullName: userData.fullName || '',
    //                     email: userData.email || '',
    //                     phone: userData.phone || '',
    //                     avatar: userData.avatar || ''
    //                 };

    //                 setProfile(userProfile);
    //                 form.setFieldsValue(userProfile);
    //             }
    //         } catch (e) {
    //             console.error('Error reloading profile:', e);
    //         }
    //     };

    //     window.addEventListener('authUserUpdated', handleAuthUserUpdated);
    //     return () => window.removeEventListener('authUserUpdated', handleAuthUserUpdated);
    // }, [form]);

    // Function để xử lý khi người dùng chuyển tab
    const handleTabChange = (activeKey) => {
        console.log('Tab changed to:', activeKey);
        setActiveTab(activeKey);
        localStorage.setItem('profileActiveTab', activeKey);
    };

    const handleAvatarChange = ({ fileList }) => {
        // Giữ tối đa 1 file
        const latest = fileList.slice(-1);

        // Revoke URL cũ nếu là blob
        if (avatarFileList && avatarFileList[0]?.url && avatarFileList[0].url.startsWith('blob:')) {
            try { URL.revokeObjectURL(avatarFileList[0].url); } catch (e) { }
        }

        // Tạo preview URL cho file mới chọn
        if (latest.length > 0) {
            const f = latest[0];
            if (!f.url) {
                if (f.originFileObj) {
                    const previewUrl = URL.createObjectURL(f.originFileObj);
                    f.url = previewUrl;
                }
            }
            setAvatarFileList([f]);
            setProfile(prev => ({ ...prev, avatar: f.url || '' }));
        } else {
            setAvatarFileList([]);
            setProfile(prev => ({ ...prev, avatar: '' }));
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } catch (e) {
                reject(e);
            }
        });
    };

    // Function để parse địa chỉ và tách ra thành các trường riêng biệt
    const parseAddress = (addressString) => {
        if (!addressString) return { street: '', ward: '', district: '', province: '' };

        // Chuẩn hóa địa chỉ
        let address = addressString.trim();

        // Tách địa chỉ theo dấu phẩy
        const parts = address.split(',').map(part => part.trim());

        let street = '';
        let ward = '';
        let district = '';
        let province = '';

        if (parts.length >= 1) {
            street = parts[0]; // Phần đầu tiên là đường/số nhà
        }

        if (parts.length >= 2) {
            // Tìm phường/xã
            const wardPart = parts.find(part =>
                part.toLowerCase().includes('phường') ||
                part.toLowerCase().includes('xã')
            );
            if (wardPart) {
                ward = wardPart;
            }
        }

        if (parts.length >= 3) {
            // Tìm quận/huyện
            const districtPart = parts.find(part =>
                part.toLowerCase().includes('quận') ||
                part.toLowerCase().includes('huyện')
            );
            if (districtPart) {
                district = districtPart;
            }
        }

        // Tìm tỉnh/thành phố
        const provincePart = parts.find(part =>
            part.toLowerCase().includes('tp.') ||
            part.toLowerCase().includes('tp ') ||
            part.toLowerCase().includes('thành phố') ||
            part.toLowerCase().includes('tỉnh')
        );
        if (provincePart) {
            province = provincePart;
        }

        // Fallback nếu không tìm thấy
        if (!province && parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (lastPart.toLowerCase().includes('hồ chí minh') ||
                lastPart.toLowerCase().includes('hcm')) {
                province = 'TP. Hồ Chí Minh';
            }
        }

        return { street, ward, district, province };
    };

    const onSaveProfile = async (values) => {
        console.log('=== FORM SUBMITTED ===');
        console.log('Form submitted with values:', values);
        console.log('Current profile state:', profile);

        try {
            let avatarUrl = profile.avatar;
            if (avatarFileList.length > 0) {
                const f = avatarFileList[0];
                if (f.originFileObj) {
                    // Chuyển ảnh sang Base64 để lưu bền vững (persist qua refresh)
                    avatarUrl = await readFileAsDataURL(f.originFileObj);
                } else if (f.url) {
                    avatarUrl = f.url;
                }
            } else {
                avatarUrl = '';
            }

            const payload = { ...profile, ...values, avatar: avatarUrl };
            console.log('Final payload:', payload);

            // Cập nhật cả userProfile và authUser
            localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

            // Cập nhật authUser với thông tin mới
            const authUser = localStorage.getItem('authUser');
            if (authUser) {
                const currentAuthUser = JSON.parse(authUser);
                const updatedAuthUser = { ...currentAuthUser, ...payload };
                localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
                console.log('Updated authUser with new profile data:', updatedAuthUser);

                // Thông báo cho các component khác biết authUser đã thay đổi (realtime)
                window.dispatchEvent(new Event('authUserUpdated'));

                // Cập nhật mockUsers để logic đăng nhập hoạt động đúng
                try {
                    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                    const userIndex = mockUsers.findIndex(u => u.id === currentAuthUser.id);

                    if (userIndex !== -1) {
                        // Cập nhật thông tin user trong mockUsers (giữ nguyên password)
                        mockUsers[userIndex] = {
                            ...mockUsers[userIndex],
                            fullName: payload.fullName,
                            email: payload.email,
                            phone: payload.phone,
                            address: payload.address,
                            avatar: payload.avatar
                        };

                        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                        console.log('Updated mockUsers with new profile data:', mockUsers);
                    }
                } catch (e) {
                    console.error('Error updating mockUsers:', e);
                }

                // Tự động cập nhật hoặc tạo địa chỉ giao hàng từ thông tin cá nhân
                if (payload.fullName && payload.address) {
                    try {
                        console.log('=== AUTO-UPDATING/CREATING ADDRESS ===');
                        console.log('fullName:', payload.fullName);
                        console.log('address:', payload.address);

                        const existingAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
                        console.log('Existing addresses:', existingAddresses);

                        // Tìm địa chỉ hiện có từ thông tin cá nhân (dựa vào fullName)
                        const existingPersonalAddress = existingAddresses.find(addr =>
                            addr.note === 'Địa chỉ từ thông tin cá nhân'
                        );

                        console.log('Existing personal address:', existingPersonalAddress);

                        if (existingPersonalAddress) {
                            // CẬP NHẬT địa chỉ hiện có
                            console.log('Updating existing personal address...');

                            // Parse địa chỉ để tách ra các trường riêng biệt
                            const parsedAddress = parseAddress(payload.address);
                            console.log('Parsed address:', parsedAddress);

                            const updatedAddresses = existingAddresses.map(addr =>
                                addr.id === existingPersonalAddress.id
                                    ? {
                                        ...addr,
                                        fullName: payload.fullName,
                                        phone: payload.phone || '',
                                        street: parsedAddress.street,
                                        ward: parsedAddress.ward,
                                        district: parsedAddress.district,
                                        province: parsedAddress.province,
                                        updatedAt: new Date().toISOString()
                                    }
                                    : addr
                            );

                            localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
                            console.log('Updated personal address:', updatedAddresses.find(addr => addr.id === existingPersonalAddress.id));
                            console.log('Updated addresses list:', updatedAddresses);

                            // Dispatch event để AddressesTab cập nhật
                            window.dispatchEvent(new Event('addressesUpdated'));

                            // Thông báo thành công
                            setTimeout(() => {
                                showNotification('info', 'Đã cập nhật địa chỉ giao hàng từ thông tin cá nhân!');
                            }, 1000);

                        } else {
                            // Tạo địa chỉ mới nếu chưa có
                            console.log('Creating new personal address...');

                            // Parse địa chỉ để tách ra các trường riêng biệt
                            const parsedAddress = parseAddress(payload.address);
                            console.log('Parsed address for new address:', parsedAddress);

                            const newAddress = {
                                id: 'ADDR_' + Date.now(),
                                fullName: payload.fullName,
                                phone: payload.phone || '',
                                street: parsedAddress.street,
                                ward: parsedAddress.ward || 'Phường mặc định',
                                district: parsedAddress.district || 'Quận mặc định',
                                province: parsedAddress.province || 'TP. Hồ Chí Minh',
                                note: 'Địa chỉ từ thông tin cá nhân',
                                isDefault: existingAddresses.length === 0,
                                createdAt: new Date().toISOString()
                            };

                            // Thêm vào danh sách địa chỉ
                            const updatedAddresses = [newAddress, ...existingAddresses];
                            localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));

                            console.log('Auto-created address:', newAddress);
                            console.log('Updated addresses list:', updatedAddresses);

                            // Dispatch event để AddressesTab cập nhật
                            window.dispatchEvent(new Event('addressesUpdated'));

                            // Thông báo thành công
                            setTimeout(() => {
                                showNotification('info', 'Đã tự động tạo địa chỉ giao hàng từ thông tin cá nhân!');
                            }, 1000);
                        }
                    } catch (e) {
                        console.error('Error updating/creating auto-address:', e);
                    }
                } else {
                    console.log('Missing required fields for auto-address creation:');
                    console.log('fullName:', payload.fullName);
                    console.log('address:', payload.address);
                }
            }

            setProfile(payload);

            // Hiển thị thông báo thành công
            showNotification('success', 'Đã lưu hồ sơ thành công!');

            // Thông báo chi tiết những gì đã thay đổi
            const changes = [];
            if (profile.fullName !== payload.fullName) changes.push('Họ và tên');
            if (profile.email !== payload.email) changes.push('Email');
            if (profile.phone !== payload.phone) changes.push('Số điện thoại');
            if (profile.address !== payload.address) changes.push('Địa chỉ');
            if (profile.avatar !== payload.avatar) changes.push('Ảnh đại diện');

            if (changes.length > 0) {
                setTimeout(() => {
                    showNotification('info', `Đã cập nhật: ${changes.join(', ')}`);
                }, 500);
            }

        } catch (error) {
            console.error('Error saving profile:', error);
            showNotification('error', 'Có lỗi khi lưu hồ sơ. Vui lòng thử lại!');
        }
    };

    // Thêm function để test form validation
    const onSaveProfileFailed = (errorInfo) => {
        console.log('=== FORM VALIDATION FAILED ===');
        console.log('Form validation failed:', errorInfo);
        showNotification('error', 'Vui lòng kiểm tra lại thông tin!');
    };

    const onChangePassword = async (values) => {
        try {
            console.log('=== CHANGE PASSWORD ===');
            console.log('Password change values:', values);

            // Kiểm tra mật khẩu xác nhận
            if (values.newPassword !== values.confirmPassword) {
                // Hiển thị lỗi dưới field xác nhận mật khẩu
                passwordForm.setFields([
                    {
                        name: 'confirmPassword',
                        errors: ['Mật khẩu xác nhận không trùng khớp']
                    }
                ]);
                return;
            }

            // Không cho phép mật khẩu mới trùng với mật khẩu hiện tại
            if (values.newPassword === values.currentPassword) {
                passwordForm.setFields([
                    {
                        name: 'newPassword',
                        errors: ['Mật khẩu mới phải khác mật khẩu hiện tại']
                    }
                ]);
                return;
            }

            // Lấy thông tin user hiện tại
            const authUser = localStorage.getItem('authUser');
            if (!authUser) {
                showNotification('error', 'Không tìm thấy thông tin người dùng');
                return;
            }

            const currentAuthUser = JSON.parse(authUser);
            console.log('Current auth user:', currentAuthUser);

            // KIỂM TRA MẬT KHẨU HIỆN TẠI CÓ ĐÚNG KHÔNG
            try {
                const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                const currentUser = mockUsers.find(u => u.id === currentAuthUser.id);

                if (!currentUser) {
                    showNotification('error', 'Không tìm thấy thông tin người dùng trong hệ thống');
                    return;
                }

                // Kiểm tra mật khẩu hiện tại có đúng không
                if (currentUser.password !== values.currentPassword) {
                    // Hiển thị lỗi dưới field mật khẩu hiện tại
                    passwordForm.setFields([
                        {
                            name: 'currentPassword',
                            errors: ['Mật khẩu hiện tại không đúng!']
                        }
                    ]);
                    return;
                }

                console.log('Current password verified successfully');

                // Nếu mật khẩu hiện tại đúng, mới cho phép đổi
                const userIndex = mockUsers.findIndex(u => u.id === currentAuthUser.id);

                if (userIndex !== -1) {
                    // Cập nhật mật khẩu trong mockUsers
                    mockUsers[userIndex] = {
                        ...mockUsers[userIndex],
                        password: values.newPassword
                    };

                    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                    console.log('Updated mockUsers with new password:', mockUsers);

                    // Cập nhật authUser (không cần lưu password vào authUser vì không dùng để đăng nhập)
                    const updatedAuthUser = { ...currentAuthUser };
                    localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));

                    // Reset form
                    passwordForm.resetFields();

                    // Hiển thị thông báo thành công
                    showNotification('success', 'Đổi mật khẩu thành công!');

                    // Thông báo chi tiết
                    setTimeout(() => {
                        showNotification('info', 'Bây giờ bạn có thể đăng nhập với mật khẩu mới');
                    }, 500);

                } else {
                    showNotification('error', 'Không tìm thấy thông tin người dùng trong hệ thống');
                }
            } catch (e) {
                console.error('Error updating password:', e);
                showNotification('error', 'Lỗi khi cập nhật mật khẩu');
            }

        } catch (e) {
            console.error('Error in change password:', e);
            showNotification('error', 'Lỗi khi đổi mật khẩu');
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <h1>Hồ sơ của tôi</h1>

                {/* Notification System */}
                {notification.visible && (
                    <div
                        className={`notification ${notification.type}`}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            padding: '16px 24px',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 'bold',
                            zIndex: 9999,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            backgroundColor: notification.type === 'success' ? '#52c41a' :
                                notification.type === 'error' ? '#ff4d4f' : '#1890ff'
                        }}
                    >
                        {notification.message}
                    </div>
                )}

                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={[
                        {
                            key: 'info',
                            label: 'Thông tin cá nhân',
                            children: (
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onSaveProfile}
                                    onFinishFailed={onSaveProfileFailed}
                                    validateTrigger="onBlur"
                                >
                                    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                        <div style={{ minWidth: 200, textAlign: 'center' }}>
                                            <Avatar size={120} src={avatarFileList[0]?.url} style={{ marginBottom: 12 }} />
                                            <Form.Item label="Ảnh đại diện" style={{ marginBottom: 0 }}>
                                                <Upload
                                                    listType="picture-card"
                                                    maxCount={1}
                                                    beforeUpload={() => false}
                                                    fileList={avatarFileList}
                                                    onChange={handleAvatarChange}
                                                >
                                                    <div>
                                                        <UploadOutlined />
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                </Upload>
                                            </Form.Item>
                                        </div>

                                        <div style={{ flex: 1, minWidth: 280 }}>
                                            <Form.Item
                                                name="fullName"
                                                label="Họ và tên"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                            >
                                                <Input placeholder="Nhập họ tên" />
                                            </Form.Item>
                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                                            >
                                                <Input placeholder="Nhập email" readOnly />
                                            </Form.Item>
                                            <Form.Item name="phone" label="Số điện thoại">
                                                <Input placeholder="Nhập số điện thoại" />
                                            </Form.Item>

                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="profile-save-btn"
                                                    onClick={() => {
                                                        console.log('=== BUTTON CLICKED ===');
                                                        console.log('Button clicked!');
                                                        console.log('Form values:', form.getFieldsValue());
                                                        console.log('Form is valid:', form.isFieldsValidating());
                                                    }}
                                                >
                                                    Lưu thay đổi
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Form>
                            )
                        },
                        {
                            key: 'password',
                            label: 'Đổi mật khẩu',
                            children: (
                                <Form form={passwordForm} layout="vertical" onFinish={onChangePassword} style={{ maxWidth: 420 }}>
                                    <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}>
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}>
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" rules={[{ required: true, message: 'Xác nhận mật khẩu' }]}>
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Đổi mật khẩu</Button>
                                    </Form.Item>
                                </Form>
                            )
                        },
                        {
                            key: 'orders',
                            label: 'Đơn hàng của tôi',
                            children: <OrdersTab />
                        },
                        {
                            key: 'addresses',
                            label: 'Địa chỉ giao hàng',
                            children: <AddressesTab />
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default ProfilePage;


