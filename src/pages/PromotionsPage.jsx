import React from "react";
import { Typography, Card, List, Tag } from "antd";
import "../styles/PromotionsPage.css";

const { Title, Paragraph } = Typography;

const promos = [
    { id: 1, name: "Tuần lễ vàng sách kỹ năng", desc: "Giảm đến 30% + freeship đơn từ 199k", period: "01–07/11/2025", tags: ["-30%", "Freeship"] },
    { id: 2, name: "Black Friday", desc: "Deal sốc sách hot – số lượng có hạn", period: "28–30/11/2025", tags: ["Flash Sale", "Có hạn"] },
    { id: 3, name: "Thành viên thân thiết", desc: "Tặng 50 điểm cho đơn đầu tiên tháng 12", period: "01–31/12/2025", tags: ["Member", "+50 điểm"] }
];

const PromotionsPage = () => {
    return (
        <div className="promos-page">
            <div className="promos-container">
                <div className="promos-header">
                    <Title level={2} className="promos-title">Tin khuyến mại</Title>
                    <Paragraph className="promos-subtitle">Cập nhật chương trình ưu đãi mới nhất</Paragraph>
                </div>

                <Card className="promos-card">
                    <List
                        itemLayout="vertical"
                        dataSource={promos}
                        renderItem={(p) => (
                            <List.Item key={p.id} className="promo-item">
                                <List.Item.Meta title={<span className="promo-name">{p.name}</span>} description={p.period} />
                                <div className="promo-desc">{p.desc}</div>
                                <div className="promo-tags">{p.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default PromotionsPage;


