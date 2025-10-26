import React, { useState, useEffect, use } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip,
  Divider,
  Tree,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  BookOutlined,
  AppstoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  createCategoryAPI,
  deleteCategoryAPI,
  getAllCategoriesAPI,
  updateCategoryAPI,
} from "../../service/category.service";
import "../../styles/AdminResponsive.css";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const CommonCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
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

  const flattenCategories = (categories) => {
    const flattened = [];
    categories.forEach((category) => {
      flattened.push({ ...category, level: 0 });
      if (category.subCategories) {
        category.subCategories.forEach((subCat) => {
          flattened.push({
            ...subCat,
            level: 1,
            parentId: category.id,
            parentName: category.categoryName,
          });
        });
      }
    });
    return flattened;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.categoryName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (category.subCategories &&
            category.subCategories.some(
              (sub) =>
                sub.categoryName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                sub.description.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await getAllCategoriesAPI();
    const parentRes = await getAllCategoriesAPI();
    if (res && res.data) {
      setCategories(res.data.categories);
      setFilteredCategories(res.data.categories);
    }
    if (parentRes && parentRes.data) {
      setParentCategories(parentRes.data.categories);
    }

    setLoading(false);
  };

  const getParentCategories = () => {
    return parentCategories
      .filter((cat) => !cat.parentId)
      .map((cat) => ({
        label: cat.categoryName,
        value: cat.id,
      }));
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingCategory) {
        const resUpdate = await updateCategoryAPI(editingCategory.id, values);
        if (resUpdate && resUpdate.data) {
          setModalVisible(false);
          setEditingCategory(null);
          fetchCategories();
          form.resetFields();
          showNotification("success", "Cập nhật danh mục thành công!");
        } else {
          showNotification(
            "error",
            resUpdate.message || "Cập nhật danh mục thất bại!"
          );
        }
      } else {
        const resCreate = await createCategoryAPI(values);
        if (resCreate && resCreate.data) {
          setModalVisible(false);
          setEditingCategory(null);
          fetchCategories();
          form.resetFields();
          showNotification("success", "Thêm danh mục thành công!");
        } else {
          showNotification(
            "error",
            resCreate.message || "Thêm danh mục thất bại!"
          );
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    try {
      const res = await deleteCategoryAPI(id);
      if (res && res.data) {
        fetchCategories();
        showNotification("success", "Xóa danh mục thành công!");
      } else {
        showNotification("error", res.message || "Xóa danh mục thất bại!");
      }
    } catch (error) {
      showNotification("error", "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text, record) => (
        <Space>
          {record.level === 1 && <div style={{ width: 20 }} />}
          {record.level === 0 ? <FolderOutlined /> : <BookOutlined />}
          <Text strong={record.level === 0}>{text}</Text>
          {record.level === 0 && record.subCategories && (
            <Tag color="blue">{record.subCategories.length} danh mục con</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Cấp Độ",
      key: "level",
      render: (_, record) => (
        <Tag color={record.level === 0 ? "green" : "orange"}>
          {record.level === 0 ? "Danh mục chính" : "Danh mục con"}
        </Tag>
      ),
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Convert data to tree format
  const convertToTreeData = (categories) => {
    return categories.map((category) => ({
      title: (
        <Space>
          <FolderOutlined />
          <Text strong>{category.categoryName}</Text>
          {category.subCategories && (
            <Tag color="blue">{category.subCategories.length}</Tag>
          )}
        </Space>
      ),
      key: category.id.toString(),
      children: category.subCategories
        ? category.subCategories.map((sub) => ({
          title: (
            <Space>
              <BookOutlined />
              <Text>{sub.categoryName}</Text>
            </Space>
          ),
          key: sub.id.toString(),
          isLeaf: true,
        }))
        : undefined,
    }));
  };

  // Statistics
  const totalCategories = categories.length;
  const totalSubCategories = categories.reduce(
    (acc, cat) => acc + (cat.subCategories ? cat.subCategories.length : 0),
    0
  );

  return (
    <div className="admin-responsive-container">
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

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Danh Mục Chính"
                value={totalCategories}
                prefix={<FolderOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Danh Mục Con"
                value={totalSubCategories}
                prefix={<BookOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Tất Cả"
                value={totalCategories + totalSubCategories}
                prefix={<AppstoreOutlined style={{ color: "#722ed1" }} />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Danh Mục Có Con"
                value={
                  categories.filter(
                    (cat) => cat.subCategories && cat.subCategories.length > 0
                  ).length
                }
                prefix={<FolderOutlined style={{ color: "#fa8c16" }} />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        <div className="admin-card-responsive" style={{ marginBottom: "16px" }}>
          <Row justify="space-between" align="middle" className="admin-filter-section">
            <Col xs={24} sm={24} md={8} lg={6}>
              <Title level={3} className="admin-title-mobile">Quản Lý Danh Mục</Title>
            </Col>
            <Col xs={24} sm={24} md={16} lg={18}>
              <Space className="full-width-mobile" size="small" style={{ width: "100%" }}>
                <Search
                  placeholder="Tìm kiếm danh mục..."
                  allowClear
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                  style={{ flex: 1 }}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => setSearchTerm("")}
                  className="hide-mobile"
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingCategory(null);
                    form.resetFields();
                    setModalVisible(true);
                  }}
                  className="full-width-mobile"
                >
                  <span className="hide-mobile">Thêm Danh Mục</span>
                  <span className="show-mobile">Thêm</span>
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <div className="admin-card-responsive">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "table",
                label: (
                  <span>
                    <AppstoreOutlined />
                    <span className="hide-mobile">Dạng Bảng</span>
                    <span className="show-mobile">Bảng</span>
                  </span>
                ),
                children: (
                  <div className="admin-table-wrapper">
                    <Table
                      columns={columns}
                      dataSource={flattenCategories(filteredCategories)}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} danh mục`,
                      }}
                      size="middle"
                      scroll={{ x: 600 }}
                    />
                  </div>
                ),
              },
              {
                key: "tree",
                label: (
                  <span>
                    <FolderOutlined />
                    <span className="hide-mobile">Dạng Cây</span>
                    <span className="show-mobile">Cây</span>
                  </span>
                ),
                children: (
                  <Tree
                    showIcon
                    defaultExpandAll
                    treeData={convertToTreeData(filteredCategories)}
                    style={{
                      background: "#fff",
                      padding: "16px",
                      borderRadius: "6px",
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        className="category-modal-responsive"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Danh Mục Cha (Tùy chọn)"
            name="parentId"
            help="Để trống nếu muốn tạo danh mục chính"
          >
            <Select
              placeholder="Chọn danh mục cha"
              allowClear
              options={getParentCategories()}
            />
          </Form.Item>

          <Form.Item
            label="Tên Danh Mục"
            name="categoryName"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả cho danh mục" />
          </Form.Item>

          <Form.Item style={{ marginTop: "24px" }}>
            <Space style={{ float: "right" }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingCategory(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCategory ? "Cập Nhật" : "Thêm Mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommonCategoryManagement;
