import { View, Text, Button, Input } from '@tarojs/components';
import { useState } from 'react';
import './index.css';
export default function PostDetailPage() {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([
    {id:1, author:'阿杰', content:'我之前也遇到过，后来去看了劳动法，其实公司这样已经违规了。', time:'2小时前'},
    {id:2, author:'小红', content:'抱抱你，真的很不容易。建议保存好聊天记录，以后仲裁有用。', time:'1小时前'},
  ]);
  const [input, setInput] = useState('');
  return (
    <View className="page">
      <View className="post">
        <View className="p-top"><Text className="p-auth">匿名用户</Text><Text className="p-time">3小时前</Text></View>
        <Text className="p-content">今天老板又在下班前10分钟布置新任务，说"不急但明天要"。已经连续三周这样了。我该怎么办？</Text>
        <View className="p-tags">
          {['边界侵犯','画大饼'].map(t => <Text key={t} className="htag">#{t}</Text>)}
        </View>
        <View className="p-actions">
          <Button className={"act-btn " + (liked ? 'actived' : '')} onClick={() => setLiked(!liked)}>👍 42</Button>
          <Text className="act-text">💬 {comments.length} 条回复</Text>
        </View>
      </View>
      <Text className="cm-title">全部回复</Text>
      <View className="cm-list">
        {comments.map(c => (
          <View key={c.id} className="cm-item">
            <Text className="cm-auth">{c.author}</Text>
            <Text className="cm-time">{c.time}</Text>
            <Text className="cm-content">{c.content}</Text>
          </View>
        ))}
      </View>
      <View className="cm-input"><Input className="inp" placeholder="写下你的回复..." value={input} onInput={(e:any)=>setInput(e.detail.value)} /><Button className="snd-btn">发送</Button></View>
    </View>
  );
}
