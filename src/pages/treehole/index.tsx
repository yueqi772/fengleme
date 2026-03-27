import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Textarea, ScrollView } from '@tarojs/components';
import { EMOTION_MAP } from '../../data';
import { storage, generateId } from '../../utils/storage';
import './index.css';

type Step = 'list' | 'write' | 'chat';
type AiRole = '温柔倾听者' | '理性分析师' | '行动教练';
type EmotionType = '愤怒' | '委屈' | '焦虑' | '失落' | '麻木';

const EMOTIONS: EmotionType[] = ['愤怒', '委屈', '焦虑', '失落', '麻木'];
const EVENT_TYPES = ['被否定', '被孤立', '被威胁', '画大饼', '边界侵犯'];
const AI_ROLES: { id: AiRole; icon: string; label: string }[] = [
  { id: '温柔倾听者', icon: '🤗', label: '温柔倾听者' },
  { id: '理性分析师', icon: '🧠', label: '理性分析师' },
  { id: '行动教练', icon: '💪', label: '行动教练' },
];

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface Diary {
  id: string;
  date: string;
  emotion: EmotionType;
  events: string[];
  content: string;
  privacy: 'private' | 'public';
  messages: ChatMessage[];
}

function getAIGreeting(emotion: EmotionType, role: AiRole, userContent: string): string {
  const snippet = userContent.length > 40 ? userContent.slice(0, 40) + '…' : userContent;
  const emojiMap: Record<EmotionType, string> = EMOTION_MAP as any;
  const em = emojiMap[emotion] || '';
  const greetings: Record<AiRole, string> = {
    '温柔倾听者': `${em} 我在这里，收到了你说的：「${snippet}」${emotion === '愤怒' ? '听起来你真的很受委屈。' : emotion === '焦虑' ? '我能感受到你的紧张。' : '我能理解这件事让你有多难受。'}想继续说吗？我在这里听。`,
    '理性分析师': `${em} 收到你的记录：「${snippet}」这种情况确实值得认真梳理。让我先确认几个关键细节，帮你把事情看清楚一些。`,
    '行动教练': `${em} 收到了。「${snippet}」——基于你描述的情况，我的第一个建议是：先不要急着做决定，我们可以先聊清楚你想要什么结果。`,
  };
  return greetings[role];
}

function generateAIResponse(emotion: EmotionType, role: AiRole, history: ChatMessage[]): string {
  if (role === '理性分析师') {
    if (history.filter(m => m.role === 'user').length > 2)
      return '继续说。我在听。';
    return '你描述的情况里有几个关键细节我想确认：对方是在什么场景下这样说的？除了这一次，之前有类似的情况吗？';
  }
  if (role === '行动教练') {
    if (history.length < 3) return '好的，收到了。现在，你打算怎么处理这件事？';
    return '基于你说的情况，我的建议是：今晚先给自己一个放松，不要急着做决定。明天清醒的时候，我们可以再梳理一下。';
  }
  const pools: Record<EmotionType, string[]> = {
    '愤怒': ['我听到了。这种被压制的感觉真的很让人愤怒。', '你有权感到愤怒。不要压抑它。', '那种被不公正对待的感觉，我完全能理解。'],
    '委屈': ['你明明很努力，却被这样对待，这种委屈是真实的。', '我很心疼你经历这些。你值得被尊重。', '这种不被理解的感觉，真的很让人难过。'],
    '焦虑': ['这件事的不确定性确实会让人焦虑。你已经很努力了。', '先深呼吸。我在这里陪着你。', '焦虑是因为你在乎，这也是你认真负责的证明。'],
    '失落': ['被这样对待之后感到失落，这是很自然的反应。', '我知道那种"为什么是我"的感觉。你不是一个人。', '低落的时候，允许自己休息。'],
    '麻木': ['有时候，大脑会用麻木来保护你。不要责怪自己。', '什么感觉都没有，也是一种感觉。这是你在保护自己。', '慢慢来。你不需要强迫自己有感觉。'],
  };
  const pool = pools[emotion] || pools['失落'];
  return pool[Math.floor(Math.random() * pool.length)] + ' 愿意继续说吗？我在这里。';
}

