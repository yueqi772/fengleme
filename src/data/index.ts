// ─── Types ────────────────────────────────────────────
export interface ScriptItem {
  id: string;
  scene: string;
  sceneIcon: string;
  scripts: string[];
  benefit: string;
}

export interface PracticeScenario {
  id: string;
  title: string;
  icon: string;
  difficulty: number;
  intro: string;
  messages: Array<{ role: 'ai' | 'user'; content: string }>;
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  condition: string;
}

export interface Post {
  id: string;
  type: string;
  industry: string;
  workYears: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  resonances: number;
  comments: number;
  timestamp: number;
}

// ─── Script Library ────────────────────────────────────
export const SCRIPT_LIBRARY: ScriptItem[] = [
  {
    id: 's1',
    scene: '被当众批评',
    sceneIcon: '🛡️',
    scripts: [
      '谢谢您的反馈。关于方案的具体问题，我梳理了一下，有几个地方想当面向您请教，可以吗？',
      '我理解您对结果不满意，我确实有需要提升的地方。但我想具体了解一下，是哪个环节出了问题，方便后续改进。',
      '这个方案我花了XX时间准备，有几个关键数据想跟您核实一下，要不我们找个时间详细聊聊？',
      '感谢指出问题。对于这次的问题，我做了复盘，以下是我总结的改进计划...',
    ],
    benefit: '用专业态度回应，既不直接对抗，也不陷入自我否定，把焦点转向具体问题。',
  },
  {
    id: 's2',
    scene: '被要求无偿加班',
    sceneIcon: '⏰',
    scripts: [
      '我今天有XX安排，最晚可以到X点。如果工作量确实很大，我明天一早优先处理这部分可以吗？',
      '这个截止时间确实很紧。我想确认一下，哪些是必须今晚完成的，哪些可以放到明天？',
      '我理解项目紧急，但我目前手上的XX任务也在deadline上。您看能不能协调一下优先级，或者增加人手？',
      '可以。但我需要先跟您对齐一下加班范围和补偿机制，这样我也能更安心投入。',
    ],
    benefit: '设定边界的同时展现合作态度，避免被贴上"不配合"的标签。',
  },
  {
    id: 's3',
    scene: '设置个人边界',
    sceneIcon: '🚪',
    scripts: [
      '下班后如果有紧急情况，可以打电话给我。但一般消息我会在第二天工作时间内回复，这样可以吗？',
      '我目前手上的项目是XX和XX，交付时间分别是...如果再增加任务，可能会影响质量，您看怎么安排？',
      '周末我的私人手机一般不怎么看工作消息，有急事可以打电话。如果是普通工作，建议周中处理，响应会更快。',
      '我愿意配合团队需要，但长期超负荷工作会让我效率下降。我想和您讨论一下工作量的问题。',
      '感谢理解。关于边界这件事，我认为清晰的分工对双方都好，这是我在职场学到的宝贵经验。',
    ],
    benefit: '温和但坚定地表达边界，让对方知道你的底线，同时不失合作精神。',
  },
  {
    id: 's4',
    scene: '被否定自我价值',
    sceneIcon: '💔',
    scripts: [
      '您提到我"不行"，我想具体了解一下，是指某个具体能力不足，还是整体评价？能举个例子吗？',
      '我不太认同这个评价。我在XX项目中的XX成果是有据可查的，数据说话，我可以详细汇报。',
      '我理解您对结果不满意，但"不行"这个评价让我感到被否定了。如果我有做得不好的地方，希望您能具体指出。',
      '我想确认一下，这次的评价是针对这件事，还是对我这个人的整体判断？我希望分开来看。',
    ],
    benefit: '把"对人的否定"转化为"对事的讨论"，保护自尊的同时保持专业。',
  },
  {
    id: 's5',
    scene: '离职/维权谈判',
    sceneIcon: '⚖️',
    scripts: [
      '根据劳动合同，公司提出解除需要提前X天通知（或支付代通知金）。我的last day定在...，工作会交接完毕。',
      '关于经济补偿金，根据我在公司的工作年限X年，应得X个月工资作为补偿。这个数字我们可以确认一下。',
      '我的工资明细显示每月基本工资XX元，绩效XX元。请确认未支付的工资、报销款和应休未休年假折算。',
      '我同意这个方案。请在今天下班前把离职协议发给我，我确认后签字。所有款项请在离职当日结清。',
    ],
    benefit: '用法律知识武装自己，冷静理性地争取应得权益，不情绪化，不被激怒。',
  },
];

