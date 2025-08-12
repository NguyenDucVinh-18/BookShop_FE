import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecentlyViewed.css';

const RecentlyViewedPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    // Load items from localStorage and listen for changes
    useEffect(() => {
        const loadItems = () => {
            try {
                const raw = localStorage.getItem('recentlyViewed');
                const parsed = raw ? JSON.parse(raw) : [];
                setItems(Array.isArray(parsed) ? parsed : []);
            } catch {
                setItems([]);
            }
        };

        // Load initially
        loadItems();

        // Listen for storage changes (when localStorage is modified from other tabs/windows)
        const handleStorageChange = (e) => {
            if (e.key === 'recentlyViewed') {
                loadItems();
            }
        };

        // Listen for custom event when localStorage is cleared from Header
        const handleLocalStorageCleared = () => {
            loadItems();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageCleared', handleLocalStorageCleared);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageCleared', handleLocalStorageCleared);
        };
    }, []);

    return (
        <div className="recent-page">
            <div className="container">
                <div className="breadcrumbs">
                    <span className="breadcrumb-item" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Trang chủ</span>
                    <span className="breadcrumb-separator"> &gt; </span>
                    <span className="breadcrumb-item active">Sản phẩm đã xem</span>
                </div>

                <h1 className="recent-page-title">Sản phẩm đã xem</h1>

                <div className="recent-page-grid">
                    {items.length === 0 && <div className="recent-empty">Chưa có sản phẩm đã xem</div>}
                    {items.map((p) => (
                        <div key={p.id} className="recent-page-card" onClick={() => navigate(`/product/${p.id}`)}>
                            <div className="recent-page-image"><img src={p.image} alt={p.title} /></div>
                            <div className="recent-page-info">
                                <div className="recent-page-title-item">{p.title}</div>
                                <div className="recent-page-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewedPage;
