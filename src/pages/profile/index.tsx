import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { storage } from '../../utils/storage';
import './index.css';

const INDUSTRIES = ['互联网', '教育', '金融', '医疗', '其他'];
const WORK_YEARS = ['1年以内', '1-3年', '3-5年', '5年以上'];

function getRiskInfo(score: number) {
  const list = [
    { max: 20, level: '安全', emoji: '✅', color: '#22c55e' },
    { max: 40, level: '轻度', emoji: '🔆', color: '#84cc16' },
    { max: 60, level: '中度', emoji: '⚠️', color: '#f59e0b' },
    { max: 80, level: '严重', emoji: '🚨', color: '#f97316' },
    { max: 101, level: '危险', emoji: '🆘', color: '#ef4444' },
  ];
  return list.find(r => score < r.max) || list[list.length - 1];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function ProfilePage() {
  const [userIndustry, setUserIndustry] = useState<string>(() => storage.get('user_industry') || '互联网');
  const [userWorkYears, setUserWorkYears] = useState<string>(() => storage.get('user_work_years') || '1-3年');
  const [joinDate] = useState<string>(() => {
    const saved = storage.get('join_date');
    if (saved) return saved;
    const now = new Date().toISOString();
    storage.set('join_date', now);
    return now;
  });

  const testHistory: any[] = storage.get('test_history') || [];
  const diaries: any[] = storage.get('diaries') || [];
  const practiceCount: number = storage.get('practice_count') || 0;
  const favoriteScripts: string[] = storage.get('favorite_scripts') || [];

  const useDays = Math.max(1, Math.floor((Date.now() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24)));

  function selectIndustry() {
    Taro.showActionSheet({
      itemList: INDUSTRIES,
      success: (res) => {
        const ind = INDUSTRIES[res.tapIndex];
        setUserIndustry(ind);
        storage.set('user_industry', ind);
      },
    });
  }

  function selectWorkYears() {
    Taro.showActionSheet({
      itemList: WORK_YEARS,
      success: (res) => {
        const wy = WORK_YEARS[res.tapIndex];
        setUserWorkYears(wy);
        storage.set('user_work_years', wy);
      },
    });
  }

  const menuItems = [
    { icon: '📊', label: '识别测试历史', page: 'test-history' },
    { icon: '📅', label: '情绪日历', page: 'emotion-calendar' },
    { icon: '🏅', label: '我的成就', page: 'achievements' },
    { icon: '⚖️', label: '离职决策助手', page: 'leave-decision' },
  ];

  return (
    <ScrollView scrollY className="profile-page">
      {/* Header gradient */}
      <View className="profile-header">
        <View className="profile-avatar">
          <Text className="profile-avatar-emoji">🌿</Text>
        </View>
        <View className="profile-info">
          <Text className="profile-name">职场清醒笔记</Text>
          <Text className="profile-meta">{userIndustry} · {userWorkYears}</Text>
          <Text className="profile-days">使用 {useDays} 天</Text>
        </View>
      </View>

      <View className="profile-content">
        {/* Stats grid */}
        <View className="stats-card">
          <View className="stats-grid">
            {[
              { label: '测试', value: testHistory.length, icon: '🔍' },
              { label: '日记', value: diaries.length, icon: '📝' },
              { label: '练习', value: practiceCount, icon: '🎭' },
              { label: '话术', value: favoriteScripts.length, icon: '💬' },
            ].map(s => (
              <View key={s.label} className="stat-item">
                <Text className="stat-icon">{s.icon}</Text>
                <Text className="stat-value">{s.value}</Text>
                <Text className="stat-label">{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View className="menu-list">
          {menuItems.map(item => (
            <View
              key={item.page}
              className="menu-item"
              onClick={() => {
                if (item.page === 'test-history') {
                  Taro.navigateTo({ url: '/pages/report/index' });
                }
              }}
            >
              <Text className="menu-icon">{item.icon}</Text>
              <Text className="menu-label">{item.label}</Text>
              <Text className="menu-arrow">›</Text>
            </View>
          ))}
        </View>

        {/* Recent tests */}
        {testHistory.length > 0 && (
          <View className="recent-card">
            <Text className="recent-title">最近测试</Text>
            {testHistory.slice(0, 3).map((t: any) => {
              const risk = getRiskInfo(t.score);
              return (
                <View key={t.id} className="recent-item">
                  <View className="recent-item-left">
                    <Text className="recent-emoji">{risk.emoji}</Text>
                    <Text className="recent-info">{risk.level} · {t.score}分</Text>
                  </View>
                  <Text className="recent-date">{formatTime(t.date)}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Settings */}
        <View className="settings-card">
          <Text className="settings-title">个人设置</Text>
          <View className="settings-item" onClick={selectIndustry}>
            <Text className="settings-item-icon">🏢</Text>
            <Text className="settings-item-label">行业</Text>
            <Text className="settings-item-value">{userIndustry}</Text>
            <Text className="settings-arrow">›</Text>
          </View>
          <View className="settings-item" onClick={selectWorkYears}>
            <Text className="settings-item-icon">📅</Text>
            <Text className="settings-item-label">工作年限</Text>
            <Text className="settings-item-value">{userWorkYears}</Text>
            <Text className="settings-arrow">›</Text>
          </View>
        </View>

        {/* Version */}
        <View className="version-footer">
          <Text className="version-text">职场清醒笔记 v1.0</Text>
          <Text className="version-slogan">你的感受是真实的</Text>
        </View>
      </View>
    </ScrollView>
  );
}
