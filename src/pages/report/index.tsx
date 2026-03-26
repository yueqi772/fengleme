import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storage, getRiskInfo } from '../../utils/storage';
import './index.css';

export default function ReportPage() {
  const result = storage.get('test_result');
  if (!result) {
    return (
      <View className="page">
        <View className="empty"><Text className="et">暂无报告</Text><Text className="ed">请先完成测试</Text></View>
      </View>
    );
  }
  const info = getRiskInfo(result.score);
  const puaTypes = Object.entries(result.counts || {}).filter(([, v]: any) => (v as number) > 0);

  return (
    <View className="page">
      <View className="report-hero" style={{ background: info.bg }}>
        <Text className="re-emoji">{info.emoji}</Text>
        <Text className="re-score" style={{ color: info.color }}>{result.score}</Text>
        <Text className="re-unit">分</Text>
        <Text className="re-desc" style={{ color: info.color }}>{info.desc}</Text>
      </View>

      <View className="card">
        <Text className="card-title">检测到的PUA类型</Text>
        {puaTypes.length === 0 ? (
          <Text className="none-tip">未检测到明显PUA行为，继续保持</Text>
        ) : (
          puaTypes.map(([type]: any) => (
            <View key={type} className="pua-item">
              <Text className="pua-dot">●</Text>
              <Text className="pua-type">{type}</Text>
            </View>
          ))
        )}
      </View>

      <View className="card">
        <Text className="card-title">给你的话</Text>
        <Text className="card-quote">"你的感受是真实的，不需要被任何人验证。"</Text>
        <Text className="card-body">职场PUA常常以"为你好"的面貌出现，但它本质上是一种控制和操纵。识别它，是走出它的第一步。</Text>
      </View>

      <View className="card">
        <Text className="card-title">下一步建议</Text>
        {[
          { icon: '📝', t: '写日记', d: '把今天的经历写下来，AI陪你梳理' },
          { icon: '🎭', t: '情景练习', d: '在安全环境里练习应对方式' },
          { icon: '💬', t: '来社区', d: '你不是一个人，很多人和你的经历相似' },
        ].map((item: any) => (
          <View key={item.t} className="next-item">
            <Text className="next-icon">{item.icon}</Text>
            <View className="next-info">
              <Text className="next-t">{item.t}</Text>
              <Text className="next-d">{item.d}</Text>
            </View>
          </View>
        ))}
      </View>

      <Button className="home-btn" onClick={() => Taro.switchTab({ url: '/pages/home/index' })}>返回首页</Button>
    </View>
  );
}
