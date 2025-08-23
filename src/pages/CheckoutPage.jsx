import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Radio, Select, Divider } from 'antd';
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

    // Update shipping fee when shipping method changes
    useEffect(() => {
        if (shippingMethod === 'express') {
            setShippingFee(30000);
        } else {
            setShippingFee(0);
        }
    }, [shippingMethod]);

    // Load cart data from localStorage and handle redirect
    useEffect(() => {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (parsedCart.items && parsedCart.items.length > 0) {
                    setCartItems(parsedCart.items);
                    setCartNotes(parsedCart.notes || '');
                    setIsCartLoaded(true);
                } else {
                    // Cart is empty, redirect to home
                    navigate('/');
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                navigate('/');
            }
        } else {
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

        // Here you would typically send the order to your backend
        // For now, we'll just show an alert
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sách tại MINH LONG BOOK.');

        // Clear cart and redirect to home
        localStorage.removeItem('shoppingCart');
        navigate('/');
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
                        {/* Login Prompt */}
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
                                    rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
                                >
                                    <Select placeholder="Chọn quận/huyện" className="form-input">
                                        <Option value="district1">Quận 1</Option>
                                        <Option value="district2">Quận 2</Option>
                                        <Option value="district3">Quận 3</Option>
                                        <Option value="district4">Quận 4</Option>
                                        <Option value="district5">Quận 5</Option>
                                    </Select>
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
            </div>
        </div>
    );
};

export default CheckoutPage;
