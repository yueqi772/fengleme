import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { storage, generateId, getRiskInfo } from '../../utils/storage';
import DigitalHuman, { type MoodKey } from '../../components/DigitalHuman/index';
import './index.css';

// ─── Types ────────────────────────────────────────────
interface ChatMessage {
  role: 'boss' | 'colleague' | 'hr' | 'you' | 'system';
  name?: string;
  content: string;
  time?: string;
  highlight?: boolean;
  dim?: boolean;
}

interface PuaQuestion {
  id: number;
  type: string;
  shortTitle: string;
  context: string;
  chat: ChatMessage[];
  monologue: string;
  quote: string;
  tags: string[];
}

const PUA_QUESTIONS: PuaQuestion[] = [
  {
    id: 1, type: '否定价值', shortTitle: '入职第一天',
    context: '4月7日 · 周一 · 互联网中型公司 · 产品岗',
    chat: [
      { role: 'boss', name: '王总监', content: '欢迎新同学！@小李 以后就是我们的伙伴了～', time: '9:30' },
      { role: 'colleague', name: '同事A', content: '欢迎欢迎！' },
      { role: 'boss', name: '王总监', content: '小李，我看了你的简历，觉得很有潜力。好好干，年底升职加薪不是问题。', time: '10:15', highlight: true },
    ],
    monologue: '王总监拍了拍我的肩膀，那力度刚刚好。走出会议室的时候，我觉得自己真的选对了公司。明天要更努力才行。',
    quote: '简历写得不错，年轻有活力，我相信你能跟上团队的节奏。加油。',
    tags: ['否定价值', '画大饼'],
  },
  {
    id: 2, type: '否定价值', shortTitle: '第一次当众表扬',
    context: '5月中旬 · 项目上线后第一次复盘会',
    chat: [
      { role: 'boss', name: '王总监', content: '这次项目整体完成度不错，尤其是小李，速度快、质量也在线。', time: '14:02', highlight: true },
      { role: 'colleague', name: '同事B', content: '👍' },
      { role: 'boss', name: '王总监', content: '小李，继续保持，你是团队的中坚力量。', time: '14:03' },
    ],
    monologue: '散会后我反复看那条消息，嘴角忍不住往上扬。原来被看见是这种感觉。',
    quote: '你是我们团队最有潜力的那个，别骄傲就行。',
    tags: ['否定价值', '画大饼'],
  },
  {
    id: 3, type: '情感勒索', shortTitle: '连续加班第三周',
    context: '6月 · 项目冲刺期 · 晚上9:47 · 你还在公司',
    chat: [
      { role: 'boss', name: '王总监', content: '@小李 这个页面的交互动画今晚能不能搞定？明天要给客户看。', time: '21:47' },
      { role: 'you', content: '收到，我尽快' },
      { role: 'boss', name: '王总监', content: '👍 其他同事都在线，你搞完可以走。', time: '21:49', highlight: true },
      { role: 'colleague', name: '同事A', content: '[撤回了一条消息]', dim: true },
    ],
    monologue: '同事A撤回了什么？我装作没看见。打开外卖软件看了眼，已经过了配送时间。明天还要早起打卡。',
    quote: '大家都在加班，这是一个团队最基本的觉悟。年轻人多干点，不吃亏的。',
    tags: ['情感勒索', '边界侵犯'],
  },
  {
    id: 4, type: '否定价值', shortTitle: '会议室变成了审判台',
    context: '7月第二个周三 · 下午2点 · 部门全员周会',
    chat: [
      { role: 'boss', name: '王总监', content: '小李，上周那个活动页面的数据你看了吗？', time: '14:08' },
      { role: 'you', content: '看了，转化率是2.3%，比上次略低，我分析了一下原因...' },
      { role: 'boss', name: '王总监', content: '2.3%？这是在浪费公司资源。', time: '14:10', highlight: true },
      { role: 'boss', name: '王总监', content: '这种水平的东西也敢交付？小李，你是怎么混进来的？', time: '14:10', highlight: true },
    ],
    monologue: '会议室安静了大概三秒。没人抬头，没人说话。我能感觉到所有人的目光好像都在天花板上，就是不在我身上。脸上的热度从脖子一直烧到耳朵。',
    quote: '你的方案就是反面教材。大家引以为戒，别向她学习。',
    tags: ['否定价值', '孤立排挤', '煤气灯效应'],
  },
  {
    id: 5, type: '煤气灯效应', shortTitle: '那次谈话，你记得吗？',
    context: '批评会后第二天 · 王总监叫你去办公室',
    chat: [
      { role: 'boss', name: '王总监', content: '昨天那话，我说重了点，但你是自己人我才说的。', time: '10:22' },
      { role: 'you', content: '王总，我想确认一下，您上个月说我Q3会晋升，这个还有吗？' },
      { role: 'boss', name: '王总监', content: '我说过这话？', time: '10:24', highlight: true },
      { role: 'boss', name: '王总监', content: '小李，你记错了吧？我什么时候说过这种话？', time: '10:24', highlight: true },
      { role: 'you', content: '...可能是我的问题，我去确认一下会议纪要' },
    ],
    monologue: '走出办公室，我打开邮箱翻记录。发给自己的抄送还在——"Q3晋升名单有她"几个字清清楚楚。但我开始不确定了。是不是我理解错了？他真的说过吗？',
    quote: '你记错了。我没说过这种话，你想太多了。',
    tags: ['煤气灯效应', '否定价值'],
  },
  {
    id: 6, type: '情感勒索', shortTitle: '"你要感恩"',
    context: '周五傍晚6:28 · 公司群 · 下班时间到了',
    chat: [
      { role: 'boss', name: '王总监', content: '@全体成员 周末搞一下团建，自愿参加。地点我选。费用AA。', time: '18:28' },
      { role: 'you', content: '王总，周末我有安排，可以请假吗？' },
      { role: 'boss', name: '王总监', content: '你要感恩公司给大家这个机会。大家都在，就你不来，这样合适吗？', time: '18:31', highlight: true },
      { role: 'colleague', name: '同事A', content: '+1' },
    ],
    monologue: '我退掉了那张已经买好的回家车票。妈在群里说"路上注意安全"，我回了句"加班呢，这次不回了"。她没再问。',
    quote: '大家要感恩公司给的平台。别老想着休息，年轻人多吃点苦是福报。',
    tags: ['情感勒索'],
  },
  {
    id: 7, type: '孤立排挤', shortTitle: '那条消息你没收到',
    context: '8月第三周 · 周三上午 · 你发现有什么不对劲',
    chat: [
      { role: 'colleague', name: '同事A', content: '各位，下午2点小会议室，项目对焦会～ @同事B @同事C', time: '11:47', highlight: true },
      { role: 'you', content: '请问这个会是什么内容？我也是项目组的' },
      { role: 'colleague', name: '同事A', content: '哦不好意思@小李 我以为你没参与这个模块[尴尬]', time: '11:50' },
      { role: 'boss', name: '王总监', content: '小李，你手上的模块最近产出不太行，是不是能力跟不上了？', time: '11:52' },
    ],
    monologue: '那条会议通知，没有@我。但我明明是这个项目的核心成员。同事A那句"我以为"，我反复想了很多遍。是真的搞错了吗？还是我不想承认的理由？',
    quote: '不是你被针对了，是你自己把自己隔离出去了。',
    tags: ['孤立排挤', '煤气灯效应'],
  },
  {
    id: 8, type: '画大饼', shortTitle: '第三次"下季度一定"',
    context: '9月底 · 季度末 · 王总监主动找你谈话',
    chat: [
      { role: 'boss', name: '王总监', content: '小李，进来坐。这次叫你来，是想跟你谈谈发展的事。', time: '15:03' },
      { role: 'boss', name: '王总监', content: '今年的晋升名额很紧张，但我把你的名字报上去了。', time: '15:05', highlight: true },
      { role: 'boss', name: '王总监', content: '回去好好干，不要让我失望。我对你期望很高的。', time: '15:06' },
    ],
    monologue: '又是"期望"。今年3月说"年底一定"，7月说"下季度一定"，这次又说"我把名字报上去了"。但我已经开始害怕相信了。',
    quote: '我把你的名字已经报上去了。放心，这次稳了。',
    tags: ['画大饼', '否定价值'],
  },
  {
    id: 9, type: '画大饼', shortTitle: '名单上没有我的名字',
    context: '10月第二个周五 · 下午4点 · HR群发了一封邮件',
    chat: [
      { role: 'hr', name: 'HR-陈姐', content: '【通知】Q4晋升名单已确定，恭喜以下同事：@同事A @同事B @同事C @同事D。详细说明会另行通知。', time: '16:02', highlight: true },
      { role: 'you', content: '请问这次晋升评选的标准是什么？我想了解一下自己的差距在哪里' },
      { role: 'hr', name: 'HR-陈姐', content: '评选是各部门总监综合评定的，具体标准不太方便公开哦～' },
    ],
    monologue: '名单上没有我。总监说"把你名字报上去了"。HR说"各部门总监综合评定"。我去找王总监，他说："哎呀，这次名额确实不够...下季度名额，我第一个给你留着。"',
    quote: '这次确实没预料到。但下季度名额，我第一个给你留着。',
    tags: ['画大饼', '否定价值'],
  },
  {
    id: 10, type: '边界侵犯', shortTitle: '11点23分的消息',
    context: '11月 · 周三 · 晚上11:23 · 你刚躺下准备睡觉',
    chat: [
      { role: 'boss', name: '王总监', content: '小李，还没睡吧？', time: '23:23', highlight: true },
      { role: 'you', content: '王总，我在，请问有什么事？' },
      { role: 'boss', name: '王总监', content: '客户刚才给我打电话，说方案有个地方要改。你现在处理一下，明早8点前发我。', time: '23:25', highlight: true },
      { role: 'you', content: '...好的收到' },
    ],
    monologue: '我爬起来打开电脑，窗外马路上偶尔有大车经过。改完方案凌晨2:17。发给他之后我睡不着了，一直盯着手机等回复。4:30他回了两个字："收到。"',
    quote: '我不管客户怎么变，他们什么时候变你就什么时候改。这是基本职业素养。',
    tags: ['边界侵犯', '情感勒索'],
  },
  {
    id: 11, type: '情感勒索', shortTitle: '"我这是为你好"',
    context: '12月 · 王总监以"绩效辅导"名义找你谈话',
    chat: [
      { role: 'boss', name: '王总监', content: '小李，你最近状态不对啊。我这是关心你，才找你谈。', time: '16:00' },
      { role: 'boss', name: '王总监', content: '你知道外面多少人想进我们公司吗？我顶着多大压力给你争取机会，你就拿这个结果回报我？', time: '16:03', highlight: true },
      { role: 'boss', name: '王总监', content: '我把你当自己人才说这些。外面那些人巴不得看我们笑话，你这样让我很难做。', time: '16:05' },
    ],
    monologue: '他说"关心"的时候表情很真诚。他每次施压的时候表情都很真诚。我突然想不起来，是从什么时候开始，"被关心"变成了一种压力。',
    quote: '我是为你好才说这些。换成别人，我才懒得管你。',
    tags: ['情感勒索', '煤气灯效应', '否定价值'],
  },
  {
    id: 12, type: '边界侵犯', shortTitle: '周一的早上，你做了一个决定',
    context: '1月 · 新年后第一个周一 · 早8:47 · 你站在公司楼下',
    chat: [
      { role: 'boss', name: '王总监', content: '@小李 早，今天能把上周五那个方案发我吗？', time: '08:47', highlight: true },
      { role: 'system', content: '你已撤回了一条消息' },
      { role: 'you', content: '好的，王总，9点前发您' },
    ],
    monologue: '我站在公司大堂，空调的冷气从头顶吹下来。手机屏幕还亮着，显示他那条消息。打卡机"滴"的一声，有人说"周一好"。我想起第一天入职时，肩膀上那只手。我已经不记得，上一次感到轻松是什么时候了。',
    quote: '@小李 这个方案改了没有？客户很急。',
    tags: ['否定价值', '边界侵犯', '情感勒索'],
  },
];

