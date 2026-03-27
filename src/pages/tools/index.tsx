import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { PRACTICE_SCENARIOS, SCRIPT_LIBRARY } from '../../data';
import { storage } from '../../utils/storage';
import './index.css';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<'practice' | 'scripts'>('practice');
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => storage.get('favorite_scripts') || []);

  function toggleFavorite(scriptKey: string) {
    const next = favorites.includes(scriptKey)
      ? favorites.filter(k => k !== scriptKey)
      : [...favorites, scriptKey];
    setFavorites(next);
    storage.set('favorite_scripts', next);
  }

  function goToPractice(scenarioId: string) {
    Taro.navigateTo({ url: `/pages/practice/index?scenarioId=${scenarioId}` });
  }

  function renderStars(difficulty: number) {
    return [1, 2, 3].map(d => (
      <Text key={d} className={`star ${d <= difficulty ? 'star-filled' : 'star-empty'}`}>★</Text>
    ));
  }

  return (
    <View className="tools-page">
      {/* Header */}
      <View className="tools-header">
        <Text className="tools-title">🔧 应对工具箱</Text>
        <Text className="tools-subtitle">学会保护自己，从容应对职场</Text>
      </View>

      {/* Tab Switcher */}
      <View className="tab-bar">
        <View
          className={`tab-item ${activeTab === 'practice' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <Text className="tab-icon">🎭</Text>
          <Text className="tab-label">情景练习室</Text>
          <Text className="tab-desc">模拟对话 · AI反馈</Text>
        </View>
        <View
          className={`tab-item ${activeTab === 'scripts' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('scripts')}
        >
          <Text className="tab-icon">📚</Text>
          <Text className="tab-label">话术库</Text>
          <Text className="tab-desc">5大场景 · {SCRIPT_LIBRARY.reduce((a, s) => a + s.scripts.length, 0)}条</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView scrollY className="tools-content">
        {activeTab === 'practice' && (
          <View className="section">
            {PRACTICE_SCENARIOS.map(s => (
              <View key={s.id} className="scenario-card" onClick={() => goToPractice(s.id)}>
                <View className="scenario-left">
                  <Text className="scenario-icon">{s.icon}</Text>
                  <View className="scenario-info">
                    <Text className="scenario-title">{s.title}</Text>
                    <View className="scenario-difficulty">
                      <Text className="difficulty-label">难度</Text>
                      <View className="stars">{renderStars(s.difficulty)}</View>
                    </View>
                    <Text className="scenario-intro">{s.intro}</Text>
                  </View>
                </View>
                <Text className="arrow">›</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'scripts' && (
          <View className="section">
            {SCRIPT_LIBRARY.map(item => (
              <View key={item.id} className="script-card">
                <View
                  className="script-header"
                  onClick={() => setExpandedScript(expandedScript === item.id ? null : item.id)}
                >
                  <Text className="script-scene-icon">{item.sceneIcon}</Text>
                  <View className="script-scene-info">
                    <Text className="script-scene-name">{item.scene}</Text>
                    <Text className="script-count">{item.scripts.length} 条推荐话术</Text>
                  </View>
                  <Text className="expand-arrow">{expandedScript === item.id ? '∨' : '›'}</Text>
                </View>
                {expandedScript === item.id && (
                  <View className="script-list">
                    <Text className="script-benefit">{item.benefit}</Text>
                    {item.scripts.map((script, idx) => {
                      const key = `${item.id}-${idx}`;
                      const isFav = favorites.includes(key);
                      return (
                        <View key={idx} className="script-item">
                          <Text className="script-text">{script}</Text>
                          <View
                            className={`fav-btn ${isFav ? 'fav-btn-active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(key); }}
                          >
                            <Text>{isFav ? '⭐' : '☆'}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
