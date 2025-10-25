import React, { useState, useEffect } from "react";
import { Card, Typography, Table, Button, Space, Tag, Select, Row, Col, Input, DatePicker, Modal, message, Form } from "antd";
import { FileTextOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import InventoryCountDetail from "./InventoryCountDetail";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const InventoryCountManagement = ({ newCountSlip, onCreateNew }) => {
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [editingSlip, setEditingSlip] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [editForm] = Form.useForm();

    // Hardcoded data based on the image
    const baseData = [
        {
            key: "1",
            slipCode: "KK001",
            slipName: "Kiểm kê tháng 10/2024",
            checkDate: "25/10/2024",
            checker: "Nguyễn Văn A",
            productCount: 15,
            status: "completed",
        },
        {
            key: "2",
            slipCode: "KK002",
            slipName: "Kiểm kê đột xuất",
            checkDate: "24/10/2024",
            checker: "Trần Thị B",
            productCount: 8,
            status: "pending",
        },
        {
            key: "3",
            slipCode: "KK003",
            slipName: "Kiểm kê cuối quý",
            checkDate: "20/10/2024",
            checker: "Lê Văn C",
            productCount: 25,
            status: "completed",
        },
    ];

    // Initialize data list
    useEffect(() => {
        if (newCountSlip) {
            const newItem = {
                key: "new",
                slipCode: newCountSlip.slipCode,
                slipName: newCountSlip.slipName,
                checkDate: newCountSlip.checkDate,
                checker: newCountSlip.checker,
                productCount: newCountSlip.productCount,
                status: newCountSlip.status,
                products: newCountSlip.products || [],
            };
            setDataList([newItem, ...baseData]);
        } else {
            setDataList(baseData);
        }
    }, [newCountSlip]);

    // Use dataList if it has items, otherwise use baseData
    const data = dataList.length > 0 ? dataList : baseData;

    // Define all handler functions first
    const handleView = (record) => {
        setSelectedSlip(record);
    };

    const handleEdit = (record) => {
        console.log("Edit clicked for record:", record);
        setItemToEdit(record);
        setEditModalVisible(true);

        // Set form values with safe DatePicker handling
        setTimeout(() => {
            editForm.setFieldsValue({
                slipCode: record.slipCode,
                slipName: record.slipName,
                checkDate: record.checkDate ? dayjs(record.checkDate, "DD/MM/YYYY") : null,
                checker: record.checker,
                status: record.status,
                note: record.note || ""
            });
        }, 100);
    };

    const handleDelete = (record) => {
        setItemToDelete(record);
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setDataList(prevData => prevData.filter(item => item.key !== itemToDelete.key));
            message.success("Xóa phiếu kiểm kê thành công!");
            setDeleteModalVisible(false);
            setItemToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setItemToDelete(null);
    };

    const handleSearch = () => {
        message.info("Tìm kiếm hoàn tất!");
    };

    // Handle edit modal
    const handleEditOk = () => {
        try {
            console.log("handleEditOk called");
            console.log("itemToEdit:", itemToEdit);

            if (!itemToEdit) {
                message.error("Không tìm thấy dữ liệu để cập nhật!");
                return;
            }

            editForm.validateFields().then((values) => {
                console.log("Form validation passed, values:", values);

                // Convert DatePicker value to string format safely
                let checkDateString = values.checkDate;
                try {
                    if (values.checkDate && typeof values.checkDate.format === 'function') {
                        checkDateString = values.checkDate.format("DD/MM/YYYY");
                    }
                } catch (error) {
                    console.error("Error formatting date:", error);
                    checkDateString = values.checkDate;
                }

                const formattedValues = {
                    ...values,
                    checkDate: checkDateString
                };

                console.log("Formatted values:", formattedValues);

                // Update the item in dataList
                setDataList(prevData => {
                    console.log("Previous data:", prevData);
                    const updatedData = prevData.map(item =>
                        item.key === itemToEdit.key
                            ? {
                                ...item,
                                ...formattedValues,
                                // Ensure required fields are not undefined
                                slipCode: formattedValues.slipCode || item.slipCode,
                                slipName: formattedValues.slipName || item.slipName,
                                checkDate: formattedValues.checkDate || item.checkDate,
                                checker: formattedValues.checker || item.checker,
                                status: formattedValues.status || item.status,
                                note: formattedValues.note || item.note || "",
                                // Keep original values for fields not in form
                                productCount: item.productCount,
                                products: item.products
                            }
                            : item
                    );
                    console.log("Updated data:", updatedData);
                    return updatedData;
                });

                message.success("Cập nhật phiếu kiểm kê thành công!");
                setEditModalVisible(false);
                setItemToEdit(null);
                editForm.resetFields();
            }).catch((errorInfo) => {
                console.log('Validate Failed:', errorInfo);
                message.error("Vui lòng kiểm tra lại thông tin!");
            });
        } catch (error) {
            console.error("Error in handleEditOk:", error);
            message.error("Có lỗi xảy ra khi cập nhật!");
        }
    };

    const handleEditCancel = () => {
        setEditModalVisible(false);
        setItemToEdit(null);
        editForm.resetFields();
    };

    const columns = [
        {
            title: "MÃ PHIẾU",
            dataIndex: "slipCode",
            key: "slipCode",
            width: 100,
        },
        {
            title: "TÊN PHIẾU",
            dataIndex: "slipName",
            key: "slipName",
            width: 200,
        },
        {
            title: "NGÀY KIỂM KÊ",
            dataIndex: "checkDate",
            key: "checkDate",
            width: 120,
        },
        {
            title: "NGƯỜI KIỂM KÊ",
            dataIndex: "checker",
            key: "checker",
            width: 150,
        },
        {
            title: "SỐ SẢN PHẨM",
            dataIndex: "productCount",
            key: "productCount",
            width: 120,
        },
        {
            title: "TRẠNG THÁI",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => {
                let color = "";
                let text = "";
                if (status === "completed") {
                    color = "green";
                    text = "Hoàn thành";
                } else if (status === "pending") {
                    color = "orange";
                    text = "Chờ duyệt";
                } else if (status === "rejected") {
                    color = "red";
                    text = "Từ chối";
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "THAO TÁC",
            key: "action",
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleView(record)}
                    >
                        Xem
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredData = data.filter((item) => {
        const matchesSearch = (item.slipCode || "")
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
            (item.slipName || "")
                .toLowerCase()
                .includes(searchText.toLowerCase());
        const matchesStatus = filterStatus === "all" || item.status === filterStatus;
        const matchesDate = !selectedDate || item.checkDate === selectedDate.format("DD/MM/YYYY");
        return matchesSearch && matchesStatus && matchesDate;
    });



    // If a slip is selected, show detail view
    if (selectedSlip) {
        return (
            <InventoryCountDetail
                countSlip={selectedSlip}
                onBack={() => setSelectedSlip(null)}
            />
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <Title level={3}>
                    <FileTextOutlined style={{ marginRight: "8px" }} />
                    Quản lý kiểm kê
                </Title>
                <Paragraph style={{ fontSize: "16px", color: "#666", marginBottom: "24px" }}>
                    Quản lý tất cả phiếu kiểm kê tồn kho
                </Paragraph>

                <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Tìm kiếm theo mã phiếu, tên phiếu..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            defaultValue="all"
                            style={{ width: "100%" }}
                            onChange={(value) => setFilterStatus(value)}
                        >
                            <Option value="all">Tất cả</Option>
                            <Option value="completed">Hoàn thành</Option>
                            <Option value="pending">Chờ duyệt</Option>
                            <Option value="rejected">Từ chối</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Chọn ngày"
                            value={selectedDate}
                            onChange={setSelectedDate}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Space>
                            <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNew}>
                                Tạo phiếu mới
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} phiếu`,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: "max-content" }}
                />
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xóa phiếu kiểm kê"
                open={deleteModalVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                centered
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        fontSize: '24px',
                        color: '#faad14',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        ⚠️
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '16px' }}>
                            Bạn có chắc chắn muốn xóa phiếu kiểm kê này không?
                        </p>
                        {itemToDelete && (
                            <p style={{
                                margin: '8px 0 0 0',
                                fontSize: '14px',
                                color: '#666',
                                fontWeight: 'bold'
                            }}>
                                "{itemToDelete.slipName}"
                            </p>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Chỉnh sửa phiếu kiểm kê"
                open={editModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Cập nhật"
                cancelText="Hủy"
                width={600}
                centered
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    style={{ marginTop: '16px' }}
                >
                    <Form.Item
                        label="Mã phiếu"
                        name="slipCode"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Tên phiếu"
                        name="slipName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên phiếu!' },
                            { min: 3, message: 'Tên phiếu phải có ít nhất 3 ký tự!' },
                            { max: 100, message: 'Tên phiếu không được quá 100 ký tự!' }
                        ]}
                    >
                        <Input placeholder="Nhập tên phiếu" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày kiểm kê"
                        name="checkDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm kê!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày kiểm kê"
                            format="DD/MM/YYYY"
                            allowClear={false}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Người kiểm kê"
                        name="checker"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên người kiểm kê!' },
                            { min: 2, message: 'Tên người kiểm kê phải có ít nhất 2 ký tự!' },
                            { max: 50, message: 'Tên người kiểm kê không được quá 50 ký tự!' }
                        ]}
                    >
                        <Input placeholder="Nhập tên người kiểm kê" />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="completed">Hoàn thành</Option>
                            <Option value="pending">Chờ duyệt</Option>
                            <Option value="rejected">Từ chối</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="note"
                        rules={[
                            { max: 500, message: 'Ghi chú không được quá 500 ký tự!' }
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập ghi chú (tùy chọn)"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryCountManagement;