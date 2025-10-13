import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  message,
  Tooltip,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  createNotificationAPI,
  deleteNotificationAPI,
  getAllNotificationsAPI,
  updateNotificationAPI,
} from "../../service/notification.service";
import dayjs from "dayjs";

const { Search } = Input;
const { TextArea } = Input;

const CommonNotificationManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [viewingNotification, setViewingNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [form] = Form.useForm();
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  const fetchNotifications = async () => {
    const res = await getAllNotificationsAPI();
    if (res && res.data) {
      setNotifications(res.data || []);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const notificationColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Nội dung", dataIndex: "message", key: "message", ellipsis: true },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
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
              title="Bạn có chắc muốn xóa thông báo này?"
              onConfirm={() => handleDelete(record.id)}
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
    setEditingNotification(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    form.setFieldsValue(notification);
    setIsModalVisible(true);
  };

  const handleDelete = async (notificationId) => {
    const res = await deleteNotificationAPI(notificationId);
    if (res && res.data) {
        showNotification("success", "Xóa thông báo thành công!");
        fetchNotifications();
    } else {
        showNotification("error", res.message || "Xóa thông báo thất bại!");
    }
  };

  const handleView = (notification) => {
    setViewingNotification(notification);
  };

  const handleAddNotification = async (notification) => {
    const res = await createNotificationAPI(
      notification.title,
      notification.message
    );
    if (res && res.data) {
      showNotification("success", "Thêm thông báo thành công!");
      fetchNotifications();
      setIsModalVisible(false);
      form.resetFields();
    } else {
      showNotification("error", res.message || "Thêm thông báo thất bại!");
    }
  };

  const handleUpdateNotification = async (id, notification) => {
    const res = await updateNotificationAPI(
      id,
      notification.title,
      notification.message
    );
    if (res && res.data) {
      showNotification("success", "Cập nhật thông báo thành công!");
      fetchNotifications();
      setIsModalVisible(false);
      setEditingNotification(null);
      form.resetFields();
    } else {
      showNotification("error", res.message || "Cập nhật thông báo thất bại!");
    }
  };

  const handleSubmit = (values) => {
    if (editingNotification) {
        handleUpdateNotification(editingNotification.id, values);
    } else {
      handleAddNotification(values);
    }
  };

  return (
    <div className="notifications-content">
      {/* Enhanced Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "12px",
            color: "white",
            fontWeight: "500",
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            backdropFilter: "blur(8px)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                ? "#ff4d4f"
                : "#1890ff",
            transform: notification.visible
              ? "translateX(0)"
              : "translateX(100%)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {notification.message}
        </div>
      )}
      <div className="content-header">
        <h2>Quản lý thông báo</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
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
        title={
          editingNotification ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Tiêu đề thông báo"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung thông báo"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea placeholder="Nhập nội dung thông báo" rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingNotification ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
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
          </Button>,
        ]}
        width={600}
      >
        {viewingNotification && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p>
                  <strong>ID:</strong> {viewingNotification.id}
                </p>
                <p>
                  <strong>Tiêu đề:</strong> {viewingNotification.title}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {dayjs(viewingNotification.createdAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                </p>
                <p>
                  <strong>Nội dung:</strong>
                </p>
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {viewingNotification.message}
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
