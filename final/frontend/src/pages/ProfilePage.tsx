import {
  BellOutlined,
  DownOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ErrorResponse } from '@eduplayground/shared/error';
import type { LanguageResponse } from '@eduplayground/shared/language';
import type { ProfileResponse } from '@eduplayground/shared/user';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';
import { useAuth } from 'components';
import React, { useEffect, useState } from 'react';
import type { TranslationKeys, Translations } from 'types/language';

const { Text } = Typography;

export const ProfilePage = (): React.JSX.Element => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: 'Loading...',
    password: '',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    equippedEmojis: [] as string[],
  });

  const [actualPassword, setActualPassword] = useState('');

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
          setProfile(previous => ({
            ...previous,
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
          setProfile(previous => ({
            ...previous,
            name: profileData.user.username,
            password: profileData.user.password,
          }));
          setActualPassword(profileData.user.password);
        } else {
          console.error('Failed to fetch profile:', profileResponse.status);
          setProfile(previous => ({
            ...previous,
            name: 'Fetch failed',
            password: 'N/A',
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setProfile(previous => ({
          ...previous,
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

        setProfile(previous => ({
          ...previous,
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
    setProfile(previous => ({ ...previous, profilePicture: newPictureUrl }));
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener('load', event => {
      const result = event.target?.result;
      if (result && typeof result === 'string') {
        handleProfilePictureChange(result);
        message.success(t.profilePictureUploaded);
      }
    });
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  // Handle emoji equip/unequip
  const toggleEmoji = (emoji: string) => {
    setProfile(previous => ({
      ...previous,
      equippedEmojis: previous.equippedEmojis.includes(emoji)
        ? previous.equippedEmojis.filter(equippedEmoji => equippedEmoji !== emoji)
        : [...previous.equippedEmojis, emoji],
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
    <div className="min-h-screen bg-cyan-600 p-0 pt-32 md:pt-40">
      <Row justify="center" align="top" className="mx-auto max-w-7xl px-4 py-12 md:px-16" gutter={[24, 24]}>
        {/* Left Section */}
        <Col xs={24} md={7} className="flex flex-col items-center mb-8 md:mb-0">
          <Card className="mb-6 w-full max-w-96 rounded-2xl bg-white p-6 md:p-8 pb-3 shadow-lg">
            <div className="mb-3 flex items-center gap-4">
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
              className="border-none bg-transparent"
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
                className="pl-0 text-base text-black"
              >
                {getText('myProfile')}
              </Menu.Item>
              <Menu.Item
                key="settings"
                icon={<SettingOutlined className="text-black" />}
                className="pl-0 text-base text-black"
              >
                {getText('settings')}
              </Menu.Item>
              <Menu.Item
                key="items"
                icon={<BellOutlined className="text-black" />}
                className="pl-0 text-base text-black"
              >
                <Space>
                  {getText('items')}
                  <Dropdown menu={{ items: itemsMenuItems }} trigger={['click']}>
                    <Button size="small" type="link" className="h-5 p-0 font-semibold text-black">
                      {profile.equippedEmojis.length} <DownOutlined className="text-xs" />
                    </Button>
                  </Dropdown>
                </Space>
              </Menu.Item>
              <Menu.Item key="language" className="pl-0 text-base text-black">
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
          <Card className="max-w-2xl min-w-lg rounded-3xl bg-white p-6 md:p-10 pb-7 shadow-lg">
            {activeSection === 'profile' ? (
              // Profile Section
              <>
                <div className="mb-4 flex items-center">
                  <Avatar size={64} src={profile.profilePicture} />
                  <div className="ml-4 flex-1">
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
                <div className="mb-6 text-base">
                  <div className="mb-4 flex justify-between">
                    <span className="font-medium text-cyan-700">{t.name}</span>
                    <span className="font-medium text-black">{profile.name}</span>
                  </div>

                  <div className="mb-4 flex justify-between">
                    <span className="font-medium text-cyan-700">{t.password}</span>
                    <span className="flex items-center gap-2 font-medium text-black">
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
                <div className="mb-6 flex items-center">
                  <SettingOutlined className="mr-3 text-2xl text-black" />
                  <Text strong className="text-xl text-black">
                    {t.profileSettings}
                  </Text>
                </div>
                <Divider className="my-2 border-gray-200" />

                <div className="mb-8 text-center">
                  <div className="mb-6">
                    <Avatar size={120} src={profile.profilePicture} />
                  </div>
                  <Text strong className="mb-2 block text-lg text-black">
                    {t.profilePicture}
                  </Text>
                  <Text className="mb-6 block text-gray-500">{t.changeProfilePicture}</Text>

                  <Space direction="vertical" className="w-full">
                    <Upload accept="image/*" beforeUpload={handleFileUpload} showUploadList={false} className="w-full">
                      <Button icon={<UploadOutlined />} className="mb-4 h-10 w-full rounded-lg">
                        {t.uploadFromDevice}
                      </Button>
                    </Upload>

                    <Divider className="my-4">OR</Divider>

                    <Input
                      placeholder={t.enterImageUrl}
                      className="mb-4"
                      onPressEnter={event => {
                        const url = (event.target as HTMLInputElement).value;
                        if (url) {
                          handleProfilePictureChange(url);
                          (event.target as HTMLInputElement).value = '';
                          message.success(t.profilePictureUpdated);
                        }
                      }}
                    />
                    <Text className="text-sm text-gray-500">{t.chooseFromPresets}</Text>
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
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
                  className="h-9 w-36 rounded-lg text-base font-semibold"
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
            onChange={event => setEditingProfile(p => ({ ...p, name: event.target.value }))}
          />
          <Input.Password
            addonBefore={t.password}
            value={editingProfile.password}
            onChange={event => setEditingProfile(p => ({ ...p, password: event.target.value }))}
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
                <span key={`modal-equipped-${emoji}`} className="mr-2 text-2xl">
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
          <Text strong className="mb-4 block text-black">
            {t.availableItems}
          </Text>
          <div className="grid max-h-80 grid-cols-8 gap-3 overflow-y-auto">
            {availableEmojis.map(emoji => (
              <div
                key={`available-${emoji}`}
                className={`flex h-15 w-15 cursor-pointer items-center justify-center rounded-lg text-3xl transition-all duration-300 select-none ${
                  profile.equippedEmojis.includes(emoji)
                    ? 'border-3 border-blue-500 bg-blue-100'
                    : 'border-2 border-gray-200 bg-white hover:bg-gray-100'
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
