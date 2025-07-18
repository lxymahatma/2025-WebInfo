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

import { useAuth } from 'components';
import type { Translations, TranslationKeys, ProfileResponse, LanguageResponse, ErrorResponse } from 'types';

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
    const loadUserData = async (): Promise<void> => {
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
          const profileData = (await profileResponse.json()) as ProfileResponse;
          setProfile(prev => ({
            ...prev,
            name: profileData.user.username,
            password: profileData.user.password,
          }));
          setActualPassword(profileData.user.password);
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

    void loadUserData();
  }, [user]);

  // For dropdown
  const [itemsModalVisible, setItemsModalVisible] = useState(false);

  // For settings
  const [lang, setLang] = useState('Eng');

  const [translations, setTranslations] = useState<Translations>({
    Eng: {
      myProfile: 'My Profile',
      settings: 'Settings',
      items: 'Items',
      language: 'Language',
      loading: 'Loading...',
      name: 'Name',
      password: 'Password',
      profileSettings: 'Profile Settings',
      profilePicture: 'Profile Picture',
      changeProfilePicture: 'Change your profile picture',
      uploadFromDevice: 'Upload from device',
      enterImageUrl: 'Enter image URL',
      profilePictureUpdated: 'Profile picture updated!',
      chooseFromPresets: 'Choose from presets:',
      backToProfile: 'Back to Profile',
      editProfile: 'Edit Profile',
      save: 'Save',
      cancel: 'Cancel',
      enterNewPassword: 'Enter new password',
      itemsCollection: 'Items Collection',
      close: 'Close',
      equippedItems: 'Equipped items',
      noItemsEquipped: 'No items equipped',
      availableItems: 'Available Items',
      profilePictureUploaded: 'Profile picture uploaded!',
    },
    JP: {
      myProfile: 'マイプロフィール',
      settings: '設定',
      items: 'アイテム',
      language: '言語',
      loading: '読み込み中...',
      name: '名前',
      password: 'パスワード',
      profileSettings: 'プロフィール設定',
      profilePicture: 'プロフィール画像',
      changeProfilePicture: 'プロフィール画像を変更',
      uploadFromDevice: 'デバイスからアップロード',
      enterImageUrl: '画像URLを入力',
      profilePictureUpdated: 'プロフィール画像が更新されました！',
      chooseFromPresets: 'プリセットから選択：',
      backToProfile: 'プロフィールに戻る',
      editProfile: 'プロフィールを編集',
      save: '保存',
      cancel: 'キャンセル',
      enterNewPassword: '新しいパスワードを入力',
      itemsCollection: 'アイテムコレクション',
      close: '閉じる',
      equippedItems: '装備中のアイテム',
      noItemsEquipped: 'アイテムが装備されていません',
      availableItems: '利用可能なアイテム',
      profilePictureUploaded: 'プロフィール画像がアップロードされました！',
    },
  });

  // Load language data from backend
  useEffect(() => {
    const loadLanguageData = async (): Promise<void> => {
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
          const data = (await response.json()) as LanguageResponse;
          setTranslations(data.translations);
          setLang(data.userLanguage ?? 'Eng');
        } else {
          console.error('Failed to load translations from backend');
        }
      } catch (error) {
        console.error('Error loading language data:', error);
      }
    };

    void loadLanguageData();
  }, []);

  // Update language setting on backend
  const updateLanguage = async (newLang: string): Promise<void> => {
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

  const t = translations[lang as keyof typeof translations];

  const getText = (key: keyof TranslationKeys): string => {
    return t[key];
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

  const handleSave = async (): Promise<void> => {
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
        const updatedData = (await response.json()) as ProfileResponse;

        setProfile(prev => ({
          ...prev,
          name: updatedData.user.username,
          password: updatedData.user.password,
        }));
        setActualPassword(updatedData.user.password);

        setEditModal(false);
        message.success('Profile updated successfully!');
      } else {
        const errorData = (await response.json()) as ErrorResponse;
        message.error(`Failed to update profile: ${errorData.message ?? 'Unknown error'}`);
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
  const itemsMenuItems = [
    {
      label: `${String(profile.equippedEmojis.length)} ${getText('equippedItems').toLowerCase()}`,
      key: 'count',
      disabled: true,
    },
    {
      label: getText('items'),
      key: 'open',
      onClick: () => setItemsModalVisible(true),
    },
  ];

  return (
    <div className="min-h-screen p-0 bg-cyan-600">
      <Row justify="center" align="middle" className="items-center justify-center m-0 min-h-screen p-0">
        {/* Left Section */}
        <Col xs={24} md={7} className="flex flex-col items-center">
          <Card className="rounded-2xl shadow-lg mb-6 w-96 bg-white p-8 pb-3">
            <div className="flex items-center gap-4 mb-3">
              <Avatar size={56} src={profile.profilePicture} />
              <div>
                <Text strong className="text-lg text-black">
                  {profile.name}
                </Text>
              </div>
            </div>
            <Divider className="my-2 border-gray-200" />
            <Menu
              mode="vertical"
              className="bg-transparent border-none"
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
                icon={<UserOutlined className="text-black" />}
                className="text-base pl-0 text-black"
              >
                {getText('myProfile')}
              </Menu.Item>
              <Menu.Item
                key="settings"
                icon={<SettingOutlined className="text-black" />}
                className="text-base pl-0 text-black"
              >
                {getText('settings')}
              </Menu.Item>
              <Menu.Item
                key="items"
                icon={<BellOutlined className="text-black" />}
                className="text-base pl-0 text-black"
              >
                <Space>
                  {getText('items')}
                  <Dropdown menu={{ items: itemsMenuItems }} trigger={['click']}>
                    <Button size="small" type="link" className="font-semibold h-5 p-0 text-black">
                      {profile.equippedEmojis.length} <DownOutlined className="text-xs" />
                    </Button>
                  </Dropdown>
                </Space>
              </Menu.Item>
              <Menu.Item key="language" className="text-base pl-0 text-black">
                <Space>
                  {getText('language')}
                  <Select
                    size="small"
                    value={lang}
                    className="w-20"
                    onChange={v => void updateLanguage(v)}
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
          <Card className="rounded-3xl shadow-lg ml-7 max-w-2xl min-w-lg bg-white p-10 pb-7">
            {activeSection === 'profile' ? (
              // Profile Section
              <>
                <div className="flex items-center mb-4">
                  <Avatar size={64} src={profile.profilePicture} />
                  <div className="flex-1 ml-4">
                    <div className="flex items-center gap-2">
                      <Text strong className="text-xl text-black">
                        {profile.name}
                      </Text>
                      {profile.equippedEmojis.map(emoji => (
                        <span key={`header-emoji-${emoji}`} className="text-xl">
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button type="text" icon={<EditOutlined />} onClick={openEdit} className="ml-auto" />
                </div>
                <Divider className="my-2 border-gray-200" />
                <div className="text-base mb-6">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-cyan-700">{t.name}</span>
                    <span className="font-medium text-black">{profile.name}</span>
                  </div>

                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-cyan-700">{t.password}</span>
                    <span className="font-medium text-black flex items-center gap-2">
                      {showPassword ? actualPassword || profile.password : '•'.repeat(8)}
                      <Button
                        type="text"
                        size="small"
                        icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => setShowPassword(!showPassword)}
                        className="min-w-0 px-1"
                      />
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // Settings Section - Profile Picture
              <>
                <div className="flex items-center mb-6">
                  <SettingOutlined className="text-2xl mr-3 text-black" />
                  <Text strong className="text-xl text-black">
                    {t.profileSettings}
                  </Text>
                </div>
                <Divider className="my-2 border-gray-200" />

                <div className="mb-8 text-center">
                  <div className="mb-6">
                    <Avatar size={120} src={profile.profilePicture} />
                  </div>
                  <Text strong className="block text-lg mb-2 text-black">
                    {t.profilePicture}
                  </Text>
                  <Text className="block mb-6 text-gray-500">{t.changeProfilePicture}</Text>

                  <Space direction="vertical" className="w-full">
                    <Upload accept="image/*" beforeUpload={handleFileUpload} showUploadList={false} className="w-full">
                      <Button icon={<UploadOutlined />} className="rounded-lg h-10 mb-4 w-full">
                        {t.uploadFromDevice}
                      </Button>
                    </Upload>

                    <Divider className="my-4">OR</Divider>

                    <Input
                      placeholder={t.enterImageUrl}
                      className="mb-4"
                      onPressEnter={e => {
                        const url = (e.target as HTMLInputElement).value;
                        if (url) {
                          handleProfilePictureChange(url);
                          (e.target as HTMLInputElement).value = '';
                          message.success(t.profilePictureUpdated);
                        }
                      }}
                    />
                    <Text className="text-sm text-gray-500">{t.chooseFromPresets}</Text>
                    <div className="flex flex-wrap gap-3 justify-center mt-4">
                      {[
                        'https://randomuser.me/api/portraits/men/32.jpg',
                        'https://randomuser.me/api/portraits/women/44.jpg',
                        'https://randomuser.me/api/portraits/men/22.jpg',
                        'https://randomuser.me/api/portraits/women/68.jpg',
                        'https://randomuser.me/api/portraits/men/54.jpg',
                        'https://randomuser.me/api/portraits/women/19.jpg',
                      ].map(url => (
                        <Avatar
                          key={url}
                          size={48}
                          src={url}
                          className={`cursor-pointer transition-all duration-300 ${
                            profile.profilePicture === url ? 'border-3 border-blue-500' : 'border-2 border-gray-200'
                          }`}
                          onClick={() => handleProfilePictureChange(url)}
                        />
                      ))}
                    </div>
                  </Space>
                </div>

                <Button
                  type="primary"
                  className="rounded-lg text-base font-semibold h-9 w-36"
                  onClick={() => setActiveSection('profile')}
                >
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
        onOk={() => void handleSave()}
        onCancel={() => setEditModal(false)}
        okText={t.save}
        cancelText={t.cancel}
      >
        <Space direction="vertical" className="w-full">
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
        <div className="mb-4">
          <Text strong className="text-black">
            {t.equippedItems} ({profile.equippedEmojis.length}):{' '}
          </Text>
          {profile.equippedEmojis.length > 0 ? (
            <div className="mt-2">
              {profile.equippedEmojis.map(emoji => (
                <span key={`modal-equipped-${emoji}`} className="text-2xl mr-2">
                  {emoji}
                </span>
              ))}
            </div>
          ) : (
            <Text className="text-gray-500">{t.noItemsEquipped}</Text>
          )}
        </div>

        <Divider className="my-2 border-gray-200" />

        <div>
          <Text strong className="block mb-4 text-black">
            {t.availableItems}
          </Text>
          <div className="grid gap-3 grid-cols-8 max-h-80 overflow-y-auto">
            {availableEmojis.map(emoji => (
              <div
                key={`available-${emoji}`}
                className={`flex items-center justify-center rounded-lg cursor-pointer h-15 w-15 text-3xl transition-all duration-300 select-none ${
                  profile.equippedEmojis.includes(emoji)
                    ? 'bg-blue-100 border-3 border-blue-500'
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-100'
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