type ReplyType = 'a' | 'b' | 'c';

interface ReplyOption {
  id: ReplyType;
  text: string;
  reactionMood: MoodKey;
  hint: string;
}

const ALL_REPLIES: Record<number, ReplyOption[]> = {
  1: [
    { id: 'a', reactionMood: 'confident', hint: '表达感激，但保持分寸，不卑微也不对抗', text: '谢谢王总，我刚来还在学习阶段，有什么做得不到位的地方还请您多指点，我一定努力跟上大家的节奏。' },
    { id: 'b', reactionMood: 'nervous', hint: '全力顺从，给自己加了很多压力', text: '谢谢王总！我一定不辜负您的期望，我会的！您放心，我一定拼尽全力，绝对不让您失望！' },
    { id: 'c', reactionMood: 'confused', hint: '直接追问晋升条件，可能显得急功近利', text: '王总，请问这次晋升主要是看哪方面的表现？我想提前了解清楚，也好有个努力的方向。' },
  ],
  2: [
    { id: 'a', reactionMood: 'confident', hint: '得体回应，感谢但不卑微', text: '谢谢王总！这个项目能做好也是大家一起配合的结果，我一个人的力量做不到的。后续我会继续保持，也希望多向大家学习。' },
    { id: 'b', reactionMood: 'nervous', hint: '过度谦逊，给自己积累压力', text: '谢谢王总，其实这次做得还不够好，有几个地方我自己都觉得可以更好...我会继续努力的，不让您失望。' },
    { id: 'c', reactionMood: 'confused', hint: '立刻追问晋升时间节点，显得急躁', text: '谢谢王总！对了您说的晋升机会，具体是什么时候呢？我想提前做好准备。' },
  ],
  3: [
    { id: 'a', reactionMood: 'anxious', hint: '设立边界，但语气温和，给出替代方案', text: '收到王总。不过我今天已经在地铁上了，信号不太稳定。我到家之后第一时间处理，明早七点前发您可以吗？辛苦您了。' },
    { id: 'b', reactionMood: 'sad', hint: '二话不说直接答应，牺牲个人时间和健康', text: '好的王总，我马上打车回去处理，大概一个半小时能搞定，您稍等。' },
    { id: 'c', reactionMood: 'anxious', hint: '指出安排冲突，但没有明确拒绝，可能激化矛盾', text: '王总，今天这个需求当时没说要今晚交，我现在在外面的，和之前安排有冲突。这种临时变更以后能提前说一声吗？' },
  ],
  4: [
    { id: 'a', reactionMood: 'confused', hint: '聚焦具体问题，不陷入自我否定', text: '王总，这个方案交付时您审过，数据没达到预期我想具体了解下是哪个指标出了问题，也好有针对性地改。我能约您十分钟详细聊聊吗？' },
    { id: 'b', reactionMood: 'sad', hint: '默默承受，可能陷入深深的自我怀疑', text: '...好的王总，我知道了。我回去重新做一份，明天一早发您。这次一定做好。' },
    { id: 'c', reactionMood: 'humiliated', hint: '直接反驳但当场被压制，可能更难受', text: '王总，这个方案您之前审批过的，当时您说的是"可以"。我想知道中间是哪里变了，还是我理解错了什么？' },
  ],
  5: [
    { id: 'a', reactionMood: 'gaslit', hint: '温和提出证据，但可能被再次否认', text: '王总，我在您的邮件里看到过这条记录，可能是沟通上有误会，方便的话我把截图发您确认一下？我很尊重您的意见，但想确保我们理解是一致的。' },
    { id: 'b', reactionMood: 'gaslit', hint: '立刻认同对方说法，内心陷入深深的自我怀疑', text: '...哦，可能是吧，对不起王总，可能是我记混了。不好意思打扰您了，我去忙了。' },
    { id: 'c', reactionMood: 'confused', hint: '直接拿出截图对峙，可能被说"想太多"后更迷茫', text: '王总，我发了您邮箱截图确认，应该不是我记错了。是不是当时的情况有变化？方便的话我们聊一下？' },
  ],
  6: [
    { id: 'a', reactionMood: 'sad', hint: '温和拒绝，给出合理理由，但不卑不亢', text: '谢谢王总组织这次活动！不过这次周末我提前有家里安排好的事情，下次团建我一定积极参加，这周末实在不好意思啦。大家玩得开心～' },
    { id: 'b', reactionMood: 'sad', hint: '退让自己的安排，默默承受委屈', text: '好的王总，我去。那我跟家里说一声改一下安排。请问费用是AA吗？我提前转给大家。' },
    { id: 'c', reactionMood: 'anxious', hint: '质疑"自愿"定义，可能引发群体压力', text: '王总，我看通知上写的是"自愿参加"，不过大家好像都去了...请问是必须参加吗？如果是的话下次能提前说吗，这样我好提前安排。' },
  ],
  7: [
    { id: 'a', reactionMood: 'isolated', hint: '温和询问，不指责但表达困惑', text: '不好意思问一下，这次项目对焦会的议题我关注了一下，感觉有些内容和我目前跟的项目相关，方便让我旁听了解一下吗？主要想对齐一下进度。' },
    { id: 'b', reactionMood: 'isolated', hint: '不追问，默默消化被排斥的感觉', text: '好的，可能是我漏看群消息了...下次有类似会议我关注一下。' },
    { id: 'c', reactionMood: 'angry', hint: '情绪爆发，直接质问，但可能引发更大的压力', text: '请问为什么每次开会都不叫我？我明明是这个项目的核心成员。这已经不是第一次了，我想知道是我哪里做得不好，还是有什么其他原因。' },
  ],
  8: [
    { id: 'a', reactionMood: 'confused', hint: '要求具体承诺和时间，推进落实', text: '谢谢王总一直帮我争取机会。我有个不情之请，想确认一下这次Q4的晋升，具体评审时间是什么时候？需要我这边准备什么材料吗？我想好好准备一下。' },
    { id: 'b', reactionMood: 'sad', hint: '接受模糊承诺，默默等待，积累失落感', text: '好的王总，谢谢您一直记着我的事。我会继续努力做事的，也希望有机会能更进一步。辛苦您了。' },
    { id: 'c', reactionMood: 'angry', hint: '直接揭穿历史，可能被说不够耐心', text: '王总，冒昧问一句，您之前说Q3会提名，后来没成，这次又说Q4...我理解公司有公司的考虑，但我想确认一下这个承诺大概是多大概率可以实现？' },
  ],
  9: [
    { id: 'a', reactionMood: 'sad', hint: '正式询问，但不指责，保持职业态度', text: '王总，不好意思打扰您。想跟您确认一下这次晋升的事，您之前说把我名字报上去了，但名单里没有我，是中间有什么变化吗？' },
    { id: 'b', reactionMood: 'sad', hint: '默默接受委屈，不敢追问', text: '好的王总，我知道了。可能是我哪里还做得不够，我继续努力，下次一定争取。谢谢您。' },
    { id: 'c', reactionMood: 'angry', hint: '直接质问，可能被敷衍或施压', text: '王总，我直说了。您之前说把我名字报上去了，但名单出来没有我，我想知道是什么原因。另外，您前两次也说过同样的话然后没有兑现。' },
  ],
  10: [
    { id: 'a', reactionMood: 'anxious', hint: '设立边界，给出可行方案，不卑不亢', text: '收到王总。不过我现在在外面，不太方便处理电脑。明早七点前我可以处理完发您，这个时间可以吗？如果特别紧急，您看能不能协调其他同事先处理一下？' },
    { id: 'b', reactionMood: 'sad', hint: '二话不说立刻答应，牺牲睡眠和健康', text: '好的王总，我马上处理，大概一个小时左右能搞定，您等我。' },
    { id: 'c', reactionMood: 'anxious', hint: '指出问题但表达困难，可能被说找借口', text: '收到，但这个需求变更我这边是刚收到通知，没有提前沟通。我明早七点前处理可以吗？另外建议之后变更能提前说一声。' },
  ],
  11: [
    { id: 'a', reactionMood: 'gaslit', hint: '接受关心，同时要求具体反馈，不轻易否定自己', text: '谢谢王总关心。我确实最近压力比较大，有些困惑。坦白讲，我不清楚您说的"状态不对"具体指哪些方面，方便给我一些具体的例子或者反馈吗？' },
    { id: 'b', reactionMood: 'sad', hint: '全盘接受，不去质疑核心问题，加深困惑', text: '谢谢王总关心。我会的，我会努力调整自己的状态，可能最近确实有些疲惫，我会尽快调整过来的。' },
    { id: 'c', reactionMood: 'confused', hint: '要求具体证据，可能被更模糊地回应', text: '王总，谢谢您找我谈话。我想请教一下，您说的"外面的人想进来"，具体是指什么？另外，我最近哪些表现让您觉得状态不对，能给我一两个具体例子吗？' },
  ],
  12: [
    { id: 'a', reactionMood: 'determined', hint: '接受任务，同时提出边界问题——这是觉醒时刻！', text: '好的王总，9点前发您。另外正好想跟您说，我最近也在思考工作边界的事情，想找个时间和您聊十分钟，关于工作量和承受压力的一些想法，希望您能听听。' },
    { id: 'b', reactionMood: 'sad', hint: '默默接受，继续等待，不开启改变', text: '好的王总，9点前发您。谢谢王总。' },
    { id: 'c', reactionMood: 'determined', hint: '表达困难，可能引发冲突但也是觉醒的开始', text: '王总，我现在手上有两个项目都在关键阶段，精力确实有些顾不过来。我想跟您说一下实际情况，也想请教您如何协调一下优先级。' },
  ],
};

