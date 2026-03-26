import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storage } from '../../utils/storage';
import { ACHIEVEMENTS } from '../../data/index';
import './index.css';

export default function ProfilePage() {
  const result = storage.get('test_result');
  const diaries: any[] = storage.get('diaries') || [];
  const count = storage.get('practice_count') || 0;
  const days = diaries.length > 0 ? Math.floor((Date.now() - new Date(diaries[diaries.length-1]?.date).getTime()) / 86400000) + 1 : 0;

  return (
    <View className="page">
      <View className="profile-card">
        <View className="avatar-circle"><Text className="av-emoji">🌳</Text></View>
        <Text className="profile-name">职场清醒用户</Text>
        <Text className="profile-days">陪你走过 {Math.max(1, days)} 天</Text>
      </View>

      <View className="stats-row">
        <View className="stat-box">
          <Text className="stat-n">{result ? result.score : '--'}</Text>
          <Text className="stat-l">压力指数</Text>
        </View>
        <View className="stat-div" />
        <View className="stat-box">
          <Text className="stat-n">{count}</Text>
          <Text className="stat-l">次练习</Text>
        </View>
        <View className="stat-div" />
        <View className="stat-box">
          <Text className="stat-n">{diaries.length}</Text>
          <Text className="stat-l">篇日记</Text>
        </View>
      </View>

      <Text className="section-title">我的成就</Text>
      <View className="achievements">
        {ACHIEVEMENTS.map(a => (
          <View key={a.id} className="achievement-item">
            <Text className="achi-icon">{a.icon}</Text>
            <View className="achi-info">
              <Text className="achi-title">{a.title}</Text>
              <Text className="achi-desc">{a.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="menu-list">
        <View className="menu-item" onClick={() => Taro.navigateTo({url: '/pages/test-history/index'})}>
          <Text className="menu-icon">📋</Text>
          <Text className="menu-text">测试历史</Text>
          <Text className="menu-arrow">›</Text>
        </View>
        <View className="menu-item" onClick={() => Taro.navigateTo({url: '/pages/leave-decision/index'})}>
          <Text className="menu-icon">🚪</Text>
          <Text className="menu-text">去/留决策</Text>
          <Text className="menu-arrow">›</Text>
        </View>
      </View>

      <View className="footer-quote">
        <Text className="fq">"你不是一个人在战斗。"</Text>
      </View>
    </View>
  );
}
