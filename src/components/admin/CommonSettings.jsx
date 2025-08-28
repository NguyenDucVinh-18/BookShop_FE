import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Select,
    Switch,
    Space,
    Divider,
    message,
    Row,
    Col
} from 'antd';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const CommonSettings = ({ settings, onSaveSettings }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await onSaveSettings(values);
            message.success('Lưu cài đặt thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu cài đặt!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-content">
            <div className="content-header">
                <h2>Cài đặt hệ thống</h2>
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={settings}
                onFinish={handleSubmit}
            >
                {/* Thông tin cơ bản */}
                <Card title="Thông tin cơ bản" className="settings-card">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="companyName"
                                label="Tên công ty"
                                rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
                            >
                                <Input placeholder="Nhập tên công ty" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="companyPhone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="companyEmail"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="companyAddress"
                                label="Địa chỉ"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input placeholder="Nhập địa chỉ" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="companyDescription"
                        label="Mô tả công ty"
                    >
                        <TextArea
                            placeholder="Nhập mô tả công ty"
                            rows={3}
                        />
                    </Form.Item>
                </Card>

                {/* Cài đặt hệ thống */}
                <Card title="Cài đặt hệ thống" className="settings-card">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="systemLanguage"
                                label="Ngôn ngữ hệ thống"
                            >
                                <Select placeholder="Chọn ngôn ngữ">
                                    <Option value="vi">Tiếng Việt</Option>
                                    <Option value="en">English</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="timezone"
                                label="Múi giờ"
                            >
                                <Select placeholder="Chọn múi giờ">
                                    <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</Option>
                                    <Option value="UTC">UTC (GMT+0)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="dateFormat"
                                label="Định dạng ngày"
                            >
                                <Select placeholder="Chọn định dạng ngày">
                                    <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                                    <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                                    <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="currency"
                                label="Đơn vị tiền tệ"
                            >
                                <Select placeholder="Chọn đơn vị tiền tệ">
                                    <Option value="VND">VND (₫)</Option>
                                    <Option value="USD">USD ($)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Cài đặt thông báo */}
                <Card title="Cài đặt thông báo" className="settings-card">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="emailNotifications"
                                label="Thông báo qua email"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="smsNotifications"
                                label="Thông báo qua SMS"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="pushNotifications"
                                label="Thông báo đẩy"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="autoBackup"
                                label="Tự động sao lưu"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Nút lưu */}
                <div className="settings-actions">
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                            size="large"
                        >
                            Lưu cài đặt
                        </Button>
                        <Button
                            onClick={() => form.resetFields()}
                            size="large"
                        >
                            Khôi phục mặc định
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default CommonSettings;
