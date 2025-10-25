import React, { useState } from "react";
import { Card, Typography, Table, Button, Space, Tag, Select, Row, Col } from "antd";
import { UnorderedListOutlined, PlusOutlined } from "@ant-design/icons";
import ImportExportDetail from "./ImportExportDetail";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ImportExportList = ({ newSlip, onCreateNew }) => {
    const [warehouseFilter, setWarehouseFilter] = useState("all");
    const [selectedSlip, setSelectedSlip] = useState(null);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
            render: (text) => <strong>#{text}</strong>,
        },
        {
            title: "LOẠI",
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type) => (
                <span style={{ color: type === "import" ? "#1890ff" : "#fa8c16" }}>
                    {type === "import" ? "Nhập kho" : "Xuất kho"}
                </span>
            ),
        },
        {
            title: "SỐ PHIẾU",
            dataIndex: "slipNumber",
            key: "slipNumber",
            width: 120,
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "TRẠNG THÁI",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => (
                <Tag color="green">Đã duyệt</Tag>
            ),
        },
        {
            title: "NGÀY TẠO",
            dataIndex: "createdDate",
            key: "createdDate",
            width: 120,
        },
        {
            title: "GHI CHÚ",
            dataIndex: "note",
            key: "note",
            ellipsis: true,
        },
        {
            title: "THAO TÁC",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    style={{ color: "#1890ff", padding: 0 }}
                    onClick={() => setSelectedSlip(record)}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    // Hardcoded data based on the image
    const baseData = [
        {
            key: "1",
            id: 98,
            type: "export",
            slipNumber: "ORDER-4",
            status: "approved",
            createdDate: "24/10/2025",
            note: "Xuất kho cho đơn hàng #4",
        },
        {
            key: "2",
            id: 97,
            type: "import",
            slipNumber: "RETURN-11",
            status: "approved",
            createdDate: "23/10/2025",
            note: "Nhập kho do trả hàng - Return Order #11",
        },
        {
            key: "3",
            id: 96,
            type: "import",
            slipNumber: "IMPORT-96",
            status: "approved",
            createdDate: "24/10/2025",
            note: "Nhập kho hàng mới từ nhà cung cấp",
        },
        {
            key: "4",
            id: 95,
            type: "import",
            slipNumber: "IMPORT-95",
            status: "approved",
            createdDate: "23/10/2025",
            note: "Nhập kho bổ sung hàng tồn",
        },
        {
            key: "5",
            id: 94,
            type: "import",
            slipNumber: "IMPORT-94",
            status: "approved",
            createdDate: "23/10/2025",
            note: "Nhập kho sản phẩm mới",
        },
        {
            key: "6",
            id: 93,
            type: "import",
            slipNumber: "IMPORT-93",
            status: "approved",
            createdDate: "22/10/2025",
            note: "Nhập kho hàng từ kho trung tâm",
        },
        {
            key: "7",
            id: 92,
            type: "import",
            slipNumber: "IMPORT-92",
            status: "approved",
            createdDate: "22/10/2025",
            note: "Nhập kho hàng bán chạy",
        },
        {
            key: "8",
            id: 91,
            type: "import",
            slipNumber: "IMPORT-91",
            status: "approved",
            createdDate: "22/10/2025",
            note: "Nhập kho hàng khuyến mãi",
        },
        {
            key: "9",
            id: 90,
            type: "import",
            slipNumber: "IMPORT-90",
            status: "approved",
            createdDate: "22/10/2025",
            note: "Nhập kho hàng theo đơn đặt",
        },
        {
            key: "10",
            id: 89,
            type: "import",
            slipNumber: "IMPORT-89",
            status: "approved",
            createdDate: "22/10/2025",
            note: "Nhập kho hàng cuối tuần",
        },
    ];

    // Add new slip to the beginning of the list if it exists
    const data = newSlip ? [
        {
            key: "new",
            id: newSlip.id,
            type: newSlip.type,
            slipNumber: newSlip.slipNumber,
            status: newSlip.status,
            createdDate: newSlip.createdDate,
            note: newSlip.note,
            products: newSlip.products || [], // Include products data
        },
        ...baseData
    ] : baseData;

    // If a slip is selected, show detail view
    if (selectedSlip) {
        console.log("Selected slip for detail:", selectedSlip);
        console.log("Products in selected slip:", selectedSlip.products);
        return (
            <ImportExportDetail
                slip={selectedSlip}
                onBack={() => setSelectedSlip(null)}
            />
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <div style={{ marginBottom: "24px" }}>
                    <Title level={2}>
                        <UnorderedListOutlined style={{ marginRight: "8px" }} />
                        Danh sách phiếu nhập xuất
                    </Title>
                    <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                        Quản lý các phiếu nhập xuất hàng
                    </Paragraph>
                </div>

                <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                    <Col>
                        <Select
                            value={warehouseFilter}
                            onChange={setWarehouseFilter}
                            style={{ width: 150 }}
                        >
                            <Option value="all">Tất cả kho</Option>
                            <Option value="warehouse1">Kho trung tâm</Option>
                            <Option value="warehouse2">Kho phụ</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={onCreateNew}
                        >
                            Tạo phiếu mới
                        </Button>
                    </Col>
                </Row>

                <Card title="Danh sách phiếu" style={{ marginBottom: "24px" }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={{
                            total: 98,
                            pageSize: 10,
                            current: 1,
                            showSizeChanger: false,
                            showQuickJumper: false,
                            showTotal: (total, range) => `Hiển thị ${range[0]} đến ${range[1]} trong tổng số ${total} kết quả`,
                        }}
                        scroll={{ x: 800 }}
                        size="middle"
                    />
                </Card>
            </Card>
        </div>
    );
};

export default ImportExportList;