import { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storage, generateId, getRiskInfo } from '../../utils/storage';
import './index.css';

const QUESTIONS = [
  {id:1, context:'入职第3个月，第一次得到老板表扬', shortTitle:'入职转正', tags:['画大饼','否定价值'],
    chat:[{role:'boss',name:'王总',content:'小李，这段时间干得不错，继续保持啊。'},{role:'you',name:'',content:'谢谢王总！我会继续努力的！'},{role:'boss',name:'王总',content:'不过要转正的话，还得再加把劲。',highlight:true}],
    monologue:'我张了张嘴，什么声音也没发出来。\n我已经不记得，上一次感到轻松是什么时候了。',
    quote:'不过要转正的话，还得再加把劲。',
  },
  {id:2, context:'老板在公开会议上当众批评你的方案', shortTitle:'会议否定', tags:['否定价值','煤气灯效应'],
    chat:[{role:'boss',name:'王总',content:'@小李 上来，讲讲你这个方案。'},{role:'boss',name:'王总',content:'这方案谁做的？拿出来丢人？'},{role:'boss',name:'王总',content:'大家引以为戒，不要像这样浪费时间。',highlight:true}],
    monologue:'全组的人都在看我。\n我的脸烫得厉害，手心全是汗。',
    quote:'这方案谁做的？拿出来丢人？',
  },
  {id:3, context:'深夜11点，老板突然在工作群@你', shortTitle:'深夜消息', tags:['边界侵犯'],
    chat:[{role:'boss',name:'王总',content:'@小李 这个需求改了，12点前给我。'},{role:'you',name:'',content:'好的王总。'},{role:'boss',name:'王总',content:'大家都能加班，就你特殊吗？',highlight:true}],
    monologue:'我看了看时间，23:11。\n明天还要早起，我已经不记得上一次睡够是什么时候了。',
    quote:'大家都能加班，就你特殊吗？',
  },
];

const REPLIES: Record<number, {id:string;text:string;hint:string;level:'good'|'neutral'|'bad'}[]> = {
  1: [
    {id:'a',text:'谢谢王总！我会继续努力，也期待有具体的发展方向。',hint:'得体回应，既感激又不失边界',level:'good'},
    {id:'b',text:'谢谢王总！我一定不辜负您的期望！',hint:'全力顺从，给自己加压',level:'neutral'},
    {id:'c',text:'王总，请问转正的具体评估标准是什么？',hint:'直接追问，显得急功近利',level:'bad'},
  ],
  2: [
    {id:'a',text:'王总，我想了解下具体是哪个指标有问题，方便改进。',hint:'聚焦具体问题，不陷入自我否定',level:'good'},
    {id:'b',text:'...好的王总，我回去重新做。',hint:'沉默接受，可能陷入自我怀疑',level:'neutral'},
    {id:'c',text:'王总，这个方案您之前审批过的。',hint:'直接反驳，可能当场被压制',level:'bad'},
  ],
  3: [
    {id:'a',text:'收到王总，我现在外面，信号不稳定。明早7点前发您可以吗？',hint:'设立边界，给出替代方案',level:'good'},
    {id:'b',text:'好的收到，我马上处理。',hint:'牺牲个人时间',level:'neutral'},
    {id:'c',text:'王总，这个需求没提前通知，能明早处理吗？',hint:'指出问题但可能激化',level:'bad'},
  ],
};

