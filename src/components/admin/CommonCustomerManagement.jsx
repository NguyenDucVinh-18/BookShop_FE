import React, { useEffect, useState } from "react";
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
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { createAccountAPI, getAllUsersAPI } from "../../service/auth.service";
import dayjs from "dayjs";
import { updateInFo, updateInFoAccountAPI } from "../../service/user.service";

const { Option } = Select;
const { Search } = Input;

const CommonCustomerManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null); // Thêm state xem chi tiết
  const [customers, setCustomers] = useState([]); // Dữ liệu khách hàng mẫu
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const resGetAllCustomer = await getAllUsersAPI();
    if (resGetAllCustomer && resGetAllCustomer.data) {
      setCustomers(resGetAllCustomer.data.users);
    } else {
      message.error("Không thể lấy danh sách khách hàng");
    }
  };

  const customerColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tên", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) =>
        text ? dayjs(text).format("DD/MM/YYYY HH:mm:ss") : "—",
    },
    {
      title: "Hành động",
      key: "actions",
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
              onConfirm={() => handleDeleteAccount(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
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

  const handleSubmit = async (values) => {
    if (editingCustomer) {
      setLoading(true);
      const resUpdate = await updateInFoAccountAPI(
        editingCustomer.id,
        values.username,
        values.phone
      );
      if (resUpdate.status === "success") {
        showNotification("success", "Cập nhật thông tin khách hàng thành công!");
        fetchCustomers();
        setIsModalVisible(false);
        setLoading(false);
        form.resetFields();
      } else {
        showNotification(
          "error",
          resUpdate.message || "Cập nhật thông tin thất bại"
        );
        setLoading(false);
      }
    } else {
      setLoading(true);d
      const resCreateAccount = await createAccountAPI(
        values.username,
        values.email,
        values.password,
        values.phone,
        "USER"
      );
      console.log("resCreateAccount", resCreateAccount);
      if (resCreateAccount.status === "success") {
        showNotification("success", "Tạo tài khoản khách hàng thành công!");
        fetchCustomers();
        setIsModalVisible(false);
        setLoading(false);
        form.resetFields();
      } else {
        showNotification(
          "error",
          resCreateAccount.message || "Tạo tài khoản thất bại"
        );
        setLoading(false);
      }
    }
  };

  return (
    <div className="customers-content">
      {/* Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                ? "#ff4d4f"
                : "#1890ff",
          }}
        >
          {notification.message}
        </div>
      )}
      <div className="content-header">
        <h2>Quản lý khách hàng</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm tài khoản khách hàng
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
        title={
          editingCustomer
            ? "Chỉnh sửa thông tin khách hàng"
            : "Thêm tài khoản khách hàng mới"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="Tên khách hàng"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {!editingCustomer && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          {/* <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Không hoạt động</Option>
                        </Select>
                    </Form.Item> */}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCustomer ? "Cập nhật" : "Thêm mới"}
                
                </Button>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
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
          </Button>,
        ]}
        width={600}
      >
        {viewingCustomer && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p>
                  <strong>ID:</strong> {viewingCustomer.id}
                </p>
                <p>
                  <strong>Tên khách hàng:</strong> {viewingCustomer.username}
                </p>
                <p>
                  <strong>Email:</strong> {viewingCustomer.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {viewingCustomer.phone}
                </p>
              </Col>
              <Col span={12}>
                {/* <p>
                  <strong>Địa chỉ:</strong> {viewingCustomer.address}
                </p> */}
                {/* <p>
                  <strong>Trạng thái:</strong>
                  <Tag
                    color={
                      viewingCustomer.status === "active" ? "green" : "red"
                    }
                    style={{ marginLeft: "8px" }}
                  >
                    {viewingCustomer.status === "active"
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </Tag>
                </p> */}
                <p>
                  <strong>Ngày tham gia:</strong>{" "}
                  {dayjs(viewingCustomer.createdAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                </p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommonCustomerManagement;
