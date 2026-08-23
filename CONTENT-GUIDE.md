# 个人主页文案规格书（CONTENT-GUIDE）

> **用途**：本文档交给拥有我（郑博闻 / Bowen Zheng）完整经历信息的写作 agent，用于产出个人主页的**中英双语文案**。产出的文案将交回给开发 agent 替换到代码中。
>
> **你的任务**：按第 4 节逐字段的规格，为每一个需要文案的字段写出中文版与英文版，并按第 6 节的格式交付。

---

## 1. 项目背景

### 1.1 这是什么
一个部署在 GitHub Pages 上的**个人求职主页**（单页应用，无后端）。主人是郑博闻（Bowen Zheng），香港科技大学人工智能硕士在读，本科毕业于澳门大学商业智能与数据分析专业，有安永（EY）金融服务部与北京国家级 ESG 研究机构两段实习经历，目标方向为 **AI 技术 × 商业/咨询** 双轨岗位（LLM 应用、数据科学、金融风控咨询等）。

主页链接会印在简历上，因此它的读者是：
1. **HR / 猎头**（初筛，只花 6~10 秒做 F 型扫描）——需要首屏即可回答"做什么的、哪个领域、会什么栈"；
2. **用人经理 / 技术面试官**（二轮深读）——会细看项目细节与量化结果。

### 1.2 设计基调
- 深色科技感为默认主题（有浅色主题可切换），玻璃拟态 + 星空粒子背景；
- 三字体系统：Space Grotesk（大标题）/ Inter（正文）/ JetBrains Mono（标签、编号、数据）；
- 双语支持：英文为默认语言，可切换简体中文（所有文案字段都有 EN / ZH 两份）；
- 版式语言：章节编号 01–07、幽灵数字、时间线、常开网格（避免折叠隐藏信息）。

### 1.3 页面结构（自上而下）
| # | 区块 | section id | 作用 |
|---|------|-----------|------|
| — | Hero 全屏定位区 | `hero` | 6 秒内传达身份定位 + 背书 + CTA |
| 01 | Professional Summary | `#summary` | 三张能力要点卡（AI 工程 / 数据与风险分析 / 咨询交付） |
| 02 | Skills | `#skills` | 6 类技能常开网格 |
| 03 | Education | `#education` | 时间线（HKUST → UM） |
| 04 | Industry Experience | `#experience` | 时间线（EY → ESG 机构），每段经历含项目子卡 |
| 05 | Projects | `#projects` | 4 个项目卡（摘要 + 首条要点常开，其余折叠） |
| 06 | Early Projects | `#early-projects` | 3 个早期项目行列表（全可见） |
| 07 | Beyond Work (Extras) | `#extras` | 兴趣 chips |
| — | Footer CTA | — | 结尾行动号召 + 邮箱 + 社交 |

---

## 2. 文案存放位置（技术约束）

- **所有界面文案**存放在两个 JSON 文件中：
  - `src/i18n/en.json`（英文）
  - `src/i18n/zh.json`（简体中文）
  - 两个文件的 **key 必须一一对应**，缺失时回退英文。
- **例外 1**：技能分类标题存于 `src/data/content.ts` 的 `skillCategoryTitles`（`en` / `zh` 两个数组，顺序固定 6 项）。
- **例外 2**：技能标签本体（如 `LLM`、`XGBoost / Random Forest / SVM`）存于 `src/data/content.ts` 的 `skills` 数组，**中英文共用同一份**（技术名词不翻译）。
- **硬数据**（公司名、起止时间、学位名、GitHub 链接）也存于 `content.ts`，**不需要写作 agent 处理**。

### 2.1 拼接类字段（注意）
- `hero_role_pre` + `hero_role_x`（固定为 `×`）+ `hero_role_post` 三段**拼接成一行**角色定位语。
- `hero_keywords` 是**逗号分隔**的字符串，渲染时按 `,` 切分成关键词行。
- `extras_interest_content` 是**顿号/逗号分隔**的字符串，渲染时切分成兴趣 chips。
- `hero_name_a` / `hero_name_b` 是姓名的两个词（英文 `Bowen` / `Zheng`，中文 `郑博闻` / 空字符串），**不需要重写**。

