import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { storage, getRiskInfo } from '../../utils/storage';
import { PRACTICE_SCENARIOS, EMOTION_MAP, PUA_TYPE_COLORS } from '../../data';
import './index.css';

interface TestResult {
  id: string;
  date: string;
  score: number;
  riskLevel: string;
  counts: Record<string, number>;
  totalAnswered: number;
}

interface EmotionRecord {
  date: string;
  emotion: string;
}

export default function HomePage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [emotionRecords, setEmotionRecords] = useState<EmotionRecord[]>([]);
  const today = new Date();

  useEffect(() => {
    const results = storage.get('testResults') || [];
    if (results.length > 0) setTestResult(results[results.length - 1]);
    const diaries = storage.get('diaries') || [];
    const records: EmotionRecord[] = diaries.map((d: any) => ({ date: d.date, emotion: d.emotion }));
    setEmotionRecords(records);
  }, []);

  // Build calendar for current month
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Adjust for Mon start (0=Mon,...,6=Sun)
  const startOffset = (firstDay + 6) % 7;
  const calendarCells: Array<number | null> = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  function getEmotionForDay(day: number): string | null {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const rec = emotionRecords.find(r => r.date === dateStr);
    return rec ? EMOTION_MAP[rec.emotion] : null;
  }

  const emotionCounts: Record<string, number> = {};
  emotionRecords.forEach(r => {
    emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1;
  });
  const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0);

  const scenarios3 = PRACTICE_SCENARIOS.slice(0, 3);

  const puaTypes = testResult
    ? Object.entries(testResult.counts || {}).filter(([, v]) => v > 0).sort((a, b) => (b[1] as number) - (a[1] as number))
    : [];

  return (
    <ScrollView scrollY className="home-container">
      {/* Hero */}
      <View className="home-hero">
        <View className="home-hero-icon">🧠</View>
        <Text className="home-hero-title">职场清醒笔记</Text>
        <Text className="home-hero-subtitle">识别职场PUA · 找回自我边界</Text>
      </View>

      {/* Assessment Card */}
      <View className="home-section">
        {testResult ? (
          <View className="home-card assessment-card">
            <View className="assessment-header">
              <Text className="assessment-title">职场环境评估</Text>
              <Text className="assessment-date">{testResult.date?.slice(0, 10)}</Text>
            </View>
            <View className="assessment-score-row">
              <Text className="assessment-score-emoji">{getRiskInfo(testResult.score).emoji}</Text>
              <Text className="assessment-score" style={{ color: getRiskInfo(testResult.score).color }}>
                {testResult.score}
              </Text>
              <Text className="assessment-score-unit">/100</Text>
              <Text className="assessment-risk-level" style={{ color: getRiskInfo(testResult.score).color }}>
                {getRiskInfo(testResult.score).desc}
              </Text>
            </View>
            <View className="assessment-bar-wrap">
              <View className="assessment-bar-bg">
                <View
                  className="assessment-bar-fill"
                  style={{ width: `${testResult.score}%`, background: getRiskInfo(testResult.score).color }}
                />
              </View>
            </View>
            <View
              className="home-btn-outline"
              onClick={() => Taro.navigateTo({ url: '/pages/report/index' })}
            >
              <Text className="home-btn-outline-text">查看详细报告 →</Text>
            </View>
          </View>
        ) : (
          <View
            className="home-card assessment-card-empty"
            onClick={() => Taro.navigateTo({ url: '/pages/test/index' })}
          >
            <View className="assessment-empty-icon">🔍</View>
            <Text className="assessment-empty-title">职场环境评估</Text>
            <Text className="assessment-empty-desc">完成12题识别测试，了解你的职场环境风险</Text>
            <View className="home-btn-primary">
              <Text className="home-btn-primary-text">立即测试 →</Text>
            </View>
          </View>
        )}
      </View>

      {/* Quick Entries */}
      <View className="home-section">
        <View className="home-grid-2">
          <View className="home-entry-card home-entry-blue" onClick={() => Taro.navigateTo({ url: '/pages/test/index' })}>
            <Text className="home-entry-icon">📖</Text>
            <Text className="home-entry-label">识别测试</Text>
            <Text className="home-entry-sub">了解PUA套路</Text>
          </View>
          <View className="home-entry-card home-entry-orange" onClick={() => Taro.switchTab({ url: '/pages/tools/index' })}>
            <Text className="home-entry-icon">🎭</Text>
            <Text className="home-entry-label">情景练习室</Text>
            <Text className="home-entry-sub">AI模拟真实对线</Text>
          </View>
          <View className="home-entry-card home-entry-green" onClick={() => Taro.switchTab({ url: '/pages/treehole/index' })}>
            <Text className="home-entry-icon">📝</Text>
            <Text className="home-entry-label">写日记</Text>
            <Text className="home-entry-sub">记录职场点滴</Text>
          </View>
          <View className="home-entry-card home-entry-purple" onClick={() => Taro.switchTab({ url: '/pages/community/index' })}>
            <Text className="home-entry-icon">💬</Text>
            <Text className="home-entry-label">互助社区</Text>
            <Text className="home-entry-sub">找到同路人</Text>
          </View>
        </View>
      </View>

      {/* Practice Scenarios */}
      <View className="home-section">
        <View className="home-section-header">
          <Text className="home-section-title">情景练习室</Text>
          <Text
            className="home-section-more"
            onClick={() => Taro.switchTab({ url: '/pages/tools/index' })}
          >
            更多 →
          </Text>
        </View>
        <ScrollView scrollX className="home-scenario-scroll">
          {scenarios3.map(s => (
            <View
              key={s.id}
              className="home-scenario-card"
              onClick={() => Taro.navigateTo({ url: `/pages/practice/index?id=${s.id}` })}
            >
              <Text className="home-scenario-icon">{s.icon}</Text>
              <Text className="home-scenario-name">{s.title}</Text>
              <View className="home-scenario-stars">
                {[1, 2, 3].map(d => (
                  <Text key={d} className={d <= s.difficulty ? 'star-filled' : 'star-empty'}>★</Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Emotion Calendar */}
      <View className="home-section">
        <View className="home-section-header">
          <Text className="home-section-title">情绪日历</Text>
          <Text className="home-section-subtitle">{month + 1}月</Text>
        </View>
        <View className="home-card">
          <View className="calendar-header">
            {['一', '二', '三', '四', '五', '六', '日'].map(d => (
              <Text key={d} className="calendar-weekday">{d}</Text>
            ))}
          </View>
          <View className="calendar-grid">
            {calendarCells.map((day, i) => (
              <View key={i} className="calendar-cell">
                {day !== null ? (
                  <View className={`calendar-day ${day === today.getDate() ? 'calendar-day-today' : ''}`}>
                    {getEmotionForDay(day) ? (
                      <Text className="calendar-emoji">{getEmotionForDay(day)}</Text>
                    ) : (
                      <Text className="calendar-day-num">{day}</Text>
                    )}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
          {totalEmotions > 0 && (
            <View className="calendar-stats">
              {Object.entries(EMOTION_MAP).map(([name, emoji]) => {
                const count = emotionCounts[name] || 0;
                if (count === 0) return null;
                return (
                  <View key={name} className="calendar-stat-row">
                    <Text className="calendar-stat-emoji">{emoji}</Text>
                    <Text className="calendar-stat-name">{name}</Text>
                    <View className="calendar-stat-bar-bg">
                      <View
                        className="calendar-stat-bar-fill"
                        style={{ width: `${(count / totalEmotions) * 100}%` }}
                      />
                    </View>
                    <Text className="calendar-stat-count">{count}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* PUA Type Distribution */}
      {testResult && puaTypes.length > 0 && (
        <View className="home-section">
          <View className="home-section-header">
            <Text className="home-section-title">问题行为分布</Text>
          </View>
          <View className="home-card">
            {puaTypes.map(([type, count]) => {
              const color = PUA_TYPE_COLORS[type];
              return (
                <View key={type} className="pua-type-row">
                  <Text className="pua-type-emoji">{color?.emoji || '⚠️'}</Text>
                  <Text className="pua-type-name">{type}</Text>
                  <View className="pua-type-bar-bg">
                    <View
                      className="pua-type-bar-fill"
                      style={{
                        width: `${((count as number) / 12) * 100}%`,
                        background: color?.text || '#888'
                      }}
                    />
                  </View>
                  <Text className="pua-type-count">{count as number}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View className="home-bottom-space" />
    </ScrollView>
  );
}
