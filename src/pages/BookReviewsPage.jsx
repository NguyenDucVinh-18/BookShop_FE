import React from "react";
import { Typography, Card, List, Rate } from "antd";
import "../styles/BookReviewsPage.css";

const { Title, Paragraph } = Typography;

const sampleReviews = [
    { id: 1, title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", rating: 4.5, excerpt: "Một tác phẩm kinh điển thiếu nhi, ngôn ngữ giàu hình ảnh và nhân văn." },
    { id: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", rating: 4, excerpt: "Hành trình theo đuổi ước mơ, truyền cảm hứng cho mọi độc giả." },
    { id: 3, title: "Sapiens", author: "Yuval Noah Harari", rating: 4.8, excerpt: "Bức tranh lịch sử loài người cô đọng, sâu sắc và cuốn hút." }
];

const BookReviewsPage = () => {
    return (
        <div className="reviews-page">
            <div className="reviews-container">
                <div className="reviews-header">
                    <Title level={2} className="reviews-title">Điểm sách</Title>
                    <Paragraph className="reviews-subtitle">Tổng hợp nhận định ngắn gọn về các tựa sách đáng đọc</Paragraph>
                </div>

                <Card className="reviews-card">
                    <List
                        itemLayout="vertical"
                        dataSource={sampleReviews}
                        renderItem={(item) => (
                            <List.Item key={item.id} className="review-item">
                                <List.Item.Meta
                                    title={<span className="book-title">{item.title}</span>}
                                    description={<span className="book-author">Tác giả: {item.author}</span>}
                                />
                                <div className="review-content">
                                    <Rate allowHalf disabled defaultValue={item.rating} />
                                    <Paragraph>{item.excerpt}</Paragraph>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default BookReviewsPage;