### 2.2 长度硬约束（超出会破坏排版）
| 字段类型 | 约束 |
|---------|------|
| `hero_positioning` | ≤ 2 行（约 55 英文词 / 55 中文字符），移动端会更早换行 |
| `cred_*` 背书 chips | ≤ 22 英文字符 / 10 中文字符（等宽字体小药丸） |
| `hero_role_pre` + `post` 合计 | 桌面一行放下（约 50 英文字符 / 22 中文字符），移动端允许两行 |
| `cap_*_desc` 要点卡描述 | ≤ 3 行（约 20 英文词 / 40 中文字符） |
| 项目/经历 `*_d*` bullet | 每条 1–3 行（约 15–35 英文词 / 30–60 中文字符） |
| `*_summary` 项目一句话 | 一行（约 12–18 英文词 / 20–35 中文字符） |
| `footer_title` | 一行大标题（约 6–10 英文词 / 10–16 中文字符） |

---

## 3. 硬事实清单（写作时不可更改/虚构的事实）

| 事实 | 内容 |
|------|------|
| 姓名 | 郑博闻 / Bowen Zheng |
| 硕士 | 香港科技大学 HKUST，人工智能硕士 MSc in Artificial Intelligence，2025.09 入学在读 |
| 学士 | 澳门大学 University of Macau，商业智能与数据分析学士 BSc in Business Intelligence and Data Analytics (BIDA)，2020.09–2024.06|
| 实习 1 | 安永 Ernst & Young (China) Advisory，金融服务部实习生（FSO Intern），2024.09–2025.08；3 个项目：银行信用卡额度调整与审批咨询、理财智能营销事件、科技企业全生命周期服务方案 |
| 实习 2 | 北京国家级 ESG 研究机构（Beijing National Institute of ESG），ESG 咨询部实习生，2024.06–2024.09；2 个项目：贸易协会供应链数据库、企业社会贡献量化 |
| 项目 1 | 多智能体 DeFi 审计系统（微众银行 Webank Capstone），2026.02–2026.08，有 GitHub 仓库 |
| 项目 2 | 基于 RAG 的智能汽车知识系统（课程项目 ARIN5203），2025.09–2025.12，有 GitHub 仓库 |
| 项目 3 | 扩展 SFT + GRPO 消融研究（数学推理 LLM），2025.09–2025.12，有 GitHub 仓库 |
| 项目 4 | JIRA 网络安全事件响应（普华永道 PwC Capstone），2024.01–2024.05 |
| 早期项目 | MCM/ICM 五大湖水位优化（2024.02）、R 语言数据挖掘与客户细分（2023）、区块链供应链管理（2023） |
| 语言 | 中文母语、英语流利、粤语会话、德语入门（共 4 门） |

> 写作时可以**提炼、重述、量化**以上事实，但不得虚构新的数字、头衔或成果。若某个量化表述缺乏依据，请用"覆盖 X 场景 / 端到端交付 / 双语报告"等**过程性表述**替代编造指标。

---

## 4. 逐字段文案规格

> 每个字段：**作用**（它在页面上的功能）→ **详略程度**（目标长度）→ **写作要点** → **当前占位文案**（可推翻重写，也可在语义正确时保留）。

### 4.1 Hero 全屏定位区（最重要，HR 6 秒扫描的主战场）

