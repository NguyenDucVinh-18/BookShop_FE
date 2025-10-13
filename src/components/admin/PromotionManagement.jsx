import React, { useContext, useEffect, useState } from "react";
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
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import {
  createPromotionAPI,
  deletePromotionAPI,
  getAllPromotionsAPI,
  updatePromotionAPI,
} from "../../service/promotion.service";

const PromotionManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [form] = Form.useForm();
  const [promotions, setPromotions] = useState([]);
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

  const fetchPromotions = async () => {
    const res = await getAllPromotionsAPI();
    if (res && res.data) {
      setPromotions(res.data.promotions);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const promotionColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tên khuyến mãi", dataIndex: "name", key: "name" },
    {
      title: "Giảm giá",
      dataIndex: "discountPercent",
      key: "discountPercent",
      render: (discountPercent) => `${discountPercent}%`,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          ACTIVE: { color: "green", text: "Đang hoạt động" },
          EXPIRED: { color: "red", text: "Đã hết hạn" },
          INACTIVE: { color: "default", text: "Chưa kích hoạt" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa khuyến mãi"
              description="Bạn có chắc chắn muốn xóa khuyến mãi này không?"
              onConfirm={() => handleDeletePromotion(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                type="text"
                style={{ color: "#ff4d4f" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddPromotion = async (newPromotion) => {
    const res = await createPromotionAPI(newPromotion);
    if (res && res.data) {
      fetchPromotions();
      showNotification("success", "Thêm khuyến mãi thành công!");
      setIsModalVisible(false);
      form.resetFields();
    } else {
      showNotification("error", res.message || "Thêm khuyến mãi thất bại!");
    }
  };

  const handleEditPromotion = async (id, updatedPromotion) => {
    const res = await updatePromotionAPI(id, updatedPromotion);
    if (res && res.data) {
      fetchPromotions();
      showNotification("success", "Cập nhật khuyến mãi thành công!");
      setIsModalVisible(false);
      setEditingPromotion(null);
      form.resetFields();
    } else {
      showNotification("error", res.message || "Cập nhật khuyến mãi thất bại!");
    }
  };

  const handleDeletePromotion = async (id) => {
    const res = await deletePromotionAPI(id);
    if (res && res.data) {
      fetchPromotions();
      showNotification("success", "Xóa khuyến mãi thành công!");
    } else {
      showNotification("error", res.message || "Xóa khuyến mãi thất bại!");
    }
  };

  const handleAdd = () => {
    setEditingPromotion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    form.setFieldsValue(promotion);
    setIsModalVisible(true);
  };

  const handleDelete = (promotionId) => {
    onDeletePromotion(promotionId);
    message.success("Đã xóa khuyến mãi thành công!");
  };

  const handleSubmit = (values) => {
    if (editingPromotion) {
      handleEditPromotion(editingPromotion.id, values);
    } else {
      handleAddPromotion(values);
    }
  };

  return (
    <div className="promotions-content">
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
        <h2>Quản lý khuyến mãi</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm khuyến mãi
        </Button>
      </div>

      <Table
        dataSource={promotions}
        columns={promotionColumns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Promotion Modal */}
      <Modal
        title={
          editingPromotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên khuyến mãi"
            rules={[
              { required: true, message: "Vui lòng nhập tên khuyến mãi!" },
            ]}
          >
            <Input placeholder="Nhập tên khuyến mãi" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã khuyến mãi"
            rules={[
              { required: true, message: "Vui lòng nhập mã khuyến mãi!" },
            ]}
          >
            <Input placeholder="Nhập mã khuyến mãi" />
          </Form.Item>

          <Form.Item
            name="discountPercent"
            label="Phần trăm giảm giá"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá!" },
            ]}
          >
            <InputNumber
              placeholder="Nhập phần trăm"
              style={{ width: "100%" }}
              min={0}
              max={100}
              formatter={(value) => `${value}`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả khuyến mãi" rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPromotion ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
