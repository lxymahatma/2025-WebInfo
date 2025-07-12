import React, { useState } from "react";
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
  message
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  EditOutlined,
  DownOutlined,
  UploadOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfilePage() {
  // Sample profile state
  const [profile, setProfile] = useState({
    name: "Your name",
    email: "yourname@gmail.com",
    age: "",
    location: "USA",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
    equippedEmojis: [] as string[]
  });

  const [editModal, setEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(profile);
  const [activeSection, setActiveSection] = useState("profile"); // Track which section is active

  // For dropdown
  const [itemsModalVisible, setItemsModalVisible] = useState(false);

  // For settings
  const [theme, setTheme] = useState("Light");
  const [lang, setLang] = useState("Eng");

  // Theme colors
  const themeColors = {
    Light: {
      background: "#10809b",
      cardBackground: "#ffffff",
      textPrimary: "#000000",
      textSecondary: "#888888",
      textLabel: "#7b8",
      border: "#f0f0f0",
      hoverBackground: "#f0f0f0"
    },
    Dark: {
      background: "#1a1a1a",
      cardBackground: "#2d2d2d",
      textPrimary: "#ffffff",
      textSecondary: "#cccccc",
      textLabel: "#9cb3bb",
      border: "#404040",
      hoverBackground: "#404040"
    }
  };

  const currentTheme = themeColors[theme as keyof typeof themeColors];

  // Language translations
  const translations = {
    Eng: {
      myProfile: "My Profile",
      settings: "Settings",
      items: "Items",
      logOut: "Log Out",
      profileSettings: "Profile Settings",
      profilePicture: "Profile Picture",
      changeProfilePicture: "Change your profile picture",
      uploadFromDevice: "Upload Picture from Device",
      enterImageUrl: "Enter image URL",
      chooseFromPresets: "Or choose from preset options:",
      backToProfile: "Back to Profile",
      name: "Name",
      emailAccount: "Email account",
      age: "Age",
      addAge: "Add age",
      location: "Location",
      saveChange: "Save Change",
      editProfile: "Edit Profile",
      save: "Save",
      cancel: "Cancel",
      theme: "Theme",
      language: "Language",
      light: "Light",
      dark: "Dark",
      itemsCollection: "Items Collection",
      equippedItems: "Equipped Items",
      noItemsEquipped: "No items equipped",
      availableItems: "Available Items:",
      close: "Close",
      profilePictureUpdated: "Profile picture updated!",
      profilePictureUploaded: "Profile picture uploaded successfully!"
    },
    JP: {
      myProfile: "マイプロフィール",
      settings: "設定",
      items: "アイテム",
      logOut: "ログアウト",
      profileSettings: "プロフィール設定",
      profilePicture: "プロフィール画像",
      changeProfilePicture: "プロフィール画像を変更",
      uploadFromDevice: "デバイスから画像をアップロード",
      enterImageUrl: "画像URLを入力",
      chooseFromPresets: "またはプリセットオプションから選択:",
      backToProfile: "プロフィールに戻る",
      name: "名前",
      emailAccount: "メールアカウント",
      age: "年齢",
      addAge: "年齢を追加",
      location: "場所",
      saveChange: "変更を保存",
      editProfile: "プロフィール編集",
      save: "保存",
      cancel: "キャンセル",
      theme: "テーマ",
      language: "言語",
      light: "ライト",
      dark: "ダーク",
      itemsCollection: "アイテムコレクション",
      equippedItems: "装備中のアイテム",
      noItemsEquipped: "装備中のアイテムなし",
      availableItems: "利用可能なアイテム:",
      close: "閉じる",
      profilePictureUpdated: "プロフィール画像が更新されました！",
      profilePictureUploaded: "プロフィール画像のアップロードが完了しました！"
    }
  };

  const t = translations[lang as keyof typeof translations];

  // Available emojis for items
  const availableEmojis = [
    "👑", "🎩", "🎓", "🕶️", "👓", "🎭", 
    "💎", "⭐", "🔥", "⚡", "💫", "✨",
    "🏆", "🥇", "🏅", "🎖️", "👨‍💻", "🎮",
    "🦄", "🐲", "🔮", "🗡️", "🛡️", "🎯"
  ];

  // Handle modal open
  const openEdit = () => {
    setEditingProfile(profile);
    setEditModal(true);
  };

  const handleSave = () => {
    setProfile(editingProfile);
    setEditModal(false);
  };

  // Handle profile picture change
  const handleProfilePictureChange = (newPictureUrl: string) => {
    setProfile(prev => ({ ...prev, profilePicture: newPictureUrl }));
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
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
        : [...prev.equippedEmojis, emoji]
    }));
  };

  // Items dropdown menu (just to show equipped count)
  const itemsMenu = (
    <Menu
      items={[
        { 
          label: `${profile.equippedEmojis.length} ${t.equippedItems.toLowerCase()}`, 
          key: "count",
          disabled: true
        },
        { 
          label: t.items,
          key: "open",
          onClick: () => setItemsModalVisible(true)
        }
      ]}
    />
  );

  return (
    <div style={{ background: currentTheme.background, minHeight: "100vh", padding: 0 }}>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", padding: 0, margin: 0 }}
      >
        {/* Left Section */}
        <Col xs={24} md={7} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Card
            style={{
              width: 420,
              borderRadius: 18,
              marginBottom: 24,
              boxShadow: "0 8px 32px #0002",
              backgroundColor: currentTheme.cardBackground
            }}
            bodyStyle={{ padding: 32, paddingBottom: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <Avatar size={56} src={profile.profilePicture} />
              <div>
                <Text strong style={{ fontSize: 18, color: currentTheme.textPrimary }}>{profile.name}</Text>
                <div style={{ fontSize: 14, color: currentTheme.textSecondary }}>{profile.email}</div>
              </div>
            </div>
            <Divider style={{ margin: "10px 0", borderColor: currentTheme.border }} />
            <Menu 
              mode="vertical" 
              style={{ border: "none", background: "transparent" }}
              selectedKeys={[activeSection]}
              onClick={({ key }) => {
                // Only change section for profile and settings, not items
                if (key === "profile" || key === "settings") {
                  setActiveSection(key);
                }
              }}
            >
              <Menu.Item key="profile" icon={<UserOutlined style={{ color: currentTheme.textPrimary }} />} style={{ paddingLeft: 0, fontSize: 16, color: currentTheme.textPrimary }}>
                {t.myProfile}
              </Menu.Item>
              <Menu.Item key="settings" icon={<SettingOutlined style={{ color: currentTheme.textPrimary }} />} style={{ paddingLeft: 0, fontSize: 16, color: currentTheme.textPrimary }}>
                {t.settings}
              </Menu.Item>
              <Menu.Item key="items" icon={<BellOutlined style={{ color: currentTheme.textPrimary }} />} style={{ paddingLeft: 0, fontSize: 16, color: currentTheme.textPrimary }}>
                <Space>
                  {t.items}
                  <Dropdown overlay={itemsMenu} trigger={["click"]}>
                    <Button size="small" type="link" style={{ padding: 0, height: 20, fontWeight: 600, color: currentTheme.textPrimary }}>
                      {profile.equippedEmojis.length} <DownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                </Space>
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined style={{ color: currentTheme.textPrimary }} />} style={{ paddingLeft: 0, fontSize: 16, color: currentTheme.textPrimary }}>
                {t.logOut}
              </Menu.Item>
            </Menu>
          </Card>
          {/* Settings Popup */}
          <Card
            style={{
              width: 340,
              borderRadius: 14,
              boxShadow: "0 8px 32px #0002",
              marginLeft: 8,
              backgroundColor: currentTheme.cardBackground
            }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text strong style={{ fontSize: 16, color: currentTheme.textPrimary }}>{t.settings}</Text>
              <Button shape="circle" size="small" type="text" icon={<CloseIcon />} />
            </div>
            <Divider style={{ margin: "12px 0", borderColor: currentTheme.border }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: currentTheme.textPrimary }}>{t.theme}</span>
              <Select size="small" value={theme} style={{ width: 85 }} onChange={v => setTheme(v)} options={[{ value: "Light", label: t.light }, { value: "Dark", label: t.dark }]} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: currentTheme.textPrimary }}>{t.language}</span>
              <Select size="small" value={lang} style={{ width: 85 }} onChange={v => setLang(v)} options={[{ value: "Eng", label: "English" }, { value: "JP", label: "日本語" }]} />
            </div>
          </Card>
        </Col>

        {/* Right Section */}
        <Col xs={24} md={10}>
          <Card
            style={{
              borderRadius: 22,
              padding: 0,
              minWidth: 520,
              maxWidth: 600,
              marginLeft: 28,
              marginTop: 24,
              boxShadow: "0 8px 32px #0002",
              backgroundColor: currentTheme.cardBackground
            }}
            bodyStyle={{ padding: 40, paddingBottom: 28 }}
          >
            {activeSection === "profile" ? (
              // Profile Section
              <>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
                  <Avatar size={64} src={profile.profilePicture} />
                  <div style={{ marginLeft: 18, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Text strong style={{ fontSize: 21, color: currentTheme.textPrimary }}>{profile.name}</Text>
                      {profile.equippedEmojis.map((emoji, index) => (
                        <span key={index} style={{ fontSize: 20 }}>{emoji}</span>
                      ))}
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>{profile.email}</div>
                  </div>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={openEdit}
                    style={{ marginLeft: "auto" }}
                  />
                </div>
                <Divider style={{ borderColor: currentTheme.border }} />
                <div style={{ fontSize: 16, marginBottom: 26 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                    <span style={{ color: currentTheme.textLabel, fontWeight: 500 }}>{t.name}</span>
                    <span style={{ color: currentTheme.textPrimary, fontWeight: 500 }}>{profile.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                    <span style={{ color: currentTheme.textLabel, fontWeight: 500 }}>{t.emailAccount}</span>
                    <span style={{ color: currentTheme.textPrimary, fontWeight: 500 }}>{profile.email}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                    <span style={{ color: currentTheme.textLabel, fontWeight: 500 }}>{t.age}</span>
                    <span style={{ color: currentTheme.textPrimary, fontWeight: 500 }}>{profile.age ? profile.age : <Button size="small" type="link" onClick={openEdit}>{t.addAge}</Button>}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                    <span style={{ color: currentTheme.textLabel, fontWeight: 500 }}>{t.location}</span>
                    <span style={{ color: currentTheme.textPrimary, fontWeight: 500 }}>{profile.location}</span>
                  </div>
                </div>
                <Button type="primary" style={{ width: 145, height: 38, fontWeight: 600, fontSize: 16, borderRadius: 8 }}>
                  {t.saveChange}
                </Button>
              </>
            ) : (
              // Settings Section - Profile Picture
              <>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                  <SettingOutlined style={{ fontSize: 24, marginRight: 12, color: currentTheme.textPrimary }} />
                  <Text strong style={{ fontSize: 21, color: currentTheme.textPrimary }}>{t.profileSettings}</Text>
                </div>
                <Divider style={{ borderColor: currentTheme.border }} />
                
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ marginBottom: 24 }}>
                    <Avatar size={120} src={profile.profilePicture} />
                  </div>
                  <Text strong style={{ fontSize: 18, display: "block", marginBottom: 8, color: currentTheme.textPrimary }}>{t.profilePicture}</Text>
                  <Text style={{ color: currentTheme.textSecondary, marginBottom: 24, display: "block" }}>{t.changeProfilePicture}</Text>
                  
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Upload
                      accept="image/*"
                      beforeUpload={handleFileUpload}
                      showUploadList={false}
                      style={{ width: "100%" }}
                    >
                      <Button 
                        icon={<UploadOutlined />} 
                        style={{ 
                          width: "100%", 
                          height: 40, 
                          marginBottom: 16,
                          borderRadius: 8
                        }}
                      >
                        {t.uploadFromDevice}
                      </Button>
                    </Upload>
                    
                    <Divider style={{ margin: "16px 0" }}>OR</Divider>
                    
                    <Input
                      placeholder={t.enterImageUrl}
                      style={{ marginBottom: 16 }}
                      onPressEnter={(e) => {
                        const url = (e.target as HTMLInputElement).value;
                        if (url) {
                          handleProfilePictureChange(url);
                          (e.target as HTMLInputElement).value = "";
                          message.success(t.profilePictureUpdated);
                        }
                      }}
                    />
                    <Text style={{ fontSize: 14, color: currentTheme.textSecondary }}>
                      {t.chooseFromPresets}
                    </Text>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
                      {[
                        "https://randomuser.me/api/portraits/men/32.jpg",
                        "https://randomuser.me/api/portraits/women/44.jpg",
                        "https://randomuser.me/api/portraits/men/22.jpg",
                        "https://randomuser.me/api/portraits/women/68.jpg",
                        "https://randomuser.me/api/portraits/men/54.jpg",
                        "https://randomuser.me/api/portraits/women/19.jpg"
                      ].map((url, index) => (
                        <Avatar
                          key={index}
                          size={48}
                          src={url}
                          style={{ 
                            cursor: "pointer", 
                            border: profile.profilePicture === url ? "3px solid #1890ff" : `2px solid ${currentTheme.border}`,
                            transition: "all 0.3s"
                          }}
                          onClick={() => handleProfilePictureChange(url)}
                        />
                      ))}
                    </div>
                  </Space>
                </div>
                
                <Button 
                  type="primary" 
                  style={{ width: 145, height: 38, fontWeight: 600, fontSize: 16, borderRadius: 8 }}
                  onClick={() => setActiveSection("profile")}
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
        onOk={handleSave}
        onCancel={() => setEditModal(false)}
        okText={t.save}
        cancelText={t.cancel}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            addonBefore={t.name}
            value={editingProfile.name}
            onChange={e => setEditingProfile(p => ({ ...p, name: e.target.value }))}
          />
          <Input
            addonBefore="Email"
            value={editingProfile.email}
            onChange={e => setEditingProfile(p => ({ ...p, email: e.target.value }))}
          />
          <Input
            addonBefore={t.age}
            value={editingProfile.age}
            onChange={e => setEditingProfile(p => ({ ...p, age: e.target.value }))}
            placeholder={t.addAge}
          />
          <Input
            addonBefore={t.location}
            value={editingProfile.location}
            onChange={e => setEditingProfile(p => ({ ...p, location: e.target.value }))}
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
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ color: currentTheme.textPrimary }}>{t.equippedItems} ({profile.equippedEmojis.length}): </Text>
          {profile.equippedEmojis.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              {profile.equippedEmojis.map((emoji, index) => (
                <span key={index} style={{ fontSize: 24, marginRight: 8 }}>{emoji}</span>
              ))}
            </div>
          ) : (
            <Text style={{ color: currentTheme.textSecondary }}>{t.noItemsEquipped}</Text>
          )}
        </div>
        
        <Divider style={{ borderColor: currentTheme.border }} />
        
        <div>
          <Text strong style={{ marginBottom: 16, display: "block", color: currentTheme.textPrimary }}>{t.availableItems}</Text>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))", 
            gap: 12,
            maxHeight: 300,
            overflowY: "auto"
          }}>
            {availableEmojis.map((emoji, index) => (
              <div
                key={index}
                style={{
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  cursor: "pointer",
                  borderRadius: 8,
                  border: profile.equippedEmojis.includes(emoji) 
                    ? "3px solid #1890ff" 
                    : `2px solid ${currentTheme.border}`,
                  backgroundColor: profile.equippedEmojis.includes(emoji) 
                    ? "#e6f7ff" 
                    : currentTheme.cardBackground,
                  transition: "all 0.3s",
                  userSelect: "none"
                }}
                onClick={() => toggleEmoji(emoji)}
                onMouseEnter={(e) => {
                  if (!profile.equippedEmojis.includes(emoji)) {
                    e.currentTarget.style.backgroundColor = currentTheme.hoverBackground;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!profile.equippedEmojis.includes(emoji)) {
                    e.currentTarget.style.backgroundColor = currentTheme.cardBackground;
                  }
                }}
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

// Small close icon button (purely for look, does not close the card)
function CloseIcon() {
  return (
    <svg width="14" height="14" style={{ verticalAlign: "middle" }} viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  );
}
export { ProfilePage };