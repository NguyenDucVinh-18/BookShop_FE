import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Input,
    Modal,
    Form,
    Select,
    InputNumber,
    Space,
    Tag,
    message,
    Popconfirm,
    Tooltip,
    Row,
    Col,
    Tabs,
    Upload
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const CommonProductManagement = ({ products, onAddProduct, onEditProduct, onDeleteProduct }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProductType, setSelectedProductType] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [form] = Form.useForm();
    const [originalCategory, setOriginalCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedProducts, setDisplayedProducts] = useState(products || []);
    const [currentImageFileList, setCurrentImageFileList] = useState([]);

    // Danh mục cha -> danh mục con
    const subcategoryMap = {
        children: ['be-vao-lop-1', 'tu-dien-tranh', 'thu-cong-tap-to', 'phat-trien-tri-tue'],
        'thieu-nhi': ['truyen-co-tich', 'sach-hoc-tap', 'sach-ky-nang-song', 'sach-kham-pha'],
        lifeSkills: ['ky-nang-giao-tiep', 'ky-nang-lanh-dao', 'ky-nang-quan-ly', 'ky-nang-mem'],
        business: ['khoi-nghiep', 'marketing', 'quan-tri', 'tai-chinh'],
        parenting: ['cham-soc-tre', 'dinh-duong', 'giao-duc-som', 'suc-khoe'],
        literature: ['tieu-thuyet', 'truyen-ngan', 'tho-ca', 'tac-pham-kinh-dien'],
        reference: ['toan-hoc', 'van-hoc', 'lich-su', 'dia-ly'],
        toys: ['do-choi-giao-duc', 'but-viet', 'sach-vo', 'dung-cu-hoc-tap']
    };

    const subLabel = (slug) => {
        const map = {
            'be-vao-lop-1': 'Bé Vào Lớp 1',
            'tu-dien-tranh': 'Từ Điển Tranh',
            'thu-cong-tap-to': 'Thủ Công - Tập Tô',
            'phat-trien-tri-tue': 'Phát Triển Trí Tuệ',
            'truyen-co-tich': 'Truyện Cổ Tích',
            'sach-hoc-tap': 'Sách Học Tập',
            'sach-ky-nang-song': 'Sách Kỹ Năng Sống',
            'sach-kham-pha': 'Sách Khám Phá',
            'ky-nang-giao-tiep': 'Kỹ Năng Giao Tiếp',
            'ky-nang-lanh-dao': 'Kỹ Năng Lãnh Đạo',
            'ky-nang-quan-ly': 'Kỹ Năng Quản Lý',
            'ky-nang-mem': 'Kỹ Năng Mềm',
            'khoi-nghiep': 'Khởi Nghiệp',
            'marketing': 'Marketing',
            'quan-tri': 'Quản Trị',
            'tai-chinh': 'Tài Chính',
            'cham-soc-tre': 'Chăm Sóc Trẻ',
            'dinh-duong': 'Dinh Dưỡng',
            'giao-duc-som': 'Giáo Dục Sớm',
            'suc-khoe': 'Sức Khỏe',
            'tieu-thuyet': 'Tiểu Thuyết',
            'truyen-ngan': 'Truyện Ngắn',
            'tho-ca': 'Thơ Ca',
            'tac-pham-kinh-dien': 'Tác Phẩm Kinh Điển',
            'toan-hoc': 'Toán Học',
            'van-hoc': 'Văn Học',
            'lich-su': 'Lịch Sử',
            'dia-ly': 'Địa Lý',
            'do-choi-giao-duc': 'Đồ Chơi Giáo Dục',
            'but-viet': 'Bút Viết',
            'sach-vo': 'Sách Vở',
            'dung-cu-hoc-tap': 'Dụng Cụ Học Tập'
        };
        return map[slug] || slug;
    };

    const productColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            width: 100,
            render: (images) => {
                if (images && images.length > 0) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            {/* Chỉ hiển thị ảnh đại diện (ảnh đầu tiên) */}
                            <img
                                src={images[0]}
                                alt="Product"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #d9d9d9'
                                }}
                            />
                            {/* Hiển thị số lượng ảnh còn lại */}
                            {images.length > 1 && (
                                <div style={{
                                    fontSize: '11px',
                                    color: '#666',
                                    marginTop: '4px',
                                    backgroundColor: '#f0f0f0',
                                    padding: '2px 6px',
                                    borderRadius: '10px'
                                }}>
                                    +{images.length - 1} ảnh
                                </div>
                            )}
                        </div>
                    );
                }
                return (
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9',
                            color: '#999'
                        }}
                    >
                        No Image
                    </div>
                );
            }
        },
        { title: 'Tên sách', dataIndex: 'title', key: 'title' },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString()} ₫` },
        { title: 'Danh mục', dataIndex: 'category', key: 'category' },
        { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc muốn xóa sản phẩm này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button icon={<DeleteOutlined />} size="small" danger />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleAdd = () => {
        setEditingProduct(null);
        setSelectedProductType(null);
        setCurrentImageFileList([]);
        form.resetFields();
        form.setFieldsValue({ images: [] });
        setIsModalVisible(true);
    };

    // Map subcategory slug -> parent category slug
    const mapSubcategoryToParent = (slug) => {
        if (!slug) return undefined;
        const s = String(slug).toLowerCase();
        const groups = [
            { parent: 'children', subs: ['be-vao-lop-1', 'tu-dien-tranh', 'thu-cong-tap-to', 'phat-trien-tri-tue'] },
            { parent: 'thieu-nhi', subs: ['truyen-co-tich', 'sach-hoc-tap', 'sach-ky-nang-song', 'sach-kham-pha'] },
            { parent: 'lifeSkills', subs: ['ky-nang-giao-tiep', 'ky-nang-lanh-dao', 'ky-nang-quan-ly', 'ky-nang-mem'] },
            { parent: 'business', subs: ['khoi-nghiep', 'marketing', 'quan-tri', 'tai-chinh'] },
            { parent: 'parenting', subs: ['cham-soc-tre', 'dinh-duong', 'giao-duc-som', 'suc-khoe'] },
            { parent: 'literature', subs: ['tieu-thuyet', 'truyen-ngan', 'tho-ca', 'tac-pham-kinh-dien'] },
            { parent: 'reference', subs: ['toan-hoc', 'van-hoc', 'lich-su', 'dia-ly'] },
            { parent: 'toys', subs: ['do-choi-giao-duc', 'but-viet', 'sach-vo', 'dung-cu-hoc-tap'] }
        ];
        const found = groups.find(g => g.subs.includes(s));
        return found ? found.parent : s;
    };

    const handleEdit = (product) => {
        setEditingProduct(product);

        let productType = 'sach';
        if (product.ageRating || product.genres) {
            productType = 'truyen';
        }
        if (product.gradeLevel || product.pageCount) {
            productType = 'sach';
        }
        // văn phòng phẩm
        if (product.color || product.material || product.manufacturingLocation) {
            productType = 'van-phong-pham';
        }

        setSelectedProductType(productType);
        setOriginalCategory(product.category || null);

        // Tạo fileList cho nhiều hình ảnh hiện tại
        const currentImages = product.images && product.images.length > 0 ? product.images.map((image, index) => ({
            uid: `existing-${index}`,
            name: `image-${index}`,
            status: 'done',
            url: image,
            originFileObj: null,
            preview: image
        })) : [];

        setCurrentImageFileList(currentImages);

        const formData = {
            productName: product.title,
            author_name: Array.isArray(product.author)
                ? product.author
                : (typeof product.author === 'string' ? product.author.split(',').map(s => s.trim()).filter(Boolean) : undefined),
            price: product.price,
            category: mapSubcategoryToParent(product.category),
            subcategory: product.category,
            stockQuantity: product.stock,
            description: product.description,
            publisherName: product.publisherName || product.publisher,
            publicationYear: product.publicationYear,
            pageCount: product.pageCount,
            isbn: product.isbn,
            coverType: product.coverType,
            packageDimensions: product.packageDimensions,
            weightGrams: product.weightGrams,
            images: currentImages,
            gradeLevel: product.gradeLevel,
            ageRating: product.ageRating,
            genres: product.genres,
            // stationery
            color: product.color,
            material: product.material,
            manufacturingLocation: product.manufacturingLocation
        };

        console.log('🔍 Form data for edit:', formData);
        form.setFieldsValue(formData);
        setIsModalVisible(true);
    };

    const handleDelete = (productId) => {
        onDeleteProduct(productId);
        message.success('Đã xóa sản phẩm thành công!');
    };

    const handleView = (product) => {
        setViewingProduct(product);
        setSelectedProductType(product.productType || null);
    };

    const handleSubmit = (values) => {
        console.log('🔍 Form values:', values);
        console.log('🔍 Form validation errors:', form.getFieldsError());

        let finalCategory = values.subcategory || values.category;
        if (!values.subcategory && originalCategory) {
            const parentOfOriginal = mapSubcategoryToParent(originalCategory);
            if (values.category === parentOfOriginal) {
                finalCategory = originalCategory;
            }
        }

        // Xử lý dữ liệu hình ảnh - HỖ TRỢ NHIỀU ẢNH
        let images = [];
        if (currentImageFileList && currentImageFileList.length > 0) {
            console.log('🔄 Xử lý nhiều hình ảnh trong handleSubmit:', currentImageFileList);

            // Xử lý từng file trong danh sách
            currentImageFileList.forEach((imageFile, index) => {
                if (imageFile.originFileObj) {
                    // File upload mới - tạo URL tạm thời
                    console.log(`🔄 Tạo URL tạm thời cho file mới ${index + 1}:`, imageFile.name);
                    images.push(URL.createObjectURL(imageFile.originFileObj));
                } else if (imageFile.url) {
                    // File cũ từ edit - giữ nguyên URL
                    console.log(`🔄 Giữ nguyên URL cũ ${index + 1}:`, imageFile.url);
                    images.push(imageFile.url);
                } else if (typeof imageFile === 'string') {
                    console.log(`🔄 File là string URL ${index + 1}:`, imageFile);
                    images.push(imageFile);
                } else {
                    console.log(`🔄 Fallback ${index + 1}:`, imageFile);
                    images.push(imageFile);
                }
            });
        }
        console.log('🔄 Kết quả xử lý hình ảnh (tổng cộng):', images.length, 'ảnh');

        const mappedValues = {
            ...values,
            title: values.productName,
            price: Number(values.price) || 0,
            stock: Number(values.stockQuantity) || 0,
            category: finalCategory,
            images: images
        };
        delete mappedValues.subcategory;

        // map theo loại sản phẩm
        if (selectedProductType === 'van-phong-pham') {
            mappedValues.author = values.author_name || '';
            mappedValues.publisherName = values.publisherName || '';
            mappedValues.color = values.color || '';
            mappedValues.material = values.material || '';
            mappedValues.manufacturingLocation = values.manufacturingLocation || '';
            mappedValues.status = 'active';
        } else {
            mappedValues.author = values.author_name;
        }

        console.log('🔍 Final mapped values:', mappedValues);

        if (editingProduct) {
            onEditProduct(editingProduct.id, mappedValues);
            message.success('Đã cập nhật sản phẩm thành công!');
        } else {
            onAddProduct(mappedValues);
            message.success('Đã thêm sản phẩm thành công!');
        }

        setIsModalVisible(false);
        form.resetFields();
        setCurrentImageFileList([]);
    };

    React.useEffect(() => {
        setDisplayedProducts(products || []);
    }, [products]);

    const handleSearch = (value) => {
        const query = (value || '').toLowerCase();
        setSearchQuery(value || '');
        if (!query) {
            setDisplayedProducts(products || []);
            return;
        }
        const filtered = (products || []).filter((p) => {
            const title = (p.title || '').toLowerCase();
            const author = Array.isArray(p.author) ? p.author.join(', ').toLowerCase() : (p.author || '').toLowerCase();
            const category = (p.category || '').toLowerCase();
            const idStr = String(p.id || '');
            return title.includes(query) || author.includes(query) || category.includes(query) || idStr.includes(query);
        });
        setDisplayedProducts(filtered);
    };

    // Hàm xử lý upload hình ảnh - HỖ TRỢ NHIỀU ẢNH
    const handleImageUpload = ({ fileList }) => {
        console.log('🔄 Upload onChange - fileList:', fileList);

        // Cập nhật state local để hiển thị ngay lập tức
        setCurrentImageFileList(fileList);

        console.log('🔄 Đã cập nhật currentImageFileList với', fileList.length, 'ảnh');
    };

    // Hàm xử lý xóa hình ảnh
    const handleImageRemove = (file) => {
        console.log('🗑️ Xóa hình ảnh:', file);

        // Lọc ra file cần xóa và cập nhật state
        const updatedFileList = currentImageFileList.filter(f => f.uid !== file.uid);
        setCurrentImageFileList(updatedFileList);

        console.log('🗑️ Sau khi xóa, còn lại', updatedFileList.length, 'ảnh');
    };

    // Hàm xử lý preview hình ảnh
    const handleImagePreview = (file) => {
        if (file.url || file.preview) {
            const imageUrl = file.url || file.preview;
            const imgWindow = window.open();
            imgWindow.document.write(`<img src="${imageUrl}" alt="preview" />`);
        }
    };

    return (
        <div className="products-content">
            <div className="content-header">
                <h2>Quản lý sản phẩm</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm sản phẩm
                </Button>
            </div>

            <div className="search-bar">
                <Input.Search
                    placeholder="Tìm kiếm theo tên, tác giả, danh mục, ID..."
                    allowClear
                    size="large"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onSearch={(v) => handleSearch(v)}
                />
            </div>

            <Table
                columns={productColumns}
                dataSource={displayedProducts}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCurrentImageFileList([]);
                }}
                footer={null}
                width={900}
            >
                <Tabs
                    defaultActiveKey={editingProduct ? (selectedProductType === 'truyen' ? 'story' : (selectedProductType === 'van-phong-pham' ? 'stationery' : 'book')) : 'book'}
                    type="card"
                    destroyInactiveTabPane
                    onChange={(activeKey) => {
                        if (activeKey === 'book') {
                            setSelectedProductType('sach');
                        } else if (activeKey === 'story') {
                            setSelectedProductType('truyen');
                        } else if (activeKey === 'stationery') {
                            setSelectedProductType('van-phong-pham');
                        }
                    }}
                >
                    {/* Tab Sách */}
                    <TabPane tab="Sách" key="book">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={editingProduct || {}}
                        >
                            {/* Tên sản phẩm */}
                            <Form.Item
                                name="productName"
                                label="Tên sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" />
                            </Form.Item>

                            {/* Hình ảnh - HỖ TRỢ NHIỀU ẢNH */}
                            <Form.Item
                                name="images"
                                label="Hình ảnh sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng upload ít nhất 1 hình ảnh!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={5}
                                    multiple={true}
                                    beforeUpload={() => false}
                                    fileList={currentImageFileList}
                                    onChange={handleImageUpload}
                                    onRemove={handleImageRemove}
                                    onPreview={handleImagePreview}
                                >
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>Tối đa 5 ảnh</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                            {/* Mô tả */}
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            >
                                <Input.TextArea
                                    placeholder="Nhập mô tả sản phẩm"
                                    rows={3}
                                />
                            </Form.Item>

                            {/* Giá và Số lượng */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="price"
                                        label="Giá"
                                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="stockQuantity"
                                        label="Số lượng tồn kho"
                                        rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập số lượng"
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Kích thước và Trọng lượng */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="packageDimensions"
                                        label="Kích thước đóng gói (cm)"
                                        rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
                                    >
                                        <Input placeholder="VD: 10x10x10" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="weightGrams"
                                        label="Trọng lượng (gram)"
                                        rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập trọng lượng"
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Danh mục */}
                            <Form.Item
                                name="category"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục (theo Tất cả sản phẩm)">
                                    <Option value="summer">Hè đọc - Hè khác biệt</Option>
                                    <Option value="children">Sách mầm non</Option>
                                    <Option value="thieu-nhi">Sách thiếu nhi</Option>
                                    <Option value="lifeSkills">Sách kĩ năng</Option>
                                    <Option value="business">Sách kinh doanh</Option>
                                    <Option value="parenting">Sách mẹ và bé</Option>
                                    <Option value="literature">Sách văn học</Option>
                                    <Option value="reference">Sách tham khảo</Option>
                                    <Option value="toys">Đồ chơi trẻ em - VPP</Option>
                                </Select>
                            </Form.Item>

                            {/* Mục con theo danh mục cha */}
                            <Form.Item
                                shouldUpdate={(prev, curr) => prev.category !== curr.category}
                                style={{ marginBottom: 0 }}
                            >
                                {() => {
                                    const parent = form.getFieldValue('category');
                                    const subs = subcategoryMap[parent] || [];
                                    if (subs.length === 0) return null;
                                    return (
                                        <Form.Item name="subcategory" label="Mục con">
                                            <Select placeholder="Chọn mục con">
                                                {subs.map(slug => (
                                                    <Option key={slug} value={slug}>{subLabel(slug)}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>

                            {/* Nhà xuất bản */}
                            <Form.Item
                                name="publisherName"
                                label="Nhà xuất bản"
                                rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                            >
                                <Input placeholder="Nhập tên nhà xuất bản" />
                            </Form.Item>

                            {/* Tác giả */}
                            <Form.Item
                                name="author_name"
                                label="Tác giả"
                                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Nhập tên tác giả (Enter để thêm)"
                                    style={{ width: '100%' }}
                                    tokenSeparators={[',']}
                                    allowClear
                                />
                            </Form.Item>

                            {/* Năm xuất bản và Số trang */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="publicationYear"
                                        label="Năm xuất bản"
                                        rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
                                    >
                                        <InputNumber
                                            placeholder="VD: 2024"
                                            style={{ width: '100%' }}
                                            min={1900}
                                            max={new Date().getFullYear()}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="pageCount"
                                        label="Số trang"
                                        rules={[{ required: true, message: 'Vui lòng nhập số trang!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập số trang"
                                            style={{ width: '100%' }}
                                            min={1}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* ISBN và Loại bìa */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="isbn"
                                        label="ISBN"
                                        rules={[{ required: true, message: 'Vui lòng nhập ISBN!' }]}
                                    >
                                        <Input placeholder="Nhập mã ISBN" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="coverType"
                                        label="Loại bìa"
                                        rules={[{ required: true, message: 'Vui lòng chọn loại bìa!' }]}
                                    >
                                        <Select placeholder="Chọn loại bìa">
                                            <Option value="bia-mem">Bìa mềm</Option>
                                            <Option value="bia-cung">Bìa cứng</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Phần riêng cho Sách - Lớp */}
                            <Form.Item
                                name="gradeLevel"
                                label="Lớp"
                                rules={[{ required: true, message: 'Vui lòng chọn lớp!' }]}
                            >
                                <Select placeholder="Chọn lớp">
                                    <Option value="lop-1">Lớp 1</Option>
                                    <Option value="lop-2">Lớp 2</Option>
                                    <Option value="lop-3">Lớp 3</Option>
                                    <Option value="lop-4">Lớp 4</Option>
                                    <Option value="lop-5">Lớp 5</Option>
                                    <Option value="lop-6">Lớp 6</Option>
                                    <Option value="lop-7">Lớp 7</Option>
                                    <Option value="lop-8">Lớp 8</Option>
                                    <Option value="lop-9">Lớp 9</Option>
                                    <Option value="lop-10">Lớp 10</Option>
                                    <Option value="lop-11">Lớp 11</Option>
                                    <Option value="lop-12">Lớp 12</Option>
                                    <Option value="dai-hoc">Đại học</Option>
                                    <Option value="khac">Khác</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                                    </Button>
                                    <Button onClick={() => {
                                        setIsModalVisible(false);
                                        setCurrentImageFileList([]);
                                    }}>
                                        Hủy
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    {/* Tab Truyện */}
                    <TabPane tab="Truyện" key="story">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={editingProduct || {}}
                        >
                            {/* Tên sản phẩm */}
                            <Form.Item
                                name="productName"
                                label="Tên sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" />
                            </Form.Item>

                            {/* Hình ảnh - HỖ TRỢ NHIỀU ẢNH */}
                            <Form.Item
                                name="images"
                                label="Hình ảnh sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng upload ít nhất 1 hình ảnh!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={5}
                                    multiple={true}
                                    beforeUpload={() => false}
                                    fileList={currentImageFileList}
                                    onChange={handleImageUpload}
                                    onRemove={handleImageRemove}
                                    onPreview={handleImagePreview}
                                >
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>Tối đa 5 ảnh</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                            {/* Mô tả */}
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            >
                                <Input.TextArea
                                    placeholder="Nhập mô tả sản phẩm"
                                    rows={3}
                                />
                            </Form.Item>

                            {/* Giá và Số lượng */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="price"
                                        label="Giá"
                                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="stockQuantity"
                                        label="Số lượng tồn kho"
                                        rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập số lượng"
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Kích thước và Trọng lượng */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="packageDimensions"
                                        label="Kích thước đóng gói (cm)"
                                        rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
                                    >
                                        <Input placeholder="VD: 10x10x10" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="weightGrams"
                                        label="Trọng lượng (gram)"
                                        rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập trọng lượng"
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Danh mục */}
                            <Form.Item
                                name="category"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục (theo Tất cả sản phẩm)">
                                    <Option value="summer">Hè đọc - Hè khác biệt</Option>
                                    <Option value="children">Sách mầm non</Option>
                                    <Option value="thieu-nhi">Sách thiếu nhi</Option>
                                    <Option value="lifeSkills">Sách kĩ năng</Option>
                                    <Option value="business">Sách kinh doanh</Option>
                                    <Option value="parenting">Sách mẹ và bé</Option>
                                    <Option value="literature">Sách văn học</Option>
                                    <Option value="reference">Sách tham khảo</Option>
                                    <Option value="toys">Đồ chơi trẻ em - VPP</Option>
                                </Select>
                            </Form.Item>

                            {/* Mục con theo danh mục cha */}
                            <Form.Item
                                shouldUpdate={(prev, curr) => prev.category !== curr.category}
                                style={{ marginBottom: 0 }}
                            >
                                {() => {
                                    const parent = form.getFieldValue('category');
                                    const subs = subcategoryMap[parent] || [];
                                    if (subs.length === 0) return null;
                                    return (
                                        <Form.Item name="subcategory" label="Mục con">
                                            <Select placeholder="Chọn mục con">
                                                {subs.map(slug => (
                                                    <Option key={slug} value={slug}>{subLabel(slug)}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>

                            {/* Nhà xuất bản */}
                            <Form.Item
                                name="publisherName"
                                label="Nhà xuất bản"
                                rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                            >
                                <Input placeholder="Nhập tên nhà xuất bản" />
                            </Form.Item>

                            {/* Tác giả */}
                            <Form.Item
                                name="author_name"
                                label="Tác giả"
                                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Nhập tên tác giả (Enter để thêm)"
                                    style={{ width: '100%' }}
                                    tokenSeparators={[',']}
                                    allowClear
                                />
                            </Form.Item>

                            {/* Năm xuất bản và Số tập */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="publicationYear"
                                        label="Năm xuất bản"
                                        rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
                                    >
                                        <InputNumber
                                            placeholder="VD: 2024"
                                            style={{ width: '100%' }}
                                            min={1900}
                                            max={new Date().getFullYear()}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="pageCount"
                                        label="Số tập"
                                        rules={[{ required: true, message: 'Vui lòng nhập số tập!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập số tập"
                                            style={{ width: '100%' }}
                                            min={1}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* ISBN và Loại bìa */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="isbn"
                                        label="ISBN"
                                        rules={[{ required: true, message: 'Vui lòng nhập ISBN!' }]}
                                    >
                                        <Input placeholder="Nhập mã ISBN" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="coverType"
                                        label="Loại bìa"
                                        rules={[{ required: true, message: 'Vui lòng chọn loại bìa!' }]}
                                    >
                                        <Select placeholder="Chọn loại bìa">
                                            <Option value="bia-mem">Bìa mềm</Option>
                                            <Option value="bia-cung">Bìa cứng</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Phần riêng cho Truyện - Độ tuổi và Thể loại */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="ageRating"
                                        label="Độ tuổi"
                                        rules={[{ required: true, message: 'Vui lòng chọn độ tuổi!' }]}
                                    >
                                        <Select placeholder="Chọn độ tuổi">
                                            <Option value="T3">T3+ (3 tuổi trở lên)</Option>
                                            <Option value="T6">T6+ (6 tuổi trở lên)</Option>
                                            <Option value="T9">T9+ (9 tuổi trở lên)</Option>
                                            <Option value="T13">T13+ (13 tuổi trở lên)</Option>
                                            <Option value="T16">T16+ (16 tuổi trở lên)</Option>
                                            <Option value="T18">T18+ (18 tuổi trở lên)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="genres"
                                        label="Thể loại"
                                        rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                                    >
                                        <Select placeholder="Chọn thể loại">
                                            <Option value="hanh-dong">Hành động</Option>
                                            <Option value="tinh-cam">Tình cảm</Option>
                                            <Option value="hai-huoc">Hài hước</Option>
                                            <Option value="kinh-di">Kinh dị</Option>
                                            <Option value="phieu-luu">Phiêu lưu</Option>
                                            <Option value="giai-tri">Giải trí</Option>
                                            <Option value="hoc-duong">Học đường</Option>
                                            <Option value="khac">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                                    </Button>
                                    <Button onClick={() => {
                                        setIsModalVisible(false);
                                        setCurrentImageFileList([]);
                                    }}>
                                        Hủy
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    {/* Tab Văn phòng phẩm */}
                    <TabPane tab="Văn phòng phẩm" key="stationery">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={editingProduct || {}}
                        >
                            {/* Tên sản phẩm */}
                            <Form.Item
                                name="productName"
                                label="Tên sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" />
                            </Form.Item>

                            {/* Hình ảnh - HỖ TRỢ NHIỀU ẢNH */}
                            <Form.Item
                                name="images"
                                label="Hình ảnh sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng upload ít nhất 1 hình ảnh!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={5}
                                    multiple={true}
                                    beforeUpload={() => false}
                                    fileList={currentImageFileList}
                                    onChange={handleImageUpload}
                                    onRemove={handleImageRemove}
                                    onPreview={handleImagePreview}
                                >
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>Tối đa 5 ảnh</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                            {/* Mô tả */}
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            >
                                <Input.TextArea placeholder="Nhập mô tả sản phẩm" rows={3} />
                            </Form.Item>

                            {/* Giá và Tồn kho */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="price"
                                        label="Giá"
                                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="stockQuantity"
                                        label="Số lượng tồn kho"
                                        rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
                                    >
                                        <InputNumber placeholder="Nhập số lượng" style={{ width: '100%' }} min={0} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Kích thước & Trọng lượng */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="packageDimensions"
                                        label="Kích thước đóng gói (cm)"
                                        rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
                                    >
                                        <Input placeholder="VD: 10x10x10" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="weightGrams"
                                        label="Trọng lượng (gram)"
                                        rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
                                    >
                                        <InputNumber placeholder="Nhập trọng lượng" style={{ width: '100%' }} min={0} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Danh mục & Mục con */}
                            <Form.Item
                                name="category"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục (theo Tất cả sản phẩm)">
                                    <Option value="summer">Hè đọc - Hè khác biệt</Option>
                                    <Option value="children">Sách mầm non</Option>
                                    <Option value="thieu-nhi">Sách thiếu nhi</Option>
                                    <Option value="lifeSkills">Sách kĩ năng</Option>
                                    <Option value="business">Sách kinh doanh</Option>
                                    <Option value="parenting">Sách mẹ và bé</Option>
                                    <Option value="literature">Sách văn học</Option>
                                    <Option value="reference">Sách tham khảo</Option>
                                    <Option value="toys">Đồ chơi trẻ em - VPP</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item shouldUpdate={(prev, curr) => prev.category !== curr.category} style={{ marginBottom: 0 }}>
                                {() => {
                                    const parent = form.getFieldValue('category');
                                    const subs = subcategoryMap[parent] || [];
                                    if (subs.length === 0) return null;
                                    return (
                                        <Form.Item name="subcategory" label="Mục con">
                                            <Select placeholder="Chọn mục con">
                                                {subs.map(slug => (
                                                    <Option key={slug} value={slug}>{subLabel(slug)}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>

                            {/* Nhà xuất bản */
                            }
                            <Form.Item
                                name="publisherName"
                                label="Nhà xuất bản"
                                rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                            >
                                <Input placeholder="Nhập tên nhà xuất bản" />
                            </Form.Item>

                            {/* Tác giả */}
                            <Form.Item
                                name="author_name"
                                label="Tác giả"
                                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Nhập tên tác giả (Enter để thêm)"
                                    style={{ width: '100%' }}
                                    tokenSeparators={[',']}
                                    allowClear
                                />
                            </Form.Item>

                            {/* Màu sắc & Chất liệu */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="color"
                                        label="Màu sắc"
                                        rules={[{ required: true, message: 'Vui lòng nhập màu sắc!' }]}
                                    >
                                        <Input placeholder="VD: Xanh, Đỏ..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="material"
                                        label="Chất liệu"
                                        rules={[{ required: true, message: 'Vui lòng nhập chất liệu!' }]}
                                    >
                                        <Input placeholder="VD: Nhựa, Gỗ..." />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Nơi sản xuất */}
                            <Form.Item
                                name="manufacturingLocation"
                                label="Nơi sản xuất"
                                rules={[{ required: true, message: 'Vui lòng nhập nơi sản xuất!' }]}
                            >
                                <Input placeholder="VD: Nhật Bản, Việt Nam..." />
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">{editingProduct ? 'Cập nhật' : 'Thêm mới'}</Button>
                                    <Button onClick={() => { setIsModalVisible(false); setCurrentImageFileList([]); }}>Hủy</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Modal>

            {/* Modal xem chi tiết sản phẩm */}
            <Modal
                title="Chi tiết sản phẩm"
                open={!!viewingProduct}
                onCancel={() => setViewingProduct(null)}
                footer={[
                    <Button key="close" onClick={() => setViewingProduct(null)}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {viewingProduct && (
                    <div>
                        {/* Hiển thị hình ảnh sản phẩm */}
                        {viewingProduct.images && viewingProduct.images.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h4>Hình ảnh sản phẩm ({viewingProduct.images.length} ảnh)</h4>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {viewingProduct.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #d9d9d9',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => window.open(image, '_blank')}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>ID:</strong> {viewingProduct.id}</p>
                                <p><strong>Tên sản phẩm:</strong> {viewingProduct.title}</p>
                                <p><strong>Tác giả:</strong> {viewingProduct.author}</p>
                                <p><strong>Giá:</strong> {viewingProduct.price?.toLocaleString()} ₫</p>
                                <p><strong>Danh mục:</strong> {viewingProduct.category}</p>
                                <p><strong>Tồn kho:</strong> {viewingProduct.stock}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Trạng thái:</strong>
                                    <Tag color={viewingProduct.status === 'active' ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                                        {viewingProduct.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                    </Tag>
                                </p>
                                <p><strong>Mô tả:</strong> {viewingProduct.description}</p>
                                <p><strong>Nhà xuất bản:</strong> {viewingProduct.publisherName}</p>
                                {viewingProduct.productType === 'van-phong-pham' ? (
                                    <>
                                        <p><strong>Màu sắc:</strong> {viewingProduct.color}</p>
                                        <p><strong>Chất liệu:</strong> {viewingProduct.material}</p>
                                        <p><strong>Nơi sản xuất:</strong> {viewingProduct.manufacturingLocation}</p>
                                        <p><strong>Kích thước đóng gói:</strong> {viewingProduct.packageDimensions}</p>
                                        <p><strong>Trọng lượng:</strong> {viewingProduct.weightGrams} gram</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Năm xuất bản:</strong> {viewingProduct.publicationYear}</p>
                                        <p><strong>Số trang:</strong> {viewingProduct.pageCount}</p>
                                        <p><strong>ISBN:</strong> {viewingProduct.isbn}</p>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CommonProductManagement;
