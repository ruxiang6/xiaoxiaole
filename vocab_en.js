/* vocab_en.js —— 萌消乐 · 网页正式版内置英语词库（1000 词，按难度分级）
 * -------------------------------------------------------------------------
 * 挂 window.VOCAB：每条 { w:单词, zh:中文释义, ipa:国际音标, band:难度档 }
 *   band 1 = 小学（约 450）  2 = 初中（约 380）  3 = 高中/进阶（约 170）
 * 出题逻辑见 quiz.js；答题弹窗见 app.js 的 View.playQuiz。
 * classic <script>（非 module，规避 file:// CORS，与项目一致）。
 * 音标以常见词典风格 IPA 标注；如需绝对权威可后续接词典 API 校订（当前离线内置）。
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';
  const V = [];
  function add(band, list) { for (const e of list) V.push({ w: e[0], zh: e[1], ipa: e[2], band: band }); }

  /* ===================== BAND 1 · 小学（基础高频） ===================== */
  // 数字
  add(1, [
    ['one', '一', '/wʌn/'], ['two', '二', '/tuː/'], ['three', '三', '/θriː/'], ['four', '四', '/fɔː/'],
    ['five', '五', '/faɪv/'], ['six', '六', '/sɪks/'], ['seven', '七', '/ˈsevn/'], ['eight', '八', '/eɪt/'],
    ['nine', '九', '/naɪn/'], ['ten', '十', '/ten/'], ['eleven', '十一', '/ɪˈlevn/'], ['twelve', '十二', '/twelv/'],
    ['thirteen', '十三', '/ˌθɜːˈtiːn/'], ['twenty', '二十', '/ˈtwenti/'], ['thirty', '三十', '/ˈθɜːti/'],
    ['hundred', '百', '/ˈhʌndrəd/'], ['thousand', '千', '/ˈθaʊznd/'], ['first', '第一', '/fɜːst/'],
    ['second', '第二', '/ˈsekənd/'], ['third', '第三', '/θɜːd/'], ['number', '数字', '/ˈnʌmbə/'],
  ]);
  // 颜色
  add(1, [
    ['red', '红色', '/red/'], ['orange', '橙色', '/ˈɒrɪndʒ/'], ['yellow', '黄色', '/ˈjeləʊ/'],
    ['green', '绿色', '/ɡriːn/'], ['blue', '蓝色', '/bluː/'], ['purple', '紫色', '/ˈpɜːpl/'],
    ['pink', '粉色', '/pɪŋk/'], ['brown', '棕色', '/braʊn/'], ['black', '黑色', '/blæk/'],
    ['white', '白色', '/waɪt/'], ['gray', '灰色', '/ɡreɪ/'], ['gold', '金色', '/ɡəʊld/'],
    ['color', '颜色', '/ˈkʌlə/'],
  ]);
  // 动物
  add(1, [
    ['cat', '猫', '/kæt/'], ['dog', '狗', '/dɒɡ/'], ['pig', '猪', '/pɪɡ/'], ['cow', '奶牛', '/kaʊ/'],
    ['duck', '鸭子', '/dʌk/'], ['hen', '母鸡', '/hen/'], ['chick', '小鸡', '/tʃɪk/'], ['bird', '鸟', '/bɜːd/'],
    ['fish', '鱼', '/fɪʃ/'], ['rabbit', '兔子', '/ˈræbɪt/'], ['horse', '马', '/hɔːs/'], ['sheep', '绵羊', '/ʃiːp/'],
    ['goat', '山羊', '/ɡəʊt/'], ['tiger', '老虎', '/ˈtaɪɡə/'], ['lion', '狮子', '/ˈlaɪən/'], ['bear', '熊', '/beə/'],
    ['panda', '熊猫', '/ˈpændə/'], ['monkey', '猴子', '/ˈmʌŋki/'], ['elephant', '大象', '/ˈelɪfənt/'],
    ['fox', '狐狸', '/fɒks/'], ['wolf', '狼', '/wʊlf/'], ['mouse', '老鼠', '/maʊs/'], ['snake', '蛇', '/sneɪk/'],
    ['frog', '青蛙', '/frɒɡ/'], ['bee', '蜜蜂', '/biː/'], ['ant', '蚂蚁', '/ænt/'], ['owl', '猫头鹰', '/aʊl/'],
    ['duckling', '小鸭', '/ˈdʌklɪŋ/'], ['turtle', '乌龟', '/ˈtɜːtl/'], ['penguin', '企鹅', '/ˈpeŋɡwɪn/'],
    ['giraffe', '长颈鹿', '/dʒəˈrɑːf/'], ['zebra', '斑马', '/ˈzebrə/'], ['deer', '鹿', '/dɪə/'],
    ['dragon', '龙', '/ˈdræɡən/'], ['animal', '动物', '/ˈænɪml/'],
  ]);
  // 家庭与人
  add(1, [
    ['family', '家庭', '/ˈfæməli/'], ['father', '父亲', '/ˈfɑːðə/'], ['mother', '母亲', '/ˈmʌðə/'],
    ['dad', '爸爸', '/dæd/'], ['mom', '妈妈', '/mɒm/'], ['parent', '家长', '/ˈpeərənt/'],
    ['brother', '兄弟', '/ˈbrʌðə/'], ['sister', '姐妹', '/ˈsɪstə/'], ['baby', '婴儿', '/ˈbeɪbi/'],
    ['grandfather', '祖父', '/ˈɡrænfɑːðə/'], ['grandmother', '祖母', '/ˈɡrænmʌðə/'], ['uncle', '叔叔', '/ˈʌŋkl/'],
    ['aunt', '阿姨', '/ɑːnt/'], ['cousin', '表亲', '/ˈkʌzn/'], ['friend', '朋友', '/frend/'],
    ['boy', '男孩', '/bɔɪ/'], ['girl', '女孩', '/ɡɜːl/'], ['man', '男人', '/mæn/'], ['woman', '女人', '/ˈwʊmən/'],
    ['child', '孩子', '/tʃaɪld/'], ['people', '人们', '/ˈpiːpl/'], ['kid', '小孩', '/kɪd/'],
    ['teacher', '老师', '/ˈtiːtʃə/'], ['student', '学生', '/ˈstjuːdnt/'], ['doctor', '医生', '/ˈdɒktə/'],
    ['nurse', '护士', '/nɜːs/'], ['farmer', '农民', '/ˈfɑːmə/'], ['worker', '工人', '/ˈwɜːkə/'],
    ['name', '名字', '/neɪm/'],
  ]);
  // 身体
  add(1, [
    ['head', '头', '/hed/'], ['hair', '头发', '/heə/'], ['face', '脸', '/feɪs/'], ['eye', '眼睛', '/aɪ/'],
    ['ear', '耳朵', '/ɪə/'], ['nose', '鼻子', '/nəʊz/'], ['mouth', '嘴', '/maʊθ/'], ['tooth', '牙齿', '/tuːθ/'],
    ['hand', '手', '/hænd/'], ['finger', '手指', '/ˈfɪŋɡə/'], ['arm', '手臂', '/ɑːm/'], ['leg', '腿', '/leɡ/'],
    ['foot', '脚', '/fʊt/'], ['knee', '膝盖', '/niː/'], ['body', '身体', '/ˈbɒdi/'], ['back', '背', '/bæk/'],
    ['neck', '脖子', '/nek/'], ['heart', '心脏', '/hɑːt/'],
  ]);
  // 食物饮料
  add(1, [
    ['food', '食物', '/fuːd/'], ['rice', '米饭', '/raɪs/'], ['bread', '面包', '/bred/'], ['noodle', '面条', '/ˈnuːdl/'],
    ['egg', '鸡蛋', '/eɡ/'], ['milk', '牛奶', '/mɪlk/'], ['water', '水', '/ˈwɔːtə/'], ['juice', '果汁', '/dʒuːs/'],
    ['tea', '茶', '/tiː/'], ['coffee', '咖啡', '/ˈkɒfi/'], ['meat', '肉', '/miːt/'], ['shrimp', '虾', '/ʃrɪmp/'],
    ['chicken', '鸡肉', '/ˈtʃɪkɪn/'], ['soup', '汤', '/suːp/'], ['cake', '蛋糕', '/keɪk/'], ['candy', '糖果', '/ˈkændi/'],
    ['sugar', '糖', '/ˈʃʊɡə/'], ['salt', '盐', '/sɔːlt/'], ['cheese', '奶酪', '/tʃiːz/'], ['sandwich', '三明治', '/ˈsænwɪdʒ/'],
    ['hamburger', '汉堡', '/ˈhæmbɜːɡə/'], ['pizza', '披萨', '/ˈpiːtsə/'], ['ice cream', '冰淇淋', '/ˈaɪs kriːm/'],
    ['breakfast', '早餐', '/ˈbrekfəst/'], ['lunch', '午餐', '/lʌntʃ/'], ['dinner', '晚餐', '/ˈdɪnə/'], ['meal', '一餐', '/miːl/'],
  ]);
  // 水果蔬菜
  add(1, [
    ['apple', '苹果', '/ˈæpl/'], ['banana', '香蕉', '/bəˈnɑːnə/'], ['pineapple', '菠萝', '/ˈpaɪnæpl/'], ['pear', '梨', '/peə/'],
    ['grape', '葡萄', '/ɡreɪp/'], ['peach', '桃子', '/piːtʃ/'], ['watermelon', '西瓜', '/ˈwɔːtəmelən/'],
    ['strawberry', '草莓', '/ˈstrɔːbəri/'], ['lemon', '柠檬', '/ˈlemən/'], ['mango', '芒果', '/ˈmæŋɡəʊ/'],
    ['fruit', '水果', '/fruːt/'], ['tomato', '番茄', '/təˈmɑːtəʊ/'], ['potato', '土豆', '/pəˈteɪtəʊ/'],
    ['carrot', '胡萝卜', '/ˈkærət/'], ['onion', '洋葱', '/ˈʌnjən/'], ['bean', '豆子', '/biːn/'],
    ['corn', '玉米', '/kɔːn/'], ['vegetable', '蔬菜', '/ˈvedʒtəbl/'], ['cabbage', '卷心菜', '/ˈkæbɪdʒ/'],
  ]);
  // 学校学习用品
  add(1, [
    ['school', '学校', '/skuːl/'], ['class', '班级', '/klɑːs/'], ['classroom', '教室', '/ˈklɑːsruːm/'],
    ['book', '书', '/bʊk/'], ['pen', '钢笔', '/pen/'], ['pencil', '铅笔', '/ˈpensl/'], ['ruler', '尺子', '/ˈruːlə/'],
    ['eraser', '橡皮', '/ɪˈreɪzə/'], ['bag', '书包', '/bæɡ/'], ['desk', '书桌', '/desk/'], ['chair', '椅子', '/tʃeə/'],
    ['blackboard', '黑板', '/ˈblækbɔːd/'], ['paper', '纸', '/ˈpeɪpə/'], ['picture', '图画', '/ˈpɪktʃə/'],
    ['lesson', '课程', '/ˈlesn/'], ['homework', '家庭作业', '/ˈhəʊmwɜːk/'], ['test', '测验', '/test/'],
    ['question', '问题', '/ˈkwestʃən/'], ['answer', '答案', '/ˈɑːnsə/'], ['word', '单词', '/wɜːd/'],
    ['story', '故事', '/ˈstɔːri/'], ['English', '英语', '/ˈɪŋɡlɪʃ/'], ['math', '数学', '/mæθ/'],
    ['music', '音乐', '/ˈmjuːzɪk/'], ['art', '美术', '/ɑːt/'], ['pen pal', '笔友', '/ˈpen pæl/'],
  ]);
  // 家/房间/家具
  add(1, [
    ['home', '家', '/həʊm/'], ['house', '房子', '/haʊs/'], ['room', '房间', '/ruːm/'], ['door', '门', '/dɔː/'],
    ['window', '窗户', '/ˈwɪndəʊ/'], ['wall', '墙', '/wɔːl/'], ['floor', '地板', '/flɔː/'], ['bed', '床', '/bed/'],
    ['table', '桌子', '/ˈteɪbl/'], ['sofa', '沙发', '/ˈsəʊfə/'], ['kitchen', '厨房', '/ˈkɪtʃɪn/'],
    ['bedroom', '卧室', '/ˈbedruːm/'], ['bathroom', '浴室', '/ˈbɑːθruːm/'], ['light', '灯/光', '/laɪt/'],
    ['clock', '时钟', '/klɒk/'], ['phone', '电话', '/fəʊn/'], ['key', '钥匙', '/kiː/'], ['box', '盒子', '/bɒks/'],
    ['cup', '杯子', '/kʌp/'], ['bowl', '碗', '/bəʊl/'], ['plate', '盘子', '/pleɪt/'], ['spoon', '勺子', '/spuːn/'],
    ['knife', '刀', '/naɪf/'], ['garden', '花园', '/ˈɡɑːdn/'],
  ]);
  // 衣物
  add(1, [
    ['clothes', '衣服', '/kləʊðz/'], ['coat', '外套', '/kəʊt/'], ['shirt', '衬衫', '/ʃɜːt/'], ['dress', '连衣裙', '/dres/'],
    ['skirt', '裙子', '/skɜːt/'], ['pants', '裤子', '/pænts/'], ['jeans', '牛仔裤', '/dʒiːnz/'], ['hat', '帽子', '/hæt/'],
    ['cap', '鸭舌帽', '/kæp/'], ['shoe', '鞋子', '/ʃuː/'], ['sock', '袜子', '/sɒk/'], ['glove', '手套', '/ɡlʌv/'],
    ['scarf', '围巾', '/skɑːf/'], ['sweater', '毛衣', '/ˈswetə/'], ['jacket', '夹克', '/ˈdʒækɪt/'], ['shorts', '短裤', '/ʃɔːts/'],
  ]);
  // 自然天气
  add(1, [
    ['sun', '太阳', '/sʌn/'], ['moon', '月亮', '/muːn/'], ['star', '星星', '/stɑː/'], ['sky', '天空', '/skaɪ/'],
    ['cloud', '云', '/klaʊd/'], ['rain', '雨', '/reɪn/'], ['snow', '雪', '/snəʊ/'], ['wind', '风', '/wɪnd/'],
    ['tree', '树', '/triː/'], ['flower', '花', '/ˈflaʊə/'], ['grass', '草', '/ɡrɑːs/'], ['leaf', '叶子', '/liːf/'],
    ['river', '河流', '/ˈrɪvə/'], ['sea', '海', '/siː/'], ['mountain', '山', '/ˈmaʊntən/'], ['hill', '小山', '/hɪl/'],
    ['stone', '石头', '/stəʊn/'], ['fire', '火', '/ˈfaɪə/'], ['ice', '冰', '/aɪs/'], ['weather', '天气', '/ˈweðə/'],
    ['hot', '热的', '/hɒt/'], ['cold', '冷的', '/kəʊld/'], ['warm', '温暖的', '/wɔːm/'], ['cool', '凉爽的', '/kuːl/'],
    ['sunny', '晴朗的', '/ˈsʌni/'], ['rainy', '下雨的', '/ˈreɪni/'], ['windy', '有风的', '/ˈwɪndi/'], ['cloudy', '多云的', '/ˈklaʊdi/'],
  ]);
  // 时间日期
  add(1, [
    ['day', '天', '/deɪ/'], ['week', '周', '/wiːk/'], ['month', '月份', '/mʌnθ/'], ['year', '年', '/jɪə/'],
    ['today', '今天', '/təˈdeɪ/'], ['tomorrow', '明天', '/təˈmɒrəʊ/'], ['yesterday', '昨天', '/ˈjestədeɪ/'],
    ['morning', '早晨', '/ˈmɔːnɪŋ/'], ['afternoon', '下午', '/ˌɑːftəˈnuːn/'], ['evening', '傍晚', '/ˈiːvnɪŋ/'],
    ['night', '夜晚', '/naɪt/'], ['time', '时间', '/taɪm/'], ['hour', '小时', '/ˈaʊə/'], ['minute', '分钟', '/ˈmɪnɪt/'],
    ['Monday', '星期一', '/ˈmʌndeɪ/'], ['Tuesday', '星期二', '/ˈtjuːzdeɪ/'], ['Wednesday', '星期三', '/ˈwenzdeɪ/'],
    ['Thursday', '星期四', '/ˈθɜːzdeɪ/'], ['Friday', '星期五', '/ˈfraɪdeɪ/'], ['Saturday', '星期六', '/ˈsætədeɪ/'],
    ['Sunday', '星期日', '/ˈsʌndeɪ/'], ['spring', '春天', '/sprɪŋ/'], ['summer', '夏天', '/ˈsʌmə/'],
    ['autumn', '秋天', '/ˈɔːtəm/'], ['winter', '冬天', '/ˈwɪntə/'], ['season', '季节', '/ˈsiːzn/'],
    ['birthday', '生日', '/ˈbɜːθdeɪ/'], ['holiday', '假日', '/ˈhɒlədeɪ/'],
  ]);
  // 地点交通
  add(1, [
    ['park', '公园', '/pɑːk/'], ['zoo', '动物园', '/zuː/'], ['shop', '商店', '/ʃɒp/'], ['store', '商店', '/stɔː/'],
    ['market', '市场', '/ˈmɑːkɪt/'], ['hospital', '医院', '/ˈhɒspɪtl/'], ['library', '图书馆', '/ˈlaɪbrəri/'],
    ['city', '城市', '/ˈsɪti/'], ['town', '城镇', '/taʊn/'], ['village', '村庄', '/ˈvɪlɪdʒ/'], ['farm', '农场', '/fɑːm/'],
    ['road', '道路', '/rəʊd/'], ['street', '街道', '/striːt/'], ['bridge', '桥', '/brɪdʒ/'], ['bank', '银行', '/bæŋk/'],
    ['car', '小汽车', '/kɑː/'], ['bus', '公交车', '/bʌs/'], ['bike', '自行车', '/baɪk/'], ['train', '火车', '/treɪn/'],
    ['plane', '飞机', '/pleɪn/'], ['ship', '轮船', '/ʃɪp/'], ['boat', '小船', '/bəʊt/'], ['taxi', '出租车', '/ˈtæksi/'],
    ['subway', '地铁', '/ˈsʌbweɪ/'],
  ]);
  // 玩具运动娱乐
  add(1, [
    ['toy', '玩具', '/tɔɪ/'], ['ball', '球', '/bɔːl/'], ['doll', '洋娃娃', '/dɒl/'], ['kite', '风筝', '/kaɪt/'],
    ['game', '游戏', '/ɡeɪm/'], ['ball game', '球类游戏', '/ˈbɔːl ɡeɪm/'], ['football', '足球', '/ˈfʊtbɔːl/'],
    ['basketball', '篮球', '/ˈbɑːskɪtbɔːl/'], ['swim', '游泳', '/swɪm/'], ['run', '跑', '/rʌn/'], ['jump', '跳', '/dʒʌmp/'],
    ['sing', '唱歌', '/sɪŋ/'], ['dance', '跳舞', '/dɑːns/'], ['draw', '画画', '/drɔː/'], ['play', '玩', '/pleɪ/'],
    ['sport', '运动', '/spɔːt/'], ['song', '歌曲', '/sɒŋ/'], ['party', '聚会', '/ˈpɑːti/'], ['gift', '礼物', '/ɡɪft/'],
  ]);
  // 常用动词
  add(1, [
    ['go', '去', '/ɡəʊ/'], ['come', '来', '/kʌm/'], ['eat', '吃', '/iːt/'], ['drink', '喝', '/drɪŋk/'],
    ['see', '看见', '/siː/'], ['look', '看', '/lʊk/'], ['read', '阅读', '/riːd/'], ['write', '写', '/raɪt/'],
    ['open', '打开', '/ˈəʊpən/'], ['close', '关闭', '/kləʊz/'], ['sit', '坐', '/sɪt/'], ['stand', '站', '/stænd/'],
    ['walk', '走', '/wɔːk/'], ['sleep', '睡觉', '/sliːp/'], ['wake', '醒来', '/weɪk/'], ['speak', '说', '/spiːk/'],
    ['talk', '交谈', '/tɔːk/'], ['listen', '听', '/ˈlɪsn/'], ['learn', '学习', '/lɜːn/'], ['study', '学习', '/ˈstʌdi/'],
    ['help', '帮助', '/help/'], ['make', '制作', '/meɪk/'], ['take', '拿', '/teɪk/'], ['give', '给', '/ɡɪv/'],
    ['buy', '买', '/baɪ/'], ['sell', '卖', '/sel/'], ['find', '找到', '/faɪnd/'], ['want', '想要', '/wɒnt/'],
    ['like', '喜欢', '/laɪk/'], ['love', '爱', '/lʌv/'], ['know', '知道', '/nəʊ/'], ['think', '想', '/θɪŋk/'],
    ['say', '说', '/seɪ/'], ['tell', '告诉', '/tel/'], ['ask', '问', '/ɑːsk/'], ['work', '工作', '/wɜːk/'],
    ['wash', '洗', '/wɒʃ/'], ['put', '放', '/pʊt/'], ['cook', '烹饪', '/kʊk/'], ['fly', '飞', '/flaɪ/'],
    ['start', '开始', '/stɑːt/'], ['ride', '骑', '/raɪd/'], ['drive', '驾驶', '/draɪv/'], ['stop', '停止', '/stɒp/'],
  ]);
  // 常用形容词与方位
  add(1, [
    ['big', '大的', '/bɪɡ/'], ['small', '小的', '/smɔːl/'], ['long', '长的', '/lɒŋ/'], ['short', '短的', '/ʃɔːt/'],
    ['tall', '高的', '/tɔːl/'], ['high', '高的', '/haɪ/'], ['low', '低的', '/ləʊ/'], ['old', '旧的/老的', '/əʊld/'],
    ['new', '新的', '/njuː/'], ['young', '年轻的', '/jʌŋ/'], ['good', '好的', '/ɡʊd/'], ['bad', '坏的', '/bæd/'],
    ['happy', '快乐的', '/ˈhæpi/'], ['sad', '伤心的', '/sæd/'], ['fast', '快的', '/fɑːst/'], ['slow', '慢的', '/sləʊ/'],
    ['easy', '容易的', '/ˈiːzi/'], ['hard', '难的/硬的', '/hɑːd/'], ['clean', '干净的', '/kliːn/'], ['dirty', '脏的', '/ˈdɜːti/'],
    ['nice', '友好的', '/naɪs/'], ['kind', '善良的', '/kaɪnd/'], ['pretty', '漂亮的', '/ˈprɪti/'], ['beautiful', '美丽的', '/ˈbjuːtɪfl/'],
    ['strong', '强壮的', '/strɒŋ/'], ['weak', '虚弱的', '/wiːk/'], ['heavy', '重的', '/ˈhevi/'], ['soft', '柔软的', '/sɒft/'],
    ['full', '满的', '/fʊl/'], ['empty', '空的', '/ˈempti/'], ['round', '圆的', '/raʊnd/'], ['right', '正确的/右', '/raɪt/'],
    ['left', '左边', '/left/'], ['up', '向上', '/ʌp/'], ['down', '向下', '/daʊn/'], ['near', '近的', '/nɪə/'],
    ['far', '远的', '/fɑː/'], ['fun', '有趣的', '/fʌn/'], ['funny', '滑稽的', '/ˈfʌni/'], ['hungry', '饥饿的', '/ˈhʌŋɡri/'],
    ['thirsty', '口渴的', '/ˈθɜːsti/'], ['tired', '疲倦的', '/ˈtaɪəd/'], ['busy', '忙碌的', '/ˈbɪzi/'], ['free', '空闲的/自由的', '/friː/'],
  ]);
  // 基础交流词
  add(1, [
    ['hello', '你好', '/həˈləʊ/'], ['hi', '嗨', '/haɪ/'], ['bye', '再见', '/baɪ/'], ['yes', '是的', '/jes/'],
    ['no', '不', '/nəʊ/'], ['please', '请', '/pliːz/'], ['thanks', '谢谢', '/θæŋks/'], ['sorry', '对不起', '/ˈsɒri/'],
    ['welcome', '欢迎', '/ˈwelkəm/'], ['okay', '好的', '/ˌəʊˈkeɪ/'], ['great', '很棒的', '/ɡreɪt/'], ['sure', '当然', '/ʃʊə/'],
  ]);

  /* ===================== BAND 2 · 初中（进阶常用） ===================== */
  // 学科与学习
  add(2, [
    ['subject', '科目', '/ˈsʌbdʒɪkt/'], ['science', '科学', '/ˈsaɪəns/'], ['history', '历史', '/ˈhɪstri/'],
    ['geography', '地理', '/dʒiˈɒɡrəfi/'], ['biology', '生物', '/baɪˈɒlədʒi/'], ['chemistry', '化学', '/ˈkemɪstri/'],
    ['physics', '物理', '/ˈfɪzɪks/'], ['knowledge', '知识', '/ˈnɒlɪdʒ/'], ['exam', '考试', '/ɪɡˈzæm/'],
    ['grade', '年级/成绩', '/ɡreɪd/'], ['degree', '学位/程度', '/dɪˈɡriː/'], ['dictionary', '词典', '/ˈdɪkʃənri/'],
    ['sentence', '句子', '/ˈsentəns/'], ['grammar', '语法', '/ˈɡræmə/'], ['example', '例子', '/ɪɡˈzɑːmpl/'],
    ['mistake', '错误', '/mɪˈsteɪk/'], ['practice', '练习', '/ˈpræktɪs/'], ['course', '课程', '/kɔːs/'],
    ['project', '项目', '/ˈprɒdʒekt/'], ['report', '报告', '/rɪˈpɔːt/'], ['diary', '日记', '/ˈdaɪəri/'],
    ['notebook', '笔记本', '/ˈnəʊtbʊk/'], ['college', '大学', '/ˈkɒlɪdʒ/'], ['education', '教育', '/ˌedʒuˈkeɪʃn/'],
  ]);
  // 职业
  add(2, [
    ['job', '工作', '/dʒɒb/'], ['engineer', '工程师', '/ˌendʒɪˈnɪə/'], ['scientist', '科学家', '/ˈsaɪəntɪst/'],
    ['artist', '艺术家', '/ˈɑːtɪst/'], ['writer', '作家', '/ˈraɪtə/'], ['actor', '演员', '/ˈæktə/'],
    ['singer', '歌手', '/ˈsɪŋə/'], ['dancer', '舞者', '/ˈdɑːnsə/'], ['driver', '司机', '/ˈdraɪvə/'],
    ['police', '警察', '/pəˈliːs/'], ['soldier', '士兵', '/ˈsəʊldʒə/'], ['lawyer', '律师', '/ˈlɔːjə/'],
    ['manager', '经理', '/ˈmænɪdʒə/'], ['boss', '老板', '/bɒs/'], ['chef', '厨师', '/ʃef/'],
    ['waiter', '服务员', '/ˈweɪtə/'], ['reporter', '记者', '/rɪˈpɔːtə/'], ['pilot', '飞行员', '/ˈpaɪlət/'],
    ['dentist', '牙医', '/ˈdentɪst/'], ['secretary', '秘书', '/ˈsekrətri/'], ['customer', '顾客', '/ˈkʌstəmə/'],
    ['captain', '队长/船长', '/ˈkæptɪn/'], ['guide', '导游/向导', '/ɡaɪd/'],
  ]);
  // 情绪与性格
  add(2, [
    ['feeling', '感觉', '/ˈfiːlɪŋ/'], ['angry', '生气的', '/ˈæŋɡri/'], ['afraid', '害怕的', '/əˈfreɪd/'],
    ['excited', '兴奋的', '/ɪkˈsaɪtɪd/'], ['bored', '无聊的', '/bɔːd/'], ['nervous', '紧张的', '/ˈnɜːvəs/'],
    ['proud', '自豪的', '/praʊd/'], ['surprised', '惊讶的', '/səˈpraɪzd/'], ['worried', '担心的', '/ˈwʌrid/'],
    ['lonely', '孤独的', '/ˈləʊnli/'], ['brave', '勇敢的', '/breɪv/'], ['honest', '诚实的', '/ˈɒnɪst/'],
    ['polite', '礼貌的', '/pəˈlaɪt/'], ['shy', '害羞的', '/ʃaɪ/'], ['lazy', '懒惰的', '/ˈleɪzi/'],
    ['clever', '聪明的', '/ˈklevə/'], ['friendly', '友好的', '/ˈfrendli/'], ['patient', '耐心的', '/ˈpeɪʃnt/'],
    ['serious', '严肃的', '/ˈsɪəriəs/'], ['confident', '自信的', '/ˈkɒnfɪdənt/'], ['curious', '好奇的', '/ˈkjʊəriəs/'],
    ['pleased', '高兴的', '/pliːzd/'], ['calm', '冷静的', '/kɑːm/'], ['strict', '严格的', '/strɪkt/'],
  ]);
  // 动词 II
  add(2, [
    ['believe', '相信', '/bɪˈliːv/'], ['decide', '决定', '/dɪˈsaɪd/'], ['remember', '记得', '/rɪˈmembə/'],
    ['forget', '忘记', '/fəˈɡet/'], ['understand', '理解', '/ˌʌndəˈstænd/'], ['explain', '解释', '/ɪkˈspleɪn/'],
    ['describe', '描述', '/dɪˈskraɪb/'], ['discuss', '讨论', '/dɪˈskʌs/'], ['agree', '同意', '/əˈɡriː/'],
    ['choose', '选择', '/tʃuːz/'], ['collect', '收集', '/kəˈlekt/'], ['compare', '比较', '/kəmˈpeə/'],
    ['imagine', '想象', '/ɪˈmædʒɪn/'], ['introduce', '介绍', '/ˌɪntrəˈdjuːs/'], ['invent', '发明', '/ɪnˈvent/'],
    ['discover', '发现', '/dɪˈskʌvə/'], ['improve', '改善', '/ɪmˈpruːv/'], ['increase', '增加', '/ɪnˈkriːs/'],
    ['reduce', '减少', '/rɪˈdjuːs/'], ['accept', '接受', '/əkˈsept/'], ['receive', '收到', '/rɪˈsiːv/'],
    ['offer', '提供', '/ˈɒfə/'], ['provide', '提供', '/prəˈvaɪd/'], ['prepare', '准备', '/prɪˈpeə/'],
    ['protect', '保护', '/prəˈtekt/'], ['produce', '生产', '/prəˈdjuːs/'], ['repair', '修理', '/rɪˈpeə/'],
    ['return', '归还/返回', '/rɪˈtɜːn/'], ['succeed', '成功', '/səkˈsiːd/'], ['travel', '旅行', '/ˈtrævl/'],
    ['visit', '拜访', '/ˈvɪzɪt/'], ['spend', '花费', '/spend/'], ['save', '节省/拯救', '/seɪv/'],
    ['share', '分享', '/ʃeə/'], ['follow', '跟随', '/ˈfɒləʊ/'], ['catch', '抓住', '/kætʃ/'],
    ['throw', '扔', '/θrəʊ/'], ['carry', '搬运', '/ˈkæri/'], ['climb', '攀爬', '/klaɪm/'],
    ['fall', '落下', '/fɔːl/'], ['break', '打破', '/breɪk/'], ['fix', '固定/修理', '/fɪks/'],
  ]);
  // 形容词 II
  add(2, [
    ['important', '重要的', '/ɪmˈpɔːtnt/'], ['difficult', '困难的', '/ˈdɪfɪkəlt/'], ['possible', '可能的', '/ˈpɒsəbl/'],
    ['real', '真实的', '/rɪəl/'], ['famous', '著名的', '/ˈfeɪməs/'], ['popular', '流行的', '/ˈpɒpjələ/'],
    ['modern', '现代的', '/ˈmɒdn/'], ['ancient', '古代的', '/ˈeɪnʃənt/'], ['common', '常见的', '/ˈkɒmən/'],
    ['special', '特别的', '/ˈspeʃl/'], ['different', '不同的', '/ˈdɪfrənt/'], ['similar', '相似的', '/ˈsɪmələ/'],
    ['dangerous', '危险的', '/ˈdeɪndʒərəs/'], ['safe', '安全的', '/seɪf/'], ['useful', '有用的', '/ˈjuːsfl/'],
    ['expensive', '昂贵的', '/ɪkˈspensɪv/'], ['cheap', '便宜的', '/tʃiːp/'], ['delicious', '美味的', '/dɪˈlɪʃəs/'],
    ['comfortable', '舒适的', '/ˈkʌmftəbl/'], ['quiet', '安静的', '/ˈkwaɪət/'], ['loud', '响亮的', '/laʊd/'],
    ['bright', '明亮的', '/braɪt/'], ['dark', '黑暗的', '/dɑːk/'], ['deep', '深的', '/diːp/'],
    ['wide', '宽的', '/waɪd/'], ['thick', '厚的', '/θɪk/'], ['thin', '薄的/瘦的', '/θɪn/'],
    ['wet', '湿的', '/wet/'], ['fresh', '新鲜的', '/freʃ/'], ['healthy', '健康的', '/ˈhelθi/'],
    ['wonderful', '精彩的', '/ˈwʌndəfl/'], ['terrible', '糟糕的', '/ˈterəbl/'], ['strange', '奇怪的', '/streɪndʒ/'],
    ['true', '真的', '/truː/'], ['false', '错误的', '/fɔːls/'],
  ]);
  // 抽象名词
  add(2, [
    ['idea', '主意', '/aɪˈdɪə/'], ['problem', '问题', '/ˈprɒbləm/'], ['reason', '原因', '/ˈriːzn/'],
    ['result', '结果', '/rɪˈzʌlt/'], ['way', '方法/路', '/weɪ/'], ['plan', '计划', '/plæn/'],
    ['dream', '梦想', '/driːm/'], ['hope', '希望', '/həʊp/'], ['chance', '机会', '/tʃɑːns/'],
    ['change', '改变', '/tʃeɪndʒ/'], ['choice', '选择', '/tʃɔɪs/'], ['fact', '事实', '/fækt/'],
    ['truth', '真相', '/truːθ/'], ['meaning', '意义', '/ˈmiːnɪŋ/'], ['information', '信息', '/ˌɪnfəˈmeɪʃn/'],
    ['message', '消息', '/ˈmesɪdʒ/'], ['news', '新闻', '/njuːz/'], ['secret', '秘密', '/ˈsiːkrət/'],
    ['culture', '文化', '/ˈkʌltʃə/'], ['custom', '习俗', '/ˈkʌstəm/'], ['language', '语言', '/ˈlæŋɡwɪdʒ/'],
    ['success', '成功', '/səkˈses/'], ['power', '力量/电力', '/ˈpaʊə/'], ['health', '健康', '/helθ/'],
    ['life', '生活/生命', '/laɪf/'], ['death', '死亡', '/deθ/'], ['peace', '和平', '/piːs/'],
    ['danger', '危险', '/ˈdeɪndʒə/'], ['trouble', '麻烦', '/ˈtrʌbl/'], ['interest', '兴趣', '/ˈɪntrəst/'],
  ]);
  // 自然与环境
  add(2, [
    ['nature', '自然', '/ˈneɪtʃə/'], ['earth', '地球', '/ɜːθ/'], ['world', '世界', '/wɜːld/'],
    ['ocean', '海洋', '/ˈəʊʃn/'], ['island', '岛屿', '/ˈaɪlənd/'], ['forest', '森林', '/ˈfɒrɪst/'],
    ['desert', '沙漠', '/ˈdezət/'], ['field', '田野', '/fiːld/'], ['valley', '山谷', '/ˈvæli/'],
    ['lake', '湖泊', '/leɪk/'], ['pond', '池塘', '/pɒnd/'], ['wave', '波浪', '/weɪv/'],
    ['storm', '暴风雨', '/stɔːm/'], ['thunder', '雷', '/ˈθʌndə/'], ['fog', '雾', '/fɒɡ/'],
    ['environment', '环境', '/ɪnˈvaɪrənmənt/'], ['pollution', '污染', '/pəˈluːʃn/'], ['energy', '能量', '/ˈenədʒi/'],
    ['plant', '植物', '/plɑːnt/'], ['insect', '昆虫', '/ˈɪnsekt/'], ['dinosaur', '恐龙', '/ˈdaɪnəsɔː/'],
    ['creature', '生物', '/ˈkriːtʃə/'], ['space', '太空', '/speɪs/'], ['planet', '行星', '/ˈplænɪt/'],
    ['rock', '岩石', '/rɒk/'], ['soil', '土壤', '/sɔɪl/'],
  ]);
  // 旅行与地理
  add(2, [
    ['adventure', '冒险', '/ədˈventʃə/'], ['trip', '旅程', '/trɪp/'], ['journey', '旅途', '/ˈdʒɜːni/'],
    ['country', '国家', '/ˈkʌntri/'], ['nation', '民族/国家', '/ˈneɪʃn/'], ['capital', '首都', '/ˈkæpɪtl/'],
    ['airport', '机场', '/ˈeəpɔːt/'], ['station', '车站', '/ˈsteɪʃn/'], ['ticket', '票', '/ˈtɪkɪt/'],
    ['passport', '护照', '/ˈpɑːspɔːt/'], ['luggage', '行李', '/ˈlʌɡɪdʒ/'], ['hotel', '旅馆', '/həʊˈtel/'],
    ['map', '地图', '/mæp/'], ['tour', '游览', '/tʊə/'], ['tourist', '游客', '/ˈtʊərɪst/'],
    ['abroad', '在国外', '/əˈbrɔːd/'], ['foreign', '外国的', '/ˈfɒrən/'], ['distance', '距离', '/ˈdɪstəns/'],
    ['direction', '方向', '/dəˈrekʃn/'], ['north', '北', '/nɔːθ/'], ['south', '南', '/saʊθ/'],
    ['east', '东', '/iːst/'], ['west', '西', '/west/'], ['restaurant', '餐馆', '/ˈrestrɒnt/'],
  ]);
  // 健康与身体 II
  add(2, [
    ['medicine', '药', '/ˈmedsn/'], ['illness', '疾病', '/ˈɪlnəs/'], ['fever', '发烧', '/ˈfiːvə/'],
    ['cough', '咳嗽', '/kɒf/'], ['headache', '头痛', '/ˈhedeɪk/'], ['pain', '疼痛', '/peɪn/'],
    ['injury', '受伤', '/ˈɪndʒəri/'], ['exercise', '锻炼', '/ˈeksəsaɪz/'], ['symptom', '症状', '/ˈsɪmptəm/'],
    ['blood', '血液', '/blʌd/'], ['skin', '皮肤', '/skɪn/'], ['bone', '骨头', '/bəʊn/'],
    ['brain', '大脑', '/breɪn/'], ['stomach', '胃', '/ˈstʌmək/'], ['shoulder', '肩膀', '/ˈʃəʊldə/'],
    ['throat', '喉咙', '/θrəʊt/'], ['weight', '重量/体重', '/weɪt/'], ['diet', '饮食', '/ˈdaɪət/'],
  ]);
  // 科技与媒体
  add(2, [
    ['computer', '电脑', '/kəmˈpjuːtə/'], ['internet', '互联网', '/ˈɪntənet/'], ['website', '网站', '/ˈwebsaɪt/'],
    ['program', '程序', '/ˈprəʊɡræm/'], ['machine', '机器', '/məˈʃiːn/'], ['robot', '机器人', '/ˈrəʊbɒt/'],
    ['screen', '屏幕', '/skriːn/'], ['keyboard', '键盘', '/ˈkiːbɔːd/'], ['camera', '相机', '/ˈkæmrə/'],
    ['video', '视频', '/ˈvɪdiəʊ/'], ['radio', '收音机', '/ˈreɪdiəʊ/'], ['television', '电视', '/ˈtelɪvɪʒn/'],
    ['film', '电影', '/fɪlm/'], ['movie', '电影', '/ˈmuːvi/'], ['photo', '照片', '/ˈfəʊtəʊ/'],
    ['email', '电子邮件', '/ˈiːmeɪl/'], ['network', '网络', '/ˈnetwɜːk/'], ['data', '数据', '/ˈdeɪtə/'],
    ['signal', '信号', '/ˈsɪɡnəl/'], ['battery', '电池', '/ˈbætri/'], ['device', '设备', '/dɪˈvaɪs/'],
    ['technology', '技术', '/tekˈnɒlədʒi/'],
  ]);
  // 时间频率与副词
  add(2, [
    ['always', '总是', '/ˈɔːlweɪz/'], ['usually', '通常', '/ˈjuːʒuəli/'], ['often', '经常', '/ˈɒfn/'],
    ['sometimes', '有时', '/ˈsʌmtaɪmz/'], ['never', '从不', '/ˈnevə/'], ['already', '已经', '/ɔːlˈredi/'],
    ['recently', '最近', '/ˈriːsntli/'], ['suddenly', '突然', '/ˈsʌdnli/'], ['quickly', '迅速地', '/ˈkwɪkli/'],
    ['slowly', '缓慢地', '/ˈsləʊli/'], ['carefully', '仔细地', '/ˈkeəfəli/'], ['quietly', '安静地', '/ˈkwaɪətli/'],
    ['finally', '最后', '/ˈfaɪnəli/'], ['probably', '大概', '/ˈprɒbəbli/'], ['maybe', '也许', '/ˈmeɪbi/'],
    ['perhaps', '或许', '/pəˈhæps/'], ['together', '一起', '/təˈɡeðə/'], ['alone', '独自', '/əˈləʊn/'],
    ['almost', '几乎', '/ˈɔːlməʊst/'], ['enough', '足够', '/ɪˈnʌf/'], ['once', '一次/曾经', '/wʌns/'],
    ['twice', '两次', '/twaɪs/'], ['ago', '以前', '/əˈɡəʊ/'], ['soon', '很快', '/suːn/'],
    ['early', '早', '/ˈɜːli/'], ['late', '晚', '/leɪt/'], ['forever', '永远', '/fərˈevə/'],
  ]);
  // 数量、社会与其他
  add(2, [
    ['money', '钱', '/ˈmʌni/'], ['price', '价格', '/praɪs/'], ['cost', '花费/成本', '/kɒst/'],
    ['dollar', '美元', '/ˈdɒlə/'], ['coin', '硬币', '/kɔɪn/'], ['group', '群体', '/ɡruːp/'],
    ['team', '团队', '/tiːm/'], ['member', '成员', '/ˈmembə/'], ['leader', '领导者', '/ˈliːdə/'],
    ['society', '社会', '/səˈsaɪəti/'], ['government', '政府', '/ˈɡʌvənmənt/'], ['law', '法律', '/lɔː/'],
    ['rule', '规则', '/ruːl/'], ['freedom', '自由', '/ˈfriːdəm/'], ['duty', '责任', '/ˈdjuːti/'],
    ['century', '世纪', '/ˈsentʃəri/'], ['event', '事件', '/ɪˈvent/'], ['moment', '时刻', '/ˈməʊmənt/'],
    ['future', '未来', '/ˈfjuːtʃə/'], ['past', '过去', '/pɑːst/'], ['present', '现在/礼物', '/ˈpreznt/'],
    ['half', '一半', '/hɑːf/'], ['double', '双倍', '/ˈdʌbl/'], ['single', '单个的', '/ˈsɪŋɡl/'],
    ['pair', '一对', '/peə/'], ['piece', '一块', '/piːs/'], ['part', '部分', '/pɑːt/'],
    ['whole', '整个', '/həʊl/'], ['several', '几个', '/ˈsevrəl/'], ['few', '很少', '/fjuː/'],
    ['both', '两者', '/bəʊθ/'], ['each', '每个', '/iːtʃ/'], ['million', '百万', '/ˈmɪljən/'],
  ]);
  // 交流与社交
  add(2, [
    ['invite', '邀请', '/ɪnˈvaɪt/'], ['promise', '承诺', '/ˈprɒmɪs/'], ['advice', '建议', '/ədˈvaɪs/'],
    ['suggest', '建议', '/səˈdʒest/'], ['thank', '感谢', '/θæŋk/'], ['apologize', '道歉', '/əˈpɒlədʒaɪz/'],
    ['greet', '问候', '/ɡriːt/'], ['argue', '争论', '/ˈɑːɡjuː/'], ['praise', '表扬', '/preɪz/'],
    ['complain', '抱怨', '/kəmˈpleɪn/'], ['express', '表达', '/ɪkˈspres/'], ['mention', '提到', '/ˈmenʃn/'],
    ['reply', '回复', '/rɪˈplaɪ/'], ['shout', '喊叫', '/ʃaʊt/'], ['whisper', '低语', '/ˈwɪspə/'],
    ['smile', '微笑', '/smaɪl/'], ['laugh', '大笑', '/lɑːf/'], ['cry', '哭', '/kraɪ/'],
    ['nod', '点头', '/nɒd/'], ['clap', '鼓掌', '/klæp/'],
  ]);

  /* ===================== BAND 3 · 高中 / 进阶（学术抽象） ===================== */
  // 学术与思维
  add(3, [
    ['analyze', '分析', '/ˈænəlaɪz/'], ['approach', '方法/接近', '/əˈprəʊtʃ/'], ['assume', '假定', '/əˈsjuːm/'],
    ['conclude', '得出结论', '/kənˈkluːd/'], ['conclusion', '结论', '/kənˈkluːʒn/'], ['evidence', '证据', '/ˈevɪdəns/'],
    ['theory', '理论', '/ˈθɪəri/'], ['concept', '概念', '/ˈkɒnsept/'], ['principle', '原则', '/ˈprɪnsəpl/'],
    ['method', '方法', '/ˈmeθəd/'], ['research', '研究', '/rɪˈsɜːtʃ/'], ['experiment', '实验', '/ɪkˈsperɪmənt/'],
    ['analysis', '分析', '/əˈnæləsɪs/'], ['argument', '论点/争论', '/ˈɑːɡjumənt/'], ['logic', '逻辑', '/ˈlɒdʒɪk/'],
    ['definition', '定义', '/ˌdefɪˈnɪʃn/'], ['factor', '因素', '/ˈfæktə/'], ['aspect', '方面', '/ˈæspekt/'],
    ['tendency', '趋势', '/ˈtendənsi/'], ['assumption', '假设', '/əˈsʌmpʃn/'], ['perspective', '观点', '/pəˈspektɪv/'],
    ['significance', '重要性', '/sɪɡˈnɪfɪkəns/'], ['consequence', '后果', '/ˈkɒnsɪkwəns/'], ['contrast', '对比', '/ˈkɒntrɑːst/'],
  ]);
  // 社会与经济
  add(3, [
    ['economy', '经济', '/ɪˈkɒnəmi/'], ['industry', '工业', '/ˈɪndəstri/'], ['policy', '政策', '/ˈpɒləsi/'],
    ['politics', '政治', '/ˈpɒlətɪks/'], ['community', '社区', '/kəˈmjuːnəti/'], ['population', '人口', '/ˌpɒpjuˈleɪʃn/'],
    ['citizen', '公民', '/ˈsɪtɪzn/'], ['authority', '权威/当局', '/ɔːˈθɒrəti/'], ['organization', '组织', '/ˌɔːɡənaɪˈzeɪʃn/'],
    ['institution', '机构', '/ˌɪnstɪˈtjuːʃn/'], ['resource', '资源', '/rɪˈsɔːs/'], ['profit', '利润', '/ˈprɒfɪt/'],
    ['income', '收入', '/ˈɪnkʌm/'], ['budget', '预算', '/ˈbʌdʒɪt/'], ['finance', '财政', '/ˈfaɪnæns/'],
    ['trade', '贸易', '/treɪd/'], ['enterprise', '企业', '/ˈentəpraɪz/'], ['demand', '需求', '/dɪˈmɑːnd/'],
    ['supply', '供应', '/səˈplaɪ/'], ['investment', '投资', '/ɪnˈvestmənt/'], ['justice', '正义', '/ˈdʒʌstɪs/'],
    ['equality', '平等', '/ɪˈkwɒləti/'], ['responsibility', '责任', '/rɪˌspɒnsəˈbɪləti/'], ['influence', '影响', '/ˈɪnfluəns/'],
  ]);
  // 高级动词
  add(3, [
    ['achieve', '实现', '/əˈtʃiːv/'], ['acquire', '获得', '/əˈkwaɪə/'], ['establish', '建立', '/ɪˈstæblɪʃ/'],
    ['maintain', '维持', '/meɪnˈteɪn/'], ['obtain', '获得', '/əbˈteɪn/'], ['pursue', '追求', '/pəˈsjuː/'],
    ['reveal', '揭示', '/rɪˈviːl/'], ['indicate', '表明', '/ˈɪndɪkeɪt/'], ['demonstrate', '证明/演示', '/ˈdemənstreɪt/'],
    ['illustrate', '说明', '/ˈɪləstreɪt/'], ['emphasize', '强调', '/ˈemfəsaɪz/'], ['estimate', '估计', '/ˈestɪmeɪt/'],
    ['determine', '决定', '/dɪˈtɜːmɪn/'], ['distinguish', '区分', '/dɪˈstɪŋɡwɪʃ/'], ['interpret', '解释', '/ɪnˈtɜːprɪt/'],
    ['contribute', '贡献', '/kənˈtrɪbjuːt/'], ['participate', '参与', '/pɑːˈtɪsɪpeɪt/'], ['reflect', '反映/反思', '/rɪˈflekt/'],
    ['regard', '看待', '/rɪˈɡɑːd/'], ['ensure', '确保', '/ɪnˈʃʊə/'], ['convince', '说服', '/kənˈvɪns/'],
    ['recommend', '推荐', '/ˌrekəˈmend/'], ['assess', '评估', '/əˈses/'], ['adapt', '适应', '/əˈdæpt/'],
    ['adjust', '调整', '/əˈdʒʌst/'], ['generate', '产生', '/ˈdʒenəreɪt/'], ['transform', '转变', '/trænsˈfɔːm/'],
    ['overcome', '克服', '/ˌəʊvəˈkʌm/'], ['reject', '拒绝', '/rɪˈdʒekt/'], ['seek', '寻求', '/siːk/'],
  ]);
  // 高级形容词
  add(3, [
    ['significant', '重大的', '/sɪɡˈnɪfɪkənt/'], ['essential', '必要的', '/ɪˈsenʃl/'], ['obvious', '明显的', '/ˈɒbviəs/'],
    ['complex', '复杂的', '/ˈkɒmpleks/'], ['efficient', '高效的', '/ɪˈfɪʃnt/'], ['effective', '有效的', '/ɪˈfektɪv/'],
    ['appropriate', '适当的', '/əˈprəʊpriət/'], ['adequate', '足够的', '/ˈædɪkwət/'], ['abstract', '抽象的', '/ˈæbstrækt/'],
    ['accurate', '准确的', '/ˈækjərət/'], ['aware', '意识到的', '/əˈweə/'], ['capable', '有能力的', '/ˈkeɪpəbl/'],
    ['crucial', '关键的', '/ˈkruːʃl/'], ['flexible', '灵活的', '/ˈfleksəbl/'], ['fundamental', '基本的', '/ˌfʌndəˈmentl/'],
    ['relevant', '相关的', '/ˈreləvənt/'], ['reliable', '可靠的', '/rɪˈlaɪəbl/'], ['sufficient', '充足的', '/səˈfɪʃnt/'],
    ['typical', '典型的', '/ˈtɪpɪkl/'], ['unique', '独特的', '/juˈniːk/'], ['various', '各种各样的', '/ˈveəriəs/'],
    ['numerous', '众多的', '/ˈnjuːmərəs/'], ['constant', '不变的', '/ˈkɒnstənt/'], ['potential', '潜在的', '/pəˈtenʃl/'],
    ['practical', '实际的', '/ˈpræktɪkl/'], ['rational', '理性的', '/ˈræʃnəl/'], ['sensitive', '敏感的', '/ˈsensətɪv/'],
    ['stable', '稳定的', '/ˈsteɪbl/'], ['temporary', '临时的', '/ˈtemprəri/'], ['permanent', '永久的', '/ˈpɜːmənənt/'],
  ]);
  // 情感、品格与抽象名词（进阶）
  add(3, [
    ['ambition', '雄心', '/æmˈbɪʃn/'], ['attitude', '态度', '/ˈætɪtjuːd/'], ['emotion', '情绪', '/ɪˈməʊʃn/'],
    ['passion', '热情', '/ˈpæʃn/'], ['courage', '勇气', '/ˈkʌrɪdʒ/'], ['wisdom', '智慧', '/ˈwɪzdəm/'],
    ['patience', '耐心', '/ˈpeɪʃns/'], ['pride', '自豪', '/praɪd/'], ['sorrow', '悲伤', '/ˈsɒrəʊ/'],
    ['sympathy', '同情', '/ˈsɪmpəθi/'], ['gratitude', '感激', '/ˈɡrætɪtjuːd/'], ['loyalty', '忠诚', '/ˈlɔɪəlti/'],
    ['honesty', '诚实', '/ˈɒnəsti/'], ['generous', '慷慨的', '/ˈdʒenərəs/'], ['humble', '谦逊的', '/ˈhʌmbl/'],
    ['ambitious', '有抱负的', '/æmˈbɪʃəs/'], ['optimistic', '乐观的', '/ˌɒptɪˈmɪstɪk/'], ['grateful', '感激的', '/ˈɡreɪtfl/'],
    ['reputation', '声誉', '/ˌrepjuˈteɪʃn/'], ['impression', '印象', '/ɪmˈpreʃn/'], ['motivation', '动机', '/ˌməʊtɪˈveɪʃn/'],
    ['achievement', '成就', '/əˈtʃiːvmənt/'], ['challenge', '挑战', '/ˈtʃælɪndʒ/'], ['opportunity', '机会', '/ˌɒpəˈtjuːnəti/'],
  ]);
  // 科学、艺术与人文
  add(3, [
    ['universe', '宇宙', '/ˈjuːnɪvɜːs/'], ['gravity', '重力', '/ˈɡrævəti/'], ['atom', '原子', '/ˈætəm/'],
    ['molecule', '分子', '/ˈmɒlɪkjuːl/'], ['species', '物种', '/ˈspiːʃiːz/'], ['evolution', '进化', '/ˌiːvəˈluːʃn/'],
    ['climate', '气候', '/ˈklaɪmət/'], ['temperature', '温度', '/ˈtemprətʃə/'], ['electricity', '电', '/ɪˌlekˈtrɪsəti/'],
    ['function', '功能', '/ˈfʌŋkʃn/'], ['structure', '结构', '/ˈstrʌktʃə/'], ['system', '系统', '/ˈsɪstəm/'],
    ['process', '过程', '/ˈprəʊses/'], ['literature', '文学', '/ˈlɪtrətʃə/'], ['philosophy', '哲学', '/fəˈlɒsəfi/'],
    ['poetry', '诗歌', '/ˈpəʊətri/'], ['novel', '小说', '/ˈnɒvl/'], ['author', '作者', '/ˈɔːθə/'],
    ['theme', '主题', '/θiːm/'], ['symbol', '象征', '/ˈsɪmbl/'], ['tradition', '传统', '/trəˈdɪʃn/'],
    ['heritage', '遗产', '/ˈherɪtɪdʒ/'], ['architecture', '建筑', '/ˈɑːkɪtektʃə/'], ['sculpture', '雕塑', '/ˈskʌlptʃə/'],
    ['imagination', '想象力', '/ɪˌmædʒɪˈneɪʃn/'],
  ]);

  /* ===================== 补充词（凑足 1000+，保持分档比例） ===================== */
  // Band 1 补充
  add(1, [
    ['gate', '大门', '/ɡeɪt/'], ['roof', '屋顶', '/ruːf/'], ['yard', '院子', '/jɑːd/'], ['umbrella', '雨伞', '/ʌmˈbrelə/'],
    ['glasses', '眼镜', '/ˈɡlɑːsɪz/'], ['watch', '手表', '/wɒtʃ/'], ['ring', '戒指', '/rɪŋ/'], ['pocket', '口袋', '/ˈpɒkɪt/'],
    ['basket', '篮子', '/ˈbɑːskɪt/'], ['bottle', '瓶子', '/ˈbɒtl/'], ['glass', '玻璃杯', '/ɡlɑːs/'], ['fork', '叉子', '/fɔːk/'],
    ['towel', '毛巾', '/ˈtaʊəl/'], ['soap', '肥皂', '/səʊp/'], ['mirror', '镜子', '/ˈmɪrə/'], ['candle', '蜡烛', '/ˈkændl/'],
    ['lamp', '台灯', '/læmp/'], ['stamp', '邮票', '/stæmp/'], ['letter', '信/字母', '/ˈletə/'], ['card', '卡片', '/kɑːd/'],
    ['balloon', '气球', '/bəˈluːn/'], ['goose', '鹅', '/ɡuːs/'], ['lamb', '羊羔', '/læm/'], ['puppy', '小狗', '/ˈpʌpi/'],
    ['kitten', '小猫', '/ˈkɪtn/'], ['dolphin', '海豚', '/ˈdɒlfɪn/'], ['whale', '鲸鱼', '/weɪl/'], ['shark', '鲨鱼', '/ʃɑːk/'],
    ['crab', '螃蟹', '/kræb/'], ['spider', '蜘蛛', '/ˈspaɪdə/'], ['butterfly', '蝴蝶', '/ˈbʌtəflaɪ/'], ['snail', '蜗牛', '/sneɪl/'],
    ['hear', '听见', '/hɪə/'], ['feel', '感觉', '/fiːl/'], ['hold', '握住', '/həʊld/'], ['push', '推', '/pʊʃ/'],
    ['pull', '拉', '/pʊl/'], ['wait', '等待', '/weɪt/'], ['need', '需要', '/niːd/'], ['use', '使用', '/juːz/'],
    ['keep', '保持', '/kiːp/'], ['meet', '遇见', '/miːt/'], ['live', '居住', '/lɪv/'], ['pick', '采摘', '/pɪk/'],
    ['count', '数数', '/kaʊnt/'], ['pay', '付款', '/peɪ/'], ['sweet', '甜的', '/swiːt/'], ['sour', '酸的', '/ˈsaʊə/'],
    ['sick', '生病的', '/sɪk/'], ['ready', '准备好的', '/ˈredi/'], ['lovely', '可爱的', '/ˈlʌvli/'], ['lucky', '幸运的', '/ˈlʌki/'],
  ]);
  // Band 2 补充
  add(2, [
    ['neighbor', '邻居', '/ˈneɪbə/'], ['stranger', '陌生人', '/ˈstreɪndʒə/'], ['hero', '英雄', '/ˈhɪərəʊ/'],
    ['king', '国王', '/kɪŋ/'], ['queen', '女王', '/kwiːn/'], ['prince', '王子', '/prɪns/'], ['princess', '公主', '/prɪnˈses/'],
    ['guest', '客人', '/ɡest/'], ['owner', '主人', '/ˈəʊnə/'], ['champion', '冠军', '/ˈtʃæmpiən/'], ['prize', '奖品', '/praɪz/'],
    ['hobby', '爱好', '/ˈhɒbi/'], ['festival', '节日', '/ˈfestɪvl/'], ['ceremony', '仪式', '/ˈserəməni/'], ['habit', '习惯', '/ˈhæbɪt/'],
    ['purpose', '目的', '/ˈpɜːpəs/'], ['effort', '努力', '/ˈefət/'], ['skill', '技能', '/skɪl/'], ['ability', '能力', '/əˈbɪləti/'],
    ['quality', '质量', '/ˈkwɒləti/'], ['quantity', '数量', '/ˈkwɒntəti/'], ['amount', '总量', '/əˈmaʊnt/'],
    ['condition', '条件', '/kənˈdɪʃn/'], ['situation', '情形', '/ˌsɪtʃuˈeɪʃn/'], ['position', '位置', '/pəˈzɪʃn/'],
    ['allow', '允许', '/əˈlaʊ/'], ['avoid', '避免', '/əˈvɔɪd/'], ['prevent', '阻止', '/prɪˈvent/'], ['prefer', '更喜欢', '/prɪˈfɜː/'],
    ['expect', '期望', '/ɪkˈspekt/'], ['consider', '考虑', '/kənˈsɪdə/'], ['realize', '意识到', '/ˈriːəlaɪz/'],
    ['recognize', '认出', '/ˈrekəɡnaɪz/'], ['celebrate', '庆祝', '/ˈselɪbreɪt/'], ['connect', '连接', '/kəˈnekt/'],
    ['support', '支持', '/səˈpɔːt/'], ['normal', '正常的', '/ˈnɔːml/'], ['natural', '自然的', '/ˈnætʃrəl/'],
    ['active', '活跃的', '/ˈæktɪv/'], ['positive', '积极的', '/ˈpɒzətɪv/'], ['negative', '消极的', '/ˈneɡətɪv/'],
    ['simple', '简单的', '/ˈsɪmpl/'], ['public', '公共的', '/ˈpʌblɪk/'], ['main', '主要的', '/meɪn/'], ['perfect', '完美的', '/ˈpɜːfɪkt/'],
  ]);
  // Band 3 补充
  add(3, [
    ['phenomenon', '现象', '/fəˈnɒmɪnən/'], ['hypothesis', '假说', '/haɪˈpɒθəsɪs/'], ['framework', '框架', '/ˈfreɪmwɜːk/'],
    ['mechanism', '机制', '/ˈmekənɪzəm/'], ['dimension', '维度', '/daɪˈmenʃn/'], ['insight', '洞察', '/ˈɪnsaɪt/'],
    ['democracy', '民主', '/dɪˈmɒkrəsi/'], ['undermine', '削弱', '/ˌʌndəˈmaɪn/'], ['advocate', '提倡', '/ˈædvəkeɪt/'],
    ['facilitate', '促进', '/fəˈsɪlɪteɪt/'], ['profound', '深刻的', '/prəˈfaʊnd/'], ['inevitable', '不可避免的', '/ɪnˈevɪtəbl/'],
    ['ambiguous', '模糊的', '/æmˈbɪɡjuəs/'], ['comprehensive', '全面的', '/ˌkɒmprɪˈhensɪv/'], ['subtle', '微妙的', '/ˈsʌtl/'],
    ['arbitrary', '任意的', '/ˈɑːbɪtrəri/'], ['diverse', '多样的', '/daɪˈvɜːs/'], ['dynamic', '动态的', '/daɪˈnæmɪk/'],
  ]);

  window.VOCAB = V;
})();
