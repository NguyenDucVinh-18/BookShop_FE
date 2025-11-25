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
  Card,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  createNotificationAPI,
  deleteNotificationAPI,
  getAllNotificationsAPI,
  updateNotificationAPI,
} from "../../service/notification.service";
import dayjs from "dayjs";
import "../../styles/NotificationManagement.css";

const { Text, Title } = Typography;

const { Search } = Input;
const { TextArea } = Input;

const CommonNotificationManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [viewingNotification, setViewingNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchText, setSearchText] = useState("");
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
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

  const filteredNotifications = notifications.filter((notif) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      notif.title?.toLowerCase().includes(searchLower) ||
      notif.message?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="notification-page-container">
      <div className="notification-content">
        <div className="notification-panel">
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

          {/* Header */}
          <div className="notification-header">
            <div>
              <Title level={2} className="notification-title">
                Quản lý thông báo
              </Title>
              <Text className="notification-subtitle">
                Quản lý và theo dõi các thông báo trong hệ thống
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="notification-add-btn"
            >
              {isMobile ? "Thêm" : "Thêm thông báo"}
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="notification-filter-card" bordered={false}>
            <div className="notification-search-bar">
              <Search
                placeholder="Tìm kiếm thông báo..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
              />
            </div>
          </Card>

          {/* Notification List */}
          <Card className="notification-table-card" bordered={false}>
            {isMobile ? (
              <div className="notification-mobile-list">
                {filteredNotifications.length === 0 ? (
                  <div className="notification-empty-state">
                    Không tìm thấy thông báo nào
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <Card
                      key={notif.id}
                      className="notification-mobile-card"
                      bordered={false}
                    >
                      <div className="notification-mobile-card__header">
                        <div>
                          <Text className="notification-mobile-id">
                            ID: {notif.id}
                          </Text>
                          <div className="notification-mobile-title">
                            {notif.title}
                          </div>
                        </div>
                      </div>

                      <div className="notification-mobile-card__meta">
                        <div className="notification-mobile-message">
                          {notif.message}
                        </div>
                        {notif.createdAt && (
                          <div className="notification-mobile-date">
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            {dayjs(notif.createdAt).format("DD/MM/YYYY HH:mm")}
                          </div>
                        )}
                      </div>

                      <div className="notification-mobile-card__footer">
                        <Tooltip title="Xem chi tiết">
                          <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleView(notif)}
                          />
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(notif)}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="Bạn có chắc muốn xóa thông báo này?"
                          onConfirm={() => handleDelete(notif.id)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <Tooltip title="Xóa">
                            <Button
                              icon={<DeleteOutlined />}
                              size="small"
                              danger
                            />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="notification-table-wrapper">
                <Table
                  dataSource={filteredNotifications}
                  columns={notificationColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="middle"
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Notification Modal */}
      <Modal
        title={
          editingNotification ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={isMobile ? "95%" : 600}
        className="notification-modal-responsive"
        centered
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
        width={isMobile ? "95%" : 600}
        className="notification-modal-responsive notification-detail-modal"
        centered
      >
        {viewingNotification && (
          <div>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <p>
                  <strong>ID:</strong> {viewingNotification.id}
                </p>
                <p>
                  <strong>Tiêu đề:</strong> {viewingNotification.title}
                </p>
              </Col>
              <Col xs={24} sm={24} md={12}>
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
