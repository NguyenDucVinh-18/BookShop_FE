import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag } from 'antd';
import { UserOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons';
import '../styles/BlogPostPage.css';

// Import book data for sidebar
import {
    newBooks,
    topSellingBooks,
    lifeSkillsBooks,
    childrenBooks,
    businessBooks,
    literatureBooks
} from '../data/books';

const BlogPostPage = () => {
    const { category, slug } = useParams();
    const [latestPosts, setLatestPosts] = useState([]);

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

    // Get article data based on category and slug
    const getArticleData = () => {
        switch (category) {
            case 'sach-moi':
                return {
                    title: 'KHÁM PHÁ NHỮNG CUỐN SÁCH MỚI NHẤT TỪ MINHLONGbook',
                    author: 'KDOL Tâm Anh',
                    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
                    overlayText: 'KHÁM PHÁ NHỮNG CUỐN SÁCH MỚI NHẤT',
                    overlaySubtext: 'MINHLONGbook',
                    content: [
                        'MINHLONGbook tự hào giới thiệu đến độc giả những cuốn sách mới nhất, hot nhất trong tháng này.',
                        'Với sự đa dạng về thể loại và nội dung, chúng tôi cam kết mang đến những trải nghiệm đọc sách tuyệt vời.',
                        'Từ những cuốn sách bestseller đến những tác phẩm mới xuất bản, tất cả đều được chọn lọc kỹ lưỡng.',
                        'Hãy cùng khám phá những cuốn sách mới này để cập nhật kiến thức và mở rộng tầm nhìn.'
                    ],
                    productId: slug, // ID 1-8 cho sách mới
                    productTitle: 'Sách mới ' + slug,
                    productImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop'
                };
            case 'sach-ban-chay':
                return {
                    title: 'TOP 10 CUỐN SÁCH BÁN CHẠY NHẤT THÁNG',
                    author: 'KDOL Tâm Anh',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
                    overlayText: 'TOP 10 CUỐN SÁCH BÁN CHẠY',
                    overlaySubtext: 'MINHLONGbook',
                    content: [
                        'Những cuốn sách bán chạy nhất tháng này đã được độc giả yêu thích và đánh giá cao.',
                        'Từ những tác phẩm văn học kinh điển đến những cuốn sách self-help hiện đại, tất cả đều mang lại giá trị thiết thực.',
                        'Sự thành công của những cuốn sách này không chỉ đến từ nội dung chất lượng mà còn từ cách truyền tải thông điệp một cách gần gũi.',
                        'Hãy cùng khám phá những cuốn sách bán chạy này để hiểu tại sao chúng được yêu thích đến vậy.'
                    ],
                    productId: slug, // ID 101-108 cho sách bán chạy (sử dụng slug trực tiếp)
                    productTitle: 'Sách bán chạy ' + slug,
                    productImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
                };
            case 'sach-ki-nang-song':
                return {
                    title: 'HỌC CÁCH KIÊN TRÌ RÈN LUYỆN TÍNH KỶ LUẬT QUA TÁC GIẢ MURAKAMI',
                    author: 'KDOL Tâm Anh',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
                    overlayText: 'HỌC CÁCH KIÊN TRÌ RÈN LUYỆN TÍNH KỶ LUẬT QUA TÁC GIẢ',
                    overlaySubtext: 'MURAKAMI',
                    content: [
                        'Sở dĩ nhà văn nổi tiếng Haruki Murakami có thể duy trì danh tiếng lâu dài trên văn đàn thế giới, gây nên "cơn sốt Murakami", nguyên nhân sâu xa phía sau chính là thói quen sống lành mạnh suốt nhiều năm.',
                        'Trong suốt 40 năm qua, ông đã viết 14 tiểu thuyết, nhiều truyện ngắn và tiểu luận. Để có thể duy trì năng suất sáng tác cao như vậy, Murakami đã xây dựng cho mình một lối sống có kỷ luật và kiên trì.',
                        'Thói quen viết lách: Ông thường viết vào buổi sáng sớm, thức dậy lúc 4 giờ sáng, chưa từng dùng đồng hồ báo thức, đánh răng rửa mặt, ăn sáng, sau đó bắt tay vào công việc.',
                        'Thói quen tập thể dục: Murakami chạy bộ mỗi ngày, tham gia marathon và triathlon. Ông tin rằng việc rèn luyện thể chất giúp tăng cường sức mạnh tinh thần và khả năng tập trung.',
                        'Kỷ luật trong cuộc sống: Ông luôn tuân thủ lịch trình hàng ngày một cách nghiêm ngặt, từ giờ giấc ăn uống, ngủ nghỉ đến thời gian làm việc. Điều này giúp ông duy trì năng lượng và sự sáng tạo liên tục.',
                        'Kiên trì theo đuổi mục tiêu: Murakami không bao giờ từ bỏ mục tiêu của mình. Dù gặp khó khăn hay thất bại, ông vẫn tiếp tục viết và cải thiện kỹ năng của mình.',
                        'Xây dựng sự tự tin: Bằng cách vượt qua những cám dỗ và thay thế những thói quen xấu (hút thuốc, uống rượu, thức khuya) bằng những thói quen tốt (tập thể dục, đọc sách, đi ngủ sớm), Murakami đã xây dựng được sự tự tin và lòng can đảm để theo đuổi ước mơ của mình.'
                    ],
                    quote: {
                        text: "Tôi không bắt đầu chạy vì ai đó yêu cầu tôi trở thành người chạy bộ. Cũng giống như tôi không trở thành tiểu thuyết gia vì ai đó yêu cầu tôi. Một ngày nọ, tôi muốn viết một cuốn tiểu thuyết. Và một ngày, bất ngờ, tôi bắt đầu chạy - đơn giản vì tôi muốn thế. Tôi luôn làm bất cứ điều gì tôi cảm thấy thích làm trong cuộc sống.",
                        author: "Haruki Murakami"
                    },
                    productId: slug, // ID 201-208 cho sách kỹ năng sống (sử dụng slug trực tiếp)
                    productTitle: 'Sách kỹ năng sống ' + slug,
                    productImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
                };
            case 'sach-thieu-nhi':
                return {
                    title: 'NHỮNG CUỐN SÁCH THIẾU NHI GIÚP PHÁT TRIỂN TRÍ TƯỞNG TƯỢNG',
                    author: 'KDOL Tâm Anh',
                    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
                    overlayText: 'NHỮNG CUỐN SÁCH THIẾU NHI',
                    overlaySubtext: 'MINHLONGbook',
                    content: [
                        'Sách thiếu nhi không chỉ là công cụ giải trí mà còn là phương tiện giáo dục hiệu quả giúp trẻ phát triển toàn diện.',
                        'Với những hình ảnh sinh động, màu sắc tươi sáng và câu chuyện hấp dẫn, sách thiếu nhi giúp trẻ học hỏi một cách tự nhiên và thú vị.',
                        'MINHLONGbook tự hào mang đến bộ sưu tập sách thiếu nhi đa dạng, phù hợp với mọi lứa tuổi và sở thích.',
                        'Hãy cùng khám phá thế giới sách thiếu nhi để nuôi dưỡng tâm hồn và trí tuệ của trẻ.'
                    ],
                    productId: slug, // ID 301-308 cho sách thiếu nhi (sử dụng slug trực tiếp)
                    productTitle: 'Sách thiếu nhi ' + slug,
                    productImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop'
                };
            case 'sach-kinh-doanh':
                return {
                    title: 'BÍ QUYẾT THÀNH CÔNG TRONG KINH DOANH TỪ NHỮNG CUỐN SÁCH HAY',
                    author: 'KDOL Tâm Anh',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
                    overlayText: 'BÍ QUYẾT THÀNH CÔNG TRONG KINH DOANH',
                    overlaySubtext: 'MINHLONGbook',
                    content: [
                        'Kinh doanh là một lĩnh vực đầy thách thức và cơ hội, đòi hỏi kiến thức, kỹ năng và kinh nghiệm.',
                        'Những cuốn sách kinh doanh hay sẽ giúp bạn trang bị đầy đủ kiến thức cần thiết để thành công trong lĩnh vực này.',
                        'Từ marketing, quản lý, tài chính đến khởi nghiệp, MINHLONGbook có tất cả những gì bạn cần để phát triển sự nghiệp.',
                        'Hãy đầu tư vào việc đọc sách để đầu tư vào tương lai thành công của chính mình.'
                    ],
                    productId: slug, // ID 401-408 cho sách kinh doanh (sử dụng slug trực tiếp)
                    productTitle: 'Sách kinh doanh ' + slug,
                    productImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop'
                };
            case 'sach-van-hoc':
                return {
                    title: 'KHÁM PHÁ VẺ ĐẸP VĂN HỌC VIỆT NAM VÀ THẾ GIỚI',
                    author: 'KDOL Tâm Anh',
                    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop',
                    overlayText: 'KHÁM PHÁ VẺ ĐẸP VĂN HỌC',
                    overlaySubtext: 'MINHLONGbook',
                    content: [
                        'Văn học là tấm gương phản chiếu cuộc sống, con người và xã hội qua mọi thời đại.',
                        'MINHLONGbook tự hào mang đến bộ sưu tập sách văn học đa dạng, từ những tác phẩm kinh điển đến những sáng tác hiện đại.',
                        'Với sự đa dạng về thể loại và phong cách, chúng tôi cam kết mang đến những trải nghiệm đọc sách phong phú và ý nghĩa.',
                        'Hãy cùng khám phá thế giới văn học để mở rộng tâm hồn và hiểu biết về cuộc sống.'
                    ],
                    productId: slug, // ID 501-508 cho sách văn học (sử dụng slug trực tiếp)
                    productTitle: 'Sách văn học ' + slug,
                    productImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop'
                };
            default:
                return {
                    title: 'KHÁM PHÁ THẾ GIỚI SÁCH TẠI MINHLONGbook',
                    author: 'KDOL Tâm Anh',
                    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
                    overlayText: 'KHÁM PHÁ THẾ GIỚI SÁCH',
                    overlaySubtext: 'MINHLONGbook',
                    content: [
                        'MINHLONGbook là điểm đến lý tưởng cho những ai yêu thích đọc sách và khám phá tri thức.',
                        'Với bộ sưu tập sách đa dạng và phong phú, chúng tôi cam kết mang đến những trải nghiệm đọc sách tuyệt vời nhất.',
                        'Từ sách mới, sách bán chạy đến những tác phẩm kinh điển, MINHLONGbook có tất cả những gì bạn cần.',
                        'Hãy cùng khám phá và trải nghiệm thế giới sách tại MINHLONGbook.'
                    ],
                    productId: slug,
                    productTitle: 'Sách ' + slug,
                    productImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop'
                };
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
        return shuffled.slice(0, 6);
    };

    useEffect(() => {
        // Refresh latest posts when page loads
        setLatestPosts(getRandomLatestPosts());

        // Auto scroll to top when page loads or changes
        window.scrollTo(0, 0);
    }, [category, slug]);

    const articleData = getArticleData();

    return (
        <div className="blog-post-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="bp-breadcrumb">
                    <Link to="/">Trang chủ</Link> / <Link to={`/category/${category}`}>{getCategoryTitle()}</Link> / {articleData.title}
                </div>

                <div className="bp-layout">
                    {/* Main Content - Left Column */}
                    <div className="bp-main">
                        {/* Article Title */}
                        <h1 className="bp-title">
                            {articleData.title}
                        </h1>

                        {/* Article Metadata */}
                        <div className="bp-meta">
                            <div className="bp-meta-item">
                                <UserOutlined className="bp-meta-icon" />
                                <span>{articleData.author}</span>
                            </div>
                            <div className="bp-meta-item">
                                <TagOutlined className="bp-meta-icon" />
                                <span>{getCategoryTitle()}</span>
                            </div>
                            <div className="bp-meta-item">
                                <CalendarOutlined className="bp-meta-icon" />
                                <span>16/08/2025</span>
                            </div>
                        </div>

                        {/* Main Article Image */}
                        <div className="bp-main-image">
                            <img
                                src={articleData.image}
                                alt={articleData.title}
                            />
                            <div className="bp-image-overlay">
                                <div className="bp-overlay-text">
                                    <h3>{articleData.overlayText}</h3>
                                    <h2>{articleData.overlaySubtext}</h2>
                                </div>
                                <div className="bp-logo">MINHLONGbook</div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="bp-content">
                            {articleData.content.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}

                            {/* Quote Section - Only show for specific categories */}
                            {articleData.quote && (
                                <div className="bp-quote">
                                    <blockquote>
                                        "{articleData.quote.text}"
                                    </blockquote>
                                    <cite>- {articleData.quote.author}</cite>
                                </div>
                            )}

                            {/* Additional content for specific categories */}
                            {category === 'sach-ki-nang-song' && (
                                <>
                                    <p>
                                        Thông qua câu chuyện của Murakami, chúng ta có thể thấy rằng thành công không phải là kết quả
                                        của may mắn hay tài năng thiên bẩm, mà là kết quả của sự kiên trì, kỷ luật và thói quen tốt
                                        được duy trì trong thời gian dài.
                                    </p>
                                    <p>
                                        Hãy học hỏi từ tác giả này để xây dựng cho mình một lối sống lành mạnh, có kỷ luật và kiên trì
                                        theo đuổi mục tiêu của mình. Chỉ có như vậy, bạn mới có thể đạt được thành công bền vững
                                        và sống một cuộc sống có ý nghĩa.
                                    </p>
                                </>
                            )}

                            {/* Đặt mua button */}
                            <div className="bp-purchase-section">
                                <Link to={`/product/${articleData.productId}`} className="bp-order-btn">
                                    <span className="bp-cart-icon">🛒</span>
                                    ĐẶT MUA
                                </Link>
                            </div>
                        </div>


                    </div>

                    {/* Sidebar - Right Column */}
                    <aside className="bp-sidebar">
                        {/* Latest Posts */}
                        <div className="bp-sidebar-card">
                            <div className="bp-sidebar-title">Bài viết mới nhất</div>
                            <div className="bp-latest-posts">
                                {latestPosts.map((book) => (
                                    <div key={book.id} className="bp-latest-post">
                                        <Link to={`/blogs/${book.category}/${book.id}`} className="bp-latest-link">
                                            <div className="bp-latest-image">
                                                <img src={book.image} alt={book.title} />
                                            </div>
                                            <div className="bp-latest-info">
                                                <h4 className="bp-latest-title">{book.title}</h4>
                                                <span className="bp-latest-date">16/08/2025</span>
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

export default BlogPostPage;
