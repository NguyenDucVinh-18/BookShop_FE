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
  Statistic,
  DatePicker,
  Tooltip,
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

  if (selectedSlip) {
    return (
      <InventoryCountDetail
        slip={selectedSlip}
        onBack={() => setSelectedSlip(null)}
      />
    );
  }

  return (
    <div className="admin-responsive-container">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} className="admin-title-mobile">
          <UnorderedListOutlined style={{ marginRight: 12 }} />
          Danh sách phiếu kiểm kho
        </Title>
        <Text type="secondary" className="admin-subtitle-mobile">
          Quản lý và theo dõi các phiếu kiểm kho hàng
        </Text>
      </div>

      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }} className="stats-row-mobile">
        <Col xs={24} sm={12} md={12}>
          <Card className="admin-card-responsive dashboard-stat-card">
            <Statistic
              title="Tổng số phiếu kiểm kho"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Card className="admin-card-responsive dashboard-stat-card">
            <Statistic
              title="Tổng sản phẩm đã kiểm"
              value={stats.totalProducts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card className="admin-card-responsive">
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }} className="admin-filter-section">
          <Col xs={24} sm={12} md={8} lg={8} className="full-width-mobile">
            <Input
              placeholder="Tìm kiếm theo mã, tên hoặc ghi chú..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>

          <Col xs={24} sm={12} md={8} lg={6} className="full-width-mobile">
            <RangePicker
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
              size="large"
            />
          </Col>

          <Col xs={24} md={8} lg={10} style={{ textAlign: "right" }}>
            <Row gutter={[8, 8]} justify="end" className="admin-action-buttons">
              <Col xs={12} md={12}>
                <Tooltip title="Áp dụng bộ lọc">
                  <Button
                    icon={<FilterOutlined />}
                    onClick={handleFilter}
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <span className="hide-mobile">Lọc theo ngày</span>
                    <span className="show-mobile">Lọc</span>
                  </Button>
                </Tooltip>
              </Col>
              <Col xs={12} md={12}>
                <Tooltip title="Tạo phiếu kiểm kho mới">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={onCreateNew}
                    style={{ fontWeight: 500, width: "100%" }}
                  >
                    <span className="hide-mobile">Tạo phiếu mới</span>
                    <span className="show-mobile">Tạo mới</span>
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Bảng hiển thị */}
        <div className="admin-table-wrapper">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            className="admin-table-fixed"
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} phiếu`,
            }}
            scroll={{ x: 1100 }}
            bordered
          />
        </div>
      </Card>
    </div>
  );
};

export default InventoryCountList;