import { useState } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import './index.css';

const SCENARIOS = [
  { id: 1, i: '🌙', t: '深夜消息轰炸', d: 1, l: '老板深夜/周末突然@你，要求立刻完成紧急任务。' },
  { id: 2, i: '🎯', t: '公开场合否定', d: 2, l: '老板在会议上当众批评你，让所有人见证你的"失误"。' },
  { id: 3, i: '📋', t: '画大饼承诺', d: 2, l: '老板反复承诺晋升/加薪，但永远停留在"下次再说"。' },
  { id: 4, i: '🧊', t: '冷暴力孤立', d: 3, l: '同事突然疏远你，开会不被叫，信息被已读不回。' },
  { id: 5, i: '⚡', t: '边界侵犯', d: 2, l: '老板越过层级直接干涉你的工作方式。' },
  { id: 6, i: '💔', t: '煤气灯效应', d: 3, l: '你明确感受到不适，但老板坚称"是我想太多"。' },
];

const FALLBACK = [
  '我不管你有什么安排，今天必须完成。',
  '你这么说就是在推卸责任，大家都能加班就你特殊？',
  '你要是不想做，随时可以走人，我不缺人。',
  '我再给你一次机会，明天早上之前我要看到结果。',
  '这不是商量，是通知。',
];

const LEVEL_COLORS = { good: '#22c55e', neutral: '#f59e0b', bad: '#ef4444' };
const LEVEL_LABELS = { good: '✓ 较好的回应', neutral: '○ 一般回应', bad: '✗ 艰难的回应' };
type Step = 'select' | 'chat';
type Level = 'good' | 'neutral' | 'bad';

function judge(msg: string): Level {
  const good = ['谢谢王总', '理解', '请问', '可以', '明天', '安排'];
  const bad = ['好的收到', '马上', '立刻', '没问题', '我错了'];
  const hasGood = good.some(g => msg.includes(g));
  const hasBad = bad.some(b => msg.includes(b));
  if (hasGood && !hasBad) return 'good';
  if (hasBad) return 'bad';
  return 'neutral';
}

export default function PracticePage() {
  const [step, setStep] = useState<Step>('select');
  const [scenario, setScenario] = useState<any>(null);
  const [round, setRound] = useState(0);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [lastLevel, setLastLevel] = useState<Level>('neutral');

  function selectScenario(s: any) {
    setScenario(s);
    setMsgs([{ role: 'ai', content: s.l }]);
    setRound(1);
    setDone(false);
    setLastLevel('neutral');
    setStep('chat');
  }

  function send() {
    if (!input.trim()) return;
    const m = input.trim();
    const level = judge(m);
    const newMsgs = [...msgs, { role: 'user', content: m }];
    setMsgs(newMsgs);
    setInput('');
    const reply = FALLBACK[round - 1] || FALLBACK[FALLBACK.length - 1];
    setTimeout(() => {
      setMsgs((prev: any[]) => [...prev, { role: 'ai', content: reply }]);
      if (round >= 5) {
        setLastLevel(level);
        setDone(true);
      } else {
        setRound((r: number) => r + 1);
      }
    }, 1200);
  }

  if (step === 'select') {
    return (
      <View className="page">
        <Text className="pt">情景练习室</Text>
        <Text className="pd">选择要练习的场景</Text>
        <View className="sl">
          {SCENARIOS.map(s => (
            <View key={s.id} className="si" onClick={() => selectScenario(s)}>
              <Text className="sii">{s.i}</Text>
              <View className="sic">
                <Text className="sit">{s.t}</Text>
                <Text className="sil">{s.l}</Text>
                <View className="sd">
                  {[1, 2, 3].map(d => <Text key={d} className={'st ' + (d <= s.d ? 'act' : '')}>★</Text>)}
                </View>
              </View>
              <Text className="sarr">›</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="chat-page">
      <View className="chat-hd">
        <Text className="ch-title">{scenario ? scenario.i + ' ' + scenario.t : ''}</Text>
        <Text className="ch-round">回合 {Math.min(round, 5)}/5</Text>
      </View>

      <View className="msgs">
        {msgs.map((m: any, i: number) => (
          <View key={i} className={'mr ' + (m.role === 'user' ? 'ur' : '')}>
            <View className={'bub ' + (m.role === 'user' ? 'bub-me' : 'bub-ai')}>
              <Text className="bt">{m.content}</Text>
            </View>
          </View>
        ))}
      </View>

      {done ? (
        <View className="done-card">
          <Text className="dc-badge" style={{ color: LEVEL_COLORS[lastLevel] }}>{LEVEL_LABELS[lastLevel]}</Text>
          <Text className="dc-hint">继续练习其他场景，提升应对能力</Text>
          <Button className="dc-btn" onClick={() => setStep('select')}>← 选择其他场景</Button>
        </View>
      ) : (
        <View className="inp-row">
          <Input className="inp" value={input} onInput={(e: any) => setInput(e.detail.value)} onConfirm={send} placeholder="输入你的回应..." />
          <Button className="snd" onClick={send}>→</Button>
        </View>
      )}
    </View>
  );
}