const MOOD_EMOJI: Record<string, string> = {
  empowered: '💪', confident: '😄', hopeful: '🤞', excited: '😊',
  nervous: '😣', confused: '😕', anxious: '😰', sad: '😢',
  humiliated: '😞', isolated: '😔', gaslit: '😦', angry: '😠',
  violated: '😨', broken: '😞', determined: '😤',
};

const MOOD_COLOR: Record<string, string> = {
  empowered: '#a7f3d0', confident: '#bfdbfe', hopeful: '#bbf7d0', excited: '#fef08a',
  nervous: '#fed7aa', confused: '#e5e7eb', anxious: '#fde68a', sad: '#ddd6fe',
  humiliated: '#fce7f3', isolated: '#f3f4f6', gaslit: '#fde68a', angry: '#fecaca',
  violated: '#fee2e2', broken: '#d1d5db', determined: '#fef08a',
};

function getMoodLabel(mood: string): string {
  const labels: Record<string, string> = {
    empowered: '💪 充满力量', confident: '😊 自信', hopeful: '🤞 心存希望',
    excited: '😊 充满期待', nervous: '😣 紧张不安', confused: '😕 困惑迷茫',
    anxious: '😰 焦虑不安', sad: '😢 难过失落', humiliated: '😞 被羞辱',
    isolated: '😔 被孤立', gaslit: '😦 自我怀疑', angry: '😠 愤怒',
    violated: '😨 边界被侵犯', broken: '😞 精疲力尽', determined: '😤 觉醒',
  };
  return labels[mood] || '😐';
}