// ─── Practice Scenarios ────────────────────────────────
export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'p1',
    title: '深夜消息轰炸',
    icon: '😤',
    difficulty: 2,
    intro: '晚上11点，你刚准备睡觉，老板连发5条消息，要求你立刻处理一件本可以明天做的工作...',
    messages: [
      { role: 'ai', content: '睡了吗？有个急事。现在，立刻，打开电脑处理一下，明天早上8点给我。不回我就当你同意了。' },
    ],
  },
  {
    id: 'p2',
    title: '被要求背黑锅',
    icon: '😰',
    difficulty: 3,
    intro: '季度业绩下滑，老板私下暗示你写一份"个人反思"承担责任，功劳归团队，过失归你...',
    messages: [
      { role: 'ai', content: '这次业绩没达标，总得有人负责。我想让你写一份个人反思，重点说说你在项目里犯了什么错。当然，我会在会上力保你不被裁，但你要配合我。' },
    ],
  },
  {
    id: 'p3',
    title: '薪资被压低',
    icon: '💰',
    difficulty: 3,
    intro: '年终奖发放日，你发现实际到账金额比当初HR承诺的少了将近40%，找老板理论...',
    messages: [
      { role: 'ai', content: '哦，这个啊，公司今年整体业绩不好，年终奖按照新的绩效考核方案重新核算了。你那个级别的人，大多是这个数。我已经尽力帮你争取了，你啊，还是太嫩。' },
    ],
  },
  {
    id: 'p4',
    title: '当众被批评',
    icon: '🛡️',
    difficulty: 2,
    intro: '部门周会开到一半，老板突然翻出你上周的报告，当着20多人的面说这是"垃圾"...',
    messages: [
      { role: 'ai', content: '你们看看这份报告，这就是典型的垃圾！我在底下给你们撑着，你们就用这种东西回报我？小王，你来给大家讲讲，你是怎么写出来这种东西的？' },
    ],
  },
  {
    id: 'p5',
    title: '被否定能力',
    icon: '💔',
    difficulty: 3,
    intro: '你刚完成一个大项目，获得了客户的高度认可。但老板却在周报上批注："小王能力不行，这个项目纯属侥幸"...',
    messages: [
      { role: 'ai', content: '小王啊，你最近膨胀了啊。那个项目，客户认可那是客户不懂行，别往自己脸上贴金。你要认清自己的能力边界，明白吗？' },
    ],
  },
  {
    id: 'p6',
    title: '设置下班边界',
    icon: '🚪',
    difficulty: 2,
    intro: '你已经连续一个月加班到晚上10点。今天下班时间到了，老板却叫住你："今晚把这个做完再走"...',
    messages: [
      { role: 'ai', content: '小王，今晚把这个做完再走。对，我知道你今天已经加了8小时班，但这个报表明天早上就要。什么？没空吃饭？年轻人不要老想着享福，吃苦是福。' },
    ],
  },
];

// ─── Achievements ──────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: '边界卫士', desc: '完成5个情景练习', icon: '🏅', unlocked: false, condition: '完成5个练习' },
  { id: 'a2', name: '清醒侦探', desc: '完成PUA识别测试', icon: '🔍', unlocked: false, condition: '完成识别测试' },
  { id: 'a3', name: '倾诉者', desc: '写下第一篇日记', icon: '🌱', unlocked: false, condition: '写第一篇日记' },
  { id: 'a4', name: '社区成员', desc: '发布第一篇帖子', icon: '💬', unlocked: false, condition: '发第一篇帖子' },
  { id: 'a5', name: '话术达人', desc: '收藏10条话术', icon: '🎯', unlocked: false, condition: '收藏10条话术' },
  { id: 'a6', name: '练习狂人', desc: '完成20个练习', icon: '💪', unlocked: false, condition: '完成20个练习' },
  { id: 'a7', name: '助人者', desc: '评论被点赞50次', icon: '🤝', unlocked: false, condition: '评论被点赞50次' },
  { id: 'a8', name: '清醒先锋', desc: '使用产品满30天', icon: '🌟', unlocked: false, condition: '使用满30天' },
];

