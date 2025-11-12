import React, { useState, useEffect } from "react";
import { Typography, Card, List, Tag, Spin, Empty } from "antd";
import { GiftOutlined, CalendarOutlined, TagOutlined } from "@ant-design/icons";
import "../styles/PromotionsPage.css";
import { getPromotionForCustomerAPI } from "../service/promotion.service";

const { Title, Paragraph } = Typography;

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = async () => {
    try {
      const res = await getPromotionForCustomerAPI();
      console.log("Promotions fetched:", res);
      if (res && res.data) {
        setPromotions(res.data.promotions || []);
      } else {
        setPromotions([]);
      }
    } catch (error) {
        console.error("Lỗi khi tải khuyến mãi:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusTag = (status) => {
    return status === "ACTIVE" ? (
      <Tag color="green">Đang diễn ra</Tag>
    ) : (
      <Tag color="default">Sắp diễn ra</Tag>
    );
  };

  if (loading) {
    return (
      <div className="promos-page">
        <div
          className="promos-container"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="promos-page">
      <div className="promos-container">
        <div className="promos-header">
          <Title level={2} className="promos-title">
            <GiftOutlined style={{ marginRight: 8 }} />
            Tin khuyến mại
          </Title>
          <Paragraph className="promos-subtitle">
            Cập nhật chương trình ưu đãi mới nhất
          </Paragraph>
        </div>

        <Card className="promos-card">
          {promotions.length === 0 ? (
            <Empty description="Chưa có chương trình khuyến mãi nào" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={promotions}
              renderItem={(promo) => (
                <List.Item key={promo.id} className="promo-item">
                  <List.Item.Meta
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span className="promo-name">{promo.name}</span>
                        {getStatusTag(promo.status)}
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 8 }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {formatDate(promo.startDate)} -{" "}
                        {formatDate(promo.endDate)}
                      </div>
                    }
                  />
                  <div className="promo-desc" style={{ margin: "12px 0" }}>
                    {promo.description}
                  </div>
                  <div className="promo-tags">
                    <Tag color="red" icon={<TagOutlined />}>
                      Giảm {promo.discountPercent}%
                    </Tag>
                    <Tag color="blue">Mã: {promo.code}</Tag>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default PromotionsPage;
