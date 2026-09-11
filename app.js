/* app.js —— 甜品融合乐 · 网页可玩版（DOM 渲染 + 浏览器门面）
 * -------------------------------------------------------------------------
 * 玩法逻辑一行不写：全部用 window.M3Engine（由 engine.js 从 ../*.ts 机械生成，单一真源）。
 * 本文件只做三件「引擎无关」的事——正是将来 Cocos 侧也要各写一份的部分：
 *   1) 渲染：DOM 网格画 10 族奶茶甜品瓷砖（每族 4 阶）+ 待机小动画（呼吸/摇摆/小跳）；
 *      按控制器发来的 Step 序列「逐层回放」三连融合→升阶/生成核心→下落→补块，画面与引擎零漂移。
 *   2) 门面：浏览器里实现「广告/存档/配置」（localStorage + 假激励视频）。
 *   3) 输入 & 音效：滑动/点两下交换转发给控制器；WebAudio 合成融合音效（升阶升调）。
 *
 * ⚠️ 逻辑只认颜色 0..k-1 与 tier 0..MAXTIER；甜品脸纯是渲染皮。控制器发来 skin[]（颜色→甜品族索引），
 *    这里据此取甜品脸；10 族随难度轮转登场，tier 决定同族第几阶造型，换皮零改玩法。
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';
  const E = window.M3Engine;
  if (!E) { document.body.innerHTML = '<p style="font-family:sans-serif;padding:20px">engine.js 未加载，请先运行 node build.mjs</p>'; return; }
  const { S_NONE, S_STRIPE_H, S_STRIPE_V, S_WRAP, S_COLOR, EMPTY } = E;

  /* ===================== 甜品花名册（10 族 × 4 融合阶，镜像 render/Palette.ts） ===================== */
  // 浏览器不能 import Palette.ts（它 import 'cc'），故这里保留一份等价副本。
  // 只影响外观，不影响逻辑：逻辑只认「颜色 0..k-1」= 甜品族；tier 0..3 = 同族融合阶。
  //   t: [tier0, tier1, tier2, tier3] 四张占位美术（emoji），越并越高阶、越华丽；
  //   hex: 该族主题色（底盘辉光/进度条统一用它，保证同族无论几阶都一眼归属）。
  // 满阶再并 → 彩虹核心（S_COLOR），用 🌈，交换即清整族。加族/换皮零改玩法。
  const DESSERT = [
    { n: '樱桃', hex: 0xff5f70, t: ['🍒', '🍓', '🍰', '🎂'] },
    { n: '蓝莓', hex: 0x6aa8ff, t: ['🫐', '🍇', '🍨', '🥧'] },
    { n: '香橙', hex: 0xffa542, t: ['🍊', '🥭', '🍑', '🧃'] },
    { n: '青提', hex: 0xa6e35f, t: ['🍏', '🥝', '🍈', '🍐'] },
    { n: '葡萄', hex: 0xd07be8, t: ['🍆', '🍭', '🍡', '🍮'] },
    { n: '柠檬', hex: 0xffdf5a, t: ['🍋', '🍯', '🧇', '🥞'] },
    { n: '薄荷', hex: 0x4fe0c0, t: ['🍵', '🥒', '🫒', '🥬'] },
    { n: '草莓', hex: 0xff6f95, t: ['🍫', '🍪', '🍩', '🧁'] },
    { n: '苏打', hex: 0x45cfe6, t: ['🥤', '🧋', '🫧', '🧉'] },
    { n: '芒果', hex: 0xffc94d, t: ['🍍', '🥥', '🌰', '🥜'] },
    { n: '蝶豆', hex: 0x7d8cf5, t: ['🥛', '☕', '🫖', '💧'] },
    { n: '石榴', hex: 0xff6b5c, t: ['🍎', '🍅', '🌶', '🍖'] },
    { n: '抹茶', hex: 0xa9d84f, t: ['🍃', '🥦', '🥗', '🍢'] },
    { n: '蜜桃', hex: 0xffa48a, t: ['🥮', '🍥', '🍘', '🍚'] },
    { n: '海盐', hex: 0x8fbce8, t: ['🧂', '🥨', '🥯', '🫓'] },
    { n: '南瓜', hex: 0xff8f4d, t: ['🎃', '🥐', '🥖', '🍞'] },
    { n: '芋泥', hex: 0xd29ae8, t: ['🍠', '🥔', '🫑', '🧅'] },
    { n: '香蕉', hex: 0xffe66b, t: ['🍌', '🧈', '🧀', '🥚'] },
    { n: '冰蓝', hex: 0x86dcee, t: ['🍦', '🍧', '🧊', '🥟'] },
    { n: '玫瑰', hex: 0xff86c0, t: ['🌹', '🍬', '🍿', '🥠'] },
    { n: '牛油果', hex: 0xa6d150, t: ['🥑', '🫘', '🫛', '🍲'] },
    { n: '焦糖', hex: 0xf7b34e, t: ['🍳', '🥓', '🥩', '🍗'] },
    { n: '湖蓝', hex: 0x52c0ec, t: ['🍜', '🍝', '🍛', '🍤'] },
    { n: '荔枝', hex: 0xff7fa6, t: ['🌸', '🥙', '🌮', '🌯'] },
  ];
  const RSIZE = DESSERT.length; // 24 族
  const MT = (typeof E.MAXTIER === 'number' ? E.MAXTIER : 3); // 融合阶上限（0..MT）
  const famByRoster = (idx) => DESSERT[((idx % RSIZE) + RSIZE) % RSIZE]; // 花名册索引 → 甜品族
  const clampTier = (tier) => Math.max(0, Math.min(MT, tier | 0));

  /* 颜色小工具：主题色 → 底盘立体渐变（亮顶/暗底） */
  function toRgb(hex) { return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]; }
  function css(rgb) { return 'rgb(' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v)))).join(',') + ')'; }
  function lighten(rgb, p) { return rgb.map((v) => v + (255 - v) * p); }
  function darken(rgb, p) { return rgb.map((v) => v * (1 - p)); }

  /* ===================== 设置（localStorage 持久化） ===================== */
  const SET_KEY = 'm3_settings';
  // quiz：网页版「答英语题换提示/助推」总开关（关闭则回退看广告，无答题奖励）
  // engBand：出题难度——'auto' 随关卡，或固定 1 小学 / 2 初中 / 3 高中
  const settings = Object.assign({ sound: true, music: true, highContrast: false, quiz: true, engBand: 'auto' }, load(SET_KEY, {}));
  function saveSettings() { save(SET_KEY, settings); }

  /* ===================== 音效（WebAudio 合成） ===================== */
  const Sfx = (() => {
    let ctx = null;
    function ac() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    function blip(freq, dur, type, vol, slideTo, when) {
      const a = ac(), t0 = when || a.currentTime, o = a.createOscillator(), g = a.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol || 0.2, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    }
    function noise(dur, vol, cutoff, when, hp) {
      const a = ac(), t0 = when || a.currentTime, n = Math.floor(a.sampleRate * dur);
      const buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = a.createBufferSource(); src.buffer = buf;
      const f = a.createBiquadFilter(); f.type = hp ? 'highpass' : 'lowpass'; f.frequency.value = cutoff || 900;
      const g = a.createGain(); g.gain.value = vol || 0.15;
      src.connect(f); f.connect(g); g.connect(a.destination); src.start(t0);
    }
    const gated = (fn) => (...a) => { if (!settings.sound) return; try { fn(...a); } catch (e) {} };
    return {
      unlock() { try { ac(); } catch (e) {} },
      context() { return ac(); }, // 供 BGM 复用同一 AudioContext
      tap: gated(() => blip(880, 0.06, 'triangle', 0.14)),
      select: gated(() => blip(560, 0.1, 'sine', 0.16, 760)),
      swap: gated(() => { const a = ac(); blip(500, 0.09, 'sine', 0.16, 720); blip(720, 0.09, 'sine', 0.14, 560, a.currentTime + 0.05); }),
      invalid: gated(() => { blip(200, 0.12, 'square', 0.12); noise(0.1, 0.06, 700); }),
      // 消除：连锁层级越深，音高越高（半音阶上行，"叮-叮-叮"越来越亮）
      match: gated((chain) => {
        const f = 523 * Math.pow(2, Math.min(12, (chain - 1) * 2) / 12);
        blip(f, 0.16, 'triangle', 0.17, f * 1.5);
      }),
      // 融合升阶：tier 越高起调越亮，上滑「叮↑」表达"并高一阶"；满阶核心=晶亮琶音+气泡噪。
      fuse: gated((isCore, tier) => {
        const a = ac(), t = Math.max(0, Math.min(3, tier | 0));
        if (isCore) { noise(0.22, 0.1, 3200, a.currentTime, true); [880, 1175, 1568, 2093].forEach((f, i) => blip(f, 0.26, 'triangle', 0.13, null, a.currentTime + i * 0.045)); }
        else {
          // 阶越高音越亮越"厚"：阶0单音 → 阶3近核心的晶亮小琶音
          const base = 620 * Math.pow(2, t * 2 / 12);
          blip(base, 0.14, 'sine', 0.16, base * 1.6);
          if (t >= 1) blip(base * 1.5, 0.16, 'triangle', 0.12, null, a.currentTime + 0.05);
          if (t >= 2) blip(base * 2, 0.18, 'triangle', 0.11, null, a.currentTime + 0.1);
          if (t >= 3) { noise(0.14, 0.08, 3000, a.currentTime, true); blip(base * 2.5, 0.2, 'sine', 0.1, null, a.currentTime + 0.14); }
        }
      }),
      special: gated(() => { const a = ac(); noise(0.18, 0.12, 2600, a.currentTime, true); blip(760, 0.22, 'sawtooth', 0.12, 180); }),
      colorbomb: gated(() => { const a = ac(); [660, 880, 1175, 1568].forEach((f, i) => blip(f, 0.2, 'triangle', 0.13, null, a.currentTime + i * 0.05)); }),
      combo: gated(() => { const a = ac(); [784, 988, 1319].forEach((f, i) => blip(f, 0.24, 'sine', 0.15, null, a.currentTime + i * 0.05)); }),
      shuffle: gated(() => { const a = ac(); noise(0.4, 0.1, 1400); blip(400, 0.3, 'sine', 0.12, 800); }),
      booster: gated(() => { const a = ac(); [523, 784, 1047].forEach((f, i) => blip(f, 0.2, 'triangle', 0.15, null, a.currentTime + i * 0.06)); }),
      win: gated(() => { const a = ac(); [523, 659, 784, 1047].forEach((f, i) => blip(f, 0.5, 'sine', 0.16, null, a.currentTime + i * 0.09)); blip(1319, 0.6, 'triangle', 0.14, null, a.currentTime + 0.4); }),
      fail: gated(() => { const a = ac(); [440, 370, 294].forEach((f, i) => blip(f, 0.4, 'sine', 0.15, null, a.currentTime + i * 0.14)); }),
      star: gated(() => blip(1568, 0.4, 'triangle', 0.16)),
    };
  })();

  /* ===================== 英文发音 TTS（SpeechSynthesis） ===================== */
  // gated on settings.sound：挑英文语音，异步语音表加载后缓存；无语音则静默（音标+释义仍在）。
  const Voice = (() => {
    function synth() { return (typeof window !== 'undefined' && window.speechSynthesis) || null; }
    let voice = null, bound = false;
    function pick() {
      const s = synth(); if (!s) return null;
      const list = s.getVoices(); if (!list || !list.length) return null;
      const prefer = ['Samantha', 'Karen', 'Moira', 'Daniel', 'Google US English', 'Microsoft Aria Online (Natural) - English (United States)', 'Microsoft Zira', 'Alex'];
      for (let i = 0; i < prefer.length; i++) { const v = list.find((x) => x.name === prefer[i] && /en/i.test(x.lang)); if (v) return v; }
      return list.find((x) => /en[-_]?US/i.test(x.lang)) || list.find((x) => /^en/i.test(x.lang)) || null;
    }
    function ensure() {
      const s = synth(); if (!s) return;
      if (!voice) voice = pick();
      if (!bound) { bound = true; try { s.onvoiceschanged = () => { voice = pick(); }; } catch (e) {} }
    }
    ensure();
    return {
      warmup() { ensure(); },
      speak(word) {
        if (!settings.sound) return;
        const s = synth(); if (!s || !word) return;
        try {
          s.cancel();
          const u = new SpeechSynthesisUtterance(String(word));
          u.lang = 'en-US'; if (!voice) voice = pick(); if (voice) u.voice = voice;
          u.rate = 0.9; u.pitch = 1.05; u.volume = 1;
          s.speak(u);
        } catch (e) {}
      },
    };
  })();

  /* ===================== 轻快背景音乐（WebAudio 程序化合成） ===================== */
  // 零素材、离线；接 settings.music 开关；首次手势解锁后可播；关卡加载时启动。
  // 大调活泼小循环：柱式和弦 pad + 跳音主旋律 + 低音 + 轻打点，音量压低作背景。
  const Music = (() => {
    // 音名 → 频率（十二平均律，A4=440）——竞品对标 Candy Crush（明亮拨弦/木琴音色 + 有色和弦）
    const F = {
      0: 0,
      C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    };
    // 8 小节前后两句循环（不再 4 小节死循环）：C - G/B - Am - Em - F - C/E - Dm - G
    // 低音线级进下行 C-B-A-G-F-E-D-G，行进/推进感强（对标 Toon Blast 进行曲式律动）
    // 主旋律：每小节 8 个八分音符，'0'=休止；隔句切分错位，跳音更俏皮
    const MEL = [
      'E4','G4', 0 ,'C5', 0 ,'G4','E4', 0 ,
       0 ,'D5','B4', 0 ,'G4', 0 ,'B4','D5',
      'C5','A4', 0 ,'E4', 0 ,'A4','C5', 0 ,
       0 ,'B4','G4', 0 ,'E4', 0 ,'G4','B4',
      'A4','C5', 0 ,'A4', 0 ,'F4','A4', 0 ,
       0 ,'G4','E4', 0 ,'C5', 0 ,'E4','G4',
      'F4','A4', 0 ,'D5', 0 ,'A4','F4', 0 ,
      'D5', 0 ,'B4','G4', 0 ,'D5','B4', 0 ,
    ];
    // 每小节和弦音（pad 铺底 + 分解拨弦），三和弦
    const CHORD = [
      ['C4','E4','G4'], ['G3','B3','D4'], ['A3','C4','E4'], ['E3','G3','B3'],
      ['F3','A3','C4'], ['C4','E4','G4'], ['D3','F3','A3'], ['G3','B3','D4'],
    ];
    // 每小节低音：根音（级进下行线）+ 五音，均为和弦音
    const ROOT  = ['C2','B2','A2','G2','F2','E2','D2','G2'];
    const FIFTH = ['G2','D3','E3','B2','C3','G2','A2','D3'];
    const bpm = 125, eighth = 60 / bpm / 2, SPB = 8, STEPS = MEL.length; // 8 小节 × 8 = 64 个八分音符
    let playing = false, timer = null, next = 0, step = 0, master = null, noiseBuf = null;

    function gain() {
      const a = Sfx.context();
      if (!master) { master = a.createGain(); master.gain.value = 0.16; master.connect(a.destination); }
      return master;
    }
    function tone(freq, t0, dur, type, vol) {
      if (!freq) return;
      const a = Sfx.context(), o = a.createOscillator(), g = a.createGain();
      o.type = type || 'triangle'; o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0006, t0 + dur);
      o.connect(g); g.connect(gain()); o.start(t0); o.stop(t0 + dur + 0.02);
    }
    // —— 轻量鼓组（零素材）——
    function noise() {
      const a = Sfx.context();
      if (!noiseBuf) {
        const n = Math.floor(a.sampleRate * 0.3), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
        for (let k = 0; k < n; k++) d[k] = Math.random() * 2 - 1;
        noiseBuf = b;
      }
      const s = a.createBufferSource(); s.buffer = noiseBuf; return s;
    }
    function kick(t) {
      const a = Sfx.context(), o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.11);
      g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.16);
      o.connect(g); g.connect(gain()); o.start(t); o.stop(t + 0.18);
    }
    function hat(t, open) {
      const a = Sfx.context(), s = noise(), f = a.createBiquadFilter(), g = a.createGain(), dur = open ? 0.08 : 0.03;
      f.type = 'highpass'; f.frequency.value = 7500;
      g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
      s.connect(f); f.connect(g); g.connect(gain()); s.start(t); s.stop(t + dur + 0.02);
    }
    function snare(t) {
      const a = Sfx.context(), s = noise(), f = a.createBiquadFilter(), g = a.createGain();
      f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.8;
      g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.0006, t + 0.13);
      s.connect(f); f.connect(g); g.connect(gain()); s.start(t); s.stop(t + 0.15);
      tone(190, t, 0.07, 'triangle', 0.14); // 一点体感
    }
    // 明亮拨弦主音（body 三角 + 八度上短促方波亮点 ≈ 木琴/拨弦质感）
    function lead(freq, t) {
      if (!freq) return;
      tone(freq, t, eighth * 0.9, 'triangle', 0.5);
      tone(freq * 2, t, eighth * 0.28, 'square', 0.045);
    }
    function scheduleStep(i, t) {
      const bar = Math.floor(i / SPB), pos = i % SPB, ch = CHORD[bar];
      lead(F[MEL[i]], t);                                                  // 主旋律（明亮拨弦）
      if (pos === 0) for (let k = 0; k < ch.length; k++) tone(F[ch[k]], t, eighth * SPB * 0.96, 'sine', 0.09); // pad 铺底
      if (pos % 2 === 1) tone(F[ch[(pos >> 1) % ch.length]] * 2, t, eighth * 0.5, 'triangle', 0.07);           // 分解拨弦填空
      if (pos === 0) tone(F[ROOT[bar]], t, eighth * 1.8, 'sine', 0.55);    // 低音根音
      else if (pos === 3) tone(F[ROOT[bar]], t, eighth * 0.9, 'sine', 0.30);
      else if (pos === 4) tone(F[FIFTH[bar]], t, eighth * 1.8, 'sine', 0.5);
      if (pos === 0 || pos === 4) kick(t);                                 // 底鼓 1/3 拍
      if (pos === 2 || pos === 6) snare(t);                                // 军鼓 backbeat（行进感）
      if (pos % 2 === 1) hat(t, pos === 7);                                // 八分踩镲
    }
    function scheduler() {
      const a = Sfx.context();
      while (next < a.currentTime + 0.2) {
        scheduleStep(step, next);
        next += eighth; step = (step + 1) % STEPS;
      }
    }
    function start() {
      if (playing || !settings.music) return;
      try { const a = Sfx.context(); playing = true; step = 0; next = a.currentTime + 0.12; timer = setInterval(scheduler, 25); } catch (e) { playing = false; }
    }
    function stop() { playing = false; if (timer) { clearInterval(timer); timer = null; } }
    return { start, stop, toggle(on) { if (on) start(); else stop(); }, get playing() { return playing; } };
  })();

  /* ===================== 平台门面（注入控制器的依赖） ===================== */
  const PROG_KEY = 'm3_progress';
  const prog = Object.assign({ current: 1, stars: {} }, load(PROG_KEY, {}));
  const levelSystem = {
    get current() { return prog.current; },
    getStars(l) { return prog.stars[l] || 0; },
    complete(l, stars) {
      prog.stars[l] = Math.max(prog.stars[l] || 0, stars);
      if (l >= prog.current) prog.current = l + 1;
      save(PROG_KEY, prog); return true;
    },
  };
  function totalStars() { let s = 0; for (const k in prog.stars) s += prog.stars[k]; return s; }

  const handlers = {};
  const on = (ev, fn) => (handlers[ev] = fn);
  const deps = {
    bands: E.BANDS,
    level: levelSystem,
    emit: (ev, data) => { const h = handlers[ev]; if (h) h(data || {}); },
    track: () => {},
    // 门面：网页版把 hint/booster 解锁点改成「答英语题」（设置可关，关则回退看广告）。
    // revive/double 等仍走广告；答对 resolve(true) = 看完广告发奖，控制器完全不知情 → 双端零漂移。
    showAd: (placement) => {
      if ((placement === 'hint' || placement === 'booster') && settings.quiz && window.M3Quiz && window.VOCAB && window.VOCAB.length)
        return View.playQuiz(placement);
      return View.playFakeAd(placement);
    },
  };
  const ctrl = new E.Match3Controller(deps);

  /* ===================== 视图 ===================== */
  const View = (() => {
    const phone = document.getElementById('phone');
    const board = document.getElementById('board');
    const pill = document.getElementById('pill-level');
    const goalBox = document.getElementById('goal');
    const goalIc = document.getElementById('goal-ic');
    const goalLabel = document.getElementById('goal-label');
    const goalFill = document.getElementById('goal-fill');
    const goalNum = document.getElementById('goal-num');
    const movesBox = document.getElementById('moves');
    const movesN = document.getElementById('moves-n');
    const boosterBtn = document.getElementById('fab-booster');

    /* 背景装饰：上升气泡 + 闪烁星光（纯 CSS 动画） */
    (function decorateBg() {
      const wrap = document.getElementById('bubbles'); if (!wrap) return;
      const rnd = (a, b, seed) => a + (((Math.sin(seed * 12.9898) * 43758.5453) % 1 + 1) % 1) * (b - a);
      for (let k = 0; k < 11; k++) {
        const el = document.createElement('div'); el.className = 'bub';
        const size = rnd(8, 22, k + 1), x = rnd(3, 92, k + 7), dur = rnd(7, 15, k + 3), delay = rnd(0, 10, k + 5), drift = rnd(-22, 22, k + 11);
        el.style.width = size.toFixed(0) + 'px'; el.style.height = size.toFixed(0) + 'px'; el.style.left = x.toFixed(1) + '%';
        el.style.animationDuration = dur.toFixed(1) + 's'; el.style.animationDelay = (-delay).toFixed(1) + 's';
        el.style.setProperty('--drift', drift.toFixed(0) + 'px'); wrap.appendChild(el);
      }
      const stars = ['✦', '✧', '⭐', '✨', '·'];
      for (let k = 0; k < 9; k++) {
        const el = document.createElement('div'); el.className = 'twk';
        const x = rnd(5, 92, k + 2), y = rnd(5, 62, k + 4), sz = rnd(9, 16, k + 6), dur = rnd(2, 5, k + 8), delay = rnd(0, 4, k + 9);
        el.style.left = x.toFixed(1) + '%'; el.style.top = y.toFixed(1) + '%'; el.style.fontSize = sz.toFixed(0) + 'px';
        el.style.animationDuration = dur.toFixed(1) + 's'; el.style.animationDelay = (-delay).toFixed(1) + 's';
        el.textContent = stars[k % stars.length]; wrap.appendChild(el);
      }
    })();

    /* ---------- 局面状态 ---------- */
    let rows = 8, cols = 8, cell = 40;
    let skin = [];            // 颜色索引 → 花名册索引
    const fam = (color) => famByRoster(skin[color]); // 颜色 → 甜品族（经 skin 映射）
    let levelNo = 1;
    let goal = { type: 'score' }, cur = { current: 0, target: 1 }, movesLeft = 0, score = 0;
    let M = [];               // M[r][c] = {el,plate,face,color,special} | null
    let jellyEls = [];        // jellyEls[r][c] = 果冻覆盖层 | null
    let jellyLayer = [];      // 剩余层数
    let busy = false;         // 动画/广告/弹窗期间禁输入
    let pendingEnd = null;    // 待动画结束后再弹的胜/负

    /* ---------- 几何布局（按屏幕自适应，格数变了也不出屏） ---------- */
    function relayout() {
      const availW = (board.parentElement.clientWidth || 320) - 14;
      const availH = (board.parentElement.clientHeight || 400) - 14;
      cell = Math.floor(Math.min(availW / cols, availH / rows));
      cell = Math.max(28, cell);
      board.style.setProperty('--cell', cell + 'px');
      board.style.setProperty('--pad', '0px');
      board.style.width = cell * cols + 'px';
      board.style.height = cell * rows + 'px';
    }
    function position(el, r, c) { el.style.transform = 'translate(' + (c * cell) + 'px,' + (r * cell) + 'px)'; }

    /* ---------- 特殊块图标（内联 SVG，语义一眼可懂；随格子缩放） ---------- */
    // 条纹=方向双箭头（消整行/整列）、包装=炸弹（炸 3×3）、彩球=彩虹球+星芒（消全场同色）。
    const ICON = {
      rowH: '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="20" x2="31" y2="20"/><polyline points="15,13 8,20 15,27"/><polyline points="25,13 32,20 25,27"/></g></svg>',
      colV: '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="9" x2="20" y2="31"/><polyline points="13,15 20,8 27,15"/><polyline points="13,25 20,32 27,25"/></g></svg>',
      bomb: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="18" cy="24" r="10.5" fill="#20203a" stroke="#fff" stroke-width="2.4"/><circle cx="14.5" cy="20.5" r="3" fill="#fff" opacity="0.55"/><rect x="20.5" y="9.5" width="5" height="6" rx="1.6" fill="#8a8aa5"/><path d="M25 10 q4.5 -4 8.5 -1.5" fill="none" stroke="#ffce54" stroke-width="2.6" stroke-linecap="round"/><g stroke="#ffd34d" stroke-width="2.1" stroke-linecap="round"><line x1="34" y1="6.5" x2="34" y2="2.5"/><line x1="37" y1="8.5" x2="39.5" y2="6.5"/><line x1="31" y1="8.5" x2="28.5" y2="6.5"/></g></svg>',
      rainbow: '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke-width="3" stroke-linecap="round"><path d="M8 26 a12 12 0 0 1 24 0" stroke="#ff5b6e"/><path d="M12 26 a8 8 0 0 1 16 0" stroke="#ffd34d"/><path d="M16 26 a4 4 0 0 1 8 0" stroke="#3fd68c"/></g><g fill="#fff"><path d="M20 6 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4z"/></g></svg>',
    };
    function addSpIcon(plate, svg) { const d = document.createElement('div'); d.className = 'sp-ic'; d.innerHTML = svg; plate.appendChild(d); }

    // 特殊块首次登场时给一句作用说明（每种只提示一次，存 localStorage）
    const SEEN_SP_KEY = 'm3_seen_sp';
    let seenSp = load(SEEN_SP_KEY, {});
    const SP_TIP = {};
    SP_TIP[S_STRIPE_H] = '↔ 条纹块：消掉一整行！';
    SP_TIP[S_STRIPE_V] = '↕ 条纹块：消掉一整列！';
    SP_TIP[S_WRAP] = '💣 包装块：炸掉周围 3×3！';
    SP_TIP[S_COLOR] = '🌈 满阶彩虹核心：交换即清掉全场同一种甜品！';
    function maybeExplain(special) {
      if (!special || special === S_NONE) return;
      const tip = SP_TIP[special]; if (!tip || seenSp[special]) return;
      seenSp[special] = 1; save(SEEN_SP_KEY, seenSp);
      setTimeout(() => toast(tip), 240);
    }

    /* ---------- 瓷砖工厂（融合：按 (甜品族, tier) 取占位美术） ---------- */
    function faceFor(color, special, tier) {
      if (special === S_COLOR || color < 0) return '🌈';
      return fam(color).t[clampTier(tier)];
    }
    function tintPlate(plate, color, special, tier) {
      if (special === S_COLOR || color < 0) { plate.style.removeProperty('--tint'); return; }
      const rgb = toRgb(fam(color).hex);
      const t = clampTier(tier);
      // 阶越高底盘越亮、辉光越强：低阶柔和奶油底，高阶发光糖霜感
      plate.style.setProperty('--tint', css(rgb));
      plate.style.setProperty('--tint-l', css(lighten(rgb, 0.30 + 0.06 * t)));
      plate.style.setProperty('--tint-d', css(darken(rgb, 0.28 - 0.03 * t)));
      plate.style.setProperty('--glow', css(lighten(rgb, 0.15)));
      plate.style.setProperty('--tglow', (0.12 + 0.16 * t).toFixed(2)); // 辉光强度随阶
    }
    // tier 阶级视觉：金属阶框(铜→银→金) + 尺寸递增 + 星角标 + 满阶皇冠。
    // 阶框/尺寸由 CSS 的 .t0..t3 类驱动；这里管星角标(⭐×阶)与满阶皇冠(👑)。核心不显阶。
    function tierClass(plate, color, special, tier) {
      plate.classList.remove('t0', 't1', 't2', 't3', 'tmax');
      let badge = plate.querySelector('.tier-badge');
      let crown = plate.querySelector('.tier-crown');
      if (special === S_COLOR || color < 0) { if (badge) badge.remove(); if (crown) crown.remove(); return; }
      const t = clampTier(tier);
      plate.classList.add('t' + t);
      if (t >= MT) plate.classList.add('tmax');
      // 星角标：阶0=无(最朴素)，阶1→⭐ 阶2→⭐⭐ 阶3→⭐⭐⭐
      if (t >= 1) {
        if (!badge) { badge = document.createElement('div'); badge.className = 'tier-badge'; plate.appendChild(badge); }
        badge.textContent = '⭐'.repeat(t);
      } else if (badge) { badge.remove(); }
      // 满阶皇冠：戴在头顶，暗示"再并一次出彩虹核心"
      if (t >= MT) {
        if (!crown) { crown = document.createElement('div'); crown.className = 'tier-crown'; crown.textContent = '👑'; plate.appendChild(crown); }
      } else if (crown) { crown.remove(); }
    }
    function specialClass(plate, special) {
      plate.classList.remove('sp-stripeH', 'sp-stripeV', 'sp-wrap', 'sp-color');
      const old = plate.querySelector('.sp-ic'); if (old) old.remove();
      if (special === S_STRIPE_H) { plate.classList.add('sp-stripeH'); addSpIcon(plate, ICON.rowH); }
      else if (special === S_STRIPE_V) { plate.classList.add('sp-stripeV'); addSpIcon(plate, ICON.colV); }
      else if (special === S_WRAP) { plate.classList.add('sp-wrap'); addSpIcon(plate, ICON.bomb); }
      else if (special === S_COLOR) { plate.classList.add('sp-color'); addSpIcon(plate, ICON.rainbow); }
    }
    function makeTile(color, special, tier) {
      tier = tier | 0;
      const el = document.createElement('div'); el.className = 'tile';
      const plate = document.createElement('div'); plate.className = 'plate';
      const face = document.createElement('div'); face.className = 'face';
      face.textContent = faceFor(color, special, tier);
      face.style.setProperty('--idle', (2.6 + Math.random() * 1.9).toFixed(2) + 's');
      face.style.setProperty('--iddelay', (-Math.random() * 3).toFixed(2) + 's');
      tintPlate(plate, color, special, tier); specialClass(plate, special); tierClass(plate, color, special, tier);
      plate.appendChild(face); el.appendChild(plate); board.appendChild(el);
      return { el, plate, face, color, special, tier };
    }
    function retint(o) {
      o.face.textContent = faceFor(o.color, o.special, o.tier);
      tintPlate(o.plate, o.color, o.special, o.tier); specialClass(o.plate, o.special); tierClass(o.plate, o.color, o.special, o.tier);
    }

    /* ---------- 全量构建（关卡装载 / 复活 / 洗牌重建） ---------- */
    function buildBoard(grid, blockers, animate) {
      board.innerHTML = '';
      M = mk2(rows, cols, null); jellyEls = mk2(rows, cols, null); jellyLayer = mk2(rows, cols, 0);
      // 底纹坑位（棋盘格深浅相间）
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const bg = document.createElement('div'); bg.className = 'cellbg' + ((r + c) % 2 ? ' alt' : '');
        bg.style.width = cell + 'px'; bg.style.height = cell + 'px'; position(bg, r, c); board.appendChild(bg);
      }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const g = grid[r][c]; const o = makeTile(g.color, g.special, g.tier);
        M[r][c] = o;
        if (animate) { position(o.el, r - rows - 1, c); o.el.getBoundingClientRect(); o.el.classList.add('falling'); requestAnimationFrame(() => position(o.el, r, c)); }
        else position(o.el, r, c);
        const layers = (blockers && blockers[r] && blockers[r][c]) || 0;
        if (layers > 0) setJelly(r, c, layers);
      }
    }
    function setJelly(r, c, layers) {
      jellyLayer[r][c] = layers;
      let j = jellyEls[r][c];
      if (!j) { j = document.createElement('div'); j.className = 'jelly'; j.style.width = cell + 'px'; j.style.height = cell + 'px'; position(j, r, c); board.appendChild(j); jellyEls[r][c] = j; }
      j.classList.toggle('l2', layers >= 2);
    }
    function reduceJelly(r, c) {
      if (jellyLayer[r][c] <= 0) return;
      jellyLayer[r][c]--;
      const j = jellyEls[r][c]; if (!j) return;
      if (jellyLayer[r][c] <= 0) { j.classList.add('gone'); j.style.transition = 'opacity .3s'; j.style.opacity = '0'; setTimeout(() => j.remove && j.remove(), 320); jellyEls[r][c] = null; }
      else j.classList.toggle('l2', jellyLayer[r][c] >= 2);
    }

    /* ---------- Step 逐层回放：消除→生成特殊块→下落→补块 ---------- */
    function playSteps(steps, ctx, swapCoords) {
      busy = true;
      let t = 0;
      const STEP = 480;
      // 先播「两块交换」（彩球激活不实际交换，跳过以免错位）
      if (swapCoords) {
        const a = M[swapCoords.r1][swapCoords.c1], b = M[swapCoords.r2][swapCoords.c2];
        const isColorBomb = (a && a.special === S_COLOR) || (b && b.special === S_COLOR);
        if (!isColorBomb && a && b) {
          a.el.classList.add('falling'); b.el.classList.add('falling');
          position(a.el, swapCoords.r2, swapCoords.c2); position(b.el, swapCoords.r1, swapCoords.c1);
          M[swapCoords.r1][swapCoords.c1] = b; M[swapCoords.r2][swapCoords.c2] = a;
          Sfx.swap();
          t = 240;
        }
      }
      for (const step of steps) {
        const t0 = t;
        setTimeout(() => stepClear(step), t0);
        setTimeout(() => stepSpawn(step), t0 + 150);
        setTimeout(() => stepFall(step), t0 + 250);
        t += STEP;
      }
      setTimeout(() => { reconcile(ctx.grid, ctx.blockers); finishTurn(ctx); }, t + 340);
    }
    function stepClear(step) {
      // 激活既有特殊块的光效
      for (const f of step.fired) fireFX(f.r, f.c, f.special);
      if (step.fired.length) Sfx.special();
      // 消除弹裂
      let sr = 0, sc = 0, n = 0;
      for (const p of step.cleared) {
        const o = M[p.r][p.c];
        if (o && o.el) { o.el.classList.add('pop'); const el = o.el; setTimeout(() => el.remove && el.remove(), 300); }
        M[p.r][p.c] = null; sr += p.r; sc += p.c; n++;
      }
      for (const p of step.blockerCleared) reduceJelly(p.r, p.c);
      if (step.fired.some((f) => f.special === S_COLOR)) Sfx.colorbomb(); else Sfx.match(step.chain);
      if (n) floatScore(sr / n, sc / n, '+' + step.gained);
      if (step.chain >= 2) comboBanner(step.chain);
    }
    function stepSpawn(step) {
      for (const sp of step.spawned) {
        let o = M[sp.r][sp.c];
        if (!o) { o = makeTile(sp.color, sp.special, sp.tier); position(o.el, sp.r, sp.c); M[sp.r][sp.c] = o; }
        o.color = sp.color; o.special = sp.special; o.tier = sp.tier | 0; retint(o);
        const isCore = sp.special === S_COLOR;
        // 融合升阶：幸存格「并阶」弹跳 + 辉光闪；满阶造核心：彩虹迸发
        o.plate.classList.remove('fuse', 'fuse-core'); void o.plate.offsetWidth;
        const fcls = isCore ? 'fuse-core' : 'fuse';
        o.plate.classList.add(fcls);
        (function (pl) { setTimeout(() => pl.classList.remove(fcls), 640); })(o.plate);
        fuseBurst(sp.r, sp.c, isCore, o.tier);
        Sfx.fuse ? Sfx.fuse(isCore, o.tier) : null;
        maybeExplain(sp.special); // 核心首次登场解释一次
      }
    }
    function stepFall(step) {
      // 先读出全部位移，清空源格，再落定目标格（源∩目标为空，安全）
      const moves = [];
      for (const f of step.fallen) { const o = M[f.from.r][f.from.c]; if (o) moves.push({ o, to: f.to }); M[f.from.r][f.from.c] = null; }
      for (const m of moves) { M[m.to.r][m.to.c] = m.o; m.o.el.classList.add('falling'); position(m.o.el, m.to.r, m.to.c); }
      // 顶部补入新块（从盘外落入）
      for (const rf of step.refilled) {
        const o = makeTile(rf.color, S_NONE, 0); // 新补块永远从最低阶落入
        position(o.el, rf.r - rows, rf.c); o.el.getBoundingClientRect();
        o.el.classList.add('falling'); position(o.el, rf.r, rf.c);
        M[rf.r][rf.c] = o;
      }
    }
    // 兜底对账：把 M 校正到引擎最终盘面（deltas 正确时为无操作，异常时静默修复）
    function reconcile(grid, blockers) {
      const alive = new Set();
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const g = grid[r][c]; let o = M[r][c];
        if (!o) { o = makeTile(g.color, g.special, g.tier); M[r][c] = o; }
        else if (o.color !== g.color || o.special !== g.special || o.tier !== (g.tier | 0)) { o.color = g.color; o.special = g.special; o.tier = g.tier | 0; retint(o); }
        o.el.classList.remove('pop');
        position(o.el, r, c); alive.add(o.el);
      }
      // 清掉游离瓷砖（非当前 M 引用且未在消除动画中的）
      board.querySelectorAll('.tile').forEach((el) => { if (!alive.has(el) && !el.classList.contains('pop')) el.remove(); });
      if (blockers) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const want = (blockers[r] && blockers[r][c]) || 0;
        if (want !== jellyLayer[r][c]) { if (want > 0) setJelly(r, c, want); else if (jellyEls[r][c]) { jellyEls[r][c].remove(); jellyEls[r][c] = null; jellyLayer[r][c] = 0; } }
      }
    }

    function finishTurn(ctx) {
      movesLeft = ctx.movesLeft; score = ctx.score; cur = ctx.progress; updateHUD();
      busy = false;
      if (ctx.reshuffled) toast('🔀 没招啦，帮你洗牌');
      if (pendingEnd) { const p = pendingEnd; pendingEnd = null; if (p.type === 'win') showWin(p.data); else showFail(p.data); }
    }

    /* ---------- 特效 ---------- */
    function px(r, c) { return { x: c * cell + cell / 2, y: r * cell + cell / 2 }; }
    function fireFX(r, c, special) {
      const p = px(r, c);
      if (special === S_STRIPE_H || special === S_STRIPE_V) {
        const beam = document.createElement('div'); beam.className = 'beam';
        if (special === S_STRIPE_H) { beam.style.left = '0'; beam.style.width = board.style.width; beam.style.top = (r * cell + cell * 0.3) + 'px'; beam.style.height = (cell * 0.4) + 'px'; }
        else { beam.style.top = '0'; beam.style.height = board.style.height; beam.style.left = (c * cell + cell * 0.3) + 'px'; beam.style.width = (cell * 0.4) + 'px'; }
        board.appendChild(beam); setTimeout(() => beam.remove(), 340);
      } else {
        const b = document.createElement('div'); b.className = 'blast';
        b.style.left = (p.x) + 'px'; b.style.top = (p.y) + 'px'; b.style.setProperty('--d', (cell * 2.6) + 'px');
        board.appendChild(b); setTimeout(() => b.remove(), 400);
      }
    }
    function floatScore(r, c, txt) {
      const p = px(r, c); const d = document.createElement('div'); d.className = 'floatn';
      d.textContent = txt; d.style.left = p.x + 'px'; d.style.top = p.y + 'px'; d.style.fontSize = Math.round(cell * 0.42) + 'px';
      board.appendChild(d); setTimeout(() => d.remove(), 1000);
    }
    function sparkle(r, c, count, distScale, glyph) {
      const p = px(r, c);
      count = count || 6; distScale = distScale || 1; glyph = glyph || '✦';
      for (let k = 0; k < count; k++) {
        const s = document.createElement('div'); s.className = 'spark'; s.textContent = glyph;
        s.style.left = p.x + 'px'; s.style.top = p.y + 'px';
        const ang = (k / count) * Math.PI * 2 + (count % 2 ? 0.3 : 0), dist = cell * 0.9 * distScale;
        board.appendChild(s);
        try {
          const an = s.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(ang) * dist + 'px),calc(-50% + ' + Math.sin(ang) * dist + 'px)) scale(1.1)', opacity: 0 }], { duration: 460, easing: 'ease-out', fill: 'forwards' });
          an.onfinish = () => s.remove();
        } catch (e) { setTimeout(() => s.remove(), 480); }
      }
    }
    // 局部彩色迸发（满阶/核心专用，比全屏 confetti 更聚焦在融合格）
    function fuseConfetti(r, c, big) {
      const p = px(r, c);
      const cols = ['#ff5d73', '#ffb01f', '#ffe24a', '#6bd07a', '#4d96ff', '#9b5de5', '#3ec9c3', '#ff8fc7'];
      const n = big ? 16 : 10;
      for (let k = 0; k < n; k++) {
        const d = document.createElement('div'); d.className = 'fuse-confetti';
        d.style.left = p.x + 'px'; d.style.top = p.y + 'px'; d.style.background = cols[k % cols.length];
        board.appendChild(d);
        const ang = (k / n) * Math.PI * 2 + Math.cos(k * 2.3), dist = cell * (big ? 1.7 : 1.15);
        const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist + cell * 0.5;
        (function (el) {
          try {
            const an = el.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(.4) rotate(' + (180 + k * 40) + 'deg)', opacity: 0 }], { duration: 640, easing: 'ease-out', fill: 'forwards' });
            an.onfinish = () => el.remove();
          } catch (e) { setTimeout(() => el.remove(), 660); }
        })(d);
      }
    }
    // 融合迸发：升阶=同族主题色的糖霜光环 + 上浮「↑」；满阶核心=彩虹迸发环
    // 融合迸发：阶越高越绚丽——冲击环更大更亮、叠环、星火更多、满阶/核心加彩色迸发。
    function fuseBurst(r, c, isCore, tier) {
      const p = px(r, c);
      const t = clampTier(tier);
      const TMETAL = ['#ffffff', '#e6a765', '#e9eef6', '#ffd447']; // 阶0白 / 阶1铜 / 阶2银 / 阶3金
      const rings = isCore ? 2 : (t >= 2 ? 2 : 1);        // 高阶/核心叠冲击环
      const maxScale = isCore ? 2.3 : (1.35 + 0.3 * t);   // 越高阶冲击环铺得越开
      for (let ri = 0; ri < rings; ri++) {
        const ring = document.createElement('div'); ring.className = 'fuse-ring' + (isCore ? ' core' : '');
        ring.style.left = p.x + 'px'; ring.style.top = p.y + 'px';
        ring.style.width = ring.style.height = Math.round(cell * (0.85 + 0.12 * t)) + 'px';
        if (!isCore) { ring.style.borderColor = TMETAL[t]; ring.style.boxShadow = '0 0 ' + (12 + 6 * t) + 'px ' + (3 + t) + 'px ' + TMETAL[t]; }
        board.appendChild(ring);
        const sc = maxScale * (1 - ri * 0.25), dl = ri * 90;
        (function (rg) {
          try { const an = rg.animate([{ transform: 'translate(-50%,-50%) scale(.35)', opacity: .95 }, { transform: 'translate(-50%,-50%) scale(' + sc + ')', opacity: 0 }], { duration: 520 + 120 * t, delay: dl, easing: 'ease-out', fill: 'forwards' }); an.onfinish = () => rg.remove(); } catch (e) { setTimeout(() => rg.remove(), 760 + dl); }
        })(ring);
      }
      // 升阶符号：阶越高越华丽（↑ → ⤴ → ✦ → 🌟；核心=★）
      const UPSYM = ['↑', '⤴', '✦', '🌟'];
      const up = document.createElement('div'); up.className = 'fuse-up'; up.textContent = isCore ? '★' : UPSYM[t];
      up.style.left = p.x + 'px'; up.style.top = p.y + 'px'; up.style.fontSize = Math.round(cell * (0.44 + 0.08 * t)) + 'px';
      board.appendChild(up);
      try { const an = up.animate([{ transform: 'translate(-50%,-40%) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-90%) scale(1.15)', opacity: 1, offset: .4 }, { transform: 'translate(-50%,-150%) scale(1)', opacity: 0 }], { duration: 680, easing: 'ease-out', fill: 'forwards' }); an.onfinish = () => up.remove(); } catch (e) { setTimeout(() => up.remove(), 700); }
      // 星火数量随阶递增；满阶加局部彩色迸发；核心最盛（双圈星火 + 大迸发）
      sparkle(r, c, 6 + t * 3, 1 + 0.15 * t);
      if (isCore) { sparkle(r, c, 10, 1.5, '✧'); fuseConfetti(r, c, true); }
      else if (t >= MT) { fuseConfetti(r, c, false); }
    }
    function comboBanner(chain) {
      const words = ['', '', '好！', '赞！', '超赞！', '神连击！'];
      const b = document.createElement('div'); b.className = 'combo-banner';
      b.textContent = (words[Math.min(chain, 5)] || '神连击！') + ' ×' + chain;
      board.appendChild(b); setTimeout(() => b.remove(), 900);
      if (chain >= 3) Sfx.combo();
    }
    function confetti() {
      const cols = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#9B5DE5', '#FF9F45', '#3EC9C3', '#FF8FC7'];
      for (let k = 0; k < 40; k++) {
        const d = document.createElement('div'); d.className = 'fx-confetti';
        d.style.cssText = 'position:absolute;top:-20px;width:9px;height:14px;border-radius:2px;z-index:22';
        d.style.left = (10 + (k * 7.3) % 300) + 'px'; d.style.background = cols[k % cols.length];
        phone.appendChild(d); const fall = 560 + (k % 5) * 90;
        try {
          const an = d.animate([{ transform: 'translateY(0) rotate(0)', opacity: 1 }, { transform: 'translateY(' + fall + 'px) rotate(' + (540 + k * 40) + 'deg)', opacity: .9, offset: .8 }, { transform: 'translateY(' + (fall + 80) + 'px) rotate(' + (640 + k * 40) + 'deg)', opacity: 0 }], { duration: 1500 + (k % 6) * 160, delay: (k % 8) * 60, easing: 'ease-in', fill: 'forwards' });
          an.onfinish = () => d.remove();
        } catch (e) { setTimeout(() => d.remove(), 2400); }
      }
    }

    /* ---------- HUD ---------- */
    function updateHUD() {
      pill.innerHTML = '🧋 第 <span class="num">' + levelNo + '</span> 关';
      // 目标图标 / 文案
      if (goal.type === 'score') { goalIc.textContent = '⭐'; goalLabel.textContent = '目标分数'; }
      else if (goal.type === 'collect') { goalIc.textContent = faceFor(goal.color, S_NONE, 0); goalLabel.textContent = '收集 ' + fam(goal.color).n; }
      else { goalIc.textContent = '🎁'; goalLabel.textContent = '拆封甜品'; }
      const ratio = Math.max(0, Math.min(1, cur.current / Math.max(1, cur.target)));
      goalFill.style.width = (ratio * 100).toFixed(1) + '%';
      goalBox.classList.toggle('done', cur.current >= cur.target);
      goalNum.textContent = Math.min(cur.current, cur.target) + '/' + cur.target;
      movesN.textContent = movesLeft;
      movesBox.classList.toggle('low', movesLeft <= 5);
    }

    /* ---------- 弹窗 / toast / 假广告 ---------- */
    function esc(s) { return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
    function overlay(html) { const o = document.createElement('div'); o.className = 'overlay'; o.innerHTML = html; phone.appendChild(o); return o; }
    function clearOverlays() { phone.querySelectorAll('.overlay,.ad-overlay').forEach((n) => n.remove()); }
    function toast(text) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = text; phone.appendChild(t); setTimeout(() => t.remove(), 1700); }
    function playFakeAd(placement) {
      const label = { revive: '复活加步', double: '奖励翻倍', hint: '提示', booster: '道具助推' }[placement] || '奖励';
      Sfx.tap();
      return new Promise((resolve) => {
        busy = true;
        const o = document.createElement('div'); o.className = 'ad-overlay';
        o.innerHTML = '<div class="adbox">📺 广告演示位<br>（' + label + '）</div><div class="tip">正式版这里播放激励视频<br>看完即可获得奖励</div><div class="skip">2s 后可领取</div>';
        phone.appendChild(o);
        const skip = o.querySelector('.skip'); let left = 2;
        const iv = setInterval(() => { left--; if (left > 0) skip.textContent = left + 's 后可领取'; else { clearInterval(iv); skip.textContent = '领取奖励 ▶'; skip.classList.add('ready'); } }, 1000);
        skip.addEventListener('click', () => { if (!skip.classList.contains('ready')) return; clearInterval(iv); o.remove(); busy = false; resolve(true); });
      });
    }

    /* ---------- 英语答题（网页版替代广告；答对=看完广告发奖） ---------- */
    // 与 playFakeAd 同签名，返回 Promise<boolean>：答对 resolve(true)；关闭 resolve(false)（无奖励）。
    // 答错→揭示正确释义+音标+自动朗读→换新词，直到答对为止（无限、教育优先）。
    function playQuiz(placement) {
      const Q = window.M3Quiz;
      if (!Q || !window.VOCAB || !window.VOCAB.length) return playFakeAd(placement); // 兜底
      Sfx.tap(); Voice.warmup();
      const label = placement === 'hint' ? '提示' : '道具助推';
      const band = Q.resolveBand(levelNo, settings.engBand);
      const rng = Math.random;
      return new Promise((resolve) => {
        busy = true;
        let prev = null, locked = false;
        const o = document.createElement('div'); o.className = 'overlay quiz-ov'; o.style.background = 'rgba(50,40,90,.6)';
        phone.appendChild(o);

        function finish(ok) { o.remove(); busy = false; resolve(ok); }

        function render() {
          const q = Q.pickQuestion(band, rng, prev && prev.w); prev = q;
          const choices = Q.makeChoices(q, rng);
          locked = false;
          let opt = '';
          for (let i = 0; i < choices.length; i++) opt += '<button class="voc-opt" data-i="' + i + '" data-correct="' + (choices[i].correct ? 1 : 0) + '">' + esc(choices[i].zh) + '</button>';
          o.innerHTML = '<div class="card quiz-card">'
            + '<button class="voc-close" title="关闭（放弃，无奖励）">✕</button>'
            + '<div class="quiz-head">🎧 答对即可获得「' + label + '」</div>'
            + '<div class="voc-word">' + esc(q.w) + '</div>'
            + '<div class="voc-ipa-row"><button class="voc-speak" title="朗读">🔊</button><span class="voc-ipa">' + esc(q.ipa) + '</span></div>'
            + '<div class="voc-q">选择正确的中文意思</div>'
            + '<div class="voc-opts">' + opt + '</div>'
            + '<div class="voc-tip"></div></div>';
          Voice.speak(q.w); // 出词即朗读一次
          o.querySelector('.voc-close').addEventListener('click', () => { Sfx.tap(); finish(false); });
          o.querySelector('.voc-speak').addEventListener('click', () => { Sfx.tap(); Voice.speak(q.w); });
          const opts = o.querySelectorAll('.voc-opt');
          opts.forEach((btn) => btn.addEventListener('click', () => {
            if (locked) return; locked = true;
            const correct = btn.dataset.correct === '1';
            opts.forEach((b) => { b.disabled = true; if (b.dataset.correct === '1') b.classList.add('right'); else if (b !== btn) b.classList.add('dim'); });
            const tip = o.querySelector('.voc-tip');
            if (correct) {
              Sfx.star();
              tip.innerHTML = '✅ 正确！' + esc(q.w) + ' = ' + esc(q.zh);
              setTimeout(() => finish(true), 780);
            } else {
              Sfx.invalid();
              btn.classList.add('wrong');
              tip.innerHTML = '❌ 正确答案：<b>' + esc(q.w) + '</b> = ' + esc(q.zh) + ' <span class="voc-ipa">' + esc(q.ipa) + '</span><br><span class="voc-next">听发音，换一个新词…</span>';
              Voice.speak(q.w); // 答错自动朗读正确读音
              setTimeout(render, 1900); // 换新词重出，直到答对
            }
          }));
        }
        render();
      });
    }

    function showWin(d) {
      busy = true; Sfx.win(); confetti();
      const stars = d.stars || 1; let sh = '';
      for (let i = 0; i < 3; i++) sh += '<span class="s' + (i < stars ? '' : ' off') + '">⭐</span>';
      const o = overlay('<div class="card"><div class="win-stars">' + sh + '</div><h2>通关啦！</h2>'
        + '<div class="scoreline num" id="win-score">' + d.score + '</div>'
        + '<div class="sub">剩余步数奖励 +' + (d.bonus || 0) + '</div>'
        + '<div class="btn ad" id="win-double"><span>看广告 · 奖励翻倍</span><span class="tag">▶ 广告</span></div>'
        + '<div class="btn" id="win-next">下一关 ▶</div></div>');
      o.querySelector('#win-next').addEventListener('click', () => { busy = false; o.remove(); ctrl.nextLevel(); });
      const db = o.querySelector('#win-double');
      db.addEventListener('click', async () => { const ok = await ctrl.doubleReward(); if (ok) { db.classList.add('disabled'); db.querySelector('span').textContent = '已翻倍 ✓'; } });
    }
    function showFail(d) {
      busy = true; Sfx.fail();
      const p = d.progress || cur;
      const o = overlay('<div class="card"><div style="font-size:52px">😢</div><h2 style="color:#7a6cff">差一点点</h2>'
        + '<div class="msg">目标进度 ' + Math.min(p.current, p.target) + '/' + p.target + '</div>'
        + '<div class="btn ad" id="fl-revive"><span>看广告 · +5 步继续</span><span class="tag">▶ 广告</span></div>'
        + '<div class="btn ghost" id="fl-restart">🔄 重玩本关</div></div>');
      o.querySelector('#fl-revive').addEventListener('click', async () => { o.remove(); const ok = await ctrl.reviveWithAd(); if (!ok) { busy = false; showFail(d); } });
      o.querySelector('#fl-restart').addEventListener('click', () => { busy = false; o.remove(); ctrl.restart(); });
    }

    /* ---------- 设置页 ---------- */
    function showSettings() {
      busy = true; Sfx.tap();
      const row = (icon, title, sub, key) => '<div class="srow"><div class="si">' + icon + '</div><div class="st"><b>' + title + '</b><span>' + sub + '</span></div><div class="toggle' + (settings[key] ? ' on' : '') + '" data-key="' + key + '"></div></div>';
      const BAND_LABEL = { auto: '自动（随关卡）', 1: '小学', 2: '初中', 3: '高中' };
      const bandRow = () => '<div class="srow" id="set-band"><div class="si">🎓</div><div class="st"><b>英语难度</b><span>出题词汇等级</span></div><div class="chooser" id="band-val">' + BAND_LABEL[settings.engBand] + ' ›</div></div>';
      const howto = '<div class="srow legend"><div class="si">🎮</div><div class="st"><b>怎么玩 · 融合消除</b>'
        + '<div class="howto">'
        + '<p>🔄 交换相邻两格，凑齐 <b>3 个同款甜品</b>。</p>'
        + '<p>✨ 三连<b>不消失</b>，而是<b>融合升阶</b>为同族高一阶：<span class="ht-tier">🍒→🍓→🍰→🎂</span>，边框依次 <b class="ht-b1">青铜</b>→<b class="ht-b2">白银</b>→<b class="ht-b3">黄金</b>，越并越大越绚丽。</p>'
        + '<p>👑 升到<b>满阶（金冠）</b>再并 → 生成 <b>🌈 彩虹核心</b>，交换核心即<b>清掉整族</b>！</p>'
        + '<p>🎯 每关目标：<b>攒够分数</b> / <b>收集指定甜品</b> / <b>拆封 🎁 甜品</b>，步数内达标过关。</p>'
        + '</div></div></div>';
      const legend = '<div class="srow legend"><div class="si">🧩</div><div class="st"><b>特殊块图例</b>'
        + '<div class="sp-legend">'
        + '<div class="spl"><span class="spl-ic">' + ICON.rowH + '</span>条纹·消整行</div>'
        + '<div class="spl"><span class="spl-ic">' + ICON.colV + '</span>条纹·消整列</div>'
        + '<div class="spl"><span class="spl-ic">' + ICON.bomb + '</span>包装·炸 3×3</div>'
        + '<div class="spl"><span class="spl-ic">' + ICON.rainbow + '</span>彩球·清同色</div>'
        + '</div></div></div>';
      const o = document.createElement('div'); o.className = 'overlay'; o.style.background = 'rgba(50,40,90,.55)';
      o.innerHTML = '<div style="position:absolute;inset:0">'
        + '<div class="top"><div class="icon-btn" id="set-close">‹</div><div class="pill">⚙ 设置</div><div class="icon-btn" style="opacity:0">·</div></div>'
        + '<div class="set-wrap">'
        + row('🔊', '音效', '消除 / 连锁升调 / 特殊块 / 胜负', 'sound')
        + row('🎵', '背景音乐', '轻快循环小曲', 'music')
        + row('👁️', '高对比 / 符号', '色块加符号，色盲 & 幼儿更好认', 'highContrast')
        + row('📖', '英语答题', '答对免看广告；关闭则改为看广告', 'quiz')
        + bandRow()
        + howto
        + legend
        + '<div class="srow"><div class="si">🌐</div><div class="st"><b>语言</b><span>中文</span></div><div class="arrow">›</div></div>'
        + '<div class="srow"><div class="si">📄</div><div class="st"><b>关于与隐私</b><span>隐私政策 · 适龄提示</span></div><div class="arrow">›</div></div>'
        + '<div class="srow" id="set-reset"><div class="si">🔄</div><div class="st"><b>重新开始</b><span>清空进度与星星，回到第 1 关</span></div><div class="arrow">›</div></div>'
        + '<div class="set-note">24 族奶茶甜品 · 三连融合升阶（铜→银→金→满阶皇冠）· 满阶彩虹核心清整族 · 越并越绚丽</div></div></div>';
      phone.appendChild(o);
      o.querySelector('#set-close').addEventListener('click', () => { busy = false; o.remove(); });
      o.querySelectorAll('.toggle').forEach((t) => t.addEventListener('click', () => { const k = t.dataset.key; settings[k] = !settings[k]; t.classList.toggle('on', settings[k]); saveSettings(); Sfx.tap(); if (k === 'music') Music.toggle(settings.music); if (k === 'quiz') refreshAdBadges(); }));
      // 英语难度：点一下循环 自动→小学→初中→高中
      const BAND_CYCLE = ['auto', 1, 2, 3];
      o.querySelector('#set-band').addEventListener('click', () => {
        const i = BAND_CYCLE.indexOf(settings.engBand);
        settings.engBand = BAND_CYCLE[(i + 1) % BAND_CYCLE.length];
        o.querySelector('#band-val').textContent = BAND_LABEL[settings.engBand] + ' ›';
        saveSettings(); Sfx.tap();
      });
      o.querySelector('#set-reset').addEventListener('click', () => {
        Sfx.tap();
        const c = document.createElement('div'); c.className = 'overlay'; c.style.background = 'rgba(50,40,90,.62)'; c.style.zIndex = '60';
        c.innerHTML = '<div class="card"><h2>重新开始？</h2><div class="msg">这会清空<b>所有进度和星星</b>，从第 1 关重来，且<b>无法恢复</b>。</div><div class="btn" id="rs-yes" style="background:linear-gradient(180deg,#ff7a7a,#ec4b4b)">确认重置</div><div class="btn ghost" id="rs-no">再想想</div></div>';
        phone.appendChild(c);
        c.querySelector('#rs-no').addEventListener('click', () => { Sfx.tap(); c.remove(); });
        c.querySelector('#rs-yes').addEventListener('click', () => { prog.current = 1; prog.stars = {}; save(PROG_KEY, prog); c.remove(); o.remove(); busy = false; ctrl.loadLevel(1); toast('🔄 已回到第 1 关'); });
      });
    }

    /* ---------- 提示高亮 ---------- */
    function flashHint(move) {
      [[move.r1, move.c1], [move.r2, move.c2]].forEach(([r, c]) => {
        const o = M[r][c]; if (o) { o.el.classList.add('hint'); setTimeout(() => o.el.classList.remove('hint'), 1800); }
      });
      toast('💡 试试这两只');
    }

    /* ---------- 输入：滑动 + 点两下 ---------- */
    let down = null, sel = null, swiped = false;
    function cellAt(e) {
      const rect = board.getBoundingClientRect(); const cs = rect.width / cols;
      const c = Math.floor((e.clientX - rect.left) / cs), r = Math.floor((e.clientY - rect.top) / cs);
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null; return { r, c };
    }
    function adjacent(a, b) { return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1; }
    function setSel(cellPos) {
      if (sel && M[sel.r] && M[sel.r][sel.c]) M[sel.r][sel.c].el.classList.remove('sel');
      sel = cellPos;
      if (sel && M[sel.r][sel.c]) { M[sel.r][sel.c].el.classList.add('sel'); Sfx.select(); }
    }
    function doSwap(a, b) { pending = { r1: a.r, c1: a.c, r2: b.r, c2: b.c }; ctrl.trySwap(a.r, a.c, b.r, b.c); }
    board.addEventListener('pointerdown', (e) => {
      if (busy) return; Sfx.unlock();
      const p = cellAt(e); if (!p) return;
      down = { p, x: e.clientX, y: e.clientY }; swiped = false; e.preventDefault();
    });
    window.addEventListener('pointermove', (e) => {
      if (!down || swiped || busy) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (Math.abs(dx) < cell * 0.4 && Math.abs(dy) < cell * 0.4) return;
      swiped = true;
      let tr = down.p.r, tc = down.p.c;
      if (Math.abs(dx) > Math.abs(dy)) tc += dx > 0 ? 1 : -1; else tr += dy > 0 ? 1 : -1;
      if (tr < 0 || tc < 0 || tr >= rows || tc >= cols) { down = null; return; }
      setSel(null); doSwap(down.p, { r: tr, c: tc }); down = null;
    });
    window.addEventListener('pointerup', () => {
      if (!down || swiped) { down = null; return; }
      const p = down.p; down = null;
      if (!sel) setSel(p);
      else if (sel.r === p.r && sel.c === p.c) setSel(null);
      else if (adjacent(sel, p)) { const a = sel; setSel(null); doSwap(a, p); }
      else setSel(p);
    });

    return {
      // 关卡装载 / 复活重建
      load(d, animate) {
        rows = d.rows; cols = d.cols; levelNo = d.levelNo; skin = d.skin.slice();
        goal = d.goal; cur = d.progress; movesLeft = d.movesLeft; score = d.score;
        sel = null; down = null; pendingEnd = null; busy = false;
        relayout(); buildBoard(d.grid, d.blockers, animate); updateHUD(); clearOverlays();
        Music.start(); // 已解锁 AudioContext 则开始/继续 BGM（未解锁时静默，待首次手势）
      },
      onSwapped(d) { playSteps(d.steps, d, pending); },
      onInvalid(d) {
        setSel(null); Sfx.invalid();
        [[d.r1, d.c1], [d.r2, d.c2]].forEach(([r, c]) => { const o = M[r] && M[r][c]; if (o) { o.el.classList.add('bad'); setTimeout(() => o.el.classList.remove('bad'), 420); } });
      },
      onHint(d) { flashHint(d.move); },
      onReshuffle(d) { buildBoard(d.grid, null, true); Sfx.shuffle(); toast('🔀 重新洗牌'); },
      onBooster(d) { reconcile(d.grid, null); if (d.cell) { sparkle(d.cell.r, d.cell.c); Sfx.booster(); } toast('🔨 送你一个条纹块'); },
      onWin(d) { if (busy) pendingEnd = { type: 'win', data: d }; else showWin(d); },
      onFail(d) { if (busy) pendingEnd = { type: 'fail', data: d }; else showFail(d); },
      onRewardDoubled(d) { const s = document.getElementById('win-score'); if (s) s.textContent = d.score; Sfx.star(); },
      showSettings, toast, playFakeAd, playQuiz, isBusy() { return busy; },
      relayout() { relayout(); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (M[r] && M[r][c]) position(M[r][c].el, r, c); if (jellyEls[r] && jellyEls[r][c]) { const j = jellyEls[r][c]; j.style.width = cell + 'px'; j.style.height = cell + 'px'; position(j, r, c); } } board.querySelectorAll('.cellbg').forEach((bg, i) => { bg.style.width = cell + 'px'; bg.style.height = cell + 'px'; }); },
    };
  })();

  let pending = null; // 最近一次玩家交换坐标（供交换动画用）

  /* ===================== 事件订阅 ===================== */
  on('m3_level_loaded', (d) => View.load(d, true));
  on('m3_swapped', (d) => View.onSwapped(d));
  on('m3_invalid', (d) => View.onInvalid(d));
  on('m3_hint', (d) => View.onHint(d));
  on('m3_reshuffle', (d) => View.onReshuffle(d));
  on('m3_booster', (d) => View.onBooster(d));
  on('m3_win', (d) => View.onWin(d));
  on('m3_fail', (d) => View.onFail(d));
  on('m3_revived', (d) => View.load(d, false));
  on('m3_reward_doubled', (d) => View.onRewardDoubled(d));

  /* ===================== 按钮 ===================== */
  document.getElementById('fab-booster').addEventListener('click', () => { if (!View.isBusy()) ctrl.useBooster(); });
  document.getElementById('fab-hint').addEventListener('click', () => { if (!View.isBusy()) ctrl.requestHint(); });
  document.getElementById('fab-restart').addEventListener('click', () => { if (!View.isBusy()) ctrl.restart(); });
  document.getElementById('btn-gear').addEventListener('click', () => { if (!View.isBusy()) View.showSettings(); });
  document.getElementById('btn-back').addEventListener('click', () => { if (!View.isBusy()) ctrl.restart(); });
  window.addEventListener('resize', () => View.relayout());
  window.addEventListener('pointerdown', () => { Sfx.unlock(); Voice.warmup(); Music.start(); }, { once: true });

  /* hint/booster 角标：答题模式显示「📖答题」，否则「看广告」 */
  function refreshAdBadges() {
    const on = !!(settings.quiz && window.M3Quiz && window.VOCAB && window.VOCAB.length);
    const txt = on ? '📖 答题' : '看广告';
    const a = document.getElementById('ad-booster'), b = document.getElementById('ad-hint');
    if (a) a.textContent = txt; if (b) b.textContent = txt;
  }
  refreshAdBadges();
  window.__m3refreshBadges = refreshAdBadges;

  /* ===================== 启动 ===================== */
  ctrl.loadLevel(prog.current);

  /* 测试钩子：暴露控制器供 smoke.mjs 端到端驱动（浏览器中仅挂一个只读引用，无副作用） */
  window.__m3 = { ctrl, View, get prog() { return prog; } };

  /* ===================== 小工具 ===================== */
  function mk2(r, c, v) { return Array.from({ length: r }, () => new Array(c).fill(v)); }
  function load(key, dft) { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? dft : v; } catch (e) { return dft; } }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
})();
