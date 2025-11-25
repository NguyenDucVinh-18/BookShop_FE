import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Select,
  Row,
  Col,
  Input,
  Statistic,
  DatePicker,
  Tooltip,
  Drawer,
  Empty,
  Pagination,
} from "antd";
import {
  UnorderedListOutlined,
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  ExportOutlined,
  FileTextOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import ImportExportDetail from "./ImportExportDetail";
import {
  getAllReceiptsAPI,
  getReceiptByIdAPI,
  getReceiptsBetweenDatesAPI,
} from "../../service/inventory.service";
import dayjs from "dayjs";
import "../../styles/ImportExportList.css";
import "../../styles/Dashboard.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ImportExportList = ({ newSlip, onCreateNew }) => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [stockReceipts, setStockReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(1);
  const mobilePageSize = 4;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPickerContainer = (trigger) => {
    const drawerBody = document.querySelector(
      ".import-export-list-filter-drawer .ant-drawer-body"
    );
    if (drawerBody && drawerBody.contains(trigger)) {
      return drawerBody;
    }
    return document.body;
  };

  const fetchStockReceipts = async () => {
    setLoading(true);
    try {
      const res = await getAllReceiptsAPI();
      setStockReceipts(res.data.stockReceipts);
    } catch (error) {
      console.error("Error fetching stock receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockReceipts();
  }, []);

  // Reset mobile page when filters change
  useEffect(() => {
    setMobileCurrentPage(1);
  }, [searchText, typeFilter, dateRange]);

  const handleFilter = async () => {
    if (Array.isArray(dateRange) && dateRange.length === 2) {
      const startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
      const endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");
      setLoading(true);
      try {
        const res = await getReceiptsBetweenDatesAPI(startDate, endDate);
        const data = res?.data?.stockReceipts;
        setStockReceipts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error filtering by date:", err);
        setStockReceipts([]); // fallback rỗng nếu lỗi
      } finally {
        setLoading(false);
      }
    } else {
      // nếu chưa chọn ngày => load toàn bộ
      fetchStockReceipts();
    }
  };


  const stats = {
    total: stockReceipts.length,
    import: stockReceipts.filter((r) => r.typeStockReceipt === "IMPORT").length,
    export: stockReceipts.filter((r) => r.typeStockReceipt === "EXPORT").length,
  };

  const statCards = [
    {
      title: "Tổng số phiếu",
      value: stats.total,
      icon: <FileTextOutlined />,
      gradient: "dashboard-gradient-blue",
    },
    {
      title: "Phiếu nhập kho",
      value: stats.import,
      icon: <ImportOutlined />,
      gradient: "dashboard-gradient-green",
    },
    {
      title: "Phiếu xuất kho",
      value: stats.export,
      icon: <ExportOutlined />,
      gradient: "dashboard-gradient-pink",
    },
  ];

  const handleCloseDrawer = () => {
    setFilterDrawerVisible(false);
    handleFilter();
  };

  const renderFilterContent = (isDrawer = false) => (
    <Row
      gutter={[16, 16]}
      align="middle"
      className={`import-export-list-filter-row ${isDrawer ? "import-export-list-filter-row--drawer" : ""}`}
    >
      <Col xs={24} sm={12} md={8} lg={6} className="full-width-mobile">
        <Input
          placeholder="Tìm kiếm theo mã, tên hoặc ghi chú..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size={isMobile ? "middle" : "large"}
        />
      </Col>

      <Col xs={12} sm={6} md={4} lg={3} className="full-width-mobile">
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: "100%" }}
          placeholder="Loại phiếu"
          allowClear
          size={isMobile ? "middle" : "large"}
        >
          <Option value="all">Tất cả</Option>
          <Option value="IMPORT">Nhập kho</Option>
          <Option value="EXPORT">Xuất kho</Option>
        </Select>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6} className="full-width-mobile">
        <RangePicker
          style={{ width: "100%" }}
          placeholder={["Từ ngày", "Đến ngày"]}
          value={dateRange}
          onChange={setDateRange}
          format="DD/MM/YYYY"
          size={isMobile ? "middle" : "large"}
          getPopupContainer={getPickerContainer}
          allowClear
          showToday
          disabledDate={(current) => {
            // Allow all dates - no restrictions
            return false;
          }}
        />
      </Col>

      {!isDrawer && (
        <Col xs={24} md={6} lg={5} style={{ textAlign: "right" }}>
          <Row gutter={[8, 8]} justify="end" className="admin-action-buttons">
            <Col xs={12} md={24}>
              <Tooltip title="Áp dụng bộ lọc">
                <Button
                  icon={<FilterOutlined />}
                  onClick={handleFilter}
                  style={{ height: 40, width: "100%" }}
                  size={isMobile ? "middle" : "large"}
                >
                  Lọc
                </Button>
              </Tooltip>
            </Col>
            <Col xs={12} md={24}>
              <Tooltip title="Tạo phiếu mới">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size={isMobile ? "middle" : "large"}
                  onClick={onCreateNew}
                  style={{ height: 40, fontWeight: 500, width: "100%" }}
                >
                  {isMobile ? "Mới" : "Tạo phiếu mới"}
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      )}

      {isDrawer && (
        <Col span={24}>
          <div className="import-export-list-filter-actions">
            <Button
              type="primary"
              className="import-export-list-filter-action-btn"
              onClick={handleCloseDrawer}
              block
            >
              Áp dụng
            </Button>
            <Button
              className="import-export-list-filter-action-btn"
              onClick={() => {
                setDateRange([]);
                setTypeFilter("all");
                setSearchText("");
                handleCloseDrawer();
              }}
              block
            >
              Đặt lại
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );

  const renderMobileCards = () => {
    if (filteredData.length === 0) {
      return (
        <div className="import-export-list-empty-state">
          <Empty description="Không có phiếu nào" />
        </div>
      );
    }

    // Pagination for mobile
    const startIndex = (mobileCurrentPage - 1) * mobilePageSize;
    const endIndex = startIndex + mobilePageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
      <>
        <div className="import-export-list-mobile-list" id="import-export-list-mobile-list">
          {paginatedData.map((slip) => {
            const d = new Date(slip.createdAt);
            return (
              <Card key={slip.id} className="import-export-list-mobile-card">
                <div className="import-export-list-mobile-card__header">
                  <div>
                    <Text strong className="import-export-list-mobile-id">
                      #{slip.id}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      {slip.typeStockReceipt === "IMPORT" ? (
                        <Tag icon={<ImportOutlined />} color="success">
                          Nhập kho
                        </Tag>
                      ) : (
                        <Tag icon={<ExportOutlined />} color="warning">
                          Xuất kho
                        </Tag>
                      )}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    ghost
                    icon={<FileTextOutlined />}
                    onClick={() => getSlipById(slip.id)}
                    size="small"
                  >
                    Chi tiết
                  </Button>
                </div>

                <div className="import-export-list-mobile-card__meta">
                  <div className="import-export-list-mobile-name">
                    {slip.nameStockReceipt || "Chưa đặt tên"}
                  </div>
                  <div className="import-export-list-mobile-date">
                    {d.toLocaleDateString("vi-VN")} {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="import-export-list-mobile-items">
                    <Tag color="blue">{slip.details?.length || 0} mặt hàng</Tag>
                  </div>
                  {slip.note && (
                    <div className="import-export-list-mobile-note">
                      {slip.note}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        {filteredData.length > mobilePageSize && (
          <div className="import-export-list-mobile-pagination">
            <Pagination
              current={mobileCurrentPage}
              total={filteredData.length}
              pageSize={mobilePageSize}
              onChange={(page) => {
                setMobileCurrentPage(page);
                // Scroll to top of list
                const listElement = document.getElementById("import-export-list-mobile-list");
                if (listElement && page > 1) {
                  listElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              simple
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} / ${total} phiếu`
              }
            />
          </div>
        )}
      </>
    );
  };

  const getSlipById = async (id) => {
    // Scroll to top first
    window.scrollTo({ top: 0, behavior: "smooth" });

    const res = await getReceiptByIdAPI(id);
    if (res && res.data) {
      setSelectedSlip(res.data.stockReceipt);
    } else {
      setSelectedSlip(null);
    }
  }

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "id",
      key: "id",
      width: 55,
      fixed: "left",
      render: (text) => (
        <Text strong style={{ color: "#1890ff" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Tên phiếu",
      dataIndex: "nameStockReceipt",
      key: "nameStockReceipt",
      width: 200,
      ellipsis: true,
      render: (text) => text || <Text type="secondary">Chưa đặt tên</Text>,
    },
    {
      title: "Loại phiếu",
      dataIndex: "typeStockReceipt",
      key: "typeStockReceipt",
      width: 90,
      align: "center",
      render: (type) =>
        type === "IMPORT" ? (
          <Tag icon={<ImportOutlined />} color="success">
            Nhập kho
          </Tag>
        ) : (
          <Tag icon={<ExportOutlined />} color="warning">
            Xuất kho
          </Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 90,
      render: (date) => {
        const d = new Date(date);
        return (
          <Space direction="vertical" size={0}>
            <Text>{d.toLocaleDateString("vi-VN")}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {d.toLocaleTimeString("vi-VN")}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Số lượng mặt hàng",
      dataIndex: "details",
      key: "details",
      width: 90,
      align: "center",
      render: (details) => (
        <Tag color="blue">{details?.length || 0} mặt hàng</Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      ellipsis: true,
      render: (text) => text || <Text type="secondary">Không có ghi chú</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 110,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<FileTextOutlined />}
          onClick={() => getSlipById(record.id)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // const allData = newSlip
  //   ? [
  //     {
  //       key: "new",
  //       ...newSlip,
  //       products: newSlip.products || [],
  //     },
  //     ...stockReceipts,
  //   ]
  //   : stockReceipts;

  const filteredData = stockReceipts.filter((item) => {
    const matchType =
      typeFilter === "all" || item.typeStockReceipt === typeFilter;
    const matchSearch =
      searchText === "" ||
      item.note?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nameStockReceipt?.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.id).includes(searchText);
    const matchDate =
      !dateRange || dateRange.length === 0
        ? true
        : dayjs(item.createdAt).valueOf() >=
        dayjs(dateRange[0]).startOf("day").valueOf() &&
        dayjs(item.createdAt).valueOf() <=
        dayjs(dateRange[1]).endOf("day").valueOf();
    return matchType && matchSearch && matchDate;
  });

  if (selectedSlip) {
    return (
      <ImportExportDetail
        slip={selectedSlip}
        onBack={() => setSelectedSlip(null)}
      />
    );
  }

  return (
    <div className="import-export-list-page-container">
      <div className="import-export-list-content">
        <div className="import-export-list-panel">
          {/* Header */}
          <div className="import-export-list-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="import-export-list-icon">
                <UnorderedListOutlined style={{ fontSize: isMobile ? 20 : 24, color: "#fff" }} />
              </div>
              <div>
                <Title level={2} className="import-export-list-title">
                  Quản lý phiếu nhập xuất kho
                </Title>
                <Text className="import-export-list-subtitle">
                  Theo dõi và quản lý toàn bộ hoạt động nhập xuất hàng hóa
                </Text>
              </div>
            </div>
          </div>

          {/* Thống kê */}
          <Row gutter={[16, 16]} className="import-export-list-stat-grid">
            {statCards.map((stat, index) => (
              <Col xs={12} sm={12} md={12} lg={8} key={index}>
                <Card className="import-export-list-card" bordered={false}>
                  <div className="import-export-list-stat-content">
                    <div className="import-export-list-stat-info">
                      <Text className="import-export-list-stat-label">{stat.title}</Text>
                      <div className="import-export-list-stat-value">{stat.value}</div>
                    </div>
                    <div className={`import-export-list-stat-icon ${stat.gradient}`}>
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Bộ lọc */}
          <Card className="import-export-list-filter-card">
            {isMobile ? (
              <>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  block
                  size="large"
                  className="import-export-list-mobile-filter-btn"
                  onClick={() => setFilterDrawerVisible(true)}
                >
                  Bộ lọc nâng cao
                </Button>
                <Drawer
                  title="Bộ lọc phiếu nhập xuất"
                  placement="bottom"
                  open={filterDrawerVisible}
                  onClose={() => setFilterDrawerVisible(false)}
                  height="auto"
                  className="import-export-list-filter-drawer"
                >
                  {renderFilterContent(true)}
                </Drawer>
              </>
            ) : (
              renderFilterContent(false)
            )}
          </Card>

          {/* Bảng hiển thị */}
          <Card className="import-export-list-table-card">
            {isMobile ? (
              renderMobileCards()
            ) : (
              <div className="import-export-list-table-wrapper">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    total: filteredData.length,
                    pageSize: 4,
                    showSizeChanger: false,
                    showQuickJumper: false,
                    showTotal: (total, range) =>
                      `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} phiếu`,
                  }}
                  size="middle"
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImportExportList;
