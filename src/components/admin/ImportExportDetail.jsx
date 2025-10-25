import React from "react";
import { Card, Typography, Descriptions, Table, Tag, Button, Space, Divider } from "antd";
import { ArrowLeftOutlined, PrinterOutlined, DownloadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ImportExportDetail = ({ slip, onBack }) => {
    if (!slip) {
        return (
            <div style={{ padding: "24px" }}>
                <Card>
                    <Title level={3}>Không tìm thấy phiếu</Title>
                    <Paragraph>Phiếu nhập xuất không tồn tại hoặc đã bị xóa.</Paragraph>
                    <Button type="primary" onClick={onBack}>
                        Quay lại danh sách
                    </Button>
                </Card>
            </div>
        );
    }

    // Use actual slip data
    const slipDetails = {
        id: slip.id,
        type: slip.type,
        slipNumber: slip.slipNumber,
        status: slip.status,
        createdDate: slip.createdDate,
        note: slip.note,
        warehouse: "Kho chính - Hà Nội",
        createdBy: "Admin",
        approvedBy: "Quản lý kho",
        approvedDate: slip.createdDate,
        products: slip.products || []
    };

    const productColumns = [
        {
            title: "SẢN PHẨM",
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: "ĐƠN VỊ",
            dataIndex: "unit",
            key: "unit",
            width: 80,
        },
        {
            title: "SỐ LƯỢNG",
            dataIndex: "quantity",
            key: "quantity",
            width: 100,
            align: "right",
        },
        {
            title: "SỐ LÔ",
            dataIndex: "lotNumber",
            key: "lotNumber",
            width: 120,
        },
        {
            title: "NSX",
            dataIndex: "manufacturingDate",
            key: "manufacturingDate",
            width: 100,
        },
        {
            title: "HSD",
            dataIndex: "expirationDate",
            key: "expirationDate",
            width: 100,
        },
        {
            title: "NHÀ CUNG CẤP",
            dataIndex: "supplier",
            key: "supplier",
            width: 150,
        },
        {
            title: "GHI CHÚ",
            dataIndex: "note",
            key: "note",
            width: 150,
        },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <div style={{ marginBottom: "24px" }}>
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={onBack}
                        >
                            Quay lại
                        </Button>
                        <Button
                            type="primary"
                            icon={<PrinterOutlined />}
                        >
                            In phiếu
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                        >
                            Xuất PDF
                        </Button>
                    </Space>
                </div>

                <Title level={2}>
                    Chi tiết phiếu {slipDetails.type === "import" ? "nhập kho" : "xuất kho"}
                </Title>
                <Paragraph style={{ fontSize: "16px", color: "#666", marginBottom: "24px" }}>
                    Số phiếu: <strong>{slipDetails.slipNumber}</strong>
                </Paragraph>

                <Descriptions
                    title="Thông tin phiếu"
                    bordered
                    column={2}
                    size="middle"
                    style={{ marginBottom: "24px" }}
                >
                    <Descriptions.Item label="Số phiếu" span={1}>
                        <strong>{slipDetails.slipNumber}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại phiếu" span={1}>
                        <Tag color={slipDetails.type === "import" ? "blue" : "orange"}>
                            {slipDetails.type === "import" ? "Nhập kho" : "Xuất kho"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={1}>
                        <Tag color="green">Đã duyệt</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo" span={1}>
                        {slipDetails.createdDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kho" span={1}>
                        {slipDetails.warehouse}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người tạo" span={1}>
                        {slipDetails.createdBy}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người duyệt" span={1}>
                        {slipDetails.approvedBy}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày duyệt" span={1}>
                        {slipDetails.approvedDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú" span={2}>
                        {slipDetails.note || "Không có ghi chú"}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={4}>Danh sách sản phẩm</Title>
                <Table
                    columns={productColumns}
                    dataSource={slipDetails.products}
                    pagination={false}
                    size="small"
                    scroll={{ x: 1000 }}
                    rowKey="id"
                    summary={(pageData) => {
                        const totalQuantity = pageData.reduce((sum, item) => sum + (item.quantity || 0), 0);
                        return (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={2}>
                                    <strong>Tổng cộng</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align="right">
                                    <strong>{totalQuantity}</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} colSpan={5}>
                                    <strong>{pageData.length} sản phẩm</strong>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </Card>
        </div>
    );
};

export default ImportExportDetail;
