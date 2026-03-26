export const EMOTION_MAP: Record<string,string> = {"愤怒":"😠","委屈":"😢","焦虑":"😰","失落":"😔","麻木":"😐"};
export const PUA_TYPES = ["否定价值","煤气灯效应","情感勒索","孤立排挤","画大饼","边界侵犯"];
export const ACHIEVEMENTS = [
  {id:"a1",title:"🌱初次觉醒",desc:"完成第一次情景练习",icon:"🌱"},
  {id:"a2",title:"🧭自我认知",desc:"完成PUA识别测试",icon:"🧭"},
  {id:"a3",title:"📝倾诉开始",desc:"写下第一篇树洞日记",icon:"📝"},
  {id:"a4",title:"💬社区新人",desc:"在社区发布第一条帖子",icon:"💬"},
  {id:"a5",title:"🌟觉醒者",desc:"测试得分超过80分",icon:"🌟"},
  {id:"a6",title:"🎭练习达人",desc:"完成20次情景练习",icon:"🎭"},
  {id:"a7",title:"📋决策时刻",desc:"使用去/留决策工具",icon:"📋"},
  {id:"a8",title:"🔐边界守护者",desc:"连续7天使用工具",icon:"🔐"},
];
export const MOCK_POSTS = [
  {id:"p1",author:"匿名用户",industry:"互联网",content:"今天老板又在下班前10分钟布置新任务，说不急但明天要。",likes:42,comments:8,time:"3小时前",tags:["边界侵犯","画大饼"]},
  {id:"p2",author:"小A",industry:"教育",content:"被HR约谈，说我状态不对，让我主动考虑其他机会。",likes:128,comments:31,time:"5小时前",tags:["情感勒索","孤立排挤"]},
  {id:"p3",author:"阿杰",industry:"金融",content:"老板当着全组的面说我的方案是垃圾，然后让另一个人重做。",likes:89,comments:22,time:"昨天",tags:["否定价值","煤气灯效应"]},
];
