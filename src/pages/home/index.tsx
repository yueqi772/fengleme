import { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.css';

const EMOTIONS = ['愤怒', '委屈', '焦虑', '失落', '麻木'];
const EMOTION_MAP: Record<string, string> = {
  '愤怒': '😠', '委屈': '😢', '焦虑': '😰', '失落': '😔', '麻木': '😶',
};
const PUA_TYPE_COLORS: Record<string, { emoji: string }> = {
  '否定价值': { emoji: '💔' },
  '煤气灯效应': { emoji: '🕯️' },
  '情感勒索': { emoji: '⛓️' },
  '孤立排挤': { emoji: '🚫' },
  '画大饼': { emoji: '🫓' },
  '边界侵犯': { emoji: '🚧' },
};

function getRiskInfo(score: number) {
  if (score < 20) return { level: '正常', color: '#22c55e', bg: '#f0fdf4' };
  if (score < 40) return { level: '轻度', color: '#f59e0b', bg: '#fffbeb' };
  if (score < 60) return { level: '中度', color: '#f97316', bg: '#fff7ed' };
  if (score < 80) return { level: '重度', color: '#ef4444', bg: '#fef2f2' };
  return { level: '极重度', color: '#dc2626', bg: '#fef2f2' };
}

export default function HomePage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [practiceCount, setPracticeCount] = useState(0);

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    try {
      const tr = Taro.getStorageSync('test_result');
      if (tr) setTestResult(tr);
      const ds = Taro.getStorageSync('diaries') || [];
      setDiaries(Array.isArray(ds) ? ds : []);
      const pc = Taro.getStorageSync('practice_count') || 0;
      setPracticeCount(Number(pc));
    } catch (e) {}
  }, []);

  const riskInfo = testResult ? getRiskInfo(testResult.score) : null;

  // Emotion calendar
  const emotionCalendar: Record<string, string> = {};
  diaries.forEach((d: any) => {
    if (!emotionCalendar[d.date]) emotionCalendar[d.date] = d.emotion;
  });

  const emotionStats = EMOTIONS.map(e => ({
    emotion: e,
    count: diaries.filter((d: any) => d.emotion === e).length,
    pct: diaries.length
      ? Math.round((diaries.filter((d: any) => d.emotion === e).length / diaries.length) * 100)
      : 0,
  }));

  // Days in month
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  // Mon-based first-day offset (0=周一, ..., 6=周日)
  const firstDay = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() || 7) - 1;

  return (
    <View className="page">
      {/* ===== 顶部绿色横幅 ===== */}
      <View className="hero">
        <Text className="hero-mascot">🌳</Text>
        <View className="hero-text-group">
          <Text className="hero-greeting">今天，你好吗？</Text>
          <Text className="hero-sub">职场清醒笔记，陪你走过每一刻</Text>
        </View>
      </View>

      <View className="page-body">
        {/* ===== 风险评估 / 测试入口卡片 ===== */}
        {riskInfo ? (
          <View className="risk-card">
            <View className="risk-card-top">
              <Text className="risk-card-title">职场环境评估</Text>
              <View className="risk-badge" style={{ background: riskInfo.bg }}>
                <Text className="risk-badge-text" style={{ color: riskInfo.color }}>{riskInfo.level}</Text>
              </View>
            </View>
            <View className="risk-score-row">
              <Text className="risk-score-num" style={{ color: riskInfo.color }}>{testResult.score}</Text>
              <Text className="risk-score-unit">/100</Text>
              <View className="risk-progress">
                <View className="risk-progress-fill" style={{ width: `${testResult.score}%`, background: riskInfo.color }} />
              </View>
            </View>
            <Text className="risk-date">测试时间：{testResult.date}</Text>
            <Button
              className="btn-report"
              onClick={() => Taro.navigateTo({ url: '/pages/report/index' })}
            >
              查看完整报告 →
            </Button>
          </View>
        ) : (
          <View className="hero-card">
            <Text className="hero-card-label">📖 职场清醒笔记</Text>
            <Text className="hero-card-title">识别职场PUA</Text>
            <Text className="hero-card-desc">12道题，探测你在职场中的真实处境</Text>
            <Button
              className="btn-test"
              onClick={() => Taro.navigateTo({ url: '/pages/test/index' })}
            >
              立即测试
            </Button>
          </View>
        )}

        {/* ===== 四宫格功能入口 ===== */}
        <View className="quick-grid">
          <View className="quick-item quick-blue" onClick={() => Taro.navigateTo({ url: '/pages/test/index' })}>
            <Text className="quick-icon">📖</Text>
            <Text className="quick-label">识别测试</Text>
            <Text className="quick-sub">了解PUA套路</Text>
          </View>
          <View className="quick-item quick-orange" onClick={() => Taro.switchTab({ url: '/pages/tools/index' })}>
            <Text className="quick-icon">🎭</Text>
            <Text className="quick-label">情景练习室</Text>
            <Text className="quick-sub">AI模拟真实对线</Text>
          </View>
          <View className="quick-item quick-green" onClick={() => Taro.switchTab({ url: '/pages/treehole/index' })}>
            <Text className="quick-icon">📝</Text>
            <Text className="quick-label">写日记</Text>
            <Text className="quick-sub">记录职场点滴</Text>
          </View>
          <View className="quick-item quick-purple" onClick={() => Taro.switchTab({ url: '/pages/community/index' })}>
            <Text className="quick-icon">💬</Text>
            <Text className="quick-label">互动社区</Text>
            <Text className="quick-sub">找到同路人</Text>
          </View>
        </View>

        {/* ===== 情景练习室专区 ===== */}
        <View className="section-card">
          <View className="section-header">
            <Text className="section-emoji">🎭</Text>
            <Text className="section-title">情景练习室</Text>
            {practiceCount > 0 && (
              <View className="tag-green">
                <Text className="tag-green-text">已练习 {practiceCount} 次</Text>
              </View>
            )}
          </View>
          <Text className="section-sub">AI扮演施加压力的一方，练习设立边界</Text>
          <View className="practice-list">
            {[
              { emoji: '🙅', text: '拒绝不合理要求' },
              { emoji: '🛡️', text: '设立心理边界' },
              { emoji: '💬', text: '应对情感操控' },
            ].map((item, i) => (
              <View
                key={i}
                className="practice-item"
                onClick={() => Taro.switchTab({ url: '/pages/tools/index' })}
              >
                <Text className="practice-emoji">{item.emoji}</Text>
                <Text className="practice-text">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== 情绪日历 ===== */}
        <View className="section-card">
          <View className="calendar-header-row">
            <Text className="calendar-title">情绪日历</Text>
            <Text className="calendar-month">{currentMonth}</Text>
          </View>

          {/* 星期表头：固定一行 7 格 */}
          <View className="cal-week-row">
            {['一', '二', '三', '四', '五', '六', '日'].map(d => (
              <View key={d} className="cal-week-cell">
                <Text className="cal-week-text">{d}</Text>
              </View>
            ))}
          </View>

          {/* 日期网格：每行 7 格 */}
          {(() => {
            // 构建日历数据：前补空白，后凑满整行
            const cells: Array<{ day: number | null; dateStr: string | null }> = [];
            // 前补空白
            for (let i = 0; i < firstDay; i++) {
              cells.push({ day: null, dateStr: null });
            }
            // 日期
            for (let d = 1; d <= daysInMonth; d++) {
              const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              cells.push({ day: d, dateStr });
            }
            // 后面补 null 凑满整行（7的倍数）
            while (cells.length % 7 !== 0) {
              cells.push({ day: null, dateStr: null });
            }
            // 分成行
            const rows: Array<Array<{ day: number | null; dateStr: string | null }>> = [];
            for (let i = 0; i < cells.length; i += 7) {
              rows.push(cells.slice(i, i + 7));
            }
            return rows.map((row, ri) => (
              <View key={ri} className="cal-row">
                {row.map((cell, ci) => {
                  if (cell.day === null) {
                    return <View key={`empty-${ci}`} className="cal-cell" />;
                  }
                  const emotion = cell.dateStr ? emotionCalendar[cell.dateStr] : null;
                  const isToday = cell.day === today.getDate();
                  return (
                    <View
                      key={cell.day}
                      className={`cal-cell ${isToday ? 'cal-today' : ''}`}
                    >
                      <Text className="cal-day">{cell.day}</Text>
                      {emotion && <Text className="cal-emotion">{EMOTION_MAP[emotion]}</Text>}
                    </View>
                  );
                })}
              </View>
            ));
          })()}

          {/* 情绪统计 */}
          {emotionStats.some(e => e.count > 0) && (
            <View className="emotion-stats">
              {emotionStats.filter(e => e.count > 0).map(e => (
                <View key={e.emotion} className="emotion-stat-row">
                  <Text className="emotion-stat-emoji">{EMOTION_MAP[e.emotion]}</Text>
                  <View className="emotion-stat-bar">
                    <View className="emotion-stat-fill" style={{ width: `${e.pct}%` }} />
                  </View>
                  <Text className="emotion-stat-count">{e.count}天</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ===== 问题行为分布 ===== */}
        {testResult && Object.entries(testResult.counts || {}).filter(([, v]: any) => (v as number) > 0).length > 0 && (
          <View className="section-card">
            <View className="section-header" style={{ marginBottom: 16 }}>
              <Text className="section-emoji">📊</Text>
              <Text className="section-title">问题行为分布</Text>
            </View>
            <View className="pua-list">
              {Object.entries(testResult.counts)
                .filter(([, v]: [string, number]) => v > 0)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([type, count]: [string, any]) => {
                  const info = PUA_TYPE_COLORS[type] || { emoji: '•' };
                  const pct = Math.min(100, Math.round(((count as number) / 2) * 100));
                  return (
                    <View key={type} className="pua-row">
                      <Text className="pua-emoji">{info.emoji}</Text>
                      <Text className="pua-type">{type}</Text>
                      <View className="pua-bar">
                        <View className="pua-bar-fill" style={{ width: `${pct}%` }} />
                      </View>
                      <Text className="pua-count">×{count}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
