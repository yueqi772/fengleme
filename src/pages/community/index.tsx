import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.css';

const MOCK_POSTS = [
  { id: 'p1', author: '匿名用户', industry: '互联网', content: '今天老板又在下班前10分钟布置新任务，说"不急但明天要"。已经连续三周这样了，不知道该不该说。', likes: 42, comments: 8, time: '3小时前', tags: ['边界侵犯', '画大饼'] },
  { id: 'p2', author: '小A', industry: '教育', content: '被HR约谈，说我"状态不对"，让我"主动考虑其他机会"。劳动仲裁有用吗？', likes: 128, comments: 31, time: '5小时前', tags: ['情感勒索', '孤立排挤'] },
  { id: 'p3', author: '阿杰', industry: '金融', content: '老板当着全组的面说我的方案是"垃圾"，然后让另一个人重做。但方案是他批准的。', likes: 89, comments: 22, time: '昨天', tags: ['否定价值', '煤气灯效应'] },
];

export default function CommunityPage() {
  const [posts] = useState(MOCK_POSTS);
  const [tab, setTab] = useState('全部');
  const tabs = ['全部', '互联网', '教育', '金融', '医疗'];

  return (
    <View className="page">
      <View className="tb">
        <Text className="title">💬 互助社区</Text>
        <Button className="pbtn" onClick={() => Taro.navigateTo({ url: '/pages/post-detail/index' })}>+ 发帖</Button>
      </View>
      <View className="tabs">
        {tabs.map(t => (
          <View key={t} className={'tab ' + (tab === t ? 'active' : '')} onClick={() => setTab(t)}>
            <Text>{t}</Text>
          </View>
        ))}
      </View>
      <View className="posts">
        {posts.map(post => (
          <View key={post.id} className="pc" onClick={() => Taro.navigateTo({ url: '/pages/post-detail/index' })}>
            <View className="ptop">
              <Text className="pauth">{post.author}</Text>
              <Text className="pind">{post.industry}</Text>
              <Text className="ptime">{post.time}</Text>
            </View>
            <Text className="pcontent">{post.content}</Text>
            <View className="ptags">{post.tags.map((t: string) => <Text key={t} className="ptag">#{t}</Text>)}</View>
            <View className="pstats">
              <Text className="pstat">👍 {post.likes}</Text>
              <Text className="pstat">💬 {post.comments}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
