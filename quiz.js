/* quiz.js —— 萌消乐 · 英语答题出题纯逻辑（可 Node 单测）
 * -------------------------------------------------------------------------
 * 挂 window.M3Quiz：纯函数 + RNG 注入（确定性可测）。数据来自 window.VOCAB（vocab_en.js）。
 *   bandForLevel(levelNo)              关号 → 难度档（自动模式）
 *   resolveBand(levelNo, mode)         结合设置：'auto' 随关卡，或固定 1/2/3
 *   pickQuestion(band, rng, exclude?)  从该档随机取一词（避开 exclude 单词）
 *   makeChoices(word, rng)             正确释义 + 3 个同档干扰项（释义互不相同），洗牌
 * 出题弹窗与 TTS 见 app.js 的 View.playQuiz / speakEn。
 * classic <script>（非 module，规避 file:// CORS）。
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  function vocab() { return (typeof window !== 'undefined' && window.VOCAB) || []; }

  // 关号 → 难度档（自动模式）：L1–15 小学、L16–30 初中、L31+ 高中/进阶
  function bandForLevel(levelNo) {
    var n = levelNo | 0;
    if (n <= 15) return 1;
    if (n <= 30) return 2;
    return 3;
  }

  // 结合设置：mode 为 'auto'（随关卡）或数字 1/2/3（玩家在设置里固定难度）
  function resolveBand(levelNo, mode) {
    if (mode === 1 || mode === 2 || mode === 3) return mode;
    if (mode === '1' || mode === '2' || mode === '3') return +mode;
    return bandForLevel(levelNo);
  }

  function poolOf(band) {
    var all = vocab(), out = [];
    for (var i = 0; i < all.length; i++) if (all[i].band === band) out.push(all[i]);
    // 兜底：该档为空则退回全表（理论不会发生）
    return out.length ? out : all.slice();
  }

  // 从指定档随机取一词，尽量避开 exclude（上一题单词，防连续重复）
  function pickQuestion(band, rng, exclude) {
    var pool = poolOf(band);
    if (!pool.length) return null;
    var pick = pool[Math.floor(rng() * pool.length) % pool.length];
    if (exclude && pool.length > 1) {
      var guard = 0;
      while (pick && pick.w === exclude && guard++ < 12) {
        pick = pool[Math.floor(rng() * pool.length) % pool.length];
      }
    }
    return pick;
  }

  // Fisher–Yates 洗牌（用注入的 rng，确定性可测）
  function shuffle(arr, rng) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1)) % (i + 1);
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // 正确释义 + 3 个干扰项（同档优先、释义互不相同、不含正确释义），返回 [{zh,correct}]
  function makeChoices(word, rng) {
    var correctZh = word.zh;
    var used = {}; used[correctZh] = 1;
    var opts = [{ zh: correctZh, correct: true }];

    function drawFrom(pool) {
      // 随机遍历顺序，收集释义互不相同的干扰项
      var order = pool.slice();
      shuffle(order, rng);
      for (var i = 0; i < order.length && opts.length < 4; i++) {
        var z = order[i].zh;
        if (used[z]) continue;
        used[z] = 1;
        opts.push({ zh: z, correct: false });
      }
    }
    drawFrom(poolOf(word.band));          // 先同档
    if (opts.length < 4) drawFrom(vocab()); // 不够再全表兜底

    shuffle(opts, rng);
    return opts;
  }

  window.M3Quiz = {
    bandForLevel: bandForLevel,
    resolveBand: resolveBand,
    pickQuestion: pickQuestion,
    makeChoices: makeChoices,
    shuffle: shuffle,
  };
})();
