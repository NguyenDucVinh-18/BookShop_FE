import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  Row,
  Col,
  Card,
  Select,
  InputNumber,
  message,
  Avatar,
  Typography,
  Divider,
  Statistic,
  Badge,
  Tooltip,
  Popconfirm,
  Empty,
  Spin,
  Tabs,
  Descriptions,
  Progress,
  Timeline,
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  TeamOutlined,
  BarChartOutlined,
  GiftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  MailOutlined,
  PhoneOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  getAllEmployeesAPI,
  updateActiveAccountAPI,
  updateInFoAccountAPI,
} from "../../service/user.service";
import dayjs from "dayjs";
import { createAccountAPI } from "../../service/auth.service";

const { Title, Text } = Typography;
const { Search } = Input;

const EmployeeManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewingEmployee, setViewingEmployee] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchText, selectedRole, selectedStatus]);

  const fetchEmployees = async () => {
    setTableLoading(true);
    try {
      const res = await getAllEmployeesAPI();
      if (res && res.data) {
        setEmployees(res.data.users);
      } else {
        message.error("Không thể lấy danh sách nhân viên");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setTableLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (emp) =>
          emp.username.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.phone.includes(searchText)
      );
    }

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((emp) => emp.role === selectedRole);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((emp) =>
        selectedStatus === "active" ? emp.active : !emp.active
      );
    }

    setFilteredEmployees(filtered);
  };

  const getEmployeeStats = () => {
    const total = employees.length;
    const active = employees.filter((emp) => emp.active).length;
    const staff = employees.filter((emp) => emp.role === "STAFF").length;
    const managers = employees.filter((emp) => emp.role === "MANAGER").length;

    return { total, active, staff, managers };
  };

  const stats = getEmployeeStats();

  const employeeColumns = [
    {
      title: "Thông tin nhân viên",
      key: "employee",
      width: 280,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: record.active ? "#1890ff" : "#d9d9d9",
              color: record.active ? "white" : "#999",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {record.username.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "2px",
              }}
            >
              {record.username}
            </div>
            <div
              style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}
            >
              <MailOutlined style={{ marginRight: "4px" }} />
              {record.email}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              <PhoneOutlined style={{ marginRight: "4px" }} />
              {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      width: 180,
      filters: [
        { text: "Nhân viên bán hàng", value: "STAFF" },
        { text: "Nhân viên quản lý", value: "MANAGER" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag
          icon={role === "STAFF" ? <UserOutlined /> : <UserSwitchOutlined />}
          color={role === "STAFF" ? "blue" : "orange"}
          style={{
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: "500",
            borderRadius: "16px",
          }}
        >
          {role === "STAFF" ? "Nhân viên bán hàng" : "Nhân viên quản lý"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      width: 140,
      filters: [
        { text: "Đang làm việc", value: true },
        { text: "Nghỉ việc", value: false },
      ],
      onFilter: (value, record) => record.active === value,
      render: (active) => (
        <Badge
          status={active ? "success" : "error"}
          text={
            <Tag
              icon={active ? <CheckCircleOutlined /> : <StopOutlined />}
              color={active ? "success" : "error"}
              style={{
                border: "none",
                fontSize: "12px",
                fontWeight: "500",
                borderRadius: "12px",
              }}
            >
              {active ? "Đang làm việc" : "Nghỉ việc"}
            </Tag>
          }
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              style={{ borderRadius: "6px" }}
              onClick={() => {
                setViewingEmployee(record);
                setIsDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              ghost
              style={{ borderRadius: "6px" }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip
            title={
              record.active
                ? "Cho nhân viên nghỉ việc"
                : "Kích hoạt lại nhân viên"
            }
          >
            <Popconfirm
              title={record.active ? "Nghỉ việc" : "Làm lại"}
              description={
                record.active
                  ? "Bạn có chắc chắn muốn cho nhân viên này nghỉ việc?"
                  : "Bạn có chắc chắn muốn kích hoạt lại nhân viên này?"
              }
              okText={record.active ? "Nghỉ việc" : "Làm lại"}
              cancelText="Hủy"
              okType={record.active ? "danger" : "primary"}
              onConfirm={
                () => handleToggleActive(record.id, !record.active) // bạn viết hàm này để gọi API update active
              }
            >
              <Button
                icon={record.active ? <StopOutlined /> : <ReloadOutlined />}
                size="small"
                danger={record.active} // đỏ nếu nghỉ việc
                type={!record.active ? "primary" : "default"} // xanh nếu làm lại
                style={{ borderRadius: "6px" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    if (editingEmployee) {
      setLoading(true);
      const resUpdate = await updateInFoAccountAPI(
        editingEmployee.id,
        values.username,
        values.phone,
        values.email,
        values.role
      );
      if (resUpdate.status === "success") {
        showNotification("success", "Cập nhật thông tin nhân viên thành công!");
        fetchEmployees();
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
      const resCreateAccount = await createAccountAPI(
        values.username,
        values.email,
        values.password,
        values.phone,
        values.role
      );
      if (resCreateAccount.status === "success") {
        showNotification("success", "Tạo tài khoản nhân viên thành công!");
        fetchEmployees();
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

  const handleToggleActive = async (id, isActive) => {
    setTableLoading(true);
    try {
      const res = await updateActiveAccountAPI(id, isActive);
      if (res && res.data && res.status === "success") {
        showNotification(
          "success",
          "Cập nhật trạng thái nhân viên thành công!"
        );
        fetchEmployees();
      } else {
        showNotification(
          "error",
          res.data.message || "Cập nhật trạng thái thất bại"
        );
      }
      setTableLoading(false);
    } catch (error) {
      showNotification("error", "Có lỗi xảy ra khi cập nhật trạng thái");
      setTableLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {/* Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            padding: "16px 24px",
            borderRadius: "12px",
            color: "white",
            fontWeight: "600",
            zIndex: 9999,
            boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                ? "#ff4d4f"
                : "#1890ff",
            border: `1px solid ${
              notification.type === "success"
                ? "#389e0d"
                : notification.type === "error"
                ? "#d9363e"
                : "#0958d9"
            }`,
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Header Section */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              <TeamOutlined style={{ marginRight: "8px" }} />
              Quản lý nhân viên
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Quản lý thông tin và tài khoản nhân viên trong hệ thống
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Button icon={<ExportOutlined />} style={{ borderRadius: "8px" }}>
                Xuất báo cáo
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  border: "none",
                  fontWeight: "600",
                  height: "44px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
                onClick={handleAdd}
              >
                Thêm nhân viên mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              color: "white",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  Tổng nhân viên
                </span>
              }
              value={stats.total}
              valueStyle={{
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
              }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
              border: "none",
              color: "white",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  Đang làm việc
                </span>
              }
              value={stats.active}
              valueStyle={{
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
              }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
              border: "none",
              color: "white",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  Nhân viên bán hàng
                </span>
              }
              value={stats.staff}
              valueStyle={{
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
              }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
              border: "none",
              color: "white",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>Quản lý</span>
              }
              value={stats.managers}
              valueStyle={{
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
              }}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{
                borderRadius: "8px",
              }}
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Chức vụ"
              allowClear
              size="large"
              style={{ width: "100%", borderRadius: "8px" }}
              value={selectedRole === "all" ? undefined : selectedRole}
              onChange={(value) => setSelectedRole(value || "all")}
            >
              <Select.Option value="STAFF">Nhân viên bán hàng</Select.Option>
              <Select.Option value="MANAGER">Nhân viên quản lý</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              size="large"
              style={{ width: "100%", borderRadius: "8px" }}
              value={selectedStatus === "all" ? undefined : selectedStatus}
              onChange={(value) => setSelectedStatus(value || "all")}
            >
              <Select.Option value="active">Đang làm việc</Select.Option>
              <Select.Option value="inactive">Nghỉ việc</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Employee Table */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Spin spinning={tableLoading}>
          <Table
            dataSource={filteredEmployees}
            columns={employeeColumns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} nhân viên`,
              style: { padding: "16px 24px" },
            }}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không tìm thấy nhân viên nào"
                />
              ),
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </Spin>
      </Card>

      {/* Employee Modal */}
      <Modal
        title={
          <div
            style={{ fontSize: "18px", fontWeight: "600", color: "#1890ff" }}
          >
            {editingEmployee ? (
              <>
                <EditOutlined style={{ marginRight: "8px" }} />
                Chỉnh sửa thông tin nhân viên
              </>
            ) : (
              <>
                <PlusOutlined style={{ marginRight: "8px" }} />
                Thêm nhân viên mới
              </>
            )}
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
        style={{ borderRadius: "12px" }}
        bodyStyle={{ padding: "24px" }}
      >
        <Divider style={{ margin: "16px 0 24px 0" }} />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role: "STAFF" }}
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label={
                  <span style={{ fontWeight: "600" }}>
                    <UserOutlined style={{ marginRight: "4px" }} />
                    Tên nhân viên
                  </span>
                }
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input
                  placeholder="Nhập tên nhân viên"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={
                  <span style={{ fontWeight: "600" }}>
                    <PhoneOutlined style={{ marginRight: "4px" }} />
                    Số điện thoại
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label={
              <span style={{ fontWeight: "600" }}>
                <MailOutlined style={{ marginRight: "4px" }} />
                Địa chỉ email
              </span>
            }
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              placeholder="Nhập địa chỉ email"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={editingEmployee ? 24 : 12}>
              <Form.Item
                name="role"
                label={
                  <span style={{ fontWeight: "600" }}>
                    <UserSwitchOutlined style={{ marginRight: "4px" }} />
                    Chức vụ
                  </span>
                }
              >
                <Select
                  placeholder="Chọn chức vụ"
                  style={{ borderRadius: "8px" }}
                >
                  <Select.Option value="STAFF">
                    <UserOutlined style={{ marginRight: "8px" }} />
                    Nhân viên bán hàng
                  </Select.Option>
                  <Select.Option value="MANAGER">
                    <UserSwitchOutlined style={{ marginRight: "8px" }} />
                    Nhân viên quản lý
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {!editingEmployee && (
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={
                    <span style={{ fontWeight: "600" }}>
                      <SettingOutlined style={{ marginRight: "4px" }} />
                      Mật khẩu
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Divider style={{ margin: "24px 0 20px 0" }} />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                size="large"
                style={{ borderRadius: "8px", minWidth: "100px" }}
                onClick={() => setIsModalVisible(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "120px",
                  background:
                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                {editingEmployee ? (
                  <>
                    <EditOutlined style={{ marginRight: "4px" }} />
                    Cập nhật
                  </>
                ) : (
                  <>
                    <PlusOutlined style={{ marginRight: "4px" }} />
                    Thêm mới
                  </>
                )}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Employee Detail Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              size={40}
              style={{
                backgroundColor: viewingEmployee?.active
                  ? "#1890ff"
                  : "#d9d9d9",
                color: viewingEmployee?.active ? "white" : "#999",
                fontWeight: "bold",
              }}
            >
              {viewingEmployee?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1890ff",
                }}
              >
                Chi tiết nhân viên: {viewingEmployee?.username}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                ID: {viewingEmployee?.id} |
                <Tag
                  size="small"
                  color={viewingEmployee?.active ? "success" : "error"}
                  style={{ marginLeft: "8px" }}
                >
                  {viewingEmployee?.active
                    ? "Đang hoạt động"
                    : "Không hoạt động"}
                </Tag>
              </div>
            </div>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsDetailModalVisible(false);
              handleEdit(viewingEmployee);
            }}
          >
            <EditOutlined /> Chỉnh sửa thông tin
          </Button>,
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}
      >
        {viewingEmployee && (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: (
                  <span>
                    <InfoCircleOutlined />
                    Thông tin cơ bản
                  </span>
                ),
                children: (
                  <div>
                    <Row gutter={[24, 24]}>
                      <Col span={12}>
                        <Card
                          title={
                            <span style={{ color: "#1890ff" }}>
                              <UserOutlined style={{ marginRight: "8px" }} />
                              Thông tin cá nhân
                            </span>
                          }
                          style={{ height: "100%" }}
                        >
                          <Descriptions column={1} size="small">
                            <Descriptions.Item
                              label={
                                <span style={{ fontWeight: "600" }}>
                                  Tên đầy đủ
                                </span>
                              }
                            >
                              <span
                                style={{ fontSize: "16px", fontWeight: "500" }}
                              >
                                {viewingEmployee.username}
                              </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                              label={
                                <span style={{ fontWeight: "600" }}>Email</span>
                              }
                            >
                              <span style={{ color: "#1890ff" }}>
                                <MailOutlined style={{ marginRight: "6px" }} />
                                {viewingEmployee.email}
                              </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                              label={
                                <span style={{ fontWeight: "600" }}>
                                  Số điện thoại
                                </span>
                              }
                            >
                              <span style={{ color: "#52c41a" }}>
                                <PhoneOutlined style={{ marginRight: "6px" }} />
                                {viewingEmployee.phone}
                              </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                              label={
                                <span style={{ fontWeight: "600" }}>
                                  Ngày tạo tài khoản
                                </span>
                              }
                            >
                              <span>
                                <CalendarOutlined
                                  style={{ marginRight: "6px" }}
                                />
                                {dayjs(viewingEmployee.createdAt).format(
                                  "DD/MM/YYYY"
                                ) || "Chưa cập nhật"}
                              </span>
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card
                          title={
                            <span style={{ color: "#52c41a" }}>
                              <TrophyOutlined style={{ marginRight: "8px" }} />
                              Thông tin công việc
                            </span>
                          }
                          style={{ height: "100%" }}
                        >
                          <Descriptions column={1} size="small">
                            <Descriptions.Item
                              label={
                                <span style={{ fontWeight: "600" }}>
                                  Chức vụ
                                </span>
                              }
                            >
                              <Tag
                                icon={
                                  viewingEmployee.role === "STAFF" ? (
                                    <UserOutlined />
                                  ) : (
                                    <UserSwitchOutlined />
                                  )
                                }
                                color={
                                  viewingEmployee.role === "STAFF"
                                    ? "blue"
                                    : "orange"
                                }
                                style={{
                                  fontSize: "13px",
                                  padding: "4px 12px",
                                }}
                              >
                                {viewingEmployee.role === "STAFF"
                                  ? "Nhân viên bán hàng"
                                  : "Nhân viên quản lý"}
                              </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item
                              label={
                                <span style={{ fontWeight: "600" }}>
                                  Trạng thái
                                </span>
                              }
                            >
                              <Badge
                                status={
                                  viewingEmployee.active ? "success" : "error"
                                }
                                text={
                                  <Tag
                                    color={
                                      viewingEmployee.active
                                        ? "success"
                                        : "error"
                                    }
                                    style={{
                                      border: "none",
                                      fontSize: "13px",
                                      padding: "4px 12px",
                                    }}
                                  >
                                    {viewingEmployee.active
                                      ? "Đang làm việc"
                                      : "Nghỉ việc"}
                                  </Tag>
                                }
                              />
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ),
              },
              {
                key: "2",
                label: (
                  <span>
                    <BarChartOutlined />
                    Thống kê & Báo cáo
                  </span>
                ),
                children: (
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Card style={{ textAlign: "center" }}>
                          <Statistic
                            title="Số ngày làm việc"
                            value={Math.floor(Math.random() * 20) + 22}
                            suffix="/ tháng"
                            valueStyle={{ color: "#1890ff" }}
                            prefix={<CalendarOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card style={{ textAlign: "center" }}>
                          <Statistic
                            title="Đơn hàng xử lý"
                            value={Math.floor(Math.random() * 50) + 120}
                            suffix="đơn"
                            valueStyle={{ color: "#52c41a" }}
                            prefix={<TrophyOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card style={{ textAlign: "center" }}>
                          <Statistic
                            title="Đánh giá trung bình"
                            value={4.2 + Math.random() * 0.8}
                            precision={1}
                            suffix="/ 5.0"
                            valueStyle={{ color: "#fa8c16" }}
                            prefix={<TrophyOutlined />}
                          />
                        </Card>
                      </Col>
                    </Row>

                    <Card
                      title="Hiệu suất làm việc theo tháng"
                      style={{ marginTop: "16px" }}
                    >
                      <div style={{ padding: "20px", textAlign: "center" }}>
                        <Progress
                          type="dashboard"
                          percent={Math.floor(Math.random() * 30) + 70}
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                          }}
                          format={(percent) => `${percent}%`}
                        />
                        <div style={{ marginTop: "16px", color: "#666" }}>
                          Hiệu suất làm việc tổng thể tháng này
                        </div>
                      </div>
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Modal>

      <style jsx global>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: white;
        }
        .ant-table-thead > tr > th {
          background: #f0f2f5;
          font-weight: 600;
          border-bottom: 2px solid #e8e8e8;
        }
        .ant-modal-header {
          border-radius: 12px 12px 0 0;
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(300px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeManagement;
