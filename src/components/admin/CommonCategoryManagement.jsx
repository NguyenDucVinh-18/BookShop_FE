import React, { useState, useEffect } from "react";
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
  Pagination,
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
import "../../styles/CategoryManagement.css";
import "../../styles/Dashboard.css";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(1);
  const mobilePageSize = 5;
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  // Reset mobile page to 1 when filtered categories change
  useEffect(() => {
    setMobileCurrentPage(1);
  }, [filteredCategories.length]);

  // Scroll to top of category list when page changes (only when page number actually changes, not on initial load)
  useEffect(() => {
    if (isMobile && mobileCurrentPage > 1) {
      setTimeout(() => {
        const categoryListElement = document.getElementById("category-mobile-list");
        if (categoryListElement) {
          categoryListElement.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    }
  }, [mobileCurrentPage]);

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
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
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
  const totalAll = totalCategories + totalSubCategories;
  const categoriesWithChildren = categories.filter(
    (cat) => cat.subCategories && cat.subCategories.length > 0
  ).length;

  // Stat cards configuration
  const statCards = [
    {
      label: "Tổng Danh Mục Chính",
      value: totalCategories,
      icon: <FolderOutlined />,
      gradientClass: "dashboard-gradient-blue",
    },
    {
      label: "Tổng Danh Mục Con",
      value: totalSubCategories,
      icon: <BookOutlined />,
      gradientClass: "dashboard-gradient-green",
    },
    {
      label: "Tổng Tất Cả",
      value: totalAll,
      icon: <AppstoreOutlined />,
      gradientClass: "dashboard-gradient-purple",
    },
    {
      label: "Danh Mục Có Con",
      value: categoriesWithChildren,
      icon: <FolderOutlined />,
      gradientClass: "dashboard-gradient-pink",
    },
  ];

  return (
    <div className="category-page-container">
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

      <div className="category-content">
        <div className="category-panel">
          {/* Header */}
          <div className="category-header">
            <Title level={2} className="category-title">
              Quản Lý Danh Mục
            </Title>
            <Text type="secondary" className="category-subtitle">
              Quản lý và tổ chức danh mục sản phẩm
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="category-stat-grid">
            {statCards.map((stat, index) => (
              <Col xs={12} sm={12} md={12} lg={6} key={index}>
                <Card className="category-card category-stat-card" bordered={false}>
                  <div className="category-stat-content">
                    <div className="category-stat-info">
                      <Text className="category-stat-label">{stat.label}</Text>
                      <div className="category-stat-value">{stat.value}</div>
                    </div>
                    <div className={`category-stat-icon ${stat.gradientClass}`}>
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Filter and Actions */}
          <Card className="category-card category-filter-card">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={24} md={12}>
                <Search
                  placeholder="Tìm kiếm danh mục..."
                  allowClear
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                  size={isMobile ? "middle" : "large"}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col xs={24} sm={24} md={12} style={{ textAlign: isMobile ? "left" : "right" }}>
                <Space
                  size={isMobile ? "small" : "middle"}
                  direction={isMobile ? "horizontal" : "horizontal"}
                  style={{ width: isMobile ? "100%" : "auto" }}
                >
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setSearchTerm("");
                      fetchCategories();
                    }}
                    size={isMobile ? "middle" : "large"}
                    style={{ width: isMobile ? "auto" : "auto" }}
                  >
                    {isMobile ? "Làm mới" : "Làm mới"}
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingCategory(null);
                      form.resetFields();
                      setModalVisible(true);
                    }}
                    className="category-add-btn"
                    size={isMobile ? "middle" : "large"}
                    style={{ width: isMobile ? "auto" : "auto" }}
                  >
                    {isMobile ? "Thêm" : "Thêm Danh Mục"}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Main Content Card */}
          <Card className="category-card category-table-card">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: "table",
                  label: (
                    <span>
                      <AppstoreOutlined />
                      <span className={isMobile ? "show-mobile" : ""}>Bảng</span>
                      {!isMobile && <span>Dạng Bảng</span>}
                    </span>
                  ),
                  children: isMobile ? (
                    <div className="category-mobile-list" id="category-mobile-list">
                      {flattenCategories(filteredCategories).length === 0 ? (
                        <div className="category-empty-state">
                          <Text>Không có danh mục nào.</Text>
                        </div>
                      ) : (
                        <>
                          {flattenCategories(filteredCategories)
                            .slice((mobileCurrentPage - 1) * mobilePageSize, mobileCurrentPage * mobilePageSize)
                            .map((category) => (
                              <Card
                                key={category.id}
                                className="category-mobile-card"
                                bordered={false}
                                bodyStyle={{ padding: 16 }}
                              >
                                <div className="category-mobile-card__header">
                                  <Space>
                                    {category.level === 1 && <div style={{ width: 20 }} />}
                                    {category.level === 0 ? (
                                      <FolderOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                                    ) : (
                                      <BookOutlined style={{ fontSize: 20, color: "#52c41a" }} />
                                    )}
                                    <Text strong={category.level === 0} className="category-mobile-name">
                                      {category.categoryName}
                                    </Text>
                                    {category.level === 0 && category.subCategories && (
                                      <Tag color="blue">{category.subCategories.length} danh mục con</Tag>
                                    )}
                                  </Space>
                                </div>
                                {category.description && (
                                  <div className="category-mobile-card__meta" style={{ marginTop: 12 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                      {category.description}
                                    </Text>
                                  </div>
                                )}
                                <div className="category-mobile-card__meta" style={{ marginTop: 8 }}>
                                  <Tag color={category.level === 0 ? "green" : "orange"}>
                                    {category.level === 0 ? "Danh mục chính" : "Danh mục con"}
                                  </Tag>
                                </div>
                                <div className="category-mobile-card__footer" style={{ marginTop: 12 }}>
                                  <Space size="small" wrap>
                                    <Button
                                      type="primary"
                                      ghost
                                      size="small"
                                      icon={<EditOutlined />}
                                      onClick={() => handleEdit(category)}
                                    >
                                      Sửa
                                    </Button>
                                    <Popconfirm
                                      title="Xóa danh mục"
                                      description="Bạn có chắc chắn muốn xóa danh mục này không?"
                                      onConfirm={() => handleDelete(category.id)}
                                      okText="Xóa"
                                      cancelText="Hủy"
                                      okButtonProps={{ danger: true }}
                                    >
                                      <Button danger size="small" icon={<DeleteOutlined />}>
                                        Xóa
                                      </Button>
                                    </Popconfirm>
                                  </Space>
                                </div>
                              </Card>
                            ))}
                          {flattenCategories(filteredCategories).length > mobilePageSize && (
                            <div className="category-mobile-pagination">
                              <Pagination
                                current={mobileCurrentPage}
                                total={flattenCategories(filteredCategories).length}
                                pageSize={mobilePageSize}
                                onChange={(page) => setMobileCurrentPage(page)}
                                showSizeChanger={false}
                                showQuickJumper={false}
                                showTotal={(total, range) =>
                                  `${range[0]}-${range[1]} / ${total} danh mục`
                                }
                                simple
                                size="small"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="category-table-wrapper">
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
                      />
                    </div>
                  ),
                },
                {
                  key: "tree",
                  label: (
                    <span>
                      <FolderOutlined />
                      <span className={isMobile ? "show-mobile" : ""}>Cây</span>
                      {!isMobile && <span>Dạng Cây</span>}
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
          </Card>
        </div>
      </div>

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
        width={isMobile ? "95%" : 600}
        className="category-modal-responsive"
        centered
        bodyStyle={{ padding: isMobile ? "16px" : "24px" }}
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
              size={isMobile ? "middle" : "large"}
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
            <Input
              placeholder="Nhập tên danh mục"
              size={isMobile ? "middle" : "large"}
            />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea
              rows={isMobile ? 3 : 4}
              placeholder="Nhập mô tả cho danh mục"
              size={isMobile ? "middle" : "large"}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "24px" }}>
            <Space
              style={{ width: "100%", justifyContent: isMobile ? "center" : "flex-end" }}
              direction={isMobile ? "vertical" : "horizontal"}
              size={isMobile ? "middle" : "large"}
            >
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingCategory(null);
                  form.resetFields();
                }}
                size={isMobile ? "middle" : "large"}
                style={{
                  minWidth: isMobile ? "100%" : "100px",
                  height: isMobile ? "40px" : "48px"
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size={isMobile ? "middle" : "large"}
                style={{
                  minWidth: isMobile ? "100%" : "120px",
                  height: isMobile ? "40px" : "48px"
                }}
              >
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
