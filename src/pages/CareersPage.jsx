import React from "react";
import { Typography, Card, List, Tag } from "antd";
import "../styles/CareersPage.css";

const { Title, Paragraph } = Typography;

const openings = [
    { id: 1, title: "Chuyên viên CSKH", type: "Full-time", location: "Hà Nội", tags: ["Customer Support", "Onsite"], desc: "Tiếp nhận và xử lý thắc mắc, hỗ trợ đơn hàng, chăm sóc người dùng." },
    { id: 2, title: "Nhân viên Kho vận", type: "Full-time", location: "TP.HCM", tags: ["Logistics"], desc: "Kiểm đếm, đóng gói, xuất nhập sách theo quy trình." },
    { id: 3, title: "Content Writer (Sách)", type: "Part-time", location: "Remote", tags: ["Content", "SEO"], desc: "Viết giới thiệu sách, điểm sách, bài blog theo định hướng của công ty." }
];

const CareersPage = () => {
    return (
        <div className="careers-page">
            <div className="careers-container">
                <div className="careers-header">
                    <Title level={2} className="careers-title">Tuyển dụng</Title>
                    <Paragraph className="careers-subtitle">Cùng HIEUVINHbook xây dựng cộng đồng đọc sách chất lượng</Paragraph>
                </div>

                <Card className="careers-card">
                    <List
                        itemLayout="vertical"
                        dataSource={openings}
                        renderItem={(job) => (
                            <List.Item key={job.id} className="career-item">
                                <List.Item.Meta
                                    title={<span className="job-title">{job.title}</span>}
                                    description={<span className="job-meta">{job.type} • {job.location}</span>}
                                />
                                <div className="job-desc">{job.desc}</div>
                                <div className="job-tags">
                                    {job.tags.map((t) => (<Tag key={t}>{t}</Tag>))}
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default CareersPage;


