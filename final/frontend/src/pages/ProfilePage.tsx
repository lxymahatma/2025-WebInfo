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
import type { ErrorResponse } from '@eduplayground/shared/types/error';
import type { LanguageKey, TranslationKeys } from '@eduplayground/shared/types/language';
import type { ProfileResponse } from '@eduplayground/shared/types/user';
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
import { fetchUserLanguage, fetchUserProfile, updateUserLanguageRequest } from 'utils/api/user';

const { Text } = Typography;

export const ProfilePage = (): React.JSX.Element => {
  const { userName, token } = useAuth();

  const [profile, setProfile] = useState({
    name: 'Loading...',
    password: '',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    equippedEmojis: [] as string[],
  });

  const [editModal, setEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(profile);
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [itemsModalVisible, setItemsModalVisible] = useState(false);
  const [actualPassword, setActualPassword] = useState('');
  const [lang, setLang] = useState<LanguageKey>('en');

  useEffect(() => {
    const loadUserData = async () => {
      const result = await fetchUserProfile(token);

      if (result.isErr()) {
        console.error('Failed to load user profile:', result.error);
        message.error('Error loading profile data');
        setProfile(previous => ({
          ...previous,
          name: 'Error loading profile',
          password: 'N/A',
        }));
        return;
      }

      const { user } = result.value;
      setProfile(previous => ({
        ...previous,
        name: user.username,
        password: user.password,
      }));
    };

    void loadUserData();
  }, [userName, token]);

  const [translation, setTranslation] = useState<TranslationKeys>();

  useEffect(() => {
    const loadLanguageData = async () => {
      const result = await fetchUserLanguage(token);

      if (result.isErr()) {
        console.error('Failed to load user language:', result.error);
        message.error('Error loading language data');
        return;
      }

      setTranslation(result.value.translation);
      setLang(result.value.userLanguage);
    };
    void loadLanguageData();
  }, [token]);

  const updateLanguage = async (newLang: LanguageKey) => {
    const result = await updateUserLanguageRequest(token, newLang);

    if (result.isErr()) {
      console.error('Failed to update language:', result.error);
      message.error('Error updating language');
      return;
    }

    setLang(newLang);
  };

  const t: TranslationKeys | undefined = translation;

  const getText = (key: keyof TranslationKeys): string => {
    return t?.[key] ?? String(key);
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
        message.success(getText('profilePictureUploaded'));
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
    <div className="min-h-screen bg-cyan-600 p-4">
      <Row justify="center" align="middle" className="min-h-screen" gutter={[32, 16]}>
        {/* Left Section */}
        <Col xs={24} md={8} className="flex flex-col items-center">
          <Card className="mb-6 w-96 rounded-2xl bg-white p-8 pb-3 shadow-lg">
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
                      { value: 'en', label: 'English' },
                      { value: 'jp', label: '日本語' },
                    ]}
                  />
                </Space>
              </Menu.Item>
            </Menu>
          </Card>
        </Col>

        {/* Right Section */}
        <Col xs={24} md={10}>
          <Card className="w-full max-w-xl rounded-3xl bg-white p-8 pb-6 shadow-lg">
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
                    <span className="font-medium text-cyan-700">{getText('name')}</span>
                    <span className="font-medium text-black">{profile.name}</span>
                  </div>

                  <div className="mb-4 flex justify-between">
                    <span className="font-medium text-cyan-700">{getText('password')}</span>
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
                    {getText('profileSettings')}
                  </Text>
                </div>
                <Divider className="my-2 border-gray-200" />

                <div className="mb-8 text-center">
                  <div className="mb-6">
                    <Avatar size={120} src={profile.profilePicture} />
                  </div>
                  <Text strong className="mb-2 block text-lg text-black">
                    {getText('profilePicture')}
                  </Text>
                  <Text className="mb-6 block text-gray-500">{getText('changeProfilePicture')}</Text>

                  <Space direction="vertical" className="w-full">
                    <Upload accept="image/*" beforeUpload={handleFileUpload} showUploadList={false} className="w-full">
                      <Button icon={<UploadOutlined />} className="mb-4 h-10 w-full rounded-lg">
                        {getText('uploadFromDevice')}
                      </Button>
                    </Upload>

                    <Divider className="my-4">OR</Divider>

                    <Input
                      placeholder={getText('enterImageUrl')}
                      className="mb-4"
                      onPressEnter={event => {
                        const url = (event.target as HTMLInputElement).value;
                        if (url) {
                          handleProfilePictureChange(url);
                          (event.target as HTMLInputElement).value = '';
                          message.success(getText('profilePictureUpdated'));
                        }
                      }}
                    />
                    <Text className="text-sm text-gray-500">{getText('chooseFromPresets')}</Text>
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
                  {getText('backToProfile')}
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal for editing profile */}
      <Modal
        title={getText('editProfile')}
        open={editModal}
        onOk={() => void handleSave()}
        onCancel={() => setEditModal(false)}
        okText={getText('save')}
        cancelText={getText('cancel')}
      >
        <Space direction="vertical" className="w-full">
          <Input
            addonBefore={getText('name')}
            value={editingProfile.name}
            onChange={event => setEditingProfile(p => ({ ...p, name: event.target.value }))}
          />
          <Input.Password
            addonBefore={getText('password')}
            value={editingProfile.password}
            onChange={event => setEditingProfile(p => ({ ...p, password: event.target.value }))}
            placeholder={getText('enterNewPassword')}
            iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
          />
        </Space>
      </Modal>

      {/* Items Modal */}
      <Modal
        title={getText('itemsCollection')}
        open={itemsModalVisible}
        onCancel={() => setItemsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setItemsModalVisible(false)}>
            {getText('close')}
          </Button>,
        ]}
        width={600}
      >
        <div className="mb-4">
          <Text strong className="text-black">
            {getText('equippedItems')} ({profile.equippedEmojis.length}):{' '}
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
            <Text className="text-gray-500">{getText('noItemsEquipped')}</Text>
          )}
        </div>

        <Divider className="my-2 border-gray-200" />

        <div>
          <Text strong className="mb-4 block text-black">
            {getText('availableItems')}
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
