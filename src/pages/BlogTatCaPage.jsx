import React, { useState, useEffect } from 'react';
import { Input, Button, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAllBooks } from '../data/books';
import '../styles/BlogTatCaPage.css';

const BlogTatCaPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(6);
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);

    useEffect(() => {
        // Lấy tất cả sách từ các danh mục blog
        const books = getAllBooks();
        const blogBooks = books.filter(book =>
            ['sach-moi', 'sach-ban-chay', 'sach-ki-nang-song', 'sach-thieu-nhi', 'sach-kinh-doanh', 'sach-van-hoc'].includes(book.category)
        );
        setAllBooks(blogBooks);
        setFilteredBooks(blogBooks);
        // Sửa: set latestPosts sau khi allBooks đã được set
        setLatestPosts(getRandomLatestPosts(blogBooks)); // Truyền blogBooks vào function
        window.scrollTo(0, 0);
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = () => {
        if (searchQuery.trim()) {
            const filtered = allBooks.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBooks(filtered);
            setCurrentPage(1);
        } else {
            setFilteredBooks(allBooks);
            setCurrentPage(1);
        }
    };

    // Xử lý Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Sửa: Lấy 5 bài viết ngẫu nhiên cho sidebar
    const getRandomLatestPosts = (books = allBooks) => {
        const shuffled = [...books].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };

    // Tính toán sách cho trang hiện tại
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    // Auto scroll to top when page changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    return (
        <div className="category-page">
            <div className="blog-container">
                {/* Breadcrumb */}
                <div className="cp-breadcrumb">
                    <Link to="/">Trang chủ</Link> / Blog - Tất cả
                </div>

                {/* Page Header */}
                <div className="cp-header">
                    <h1 className="cp-title">Blog - Tất cả</h1>
                    <p className="cp-description">
                        Khám phá tất cả bài viết từ các danh mục sách đa dạng của HIEUVINHbook.
                        Từ sách mới, sách bán chạy đến sách kĩ năng sống, thiếu nhi, kinh doanh và văn học.
                    </p>
                </div>

                <div className="blog-page-content">
                    {/* Main Content - Left Column */}
                    <div className="cp-main">
                        {/* Search Bar */}
                        <div className="cp-search">
                            <Input
                                placeholder="Tìm kiếm bài viết..."
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
                                    <Link to={`/blogs/${book.category}/${book.id}`} className="cp-book-link">
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
                                    onChange={(page) => {
                                        setCurrentPage(page);
                                        window.scrollTo(0, 0);
                                    }}
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
                            <div className="blog-sidebar-title">Danh mục</div>
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
                            <div className="blog-sidebar-title">Bài viết mới nhất</div>
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

export default BlogTatCaPage;