import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Input,
    Modal,
    Form,
    Select,
    Space,
    Tag,
    message,
    Tooltip,
    DatePicker,
    Row,
    Col,
    Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const CommonNotificationManagement = ({ notifications, onAddNotification, onEditNotification, onDeleteNotification }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [viewingNotification, setViewingNotification] = useState(null); // Thêm state xem chi tiết
    const [form] = Form.useForm();

    const notificationColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
        { title: 'Loại', dataIndex: 'type', key: 'type' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc muốn xóa thông báo này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleAdd = () => {
        setEditingNotification(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (notification) => {
        setEditingNotification(notification);
        form.setFieldsValue(notification);
        setIsModalVisible(true);
    };

    const handleDelete = (notificationId) => {
        onDeleteNotification(notificationId);
        message.success('Đã xóa thông báo thành công!');
    };

    const handleView = (notification) => {
        setViewingNotification(notification);
    };

    const handleSubmit = (values) => {
        if (editingNotification) {
            onEditNotification(editingNotification.id, values);
            message.success('Cập nhật thông báo thành công!');
        } else {
            onAddNotification(values);
            message.success('Thêm thông báo thành công!');
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div className="notifications-content">
            <div className="content-header">
                <h2>Quản lý thông báo</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm thông báo
                </Button>
            </div>

            <div className="search-bar">
                <Search
                    placeholder="Tìm kiếm thông báo..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                />
            </div>

            <Table
                dataSource={notifications}
                columns={notificationColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            {/* Notification Modal */}
            <Modal
                title={editingNotification ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề thông báo"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="Nhập tiêu đề thông báo" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung thông báo"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                        <TextArea
                            placeholder="Nhập nội dung thông báo"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại thông báo"
                        rules={[{ required: true, message: 'Vui lòng chọn loại thông báo!' }]}
                    >
                        <Select placeholder="Chọn loại thông báo">
                            <Option value="general">Thông báo chung</Option>
                            <Option value="promotion">Khuyến mãi</Option>
                            <Option value="maintenance">Bảo trì</Option>
                            <Option value="update">Cập nhật</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Không hoạt động</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingNotification ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem chi tiết thông báo */}
            <Modal
                title="Chi tiết thông báo"
                open={!!viewingNotification}
                onCancel={() => setViewingNotification(null)}
                footer={[
                    <Button key="close" onClick={() => setViewingNotification(null)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {viewingNotification && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>ID:</strong> {viewingNotification.id}</p>
                                <p><strong>Tiêu đề:</strong> {viewingNotification.title}</p>
                                <p><strong>Loại:</strong> {viewingNotification.type}</p>
                                <p><strong>Trạng thái:</strong>
                                    <Tag color={viewingNotification.status === 'active' ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                                        {viewingNotification.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                    </Tag>
                                </p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Ngày tạo:</strong> {viewingNotification.createdAt}</p>
                                <p><strong>Nội dung:</strong></p>
                                <div style={{
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    backgroundColor: '#fafafa',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {viewingNotification.content}
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CommonNotificationManagement;