| Key | 作用 | 详略 | 写作要点 | 当前占位（EN / ZH） |
|-----|------|------|---------|-------------------|
| `hero_kicker` | 顶部小字 kicker（mono 大写），建立第一印象领域标签 | ≤ 6 词 / ≤ 12 字 | 领域×领域格式，全大写（英文）；避免空泛 | `Portfolio — AI × Business Analytics` / `个人主页 — AI × 商业分析` |
| `hero_role_pre` `hero_role_post` | 与 `×` 拼成一行角色定位 | 合计约 50 字符 / 22 字 | 结构 = 最高学历背书 × 实战身份；"Big-4 Trained Consultant" 是差异化卖点，建议保留语义 | `MSc Artificial Intelligence @ HKUST ` + ` Big-4 Trained Consultant` / `香港科技大学人工智能硕士 ` + ` 四大咨询实战训练` |
| `hero_positioning` | 定位声明：我连接什么与什么，做什么 | ≤ 2 行（55 词/字） | 一句话讲清双轨价值：LLM 工程能力 + 业务落地；动词开头或"我连接…"句式；可含 1–2 个技术关键词（RAG、多智能体） | `I bridge LLM engineering and business delivery — designing RAG & multi-agent systems that land in regulated, real-world workflows.` / `我连接大模型工程与商业交付——设计能真正落地到受监管、真实业务流程中的 RAG 与多智能体系统。` |
| `cred_hkust` | 背书 chip 1：硕士 | ≤ 22 字符 / 10 字 | 机构缩写 + 学位缩写 | `MSc AI @ HKUST` / `港科大 AI 硕士` |
| `cred_um` | 背书 chip 2：学士 | 同上 | | `BSc BIDA @ UM` / `澳大 BIDA 学士` |
| `cred_ey` | 背书 chip 3：安永 | 同上 | | `Ex-EY FSO` / `安永 FSO 实习` |
| `cred_webank` | 背书 chip 4：微众 | 同上 | | `Webank Capstone` / `微众银行 Capstone` |
| `cred_pwc` | 背书 chip 5：普华 | 同上 | | `PwC Capstone` / `普华永道 Capstone` |
| `hero_keywords` | 技术关键词行（逗号分隔，供 HR 关键词匹配） | 6–10 个词 | ATS 式硬关键词：模型技术 + 语言 + 业务域；中英文各自本地化（如 Credit Risk / 信用风控） | `LLM,RAG,Multi-Agent,SFT / LoRA,Python,SQL,Credit Risk,A/B Testing`（两语言同） |
| `cta_email` | 主 CTA 按钮文字 | ≤ 3 词 / 4 字 | 行动导向 | `Get in Touch` / `联系我` |
| `hero_panel_label` | 右侧数据面板标题（mono 大写） | ≤ 3 词 / 4 字 | | `At a Glance` / `数据速览` |
| `stat_internships` `stat_projects` `stat_domains` `stat_langs` | 数字下方的单位标签（数字本身由数据自动计算：2/7/6/4） | ≤ 3 词 / 6 字 | 英文用复数名词；中文用量词短语（读作"2 段实习经历"） | `Internships/段实习经历`、`Projects/个项目`、`Skill Domains/个技能领域`、`Languages/门语言` |
| `scroll_cue` | 底部滚动提示 | ≤ 4 词 / 8 字 | | `Scroll to explore` / `向下滚动探索` |

### 4.2 Summary 三张能力要点卡（01 区块）

| Key | 作用 | 详略 | 写作要点 | 当前占位（EN / ZH） |
|-----|------|------|---------|-------------------|
| `summary_title` | 章节标题 | ≤ 3 词 / 6 字 | | `Professional Summary` / `专业简介` |
| `cap_ai_title` + `cap_ai_desc` | 能力卡 1：AI 工程 | 标题 ≤ 3 词；描述 ≤ 3 行（20 词/40 字） | 覆盖：LLM 应用、RAG、多智能体、微调（SFT/GRPO）、评估；突出"能独立构建" | `AI Engineering` / `AI 工程`；`Gen-AI systems around LLMs: RAG pipelines, multi-agent frameworks, SFT / GRPO fine-tuning and rigorous evaluation.` / `以大模型为核心的生成式 AI 系统：RAG 流水线、多智能体框架、SFT/GRPO 微调与严谨的效果评估。` |
| `cap_data_title` + `cap_data_desc` | 能力卡 2：数据与风险分析 | 同上 | 覆盖：信用评分卡、ML 风控模型、AUC/KS/PSI 监控、银行受监管数据经验 | `Data & Risk Analytics` / `数据与风险分析`；`Credit scorecards, ML risk models and AUC / KS / PSI monitoring built on regulated banking data.` / `基于受监管银行数据构建信用评分卡、机器学习风险模型与 AUC/KS/PSI 监控体系。` |
| `cap_consulting_title` + `cap_consulting_desc` | 能力卡 3：咨询交付 | 同上 | 覆盖：客户需求对齐、跨干系人协作、高管级交付物；点明"四大训练"来源 | `Consulting Delivery` / `咨询交付`；`Client requirement alignment, cross-stakeholder coordination and executive-ready deliverables, trained in Big-4 engagements.` / `源自四大项目历练：客户需求对齐、跨干系人协作与高管级交付物设计能力。` |

### 4.3 Skills（02 区块）

| 字段 | 作用 | 详略 | 写作要点 |
|------|------|------|---------|
| `skill_title`（i18n） | 章节标题 | ≤ 2 词 / 2 字 | 当前 `Skills` / `技能` |
| `skillCategoryTitles`（content.ts） | 6 个分类卡标题 | ≤ 5 词 / 12 字 | 顺序固定：AI 与大模型 / 机器学习数据科学大数据 / 编程与数据库 / 咨询与风险分析 / ESG / 语言与软技能。可优化措辞但不得增删顺序 |
| `skills[].tags`（content.ts） | 各分类下的技能标签 | 每个标签 ≤ 4 词 | 技术名词保持行业写法；软技能可精炼。**如需增删标签请单独说明**，默认不动 |

