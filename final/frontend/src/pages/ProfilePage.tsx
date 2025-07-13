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
import { useAuth } from '../AuthContext';

const { Title, Text } = Typography;

export default function ProfilePage(): React.JSX.Element {
  const { user } = useAuth();
  
  // Sample profile state
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
        const username = localStorage.getItem('username') || user;
        
        if (!token) {
          console.error('No token found');
          return;
        }
        
        // Load profile info from backend
        try {
          const profileResponse = await fetch('http://localhost:3001/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.user) {
              setProfile(prev => ({
                ...prev,
                name: profileData.user.username,
              }));
            }
          }
        } catch (error) {
          console.error('Backend not available, using fallback data');
        }
        
        // Demo passwords for different users (in a real app, this would be handled securely)
        const demoPasswords: { [key: string]: string } = {
          'admin': 'admin123',
          'test': 'test123',
          'user': 'password123',
        };
        
        const currentUsername = username || 'admin';
        const demoPassword = demoPasswords[currentUsername] || 'password123';
        
        setActualPassword(demoPassword);
        setProfile(prev => ({
          ...prev,
          name: currentUsername,
          password: demoPassword,
        }));
        
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to default demo data
        setActualPassword('admin123');
        setProfile(prev => ({
          ...prev,
          name: 'admin',
          password: 'admin123',
        }));
      }
    };

    loadUserData();
  }, [user]);

  // For dropdown
  const [itemsModalVisible, setItemsModalVisible] = useState(false);

  // For settings
  const [theme, setTheme] = useState('Light');
  const [lang, setLang] = useState('Eng');

  // Theme colors
  const themeColors = {
    Light: {
      background: '#10809b',
      cardBackground: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#888888',
      textLabel: '#7b8',
      border: '#f0f0f0',
      hoverBackground: '#f0f0f0',
    },
    Dark: {
      background: '#1a1a1a',
      cardBackground: '#2d2d2d',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      textLabel: '#9cb3bb',
      border: '#404040',
      hoverBackground: '#404040',
    },
  };

  const currentTheme = themeColors[theme as keyof typeof themeColors];

  // Language translations
  const translations = {
    Eng: {
      myProfile: 'My Profile',
      settings: 'Settings',
      items: 'Items',
      logOut: 'Log Out',
      profileSettings: 'Profile Settings',
      profilePicture: 'Profile Picture',
      changeProfilePicture: 'Change your profile picture',
      uploadFromDevice: 'Upload Picture from Device',
      enterImageUrl: 'Enter image URL',
      chooseFromPresets: 'Or choose from preset options:',
      backToProfile: 'Back to Profile',
      name: 'Name',
      password: 'Password',
      enterNewPassword: 'Enter new password',
      saveChange: 'Save Change',
      editProfile: 'Edit Profile',
      save: 'Save',
      cancel: 'Cancel',
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      itemsCollection: 'Items Collection',
      equippedItems: 'Equipped Items',
      noItemsEquipped: 'No items equipped',
      availableItems: 'Available Items:',
      close: 'Close',
      profilePictureUpdated: 'Profile picture updated!',
      profilePictureUploaded: 'Profile picture uploaded successfully!',
    },
    JP: {
      myProfile: 'マイプロフィール',
      settings: '設定',
      items: 'アイテム',
      logOut: 'ログアウト',
      profileSettings: 'プロフィール設定',
      profilePicture: 'プロフィール画像',
      changeProfilePicture: 'プロフィール画像を変更',
      uploadFromDevice: 'デバイスから画像をアップロード',
      enterImageUrl: '画像URLを入力',
      chooseFromPresets: 'またはプリセットオプションから選択:',
      backToProfile: 'プロフィールに戻る',
      name: '名前',
      password: 'パスワード',
      enterNewPassword: '新しいパスワードを入力',
      saveChange: '変更を保存',
      editProfile: 'プロフィール編集',
      save: '保存',
      cancel: 'キャンセル',
      theme: 'テーマ',
      language: '言語',
      light: 'ライト',
      dark: 'ダーク',
      itemsCollection: 'アイテムコレクション',
      equippedItems: '装備中のアイテム',
      noItemsEquipped: '装備中のアイテムなし',
      availableItems: '利用可能なアイテム:',
      close: '閉じる',
      profilePictureUpdated: 'プロフィール画像が更新されました！',
      profilePictureUploaded: 'プロフィール画像のアップロードが完了しました！',
    },
  };

  const t = translations[lang as keyof typeof translations];

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

  const handleSave = () => {
    setProfile(editingProfile);
    setActualPassword(editingProfile.password); // Update the actual password
    setEditModal(false);
    message.success('Profile updated successfully!');
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
          label: `${profile.equippedEmojis.length} ${t.equippedItems.toLowerCase()}`,
          key: 'count',
          disabled: true,
        },
        {
          label: t.items,
          key: 'open',
          onClick: () => setItemsModalVisible(true),
        },
      ]}
    />
  );

  return (
    <div className={`profile-page ${theme === 'Light' ? 'profile-page-light' : 'profile-page-dark'}`}>
      <Row justify="center" align="middle" className="profile-main-row">
        {/* Left Section */}
        <Col xs={24} md={7} className="profile-left-col">
          <Card
            className={`profile-left-card ${theme === 'Light' ? 'profile-left-card-light' : 'profile-left-card-dark'}`}
            bodyStyle={{ padding: 32, paddingBottom: 12 }}
          >
            <div className="profile-avatar-section">
              <Avatar size={56} src={profile.profilePicture} />
              <div>
                <Text
                  strong
                  className={`profile-username ${
                    theme === 'Light' ? 'profile-username-light' : 'profile-username-dark'
                  }`}
                >
                  {profile.name}
                </Text>
              </div>
            </div>
            <Divider
              className={`profile-divider ${theme === 'Light' ? 'profile-divider-light' : 'profile-divider-dark'}`}
            />
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
                icon={
                  <UserOutlined
                    className={`profile-menu-icon ${
                      theme === 'Light' ? 'profile-menu-icon-light' : 'profile-menu-icon-dark'
                    }`}
                  />
                }
                className={`profile-menu-item ${
                  theme === 'Light' ? 'profile-menu-item-light' : 'profile-menu-item-dark'
                }`}
              >
                {t.myProfile}
              </Menu.Item>
              <Menu.Item
                key="settings"
                icon={
                  <SettingOutlined
                    className={`profile-menu-icon ${
                      theme === 'Light' ? 'profile-menu-icon-light' : 'profile-menu-icon-dark'
                    }`}
                  />
                }
                className={`profile-menu-item ${
                  theme === 'Light' ? 'profile-menu-item-light' : 'profile-menu-item-dark'
                }`}
              >
                {t.settings}
              </Menu.Item>
              <Menu.Item
                key="items"
                icon={
                  <BellOutlined
                    className={`profile-menu-icon ${
                      theme === 'Light' ? 'profile-menu-icon-light' : 'profile-menu-icon-dark'
                    }`}
                  />
                }
                className={`profile-menu-item ${
                  theme === 'Light' ? 'profile-menu-item-light' : 'profile-menu-item-dark'
                }`}
              >
                <Space>
                  {t.items}
                  <Dropdown overlay={itemsMenu} trigger={['click']}>
                    <Button
                      size="small"
                      type="link"
                      className={`profile-items-dropdown-button ${
                        theme === 'Light' ? 'profile-items-dropdown-button-light' : 'profile-items-dropdown-button-dark'
                      }`}
                    >
                      {profile.equippedEmojis.length} <DownOutlined className="profile-items-dropdown-icon" />
                    </Button>
                  </Dropdown>
                </Space>
              </Menu.Item>
              <Menu.Item
                key="language"
                className={`profile-menu-item ${
                  theme === 'Light' ? 'profile-menu-item-light' : 'profile-menu-item-dark'
                }`}
              >
                <Space>
                  {t.language}
                  <Select
                    size="small"
                    value={lang}
                    className="profile-settings-select"
                    onChange={v => setLang(v)}
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
          <Card
            className={`profile-right-card ${
              theme === 'Light' ? 'profile-right-card-light' : 'profile-right-card-dark'
            }`}
            bodyStyle={{ padding: 40, paddingBottom: 28 }}
          >
            {activeSection === 'profile' ? (
              // Profile Section
              <>
                <div className="profile-header-section">
                  <Avatar size={64} src={profile.profilePicture} />
                  <div className="profile-header-info">
                    <div className="profile-header-name-row">
                      <Text
                        strong
                        className={`profile-header-name ${
                          theme === 'Light' ? 'profile-header-name-light' : 'profile-header-name-dark'
                        }`}
                      >
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
                <Divider
                  className={`profile-divider ${theme === 'Light' ? 'profile-divider-light' : 'profile-divider-dark'}`}
                />
                <div className="profile-info-section">
                  <div className="profile-info-row">
                    <span
                      className={`profile-info-label ${
                        theme === 'Light' ? 'profile-info-label-light' : 'profile-info-label-dark'
                      }`}
                    >
                      {t.name}
                    </span>
                    <span
                      className={`profile-info-value ${
                        theme === 'Light' ? 'profile-info-value-light' : 'profile-info-value-dark'
                      }`}
                    >
                      {profile.name}
                    </span>
                  </div>

                  <div className="profile-info-row">
                    <span
                      className={`profile-info-label ${
                        theme === 'Light' ? 'profile-info-label-light' : 'profile-info-label-dark'
                      }`}
                    >
                      {t.password}
                    </span>
                    <span
                      className={`profile-info-value profile-password-display ${
                        theme === 'Light' ? 'profile-info-value-light' : 'profile-info-value-dark'
                      }`}
                    >
                      {showPassword ? (actualPassword || profile.password) : '•'.repeat(8)}
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
                <Button type="primary" className="profile-save-button">
                  {t.saveChange}
                </Button>
              </>
            ) : (
              // Settings Section - Profile Picture
              <>
                <div className="profile-settings-section-header">
                  <SettingOutlined
                    className={`profile-settings-icon ${
                      theme === 'Light' ? 'profile-settings-icon-light' : 'profile-settings-icon-dark'
                    }`}
                  />
                  <Text
                    strong
                    className={`profile-settings-section-title ${
                      theme === 'Light' ? 'profile-settings-section-title-light' : 'profile-settings-section-title-dark'
                    }`}
                  >
                    {t.profileSettings}
                  </Text>
                </div>
                <Divider
                  className={`profile-divider ${theme === 'Light' ? 'profile-divider-light' : 'profile-divider-dark'}`}
                />

                <div className="profile-picture-section">
                  <div className="profile-picture-avatar-container">
                    <Avatar size={120} src={profile.profilePicture} />
                  </div>
                  <Text
                    strong
                    className={`profile-picture-title ${
                      theme === 'Light' ? 'profile-picture-title-light' : 'profile-picture-title-dark'
                    }`}
                  >
                    {t.profilePicture}
                  </Text>
                  <Text
                    className={`profile-picture-subtitle ${
                      theme === 'Light' ? 'profile-picture-subtitle-light' : 'profile-picture-subtitle-dark'
                    }`}
                  >
                    {t.changeProfilePicture}
                  </Text>

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
                    <Text
                      className={`profile-preset-text ${
                        theme === 'Light' ? 'profile-preset-text-light' : 'profile-preset-text-dark'
                      }`}
                    >
                      {t.chooseFromPresets}
                    </Text>
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
                            profile.profilePicture === url
                              ? 'profile-preset-avatar-selected'
                              : theme === 'Light'
                              ? 'profile-preset-avatar-light'
                              : 'profile-preset-avatar-dark'
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
          <Text
            strong
            className={`profile-equipped-items-text ${
              theme === 'Light' ? 'profile-equipped-items-text-light' : 'profile-equipped-items-text-dark'
            }`}
          >
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
            <Text
              className={`profile-no-items-text ${
                theme === 'Light' ? 'profile-no-items-text-light' : 'profile-no-items-text-dark'
              }`}
            >
              {t.noItemsEquipped}
            </Text>
          )}
        </div>

        <Divider
          className={`profile-divider ${theme === 'Light' ? 'profile-divider-light' : 'profile-divider-dark'}`}
        />

        <div>
          <Text
            strong
            className={`profile-available-items-text ${
              theme === 'Light' ? 'profile-available-items-text-light' : 'profile-available-items-text-dark'
            }`}
          >
            {t.availableItems}
          </Text>
          <div className="profile-emoji-grid">
            {availableEmojis.map((emoji, index) => (
              <div
                key={index}
                className={`profile-emoji-item ${
                  profile.equippedEmojis.includes(emoji)
                    ? 'profile-emoji-item-equipped'
                    : theme === 'Light'
                    ? 'profile-emoji-item-light profile-emoji-item-hover-light'
                    : 'profile-emoji-item-dark profile-emoji-item-hover-dark'
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
}
export { ProfilePage };