export default function TreeholePage() {
  const [step, setStep] = useState<Step>('list');
  const [aiRole, setAiRole] = useState<AiRole>('温柔倾听者');
  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'public'>('private');
  const [diaries, setDiaries] = useState<Diary[]>(() => storage.get('diaries') || []);
  const [currentDiaryId, setCurrentDiaryId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentDiary = diaries.find(d => d.id === currentDiaryId);

  function saveDiaries(list: Diary[]) {
    setDiaries(list);
    Taro.setStorageSync('diaries', JSON.stringify(list));
    // also update diary count
    storage.set('diary_count', list.length);
  }

  function toggleEvent(e: string) {
    setEvents(ev => ev.includes(e) ? ev.filter(x => x !== e) : [...ev, e]);
  }

  function submitDiary() {
    if (!emotion || !content.trim()) return;
    const id = generateId();
    const diary: Diary = {
      id,
      date: new Date().toISOString().slice(0, 10),
      emotion,
      events,
      content,
      privacy,
      messages: [],
    };
    const updated = [diary, ...diaries];
    saveDiaries(updated);
    setCurrentDiaryId(id);
    const greeting = getAIGreeting(emotion, aiRole, content);
    setChatMessages([{ role: 'ai', content: greeting }]);
    setStep('chat');
  }

  function sendChat() {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    const newMsgs: ChatMessage[] = [...chatMessages, { role: 'user', content: userMsg }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const em = currentDiary?.emotion || emotion || '愤怒';
      const resp = generateAIResponse(em, aiRole, newMsgs);
      const finalMsgs = [...newMsgs, { role: 'ai' as const, content: resp }];
      setChatMessages(finalMsgs);
      // Save messages to diary
      if (currentDiaryId) {
        const updated = diaries.map(d =>
          d.id === currentDiaryId ? { ...d, messages: finalMsgs } : d
        );
        saveDiaries(updated);
      }
    }, 1200);
  }

  function openChat(diary: Diary) {
    setCurrentDiaryId(diary.id);
    if (diary.messages && diary.messages.length > 0) {
      setChatMessages(diary.messages);
    } else {
      setChatMessages([{ role: 'ai', content: getAIGreeting(diary.emotion, aiRole, diary.content) }]);
    }
    setStep('chat');
  }

  function startWrite() {
    setEmotion(null);
    setEvents([]);
    setContent('');
    setPrivacy('private');
    setStep('write');
  }

  return (
    <View className="treehole-page">
      {/* AI Role switcher (always visible) */}
      <View className="role-bar">
        {AI_ROLES.map(r => (
          <View
            key={r.id}
            className={`role-btn ${aiRole === r.id ? 'role-btn-active' : ''}`}
            onClick={() => setAiRole(r.id)}
          >
            <Text className="role-text">{r.icon} {r.label}</Text>
          </View>
        ))}
      </View>

      {/* ── LIST ── */}
      {step === 'list' && (
        <ScrollView scrollY className="treehole-scroll">
          <View className="treehole-content">
            {/* Write button */}
            <View className="write-entry-btn" onClick={startWrite}>
              <View className="write-entry-icon">
                <Text className="write-entry-icon-text">✏️</Text>
              </View>
              <View className="write-entry-info">
                <Text className="write-entry-title">向树洞倾诉</Text>
                <Text className="write-entry-desc">写下今天发生的事，AI陪你聊聊</Text>
              </View>
              <Text className="write-entry-arrow">›</Text>
            </View>

            {diaries.length > 0 ? (
              <View>
                <Text className="section-title">历史记录</Text>
                {diaries.map(d => (
                  <View key={d.id} className="diary-card" onClick={() => openChat(d)}>
                    <View className="diary-card-top">
                      <View className="diary-card-left">
                        <Text className="diary-emotion">{(EMOTION_MAP as any)[d.emotion]}</Text>
                        <Text className="diary-date">{d.date}</Text>
                      </View>
                      <View className={`privacy-tag ${d.privacy === 'private' ? 'privacy-private' : 'privacy-public'}`}>
                        <Text className="privacy-tag-text">{d.privacy === 'private' ? '🔒 私密' : '📢 公开'}</Text>
                      </View>
                    </View>
                    <Text className="diary-content">{d.content}</Text>
                    <Text className="diary-chat-count">{d.messages.length} 条对话</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="empty-tree">
                <View className="empty-tree-card">
                  <Text className="empty-tree-icon">🌳</Text>
                  <Text className="empty-tree-title">还没有日记</Text>
                  <Text className="empty-tree-desc">把今天发生的事写下来{'\n'}AI会在这里陪你聊聊</Text>
                  <View className="empty-tree-btn" onClick={startWrite}>
                    <Text className="empty-tree-btn-text">✏️ 写第一篇日记</Text>
                  </View>
                </View>
                <View className="hint-grid">
                  {[
                    { icon: '🤗', text: '被否定时' },
                    { icon: '😰', text: '被施压时' },
                    { icon: '😢', text: '委屈时' },
                    { icon: '😔', text: '低落时' },
                  ].map(item => (
                    <View key={item.text} className="hint-card" onClick={startWrite}>
                      <Text className="hint-icon">{item.icon}</Text>
                      <Text className="hint-text">{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* ── WRITE ── */}
      {step === 'write' && (
        <ScrollView scrollY className="treehole-scroll">
          <View className="treehole-content">
            <View className="write-back-row">
              <View className="back-btn" onClick={() => setStep('list')}>
                <Text className="back-btn-text">← 返回</Text>
              </View>
            </View>

            {/* Emotion */}
            <View className="write-card">
              <Text className="write-card-title">今天感觉怎么样？</Text>
              <View className="emotion-row">
                {EMOTIONS.map(e => (
                  <View
                    key={e}
                    className={`emotion-item ${emotion === e ? 'emotion-active' : ''}`}
                    onClick={() => setEmotion(e)}
                  >
                    <Text className="emotion-emoji">{(EMOTION_MAP as any)[e]}</Text>
                    <Text className={`emotion-label ${emotion === e ? 'emotion-label-active' : ''}`}>{e}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Events */}
            <View className="write-card">
              <Text className="write-card-title">发生了什么？（可多选）</Text>
              <View className="events-row">
                {EVENT_TYPES.map(e => (
                  <View
                    key={e}
                    className={`event-tag ${events.includes(e) ? 'event-tag-active' : 'event-tag-default'}`}
                    onClick={() => toggleEvent(e)}
                  >
                    <Text className="event-tag-text">{events.includes(e) ? '✓ ' : '+ '}{e}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Content */}
            <View className="write-card">
              <Textarea
                value={content}
                onInput={e => setContent(e.detail.value)}
                placeholder="把想说的都写下来吧..."
                maxlength={500}
                className="write-textarea"
              />
              <Text className="char-count">{content.length}/500</Text>
            </View>

            {/* Privacy */}
            <View className="write-card">
              <Text className="privacy-label">发布到</Text>
              <View className="privacy-row">
                <View
                  className={`privacy-btn ${privacy === 'private' ? 'privacy-btn-active-green' : 'privacy-btn-default'}`}
                  onClick={() => setPrivacy('private')}
                >
                  <Text className="privacy-btn-text">🔒 仅自己可见</Text>
                </View>
                <View
                  className={`privacy-btn ${privacy === 'public' ? 'privacy-btn-active-blue' : 'privacy-btn-default'}`}
                  onClick={() => setPrivacy('public')}
                >
                  <Text className="privacy-btn-text">📢 投稿到社区</Text>
                </View>
              </View>
            </View>

            <View
              className={`submit-btn ${(!emotion || !content.trim()) ? 'submit-btn-disabled' : ''}`}
              onClick={submitDiary}
            >
              <Text className="submit-btn-text">向树洞倾诉</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ── CHAT ── */}
      {step === 'chat' && (
        <View className="chat-container">
          {/* Diary summary */}
          {currentDiary && (
            <View className="diary-summary">
              <Text className="diary-summary-label">你写下的日记</Text>
              <Text className="diary-summary-content">"{currentDiary.content}"</Text>
              <Text className="diary-summary-meta">{currentDiary.date} · {(EMOTION_MAP as any)[currentDiary.emotion]}</Text>
            </View>
          )}

          {/* Back button */}
          <View className="chat-back-row">
            <View className="back-btn" onClick={() => setStep('list')}>
              <Text className="back-btn-text">← 返回列表</Text>
            </View>
          </View>

          {/* Messages */}
          <ScrollView scrollY className="chat-messages">
            <View className="chat-messages-inner">
              {chatMessages.map((m, i) => (
                <View key={i} className={`chat-bubble-row ${m.role === 'user' ? 'bubble-row-user' : 'bubble-row-ai'}`}>
                  <View className={`chat-bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                    <Text className={`bubble-text ${m.role === 'user' ? 'bubble-text-user' : 'bubble-text-ai'}`}>
                      {m.content}
                    </Text>
                  </View>
                </View>
              ))}
              {isTyping && (
                <View className="bubble-row-ai chat-bubble-row">
                  <View className="chat-bubble bubble-ai typing-indicator">
                    <Text className="typing-dot">●</Text>
                    <Text className="typing-dot">●</Text>
                    <Text className="typing-dot">●</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Input */}
          <View className="chat-input-bar">
            <View className="chat-input-wrapper">
              <input
                value={chatInput}
                onChange={(e: any) => setChatInput(e.target.value || e.detail?.value || '')}
                placeholder="继续说..."
                className="chat-input"
                onKeyDown={(e: any) => e.key === 'Enter' && sendChat()}
              />
            </View>
            <View
              className={`chat-send-btn ${(!chatInput.trim() || isTyping) ? 'chat-send-btn-disabled' : ''}`}
              onClick={sendChat}
            >
              <Text className="chat-send-text">→</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