### 4.4 Education 时间线（03 区块）

| Key | 作用 | 详略 | 写作要点 | 当前占位 |
|-----|------|------|---------|---------|
| `edu_title` | 章节标题 | ≤ 2 词 | | `Education` / `教育` |
| `edu_hkust_deg` | HKUST 学位名 | 一行 | 官方译名 | `MSc in Artificial Intelligence` / `人工智能硕士` |
| `edu_hkust_course` | 核心课程行 | ≤ 2 行，课程名 5–7 门 | 课程官方名，逗号分隔，结尾省略号 | `Core courses: Foundation Models and Gen AI, ...` / `核心课程：基础模型与生成式 AI、……` |
| `edu_um_deg` | UM 学位名 | 一行 | | `BSc in Business Intelligence and Data Analytics` / `商业智能与数据分析学士` |
| `edu_um_course` | UM 核心课程行 | 同上 | | 同上格式 |
| `edu_um_honor` | 荣誉行 | 一行内 | 荣誉 + 学生代表身份 | `Dean's Honors' List; AACSB student representative.` / `院长荣誉榜；AACSB 学生代表。` |

### 4.5 Industry Experience 时间线（04 区块，HR 深读重点）

结构：2 段经历（EY、ESG 机构），每段含 2–3 个项目子卡；**每个子卡第一条 bullet 常开显示，其余折叠**——因此**第一条 bullet 必须是该项目最有分量、最能体现独立贡献与业务价值的一句**。

| Key | 作用 | 详略 | 写作要点 |
|------|------|------|---------|
| `exp_title` | 章节标题 | ≤ 3 词 / 6 字 | 当前 `Industry Experience` / `行业经验` |
| `exp_ey_role` / `exp_esg_role` | 职位副标题 | ≤ 6 词 / 12 字 | 部门 + 实习身份 |
| `exp_ey_p*_title` 等 | 项目子卡标题 | ≤ 8 词 / 16 字 | 业务对象 + 做了什么类型的事 |
| `exp_ey_p1_d1`–`d4` 等全部 `*_d*` | 项目要点 bullets | 每条 15–35 词 / 30–60 字；每组 3–4 条 | **倒金字塔**：d1 = 最核心贡献（动词开头、点明业务价值/规模/合规语境）；d2–d4 = 方法与产出（模型、工具、交付物）。可量化处量化（模型种类、评分卡类型、报告类型），不可虚构精确业务数字。技术名词保留英文（XGBoost、WOE、AUC/KS/PSI） |

当前 EY p1 占位示例（EN）：
- d1: `Aligned with banking client's risk and compliance requirements, collaborated with algorithm and R&D teams to drive end-to-end delivery of risk control strategy and AI-enabled model solutions (Python, SQL).`
- d2–d4 详见 `src/i18n/en.json`。

### 4.6 Projects（05 区块，技术面试官深读重点）

结构：4 张项目卡；每卡 = 标题 + 一句话摘要（accent 高亮）+ **首条 bullet 常开** + 其余折叠 + 标签 chips。

| Key | 作用 | 详略 | 写作要点 |
|------|------|------|---------|
| `proj_title` | 章节标题 | ≤ 2 词 | 当前 `Projects` / `项目` |
| `proj_p*_title` | 项目标题 | ≤ 8 词 / 16 字 | 技术主体 + 系统类型 |
| `proj_p*_summary` | 一句话定位（高亮行） | 12–18 词 / 20–35 字 | 格式建议：`背书方 | 核心挑战/价值`，如 `Webank Capstone | Full business loop design for DeFi security audit.`；让 HR 3 秒判断项目分量 |
| `proj_p*_d1`–`d3` | 项目 bullets | 每条 15–35 词 / 30–60 字 | d1 = 项目全貌与自己的角色（常开，最重要）；d2–d3 = 关键技术决策、方法、结果。研究型项目（p3）可写结论发现（如"SFT 与 GRPO 功能分离"） |

### 4.7 Early Projects（06 区块）