export default function TestPage() {
  const [step, setStep] = useState<'intro'|'story'|'feedback'>('intro');
  const [q, setQ] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);

  function start() {
    setStep('story'); setQ(0); setAnswers([]); setSelected(null); setHistory([]); setShowResult(false);
  }

  function select(reply: any) {
    setSelected(reply);
    const newHistory = [...history, reply];
    setHistory(newHistory);
    const newAnswers = [...answers, reply];
    setAnswers(newAnswers);
    if (q < QUESTIONS.length - 1) {
      setTimeout(() => { setSelected(null); setQ(q + 1); }, 2500);
    } else {
      setTimeout(() => {
        const counts: Record<number, boolean> = {};
        newAnswers.forEach((a: any, i: number) => { counts[i+1] = a.level !== 'good'; });
        const score = Math.round(Object.values(counts).filter(Boolean).length / Object.keys(counts).length * 100);
        const result = { id: generateId(), date: new Date().toISOString(), score, counts, totalAnswered: QUESTIONS.length };
        storage.set('test_result', result);
        setShowResult(true);
        setStep('feedback');
      }, 2500);
    }
  }

  const question = QUESTIONS[q];
  const replies = REPLIES[question?.id] || REPLIES[1];
  const isLast = q === QUESTIONS.length - 1;
  const LEVEL_COLORS = { good: '#22c55e', neutral: '#f59e0b', bad: '#ef4444' };
  const LEVEL_LABELS = { good: '✓ 较好的回应', neutral: '○ 一般的回应', bad: '✗ 艰难的回应' };
  const LEVEL_BG = { good: '#f0fdf4', neutral: '#fffbeb', bad: '#fff1f2' };

  if (step === 'intro') {
    return (
      <View className="page-intro">
        <View className="intro-hero">
          <Text className="intro-mascot">🌳</Text>
          <Text className="intro-title">小林的职场故事</Text>
          <Text className="intro-sub">微信聊天记录沉浸式体验</Text>
          <Text className="intro-desc">在{QUESTIONS.length}个真实场景中做出选择\n你的每个决定都会影响小林的心理状态</Text>
          <Button className="start-btn" onClick={start}>开始故事之旅 →</Button>
        </View>
      </View>
    );
  }

  if (step === 'feedback') {
    const result = storage.get('test_result') || { score: 50, counts: {} };
    const info = getRiskInfo(result.score);
    return (
      <View className="page-result">
        <View className="res-header">
          <Text className="res-title">📊 测试报告</Text>
          <View className="res-score-card">
            <View className="res-score-row">
              <Text className="res-emoji">{info.emoji}</Text>
              <Text className="res-score" style={{color: info.color}}>{result.score}</Text>
              <Text className="res-unit">分</Text>
            </View>
            <Text className="res-desc" style={{color: info.color}}>{info.desc}</Text>
          </View>
        </View>
        <View className="res-actions">
          <Button className="res-btn" onClick={() => Taro.navigateTo({url: '/pages/report/index'})}>查看详细报告</Button>
          <Button className="res-back" onClick={() => Taro.switchTab({url: '/pages/home/index'})}>返回首页</Button>
        </View>
      </View>
    );
  }

  // Story
  return (
    <View className="page-chat">
      <View className="chat-header">
        <Text className="ch-title">工作群聊</Text>
        <Text className="ch-sub">{q+1}/{QUESTIONS.length} · {question.shortTitle}</Text>
      </View>
      <View className="progress-bar">
        {QUESTIONS.map((_, i) => (
          <View key={i} className={"prog " + (i < q ? 'done' : i === q ? 'active' : '')} />
        ))}
      </View>

      <View className="messages">
        <View className="context-tag"><Text className="ct">{question.context}</Text></View>

        {question.chat.map((msg: any, i: number) => (
          <View key={i} className={"msg-row " + (msg.role === 'you' ? 'user' : '')}>
            {msg.role !== 'you' && (
              <View className="avatar" style={{background: msg.role === 'boss' ? '#e54d4d' : '#4a90d9'}}>
                <Text className="av-txt">{msg.name ? msg.name.slice(0,1) : '王'}</Text>
              </View>
            )}
            <View className={"bubble " + (msg.role === 'you' ? 'bubble-me' : msg.highlight ? 'bubble-highlight' : 'bubble-other')}>
              <Text className="btext">{msg.content}</Text>
            </View>
            {msg.role === 'you' && (
              <View className="avatar av-me"><Text className="av-txt">我</Text></View>
            )}
          </View>
        ))}

        <View className="monologue-row">
          <View className="av-mono">林</View>
          <View className="bubble bubble-mono">
            <Text className="mono-label">💭 小林的内心</Text>
            <Text className="mono-text">{question.monologue.split('\n').map((l, i, arr) => <Text key={i}>{l}{i < arr.length-1 ? '\n' : ''}</Text>)}</Text>
          </View>
        </View>

        <View className="quote-block">
          <Text className="qb-label">🎯 关键一幕</Text>
          <Text className="qb-text">"{question.quote}"</Text>
        </View>

        <View className="tags-row">
          {question.tags.map((t: string) => <Text key={t} className="htag">#{t}</Text>)}
        </View>

        {selected && (
          <View className="selected-reply">
            <View className="bubble bubble-me"><Text className="btext">{selected.text}</Text></View>
          </View>
        )}
      </View>

      {!selected ? (
        <View className="reply-bar">
          <Text className="rb-label">你会怎么回复：</Text>
          {replies.map(r => (
            <View key={r.id} className="reply-btn" onClick={() => select(r)}>
              <Text className="rbt">{r.text}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View className="feedback-card" style={{background: LEVEL_BG[selected.level]}}>
          <View className="fc-header">
            <Text className="fc-badge" style={{color: LEVEL_COLORS[selected.level]}}>{LEVEL_LABELS[selected.level]}</Text>
            <Text className="fc-hint">{selected.hint}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
