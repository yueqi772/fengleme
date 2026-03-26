import { useState, useEffect } from 'react';
import { View, Text, Button, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storage, generateId } from '../../utils/storage';
import './index.css';

const EMOJI: Record<string, string> = { '愤怒': '😠', '委屈': '😢', '焦虑': '😰', '失落': '😔', '麻木': '😐' };
const EMOTIONS = ['愤怒', '委屈', '焦虑', '失落', '麻木'];
const EVENTS = ['被否定', '被孤立', '被威胁', '画大饼', '边界侵犯'];
const SCRIPT: Record<string, string[]> = {
  '愤怒': ['我听到了。这种被压制的感觉真的很让人愤怒。', '你有权感到愤怒。不要压抑它。', '那种被不公正对待的感觉，我完全能理解。'],
  '委屈': ['你明明很努力，却被这样对待，这种委屈是真实的。', '我很心疼你经历这些。你值得被尊重。'],
  '焦虑': ['这件事的不确定性确实会让人焦虑。你已经很努力了。', '先深呼吸。我在这里陪着你。'],
  '失落': ['被这样对待之后感到失落，这是很自然的反应。', "我知道那种'为什么是我'的感觉。你不是一个人。"],
  '麻木': ['有时候，大脑会用麻木来保护你。不要责怪自己。', '什么感觉都没有，也是一种感觉。这是你在保护自己。'],
};

function greet(em: string): string {
  const pool = SCRIPT[em] || SCRIPT['失落'] || [''];
  return pool[Math.floor(Math.random() * pool.length)] + ' 愿意继续说吗？我在这里。';
}

export default function TreeHolePage() {
  const [step, setStep] = useState<'list' | 'write' | 'chat'>('list');
  const [em, setEm] = useState('');
  const [evs, setEvs] = useState<string[]>([]);
  const [txt, setTxt] = useState('');
  const [priv, setPriv] = useState<'private' | 'public'>('private');
  const [diaries, setDiaries] = useState<any[]>([]);
  const [curId, setCurId] = useState('');
  const [msgs, setMsgs] = useState<any[]>([]);
  const [inp, setInp] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => { setDiaries(storage.get('diaries') || []); }, [step]);

  function submit() {
    if (!em || !txt.trim()) return;
    const id = generateId();
    const d: any = { id, date: new Date().toISOString().slice(0, 10), emotion: em, events: evs, content: txt, privacy: priv, messages: [] };
    const ds = [d, ...diaries];
    storage.set('diaries', ds);
    setDiaries(ds);
    setCurId(id);
    setMsgs([{ role: 'ai', content: greet(em) }]);
    setStep('chat');
  }

  function send() {
    if (!inp.trim() || typing) return;
    const m = inp.trim();
    setMsgs((prev: any[]) => [...prev, { role: 'user', content: m }]);
    setInp('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const pool = SCRIPT[em] || SCRIPT['失落'] || [''];
      setMsgs((prev: any[]) => [...prev, { role: 'ai', content: pool[Math.floor(Math.random() * pool.length)] + ' 愿意继续说吗？我在这里。' }]);
    }, 1500);
  }

  const cur = diaries.find((d: any) => d.id === curId);

  if (step === 'list') {
    return (
      <View className="page">
        <Button className="main-btn" onClick={() => setStep('write')}>✏️ 向树洞倾诉</Button>
        {diaries.length === 0 ? (
          <View className="empty">
            <Text className="ee">🌳</Text>
            <Text className="et">还没有日记</Text>
            <Text className="ed">把今天发生的事写下来，AI会在这里陪你聊聊</Text>
          </View>
        ) : (
          <View className="list">
            <Text className="st">历史记录</Text>
            {diaries.map((d: any) => (
              <View key={d.id} className="dc" onClick={() => { setCurId(d.id); setEm(d.emotion); setMsgs(d.messages.length > 0 ? d.messages : [{ role: 'ai', content: greet(d.emotion) }]); setStep('chat'); }}>
                <View className="dct"><Text className="dce">{EMOJI[d.emotion]}{d.emotion}</Text><Text className="dcd">{d.date}</Text></View>
                <Text className="dcc">{d.content}</Text>
                <Text className="dcm">{d.messages.length} 条对话</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  if (step === 'write') {
    return (
      <View className="page">
        <Text className="st">今天感觉怎么样？</Text>
        <View className="er">{EMOTIONS.map(e => (
          <View key={e} className={"eb " + (em === e ? 'sel' : '')} onClick={() => setEm(e)}>
            <Text className="ei">{EMOJI[e]}</Text><Text className="et2">{e}</Text>
          </View>
        ))}</View>
        <Text className="st">发生了什么？（可多选）</Text>
        <View className="evr">{EVENTS.map(e => (
          <View key={e} className={"evb " + (evs.includes(e) ? 'sel' : '')} onClick={() => setEvs(evs.includes(e) ? evs.filter(x => x !== e) : [...evs, e])}><Text>{evs.includes(e) ? '✓ ' : '+ '}{e}</Text></View>
        ))}</View>
        <Text className="st">把想说的都写下来</Text>
        <Textarea className="ta" value={txt} onInput={(e: any) => setTxt(e.detail.value)} placeholder="把想说的都写下来吧..." maxlength={500} />
        <Text className="tc">{txt.length}/500</Text>
        <View className="priv">
          <View className={"pb " + (priv === 'private' ? 'sel' : '')} onClick={() => setPriv('private')}><Text>🔒 仅自己可见</Text></View>
          <View className={"pb " + (priv === 'public' ? 'sel' : '')} onClick={() => setPriv('public')}><Text>📢 投稿社区</Text></View>
        </View>
        <Button className="btn" onClick={submit} disabled={!em || !txt.trim()}>向树洞倾诉</Button>
        <Button className="btn-back" onClick={() => setStep('list')}>← 返回</Button>
      </View>
    );
  }

  return (
    <View className="chat-page">
      {cur && <View className="ctx"><Text className="ctxl">你写下的日记</Text><Text className="ctxt">"{cur.content}"</Text><Text className="ctxd">{cur.date} · {EMOJI[cur.emotion]}</Text></View>}
      <View className="msgs">
        {msgs.map((m: any, i: number) => (
          <View key={i} className={"mr " + (m.role === 'user' ? 'ur' : '')}>
            <View className={"bub " + (m.role === 'user' ? 'bub-me' : 'bub-ai')}><Text className="btext">{m.content}</Text></View>
          </View>
        ))}
        {typing && <View className="mr"><View className="bub bub-ai"><Text className="btext">...</Text></View></View>}
      </View>
      <View className="inp-row">
        <Input className="inp" value={inp} onInput={(e: any) => setInp(e.detail.value)} onConfirm={send} placeholder="继续说..." />
        <Button className="snd" onClick={send} disabled={!inp.trim() || typing}>→</Button>
      </View>
    </View>
  );
}
