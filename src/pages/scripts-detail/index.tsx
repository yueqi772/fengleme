import { View, Text } from '@tarojs/components';
import './index.css';
export default function ScriptsDetailPage() {
  const scripts = [
    {icon:'🔇', title:'沉默应对', color:'#6b7280', bg:'#f3f4f6',
      desc:'不直接对抗，用沉默给自己缓冲时间。当你感到被突然施压时，短暂的沉默比立刻回应更有力量。',
      example:'老板： 这个方案谁做的？垃圾一样！\n你：（沉默30秒）……您说得对，我再想想。'},
    {icon:'📋', title:'留档回应', color:'#3b82f6', bg:'#eff6ff',
      desc:'重要沟通用书面记录（邮件/微信），防止被否认。记录下承诺，以后可以有据可查。',
      example:'老板： 下个月一定给你晋升。\n你： 好的王总，那我发个邮件确认一下具体的时间和评估标准，您方便的话回复一下可以吗？'},
    {icon:'🌀', title:'反问探究', color:'#8b5cf6', bg:'#f5f3ff',
      desc:"不认同也不否定，用提问探究对方真实意图。",
      example:'老板： 你怎么总是不够主动？\n你： 想请教一下，您说的"主动"具体是指哪些方面呢？我想有针对性地改进。'},
    {icon:'🚶', title:'温和退出', color:'#f59e0b', bg:'#fffbeb',
      desc:'在情绪升温前礼貌地退出对话，给自己冷静的时间。',
      example:'老板： 你现在就给我重新做！\n你： 我理解这件事很紧急，我现在先处理着，明早给您一个版本，您看可以吗？'},
    {icon:'📣', title:'非暴力沟通', color:'#10b981', bg:'#f0fdf4',
      desc:'用"事实+感受+需求"的方式表达立场，陈述而不指责。',
      example:'我理解这个项目很重要（感受）。目前同时进行的项目有3个，时间很紧张（事实）。我想和您确认一下优先级（需求）。'},
  ];
  return (
    <View className="page">
      <Text className="pt">防御话术库</Text>
      <View className="scripts">
        {scripts.map(s => (
          <View key={s.title} className="script-card" style={{borderLeftColor: s.color}}>
            <View className="sc-header">
              <Text className="sc-icon">{s.icon}</Text>
              <Text className="sc-title">{s.title}</Text>
            </View>
            <Text className="sc-desc">{s.desc}</Text>
            <View className="sc-example">
              <Text className="sc-ex-label">💬 示范对话</Text>
              <Text className="sc-ex-text">{s.example}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
