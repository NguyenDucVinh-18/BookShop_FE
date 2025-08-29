import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Upload, Tabs, Avatar } from 'antd';
import '../styles/ProfilePage.css';
import { UploadOutlined } from '@ant-design/icons';

const PROFILE_KEY = 'userProfile';

const defaultProfile = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
};

const ProfilePage = () => {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [avatarFileList, setAvatarFileList] = useState([]);
    const [profile, setProfile] = useState(defaultProfile);
    const [notification, setNotification] = useState({ type: '', message: '', visible: false });

    // Hàm hiển thị thông báo
    const showNotification = (type, message) => {
        setNotification({ type, message, visible: true });
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            setNotification({ type: '', message: '', visible: false });
        }, 3000);
    };

    useEffect(() => {
        try {
            // Đọc thông tin từ authUser (người dùng đã đăng nhập)
            const authUser = localStorage.getItem('authUser');
            if (authUser) {
                const userData = JSON.parse(authUser);
                console.log('Loading user data from authUser:', userData);

                // Cập nhật profile state với thông tin người dùng
                const userProfile = {
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    avatar: userData.avatar || ''
                };

                setProfile(userProfile);
                form.setFieldsValue(userProfile);

                if (userProfile.avatar) {
                    setAvatarFileList([{ uid: '-1', name: 'avatar', url: userProfile.avatar }]);
                }
            } else {
                console.log('No authUser found, user not logged in');
            }
        } catch (e) {
            console.error('Error loading user profile:', e);
        }
    }, [form]);

    const handleAvatarChange = ({ fileList }) => {
        // Giữ tối đa 1 file
        const latest = fileList.slice(-1);

        // Revoke URL cũ nếu là blob
        if (avatarFileList && avatarFileList[0]?.url && avatarFileList[0].url.startsWith('blob:')) {
            try { URL.revokeObjectURL(avatarFileList[0].url); } catch (e) { }
        }

        // Tạo preview URL cho file mới chọn
        if (latest.length > 0) {
            const f = latest[0];
            if (!f.url) {
                if (f.originFileObj) {
                    const previewUrl = URL.createObjectURL(f.originFileObj);
                    f.url = previewUrl;
                }
            }
            setAvatarFileList([f]);
            setProfile(prev => ({ ...prev, avatar: f.url || '' }));
        } else {
            setAvatarFileList([]);
            setProfile(prev => ({ ...prev, avatar: '' }));
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } catch (e) {
                reject(e);
            }
        });
    };

    const onSaveProfile = async (values) => {
        console.log('=== FORM SUBMITTED ===');
        console.log('Form submitted with values:', values);
        console.log('Current profile state:', profile);

        try {
            let avatarUrl = profile.avatar;
            if (avatarFileList.length > 0) {
                const f = avatarFileList[0];
                if (f.originFileObj) {
                    // Chuyển ảnh sang Base64 để lưu bền vững (persist qua refresh)
                    avatarUrl = await readFileAsDataURL(f.originFileObj);
                } else if (f.url) {
                    avatarUrl = f.url;
                }
            } else {
                avatarUrl = '';
            }

            const payload = { ...profile, ...values, avatar: avatarUrl };
            console.log('Final payload:', payload);

            // Cập nhật cả userProfile và authUser
            localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

            // Cập nhật authUser với thông tin mới
            const authUser = localStorage.getItem('authUser');
            if (authUser) {
                const currentAuthUser = JSON.parse(authUser);
                const updatedAuthUser = { ...currentAuthUser, ...payload };
                localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
                console.log('Updated authUser with new profile data:', updatedAuthUser);

                // Thông báo cho các component khác biết authUser đã thay đổi (realtime)
                window.dispatchEvent(new Event('authUserUpdated'));

                // Cập nhật mockUsers để logic đăng nhập hoạt động đúng
                try {
                    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                    const userIndex = mockUsers.findIndex(u => u.id === currentAuthUser.id);

                    if (userIndex !== -1) {
                        // Cập nhật thông tin user trong mockUsers (giữ nguyên password)
                        mockUsers[userIndex] = {
                            ...mockUsers[userIndex],
                            fullName: payload.fullName,
                            email: payload.email,
                            phone: payload.phone,
                            address: payload.address,
                            avatar: payload.avatar
                        };

                        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                        console.log('Updated mockUsers with new profile data:', mockUsers);
                    }
                } catch (e) {
                    console.error('Error updating mockUsers:', e);
                }
            }

            setProfile(payload);

            // Hiển thị thông báo thành công
            showNotification('success', 'Đã lưu hồ sơ thành công!');

            // Thông báo chi tiết những gì đã thay đổi
            const changes = [];
            if (profile.fullName !== payload.fullName) changes.push('Họ và tên');
            if (profile.email !== payload.email) changes.push('Email');
            if (profile.phone !== payload.phone) changes.push('Số điện thoại');
            if (profile.address !== payload.address) changes.push('Địa chỉ');
            if (profile.avatar !== payload.avatar) changes.push('Ảnh đại diện');

            if (changes.length > 0) {
                setTimeout(() => {
                    showNotification('info', `Đã cập nhật: ${changes.join(', ')}`);
                }, 500);
            }

        } catch (error) {
            console.error('Error saving profile:', error);
            showNotification('error', 'Có lỗi khi lưu hồ sơ. Vui lòng thử lại!');
        }
    };

    // Thêm function để test form validation
    const onSaveProfileFailed = (errorInfo) => {
        console.log('=== FORM VALIDATION FAILED ===');
        console.log('Form validation failed:', errorInfo);
        showNotification('error', 'Vui lòng kiểm tra lại thông tin!');
    };

    const onChangePassword = async (values) => {
        try {
            console.log('=== CHANGE PASSWORD ===');
            console.log('Password change values:', values);

            // Kiểm tra mật khẩu xác nhận
            if (values.newPassword !== values.confirmPassword) {
                // Hiển thị lỗi dưới field xác nhận mật khẩu
                passwordForm.setFields([
                    {
                        name: 'confirmPassword',
                        errors: ['Mật khẩu xác nhận không trùng khớp']
                    }
                ]);
                return;
            }

            // Không cho phép mật khẩu mới trùng với mật khẩu hiện tại
            if (values.newPassword === values.currentPassword) {
                passwordForm.setFields([
                    {
                        name: 'newPassword',
                        errors: ['Mật khẩu mới phải khác mật khẩu hiện tại']
                    }
                ]);
                return;
            }

            // Lấy thông tin user hiện tại
            const authUser = localStorage.getItem('authUser');
            if (!authUser) {
                showNotification('error', 'Không tìm thấy thông tin người dùng');
                return;
            }

            const currentAuthUser = JSON.parse(authUser);
            console.log('Current auth user:', currentAuthUser);

            // KIỂM TRA MẬT KHẨU HIỆN TẠI CÓ ĐÚNG KHÔNG
            try {
                const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                const currentUser = mockUsers.find(u => u.id === currentAuthUser.id);

                if (!currentUser) {
                    showNotification('error', 'Không tìm thấy thông tin người dùng trong hệ thống');
                    return;
                }

                // Kiểm tra mật khẩu hiện tại có đúng không
                if (currentUser.password !== values.currentPassword) {
                    // Hiển thị lỗi dưới field mật khẩu hiện tại
                    passwordForm.setFields([
                        {
                            name: 'currentPassword',
                            errors: ['Mật khẩu hiện tại không đúng!']
                        }
                    ]);
                    return;
                }

                console.log('Current password verified successfully');

                // Nếu mật khẩu hiện tại đúng, mới cho phép đổi
                const userIndex = mockUsers.findIndex(u => u.id === currentAuthUser.id);

                if (userIndex !== -1) {
                    // Cập nhật mật khẩu trong mockUsers
                    mockUsers[userIndex] = {
                        ...mockUsers[userIndex],
                        password: values.newPassword
                    };

                    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                    console.log('Updated mockUsers with new password:', mockUsers);

                    // Cập nhật authUser (không cần lưu password vào authUser vì không dùng để đăng nhập)
                    const updatedAuthUser = { ...currentAuthUser };
                    localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));

                    // Reset form
                    passwordForm.resetFields();

                    // Hiển thị thông báo thành công
                    showNotification('success', 'Đổi mật khẩu thành công!');

                    // Thông báo chi tiết
                    setTimeout(() => {
                        showNotification('info', 'Bây giờ bạn có thể đăng nhập với mật khẩu mới');
                    }, 500);

                } else {
                    showNotification('error', 'Không tìm thấy thông tin người dùng trong hệ thống');
                }
            } catch (e) {
                console.error('Error updating password:', e);
                showNotification('error', 'Lỗi khi cập nhật mật khẩu');
            }

        } catch (e) {
            console.error('Error in change password:', e);
            showNotification('error', 'Lỗi khi đổi mật khẩu');
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <h1>Hồ sơ của tôi</h1>

                {/* Notification System */}
                {notification.visible && (
                    <div
                        className={`notification ${notification.type}`}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            padding: '16px 24px',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 'bold',
                            zIndex: 9999,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            backgroundColor: notification.type === 'success' ? '#52c41a' :
                                notification.type === 'error' ? '#ff4d4f' : '#1890ff'
                        }}
                    >
                        {notification.message}
                    </div>
                )}

                <Tabs
                    defaultActiveKey="info"
                    items={[
                        {
                            key: 'info',
                            label: 'Thông tin cá nhân',
                            children: (
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onSaveProfile}
                                    onFinishFailed={onSaveProfileFailed}
                                    validateTrigger="onBlur"
                                >
                                    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                        <div style={{ minWidth: 200, textAlign: 'center' }}>
                                            <Avatar size={120} src={avatarFileList[0]?.url} style={{ marginBottom: 12 }} />
                                            <Form.Item label="Ảnh đại diện" style={{ marginBottom: 0 }}>
                                                <Upload
                                                    listType="picture-card"
                                                    maxCount={1}
                                                    beforeUpload={() => false}
                                                    fileList={avatarFileList}
                                                    onChange={handleAvatarChange}
                                                >
                                                    <div>
                                                        <UploadOutlined />
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                </Upload>
                                            </Form.Item>
                                        </div>

                                        <div style={{ flex: 1, minWidth: 280 }}>
                                            <Form.Item
                                                name="fullName"
                                                label="Họ và tên"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                            >
                                                <Input placeholder="Nhập họ tên" />
                                            </Form.Item>
                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                                            >
                                                <Input placeholder="Nhập email" />
                                            </Form.Item>
                                            <Form.Item name="phone" label="Số điện thoại">
                                                <Input placeholder="Nhập số điện thoại" />
                                            </Form.Item>
                                            <Form.Item name="address" label="Địa chỉ">
                                                <Input placeholder="Nhập địa chỉ" />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="profile-save-btn"
                                                    onClick={() => {
                                                        console.log('=== BUTTON CLICKED ===');
                                                        console.log('Button clicked!');
                                                        console.log('Form values:', form.getFieldsValue());
                                                        console.log('Form is valid:', form.isFieldsValidating());
                                                    }}
                                                >
                                                    Lưu thay đổi
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Form>
                            )
                        },
                        {
                            key: 'password',
                            label: 'Đổi mật khẩu',
                            children: (
                                <Form form={passwordForm} layout="vertical" onFinish={onChangePassword} style={{ maxWidth: 420 }}>
                                    <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}>
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}>
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" rules={[{ required: true, message: 'Xác nhận mật khẩu' }]}>
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Đổi mật khẩu</Button>
                                    </Form.Item>
                                </Form>
                            )
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default ProfilePage;


