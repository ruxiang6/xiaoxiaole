// engine.js —— 【自动生成，请勿手改】
// 由 web/build.mjs 从下列 TypeScript 源剥类型拼装而来（单一真源）：
//   ../logic/MatchCore.ts
//   ../logic/Specials.ts
//   ../logic/Match3Gen.ts
//   ../Match3Controller.ts
//   ../resources/config/match3_levels.json
// 要改玩法逻辑，请改上面的 .ts，然后重跑：  node web/build.mjs
(function (g) {
  'use strict';

  // ===== 难度配置（来自 match3_levels.json） =====
  const BANDS = [
  { "id": 1, "minLevel": 1,  "rows": 7, "cols": 7, "colors": 5, "moves": 30, "goal": { "type": "score",   "target": 2300 } },
  { "id": 2, "minLevel": 4,  "rows": 7, "cols": 7, "colors": 5, "moves": 26, "goal": { "type": "score",   "target": 2550 } },
  { "id": 3, "minLevel": 8,  "rows": 8, "cols": 8, "colors": 6, "moves": 26, "goal": { "type": "collect", "color": 0, "count": 12 } },
  { "id": 4, "minLevel": 12, "rows": 8, "cols": 8, "colors": 6, "moves": 26, "goal": { "type": "collect", "color": 0, "count": 13 } },
  { "id": 5, "minLevel": 16, "rows": 8, "cols": 8, "colors": 6, "moves": 30, "goal": { "type": "clear", "count": 53 }, "jelly": 1 },
  { "id": 6, "minLevel": 22, "rows": 8, "cols": 8, "colors": 7, "moves": 40, "goal": { "type": "clear", "count": 54 }, "jelly": 1 },
  { "id": 7, "minLevel": 28, "rows": 8, "cols": 8, "colors": 7, "moves": 30, "goal": { "type": "score", "target": 2500 } },
  { "id": 8, "minLevel": 34, "rows": 8, "cols": 8, "colors": 8, "moves": 33, "goal": { "type": "score", "target": 2350 } }
];

  // ===== logic/MatchCore.ts =====
  /**
   * 融合消除（Fusion Match）纯逻辑内核 —— 不依赖 Cocos，可独立单测。
   *
   * 【玩法】不是"三连即消失"，而是"三连即融合升阶"：交换相邻凑同族同阶 ≥3 连，
   * 不消失，而是合成一枚同族「高一阶」元素（其余同族块被吸收清除）；逐级并上去，
   * 满阶(tier=MAXTIER)再三连 → 生成「满阶核爆核心」(彩虹核)，玩家交换核心即清整族大连锁。
   *
   * 网格用 grid[r][c]，r=0 为顶行，重力方向为 r 增大（元素下落，新块从顶部补，始终 tier=0）。
   * 每格是一个 Cell：普通元素 color>=0 且 tier=0..MAXTIER 且 special=S_NONE；空格 color=EMPTY。
   * 匹配以 (color, tier) 为准：同族且同阶且均为普通块才连成一条。
   * 特殊块：满阶核爆核心（S_COLOR，彩虹核，消同族）；条纹/炸弹常量保留但当前不再生成。
   * 障碍（果冻 jelly）用独立层 blockers[r][c] 记剩余层数，在其上消除一次减一层。
   *
   * 关键：补块随机来自「种子化 RNG 流」(mulberry32)，rngState 可序列化，
   * 保证同种子 + 同操作序列 → 完全一致的棋盘（零漂移自测、确定性续玩）。
   *
   * 视图层只读状态并按 resolve() 返回的 Step 序列逐帧播放，不复制规则。
   */

  /** 特殊块类型 */
  const S_NONE = 0;
  const S_STRIPE_H = 1; // 横条纹：激活消整行（保留，当前融合玩法不生成）
  const S_STRIPE_V = 2; // 竖条纹：激活消整列（保留，当前融合玩法不生成）
  const S_WRAP = 3;     // 包装块（炸弹）：激活消 3×3（保留，当前融合玩法不生成）
  const S_COLOR = 4;    // 满阶核爆核心（彩虹核）：激活消同族一整色

  /** 融合阶数上限：普通元素 tier ∈ 0..MAXTIER（共 MAXTIER+1 个可视等级），满阶再并 → 核心 */
  const MAXTIER = 3;

  /** 颜色哨兵 */
  const EMPTY = -1;   // 空格（下落后待填）
  const NOCOLOR = -2; // 核心无色（不参与颜色匹配）

  /** 计分常量 */
  const SCORE_PER_TILE = 20;    // 每消一格
  const SCORE_SPECIAL = 30;     // 激活一个特殊块额外奖励
  const SCORE_FUSE = 15;        // 每次融合升阶额外奖励（tier 越高越值，见 applyFuseScore）

                         
                                                    
                                                        
                                                                
   

                                               

  /** 一「步」连锁：视图据此逐帧播放（清除→生成→下落→补充） */
                         
                                                                    
                                                                  
                                                                         
                                                                                                                
                                                               
                                                                     
                                                                      
                                                                                
                                                                     
   

                               
                  
                                                           
                                        
   

  function mk(color        , special = S_NONE, tier = 0)       {
      return { color, tier, special };
  }

  class MatchCore {
               rows        ;
               cols        ;
               numColors        ;
      grid          ;
      blockers            ;
      rngState        ;
      score = 0;

      constructor(grid          , numColors        , rngState        , blockers             ) {
          this.rows = grid.length;
          this.cols = grid[0].length;
          this.numColors = numColors;
          this.grid = grid.map((row) => row.map((cell) => ({ color: cell.color, tier: cell.tier ?? 0, special: cell.special })));
          this.rngState = rngState >>> 0;
          this.blockers = blockers
              ? blockers.map((row) => row.slice())
              : Array.from({ length: this.rows }, () => new Array(this.cols).fill(0));
      }

      // ---------------- RNG（mulberry32，状态即 rngState，可序列化） ----------------
              rnd()         {
          let a = this.rngState | 0;
          a = (a + 0x6d2b79f5) | 0;
          let t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          this.rngState = a >>> 0;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      }
              randColor()         {
          return Math.floor(this.rnd() * this.numColors);
      }

      // ---------------- 基础查询 ----------------
      inBounds(r        , c        )          {
          return r >= 0 && r < this.rows && c >= 0 && c < this.cols;
      }
              isColor(cell      )          {
          return cell.color >= 0;
      }
      /** 该格是否为可参与融合的普通元素（有族、非核心/特殊） */
              isPlain(r        , c        )          {
          const cell = this.grid[r][c];
          return cell.color >= 0 && cell.special === S_NONE;
      }
      /** 与 (r,c) 同族同阶：融合匹配的基本判据（两侧都须为普通元素） */
              sameFuse(r1        , c1        , r2        , c2        )          {
          if (!this.isPlain(r1, c1) || !this.isPlain(r2, c2)) return false;
          const a = this.grid[r1][c1], b = this.grid[r2][c2];
          return a.color === b.color && a.tier === b.tier;
      }
      /** 过 (r,c) 的水平「同族同阶」连续长度（仅普通元素参与融合匹配） */
              hRun(r        , c        )         {
          if (!this.isPlain(r, c)) return 0;
          let n = 1;
          for (let k = c - 1; k >= 0 && this.sameFuse(r, c, r, k); k--) n++;
          for (let k = c + 1; k < this.cols && this.sameFuse(r, c, r, k); k++) n++;
          return n;
      }
              vRun(r        , c        )         {
          if (!this.isPlain(r, c)) return 0;
          let n = 1;
          for (let k = r - 1; k >= 0 && this.sameFuse(r, c, k, c); k--) n++;
          for (let k = r + 1; k < this.rows && this.sameFuse(r, c, k, c); k++) n++;
          return n;
      }

      // ---------------- 匹配检测 + 特殊块生成决策 ----------------
      /**
       * 计算当前盘面所有「同族同阶 ≥3 连」的融合。
       * 每个连通分量 → 落点那格升阶（或满阶造核心），其余同分量格被吸收清除。
       * @param playerAt 玩家本次交换落点（chain 1 时优先作为融合落点，手感更顺）
       * @returns clear 被吸收清除的格；spawns 融合落点（升阶块 / 满阶核心），其位置从 clear 排除
       */
              computeMatches(playerAt           )   
                      
                                                                                           
        {
          const R = this.rows, C = this.cols;
          const matchedH              = Array.from({ length: R }, () => new Array(C).fill(false));
          const matchedV              = Array.from({ length: R }, () => new Array(C).fill(false));

          for (let r = 0; r < R; r++)
              for (let c = 0; c < C; c++) {
                  if (!this.isPlain(r, c)) continue;
                  if (this.hRun(r, c) >= 3) matchedH[r][c] = true;
                  if (this.vRun(r, c) >= 3) matchedV[r][c] = true;
              }

          const matched = (r        , c        ) => matchedH[r][c] || matchedV[r][c];
          const seen              = Array.from({ length: R }, () => new Array(C).fill(false));
          const clear       = [];
          const spawns                                                                           = [];
          const inPlayer = (r        , c        ) => playerAt && playerAt.r === r && playerAt.c === c;

          // 同族同阶 4 邻接连通分量 → 每个分量融合成一枚高阶块（或满阶核心）
          for (let sr = 0; sr < R; sr++)
              for (let sc = 0; sc < C; sc++) {
                  if (seen[sr][sc] || !matched(sr, sc)) continue;
                  const color = this.grid[sr][sc].color;
                  const tier = this.grid[sr][sc].tier;
                  const comp       = [];
                  const stack       = [{ r: sr, c: sc }];
                  seen[sr][sc] = true;
                  while (stack.length) {
                      const cur = stack.pop() ;
                      comp.push(cur);
                      const nb = [
                          { r: cur.r - 1, c: cur.c }, { r: cur.r + 1, c: cur.c },
                          { r: cur.r, c: cur.c - 1 }, { r: cur.r, c: cur.c + 1 },
                      ];
                      for (const n of nb) {
                          if (this.inBounds(n.r, n.c) && !seen[n.r][n.c] && matched(n.r, n.c)
                              && this.grid[n.r][n.c].color === color && this.grid[n.r][n.c].tier === tier) {
                              seen[n.r][n.c] = true;
                              stack.push(n);
                          }
                      }
                  }

                  // 融合结果：满阶再并 → 彩虹核心；否则升阶（≥5 连超级融合直升两阶）
                  const size = comp.length;
                  const isCore = tier >= MAXTIER;
                  const newTier = size >= 5 ? Math.min(MAXTIER, tier + 2) : Math.min(MAXTIER, tier + 1);

                  // 融合落点：玩家落点 > 分量中位（确定性）
                  const inComp = comp.find((p) => inPlayer(p.r, p.c));
                  const pos = inComp ?? [...comp].sort((a, b) => (a.r - b.r) || (a.c - b.c))[Math.floor(comp.length / 2)];

                  for (const p of comp) {
                      if (p.r === pos.r && p.c === pos.c) continue; // 落点不清除，将被写成融合块
                      clear.push(p);
                  }
                  spawns.push(isCore
                      ? { r: pos.r, c: pos.c, special: S_COLOR, color: NOCOLOR, tier: MAXTIER }
                      : { r: pos.r, c: pos.c, special: S_NONE, color, tier: newTier });
              }

          return { clear, spawns };
      }

      // ---------------- 相邻交换 ----------------
      adjacent(r1        , c1        , r2        , c2        )          {
          return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
      }

      /**
       * 交换两相邻格。返回连锁步骤或无效。
       * 特判：涉及彩球 → 彩球激活；两个特殊块 → 组合引爆；否则普通交换需成消。
       */
      swap(r1        , c1        , r2        , c2        )             {
          if (!this.inBounds(r1, c1) || !this.inBounds(r2, c2)) return { ok: false, reason: 'far' };
          if (!this.adjacent(r1, c1, r2, c2)) return { ok: false, reason: 'far' };
          const a = this.grid[r1][c1], b = this.grid[r2][c2];
          if (a.color === EMPTY || b.color === EMPTY) return { ok: false, reason: 'far' };

          // 彩球参与
          if (a.special === S_COLOR || b.special === S_COLOR) {
              const bombAt = a.special === S_COLOR ? { r: r1, c: c1 } : { r: r2, c: c2 };
              const otherAt = a.special === S_COLOR ? { r: r2, c: c2 } : { r: r1, c: c1 };
              return { ok: true, steps: this.activateColorBomb(bombAt, otherAt) };
          }
          // 两个特殊块（条纹/炸弹）组合
          if (a.special !== S_NONE && b.special !== S_NONE) {
              this.doSwap(r1, c1, r2, c2);
              const seed = comboCells(this.grid, this.rows, this.cols, { r: r2, c: c2 }, { r: r1, c: c1 });
              return { ok: true, steps: this.resolve({ r: r2, c: c2 }, seed) };
          }
          // 普通交换
          this.doSwap(r1, c1, r2, c2);
          const m = this.computeMatches({ r: r2, c: c2 });
          // 也允许以 (r1,c1) 为落点检测（交换双方任一成消都算有效）
          const m2 = m.clear.length ? m : this.computeMatches({ r: r1, c: c1 });
          if (!m2.clear.length && !m2.spawns.length) {
              this.doSwap(r1, c1, r2, c2); // 换回
              return { ok: false, reason: 'no-match' };
          }
          return { ok: true, steps: this.resolve({ r: r2, c: c2 }) };
      }

              doSwap(r1        , c1        , r2        , c2        )       {
          const t = this.grid[r1][c1];
          this.grid[r1][c1] = this.grid[r2][c2];
          this.grid[r2][c2] = t;
      }

      /** 彩球激活（含与其他特殊块组合） */
              activateColorBomb(bombAt    , otherAt    )         {
          const other = this.grid[otherAt.r][otherAt.c];
          const seed       = [bombAt];
          if (other.special === S_COLOR) {
              // 彩球 + 彩球 → 全屏清
              for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++)
                  if (this.grid[r][c].color !== EMPTY) seed.push({ r, c });
          } else if (other.special === S_STRIPE_H || other.special === S_STRIPE_V || other.special === S_WRAP) {
              // 彩球 + 条纹/炸弹 → 该色全部升级为该特殊块，再引爆
              const target = other.color;
              for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++)
                  if (this.grid[r][c].color === target) {
                      this.grid[r][c].special = other.special;
                      seed.push({ r, c });
                  }
              seed.push(otherAt);
          } else {
              // 彩球 + 普通 → 消该色全部
              const target = other.color;
              for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++)
                  if (this.grid[r][c].color === target) seed.push({ r, c });
              seed.push(otherAt);
          }
          return this.resolve(otherAt, seed);
      }

      // ---------------- 连锁解算 ----------------
      /**
       * 从当前盘面解算到稳定：清除→生成特殊块→下落→补块→再检测，逐步收集 Step。
       * @param playerAt chain 1 的生成落点偏好
       * @param seedClears 首步强制清除集合（组合/彩球引爆用）
       */
      resolve(playerAt           , seedClears       )         {
          const steps         = [];
          let chain = 0;

          if (seedClears && seedClears.length) {
              chain++;
              const cl = this.applyClears(seedClears, chain);
              const grav = this.applyGravity();
              steps.push({ chain, ...cl, spawned: [], ...grav });
          }

          while (true) {
              const m = this.computeMatches(chain === 0 ? playerAt : null);
              if (!m.clear.length && !m.spawns.length) break;
              chain++;
              const cl = this.applyClears(m.clear, chain);
              // 写入融合结果（升阶块 / 满阶核心，保留在盘面）+ 融合奖励分
              let fuseBonus = 0;
              for (const sp of m.spawns) {
                  this.grid[sp.r][sp.c] = mk(sp.color, sp.special, sp.tier);
                  fuseBonus += sp.special === S_COLOR ? SCORE_FUSE * (MAXTIER + 2) : SCORE_FUSE * sp.tier;
                  // 融合反应也熔掉落点下方的果冻一层：幸存格不进 clear 列表，
                  // 否则 clear 目标在融合玩法里几乎无法达成（幸存格永不清、少动的格子清不掉）。
                  if (this.blockers[sp.r][sp.c] > 0) {
                      this.blockers[sp.r][sp.c]--;
                      cl.blockerCleared.push({ r: sp.r, c: sp.c });
                  }
              }
              fuseBonus *= chain; // 连锁倍率，与清除分一致
              this.score += fuseBonus;
              cl.gained += fuseBonus;
              const grav = this.applyGravity();
              steps.push({ chain, ...cl, spawned: m.spawns, ...grav });
          }
          return steps;
      }

      /**
       * 清除一组格（BFS 连环展开：被清的既有特殊块会激活，波及更多格）。
       * @returns 本步的 cleared/fired/collected/gained/blockerCleared
       */
              applyClears(initial      , chain        )   
                                                                            
                                                                                  
        {
          const cleared       = [];
          const fired                                              = [];
          const collected                         = {};
          const blockerCleared       = [];
          let raw = 0;
          const seen = new Set        ();
          const key = (r        , c        ) => r * this.cols + c;
          const queue       = [...initial];

          while (queue.length) {
              const { r, c } = queue.shift() ;
              const k = key(r, c);
              if (seen.has(k)) continue;
              const cell = this.grid[r][c];
              if (cell.color === EMPTY && cell.special === S_NONE) continue;
              seen.add(k);
              cleared.push({ r, c });
              raw += SCORE_PER_TILE;
              if (cell.color >= 0) collected[cell.color] = (collected[cell.color] || 0) + 1;
              if (this.blockers[r][c] > 0) {
                  this.blockers[r][c]--;
                  blockerCleared.push({ r, c });
              }
              if (cell.special !== S_NONE) {
                  fired.push({ r, c, special: cell.special });
                  raw += SCORE_SPECIAL;
                  const extra = activationCells(this.grid, this.rows, this.cols, r, c, cell, () => this.dominantColor());
                  for (const e of extra) if (!seen.has(key(e.r, e.c))) queue.push(e);
              }
              this.grid[r][c] = mk(EMPTY);
          }

          const gained = raw * chain; // 连锁倍率
          this.score += gained;
          return { cleared, fired, collected, gained, blockerCleared };
      }

      /** 盘面最多的普通色（被动激活的彩球用；平局取最小索引） */
              dominantColor()         {
          const cnt = new Array(this.numColors).fill(0);
          for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
              const col = this.grid[r][c].color;
              if (col >= 0 && col < this.numColors) cnt[col]++;
          }
          let best = 0;
          for (let i = 1; i < this.numColors; i++) if (cnt[i] > cnt[best]) best = i;
          return best;
      }

      /** 重力下落 + 顶部补新块（补块走种子流，确定性） */
              applyGravity()                                                                                          {
          const fallen                         = [];
          const refilled                                            = [];
          for (let c = 0; c < this.cols; c++) {
              let write = this.rows - 1;
              for (let r = this.rows - 1; r >= 0; r--) {
                  if (this.grid[r][c].color !== EMPTY) {
                      if (write !== r) {
                          this.grid[write][c] = this.grid[r][c];
                          this.grid[r][c] = mk(EMPTY);
                          fallen.push({ from: { r, c }, to: { r: write, c } });
                      }
                      write--;
                  }
              }
              for (let r = write; r >= 0; r--) {
                  const color = this.randColor();
                  this.grid[r][c] = mk(color);
                  refilled.push({ r, c, color });
              }
          }
          return { fallen, refilled };
      }

      // ---------------- 死局 / 提示 / 洗牌 ----------------
      /** 是否存在任何能成消的交换（含彩球总是可用） */
      hasAnyMove()          {
          return this.findHint() !== null;
      }

      /** 找一个可成消的交换（提示用）；无则 null */
      findHint()                                                            {
          // 彩球在盘上则总有可用交换（与任意相邻普通块）
          for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
              if (this.grid[r][c].special === S_COLOR) {
                  const nb = [{ r: r + 1, c }, { r, c: c + 1 }, { r: r - 1, c }, { r, c: c - 1 }];
                  for (const n of nb) if (this.inBounds(n.r, n.c) && this.grid[n.r][n.c].color !== EMPTY)
                      return { r1: r, c1: c, r2: n.r, c2: n.c };
              }
          }
          // 试所有相邻交换（只测右、下，避免重复），看是否产生匹配
          for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
              for (const [dr, dc] of [[0, 1], [1, 0]]         ) {
                  const nr = r + dr, nc = c + dc;
                  if (!this.inBounds(nr, nc)) continue;
                  if (this.grid[r][c].color === EMPTY || this.grid[nr][nc].color === EMPTY) continue;
                  this.doSwap(r, c, nr, nc);
                  const has = this.quickHasMatch();
                  this.doSwap(r, c, nr, nc); // 还原
                  if (has) return { r1: r, c1: c, r2: nr, c2: nc };
              }
          }
          return null;
      }

      /** 轻量匹配存在性判断（不生成清除集，仅判断有无 ≥3 连） */
              quickHasMatch()          {
          for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
              if (this.grid[r][c].color < 0) continue;
              if (this.hRun(r, c) >= 3 || this.vRun(r, c) >= 3) return true;
          }
          return false;
      }

      /**
       * 确定性洗牌：保持颜色多重集，用种子流重排，直到「无初始匹配且有可行交换」。
       * @returns 是否成功洗出可玩局面
       */
      reshuffle(maxTries = 40)          {
          // 收集所有普通元素（核心/特殊块不参与洗牌，原地保留）；保持 (族,阶) 多重集不变
          const movable       = [];
          const tiles                                    = [];
          for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
              const cell = this.grid[r][c];
              if (cell.special === S_NONE && cell.color >= 0) {
                  movable.push({ r, c });
                  tiles.push({ color: cell.color, tier: cell.tier });
              }
          }
          for (let t = 0; t < maxTries; t++) {
              for (let i = tiles.length - 1; i > 0; i--) {
                  const j = Math.floor(this.rnd() * (i + 1));
                  [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
              }
              movable.forEach((p, i) => { this.grid[p.r][p.c] = mk(tiles[i].color, S_NONE, tiles[i].tier); });
              if (!this.quickHasMatch() && this.hasAnyMove()) return true;
          }
          return false;
      }

      /**
       * 助推道具：把一枚随机普通元素融合升一阶（走种子流，确定性）。
       * 优先挑未满阶(tier<MAXTIER)的块升阶，让玩家更快并到高阶/核心。
       * @returns 被升级的格坐标；盘面无可升普通块时 null
       */
      grantRandomUpgrade()            {
          const below       = [];
          const any       = [];
          for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
              const cell = this.grid[r][c];
              if (cell.special === S_NONE && cell.color >= 0) {
                  any.push({ r, c });
                  if (cell.tier < MAXTIER) below.push({ r, c });
              }
          }
          const cands = below.length ? below : any;
          if (!cands.length) return null;
          const pick = cands[Math.floor(this.rnd() * cands.length)];
          const cell = this.grid[pick.r][pick.c];
          this.grid[pick.r][pick.c] = mk(cell.color, S_NONE, Math.min(MAXTIER, cell.tier + 1));
          return pick;
      }

      // ---------------- 序列化 ----------------
      /** 稳定序列化（零漂移比对用）：网格 + 障碍 + rng + 分数 */
      key()         {
          const g = this.grid.map((row) => row.map((x) => `${x.color}:${x.tier}:${x.special}`).join(',')).join('|');
          const b = this.blockers.map((row) => row.join('')).join('|');
          return `${g}#${b}#${this.rngState}#${this.score}`;
      }

      snapshot()                                                                            {
          return {
              grid: this.grid.map((row) => row.map((x) => ({ color: x.color, tier: x.tier, special: x.special }))),
              blockers: this.blockers.map((row) => row.slice()),
              rngState: this.rngState,
              score: this.score,
          };
      }

      clone()            {
          const c = new MatchCore(this.grid, this.numColors, this.rngState, this.blockers);
          c.score = this.score;
          return c;
      }
  }


  // ===== logic/Specials.ts =====
  /**
   * 特殊块「激活影响范围」与「组合效果」纯函数（无引擎依赖，可单测）。
   *
   * MatchCore 负责编排连环引爆，本模块只回答：某个特殊块激活时波及哪些格 /
   * 两个特殊块交换组合时波及哪些格。返回坐标集，由 MatchCore 加入清除队列。
   */
                                              

  /**
   * 单个特殊块激活时影响的格坐标。
   * @param getDominant 被动激活的彩球用：返回盘面最多的普通色
   */
  function activationCells(
      grid          , rows        , cols        ,
      r        , c        , cell      ,
      getDominant              ,
  )       {
      const out       = [];
      switch (cell.special) {
          case S_STRIPE_H: // 整行
              for (let cc = 0; cc < cols; cc++) if (cc !== c) out.push({ r, c: cc });
              break;
          case S_STRIPE_V: // 整列
              for (let rr = 0; rr < rows; rr++) if (rr !== r) out.push({ r: rr, c });
              break;
          case S_WRAP: // 3×3
              for (let rr = r - 1; rr <= r + 1; rr++)
                  for (let cc = c - 1; cc <= c + 1; cc++)
                      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols && !(rr === r && cc === c))
                          out.push({ r: rr, c: cc });
              break;
          case S_COLOR: { // 彩球被动激活 → 消盘面最多的普通色
              const target = getDominant();
              for (let rr = 0; rr < rows; rr++)
                  for (let cc = 0; cc < cols; cc++)
                      if (grid[rr][cc].color === target && !(rr === r && cc === c))
                          out.push({ r: rr, c: cc });
              break;
          }
      }
      return out;
  }

  /**
   * 两个特殊块交换的组合效果影响格（彩球组合在 MatchCore 另行处理）。
   * @param atA 交换落点（玩家拖到的目标格，效果中心）
   * @param atB 源格
   */
  function comboCells(
      grid          , rows        , cols        , atA    , atB    ,
  )       {
      const a = grid[atA.r][atA.c].special;
      const b = grid[atB.r][atB.c].special;
      const set = new Map            ();
      const add = (r        , c        ) => {
          if (r >= 0 && r < rows && c >= 0 && c < cols) set.set(r * cols + c, { r, c });
      };
      const isStripe = (s        ) => s === S_STRIPE_H || s === S_STRIPE_V;

      if (isStripe(a) && isStripe(b)) {
          // 条纹 + 条纹 → 十字（落点整行 + 整列）
          for (let c = 0; c < cols; c++) add(atA.r, c);
          for (let r = 0; r < rows; r++) add(r, atA.c);
      } else if ((isStripe(a) && b === S_WRAP) || (a === S_WRAP && isStripe(b))) {
          // 条纹 + 炸弹 → 3 行 + 3 列大十字
          for (let dr = -1; dr <= 1; dr++) for (let c = 0; c < cols; c++) add(atA.r + dr, c);
          for (let dc = -1; dc <= 1; dc++) for (let r = 0; r < rows; r++) add(r, atA.c + dc);
      } else if (a === S_WRAP && b === S_WRAP) {
          // 炸弹 + 炸弹 → 5×5
          for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) add(atA.r + dr, atA.c + dc);
      } else {
          // 兜底：两格 3×3
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) add(atA.r + dr, atA.c + dc);
      }
      add(atA.r, atA.c);
      add(atB.r, atB.c);
      return [...set.values()];
  }


  // ===== logic/Match3Gen.ts =====
  /**
   * 种子化关卡生成 + 无死局保证（纯逻辑，可 Node 单测）。
   *
   * 关号即种子：mulberry32(seed) 生成初盘时**避免开局就有三连**（否则一载入就自动连锁，
   * 玩家没操作就掉分/达标，手感差），生成完把 RNG 末态交给 MatchCore ——
   * 于是「初盘生成」与「运行时补块」是同一条种子流的先后两段，
   * 同种子 → 完全一致的整局（零漂移自测、确定性续玩）。
   *
   * 可玩性：生成后若无任何可成消交换，走 MatchCore.reshuffle（也吃种子流，确定性）。
   * 注意 mulberry32 算法与 MatchCore.rnd 完全一致，保证状态整数可无缝衔接。
   */

                                
                   
                   
                                                 
                                                                    
                                                                             
   

                                   
                     
                           
                        
                                             
   

  /** mulberry32 有状态发生器（算法与 MatchCore.rnd 逐位一致） */
  function makeRng(state        ) {
      let s = state >>> 0;
      return {
          next()         {
              let a = s | 0;
              a = (a + 0x6d2b79f5) | 0;
              let t = Math.imul(a ^ (a >>> 15), 1 | a);
              t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
              s = a >>> 0;
              return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          },
          state()         { return s; },
      };
  }

  /** 关号 → 种子（避免 0，稍作扰动让相邻关差异明显） */
  function seedForLevel(levelNo        )         {
      return ((levelNo * 2654435761) ^ 0x9e3779b9) >>> 0;
  }

  /**
   * 生成一关的初盘。关号即种子 → 确定性。
   * @param seed 通常传 seedForLevel(levelNo)
   */
  function generateBoard(seed        , params             )                 {
      const { rows, cols, colors } = params;
      const rng = makeRng(seed >>> 0);
      const grid           = [];

      for (let r = 0; r < rows; r++) {
          const row         = [];
          for (let c = 0; c < cols; c++) {
              // 排除会与左侧两格 / 上方两格连成三连的颜色
              const banned = new Set        ();
              if (c >= 2 && row[c - 1].color === row[c - 2].color) banned.add(row[c - 1].color);
              if (r >= 2 && grid[r - 1][c].color === grid[r - 2][c].color) banned.add(grid[r - 1][c].color);
              const allowed           = [];
              for (let k = 0; k < colors; k++) if (!banned.has(k)) allowed.push(k);
              const pool = allowed.length ? allowed : [Math.floor(rng.next() * colors)];
              const color = pool[Math.floor(rng.next() * pool.length)];
              row.push({ color, tier: 0, special: S_NONE }); // 初盘全为最低阶(tier 0)，靠融合升阶
          }
          grid.push(row);
      }

      // 果冻障碍层：默认全盘铺；给了 jellyCells 则随机挑 N 格铺（部分覆盖，居中偏好让难度更集中）
      const jelly = params.jelly ?? 0;
      const blockers = Array.from({ length: rows }, () => new Array(cols).fill(0));
      if (jelly > 0) {
          const want = params.jellyCells != null ? Math.max(0, Math.min(rows * cols, params.jellyCells)) : rows * cols;
          if (want >= rows * cols) {
              for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) blockers[r][c] = jelly;
          } else {
              // 偏底部铺果冻：越靠下的行在重力/连锁中翻动越频繁，越能被可靠清掉。
              // 融合玩法里「升阶幸存格」不清自身，若果冻落在少动的顶部/角落，clear 目标会两极化
              // （某关 0%、某关 90%）。给每格打「行权重 + 种子抖动」分，取分最高的 want 格集中在下半盘。
              const scored                             = [];
              for (let i = 0; i < rows * cols; i++) {
                  const r = (i / cols) | 0;
                  scored.push({ p: i, s: r + rng.next() * 1.5 }); // 行号主导、抖动打散，确定性吃种子流
              }
              scored.sort((a, b) => b.s - a.s);
              for (let k = 0; k < want; k++) { const p = scored[k].p; blockers[(p / cols) | 0][p % cols] = jelly; }
          }
      }

      // 用 RNG 末态构造 core，保证补块续接同一条流
      const core = new MatchCore(grid, colors, rng.state(), blockers);
      // 无死局保证：没有可成消交换就洗牌（确定性，继续吃种子流）
      if (!core.hasAnyMove()) core.reshuffle();

      const snap = core.snapshot();
      return { grid: snap.grid, blockers: snap.blockers, numColors: colors, rngState: snap.rngState };
  }

  /** 便捷：直接生成一关并返回可玩的 MatchCore 实例 */
  function newLevelCore(seed        , params             )            {
      const b = generateBoard(seed, params);
      return new MatchCore(b.grid, b.numColors, b.rngState, b.blockers);
  }


  // ===== Match3Controller.ts =====

  /**
   * 花名册规模，必须与 render/Palette.ts 的 ROSTER_SIZE 一致（24 族奶茶甜品/网红美食）。
   * 控制器只发「花名册索引」，渲染层据此取甜品脸（每族 4 阶由 tier 决定，96 个占位造型各不相同）；逻辑仍只认颜色 0..k-1。
   */
  const ROSTER_SIZE = 24;

  /** 关卡目标 */
                         
                                          
                                                                
                                                         
                                     
   

  /** 难度档（对应 resources/config/match3_levels.json 一行） */
                             
                 
                       
                   
                   
                                                   
                                     
                                                                                                     
                                                
                                                        
   

  /**
   * 控制器依赖（Cocos 侧 GameBase 子类注入框架门面；纯逻辑不 import 框架，可脱 Cocos 单测）。
   */
                               
                                                                                   
                                                                                                      
              
                          
                                      
                                                      
        
                                                                              
                                                                                            
   

  /** 复活加步 / 剩余步数奖励分 */
  const REVIVE_MOVES = 5;
  const BONUS_PER_MOVE = 60;

  /**
   * 三消玩法控制器（render-agnostic）。
   * 视图订阅事件渲染，用户输入调 trySwap/requestHint/reviveWithAd 等。
   * 事件：m3_level_loaded / m3_swapped / m3_invalid / m3_hint / m3_reshuffle /
   *       m3_win / m3_fail / m3_revived / m3_reward_doubled / m3_booster
   */
  class Match3Controller {
              d            ;
              core            ;
              levelNo = 1;
              band           ;
              goal       ;
              movesLeft = 0;
              collected = 0;      // collect 目标累计
              initialJelly = 0;   // clear 目标基数
              skin           = [];
              usedHint = false;
              usedRevive = false;
              ended = false;

      constructor(deps            ) {
          this.d = deps;
      }

      // ---------------- 难度 / 皮肤选择 ----------------
      /** 按关号选难度档：取 minLevel<=levelNo 的最大一档 */
              pickBand(levelNo        )           {
          const rows = [...this.d.bands].sort((a, b) => a.minLevel - b.minLevel);
          let picked = rows[0];
          for (const r of rows) if (levelNo >= r.minLevel) picked = r;
          return picked;
      }

      /**
       * 关号 → 甜品皮肤窗口（花名册索引数组，长度 = 同屏色数）。
       * 每 2 关整体前移 1 族 → 相邻关大量重叠、缓慢换新甜品，10 族全程轮流登场。
       * 确定性（只依赖关号），web 与 Cocos 两端一致。
       */
              pickSkin(levelNo        , numColors        )           {
          const base = Math.floor((levelNo - 1) / 2) % ROSTER_SIZE;
          const out           = [];
          for (let i = 0; i < numColors; i++) out.push((base + i) % ROSTER_SIZE);
          return out;
      }

      /**
       * 档内随关号轻度爬坡目标（moves 保持档值）。
       * offset 上限 6：避免「宽档 / 末档无上界」时目标无限攀高致后段必败（probe 标定所得）。
       */
              resolveGoal(band          , levelNo        , initialJelly        )       {
          const offset = Math.min(6, Math.max(0, levelNo - band.minLevel));
          const g = band.goal;
          if (g.type === 'score') {
              return { type: 'score', target: Math.round((g.target ?? 2000) * (1 + 0.02 * offset)) };
          }
          if (g.type === 'collect') {
              return { type: 'collect', color: g.color ?? 0, count: (g.count ?? 20) + offset };
          }
          // clear：清掉「指定层数」果冻（部分目标），而非全清。
          // 融合玩法里幸存格不清、稀疏果冻常留一格死活清不掉 → 全清目标会两极化（0% 或 90%）。
          // 满盘薄果冻 + 部分目标 = 靠全盘翻动稳定推进的平滑目标（机制近似 collect，主题为「拆封」）。
          return { type: 'clear', target: Math.min(initialJelly, (g.count ?? initialJelly) + offset) };
      }

      // ---------------- 关卡装载 ----------------
      loadLevel(levelNo = this.d.level.current)       {
          this.levelNo = levelNo;
          const band = this.pickBand(levelNo);
          this.band = band;
          const params              = {
              rows: band.rows, cols: band.cols, colors: band.colors,
              jelly: band.goal.type === 'clear' ? (band.jelly ?? 1) : 0,
              jellyCells: band.goal.type === 'clear' ? band.jellyCells : undefined,
          };
          const gen = generateBoard(seedForLevel(levelNo), params); // 关号即种子 → 确定性
          this.core = new MatchCore(gen.grid, gen.numColors, gen.rngState, gen.blockers);
          this.initialJelly = this.sumJelly();
          this.goal = this.resolveGoal(band, levelNo, this.initialJelly);
          this.movesLeft = band.moves;
          this.collected = 0;
          this.skin = this.pickSkin(levelNo, band.colors);
          this.usedHint = false;
          this.usedRevive = false;
          this.ended = false;

          this.d.track?.('level_start', { game: 'match3', level: levelNo, band: band.id, goal: this.goal.type });
          this.d.emit('m3_level_loaded', this.snapshotEvent());
      }

              sumJelly()         {
          return this.core.blockers.reduce((a, row) => a + row.reduce((s, x) => s + x, 0), 0);
      }

      /** 完整状态事件载荷（载入 / 复活重建用） */
              snapshotEvent()      {
          const snap = this.core.snapshot();
          return {
              levelNo: this.levelNo,
              rows: this.band.rows,
              cols: this.band.cols,
              numColors: this.band.colors,
              skin: this.skin.slice(),
              grid: snap.grid,
              blockers: snap.blockers,
              goal: { ...this.goal },
              movesLeft: this.movesLeft,
              score: this.core.score,
              progress: this.progress(),
          };
      }

      /** 当前状态快照（视图初始化/重建） */
      get state()      {
          return this.snapshotEvent();
      }

      // ---------------- 目标进度 ----------------
              progress()                                                    {
          if (this.goal.type === 'score') {
              return { type: 'score', current: this.core.score, target: this.goal.target  };
          }
          if (this.goal.type === 'collect') {
              return { type: 'collect', current: this.collected, target: this.goal.count  };
          }
          // clear：已清果冻层数（封顶目标值，进度条不越界）
          return { type: 'clear', current: Math.min(this.goal.target , this.initialJelly - this.sumJelly()), target: this.goal.target  };
      }

              goalMet()          {
          if (this.goal.type === 'score') return this.core.score >= this.goal.target ;
          if (this.goal.type === 'collect') return this.collected >= this.goal.count ;
          return (this.initialJelly - this.sumJelly()) >= this.goal.target ;
      }

      // ---------------- 交换 ----------------
      /** 玩家交换相邻两格（视图传网格坐标） */
      trySwap(r1        , c1        , r2        , c2        )       {
          if (this.ended) return;
          const res = this.core.swap(r1, c1, r2, c2);
          if (!res.ok) {
              this.d.emit('m3_invalid', { r1, c1, r2, c2, reason: res.reason });
              return;
          }
          this.movesLeft--;
          if (this.goal.type === 'collect') {
              const col = this.goal.color ;
              for (const s of res.steps ) this.collected += s.collected[col] || 0;
          }

          // 死局自动洗牌（确定性，吃种子流）
          let reshuffled = false;
          if (!this.goalMet() && this.movesLeft > 0 && !this.core.hasAnyMove()) {
              this.core.reshuffle();
              reshuffled = true;
          }

          const snap = this.core.snapshot();
          this.d.emit('m3_swapped', {
              steps: res.steps          ,
              grid: snap.grid,
              blockers: snap.blockers,
              movesLeft: this.movesLeft,
              score: this.core.score,
              progress: this.progress(),
              reshuffled,
          });
          this.checkEnd();
      }

              checkEnd()       {
          if (this.goalMet()) {
              this.ended = true;
              const bonus = Math.max(0, this.movesLeft) * BONUS_PER_MOVE;
              this.core.score += bonus;
              const stars = this.calcStars();
              this.d.level.complete(this.levelNo, stars);
              this.d.track?.('level_win', {
                  game: 'match3', level: this.levelNo, stars,
                  score: this.core.score, movesLeft: this.movesLeft, goal: this.goal.type,
              });
              this.d.emit('m3_win', {
                  levelNo: this.levelNo, stars, score: this.core.score,
                  bonus, movesLeft: this.movesLeft,
              });
              return;
          }
          if (this.movesLeft <= 0) {
              this.ended = true;
              this.d.track?.('level_fail', { game: 'match3', level: this.levelNo, goal: this.goal.type });
              this.d.emit('m3_fail', { levelNo: this.levelNo, progress: this.progress() });
          }
      }

      // ---------------- IAA 点位 ----------------
      /** 提示：看广告高亮一个可消交换（无解则先洗牌，不让玩家白看） */
      async requestHint()                {
          if (this.ended) return;
          let move = this.core.findHint();
          if (!move) {
              this.core.reshuffle();
              this.d.emit('m3_reshuffle', { grid: this.core.snapshot().grid });
              move = this.core.findHint();
              if (!move) return;
          }
          const ok = await this.d.showAd('hint');
          if (!ok) return;
          this.usedHint = true;
          this.d.track?.('hint_used', { game: 'match3', level: this.levelNo });
          this.d.emit('m3_hint', { move });
      }

      /** 失败复活：看广告 +5 步继续 */
      async reviveWithAd()                   {
          if (!this.ended || this.goalMet()) return false;
          const ok = await this.d.showAd('revive');
          if (!ok) return false;
          this.usedRevive = true;
          this.movesLeft += REVIVE_MOVES;
          this.ended = false;
          this.d.track?.('revive_used', { game: 'match3', level: this.levelNo });
          this.d.emit('m3_revived', { movesLeft: this.movesLeft, ...this.snapshotEvent() });
          return true;
      }

      /** 通关结算翻倍：看广告把「剩余步数奖励分」再翻一倍 */
      async doubleReward()                   {
          const ok = await this.d.showAd('double');
          if (!ok) return false;
          const extra = Math.max(0, this.movesLeft) * BONUS_PER_MOVE;
          this.core.score += extra;
          this.d.track?.('reward_doubled', { game: 'match3', level: this.levelNo });
          this.d.emit('m3_reward_doubled', { extra, score: this.core.score });
          return true;
      }

      /** 开局助推：看广告随机把一枚普通元素融合升一阶 */
      async useBooster()                   {
          if (this.ended) return false;
          const ok = await this.d.showAd('booster');
          if (!ok) return false;
          const cell = this.core.grantRandomUpgrade();
          if (cell) {
              this.d.track?.('booster_used', { game: 'match3', level: this.levelNo });
              this.d.emit('m3_booster', { cell, grid: this.core.snapshot().grid });
          }
          return true;
      }

      // ---------------- 关卡流转 ----------------
      restart()       { this.loadLevel(this.levelNo); }
      nextLevel()       { this.loadLevel(this.levelNo + 1); }

      /** 星级：达标基础 1★；剩余步数越多越高（未用提示/复活才可能 3★） */
              calcStars()         {
          let stars = 1;
          const ratio = this.movesLeft / Math.max(1, this.band.moves);
          if (ratio >= 0.2) stars = 2;
          if (ratio >= 0.4) stars = 3;
          if (this.usedHint || this.usedRevive) stars = Math.min(stars, 2);
          return Math.max(1, stars);
      }
  }


  g.M3Engine = {
    MatchCore, generateBoard, seedForLevel, newLevelCore,
    Match3Controller, ROSTER_SIZE, BANDS, MAXTIER,
    S_NONE, S_STRIPE_H, S_STRIPE_V, S_WRAP, S_COLOR, EMPTY, NOCOLOR,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
