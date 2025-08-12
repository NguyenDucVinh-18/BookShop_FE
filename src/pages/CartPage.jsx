import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, ShoppingOutlined, CreditCardOutlined } from '@ant-design/icons';
import '../styles/CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [cartNotes, setCartNotes] = useState('');

    // Load cart data from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart.items || []);
                setCartNotes(parsedCart.notes || '');
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Auto scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Save cart data to localStorage whenever it changes
    useEffect(() => {
        if (cartItems.length > 0 || cartNotes.trim() !== '') {
            const cartData = {
                items: cartItems,
                notes: cartNotes
            };
            localStorage.setItem('shoppingCart', JSON.stringify(cartData));
        } else {
            localStorage.removeItem('shoppingCart');
        }
    }, [cartItems, cartNotes]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
        } else {
            setCartItems(prev => prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const handleRemoveFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
        setCartNotes('');
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleCheckout = () => {
        // TODO: Implement checkout logic
        console.log('Proceeding to checkout...');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="cart-empty">
                        <ShoppingOutlined className="cart-empty-icon" />
                        <h2>Giỏ hàng trống</h2>
                        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1 className="cart-title">Giỏ Hàng</h1>

                {/* Product Table */}
                <div className="cart-table">
                    <div className="cart-table-header">
                        <div className="cart-header-cell">Sản phẩm</div>
                        <div className="cart-header-cell">Mô Tả</div>
                        <div className="cart-header-cell">Giá</div>
                        <div className="cart-header-cell">Số Lượng</div>
                        <div className="cart-header-cell">Tổng</div>
                        <div className="cart-header-cell">Xóa</div>
                    </div>

                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-table-row">
                            <div className="cart-product-cell">
                                <img src={item.image} alt={item.title} className="cart-product-image" />
                            </div>
                            <div className="cart-description-cell">
                                <p>Sách: {item.title}</p>
                                <p>Tác giả: {item.author}</p>
                            </div>
                            <div className="cart-price-cell">
                                {formatPrice(item.price)}
                            </div>
                            <div className="cart-quantity-cell">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    min="1"
                                    className="cart-quantity-input"
                                />
                            </div>
                            <div className="cart-total-cell">
                                {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="cart-delete-cell">
                                <button
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="cart-delete-btn"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notes Section */}
                <div className="cart-notes">
                    <label>Chú Thích:</label>
                    <textarea
                        value={cartNotes}
                        onChange={(e) => setCartNotes(e.target.value)}
                        placeholder="Ghi chú cho đơn hàng..."
                        className="cart-notes-textarea"
                    />
                </div>

                {/* Cart Summary */}
                <div className="cart-summary">
                    <div className="cart-total">
                        <strong>Tổng {formatPrice(calculateTotal())}</strong>
                    </div>

                    <div className="cart-actions">
                        <button className="cart-action-btn cart-continue-btn" onClick={handleContinueShopping}>
                            TIẾP TỤC MUA HÀNG
                        </button>
                        <button className="cart-action-btn cart-checkout-btn" onClick={handleCheckout}>
                            THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
