import React from "react";
import { Card, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const CommonInventoryManagement = () => {
    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <InboxOutlined style={{ fontSize: "64px", color: "#1890ff", marginBottom: "16px" }} />
                    <Title level={2}>Quản lý kho</Title>
                    <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                        Quản lý tồn kho và nhập xuất hàng hóa
                    </Paragraph>
                    <Paragraph style={{ color: "#999" }}>
                        Tính năng đang được phát triển...
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default CommonInventoryManagement;
