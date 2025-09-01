import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Radio, Select, Divider, Modal } from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    TruckOutlined,
    CreditCardOutlined,
    QrcodeOutlined,
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    ArrowRightOutlined,
    TagOutlined,
    RightOutlined
} from '@ant-design/icons';
import '../styles/CheckoutPage.css';

const { Option } = Select;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [cartItems, setCartItems] = useState([]);
    const [cartNotes, setCartNotes] = useState('');
    const [isCartLoaded, setIsCartLoaded] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [discountCode, setDiscountCode] = useState('');
    const [shippingFee, setShippingFee] = useState(0);
    const [invoiceType, setInvoiceType] = useState('personal');
    const [appliedDiscount, setAppliedDiscount] = useState(null);

    // Thêm state cho thông tin người dùng và địa chỉ
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressSelector, setShowAddressSelector] = useState(false);

    // Update shipping fee when shipping method changes
    useEffect(() => {
        if (shippingMethod === 'express') {
            setShippingFee(30000);
        } else {
            setShippingFee(0);
        }
    }, [shippingMethod]);

    // Kiểm tra đăng nhập và load thông tin người dùng
    useEffect(() => {
        const checkAuthStatus = () => {
            const authUser = localStorage.getItem('authUser');
            if (authUser) {
                const user = JSON.parse(authUser);
                setIsLoggedIn(true);

                // Load thông tin profile
                const profile = localStorage.getItem('userProfile');
                if (profile) {
                    const userProfileData = JSON.parse(profile);
                    setUserProfile(userProfileData);

                    // Tự động điền form với thông tin profile
                    form.setFieldsValue({
                        fullName: userProfileData.fullName || user.name,
                        email: userProfileData.email || user.email,
                        phone: userProfileData.phone || '',
                        address: userProfileData.address || '',
                        city: userProfileData.city || '',
                        district: userProfileData.district || ''
                    });
                } else {
                    // Nếu không có profile, sử dụng thông tin từ authUser
                    form.setFieldsValue({
                        fullName: user.fullName || user.name,
                        email: user.email,
                        phone: user.phone || '',
                        address: user.address || '',
                        city: user.city || '',
                        district: user.district || ''
                    });
                }

                // Load danh sách địa chỉ
                const addresses = localStorage.getItem('userAddresses');
                if (addresses) {
                    const userAddressesData = JSON.parse(addresses);
                    setUserAddresses(userAddressesData);

                    // Tìm địa chỉ mặc định
                    const defaultAddress = userAddressesData.find(addr => addr.isDefault);
                    if (defaultAddress) {
                        setSelectedAddress(defaultAddress);
                        // Tự động điền địa chỉ mặc định
                        form.setFieldsValue({
                            address: defaultAddress.street || defaultAddress.address || '',
                            city: defaultAddress.province || '',
                            district: defaultAddress.district || ''
                        });
                    }
                }
            } else {
                setIsLoggedIn(false);
                setUserProfile(null);
                setUserAddresses([]);
                setSelectedAddress(null);
            }
        };

        // Kiểm tra ngay khi component mount
        checkAuthStatus();

        // Lắng nghe sự thay đổi từ localStorage
        const handleStorageChange = () => {
            checkAuthStatus();
        };

        // Lắng nghe event khi user đăng nhập/đăng xuất
        const handleAuthChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authUserUpdated', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authUserUpdated', handleAuthChange);
        };
    }, [form]);

    // Load cart data from localStorage and handle redirect
    useEffect(() => {
        console.log('CheckoutPage - Loading data...');

        // First try to load checkoutItems (for direct purchase)
        const checkoutItems = localStorage.getItem('checkoutItems');
        console.log('CheckoutPage - checkoutItems from localStorage:', checkoutItems);

        if (checkoutItems) {
            try {
                const parsedItems = JSON.parse(checkoutItems);
                console.log('CheckoutPage - Parsed checkoutItems:', parsedItems);

                if (Array.isArray(parsedItems) && parsedItems.length > 0) {
                    console.log('CheckoutPage - Setting cartItems from checkoutItems');
                    setCartItems(parsedItems);
                    setIsCartLoaded(true);
                    // Clear checkoutItems after loading to prevent re-use
                    localStorage.removeItem('checkoutItems');
                    return; // Exit early if checkoutItems are loaded
                }
            } catch (error) {
                console.error('Error loading checkout items:', error);
            }
        }

        // If no checkoutItems, try to load cartItems (for cart checkout)
        const savedCart = localStorage.getItem('shoppingCart');
        console.log('CheckoutPage - cartItems from localStorage:', savedCart);

        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                console.log('CheckoutPage - Parsed cartItems:', parsedCart);

                if (parsedCart.items && parsedCart.items.length > 0) {
                    console.log('CheckoutPage - Setting cartItems from cartItems');
                    setCartItems(parsedCart.items);
                    setCartNotes(parsedCart.notes || '');
                    setIsCartLoaded(true);
                } else {
                    console.log('CheckoutPage - Cart is empty, redirecting to home');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                navigate('/');
            }
        } else {
            console.log('CheckoutPage - No cart data, redirecting to home');
            console.log('CheckoutPage - Final check - localStorage keys:', Object.keys(localStorage));
            console.log('CheckoutPage - Final check - checkoutItems:', localStorage.getItem('checkoutItems'));
            console.log('CheckoutPage - Final check - cartItems:', localStorage.getItem('cartItems'));
            // No cart data, redirect to home
            navigate('/');
        }
    }, [navigate]);

    // Auto scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        let total = calculateSubtotal() + shippingFee;

        // Apply discount if available
        if (appliedDiscount) {
            total = total - (total * appliedDiscount.percentage / 100);
        }

        return total;
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
        } else {
            const updatedCartItems = cartItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            setCartItems(updatedCartItems);

            // Update localStorage
            localStorage.setItem('shoppingCart', JSON.stringify({
                items: updatedCartItems,
                notes: cartNotes
            }));

            // Emit custom event to notify Header component about cart update
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    const handleRemoveFromCart = (productId) => {
        setCartItems(prev => {
            const updatedCart = prev.filter(item => item.id !== productId);

            // Update localStorage
            if (updatedCart.length > 0) {
                localStorage.setItem('shoppingCart', JSON.stringify({
                    items: updatedCart,
                    notes: cartNotes
                }));
            } else {
                localStorage.removeItem('shoppingCart');
            }

            // Emit custom event to notify Header component about cart update
            window.dispatchEvent(new Event('cartUpdated'));

            return updatedCart;
        });
    };

    const handlePlaceOrder = (values) => {
        // Get final notes from form
        const finalNotes = values.note || cartNotes;

        console.log('Order placed with values:', values);
        console.log('Cart items:', cartItems);
        console.log('Final notes:', finalNotes);
        console.log('Shipping method:', shippingMethod);
        console.log('Payment method:', paymentMethod);
        console.log('Invoice type:', invoiceType);
        console.log('Applied discount:', appliedDiscount);

        try {
            // Tạo đơn hàng mới
            const newOrder = {
                id: 'ORD_' + Date.now(),
                orderDate: new Date().toISOString().split('T')[0],
                orderTime: new Date().toLocaleTimeString('vi-VN'),
                status: 'processing', // Đang xử lý
                statusText: 'Đang xử lý',
                customerInfo: {
                    fullName: values.fullName,
                    phone: values.phone,
                    email: values.email,
                    address: values.address,
                    city: values.city,
                    district: values.district
                },
                shippingInfo: {
                    method: shippingMethod,
                    fee: shippingFee,
                    estimatedDelivery: shippingMethod === 'express' ? '1-2 ngày làm việc' : '2-3 ngày làm việc'
                },
                paymentInfo: {
                    method: paymentMethod,
                    invoiceType: invoiceType
                },
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.title || item.name || 'Sản phẩm',
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || item.images?.[0] || 'https://via.placeholder.com/60x80',
                    total: item.price * item.quantity
                })),
                subtotal: calculateSubtotal(),
                shippingFee: shippingFee,
                discount: appliedDiscount ? {
                    code: discountCode,
                    percentage: appliedDiscount.percentage,
                    amount: appliedDiscount.percentage > 0 ? (calculateSubtotal() * appliedDiscount.percentage / 100) : 0
                } : null,
                totalAmount: calculateTotal(),
                notes: finalNotes,
                createdAt: new Date().toISOString()
            };

            // Lưu đơn hàng vào localStorage
            const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            existingOrders.unshift(newOrder); // Thêm đơn hàng mới vào đầu
            localStorage.setItem('userOrders', JSON.stringify(existingOrders));

            // Lưu đơn hàng vào danh sách tất cả đơn hàng (để ProfilePage hiển thị)
            const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
            allOrders.unshift(newOrder);
            localStorage.setItem('allOrders', JSON.stringify(allOrders));

            // Dispatch event để ProfilePage cập nhật
            window.dispatchEvent(new Event('orderCreated'));

            // Hiển thị thông báo thành công
            alert(`Đặt hàng thành công! 
            
Mã đơn hàng: ${newOrder.id}
Tổng tiền: ${formatPrice(newOrder.totalAmount)}
Trạng thái: ${newOrder.statusText}

Cảm ơn bạn đã mua sách tại MINH LONG BOOK!`);

            // Clear cart và redirect về trang chủ
            localStorage.removeItem('shoppingCart');
            localStorage.removeItem('cart'); // Xóa cả cart cũ nếu có

            // Dispatch event để Header cập nhật số lượng giỏ hàng
            window.dispatchEvent(new Event('cartUpdated'));

            navigate('/');

        } catch (error) {
            console.error('Error creating order:', error);
            alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
        }
    };

    // Xử lý chọn địa chỉ từ danh sách đã lưu
    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setShowAddressSelector(false);

        // Tự động điền form với đầy đủ thông tin từ địa chỉ được chọn
        form.setFieldsValue({
            fullName: address.fullName || '',
            phone: address.phone || '',
            address: address.street || address.address || '',
            city: address.province || '',
            district: address.district || ''
        });

        console.log('Selected address applied to form:', address);
        console.log('Form fields updated with:', {
            fullName: address.fullName,
            phone: address.phone,
            address: address.street || address.address,
            city: address.province,
            district: address.district
        });
    };

    // Xử lý sử dụng thông tin profile
    const handleUseProfileInfo = () => {
        if (userProfile) {
            form.setFieldsValue({
                fullName: userProfile.fullName || '',
                email: userProfile.email || '',
                phone: userProfile.phone || '',
                address: userProfile.address || '',
                city: userProfile.city || '',
                district: userProfile.district || ''
            });
        }
    };

    // Xử lý sử dụng địa chỉ mặc định
    const handleUseDefaultAddress = () => {
        const defaultAddress = userAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
            console.log('Using default address:', defaultAddress);
            handleSelectAddress(defaultAddress);
        }
    };

    const handleApplyDiscount = () => {
        if (discountCode.trim()) {
            // Mock discount validation - in real app, this would call backend
            const mockDiscounts = {
                'SAVE10': { percentage: 10, description: 'Giảm 10%' },
                'SAVE20': { percentage: 20, description: 'Giảm 20%' },
                'FREESHIP': { percentage: 0, description: 'Miễn phí vận chuyển' }
            };

            const discount = mockDiscounts[discountCode.toUpperCase()];
            if (discount) {
                setAppliedDiscount(discount);
                alert(`Áp dụng thành công: ${discount.description}`);
                setDiscountCode('');
            } else {
                alert('Mã khuyến mãi không hợp lệ!');
            }
        } else {
            alert('Vui lòng nhập mã khuyến mãi!');
        }
    };

    // Show loading state while cart is being loaded
    if (!isCartLoaded) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="checkout-header">
                        <h1>MINH LONG BOOK</h1>
                    </div>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Đang tải thông tin giỏ hàng...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                {/* Header */}
                <div className="checkout-header">
                    <h1>MINH LONG BOOK</h1>
                </div>

                <div className="checkout-content">
                    {/* Left Column - Forms */}
                    <div className="checkout-left">
                        {/* User Info Section - Hiển thị khi đã đăng nhập */}
                        {isLoggedIn ? (
                            <div className="user-info-section">
                                <div className="user-info-header">
                                    <h4>👋 Xin chào, {userProfile?.fullName || 'Người dùng'}!</h4>
                                    <p>Bạn có thể sử dụng thông tin đã lưu hoặc tùy chỉnh theo ý muốn</p>
                                </div>

                                <div className="user-actions">
                                    <Button
                                        type="primary"
                                        className="profile-btn"
                                        onClick={handleUseProfileInfo}
                                    >
                                        📋 Sử dụng thông tin cá nhân
                                    </Button>

                                    {userAddresses.length > 0 && (
                                        <Button
                                            type="default"
                                            className="address-btn"
                                            onClick={handleUseDefaultAddress}
                                        >
                                            🏠 Sử dụng địa chỉ mặc định
                                        </Button>
                                    )}

                                    {userAddresses.length > 0 && (
                                        <Button
                                            type="default"
                                            className="select-address-btn"
                                            onClick={() => setShowAddressSelector(true)}
                                        >
                                            📍 Chọn địa chỉ khác
                                        </Button>
                                    )}
                                </div>

                                {selectedAddress && (
                                    <div className="selected-address-info">
                                        <h5>📍 Địa chỉ đang sử dụng:</h5>
                                        <div className="address-card">
                                            <p><strong>{selectedAddress.fullName}</strong> - {selectedAddress.phone}</p>
                                            <p>{selectedAddress.street || selectedAddress.address}</p>
                                            <p>{selectedAddress.province}, {selectedAddress.district}</p>
                                            {selectedAddress.isDefault && (
                                                <span className="default-badge">Mặc định</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="login-prompt">
                                <p>Đăng nhập để mua hàng tiện lợi và nhận nhiều ưu đãi hơn nữa</p>
                                <Button
                                    type="primary"
                                    className="login-btn"
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                        )}

                        {/* Shipping Information Form */}
                        <div className="form-section">
                            <h3>Thông tin giao hàng</h3>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handlePlaceOrder}
                            >
                                <div className="form-row">
                                    <Form.Item
                                        name="fullName"
                                        label="Họ và tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                        className="form-item"
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Nhập họ và tên"
                                            className="form-input"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                        className="form-item"
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="Nhập số điện thoại"
                                            className="form-input"
                                        />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="Nhập email"
                                        className="form-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Địa chỉ giao hàng"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
                                >
                                    <Input
                                        prefix={<EnvironmentOutlined />}
                                        placeholder="Nhập địa chỉ giao hàng"
                                        className="form-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="city"
                                    label="Tỉnh/Thành phố"
                                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                                >
                                    <Select placeholder="Chọn tỉnh/thành phố" className="form-input">
                                        <Option value="hanoi">Hà Nội</Option>
                                        <Option value="hcm">TP. Hồ Chí Minh</Option>
                                        <Option value="danang">Đà Nẵng</Option>
                                        <Option value="haiphong">Hải Phòng</Option>
                                        <Option value="cantho">Cần Thơ</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="district"
                                    label="Quận/Huyện"
                                    rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
                                >
                                    <Input
                                        prefix={<EnvironmentOutlined />}
                                        placeholder="Nhập quận/huyện (ví dụ: Quận 1, Quận Tân Bình, Huyện Củ Chi...)"
                                        className="form-input"
                                    />

                                </Form.Item>

                                <Form.Item
                                    name="note"
                                    label="Ghi chú"
                                >
                                    <Input.TextArea
                                        placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                                        rows={3}
                                        className="form-input"
                                        value={cartNotes}
                                        onChange={(e) => {
                                            setCartNotes(e.target.value);
                                            // Update localStorage with new notes
                                            localStorage.setItem('shoppingCart', JSON.stringify({
                                                items: cartItems,
                                                notes: e.target.value
                                            }));
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        </div>

                        {/* Cart Notes Display */}
                        {cartNotes && (
                            <div className="form-section">
                                <h3>Ghi chú từ giỏ hàng</h3>
                                <div className="cart-notes-display">
                                    <p><strong>Ghi chú hiện tại:</strong> {cartNotes}</p>
                                    <p className="notes-hint">Bạn có thể chỉnh sửa ghi chú ở form bên trên</p>
                                </div>
                            </div>
                        )}

                        {/* Shipping Method */}
                        <div className="form-section">
                            <h3>Phương thức giao hàng</h3>
                            <Radio.Group
                                value={shippingMethod}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                className="shipping-methods"
                            >
                                <Radio value="standard" className="shipping-option">
                                    <div className="shipping-option-content">
                                        <div className="shipping-icon">
                                            <TruckOutlined />
                                        </div>
                                        <div className="shipping-details">
                                            <div className="shipping-name">Giao hàng tiêu chuẩn</div>
                                            <div className="shipping-description">Giao hàng trong 2-3 ngày làm việc</div>
                                            <div className="shipping-price">Miễn phí</div>
                                        </div>
                                    </div>
                                </Radio>
                                <Radio value="express" className="shipping-option">
                                    <div className="shipping-option-content">
                                        <div className="shipping-icon">
                                            <TruckOutlined />
                                        </div>
                                        <div className="shipping-details">
                                            <div className="shipping-name">Giao hàng nhanh</div>
                                            <div className="shipping-description">Giao hàng trong 1-2 ngày làm việc</div>
                                            <div className="shipping-price">30.000 ₫</div>
                                        </div>
                                    </div>
                                </Radio>
                            </Radio.Group>
                        </div>

                        {/* Payment Method */}
                        <div className="form-section">
                            <h3>Phương thức thanh toán</h3>
                            <Radio.Group
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="payment-methods"
                            >
                                <Radio value="cod" className="payment-option">
                                    <div className="payment-option-content">
                                        <div className="payment-icon">
                                            <CreditCardOutlined />
                                        </div>
                                        <div className="payment-details">
                                            <div className="payment-name">Thanh toán khi nhận hàng (COD)</div>
                                            <div className="payment-description">Thanh toán bằng tiền mặt khi nhận hàng</div>
                                        </div>
                                    </div>
                                </Radio>
                                <Radio value="bank" className="payment-option">
                                    <div className="payment-option-content">
                                        <div className="payment-icon">
                                            <CreditCardOutlined />
                                        </div>
                                        <div className="payment-details">
                                            <div className="payment-name">Chuyển khoản ngân hàng</div>
                                            <div className="payment-description">Chuyển khoản trực tiếp vào tài khoản ngân hàng</div>
                                        </div>
                                    </div>
                                </Radio>
                                <Radio value="momo" className="payment-option">
                                    <div className="payment-option-content">
                                        <div className="payment-icon">
                                            <QrcodeOutlined />
                                        </div>
                                        <div className="payment-details">
                                            <div className="payment-name">Ví MoMo</div>
                                            <div className="payment-description">Thanh toán qua ví điện tử MoMo</div>
                                        </div>
                                    </div>
                                </Radio>
                            </Radio.Group>
                        </div>

                        {/* Invoice Section */}
                        <div className="form-section">
                            <h3>Xuất hóa đơn</h3>
                            <div className="invoice-section">
                                <div className="invoice-option">
                                    <Radio
                                        value="personal"
                                        checked={invoiceType === 'personal'}
                                        onChange={(e) => setInvoiceType(e.target.value)}
                                    >
                                        Cá nhân
                                    </Radio>
                                </div>
                                <div className="invoice-option">
                                    <Radio
                                        value="company"
                                        checked={invoiceType === 'company'}
                                        onChange={(e) => setInvoiceType(e.target.value)}
                                    >
                                        Công ty
                                    </Radio>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Right Column - Cart Summary */}
                    <div className="checkout-right">
                        {/* Cart Section */}
                        <div className="cart-section">
                            <h3>Giỏ hàng</h3>
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-image">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <div className="cart-item-details">
                                            <div className="cart-item-title">{item.title}</div>
                                            <div className="cart-item-category">Default Title</div>
                                            <div className="cart-item-price">{formatPrice(item.price)}</div>
                                        </div>
                                        <div className="cart-item-quantity">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="quantity-btn"
                                                >
                                                    <MinusOutlined />
                                                </button>
                                                <span className="quantity-display">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="quantity-btn"
                                                >
                                                    <PlusOutlined />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.id)}
                                            className="remove-item-btn"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Discount Code Section */}
                        <div className="discount-section">
                            <h3>Mã khuyến mãi</h3>
                            <div className="discount-input">
                                <div className="discount-select">
                                    <TagOutlined />
                                    <span>Chọn mã</span>
                                    <RightOutlined />
                                </div>
                                <Input
                                    placeholder="Nhập mã khuyến mãi"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className="discount-input-field"
                                />
                                <Button
                                    onClick={handleApplyDiscount}
                                    className="apply-discount-btn"
                                >
                                    Áp dụng
                                </Button>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="order-summary-section">
                            <h3>Tóm tắt đơn hàng</h3>
                            <div className="order-summary">
                                <div className="summary-row">
                                    <span>Tổng tiền hàng:</span>
                                    <span>{formatPrice(calculateSubtotal())}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span>{shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí'}</span>
                                </div>
                                {appliedDiscount && (
                                    <div className="summary-row">
                                        <span>Giảm giá:</span>
                                        <span style={{ color: '#52c41a' }}>
                                            {appliedDiscount.percentage > 0
                                                ? `-${appliedDiscount.percentage}%`
                                                : appliedDiscount.description
                                            }
                                        </span>
                                    </div>
                                )}
                                <div className="summary-row total-row">
                                    <span>Tổng thanh toán:</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => form.submit()}
                                className="place-order-btn"
                                icon={<ArrowRightOutlined />}
                            >
                                Đặt hàng
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Modal chọn địa chỉ */}
                <Modal
                    title="Chọn địa chỉ giao hàng"
                    open={showAddressSelector}
                    onCancel={() => setShowAddressSelector(false)}
                    footer={null}
                    width={600}
                >
                    <div className="address-selector">
                        {userAddresses.length > 0 ? (
                            <div className="address-list">
                                {userAddresses.map((address, index) => (
                                    <div
                                        key={index}
                                        className={`address-item ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectAddress(address)}
                                    >
                                        <div className="address-content">
                                            <div className="address-header">
                                                <h5>{address.fullName}</h5>
                                                <span className="phone">{address.phone}</span>
                                                {address.isDefault && (
                                                    <span className="default-badge">Mặc định</span>
                                                )}
                                            </div>
                                            <p className="address-detail">{address.street || address.address}</p>
                                            <p className="address-location">{address.province}, {address.district}</p>
                                            {address.note && (
                                                <p className="address-note">📝 {address.note}</p>
                                            )}
                                        </div>
                                        <div className="address-actions">
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectAddress(address);
                                                }}
                                            >
                                                Chọn
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-addresses">
                                <p>Bạn chưa có địa chỉ nào được lưu.</p>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setShowAddressSelector(false);
                                        navigate('/profile');
                                    }}
                                >
                                    Thêm địa chỉ mới
                                </Button>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default CheckoutPage;
