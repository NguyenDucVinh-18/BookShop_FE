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
  Avatar,
  Typography,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { createAccountCustomerAPI } from "../../service/auth.service";
import dayjs from "dayjs";
import {
  getAllCustomersAPI,
  updateInFo,
  updateInFoAccountAPI,
} from "../../service/user.service";
import "../../styles/CustomerManagement.css";

const { Text, Title } = Typography;

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const resGetAllCustomer = await getAllCustomersAPI();
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
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Đã kích hoạt" : "Chưa kích hoạt"}
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
              title="Sẽ mất toàn bộ dữ liệu liên quan. Bạn có chắc chắn muốn xóa tài khoản này?"
              onConfirm={() => handleDeleteAccount(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />{" "}
            </Popconfirm>{" "}
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

  const handleDeleteAccount = async (id) => {
    // TODO: Implement delete customer API
    message.warning("Chức năng xóa khách hàng đang được phát triển");
    // Uncomment when API is ready:
    // try {
    //   const res = await deleteCustomerAPI(id);
    //   if (res.status === "success") {
    //     showNotification("success", "Xóa khách hàng thành công!");
    //     fetchCustomers();
    //   } else {
    //     showNotification("error", res.message || "Xóa khách hàng thất bại");
    //   }
    // } catch (error) {
    //   showNotification("error", "Có lỗi xảy ra khi xóa khách hàng");
    // }
  };

  const handleSubmit = async (values) => {
    if (editingCustomer) {
      setLoading(true);
      const resUpdate = await updateInFoAccountAPI(
        editingCustomer.id,
        values.username,
        values.phone,
        values.email,
        "CUSTOMER",
        "customer"
      );
      if (resUpdate.status === "success") {
        showNotification(
          "success",
          "Cập nhật thông tin khách hàng thành công!"
        );
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
      setLoading(true);
      const resCreateAccount = await createAccountCustomerAPI(
        values.username,
        values.email,
        values.password,
        values.phone,
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

  const filteredCustomers = customers.filter((customer) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      customer.username?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchText)
    );
  });

  return (
    <div className="customer-page-container">
      <div className="customer-content">
        <div className="customer-panel">
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

          {/* Header */}
          <div className="customer-header">
            <div>
              <Title level={2} className="customer-title">
                Quản lý khách hàng
              </Title>
              <Text className="customer-subtitle">
                Quản lý và theo dõi thông tin khách hàng
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="customer-add-btn"
            >
              {isMobile ? "Thêm" : "Thêm tài khoản khách hàng"}
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="customer-filter-card" bordered={false}>
            <div className="customer-search-bar">
              <Search
                placeholder="Tìm kiếm khách hàng..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
              />
            </div>
          </Card>

          {/* Customer List */}
          <Card className="customer-table-card" bordered={false}>
            {isMobile ? (
              <div className="customer-mobile-list">
                {filteredCustomers.length === 0 ? (
                  <div className="customer-empty-state">
                    Không tìm thấy khách hàng nào
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      className="customer-mobile-card"
                      bordered={false}
                    >
                      <div className="customer-mobile-card__header">
                        <div>
                          <Text className="customer-mobile-id">
                            ID: {customer.id}
                          </Text>
                          <div className="customer-mobile-name">
                            {customer.username}
                          </div>
                        </div>
                      </div>

                      <div className="customer-mobile-card__meta">
                        <div className="customer-mobile-email">
                          <MailOutlined style={{ color: "#1890ff" }} />
                          <Text>{customer.email}</Text>
                        </div>
                        {customer.phone && (
                          <div className="customer-mobile-phone">
                            <PhoneOutlined style={{ color: "#52c41a" }} />
                            <Text>{customer.phone}</Text>
                          </div>
                        )}
                        <div className="customer-mobile-status">
                          <Tag color={customer.active ? "green" : "red"}>
                            {customer.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                          </Tag>
                        </div>
                        {customer.createdAt && (
                          <div className="customer-mobile-date">
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            {dayjs(customer.createdAt).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </div>
                        )}
                      </div>

                      <div className="customer-mobile-card__footer">
                        <Tooltip title="Xem chi tiết">
                          <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleView(customer)}
                          />
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(customer)}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="Sẽ mất toàn bộ dữ liệu liên quan. Bạn có chắc chắn muốn xóa tài khoản này?"
                          onConfirm={() => handleDeleteAccount(customer.id)}
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
              <div className="customer-table-wrapper">
                <Table
                  className="customer-management-table"
                  dataSource={filteredCustomers}
                  columns={customerColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="middle"
                />
              </div>
            )}
          </Card>
        </div>
      </div>

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
        width={isMobile ? "95%" : 500}
        className="customer-modal-responsive"
        centered
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
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            <UserOutlined style={{ color: "#1890ff" }} />
            Chi tiết khách hàng
          </div>
        }
        open={!!viewingCustomer}
        onCancel={() => setViewingCustomer(null)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setViewingCustomer(null)}
            style={{ minWidth: "100px" }}
          >
            Đóng
          </Button>,
        ]}
        width={isMobile ? "95%" : 700}
        className="customer-modal-responsive customer-detail-modal"
        centered
      >
        {viewingCustomer && (
          <div style={{ padding: "20px 0" }}>
            {/* Header with Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Avatar
                size={80}
                src={viewingCustomer.avatarUrl}
                icon={!viewingCustomer.avatarUrl && <UserOutlined />}
                style={{
                  marginRight: "16px",
                  border: "3px solid #f0f0f0",
                }}
              />
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#262626",
                  }}
                >
                  {viewingCustomer.username}
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "#8c8c8c",
                    fontSize: "14px",
                  }}
                >
                  ID: {viewingCustomer.id}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12}>
                <Card
                  size="small"
                  title="Thông tin liên hệ"
                  bordered={false}
                  style={{
                    backgroundColor: "#fafafa",
                    marginBottom: "16px",
                  }}
                  headStyle={{
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <MailOutlined
                        style={{ color: "#1890ff", fontSize: "16px" }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            marginBottom: "2px",
                          }}
                        >
                          Email
                        </div>
                        <div style={{ fontWeight: "500" }}>
                          {viewingCustomer.email}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <PhoneOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            marginBottom: "2px",
                          }}
                        >
                          Số điện thoại
                        </div>
                        <div style={{ fontWeight: "500" }}>
                          {viewingCustomer.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Card
                  size="small"
                  title="Trạng thái & Thời gian"
                  bordered={false}
                  style={{
                    backgroundColor: "#fafafa",
                    marginBottom: "16px",
                  }}
                  headStyle={{
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CheckCircleOutlined
                        style={{
                          color: viewingCustomer.active ? "#52c41a" : "#ff4d4f",
                          fontSize: "16px",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            marginBottom: "2px",
                          }}
                        >
                          Trạng thái
                        </div>
                        <Tag
                          color={
                            viewingCustomer.active === true
                              ? "success"
                              : "error"
                          }
                          style={{
                            margin: 0,
                            fontWeight: "500",
                          }}
                        >
                          {viewingCustomer.active === true
                            ? "Đã kích hoạt"
                            : "Chưa kích hoạt"}
                        </Tag>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CalendarOutlined
                        style={{ color: "#722ed1", fontSize: "16px" }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            marginBottom: "2px",
                          }}
                        >
                          Ngày tham gia
                        </div>
                        <div style={{ fontWeight: "500" }}>
                          {dayjs(viewingCustomer.createdAt).format(
                            "DD/MM/YYYY"
                          )}
                        </div>
                        <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                          {dayjs(viewingCustomer.createdAt).format("HH:mm:ss")}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

<style jsx>{`
  .customer-detail-modal .ant-modal-header {
    border-bottom: 2px solid #f0f0f0;
    padding: 20px 24px 16px;
  }

  .customer-detail-modal .ant-modal-body {
    padding: 0 24px 20px;
  }

  .customer-detail-modal .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
    text-align: center;
  }
`}</style>;

export default CommonCustomerManagement;
