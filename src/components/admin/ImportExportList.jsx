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
import "../../styles/AdminResponsive.css";

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

  const getSlipById = async (id) => {
    const res = await getReceiptByIdAPI(id);
    if(res && res.data){
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
    return matchType && matchSearch;
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
    <div className="admin-responsive-container">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} className="admin-title-mobile">
          <UnorderedListOutlined style={{ marginRight: 12 }} />
          Quản lý phiếu nhập xuất kho
        </Title>
        <Text type="secondary" className="admin-subtitle-mobile">
          Theo dõi và quản lý toàn bộ hoạt động nhập xuất hàng hóa
        </Text>
      </div>

      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }} className="stats-row-mobile">
        <Col xs={24} sm={8} md={8}>
          <Card className="admin-card-responsive dashboard-stat-card">
            <Statistic
              title="Tổng số phiếu"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card className="admin-card-responsive dashboard-stat-card">
            <Statistic
              title="Phiếu nhập kho"
              value={stats.import}
              prefix={<ImportOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card className="admin-card-responsive dashboard-stat-card">
            <Statistic
              title="Phiếu xuất kho"
              value={stats.export}
              prefix={<ExportOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card className="admin-card-responsive">
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }} className="admin-filter-section">
          <Col xs={24} sm={12} md={8} lg={6} className="full-width-mobile">
            <Input
              placeholder="Tìm kiếm theo mã, tên hoặc ghi chú..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>

          <Col xs={12} sm={6} md={4} lg={3} className="full-width-mobile">
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              placeholder="Loại phiếu"
              allowClear
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
            />
          </Col>

          <Col xs={24} md={6} lg={5} style={{ textAlign: "right" }}>
            <Row gutter={[8, 8]} justify="end" className="admin-action-buttons">
              <Col xs={12} md={24}>
                <Tooltip title="Áp dụng bộ lọc">
                  <Button
                    icon={<FilterOutlined />}
                    onClick={handleFilter}
                    style={{ height: 40, width: "100%" }}
                  >
                    <span className="hide-mobile">Lọc</span>
                    <span className="show-mobile">Lọc</span>
                  </Button>
                </Tooltip>
              </Col>
              <Col xs={12} md={24}>
                <Tooltip title="Tạo phiếu mới">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={onCreateNew}
                    style={{ height: 40, fontWeight: 500, width: "100%" }}
                  >
                    <span className="hide-mobile">Tạo phiếu mới</span>
                    <span className="show-mobile">Mới</span>
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
            scroll={{ x: 1110 }}
            bordered
          />
        </div>
      </Card>
    </div>
  );
};

export default ImportExportList;
