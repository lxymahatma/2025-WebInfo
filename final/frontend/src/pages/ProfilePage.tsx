import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Avatar,
  Typography,
  Divider,
  Menu,
  Dropdown,
  Modal,
  Input,
  Select,
  Space,
  Upload,
  message,
} from 'antd';

import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  EditOutlined,
  DownOutlined,
  UploadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

import './ProfilePage.css';
import { useAuth } from '../components';

const { Text } = Typography;

export const ProfilePage = (): React.JSX.Element => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: 'Loading...',
    password: '',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    equippedEmojis: [] as string[],
  });

  const [actualPassword, setActualPassword] = useState(''); // Store the actual password separately

  const [editModal, setEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(profile);
  const [activeSection, setActiveSection] = useState('profile'); // Track which section is active
  const [showPassword, setShowPassword] = useState(false); // Track password visibility

  // Load user data from backend
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          setProfile(prev => ({
            ...prev,
            name: 'No token',
            password: 'N/A',
          }));
          return;
        }

        const profileResponse = await fetch('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.user) {
            setProfile(prev => ({
              ...prev,
              name: profileData.user.username,
              password: profileData.user.password,
            }));
            setActualPassword(profileData.user.password);
          } else {
            console.error('No user data in response');
            setProfile(prev => ({
              ...prev,
              name: 'Error',
              password: 'N/A',
            }));
          }
        } else {
          console.error('Failed to fetch profile:', profileResponse.status);
          setProfile(prev => ({
            ...prev,
            name: 'Fetch failed',
            password: 'N/A',
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setProfile(prev => ({
          ...prev,
          name: 'Network error',
          password: 'N/A',
        }));
      }
    };

    loadUserData();
  }, [user]);

  // For dropdown
  const [itemsModalVisible, setItemsModalVisible] = useState(false);

  // For settings
  const [lang, setLang] = useState('Eng');
  const [translations, setTranslations] = useState<any>({
    Eng: {
      myProfile: 'My Profile',
      settings: 'Settings',
      items: 'Items',
      language: 'Language',
      loading: 'Loading...',
    },
    JP: {
      myProfile: 'マイプロフィール',
      settings: '設定',
      items: 'アイテム',
      language: '言語',
      loading: '読み込み中...',
    },
  });

  // Load language data from backend
  useEffect(() => {
    const loadLanguageData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3001/languages', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTranslations(data.translations);
          setLang(data.userLanguage || 'Eng');
        } else {
          console.error('Failed to load translations from backend');
        }
      } catch (error) {
        console.error('Error loading language data:', error);
      }
    };

    loadLanguageData();
  }, []);

  // Update language setting on backend
  const updateLanguage = async (newLang: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3001/languages', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: newLang }),
      });

      if (response.ok) {
        setLang(newLang);
      }
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const t = translations[lang as keyof typeof translations] || {};

  const getText = (key: string, fallback?: string) => {
    return t[key] || fallback || key;
  };

  // Available emojis for items
  const availableEmojis = [
    '👑',
    '🎩',
    '🎓',
    '🕶️',
    '👓',
    '🎭',
    '💎',
    '⭐',
    '🔥',
    '⚡',
    '💫',
    '✨',
    '🏆',
    '🥇',
    '🏅',
    '🎖️',
    '👨‍💻',
    '🎮',
    '🦄',
    '🐲',
    '🔮',
    '🗡️',
    '🛡️',
    '🎯',
  ];

  // Handle modal open
  const openEdit = () => {
    setEditingProfile({ ...profile });
    setEditModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:3001/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: editingProfile.name,
          password: editingProfile.password,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();

        setProfile(prev => ({
          ...prev,
          name: updatedData.user.username,
          password: updatedData.user.password,
        }));
        setActualPassword(updatedData.user.password);

        setEditModal(false);
        message.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        message.error(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Network error occurred while updating profile');
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (newPictureUrl: string) => {
    setProfile(prev => ({ ...prev, profilePicture: newPictureUrl }));
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result;
      if (result && typeof result === 'string') {
        handleProfilePictureChange(result);
        message.success(t.profilePictureUploaded);
      }
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  // Handle emoji equip/unequip
  const toggleEmoji = (emoji: string) => {
    setProfile(prev => ({
      ...prev,
      equippedEmojis: prev.equippedEmojis.includes(emoji)
        ? prev.equippedEmojis.filter(e => e !== emoji)
        : [...prev.equippedEmojis, emoji],
    }));
  };

  // Items dropdown menu (just to show equipped count)
  const itemsMenu = (
    <Menu
      items={[
        {
          label: `${profile.equippedEmojis.length} ${getText('equippedItems', 'equipped items').toLowerCase()}`,
          key: 'count',
          disabled: true,
        },
        {
          label: getText('items', 'Items'),
          key: 'open',
          onClick: () => setItemsModalVisible(true),
        },
      ]}
    />
  );

  return (
    <div className="profile-page">
      <Row justify="center" align="middle" className="profile-main-row">
        {/* Left Section */}
        <Col xs={24} md={7} className="profile-left-col">
          <Card className="profile-left-card" bodyStyle={{ padding: 32, paddingBottom: 12 }}>
            <div className="profile-avatar-section">
              <Avatar size={56} src={profile.profilePicture} />
              <div>
                <Text strong className="profile-username">
                  {profile.name}
                </Text>
              </div>
            </div>
            <Divider className="profile-divider" />
            <Menu
              mode="vertical"
              className="profile-menu"
              selectedKeys={[activeSection]}
              onClick={({ key }) => {
                // Only change section for profile and settings, not items
                if (key === 'profile' || key === 'settings') {
                  setActiveSection(key);
                }
              }}
            >
              <Menu.Item
                key="profile"
                icon={<UserOutlined className="profile-menu-icon" />}
                className="profile-menu-item"
              >
                {getText('myProfile', 'My Profile')}
              </Menu.Item>
              <Menu.Item
                key="settings"
                icon={<SettingOutlined className="profile-menu-icon" />}
                className="profile-menu-item"
              >
                {getText('settings', 'Settings')}
              </Menu.Item>
              <Menu.Item
                key="items"
                icon={<BellOutlined className="profile-menu-icon" />}
                className="profile-menu-item"
              >
                <Space>
                  {getText('items', 'Items')}
                  <Dropdown overlay={itemsMenu} trigger={['click']}>
                    <Button size="small" type="link" className="profile-items-dropdown-button">
                      {profile.equippedEmojis.length} <DownOutlined className="profile-items-dropdown-icon" />
                    </Button>
                  </Dropdown>
                </Space>
              </Menu.Item>
              <Menu.Item key="language" className="profile-menu-item">
                <Space>
                  {getText('language', 'Language')}
                  <Select
                    size="small"
                    value={lang}
                    className="profile-settings-select"
                    onChange={v => updateLanguage(v)}
                    options={[
                      { value: 'Eng', label: 'English' },
                      { value: 'JP', label: '日本語' },
                    ]}
                  />
                </Space>
              </Menu.Item>
            </Menu>
          </Card>
        </Col>

        {/* Right Section */}
        <Col xs={24} md={10}>
          <Card className="profile-right-card" bodyStyle={{ padding: 40, paddingBottom: 28 }}>
            {activeSection === 'profile' ? (
              // Profile Section
              <>
                <div className="profile-header-section">
                  <Avatar size={64} src={profile.profilePicture} />
                  <div className="profile-header-info">
                    <div className="profile-header-name-row">
                      <Text strong className="profile-header-name">
                        {profile.name}
                      </Text>
                      {profile.equippedEmojis.map((emoji, index) => (
                        <span key={index} className="profile-emoji">
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button type="text" icon={<EditOutlined />} onClick={openEdit} className="profile-edit-button" />
                </div>
                <Divider className="profile-divider" />
                <div className="profile-info-section">
                  <div className="profile-info-row">
                    <span className="profile-info-label">{t.name}</span>
                    <span className="profile-info-value">{profile.name}</span>
                  </div>

                  <div className="profile-info-row">
                    <span className="profile-info-label">{t.password}</span>
                    <span className="profile-info-value profile-password-display">
                      {showPassword ? actualPassword || profile.password : '•'.repeat(8)}
                      <Button
                        type="text"
                        size="small"
                        icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => setShowPassword(!showPassword)}
                        className="profile-password-toggle-button"
                      />
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // Settings Section - Profile Picture
              <>
                <div className="profile-settings-section-header">
                  <SettingOutlined className="profile-settings-icon" />
                  <Text strong className="profile-settings-section-title">
                    {t.profileSettings}
                  </Text>
                </div>
                <Divider className="profile-divider" />

                <div className="profile-picture-section">
                  <div className="profile-picture-avatar-container">
                    <Avatar size={120} src={profile.profilePicture} />
                  </div>
                  <Text strong className="profile-picture-title">
                    {t.profilePicture}
                  </Text>
                  <Text className="profile-picture-subtitle">{t.changeProfilePicture}</Text>

                  <Space direction="vertical" className="profile-upload-space">
                    <Upload
                      accept="image/*"
                      beforeUpload={handleFileUpload}
                      showUploadList={false}
                      className="profile-upload-space"
                    >
                      <Button icon={<UploadOutlined />} className="profile-upload-button">
                        {t.uploadFromDevice}
                      </Button>
                    </Upload>

                    <Divider style={{ margin: '16px 0' }}>OR</Divider>

                    <Input
                      placeholder={t.enterImageUrl}
                      className="profile-url-input"
                      onPressEnter={e => {
                        const url = (e.target as HTMLInputElement).value;
                        if (url) {
                          handleProfilePictureChange(url);
                          (e.target as HTMLInputElement).value = '';
                          message.success(t.profilePictureUpdated);
                        }
                      }}
                    />
                    <Text className="profile-preset-text">{t.chooseFromPresets}</Text>
                    <div className="profile-preset-avatars">
                      {[
                        'https://randomuser.me/api/portraits/men/32.jpg',
                        'https://randomuser.me/api/portraits/women/44.jpg',
                        'https://randomuser.me/api/portraits/men/22.jpg',
                        'https://randomuser.me/api/portraits/women/68.jpg',
                        'https://randomuser.me/api/portraits/men/54.jpg',
                        'https://randomuser.me/api/portraits/women/19.jpg',
                      ].map((url, index) => (
                        <Avatar
                          key={index}
                          size={48}
                          src={url}
                          className={`profile-preset-avatar ${
                            profile.profilePicture === url ? 'profile-preset-avatar-selected' : 'profile-preset-avatar'
                          }`}
                          onClick={() => handleProfilePictureChange(url)}
                        />
                      ))}
                    </div>
                  </Space>
                </div>

                <Button type="primary" className="profile-back-button" onClick={() => setActiveSection('profile')}>
                  {t.backToProfile}
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal for editing profile */}
      <Modal
        title={t.editProfile}
        open={editModal}
        onOk={handleSave}
        onCancel={() => setEditModal(false)}
        okText={t.save}
        cancelText={t.cancel}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            addonBefore={t.name}
            value={editingProfile.name}
            onChange={e => setEditingProfile(p => ({ ...p, name: e.target.value }))}
          />
          <Input.Password
            addonBefore={t.password}
            value={editingProfile.password}
            onChange={e => setEditingProfile(p => ({ ...p, password: e.target.value }))}
            placeholder={t.enterNewPassword}
            iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
          />
        </Space>
      </Modal>

      {/* Items Modal */}
      <Modal
        title={t.itemsCollection}
        open={itemsModalVisible}
        onCancel={() => setItemsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setItemsModalVisible(false)}>
            {t.close}
          </Button>,
        ]}
        width={600}
      >
        <div className="profile-modal-equipped-section">
          <Text strong className="profile-equipped-items-text">
            {t.equippedItems} ({profile.equippedEmojis.length}):{' '}
          </Text>
          {profile.equippedEmojis.length > 0 ? (
            <div className="profile-modal-equipped-emojis">
              {profile.equippedEmojis.map((emoji, index) => (
                <span key={index} className="profile-modal-equipped-emoji">
                  {emoji}
                </span>
              ))}
            </div>
          ) : (
            <Text className="profile-no-items-text">{t.noItemsEquipped}</Text>
          )}
        </div>

        <Divider className="profile-divider" />

        <div>
          <Text strong className="profile-available-items-text">
            {t.availableItems}
          </Text>
          <div className="profile-emoji-grid">
            {availableEmojis.map((emoji, index) => (
              <div
                key={index}
                className={`profile-emoji-item ${
                  profile.equippedEmojis.includes(emoji) ? 'profile-emoji-item-equipped' : 'profile-emoji-item'
                }`}
                onClick={() => toggleEmoji(emoji)}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
