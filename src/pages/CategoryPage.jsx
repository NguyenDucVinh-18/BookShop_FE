import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Input, Button, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../styles/CategoryPage.css';

// Import book data
import {
    newBooks,
    topSellingBooks,
    lifeSkillsBooks,
    childrenBooks,
    businessBooks,
    literatureBooks
} from '../data/books';

const CategoryPage = () => {
    const { category } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const booksPerPage = 6;

    // Map category parameter to book data
    const getCategoryBooks = () => {
        switch (category) {
            case 'sach-moi':
                return newBooks;
            case 'sach-ban-chay':
                return topSellingBooks;
            case 'sach-ki-nang-song':
                return lifeSkillsBooks;
            case 'sach-thieu-nhi':
                return childrenBooks;
            case 'sach-kinh-doanh':
                return businessBooks;
            case 'sach-van-hoc':
                return literatureBooks;
            default:
                return newBooks;
        }
    };

    // Get all books from all categories for random selection
    const getAllBooks = () => {
        return [
            ...newBooks,
            ...topSellingBooks,
            ...lifeSkillsBooks,
            ...childrenBooks,
            ...businessBooks,
            ...literatureBooks
        ];
    };

    // Function to get random posts for sidebar
    const getRandomLatestPosts = () => {
        const allBooks = getAllBooks();
        // Thêm category vào mỗi book để biết nó thuộc danh mục nào
        const booksWithCategory = allBooks.map(book => {
            // Xác định category dựa trên ID range
            if (book.id >= 1 && book.id <= 8) {
                return { ...book, category: 'sach-moi' };
            } else if (book.id >= 101 && book.id <= 108) {
                return { ...book, category: 'sach-ban-chay' };
            } else if (book.id >= 201 && book.id <= 208) {
                return { ...book, category: 'sach-ki-nang-song' };
            } else if (book.id >= 301 && book.id <= 308) {
                return { ...book, category: 'sach-thieu-nhi' };
            } else if (book.id >= 401 && book.id <= 408) {
                return { ...book, category: 'sach-kinh-doanh' };
            } else if (book.id >= 501 && book.id <= 508) {
                return { ...book, category: 'sach-van-hoc' };
            }
            return { ...book, category: 'sach-moi' }; // fallback
        });

        const shuffled = [...booksWithCategory].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };

    // Get category title
    const getCategoryTitle = () => {
        switch (category) {
            case 'sach-moi':
                return 'Sách mới';
            case 'sach-ban-chay':
                return 'Sách bán chạy';
            case 'sach-ki-nang-song':
                return 'Sách kĩ năng sống';
            case 'sach-thieu-nhi':
                return 'Sách thiếu nhi';
            case 'sach-kinh-doanh':
                return 'Sách kinh doanh';
            case 'sach-van-hoc':
                return 'Sách văn học';
            default:
                return 'Sách mới';
        }
    };

    // Get category description
    const getCategoryDescription = () => {
        switch (category) {
            case 'sach-moi':
                return 'Khám phá những cuốn sách mới nhất, hot nhất từ HIEUVINHbook';
            case 'sach-ban-chay':
                return 'Những cuốn sách được độc giả yêu thích và mua nhiều nhất';
            case 'sach-ki-nang-song':
                return 'Sách giúp phát triển kỹ năng sống, tư duy tích cực';
            case 'sach-thieu-nhi':
                return 'Sách giáo dục, giải trí dành cho trẻ em mọi lứa tuổi';
            case 'sach-kinh-doanh':
                return 'Sách về kinh doanh, marketing, quản lý và khởi nghiệp';
            case 'sach-van-hoc':
                return 'Sách văn học Việt Nam và thế giới, truyện ngắn, tiểu thuyết';
            default:
                return 'Khám phá những cuốn sách mới nhất, hot nhất từ HIEUVINHbook';
        }
    };

    useEffect(() => {
        const books = getCategoryBooks();
        if (searchQuery.trim()) {
            const filtered = books.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBooks(filtered);
        } else {
            setFilteredBooks(books);
        }
        setCurrentPage(1);

        // Refresh latest posts when category changes
        setLatestPosts(getRandomLatestPosts());

        // Auto scroll to top when page loads or changes
        window.scrollTo(0, 0);
    }, [category, searchQuery]);

    // Auto scroll to top when page changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const handleSearch = () => {
        // Search is handled by useEffect
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Calculate pagination
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    return (
        <div className="category-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="cp-breadcrumb">
                    <Link to="/">Trang chủ</Link> / Blog - {getCategoryTitle()}
                </div>

                {/* Page Header */}
                <div className="cp-header">
                    <h1 className="cp-title">{getCategoryTitle()}</h1>
                    <p className="cp-description">{getCategoryDescription()}</p>
                </div>

                <div className="cp-layout">
                    {/* Main Content - Left Column */}
                    <div className="cp-main">
                        {/* Search Bar */}
                        <div className="cp-search">
                            <Input
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="cp-search-input"
                            />
                            <Button type="primary" onClick={handleSearch} className="cp-search-btn">
                                <SearchOutlined />
                                Tìm kiếm
                            </Button>
                        </div>

                        {/* Books Grid */}
                        <div className="cp-books-grid">
                            {currentBooks.map((book) => (
                                <div key={book.id} className="cp-book-card">
                                    <Link to={`/blogs/${category}/${book.id}`} className="cp-book-link">
                                        <div className="cp-book-image">
                                            <img src={book.image} alt={book.title} />
                                        </div>
                                        <div className="cp-book-info">
                                            <h3 className="cp-book-title">{book.title}</h3>
                                            <p className="cp-book-author">Đăng bởi: {book.author}</p>
                                            <p className="cp-book-excerpt">
                                                {book.title} là một cuốn sách hay và bổ ích, được viết bởi {book.author}.
                                                Với những hình ảnh sinh động, màu sắc tươi sáng, sách giúp độc giả học hỏi một cách
                                                tự nhiên và thú vị.
                                            </p>
                                            <div className="cp-book-meta">
                                                <span className="cp-comments">0 Bình luận</span>
                                                <span className="cp-date">16/08/2025</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="cp-pagination">
                                <Pagination
                                    current={currentPage}
                                    total={filteredBooks.length}
                                    pageSize={booksPerPage}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Right Column */}
                    <aside className="cp-sidebar">
                        {/* Categories */}
                        <div className="cp-sidebar-card">
                            <div className="cp-sidebar-title">Danh mục</div>
                            <ul className="cp-categories">
                                <li><Link to="/category/sach-moi">Sách mới</Link></li>
                                <li><Link to="/category/sach-ban-chay">Sách bán chạy</Link></li>
                                <li><Link to="/category/sach-ki-nang-song">Sách kĩ năng sống</Link></li>
                                <li><Link to="/category/sach-thieu-nhi">Sách thiếu nhi</Link></li>
                                <li><Link to="/category/sach-kinh-doanh">Sách kinh doanh</Link></li>
                                <li><Link to="/category/sach-van-hoc">Sách văn học</Link></li>
                            </ul>
                        </div>

                        {/* Latest Posts */}
                        <div className="cp-sidebar-card">
                            <div className="cp-sidebar-title">Bài viết mới nhất</div>
                            <div className="cp-latest-posts">
                                {latestPosts.map((book) => (
                                    <div key={book.id} className="cp-latest-post">
                                        <Link to={`/blogs/${book.category}/${book.id}`} className="cp-latest-link">
                                            <div className="cp-latest-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="cp-latest-info">
                                                <h4 className="cp-latest-title">{book.title}</h4>
                                                <span className="cp-latest-date">16/08/2025</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