type FeedbackLevel = 'good' | 'neutral' | 'bad';

function getFeedbackLevel(mood: string): FeedbackLevel {
  const good = ['empowered', 'confident', 'hopeful', 'determined', 'excited'];
  const bad = ['sad', 'humiliated', 'angry', 'violated', 'broken', 'isolated'];
  if (good.includes(mood)) return 'good';
  if (bad.includes(mood)) return 'bad';
  return 'neutral';
}

const avatarColors: Record<string, string> = {
  boss: '#e54d4d', colleague: '#4a90d9', hr: '#9055d9', you: '#07c160', system: '#888',
};
const avatarText: Record<string, string> = {
  boss: '王', colleague: '同', hr: '人', you: '我', system: '…',
};
const nameColors: Record<string, string> = {
  boss: '#e54d4d', colleague: '#4a90d9', hr: '#9055d9', you: '#07c160',
};

export default function TestPage() {
  const [step, setStep] = useState<'intro' | 'story' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Array<{ replyId: ReplyType; reactionMood: string }>>([]);
  const [selectedReply, setSelectedReply] = useState<ReplyOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [historyMoods, setHistoryMoods] = useState<string[]>([]);

  const question = PUA_QUESTIONS[currentQ];
  const replies = question ? (ALL_REPLIES[question.id] || ALL_REPLIES[1]) : [];
  const isLast = currentQ === PUA_QUESTIONS.length - 1;

  function startStory() {
    setStep('story');
    setCurrentQ(0);
    setAnswers([]);
    setSelectedReply(null);
    setHistoryMoods([]);
    setShowFeedback(false);
  }

  function handleSelectReply(r: ReplyOption) {
    if (selectedReply) return;
    setSelectedReply(r);
    setHistoryMoods(prev => [...prev, r.reactionMood]);
    setShowFeedback(true);
  }

  function handleNext() {
    if (!selectedReply) return;
    const newAnswers = [...answers, { replyId: selectedReply.id, reactionMood: selectedReply.reactionMood }];
    setAnswers(newAnswers);
    setShowFeedback(false);
    if (isLast) {
      const aCount = newAnswers.filter(a => a.replyId === 'a').length;
      const score = Math.round((1 - aCount / 12) * 100);
      const testResults = storage.get('testResults') || [];
      testResults.push({
        id: generateId(),
        date: new Date().toISOString().slice(0, 10),
        score,
        riskLevel: getRiskInfo(score).level,
        counts: {},
        totalAnswered: 12,
        moods: newAnswers.map(a => a.reactionMood),
      });
      storage.set('testResults', testResults);
      setStep('result');
    } else {
      setSelectedReply(null);
      setCurrentQ(q => q + 1);
    }
  }

  // ── INTRO ──
  if (step === 'intro') {
    return (
      <View className="test-intro-container">
        <View className="test-intro-body">
          <View className="test-intro-dh">
            <DigitalHuman mood="confident" size={90} showLabel={false} />
          </View>
          <Text className="test-intro-title">小林的职场故事</Text>
          <Text className="test-intro-subtitle">微信聊天记录沉浸式体验</Text>
          <Text className="test-intro-desc">
            在12个真实场景中做出你的选择{'\n'}你的每个决定都会影响小林的心理状态
          </Text>
          <View className="test-intro-cards">
            {[
              { icon: '💬', title: '微信聊天沉浸式', desc: '像真的在工作群里经历一切' },
              { icon: '💭', title: '情绪状态追踪', desc: '每个选择都影响小林的心理变化' },
              { icon: '🧍', title: '你的选择塑造结局', desc: '三种回应方式，导向不同结局' },
            ].map(item => (
              <View key={item.title} className="test-intro-card">
                <Text className="test-intro-card-icon">{item.icon}</Text>
                <View className="test-intro-card-text">
                  <Text className="test-intro-card-title">{item.title}</Text>
                  <Text className="test-intro-card-desc">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
          <View className="test-intro-btn" onClick={startStory}>
            <Text className="test-intro-btn-text">开始故事之旅 →</Text>
          </View>
        </View>
      </View>
    );
  }

  // ── RESULT ──
  if (step === 'result') {
    const aCount = answers.filter(a => a.replyId === 'a').length;
    const ratio = aCount / 12;
    const finalScore = Math.round((1 - ratio) * 100);
    const risk = getRiskInfo(finalScore);
    const finalMood: MoodKey = ratio >= 0.7 ? 'empowered' : ratio >= 0.4 ? 'confident' : 'broken';
    const info = ratio >= 0.7
      ? { e: '🌟', t: '觉醒者', d: '你帮助小林找到了职场边界的力量！' }
      : ratio >= 0.4
      ? { e: '🌱', t: '觉醒中', d: '小林开始意识到问题，但还需要更多勇气。' }
      : { e: '😢', t: '迷失中', d: '小林还没有找到力量，但故事还没结束。' };

    return (
      <ScrollView scrollY className="test-result-container">
        <View className="test-result-header">
          <View className="test-result-back" onClick={() => Taro.navigateTo({ url: '/pages/home/index' })}>
            <Text className="test-result-back-text">‹ 返回</Text>
          </View>
          <Text className="test-result-header-title">工作群聊</Text>
          <View style={{ width: 40 }} />
        </View>
        <View className="test-result-body">
          <View className="test-result-card">
            <View className="test-result-dh-wrap">
              <DigitalHuman mood={finalMood} size={110} showLabel={false} />
            </View>
            <Text className="test-result-big-emoji">{info.e}</Text>
            <Text className="test-result-title">{info.t}</Text>
            <Text className="test-result-desc">{info.d}</Text>
          </View>

          <View className="test-result-score-card" style={{ background: risk.bg } as any}>
            <Text className="test-result-score-label">职场压力指数</Text>
            <View className="test-result-score-row">
              <Text className="test-result-score-emoji">{risk.emoji}</Text>
              <Text className="test-result-score-num" style={{ color: risk.color } as any}>{finalScore}</Text>
              <Text className="test-result-score-unit">/100</Text>
            </View>
            <Text className="test-result-risk-desc" style={{ color: risk.color } as any}>{risk.desc}</Text>
          </View>

          <View className="test-result-stats-card">
            {[
              { n: answers.filter(a => a.replyId === 'a').length, l: '从容应对' },
              { n: answers.filter(a => a.replyId === 'b').length, l: '沉默承受' },
              { n: answers.filter(a => a.replyId === 'c').length, l: '激烈回应' },
            ].map(s => (
              <View key={s.l} className="test-result-stat-item">
                <Text className="test-result-stat-num">{s.n}</Text>
                <Text className="test-result-stat-label">{s.l}</Text>
              </View>
            ))}
          </View>

          <View className="test-result-mood-card">
            <Text className="test-result-mood-title">小林的情绪轨迹</Text>
            <ScrollView scrollX className="test-result-mood-scroll">
              {answers.map((a, i) => (
                <View key={i} className="test-result-mood-item">
                  <View
                    className="test-result-mood-circle"
                    style={{ background: MOOD_COLOR[a.reactionMood] || '#e5e7eb' } as any}
                  >
                    <Text className="test-result-mood-emoji">{MOOD_EMOJI[a.reactionMood] || '😐'}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View className="test-result-quote">
            <Text className="test-result-quote-text">"你的感受是真实的。"</Text>
          </View>

          <View
            className="test-result-report-btn"
            onClick={() => Taro.navigateTo({ url: '/pages/report/index' })}
          >
            <Text className="test-result-report-btn-text">查看详细报告 →</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ── STORY ──
  if (!question) return null;

  const level = selectedReply ? getFeedbackLevel(selectedReply.reactionMood) : 'neutral';
  const feedbackCfg: Record<FeedbackLevel, {
    border: string; label: string; btnBg: string;
    sheetBg: string; topBg: string; emoji: string;
  }> = {
    good:    { border: '#86efac', label: '✓ 较好的回应', btnBg: '#22c55e', sheetBg: '#f0fdf4', topBg: '#dcfce7', emoji: '🌟' },
    neutral: { border: '#fde68a', label: '○ 一般的回应', btnBg: '#f59e0b', sheetBg: '#fffbeb', topBg: '#fef3c7', emoji: '💭' },
    bad:     { border: '#fecdd3', label: '✗ 艰难的回应', btnBg: '#e11d48', sheetBg: '#fff1f2', topBg: '#ffe4e6', emoji: '💔' },
  };
  const fcfg = feedbackCfg[level];

  return (
    <View className="test-story-container">
      {/* Header */}
      <View className="test-story-header">
        <View onClick={() => setStep('intro')}>
          <Text className="test-story-back">‹</Text>
        </View>
        <View className="test-story-header-center">
          <Text className="test-story-header-title">工作群聊</Text>
          <Text className="test-story-header-sub">互联网产品部</Text>
        </View>
        <View style={{ width: 24 }}>
          <Text className="test-story-header-more">›</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="test-story-progress">
        {Array.from({ length: 12 }, (_, i) => (
          <View
            key={i}
            className={`test-progress-dot${i <= currentQ ? ' test-progress-dot-active' : ''}`}
            style={{
              width: i < currentQ ? 16 : i === currentQ ? 10 : 6,
              background: i <= currentQ ? '#07c160' : '#ccc',
              opacity: i < currentQ ? 1 : i === currentQ ? 0.8 : 0.4,
            } as any}
          />
        ))}
      </View>

      {/* Emotion bar */}
      {historyMoods.length > 0 && (
        <ScrollView scrollX className="test-emotion-bar">
          <Text className="test-emotion-bar-label">情绪:</Text>
          {historyMoods.map((m, i) => (
            <View
              key={i}
              className="test-emotion-dot"
              style={{ background: MOOD_COLOR[m] || '#e5e7eb' } as any}
            >
              <Text className="test-emotion-dot-emoji">{MOOD_EMOJI[m] || '😐'}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Chat area */}
      <ScrollView scrollY className="test-chat-scroll">
        {/* Context banner */}
        <View className="test-context-banner">
          <Text className="test-context-text">{question.context}</Text>
        </View>

        {/* Chat bubbles */}
        {question.chat.map((msg, i) => {
          if (msg.role === 'system') {
            return (
              <View key={i} className="test-sys-msg">
                <Text className="test-sys-msg-text">{msg.content}</Text>
              </View>
            );
          }
          const isMe = msg.role === 'you';
          return (
            <View key={i} className={`test-bubble-row${isMe ? ' test-bubble-row-me' : ''}`}>
              <View
                className="test-avatar"
                style={{ background: avatarColors[msg.role] || '#888' } as any}
              >
                <Text className="test-avatar-text">{avatarText[msg.role] || '?'}</Text>
              </View>
              <View className={`test-bubble-col${isMe ? ' test-bubble-col-me' : ''}`}>
                {msg.name && !isMe && (
                  <Text className="test-bubble-name" style={{ color: nameColors[msg.role] || '#888' } as any}>
                    {msg.name}
                  </Text>
                )}
                <View
                  className={`test-bubble${isMe ? ' test-bubble-me' : msg.highlight ? ' test-bubble-highlight' : ' test-bubble-other'}`}
                  style={msg.dim ? { opacity: 0.5 } as any : {}}
                >
                  <Text className="test-bubble-text">{msg.content}</Text>
                </View>
                {msg.time && <Text className="test-bubble-time">{msg.time}</Text>}
              </View>
            </View>
          );
        })}

        {/* Monologue */}
        <View className="test-monologue-row">
          <View className="test-monologue-avatar">
            <Text className="test-monologue-avatar-text">林</Text>
          </View>
          <View className="test-monologue-bubble">
            <Text className="test-monologue-label">💭 小林的内心</Text>
            <Text className="test-monologue-text">{question.monologue}</Text>
          </View>
        </View>

        {/* Key quote */}
        <View className="test-key-quote">
          <Text className="test-key-quote-label">🎯 关键一幕</Text>
          <Text className="test-key-quote-text">"{question.quote}"</Text>
        </View>

        {/* PUA tags */}
        <View className="test-tags-row">
          {question.tags.map(t => (
            <View key={t} className="test-tag">
              <Text className="test-tag-text">#{t}</Text>
            </View>
          ))}
        </View>

        {/* Selected reply bubble */}
        {selectedReply && (
          <View className="test-selected-reply-row">
            <View className="test-selected-reply-bubble">
              <Text className="test-selected-reply-text">{selectedReply.text}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Reply options */}
      {!selectedReply && (
        <View className="test-reply-bar">
          <Text className="test-reply-bar-label">你会怎么回复：</Text>
          {replies.map(r => (
            <View key={r.id} className="test-reply-option" onClick={() => handleSelectReply(r)}>
              <Text className="test-reply-option-text">{r.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Feedback overlay */}
      {showFeedback && selectedReply && (
        <View className="test-feedback-overlay">
          <View className="test-feedback-mask" />
          <View
            className="test-feedback-sheet"
            style={{ borderColor: fcfg.border, background: fcfg.sheetBg } as any}
          >
            {/* Top bar with DigitalHuman */}
            <View
              className="test-feedback-top-bar"
              style={{ background: fcfg.topBg } as any}
            >
              <View className="test-feedback-top-inner">
                <Text className="test-feedback-top-emoji">{fcfg.emoji}</Text>
                <View className="test-feedback-top-mid">
                  <View
                    className="test-feedback-badge"
                    style={{ background: fcfg.btnBg } as any}
                  >
                    <Text className="test-feedback-badge-text">{fcfg.label}</Text>
                  </View>
                  <Text className="test-feedback-mood">{getMoodLabel(selectedReply.reactionMood)}</Text>
                </View>
                {/* DigitalHuman 小林在右端 */}
                <View className="test-feedback-dh">
                  <DigitalHuman mood={selectedReply.reactionMood} size={72} showLabel={false} />
                </View>
              </View>
            </View>

            {/* Reply bubble */}
            <View className="test-feedback-reply-row">
              <View className="test-feedback-me-avatar">
                <Text className="test-feedback-me-avatar-text">我</Text>
              </View>
              <View className="test-feedback-reply-bubble">
                <Text className="test-feedback-reply-text">{selectedReply.text}</Text>
              </View>
            </View>

            {/* Hint */}
            <View className="test-feedback-hint">
              <Text className="test-feedback-hint-label">💡 这一刻发生了什么</Text>
              <Text className="test-feedback-hint-text">{selectedReply.hint}</Text>
              <View className="test-feedback-mood-row">
                <View
                  className="test-feedback-mood-circle"
                  style={{ background: MOOD_COLOR[selectedReply.reactionMood] || '#e5e7eb' } as any}
                >
                  <Text className="test-feedback-mood-emoji">{MOOD_EMOJI[selectedReply.reactionMood] || '😐'}</Text>
                </View>
                <Text className="test-feedback-mood-label">小林现在：{getMoodLabel(selectedReply.reactionMood)}</Text>
              </View>
            </View>

            {/* Next button */}
            <View
              className="test-feedback-btn"
              style={{ background: fcfg.btnBg } as any}
              onClick={handleNext}
            >
              <Text className="test-feedback-btn-text">{isLast ? '🌟 查看结局' : '继续 →'}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
