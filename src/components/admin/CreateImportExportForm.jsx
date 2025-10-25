import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Form, Input, Select, Table, Space, Checkbox, Steps, Row, Col, DatePicker, message } from "antd";
import { PlusOutlined, SaveOutlined, ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const CreateImportExportForm = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ type: 'import' }); // Initialize with default value
    const [productDetails, setProductDetails] = useState({}); // Store product details from Step 2

    // Set default form values on component mount
    useEffect(() => {
        form.setFieldsValue({ type: 'import' });
        setFormData(prev => ({ ...prev, type: 'import' }));
        console.log("Initial type set to: import");
    }, [form]);

    // Hardcoded data
    const products = [
        { id: 1, name: "Coca 330ml", unit: "Lon", currentQuantity: 0 },
        { id: 2, name: "C2 Vị Chanh", unit: "Cái", currentQuantity: 0 },
        { id: 3, name: "Coca Cola1212", unit: "Cái", currentQuantity: 0 },
        { id: 4, name: "C2 Vị Chanhhhh", unit: "Cái", currentQuantity: 0 },
        { id: 5, name: "Pepsi 330ml", unit: "Lon", currentQuantity: 0 },
        { id: 6, name: "7Up 330ml", unit: "Lon", currentQuantity: 0 },
        { id: 7, name: "Fanta Cam", unit: "Lon", currentQuantity: 0 },
        { id: 8, name: "Sprite 330ml", unit: "Lon", currentQuantity: 0 },
    ];

    // Get selected products for step 2 based on what user selected in step 1
    const selectedProductsData = products.filter(product =>
        selectedProducts.includes(product.id)
    );

    const columns = [
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
            title: "SỐ LƯỢNG HIỆN TẠI",
            dataIndex: "currentQuantity",
            key: "currentQuantity",
            render: (text) => <span style={{ color: text === 0 ? "#ff4d4f" : "#52c41a" }}>{text}</span>,
        },
    ];

    const step2Columns = [
        {
            title: "SẢN PHẨM",
            key: "product",
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: "bold" }}>{record.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>ID: {record.id}</div>
                </div>
            ),
        },
        {
            title: "ĐƠN VỊ",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "SỐ LƯỢNG NHẬP",
            key: "quantity",
            render: (_, record) => (
                <div>
                    <Input
                        name={`quantity_${record.id}`}
                        placeholder="Nhập số lượng"
                        type="number"
                        min={0}
                        style={{ width: "100%" }}
                        onChange={(e) => {
                            clearError(`quantity_${record.id}`);
                            setProductDetails(prev => ({
                                ...prev,
                                [record.id]: {
                                    ...prev[record.id],
                                    quantity: parseInt(e.target.value) || 0
                                }
                            }));
                        }}
                    />
                    {formErrors[`quantity_${record.id}`] && (
                        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                            {formErrors[`quantity_${record.id}`]}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "GHI CHÚ",
            key: "note",
            render: (_, record) => (
                <Input
                    name={`note_${record.id}`}
                    placeholder="Ghi chú..."
                    style={{ width: "100%" }}
                    onChange={(e) => {
                        setProductDetails(prev => ({
                            ...prev,
                            [record.id]: {
                                ...prev[record.id],
                                note: e.target.value
                            }
                        }));
                    }}
                />
            ),
        },
        {
            title: "SỐ LÔ *",
            key: "lotNumber",
            render: (_, record) => (
                <div>
                    <Input
                        name={`lotNumber_${record.id}`}
                        placeholder="Số lô *"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                            clearError(`lotNumber_${record.id}`);
                            setProductDetails(prev => ({
                                ...prev,
                                [record.id]: {
                                    ...prev[record.id],
                                    lotNumber: e.target.value
                                }
                            }));
                        }}
                    />
                    {formErrors[`lotNumber_${record.id}`] && (
                        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                            {formErrors[`lotNumber_${record.id}`]}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "NSX",
            key: "manufacturingDate",
            render: (_, record) => (
                <div>
                    <DatePicker
                        name={`manufacturingDate_${record.id}`}
                        placeholder="mm/dd/yyyy"
                        style={{ width: "100%" }}
                        format="MM/DD/YYYY"
                        onChange={(date, dateString) => {
                            clearError(`manufacturingDate_${record.id}`);
                            setProductDetails(prev => ({
                                ...prev,
                                [record.id]: {
                                    ...prev[record.id],
                                    manufacturingDate: dateString
                                }
                            }));
                        }}
                    />
                    {formErrors[`manufacturingDate_${record.id}`] && (
                        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                            {formErrors[`manufacturingDate_${record.id}`]}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "HSD",
            key: "expirationDate",
            render: (_, record) => (
                <div>
                    <DatePicker
                        name={`expirationDate_${record.id}`}
                        placeholder="mm/dd/yyyy"
                        style={{ width: "100%" }}
                        format="MM/DD/YYYY"
                        onChange={(date, dateString) => {
                            clearError(`expirationDate_${record.id}`);
                            setProductDetails(prev => ({
                                ...prev,
                                [record.id]: {
                                    ...prev[record.id],
                                    expirationDate: dateString
                                }
                            }));
                        }}
                    />
                    {formErrors[`expirationDate_${record.id}`] && (
                        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                            {formErrors[`expirationDate_${record.id}`]}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "NHÀ CUNG CẤP",
            key: "supplier",
            render: (_, record) => (
                <div>
                    <Input
                        name={`supplier_${record.id}`}
                        placeholder="Tên NCC"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                            clearError(`supplier_${record.id}`);
                            setProductDetails(prev => ({
                                ...prev,
                                [record.id]: {
                                    ...prev[record.id],
                                    supplier: e.target.value
                                }
                            }));
                        }}
                    />
                    {formErrors[`supplier_${record.id}`] && (
                        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                            {formErrors[`supplier_${record.id}`]}
                        </div>
                    )}
                </div>
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
            description: "Nhập số lượng cho từng sản phẩm",
        },
    ];

    // Validation function for Step 1
    const validateStep1 = () => {
        const errors = {};
        const formValues = form.getFieldsValue();

        // Validate required fields
        if (!formValues.type) {
            errors.type = "Vui lòng chọn loại phiếu!";
        }
        if (!formValues.formName || formValues.formName.trim() === "") {
            errors.formName = "Vui lòng nhập tên phiếu!";
        }
        if (selectedProducts.length === 0) {
            errors.products = "Vui lòng chọn ít nhất một sản phẩm!";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validation function for Step 2
    const validateStep2 = () => {
        const errors = {};
        let hasError = false;

        // Validate each selected product
        selectedProductsData.forEach((product, index) => {
            const productId = product.id;
            const details = productDetails[productId] || {};
            const quantity = details.quantity;
            const lotNumber = details.lotNumber;
            const manufacturingDate = details.manufacturingDate;
            const expirationDate = details.expirationDate;
            const supplier = details.supplier;

            if (!quantity || quantity <= 0) {
                errors[`quantity_${productId}`] = "Vui lòng nhập số lượng hợp lệ!";
                hasError = true;
            }
            if (!lotNumber || lotNumber.trim() === "") {
                errors[`lotNumber_${productId}`] = "Vui lòng nhập số lô!";
                hasError = true;
            }
            if (!manufacturingDate || manufacturingDate.trim() === "") {
                errors[`manufacturingDate_${productId}`] = "Vui lòng chọn ngày sản xuất!";
                hasError = true;
            }
            if (!expirationDate || expirationDate.trim() === "") {
                errors[`expirationDate_${productId}`] = "Vui lòng chọn hạn sử dụng!";
                hasError = true;
            }
            if (!supplier || supplier.trim() === "") {
                errors[`supplier_${productId}`] = "Vui lòng nhập nhà cung cấp!";
                hasError = true;
            }
        });

        setFormErrors(errors);
        return !hasError;
    };

    // Handle next step
    const handleNext = () => {
        if (validateStep1()) {
            // Save form data before moving to next step
            const formValues = form.getFieldsValue();
            // Merge with default values if form is empty
            const mergedData = { ...formData, ...formValues };
            setFormData(mergedData);
            setCurrentStep(1);
        }
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

    // Handle create slip
    const handleCreateSlip = async () => {
        try {
            setLoading(true);

            // Validate Step 2 first
            if (!validateStep2()) {
                setLoading(false);
                return;
            }

            // Get form values from saved data
            const formValues = { ...formData, ...form.getFieldsValue() };

            // Debug: Log form values to see what's being saved
            console.log("Form values:", formValues);
            console.log("Type value:", formValues.type);
            console.log("Saved formData:", formData);

            // Create new slip data
            const slipType = formValues.type; // Use the actual form value directly
            if (!slipType) {
                message.error("Vui lòng chọn loại phiếu!");
                setLoading(false);
                return;
            }

            // Get product details from state
            const finalProductDetails = selectedProductsData.map(product => {
                const productId = product.id;
                const details = productDetails[productId] || {};

                return {
                    id: product.id,
                    name: product.name,
                    unit: product.unit,
                    quantity: details.quantity || 0,
                    note: details.note || "",
                    lotNumber: details.lotNumber || "",
                    manufacturingDate: details.manufacturingDate || "",
                    expirationDate: details.expirationDate || "",
                    supplier: details.supplier || ""
                };
            });

            const newSlip = {
                id: Date.now(), // Generate unique ID
                type: slipType, // Use the actual form value directly
                slipNumber: slipType === "import" ? `IMPORT-${Date.now()}` : `EXPORT-${Date.now()}`,
                status: "approved",
                createdDate: new Date().toLocaleDateString("vi-VN"),
                note: formValues.note || "Phiếu mới tạo",
                products: finalProductDetails
            };

            // Debug: Log the new slip data
            console.log("New slip data:", newSlip);
            console.log("Type in newSlip:", newSlip.type);
            console.log("Products in newSlip:", newSlip.products);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            message.success("Tạo phiếu thành công!");

            // Call onSuccess callback to switch to list view
            if (onSuccess) {
                onSuccess(newSlip);
            }

        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo phiếu!");
            console.error("Error creating slip:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <div style={{ marginBottom: "32px" }}>
                    <Title level={2}>
                        <PlusOutlined style={{ color: "#ff4d4f", marginRight: "8px" }} />
                        Tạo phiếu nhập xuất hàng
                    </Title>
                    <Paragraph style={{ fontSize: "16px", color: "#666", marginBottom: "24px" }}>
                        Tạo phiếu nhập xuất hàng mới
                    </Paragraph>

                    <Steps current={currentStep} style={{ marginBottom: "32px" }}>
                        {steps.map((item, index) => (
                            <Step key={index} title={item.title} description={item.description} />
                        ))}
                    </Steps>
                </div>

                <Form form={form} layout="vertical">
                    {currentStep === 0 ? (
                        <Row gutter={24}>
                            <Col span={12}>
                                <Card title="Thông tin phiếu nhập xuất" style={{ marginBottom: "24px" }}>
                                    <Form.Item
                                        label="Loại phiếu"
                                        name="type"
                                        validateStatus={formErrors.type ? "error" : ""}
                                        help={formErrors.type}
                                        initialValue="import"
                                        rules={[{ required: true, message: "Vui lòng chọn loại phiếu!" }]}
                                    >
                                        <Select
                                            placeholder="Chọn loại phiếu"
                                            onChange={(value) => {
                                                console.log("Selected type:", value);
                                                form.setFieldsValue({ type: value });
                                                setFormData(prev => ({ ...prev, type: value }));
                                                clearError('type');
                                            }}
                                            onSelect={(value) => {
                                                console.log("Selected type (onSelect):", value);
                                                form.setFieldsValue({ type: value });
                                                setFormData(prev => ({ ...prev, type: value }));
                                                clearError('type');
                                            }}
                                        >
                                            <Option value="import">Nhập kho</Option>
                                            <Option value="export">Xuất kho</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Tên phiếu"
                                        name="formName"
                                        validateStatus={formErrors.formName ? "error" : ""}
                                        help={formErrors.formName}
                                        initialValue="Nhập Kho"
                                    >
                                        <Input
                                            placeholder="Nhập tên phiếu"
                                            onChange={() => clearError('formName')}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Ghi chú"
                                        name="note"
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Nhập ghi chú..."
                                            style={{ resize: "none" }}
                                        />
                                    </Form.Item>
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card
                                    title="Chọn sản phẩm"
                                    style={{ marginBottom: "24px" }}
                                    extra={
                                        <Checkbox>Hiển thị tất cả sản phẩm</Checkbox>
                                    }
                                >
                                    <Table
                                        columns={columns}
                                        dataSource={products}
                                        pagination={false}
                                        size="small"
                                        scroll={{ y: 300 }}
                                        rowKey="id"
                                    />
                                    {formErrors.products && (
                                        <div style={{ color: "#ff4d4f", fontSize: "14px", marginTop: "8px" }}>
                                            {formErrors.products}
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Card
                            title="Nhập số lượng"
                            style={{ marginBottom: "24px" }}
                            extra={
                                <span style={{ color: "#666" }}>
                                    {selectedProductsData.length} sản phẩm đã chọn
                                </span>
                            }
                        >
                            <Table
                                columns={step2Columns}
                                dataSource={selectedProductsData}
                                pagination={false}
                                size="small"
                                scroll={{ x: 1200 }}
                                rowKey="id"
                            />
                        </Card>
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
                                        ← Quay lại
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        onClick={handleCreateSlip}
                                    >
                                        Tạo phiếu
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

export default CreateImportExportForm;