// ─── Mock Posts ────────────────────────────────────────
export const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    type: '吐槽',
    industry: '互联网',
    workYears: '3-5年',
    title: '被PUA三年，我终于想通了',
    content: '三年前入职的时候，老板天天夸我"有潜力"，我以为遇到了伯乐。后来才明白，那只是让我拼命干活的套路...',
    tags: ['煤气灯效应', '画大饼'],
    likes: 238,
    resonances: 156,
    comments: 42,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'post2',
    type: '经验',
    industry: '教育',
    workYears: '1-3年',
    title: '应对画大饼老板的5个方法，亲测有效',
    content: '我的前老板特别擅长画大饼，"下个月就给你升职""年底分红少不了你的"——结果呢？后来我学聪明了：书面确认、设底线、不轻信...',
    tags: ['画大饼'],
    likes: 189,
    resonances: 201,
    comments: 33,
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'post3',
    type: '求助',
    industry: '金融',
    workYears: '1年以内',
    title: '老板总在下班前布置紧急任务怎么办',
    content: '入职3个月，发现一个规律：每天下午5:30，老板就会"恰好"想起一件"很急"的事。关键是我不敢拒绝，怕被说态度不好。',
    tags: ['边界侵犯', '情感勒索'],
    likes: 156,
    resonances: 312,
    comments: 67,
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 'post4',
    type: '吐槽',
    industry: '医疗',
    workYears: '5年以上',
    title: '"你要感恩"这句话到底绑架了多少人',
    content: '我在医院工作，主任最爱说的就是"你们要感恩这份工作，外面多少人想进还进不来"。但我想说：我是凭本事考进来的，不是来"感恩"的。',
    tags: ['情感勒索', '否定价值'],
    likes: 301,
    resonances: 445,
    comments: 89,
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'post5',
    type: '经验',
    industry: '互联网',
    workYears: '3-5年',
    title: '识别煤气灯效应的3个信号',
    content: '如果你的上司经常让你怀疑自己的记忆和判断，很可能是煤气灯效应。3个典型信号：①"你记错了吧" ②你开始怀疑自己做过的事 ③每次问题责任都归你',
    tags: ['煤气灯效应'],
    likes: 412,
    resonances: 378,
    comments: 91,
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'post6',
    type: '求助',
    industry: '其他',
    workYears: '1-3年',
    title: '被踢出工作群，我是不是快被裁了',
    content: '上周发现自己被移出了一个重要项目群，事后问同事才知道还开了一个会，完全没有通知我。我现在很慌，不知道是不是要被裁了。',
    tags: ['孤立排挤'],
    likes: 97,
    resonances: 284,
    comments: 56,
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: 'post7',
    type: '吐槽',
    industry: '教育',
    workYears: '1-3年',
    title: '双休被打扰10次，我终于让老板语塞了',
    content: '周末2天，老板发了10条消息。我忍到最后一条，回复了："王总，这件事涉及XX资源调配，需要明天在公司内网系统操作，手机端无法完成。我明天上班第一件事处理。"从此以后，他周末发消息少多了。',
    tags: ['边界侵犯'],
    likes: 876,
    resonances: 543,
    comments: 134,
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
  },
  {
    id: 'post8',
    type: '经验',
    industry: '金融',
    workYears: '5年以上',
    title: '工作5年，我总结出了一套保护自己的方法',
    content: '核心原则：书面留痕，口头不算数。遇到不合理要求：给出方案而非直接拒绝。被当众批评：保持冷静，私下追问具体问题。面对画大饼：要求明确时间节点和书面承诺。',
    tags: ['否定价值', '边界侵犯', '画大饼'],
    likes: 1024,
    resonances: 789,
    comments: 201,
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
  },
];

// ─── Constants ─────────────────────────────────────────
export const PUA_TYPE_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  '否定价值': { bg: '#fff1f2', text: '#dc2626', emoji: '💔' },
  '煤气灯效应': { bg: '#f5f3ff', text: '#7c3aed', emoji: '🎭' },
  '情感勒索': { bg: '#fff7ed', text: '#ea580c', emoji: '😰' },
  '孤立排挤': { bg: '#f9fafb', text: '#4b5563', emoji: '🚫' },
  '画大饼': { bg: '#fffbeb', text: '#d97706', emoji: '🎪' },
  '边界侵犯': { bg: '#eff6ff', text: '#2563eb', emoji: '🚧' },
};

export const INDUSTRY_MAP: Record<string, string> = {
  '互联网': '🌐',
  '教育': '📚',
  '金融': '💹',
  '医疗': '🏥',
  '其他': '📋',
};

export const EMOTION_MAP: Record<string, string> = {
  '愤怒': '😤',
  '委屈': '😢',
  '焦虑': '😰',
  '失落': '😔',
  '麻木': '😶',
};
