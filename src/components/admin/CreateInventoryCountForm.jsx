import React, { useState } from "react";
import { Card, Typography, Button, Form, Input, Select, Table, Space, Checkbox, Steps, Row, Col, InputNumber, DatePicker, message } from "antd";
import { FileTextOutlined, SaveOutlined, ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import "../../styles/AdminResponsive.css";

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const CreateInventoryCountForm = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [actualQuantities, setActualQuantities] = useState({});
    const [step1Data, setStep1Data] = useState({});

    // Hardcoded data for step 1
    const allProducts = [
        { id: 1, name: "Coca Cola", unit: "Lon", systemQuantity: 880 },
        { id: 2, name: "Pepsi", unit: "Lon", systemQuantity: 650 },
        { id: 3, name: "7Up", unit: "Lon", systemQuantity: 420 },
        { id: 4, name: "Fanta", unit: "Lon", systemQuantity: 380 },
        { id: 5, name: "Sprite", unit: "Lon", systemQuantity: 290 },
        { id: 6, name: "C2", unit: "Lon", systemQuantity: 285 },
        { id: 7, name: "Đồ chơi robot", unit: "Hộp", systemQuantity: 10 },
        { id: 8, name: "Đồ chơi robot", unit: "Hộp", systemQuantity: 182 },
        { id: 9, name: "Bánh kẹo", unit: "Gói", systemQuantity: 150 },
        { id: 10, name: "Nước suối", unit: "Chai", systemQuantity: 200 },
    ];

    // Selected products for step 2 - dynamically filter from allProducts
    const selectedProductsData = allProducts.filter(product =>
        selectedProducts.includes(product.id)
    ).map(product => ({
        ...product,
        actualQuantity: actualQuantities[product.id] || product.systemQuantity
    }));

    const step1Columns = [
        {
            title: "",
            key: "checkbox",
            width: 50,
            render: (_, record) => (
                <Checkbox
                    checked={selectedProducts.includes(record.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, record.id]);
                        } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== record.id));
                        }
                        clearError('products');
                    }}
                />
            ),
        },
        {
            title: "SẢN PHẨM",
            dataIndex: "name",
            key: "name",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "ĐƠN VỊ",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "TỒN HỆ THỐNG",
            dataIndex: "systemQuantity",
            key: "systemQuantity",
            render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
        },
    ];

    const step2Columns = [
        {
            title: "SẢN PHẨM",
            dataIndex: "name",
            key: "name",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "ĐƠN VỊ",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "TỒN HỆ THỐNG",
            dataIndex: "systemQuantity",
            key: "systemQuantity",
            render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
        },
        {
            title: "SỐ LƯỢNG THỰC TẾ*",
            key: "actualQuantity",
            render: (_, record) => (
                <div>
                    <InputNumber
                        name={`actualQuantity_${record.id}`}
                        min={0}
                        value={actualQuantities[record.id] || record.systemQuantity}
                        style={{ width: "100%" }}
                        placeholder="Nhập số lượng thực tế"
                        onChange={(value) => {
                            setActualQuantities(prev => ({
                                ...prev,
                                [record.id]: value || 0
                            }));
                            clearError(`actualQuantity_${record.id}`);
                        }}
                    />
                    {formErrors[`actualQuantity_${record.id}`] && (
                        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                            {formErrors[`actualQuantity_${record.id}`]}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "CHÊNH LỆCH",
            key: "difference",
            render: (_, record) => {
                const systemQty = record.systemQuantity || 0;
                const actualQty = actualQuantities[record.id] || record.systemQuantity;
                const diff = actualQty - systemQty;
                return (
                    <span style={{
                        color: diff > 0 ? "green" : diff < 0 ? "red" : "black",
                        fontWeight: "bold"
                    }}>
                        {diff > 0 ? "+" : ""}{diff}
                    </span>
                );
            },
        },
        {
            title: "GHI CHÚ",
            key: "note",
            render: (_, record) => (
                <Input placeholder="Ghi chú kiểm kê" style={{ width: "100%" }} />
            ),
        },
    ];

    const steps = [
        {
            title: "Thông tin phiếu & Chọn sản phẩm",
            description: "Nhập thông tin cơ bản và chọn sản phẩm",
        },
        {
            title: "Nhập số lượng",
            description: "Nhập số lượng thực tế cho từng sản phẩm",
        },
    ];

    // Validation function for Step 1
    const validateStep1 = () => {
        const errors = {};
        const formValues = form.getFieldsValue();

        // Validate required fields
        if (!formValues.formName || formValues.formName.trim() === "") {
            errors.formName = "Vui lòng nhập tên phiếu kiểm!";
        }
        if (!formValues.checkDate) {
            errors.checkDate = "Vui lòng chọn ngày kiểm kê!";
        }
        if (!formValues.warehouse) {
            errors.warehouse = "Vui lòng chọn kho!";
        }
        if (!formValues.note || formValues.note.trim() === "") {
            errors.note = "Vui lòng nhập ghi chú!";
        }
        if (selectedProducts.length === 0) {
            errors.products = "Vui lòng chọn ít nhất một sản phẩm!";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Clear errors when user changes values
    const clearError = (field) => {
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Validation function for Step 2
    const validateStep2 = () => {
        const errors = {};
        let hasError = false;

        // Validate each selected product
        selectedProductsData.forEach((product, index) => {
            const productId = product.id;
            const actualQuantity = actualQuantities[productId];

            if (actualQuantity === undefined || actualQuantity === null || actualQuantity < 0) {
                errors[`actualQuantity_${productId}`] = "Vui lòng nhập số lượng thực tế!";
                hasError = true;
            }
        });

        setFormErrors(errors);
        return !hasError;
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === allProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(allProducts.map(p => p.id));
        }
    };

    const handleNext = () => {
        if (validateStep1()) {
            // Save Step 1 data to state
            const formValues = form.getFieldsValue();
            setStep1Data(formValues);
            setCurrentStep(1);
        }
    };

    const handleCreateSlip = async () => {
        try {
            if (!validateStep2()) {
                return;
            }

            // Get form values from Step 1 (saved data) and current form
            const currentFormValues = form.getFieldsValue();
            const formValues = { ...step1Data, ...currentFormValues };

            // Debug: Log form values to see what's being saved
            console.log("Step 1 data:", step1Data);
            console.log("Current form values:", currentFormValues);
            console.log("Merged form values:", formValues);
            console.log("Form name:", formValues.formName);

            // Create product details with actual quantities
            const productDetails = selectedProductsData.map(product => {
                const actualQty = actualQuantities[product.id] || product.systemQuantity;
                const diff = actualQty - product.systemQuantity;

                return {
                    id: product.id,
                    name: product.name,
                    unit: product.unit,
                    systemQuantity: product.systemQuantity,
                    actualQuantity: actualQty,
                    difference: diff,
                    note: "" // Could add note field later
                };
            });

            // Create new count slip
            const newCountSlip = {
                id: Date.now(),
                slipCode: `KK${String(Date.now()).slice(-3)}`,
                slipName: formValues.formName || "Phiếu kiểm kê mới", // Fallback if formName is empty
                checkDate: formValues.checkDate ? formValues.checkDate.format("DD/MM/YYYY") : new Date().toLocaleDateString("vi-VN"),
                warehouse: formValues.warehouse === "warehouse1" ? "Kho Trung tâm HCMM" : "Kho phụ",
                checker: "Admin", // Could be dynamic
                productCount: selectedProductsData.length,
                status: "completed",
                note: formValues.note,
                products: productDetails
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success("Tạo phiếu kiểm kê thành công!");

            // Reset form and state
            setCurrentStep(0);
            setSelectedProducts([]);
            setActualQuantities({});
            setStep1Data({});
            form.resetFields();

            // Call onSuccess callback to switch to management view
            if (onSuccess) {
                onSuccess(newCountSlip);
            }

        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo phiếu kiểm kê!");
            console.error("Error creating count slip:", error);
        }
    };

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="admin-responsive-container" style={{ padding: "24px" }}>
            <Card className="admin-card-responsive">
                <div style={{ marginBottom: "32px" }}>
                    <Title level={2} className="admin-title-mobile">
                        <FileTextOutlined style={{ marginRight: "8px" }} />
                        Tạo phiếu kiểm kê mới
                    </Title>
                    <Paragraph className="admin-subtitle-mobile" style={{ fontSize: "16px", color: "#666", marginBottom: "24px" }}>
                        Tạo phiếu kiểm kê kho hàng mới
                    </Paragraph>

                    <div className="hide-mobile">
                        <Steps current={currentStep} style={{ marginBottom: "32px" }}>
                            {steps.map((item, index) => (
                                <Step key={index} title={item.title} description={item.description} />
                            ))}
                        </Steps>
                    </div>
                    <div className="show-mobile">
                        <Steps current={currentStep} size="small" style={{ marginBottom: "32px" }}>
                            {steps.map((item, index) => (
                                <Step key={index} title={item.title} description={item.description} />
                            ))}
                        </Steps>
                    </div>
                </div>

                <Form form={form} layout="vertical">
                    {currentStep === 0 ? (
                        <Row gutter={24} style={{ marginTop: 24 }}>
                            <Col xs={24} md={12}>
                                <Card title="Thông tin phiếu kiểm kê" className="admin-card-responsive" style={{ marginBottom: "24px" }}>
                                    <Form.Item
                                        label="Tên phiếu kiểm *"
                                        name="formName"
                                        validateStatus={formErrors.formName ? "error" : ""}
                                        help={formErrors.formName}
                                        rules={[{ required: true, message: "Vui lòng nhập tên phiếu!" }]}
                                        initialValue="Kiểm 1"
                                    >
                                        <Input
                                            placeholder="Nhập tên phiếu kiểm kê"
                                            onChange={() => clearError('formName')}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Ngày kiểm kê *"
                                        name="checkDate"
                                        validateStatus={formErrors.checkDate ? "error" : ""}
                                        help={formErrors.checkDate}
                                        rules={[{ required: true, message: "Vui lòng chọn ngày kiểm kê!" }]}
                                    >
                                        <DatePicker
                                            showTime
                                            format="MM/DD/YYYY HH:mm A"
                                            placeholder="Chọn ngày kiểm kê"
                                            style={{ width: "100%" }}
                                            onChange={() => clearError('checkDate')}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Kho *"
                                        name="warehouse"
                                        validateStatus={formErrors.warehouse ? "error" : ""}
                                        help={formErrors.warehouse}
                                        rules={[{ required: true, message: "Vui lòng chọn kho!" }]}
                                        initialValue="warehouse1"
                                    >
                                        <Select
                                            placeholder="Chọn kho"
                                            onChange={() => clearError('warehouse')}
                                        >
                                            <Option value="warehouse1">Kho Trung tâm HCMM</Option>
                                            <Option value="warehouse2">Kho phụ</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Ghi chú *"
                                        name="note"
                                        validateStatus={formErrors.note ? "error" : ""}
                                        help={formErrors.note}
                                        rules={[{ required: true, message: "Vui lòng nhập ghi chú!" }]}
                                        initialValue="12"
                                    >
                                        <TextArea
                                            rows={3}
                                            placeholder="Nhập ghi chú..."
                                            onChange={() => clearError('note')}
                                            style={{ resize: "none" }}
                                        />
                                    </Form.Item>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card
                                    title="Chọn sản phẩm kiểm kê - Kho Trung tâm HCMM"
                                    className="admin-card-responsive"
                                    style={{ marginBottom: "24px" }}
                                >
                                    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Input
                                            placeholder="Tìm kiếm sản phẩm (tùy chọn)..."
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            style={{ width: "70%" }}
                                        />
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={handleSelectAll}
                                            >
                                                Chọn tất cả
                                            </Button>
                                            <span style={{ fontSize: "14px", color: "#666" }}>
                                                Đã chọn: {selectedProducts.length}/{allProducts.length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="admin-table-wrapper">
                                        <Table
                                            columns={step1Columns}
                                            dataSource={filteredProducts}
                                            pagination={false}
                                            size="small"
                                            scroll={{ y: 300 }}
                                            rowKey="id"
                                        />
                                    </div>
                                    {formErrors.products && (
                                        <div style={{ color: "#ff4d4f", fontSize: "14px", marginTop: "8px" }}>
                                            {formErrors.products}
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <div style={{ marginTop: 24 }}>
                            <Card
                                title="Nhập số lượng thực tế - Kho Trung tâm HCMM"
                                className="admin-card-responsive"
                                style={{ marginBottom: "24px" }}
                                extra={
                                    <span style={{ color: "#666" }}>
                                        {selectedProductsData.length} sản phẩm đã chọn
                                    </span>
                                }
                            >
                                <div className="admin-table-wrapper">
                                    <Table
                                        columns={step2Columns}
                                        dataSource={selectedProductsData}
                                        pagination={false}
                                        size="small"
                                        scroll={{ x: 800 }}
                                        rowKey="id"
                                    />
                                </div>
                            </Card>
                        </div>
                    )}

                    <div style={{ textAlign: "right", marginTop: "24px" }}>
                        <Space>
                            <Button size="large">Hủy</Button>
                            {currentStep === 0 ? (
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={handleNext}
                                >
                                    Tiếp theo
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        size="large"
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => setCurrentStep(0)}
                                    >
                                        — Quay lại
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<SaveOutlined />}
                                        onClick={handleCreateSlip}
                                    >
                                        Tạo phiếu kiểm kê
                                    </Button>
                                </>
                            )}
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CreateInventoryCountForm;