| Key | 作用 | 详略 | 写作要点 |
|------|------|------|---------|
| `early_title` | 章节标题 | ≤ 3 词 / 6 字 | 当前 `Early Projects` / `早期项目` |
| `early_p*_title` | 行标题 | ≤ 8 词 | 赛事/课题名 + 主题 |
| `early_p*_d1` `d2` | 两行描述（全可见） | 每条 ≤ 20 词 / 40 字 | 比主项目更简短；方法组合 + 目的 |

### 4.8 Beyond Work（07 区块）

| Key | 作用 | 详略 | 写作要点 | 当前占位 |
|------|------|------|---------|---------|
| `extras_title` | 章节标题 | ≤ 3 词 / 4 字 | 可比"更多"更有个性 | `Beyond Work` / `工作之外` |
| `extras_interest_title` | 卡内小标题 | ≤ 2 词 / 2 字 | | `Interests` / `兴趣` |
| `extras_interest_content` | 逗号/顿号分隔的兴趣列表 | 6–10 项 | 渲染成 chips，每项 ≤ 3 词 | `Technology trends, automobiles, consumer electronics, music, movies, singing, badminton, and swimming.` / `AI前沿、科技趋势、电子产品、汽车、音乐、电影、唱歌、羽毛球、游泳。` |

### 4.9 Footer CTA

| Key | 作用 | 详略 | 写作要点 | 当前占位 |
|------|------|------|---------|---------|
| `footer_kicker` | 小字 kicker（mono 大写） | ≤ 3 词 / 4 字 | | `Let's Connect` / `保持联系` |
| `footer_title` | 大标题（页面结尾行动号召） | 6–10 词 / 10–16 字 | 呼应 Hero 定位，带一点个性但不浮夸 | `Let's build something intelligent together.` / `期待与你一起构建智能化的未来。` |
| `footer_sub` | 副文 | ≤ 2 行 / 25 词 | 降低联系门槛（机会/合作/交流均可） | `My inbox is always open — whether it's an opportunity, a collaboration, or just a conversation about AI.` / `我的邮箱随时开放——无论是一次机会、一个合作，还是一场关于 AI 的交流。` |
| `footer_rights` / `footer_built` | 版权行 / 技术栈行 | 固定格式 | 无需改写（姓名随语言变化） | `© 2026 Bowen Zheng` / `© 2026 郑博闻`；`React · Three.js · GSAP`（同） |

---

## 5. 语气与风格总则

1. **具体 > 空泛**：删掉 passionate、hard-working 类形容词；用"构建了 X、交付了 Y、覆盖 Z 场景"。
2. **动词开头**：所有 bullet 以动词起句（Developed / Built / Designed / 对接 / 构建 / 设计）。
3. **适度量化但诚实，不重要的数字不写**：优先使用事实清单里的可验证表述（模型类型、评分卡 A/B/C 卡、报告类型、赛事名）；禁止编造精确业务指标（如"提升 23%"）。
4. **双语对等**：ZH 不是 EN 的直译，是同等信息密度的中文专业表达；技术名词（RAG、LoRA、AUC）两语保留英文。
5. **HR 可扫读**：每条文案独立可读，不依赖上下文；首词承载信息（F 型扫描）。
6. **英文风格**：美式拼写，句末句号，em dash（—）用于定位句破折。
7. **中文风格**：简体；全角标点；破折号用"——"；顿号分隔并列。

---

## 6. 交付格式

请按以下两种格式**任选其一**交付（推荐格式 A）：

### 格式 A：JSON（可直接合入代码）
输出两个完整 JSON 对象（或仅输出有改动的 key）：
```json
// en.json 片段
{
  "hero_positioning": "...",
  "cap_ai_desc": "...",
  ...
}
```
```json
// zh.json 片段
{
  "hero_positioning": "...",
  "cap_ai_desc": "...",
  ...
}
```
若涉及 `content.ts` 中的 `skillCategoryTitles` 或 `skills` 标签调整，单独用一小节说明。

### 格式 B：Markdown 对照表
| Key | EN | ZH | 备注（如有） |
|-----|----|----|-------------|

### 交付前自检清单
- [ ] 每个 key 都有 EN 和 ZH 两份
- [ ] 符合第 2.2 节长度硬约束
- [ ] 未虚构事实清单之外的头衔/数字
- [ ] 所有 bullet 动词开头、独立可读
- [ ] `hero_role_pre/post` 拼接后一行语义完整
- [ ] `hero_keywords`、`extras_interest_content` 保持分隔符格式

---

*本文档由开发 agent 生成于 2026-08；页面代码结构如有后续调整，以代码中的 key 为准。*
