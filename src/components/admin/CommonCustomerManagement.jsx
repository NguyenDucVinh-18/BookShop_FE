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
    Row,
    Col,
    Popconfirm
} from 'antd';
import { EditOutlined, EyeOutlined, SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

const CommonCustomerManagement = ({ customers, onEditCustomer, onAddCustomer, onDeleteCustomer }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [viewingCustomer, setViewingCustomer] = useState(null); // Thêm state xem chi tiết
    const [form] = Form.useForm();

    const customerColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
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
        { title: 'Ngày tham gia', dataIndex: 'joinDate', key: 'joinDate' },
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
                            title="Bạn có chắc muốn xóa khách hàng này?"
                            onConfirm={() => onDeleteCustomer(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button icon={<DeleteOutlined />} size="small" danger />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleAdd = () => {
        setEditingCustomer(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        form.setFieldsValue(customer);
        setIsModalVisible(true);
    };

    const handleView = (customer) => {
        setViewingCustomer(customer);
    };

    const handleSubmit = (values) => {
        if (editingCustomer) {
            onEditCustomer(editingCustomer.id, values);
            message.success('Cập nhật khách hàng thành công!');
        } else {
            onAddCustomer(values);
            message.success('Thêm khách hàng mới thành công!');
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div className="customers-content">
            <div className="content-header">
                <h2>Quản lý khách hàng</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm khách hàng
                </Button>
            </div>

            <div className="search-bar">
                <Search
                    placeholder="Tìm kiếm khách hàng..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                />
            </div>

            <Table
                dataSource={customers}
                columns={customerColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            {/* Customer Add/Edit Modal */}
            <Modal
                title={editingCustomer ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên khách hàng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
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
                                {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem chi tiết khách hàng */}
            <Modal
                title="Chi tiết khách hàng"
                open={!!viewingCustomer}
                onCancel={() => setViewingCustomer(null)}
                footer={[
                    <Button key="close" onClick={() => setViewingCustomer(null)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {viewingCustomer && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>ID:</strong> {viewingCustomer.id}</p>
                                <p><strong>Tên khách hàng:</strong> {viewingCustomer.name}</p>
                                <p><strong>Email:</strong> {viewingCustomer.email}</p>
                                <p><strong>Số điện thoại:</strong> {viewingCustomer.phone}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Địa chỉ:</strong> {viewingCustomer.address}</p>
                                <p><strong>Trạng thái:</strong>
                                    <Tag color={viewingCustomer.status === 'active' ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                                        {viewingCustomer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                    </Tag>
                                </p>
                                <p><strong>Ngày tham gia:</strong> {viewingCustomer.joinDate}</p>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CommonCustomerManagement;
