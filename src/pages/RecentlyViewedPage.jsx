import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecentlyViewed.css';

const RecentlyViewedPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    // Calculate pagination
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

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
                    {currentItems.length === 0 && <div className="recent-empty">Chưa có sản phẩm đã xem</div>}
                    {currentItems.map((p) => (
                        <div key={p.id} className="recent-page-card" onClick={() => navigate(`/product/${p.id}`)}>
                            <div className="recent-page-image"><img src={p.image} alt={p.title} /></div>
                            <div className="recent-page-info">
                                <div className="recent-page-title-item">{p.title}</div>
                                <div className="recent-page-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="recent-pagination">
                        <div className="pagination-info">
                            Hiển thị {startIndex + 1}-{Math.min(endIndex, items.length)} trong tổng số {items.length} sản phẩm
                        </div>

                        <div className="pagination-controls">
                            <button
                                className="page-btn prev-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Trước
                            </button>

                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    className={`page-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                                    disabled={page === '...'}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="page-btn next-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentlyViewedPage;
