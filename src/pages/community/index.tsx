import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { MOCK_POSTS, PUA_TYPE_COLORS, INDUSTRY_MAP } from '../../data';
import { storage } from '../../utils/storage';
import './index.css';

const INDUSTRIES = ['全部', '互联网', '教育', '金融', '医疗', '其他'];
const POST_TYPES = [
  { id: '全部', label: '全部' },
  { id: '画大饼', label: '画大饼' },
  { id: '煤气灯效应', label: '煤气灯' },
  { id: '情感勒索', label: '情感勒索' },
  { id: '边界侵犯', label: '边界侵犯' },
  { id: '否定价值', label: '否定价值' },
];

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return '刚刚';
  if (h < 24) return `${h}小时前`;
  return `${Math.floor(h / 24)}天前`;
}

export default function CommunityPage() {
  const [industryFilter, setIndustryFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');
  const [posts, setPosts] = useState(() => {
    const saved = storage.get('posts');
    return saved || MOCK_POSTS;
  });

  const filtered = posts.filter((p: any) => {
    if (industryFilter !== '全部' && p.industry !== industryFilter) return false;
    if (typeFilter !== '全部' && !p.tags.includes(typeFilter)) return false;
    return true;
  });

  function toggleLike(id: string) {
    const updated = posts.map((p: any) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    );
    setPosts(updated);
    storage.set('posts', updated);
  }

  function toggleResonate(id: string) {
    const updated = posts.map((p: any) =>
      p.id === id ? { ...p, resonated: !p.resonated, resonances: p.resonated ? p.resonances - 1 : p.resonances + 1 } : p
    );
    setPosts(updated);
    storage.set('posts', updated);
  }

  function goToNewPost() {
    Taro.navigateTo({ url: '/pages/post-detail/index' });
  }

  const typeLabel: Record<string, string> = {
    '吐槽': '📢 吐槽帖',
    '经验': '💡 经验帖',
    '求助': '❓ 求助帖',
  };

  return (
    <View className="community-page">
      {/* Header */}
      <View className="community-header">
        <Text className="community-title">💬 同行社区</Text>
        <View className="new-post-btn" onClick={goToNewPost}>
          <Text className="new-post-text">+</Text>
        </View>
      </View>

      {/* Industry filter */}
      <ScrollView scrollX className="filter-scroll">
        <View className="filter-row">
          {INDUSTRIES.map(ind => (
            <View
              key={ind}
              className={`filter-chip ${industryFilter === ind ? 'filter-chip-industry-active' : 'filter-chip-default'}`}
              onClick={() => setIndustryFilter(ind)}
            >
              <Text className="filter-chip-text">
                {ind === '全部' ? '全部' : `${INDUSTRY_MAP[ind] || ''} ${ind}`}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Type filter */}
      <ScrollView scrollX className="filter-scroll">
        <View className="filter-row">
          {POST_TYPES.map(t => (
            <View
              key={t.id}
              className={`filter-chip ${typeFilter === t.id ? 'filter-chip-type-active' : 'filter-chip-default'}`}
              onClick={() => setTypeFilter(t.id)}
            >
              <Text className="filter-chip-text">
                {t.id === '全部' ? '全部' : `${PUA_TYPE_COLORS[t.id]?.emoji || ''} ${t.label}`}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Posts */}
      <ScrollView scrollY className="posts-scroll">
        <View className="posts-list">
          {filtered.length === 0 && (
            <View className="empty-state">
              <Text className="empty-icon">💬</Text>
              <Text className="empty-text">还没有相关帖子</Text>
              <View className="empty-btn" onClick={goToNewPost}>
                <Text className="empty-btn-text">发第一个帖子</Text>
              </View>
            </View>
          )}
          {filtered.map((post: any) => {
            const typeInfo = PUA_TYPE_COLORS[post.tags[0]] || PUA_TYPE_COLORS['否定价值'];
            return (
              <View key={post.id} className="post-card">
                {/* Meta row */}
                <View className="post-meta">
                  <Text className="post-meta-industry">
                    {INDUSTRY_MAP[post.industry]} {post.industry}·{post.workYears}
                  </Text>
                  <View
                    className="post-type-tag"
                    style={{ backgroundColor: typeInfo?.bg, color: typeInfo?.text }}
                  >
                    <Text className="post-type-tag-text">{typeLabel[post.type] || post.type}</Text>
                  </View>
                </View>
                {/* Title */}
                <Text className="post-title">{post.title}</Text>
                {/* Content */}
                <Text className="post-content">{post.content}</Text>
                {/* Footer */}
                <View className="post-footer">
                  <View className="post-action" onClick={() => toggleLike(post.id)}>
                    <Text className={`post-action-text ${post.liked ? 'action-liked' : ''}`}>
                      👍 {post.likes}
                    </Text>
                  </View>
                  <View className="post-action" onClick={() => toggleResonate(post.id)}>
                    <Text className={`post-action-text ${post.resonated ? 'action-resonated' : ''}`}>
                      🤝 {post.resonances}
                    </Text>
                  </View>
                  <View className="post-action">
                    <Text className="post-action-text">💬 {post.comments}</Text>
                  </View>
                  <Text className="post-time">{formatTime(post.timestamp)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
