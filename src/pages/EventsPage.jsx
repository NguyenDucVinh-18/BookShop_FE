import React from "react";
import { Typography, Card, Timeline } from "antd";
import "../styles/EventsPage.css";

const { Title, Paragraph } = Typography;

const EventsPage = () => {
    return (
        <div className="events-page">
            <div className="events-container">
                <div className="events-header">
                    <Title level={2} className="events-title">Sự kiện</Title>
                    <Paragraph className="events-subtitle">Chuỗi sự kiện ký tặng, ra mắt sách, talkshow</Paragraph>
                </div>

                <Card className="events-card">
                    <Timeline
                        items={[
                            { label: "Tháng 10/2025", children: "Giao lưu cùng tác giả A – Chủ đề: Văn học đương đại" },
                            { label: "Tháng 11/2025", children: "Workshop: Kỹ năng đọc hiệu quả cho sinh viên" },
                            { label: "Tháng 12/2025", children: "Ký tặng và ra mắt sách B tại Hà Nội" }
                        ]}
                    />
                </Card>
            </div>
        </div>
    );
};

export default EventsPage;


