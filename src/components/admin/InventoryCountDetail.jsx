import React from "react";
import { Card, Typography, Descriptions, Table, Button, Space, Tag } from "antd";
import { ArrowLeftOutlined, PrinterOutlined, FilePdfOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const InventoryCountDetail = ({ countSlip, onBack }) => {
    if (!countSlip) {
        return (
            <div style={{ padding: "24px" }}>
                <Card>
                    <Title level={4}>Đang tải chi tiết phiếu kiểm kê...</Title>
                    <Paragraph>Vui lòng đợi hoặc quay lại danh sách.</Paragraph>
                    <Button onClick={onBack} icon={<ArrowLeftOutlined />}>
                        Quay lại danh sách
                    </Button>
                </Card>
            </div>
        );
    }

    const productColumns = [
        {
            title: "SẢN PHẨM",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "ĐƠN VỊ",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "TỒN HỆ THỐNG",
            dataIndex: "systemQuantity",
            key: "systemQuantity",
        },
        {
            title: "SỐ LƯỢNG THỰC TẾ",
            dataIndex: "actualQuantity",
            key: "actualQuantity",
        },
        {
            title: "CHÊNH LỆCH",
            dataIndex: "difference",
            key: "difference",
            render: (diff) => (
                <span style={{
                    color: diff > 0 ? "green" : diff < 0 ? "red" : "black",
                    fontWeight: "bold"
                }}>
                    {diff > 0 ? "+" : ""}{diff}
                </span>
            ),
        },
        {
            title: "GHI CHÚ",
            dataIndex: "note",
            key: "note",
        },
    ];

    const totalProducts = countSlip.products ? countSlip.products.length : 0;
    const totalSystemQuantity = countSlip.products ? countSlip.products.reduce((sum, product) => sum + (product.systemQuantity || 0), 0) : 0;
    const totalActualQuantity = countSlip.products ? countSlip.products.reduce((sum, product) => sum + (product.actualQuantity || 0), 0) : 0;
    const totalDifference = totalActualQuantity - totalSystemQuantity;

    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Title level={3} style={{ margin: 0 }}>
                        <span style={{ marginRight: "8px" }}>Chi tiết phiếu kiểm kê</span>
                        <Tag color="green">Hoàn thành</Tag>
                    </Title>
                    <Space>
                        <Button onClick={onBack} icon={<ArrowLeftOutlined />}>
                            Quay lại
                        </Button>
                        <Button icon={<PrinterOutlined />}>In phiếu</Button>
                        <Button icon={<FilePdfOutlined />}>Xuất PDF</Button>
                    </Space>
                </div>

                <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} style={{ marginBottom: "24px" }}>
                    <Descriptions.Item label="Mã phiếu">{countSlip.slipCode}</Descriptions.Item>
                    <Descriptions.Item label="Tên phiếu">{countSlip.slipName}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color="green">Hoàn thành</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày kiểm kê">{countSlip.checkDate}</Descriptions.Item>
                    <Descriptions.Item label="Kho">{countSlip.warehouse}</Descriptions.Item>
                    <Descriptions.Item label="Người kiểm kê">{countSlip.checker}</Descriptions.Item>
                    <Descriptions.Item label="Số sản phẩm">{totalProducts}</Descriptions.Item>
                    <Descriptions.Item label="Tổng tồn hệ thống">{totalSystemQuantity}</Descriptions.Item>
                    <Descriptions.Item label="Tổng số lượng thực tế">{totalActualQuantity}</Descriptions.Item>
                    <Descriptions.Item label="Tổng chênh lệch" span={3}>
                        <Text style={{
                            color: totalDifference > 0 ? "green" : totalDifference < 0 ? "red" : "black",
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}>
                            {totalDifference > 0 ? "+" : ""}{totalDifference}
                        </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú" span={3}>{countSlip.note || "Không có ghi chú"}</Descriptions.Item>
                </Descriptions>

                <Title level={4} style={{ marginTop: "32px", marginBottom: "16px" }}>Danh sách sản phẩm kiểm kê</Title>
                <Table
                    columns={productColumns}
                    dataSource={countSlip.products || []}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={2}>
                                <Text strong>Tổng cộng</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                <Text strong>{totalSystemQuantity}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                <Text strong>{totalActualQuantity}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>
                                <Text strong style={{
                                    color: totalDifference > 0 ? "green" : totalDifference < 0 ? "red" : "black"
                                }}>
                                    {totalDifference > 0 ? "+" : ""}{totalDifference}
                                </Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                <Text strong>{totalProducts} sản phẩm</Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Card>
        </div>
    );
};

export default InventoryCountDetail;
