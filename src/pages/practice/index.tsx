import { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { PRACTICE_SCENARIOS } from '../../data';
import { storage } from '../../utils/storage';
import './index.css';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const AI_FEEDBACK_POOL = [
  '很好！你的回应清晰有力，既没有情绪化，也保持了专业态度。在真实场景中，这样的回应会让对方难以抓住把柄。',
  '不错的尝试！你成功地把话题转向了具体问题，这正是应对这类情况的关键——让对方给出具体解释，而不是接受他们的框架。',
  '这个回应展示了很好的边界感。下次可以试着加上一个具体的解决方案，让对方知道你是在配合工作，而不是单纯拒绝。',
  '你的回应保护了自己的立场，同时没有直接对抗，这很聪明。继续练习，你会越来越自然。',
  '思路对了！在职场中，这种不卑不亢的表达方式会让你更有主动权。可以考虑在结尾加一个"我们可以确认一下吗？"来锁定对方。',
];

const ENCOURAGE_POOL = [
  '你已经很好了，继续加油！',
  '练习让应对更从容，你在进步！',
  '说得好！职场清醒从这里开始。',
];

export default function PracticePage() {
  const router = useRouter();
  const scenarioId = router.params?.scenarioId || '';
  const scenario = PRACTICE_SCENARIOS.find(s => s.id === scenarioId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [finished, setFinished] = useState(false);
  const [roundCount, setRoundCount] = useState(0);

  useEffect(() => {
    if (scenario && scenario.messages.length > 0) {
      setMessages([{ role: 'ai', content: scenario.messages[0].content }]);
    }
  }, [scenarioId]);

  function sendMessage() {
    if (!inputText.trim() || isTyping || finished) return;
    const userMsg = inputText.trim();
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const newRound = roundCount + 1;
      setRoundCount(newRound);

      const isLastRound = newRound >= 2;

      if (isLastRound) {
        // Final AI feedback
        const feedback = AI_FEEDBACK_POOL[Math.floor(Math.random() * AI_FEEDBACK_POOL.length)];
        const encourage = ENCOURAGE_POOL[Math.floor(Math.random() * ENCOURAGE_POOL.length)];
        const finalMsg = `${feedback}\n\n${encourage}`;
        setMessages(m => [...m, { role: 'ai', content: finalMsg }]);
        setFinished(true);

        // Increment practice count
        const count = (storage.get('practice_count') || 0) + 1;
        storage.set('practice_count', count);
      } else {
        const feedback = AI_FEEDBACK_POOL[Math.floor(Math.random() * AI_FEEDBACK_POOL.length)];
        const followUp = '你还可以继续练习，遇到更进一步的挑战，试着回应我的下一个说法：\n\n"行了行了，我不是在批评你，你能不能别那么敏感？"';
        setMessages(m => [...m, { role: 'ai', content: `${feedback}\n\n${followUp}` }]);
      }
    }, 1500);
  }

  function restartPractice() {
    if (scenario && scenario.messages.length > 0) {
      setMessages([{ role: 'ai', content: scenario.messages[0].content }]);
    }
    setInputText('');
    setIsTyping(false);
    setFinished(false);
    setRoundCount(0);
  }

  function renderStars(difficulty: number) {
    return [1, 2, 3].map(d => (
      <Text key={d} className={`star ${d <= difficulty ? 'star-filled' : 'star-empty'}`}>★</Text>
    ));
  }

  if (!scenario) {
    return (
      <View className="practice-page">
        <View className="practice-not-found">
          <Text className="not-found-icon">😕</Text>
          <Text className="not-found-text">练习场景不存在</Text>
          <View className="not-found-btn" onClick={() => Taro.navigateBack()}>
            <Text className="not-found-btn-text">返回</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="practice-page">
      {/* Header */}
      <View className="practice-header">
        <View className="practice-back" onClick={() => Taro.navigateBack()}>
          <Text className="practice-back-text">←</Text>
        </View>
        <View className="practice-header-info">
          <Text className="practice-scenario-icon">{scenario.icon}</Text>
          <View className="practice-title-area">
            <Text className="practice-title">{scenario.title}</Text>
            <View className="practice-stars">{renderStars(scenario.difficulty)}</View>
          </View>
        </View>
      </View>

      {/* Intro */}
      <View className="practice-intro">
        <Text className="practice-intro-text">{scenario.intro}</Text>
      </View>

      {/* Chat */}
      <ScrollView scrollY className="practice-chat">
        <View className="practice-chat-inner">
          {messages.map((m, i) => (
            <View key={i} className={`chat-row ${m.role === 'user' ? 'chat-row-user' : 'chat-row-ai'}`}>
              <View className={`chat-bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                <Text className={`bubble-text ${m.role === 'user' ? 'text-user' : 'text-ai'}`}>{m.content}</Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View className="chat-row chat-row-ai">
              <View className="chat-bubble bubble-ai typing-bubble">
                <Text className="typing-text">AI 正在思考</Text>
                <Text className="typing-dots">...</Text>
              </View>
            </View>
          )}

          {finished && (
            <View className="practice-done-area">
              <Text className="practice-done-emoji">🎉</Text>
              <Text className="practice-done-text">练习完成！</Text>
              <View className="practice-done-btns">
                <View className="done-btn-again" onClick={restartPractice}>
                  <Text className="done-btn-text">继续练习</Text>
                </View>
                <View className="done-btn-back" onClick={() => Taro.navigateBack()}>
                  <Text className="done-btn-text-back">返回工具箱</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input */}
      {!finished && (
        <View className="practice-input-bar">
          <View className="practice-input-wrapper">
            <input
              value={inputText}
              onChange={(e: any) => setInputText(e.target.value || e.detail?.value || '')}
              placeholder="输入你的回应..."
              className="practice-input"
              onKeyDown={(e: any) => e.key === 'Enter' && sendMessage()}
            />
          </View>
          <View
            className={`practice-send-btn ${(!inputText.trim() || isTyping) ? 'send-btn-disabled' : ''}`}
            onClick={sendMessage}
          >
            <Text className="practice-send-text">发送</Text>
          </View>
        </View>
      )}
    </View>
  );
}
