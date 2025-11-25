import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Input,
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
  FileTextOutlined,
  FilterOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/AdminResponsive.css";
import "../../styles/InventoryCountList.css";
import { getAllInventoryCheckAPI, getInventoryChecksBetweenDatesAPI } from "../../service/inventoryCheck.service";
import InventoryCountDetail from "./InventoryCountDetail";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const InventoryCountList = ({ newSlip, onCreateNew }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [inventoryCheckReceipts, setInventoryCheckReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(1);
  const mobilePageSize = 3;

  const fetchInventoryCheck = async () => {
    setLoading(true);
    try {
      const res = await getAllInventoryCheckAPI();
      if (res && res.data && res.data.inventoryCheckReceipts) {
        setInventoryCheckReceipts(res.data.inventoryCheckReceipts);
      }
    } catch (error) {
      console.error("Error fetching inventory check receipts:", error);
      setInventoryCheckReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryCheck();
  }, []);

  // Refresh khi có phiếu mới
  useEffect(() => {
    if (newSlip) {
      fetchInventoryCheck();
    }
  }, [newSlip]);

  const handleFilter = async () => {
    if (Array.isArray(dateRange) && dateRange.length === 2) {
      const startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
      const endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");
      setLoading(true);
      try {
        const res = await getInventoryChecksBetweenDatesAPI(startDate, endDate);
        const data = res?.data?.inventoryCheckReceipts;
        setInventoryCheckReceipts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error filtering by date:", err);
        setInventoryCheckReceipts([]);
      } finally {
        setLoading(false);
      }
    } else {
      fetchInventoryCheck();
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stats = {
    total: inventoryCheckReceipts.length,
    totalProducts: inventoryCheckReceipts.reduce((sum, receipt) => sum + (receipt.details?.length || 0), 0),
  };

  const handleViewDetail = (record) => {
    setSelectedSlip(record);
  };

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      render: (text) => (
        <Text strong style={{ color: "#1890ff" }}>
          #{text}
        </Text>
      ),
    },
    {
      title: "Tên phiếu kiểm kho",
      dataIndex: "nameInventoryCheckReceipt",
      key: "nameInventoryCheckReceipt",
      width: 250,
      ellipsis: true,
      render: (text) => text || <Text type="secondary">Chưa đặt tên</Text>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => {
        const d = new Date(date);
        return (
          <Space direction="vertical" size={0}>
            <Text>{d.toLocaleDateString("vi-VN")}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {d.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Số sản phẩm",
      dataIndex: "details",
      key: "details",
      width: 130,
      align: "center",
      render: (details) => (
        <Tag color="blue" icon={<CheckCircleOutlined />}>
          {details?.length || 0} sản phẩm
        </Tag>
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
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<FileTextOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const filteredData = inventoryCheckReceipts.filter((item) => {
    const matchSearch =
      searchText === "" ||
      item.note?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nameInventoryCheckReceipt?.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.id).includes(searchText);
    return matchSearch;
  });

  useEffect(() => {
    setMobileCurrentPage(1);
  }, [filteredData]);

  const statCards = [
    {
      title: "Tổng số phiếu kiểm kho",
      value: stats.total,
      icon: <FileTextOutlined />,
      gradient: "inventory-count-gradient-blue",
    },
    {
      title: "Tổng sản phẩm đã kiểm",
      value: stats.totalProducts,
      icon: <CheckCircleOutlined />,
      gradient: "inventory-count-gradient-green",
    },
  ];

  const getPickerContainer = () => {
    if (filterDrawerVisible) {
      return document.querySelector(".inventory-count-filter-drawer .ant-drawer-body") || document.body;
    }
    return document.body;
  };

  const renderFilterContent = (isDrawer = false) => (
    <Row
      gutter={[16, 16]}
      align="middle"
      className={`inventory-count-filter-row ${isDrawer ? "inventory-count-filter-row--drawer" : ""}`}
    >
      <Col xs={24} sm={12} md={8} lg={8} className="full-width-mobile">
        <Input
          placeholder="Tìm kiếm theo mã, tên hoặc ghi chú..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size={isMobile ? "middle" : "large"}
        />
      </Col>

      <Col xs={24} sm={12} md={8} lg={6} className="full-width-mobile">
        <RangePicker
          style={{ width: "100%" }}
          placeholder={["Từ ngày", "Đến ngày"]}
          value={dateRange}
          onChange={setDateRange}
          format="DD/MM/YYYY"
          size={isMobile ? "middle" : "large"}
          allowClear
          showToday
          disabledDate={() => false}
          getPopupContainer={getPickerContainer}
        />
      </Col>

      <Col xs={24} md={8} lg={10}>
        <Row gutter={[12, 12]} justify={isDrawer ? "start" : "end"}>
          <Col xs={12} md={12}>
            <Tooltip title="Áp dụng bộ lọc">
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  handleFilter();
                  if (isDrawer) setFilterDrawerVisible(false);
                }}
                size={isMobile ? "middle" : "large"}
                className="inventory-count-filter-btn"
                block
              >
                Lọc
              </Button>
            </Tooltip>
          </Col>
          <Col xs={12} md={12}>
            <Tooltip title="Tạo phiếu kiểm kho mới">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size={isMobile ? "middle" : "large"}
                onClick={onCreateNew}
                className="inventory-count-create-btn"
                block
              >
                Tạo mới
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const renderMobileList = () => {
    if (filteredData.length === 0) {
      return (
        <div className="inventory-count-empty">
          <Empty description="Không có phiếu nào" />
        </div>
      );
    }

    const startIndex = (mobileCurrentPage - 1) * mobilePageSize;
    const paginated = filteredData.slice(startIndex, startIndex + mobilePageSize);
    return (
      <>
        <div className="inventory-count-mobile-list" id="inventory-count-mobile-list">
          {paginated.map((receipt) => {
            const d = new Date(receipt.createdAt);
            return (
              <Card key={receipt.id} className="inventory-count-mobile-card" hoverable>
                <div className="inventory-count-mobile-card__header">
                  <div>
                    <div className="inventory-count-mobile-id">#{receipt.id}</div>
                    <Text className="inventory-count-mobile-name">
                      {receipt.nameInventoryCheckReceipt || "Chưa đặt tên"}
                    </Text>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    icon={<FileTextOutlined />}
                    onClick={() => handleViewDetail(receipt)}
                  >
                    Chi tiết
                  </Button>
                </div>
                <div className="inventory-count-mobile-card__meta">
                  <div>
                    <Text type="secondary">Ngày tạo</Text>
                    <div className="inventory-count-mobile-date">
                      {d.toLocaleDateString("vi-VN")}{" "}
                      <span>{d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Số sản phẩm</Text>
                    <div className="inventory-count-mobile-products">
                      {receipt.details?.length || 0} sản phẩm
                    </div>
                  </div>
                </div>
                {receipt.note && (
                  <div className="inventory-count-mobile-note">
                    <Text type="secondary">Ghi chú:</Text> {receipt.note}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        {filteredData.length > mobilePageSize && (
          <div className="inventory-count-mobile-pagination">
            <Pagination
              current={mobileCurrentPage}
              total={filteredData.length}
              pageSize={mobilePageSize}
              onChange={(page) => {
                setMobileCurrentPage(page);
                const listEl = document.getElementById("inventory-count-mobile-list");
                if (listEl) {
                  listEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              simple
              showSizeChanger={false}
            />
          </div>
        )}
      </>
    );
  };

  if (selectedSlip) {
    return (
      <InventoryCountDetail
        slip={selectedSlip}
        onBack={() => setSelectedSlip(null)}
      />
    );
  }

  return (
    <div className="inventory-count-list-page">
      <div className="inventory-count-list-header">
        <div className="inventory-count-list-header-info">
          <UnorderedListOutlined className="inventory-count-list-header-icon" />
          <div>
            <Title level={2} className="inventory-count-list-title">
              Danh sách phiếu kiểm kho
            </Title>
            <Text className="inventory-count-list-subtitle">
              Quản lý và theo dõi các phiếu kiểm kho hàng
            </Text>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} className="inventory-count-stat-grid">
        {statCards.map((stat) => (
          <Col xs={12} sm={12} md={12} key={stat.title}>
            <Card className="inventory-count-stat-card" bordered={false}>
              <div className="inventory-count-stat-content">
                <div className="inventory-count-stat-info">
                  <Text className="inventory-count-stat-label">{stat.title}</Text>
                  <div className="inventory-count-stat-value">{stat.value}</div>
                </div>
                <div className={`inventory-count-stat-icon ${stat.gradient}`}>{stat.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="inventory-count-filter-card" bordered={false}>
        {isMobile ? (
          <>
            <Button
              className="inventory-count-mobile-filter-btn"
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
              block
            >
              Bộ lọc
            </Button>
            {renderFilterContent(false)}
          </>
        ) : (
          renderFilterContent(false)
        )}
      </Card>

      {isMobile ? (
        renderMobileList()
      ) : (
        <Card className="inventory-count-table-card" bordered={false}>
          <div className="inventory-count-table-wrapper">
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey="id"
              pagination={{
                total: filteredData.length,
                pageSize: 3,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) =>
                  `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} phiếu`,
              }}
              size="middle"
              scroll={{ x: 900 }}
            />
          </div>
        </Card>
      )}

      <Drawer
        title="Bộ lọc phiếu kiểm kho"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        className="inventory-count-filter-drawer"
        width="100%"
      >
        {renderFilterContent(true)}
      </Drawer>
    </div>
  );
};

export default InventoryCountList;