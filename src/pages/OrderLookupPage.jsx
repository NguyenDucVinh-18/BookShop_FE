import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Input, Button, Tag, Empty, Collapse, Descriptions, message, Spin } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/OrderLookupPage.css';

const OrderLookupPage = () => {
    const [method, setMethod] = useState('phone');
    const [value, setValue] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [inputError, setInputError] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const [notFoundError, setNotFoundError] = useState('');

    const mockOrders = useMemo(() => ([
        {
            orderId: 'MLB2408001',
            date: '2025-08-20 14:12',
            status: 'Đang vận chuyển',
            total: 560000,
            phone: '0966160925',
            email: 'khachhang@example.com',
            items: [
                { id: 1, title: 'Kỹ năng giao tiếp', qty: 1, price: 180000 },
                { id: 2, title: 'Truyện Kiều', qty: 2, price: 190000 }
            ],
            shipping: {
                name: 'Nguyễn Văn A',
                address: '12 Nguyễn Trãi, Q.1, TP.HCM',
                method: 'COD',
            }
        },
        {
            orderId: 'MLB2408002',
            date: '2025-08-18 09:45',
            status: 'Đã giao',
            total: 320000,
            phone: '0989849396',
            email: 'customer@domain.com',
            items: [
                { id: 3, title: 'Marketing hiện đại', qty: 1, price: 280000 },
                { id: 4, title: 'Vở tập viết chữ đẹp', qty: 2, price: 20000 }
            ],
            shipping: {
                name: 'Trần Thị B',
                address: '45 Lê Lợi, Q.Hải Châu, Đà Nẵng',
                method: 'Chuyển khoản',
            }
        },
        {
            orderId: 'MLB2408003',
            date: '2025-08-10 10:20',
            status: 'Đang xử lý',
            total: 150000,
            phone: '0909000000',
            email: 'email@domain.com',
            items: [
                { id: 5, title: 'Truyện cổ tích Việt Nam', qty: 1, price: 120000 },
                { id: 6, title: 'Bút viết bộ màu', qty: 1, price: 30000 }
            ],
            shipping: {
                name: 'Lê Văn C',
                address: '99 Trần Hưng Đạo, Q.Ninh Kiều, Cần Thơ',
                method: 'COD',
            }
        }
    ]), []);

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const validate = () => {
        let isValid = true;
        setInputError('');
        setCaptchaError('');
        setNotFoundError('');

        if (!captchaToken) {
            setCaptchaError('Vui lòng xác nhận bạn không phải robot.');
            isValid = false;
        }

        const trimmed = value.trim();
        if (method === 'phone') {
            if (!trimmed) {
                setInputError('Vui lòng nhập số điện thoại.');
                isValid = false;
            } else if (/@/.test(trimmed)) {
                setInputError('Bạn đang chọn Số điện thoại. Hãy chuyển sang Email hoặc nhập số hợp lệ.');
                isValid = false;
            } else {
                const phoneRegex = /^(0|\+84)(\d){9}$/; // 10 số bắt đầu 0 hoặc +84
                if (!phoneRegex.test(trimmed)) {
                    setInputError('Số điện thoại không hợp lệ. Ví dụ: 0966160925 hoặc +84966160925');
                    isValid = false;
                }
            }
        } else {
            if (!trimmed) {
                setInputError('Vui lòng nhập email.');
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!emailRegex.test(trimmed)) {
                    setInputError('Email không hợp lệ.');
                    isValid = false;
                }
            }
        }

        return isValid;
    };

    const handleLookup = () => {
        if (!validate()) return;
        setIsLoading(true);
        setResults([]);

        // Giả lập gọi API
        setTimeout(() => {
            const trimmed = value.trim();
            const found = mockOrders.filter((o) => method === 'phone' ? (o.phone === trimmed || o.phone.replace('+84', '0') === trimmed) : o.email.toLowerCase() === trimmed.toLowerCase());
            setResults(found);
            setIsLoading(false);
            if (found.length === 0) {
                setNotFoundError('Không tìm thấy đơn hàng phù hợp với thông tin bạn nhập.');
            } else {
                setNotFoundError('');
            }
        }, 600);
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Đã giao':
                return 'green';
            case 'Đang vận chuyển':
                return 'blue';
            case 'Đang xử lý':
                return 'gold';
            default:
                return 'default';
        }
    };

    return (
        <div className="order-lookup-page">
            <div className="container">
                <div className="ol-breadcrumb"><Link to="/">Trang chủ</Link> / Tra cứu đơn hàng</div>

                <h1 className="ol-title">Tra cứu đơn hàng</h1>

                <div className="ol-layout">
                    <div className="ol-main">
                        <div className="ol-card">
                            <div className="ol-card-title">Kiểm tra đơn hàng của bạn</div>
                            <div className="ol-captcha">
                                <ReCAPTCHA
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={(token) => setCaptchaToken(token || '')}
                                />
                                {captchaError && <div className="ol-error" role="alert">{captchaError}</div>}
                            </div>

                            <div className="ol-form">
                                <div className="ol-form-row">
                                    <span className="ol-label">Phương thức kiểm tra</span>
                                    <Radio.Group
                                        onChange={(e) => setMethod(e.target.value)}
                                        value={method}
                                        className="ol-radio-group"
                                    >
                                        <Radio value="phone">Số điện thoại</Radio>
                                        <Radio value="email">Email</Radio>
                                    </Radio.Group>
                                </div>

                                <div className="ol-form-row">
                                    <span className="ol-label">{method === 'phone' ? 'Số điện thoại:' : 'Email:'}</span>
                                    <Input
                                        placeholder={method === 'phone' ? '0909 xxx xxx' : 'email@domain.com'}
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="ol-input"
                                        status={inputError ? 'error' : ''}
                                    />
                                    {inputError && <div className="ol-error" role="alert">{inputError}</div>}
                                </div>

                                <div className="ol-help">
                                    Nếu quý khách có bất kỳ thắc mắc nào, xin vui lòng gọi <strong>08 7300 1920</strong>
                                </div>

                                <div className="ol-actions">
                                    <Button type="primary" onClick={handleLookup} disabled={isLoading}>
                                        {isLoading ? 'Đang tìm...' : 'Xem ngay'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="ol-results">
                            {isLoading ? (
                                <div className="ol-loading">
                                    <Spin />
                                </div>
                            ) : results && results.length > 0 ? (
                                results.map((o) => (
                                    <div className="ol-result-card" key={o.orderId}>
                                        <div className="ol-result-header">
                                            <div className="ol-order-id">Mã đơn: <strong>{o.orderId}</strong></div>
                                            <Tag color={statusColor(o.status)}>{o.status}</Tag>
                                        </div>
                                        <div className="ol-result-meta">
                                            <div>Ngày đặt: {o.date}</div>
                                            <div>Tổng tiền: <strong>{formatCurrency(o.total)}</strong></div>
                                        </div>

                                        <Collapse ghost className="ol-collapse">
                                            <Collapse.Panel header={`Xem ${o.items.length} sản phẩm`} key="items">
                                                <div className="ol-items">
                                                    {o.items.map((it) => (
                                                        <div className="ol-item" key={it.id}>
                                                            <div className="ol-item-title">{it.title}</div>
                                                            <div className="ol-item-meta">SL: {it.qty} × {formatCurrency(it.price)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Descriptions column={1} size="small" className="ol-descriptions">
                                                    <Descriptions.Item label="Người nhận">{o.shipping.name}</Descriptions.Item>
                                                    <Descriptions.Item label="Địa chỉ">{o.shipping.address}</Descriptions.Item>
                                                    <Descriptions.Item label="Thanh toán">{o.shipping.method}</Descriptions.Item>
                                                </Descriptions>
                                            </Collapse.Panel>
                                        </Collapse>
                                    </div>
                                ))
                            ) : notFoundError ? (
                                <Empty description={notFoundError} />
                            ) : (
                                <Empty description="Nhập số điện thoại hoặc email để tra cứu đơn hàng" />
                            )}
                        </div>
                    </div>

                    <aside className="ol-sidebar">
                        <div className="ol-sidebar-card">
                            <div className="ol-sidebar-title">Danh mục</div>
                            <ul className="ol-categories">
                                <li><Link to="/category/sach-moi">Sách mới</Link></li>
                                <li><Link to="/category/sach-ban-chay">Sách bán chạy</Link></li>
                                <li><Link to="/category/sach-ki-nang-song">Sách kĩ năng sống</Link></li>
                                <li><Link to="/category/sach-thieu-nhi">Sách thiếu nhi</Link></li>
                                <li><Link to="/category/sach-kinh-doanh">Sách kinh doanh</Link></li>
                                <li><Link to="/category/sach-van-hoc">Sách văn học</Link></li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default OrderLookupPage;


