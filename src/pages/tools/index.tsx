import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.css';

const SCENARIOS = [
  { id: 1, icon: '🌙', title: '深夜消息轰炸', difficulty: 1, intro: '老板在深夜/周末突然@你，要求立刻完成紧急任务。' },
  { id: 2, icon: '🎯', title: '公开场合否定', difficulty: 2, intro: '老板在会议上当众批评你，让所有人见证你的"失误"。' },
  { id: 3, icon: '📋', title: '画大饼承诺', difficulty: 2, intro: '老板反复承诺晋升/加薪，但永远停留在"下次再说"。' },
  { id: 4, icon: '🧊', title: '冷暴力孤立', difficulty: 3, intro: '同事突然疏远你，开会不被叫，信息被已读不回。' },
  { id: 5, icon: '⚡', title: '边界侵犯', difficulty: 2, intro: '老板越过层级直接干涉你的工作方式，或要求你做份外的事。' },
  { id: 6, icon: '💔', title: '煤气灯效应', difficulty: 3, intro: '你明确感受到不适，但老板坚称"是我想太多"，否定你的感受。' },
];

export default function ToolsPage() {
  const [selectedScenario, setSelectedScenario] = useState<any>(null);

  return (
    <View className="page">
      <Text className="page-title">工具箱</Text>
      <Text className="page-desc">在AI模拟的职场场景中练习应对策略</Text>

      <View className="scenario-list">
        {SCENARIOS.map(s => (
          <View key={s.id} className="scenario-item" onClick={() => {
            Taro.navigateTo({url: `/pages/practice/index?scenarioId=${s.id}`});
          }}>
            <View className="scenario-left">
              <Text className="scenario-icon">{s.icon}</Text>
              <View className="scenario-info">
                <Text className="scenario-title">{s.title}</Text>
                <Text className="scenario-intro">{s.intro}</Text>
                <View className="scenario-diff">
                  {[1,2,3].map(d => (
                    <Text key={d} className={"star " + (d <= s.difficulty ? 'active' : '')}>★</Text>
                  ))}
                </View>
              </View>
            </View>
            <Text className="arrow">›</Text>
          </View>
        ))}
      </View>

      <Text className="page-title" style={{marginTop:24}}>防御话术</Text>
      <View className="script-list">
        {[
          { icon: '🔇', title: '沉默应对', desc: '不直接对抗，用沉默给自己缓冲时间', tag: '边界类' },
          { icon: '📋', title: '留档回应', desc: '重要沟通留下书面记录，防止被否认', tag: '留证类' },
          { icon: '🌀', title: '反问探究', desc: '不认同也不否定，用提问探究对方真实意图', tag: '沟通类' },
          { icon: '🚶', title: '温和退出', desc: '在情绪升温前礼貌地终止对话', tag: '撤退类' },
          { icon: '📣', title: '非暴力沟通', desc: '用"事实+感受+需求"的方式表达立场', tag: '建设类' },
        ].map((s: any, i: number) => (
          <View key={i} className="script-item" onClick={() => Taro.navigateTo({url: '/pages/scripts-detail/index'})}>
            <Text className="script-icon">{s.icon}</Text>
            <View className="script-info">
              <Text className="script-title">{s.title}</Text>
              <Text className="script-desc">{s.desc}</Text>
            </View>
            <View className="script-tag"><Text className="tag-text">{s.tag}</Text></View>
          </View>
        ))}
      </View>
    </View>
  );
}
