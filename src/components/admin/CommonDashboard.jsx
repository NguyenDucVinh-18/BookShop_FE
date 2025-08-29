import React from 'react';
import { Card, Statistic, Row, Col, Table } from 'antd';
import { BookOutlined, ShoppingCartOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';

const CommonDashboard = ({ stats, recentOrders, topProducts }) => {
    const orderColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên khách hàng', dataIndex: 'customerName', key: 'customerName' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: (total) => `${total.toLocaleString()} ₫` },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        { title: 'Ngày đặt', dataIndex: 'date', key: 'date' }
    ];

    const productColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên sách', dataIndex: 'title', key: 'title' },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString()} ₫` },
        { title: 'Danh mục', dataIndex: 'category', key: 'category' },
        { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' }
    ];

    return (
        <div className="dashboard-content">
            <h2>Dashboard</h2>

            {/* Statistics Cards */}
            <Row gutter={16} className="stats-row">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={stats.totalProducts}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đơn hàng chờ xử lý"
                            value={stats.pendingOrders}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={stats.totalRevenue}
                            prefix="₫"
                            valueStyle={{ color: '#1890ff' }}
                            formatter={(value) => value.toLocaleString()}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng khách hàng"
                            value={stats.totalCustomers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={16} className="charts-row">
                <Col span={12}>
                    <Card title="Đơn hàng gần đây" className="recent-orders">
                        <Table
                            dataSource={recentOrders}
                            columns={orderColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Sản phẩm bán chạy" className="top-products">
                        <Table
                            dataSource={topProducts}
                            columns={productColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CommonDashboard;
