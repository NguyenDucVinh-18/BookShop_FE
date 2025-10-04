import React, { useState } from 'react';
import { Card, Row, Col, Select, Typography, Button } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const AddressPage = () => {
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [selectedCity, setSelectedCity] = useState('hcm');

    // Danh sách địa chỉ cửa hàng
    const addresses = [
        {
            id: 0,
            address: "12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP. HCM",
            phone: "0905 123 456",
            hours: "8:00 - 17:00",
            city: "hcm",
            coordinates: { lat: 10.822173, lng: 106.685768 }, // Tọa độ chính xác 12 Nguyễn Văn Bảo
            embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858049565339!2d106.685768!3d10.822173300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e52e46e0cd%3A0xe3e53fb545e26265!2zMTIgTmd1eeG7hW4gVsSDbiBC4bqjbywgUGjGsOG7nW5nIDEsIEfDsiBW4bqlcCwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1759459037305!5m2!1svi!2s"
        },
        {
            id: 1,
            address: "Số 10 Nguyễn Văn Dung, Phường An Nhơn, Quận Gò Vấp, TP. HCM",
            phone: "0905 234 567",
            hours: "8:00 - 17:00",
            city: "hcm",
            coordinates: { lat: 10.847831, lng: 106.678975 }, // Tọa độ chính xác từ iframe
            embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.522181987872!2d106.6789751!3d10.847831299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175284cfecbd035%3A0x28e9165b0505e324!2zMTAgxJDGsOG7nW5nIE5ndXnhu4VuIFbEg24gRHVuZywgUGjGsOG7nW5nIDYsIEfDsiBW4bqlcCwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1759459615271!5m2!1svi!2s"
        },
        {
            id: 2,
            address: "Số 20, Đường 53, Phường An Hội Tây, Quận Gò Vấp, TP. HCM",
            phone: "0905 345 678",
            hours: "8:00 - 17:00",
            city: "hcm",
            coordinates: { lat: 10.850233, lng: 106.643039 }, // Tọa độ chính xác từ iframe
            embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.490703105326!2d106.64303869999999!3d10.850232999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752991baa2a995%3A0x9e19e123cf121c9d!2zMjAgxJAuIDUzLCBQaMaw4budbmcgMTQsIEfDsiBW4bqlcCwgSOG7kyBDaMOtIE1pbmggNzAwMDAw!5e0!3m2!1svi!2s!4v1759459639403!5m2!1svi!2s"
        },
        {
            id: 3,
            address: "938 Quang Trung, Phường Cẩm Thành, TP. Quảng Ngãi, tỉnh Quảng Ngãi",
            phone: "0905 456 789",
            hours: "8:00 - 17:00",
            city: "qn",
            coordinates: { lat: 15.115528, lng: 108.795863 }, // Tọa độ chính xác từ iframe
            embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15407.114227403725!2d108.79586299113109!3d15.115528482376641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3168532ba80545eb%3A0x6f3bc4735ef3d5cc!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBDw7RuZyBOZ2hp4buHcCBUaMOgbmggUGjhu5EgSOG7kyBDaMOtIE1pbmggLSBQaMOibiBoaeG7h3UgUXXhuqNuZyBOZ8OjaQ!5e0!3m2!1svi!2s!4v1759460299291!5m2!1svi!2s"
        },
        {
            id: 4,
            address: "Xã Quảng Tâm, Thành phố Thanh Hóa, tỉnh Thanh Hóa",
            phone: "0905 567 890",
            hours: "8:00 - 17:00",
            city: "th",
            coordinates: { lat: 19.759393, lng: 105.691781 }, // Tọa độ chính xác từ iframe
            embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120156.8071018473!2d105.69178104400633!3d19.759393398112405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136571d7e34f04b%3A0x550bdf4cd96251e0!2zUXXhuqNuZyBUw6JtLCBUaGFuaCBIw7NhLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1759460335010!5m2!1svi!2s"
        }
    ];

    const handleAddressSelect = (addressId) => {
        setSelectedAddress(addressId);
    };

    const handleCityChange = (cityValue) => {
        setSelectedCity(cityValue);
        setSelectedAddress(0); // Reset về địa chỉ đầu tiên của thành phố mới
    };

    // Lọc địa chỉ theo thành phố được chọn
    const filteredAddresses = addresses.filter(addr => addr.city === selectedCity);
    const selectedAddressData = filteredAddresses[selectedAddress] || filteredAddresses[0];

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', color: '#1890ff' }}>
                    <EnvironmentOutlined style={{ marginRight: '8px' }} />
                    Địa chỉ cửa hàng
                </Title>

                <Row gutter={[24, 24]}>
                    {/* Left Column - Address List */}
                    <Col xs={24} lg={8}>
                        <Card
                            title="Chọn tỉnh/thành phố"
                            style={{ marginBottom: '16px' }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Select
                                placeholder="Chọn tỉnh/thành phố"
                                style={{ width: '100%' }}
                                value={selectedCity}
                                onChange={handleCityChange}
                            >
                                <Option value="hcm">TP. Hồ Chí Minh</Option>
                                <Option value="qn">Quảng Ngãi</Option>
                                <Option value="th">Thanh Hóa</Option>
                            </Select>
                        </Card>

                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {filteredAddresses.map((addr, index) => (
                                <Card
                                    key={addr.id}
                                    size="small"
                                    style={{
                                        marginBottom: '12px',
                                        cursor: 'pointer',
                                        border: selectedAddress === index ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                        backgroundColor: selectedAddress === index ? '#f0f5ff' : '#fff',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => handleAddressSelect(index)}
                                    hoverable
                                >
                                    <div style={{ padding: '12px' }}>
                                        <div style={{
                                            fontWeight: '600',
                                            marginBottom: '8px',
                                            color: selectedAddress === index ? '#1890ff' : '#262626'
                                        }}>
                                            {addr.address}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '4px',
                                            fontSize: '14px',
                                            color: '#666'
                                        }}>
                                            <PhoneOutlined style={{ marginRight: '6px', color: '#52c41a' }} />
                                            SĐT: {addr.phone}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '14px',
                                            color: '#666'
                                        }}>
                                            <ClockCircleOutlined style={{ marginRight: '6px', color: '#fa8c16' }} />
                                            Giờ mở cửa: {addr.hours}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Col>

                    {/* Right Column - Google Map */}
                    <Col xs={24} lg={16}>
                        <Card
                            title={`Bản đồ - ${selectedAddressData.address}`}
                            style={{ height: '600px' }}
                            bodyStyle={{ padding: '0', height: 'calc(100% - 57px)' }}
                        >
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                {/* Google Maps Embed */}
                                <iframe
                                    src={selectedAddressData.embedSrc}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '6px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Bản đồ ${selectedAddressData.address}`}
                                />

                                {/* Overlay với thông tin chi tiết */}
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '16px',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    maxWidth: '300px'
                                }}>
                                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1890ff' }}>
                                        {selectedAddressData.address}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                                        📞 {selectedAddressData.phone}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                        🕒 {selectedAddressData.hours}
                                    </div>
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={() => {
                                            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedAddressData.coordinates.lat},${selectedAddressData.coordinates.lng}`;
                                            window.open(mapsUrl, '_blank');
                                        }}
                                    >
                                        Chỉ đường
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default AddressPage;
