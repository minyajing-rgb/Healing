# Earth Healing / 地球疗愈

> A bilingual, map-first, timeline-first knowledge atlas of humanity's healing traditions, nature-based practices, sensory therapies, ritual traditions, materia medica, and modern evidence.
>
> 一个以 **全球地图 + 时间线 + 知识图谱 + 双语学习路径** 为核心的人类疗愈知识全集。

## Vision / 愿景

Earth Healing is not a single-school “TCM website” or a generic wellness blog. It is a structured global atlas connecting:

- 植物与中草药 / herbs & medicinal plants
- 芳香疗法、精油、香气与蒸馏 / aromatherapy, essential oils, scent & distillation
- 药师制剂与传统配制 / apothecary preparations & traditional formulations
- 药浴、瑶浴、温泉、蒸浴、水疗 / medicinal bathing, Yao bath, thermal & water traditions
- 针灸、艾灸、拔罐、刮痧、推拿与身体疗法 / acupuncture, moxibustion, cupping, gua sha, bodywork
- 冥想、呼吸、导引、瑜伽、气功 / meditation, breath, movement, yoga, qigong
- 吟唱、咒音、音乐、鼓、颂钵、声疗与“频率/共振”传统 / chant, mantra, music, drums, bowls, sound and frequency traditions
- 动物辅助疗愈、园艺疗愈、森林疗愈与自然接触 / animal-assisted, horticultural, forest and nature-based practices
- 药石、矿物、泥土、晶石等传统 / medicinal minerals, clay, stone and crystal traditions
- 民间疗法、女巫/草药师、巫医/萨满、祖传与仪式性疗愈 / folk, witch/herbalist, shamanic, ancestral and ritual healing traditions
- 易经、阴阳五行、节气与传统养生思想 / Yijing, yin-yang, five phases, seasonal living and classical health philosophy
- 现代整合医学、研究证据、安全性与监管 / modern integrative care, evidence, safety and regulation

## Core product model / 核心产品模型

```
GLOBAL MAP
  ↕
TIMELINE
  ↕
TRADITION ↔ MODALITY ↔ MATERIAL ↔ BODY/MIND ↔ PLACE
  ↕
PRIMARY SOURCES ↔ MODERN EVIDENCE ↔ SAFETY ↔ REGULATION
  ↕
BILINGUAL STORY / LEARNING / AI SEARCH
```

Every page should be explorable in both **中文 / English**.

## Canonical rule / 核心规则

Traditional, cultural, spiritual and metaphysical claims are preserved as part of human history and living traditions, but they are **not automatically presented as established biomedical facts**.

Every knowledge unit should separate:

1. **Traditional / historical record**
2. **Living cultural practice**
3. **Modern scientific evidence**
4. **Safety / contraindications**
5. **Regulatory status**
6. **Cultural-rights / access notes**

This distinction is mandatory for herbs, essential oils, acupuncture, sound/frequency work, ritual healing, crystals, energy systems, animal-assisted practices and all other modalities.

## Repository status / 仓库状态

**Status: INITIAL_SCAFFOLD**

The repository currently contains the canonical information architecture, taxonomy, map/timeline specification, evidence policy, visual system and first data schemas. It is **not yet the complete global dataset**.

A topic may only be marked `REVIEWED` after source and evidence QA.

## Canonical files / 核心文件

- `MASTER_INDEX.md` — 全球全集总索引 / global master index
- `docs/GLOBAL_TAXONOMY_BILINGUAL.md` — 双语分类体系
- `docs/MAP_TIMELINE_SPEC.md` — 全球地图 + 时间线产品规范
- `docs/VISUAL_SYSTEM.md` — “Botanical Future Heritage” 视觉系统
- `docs/EVIDENCE_SAFETY_POLICY.md` — 证据、安全与文化权利标准
- `schemas/healing-entry.schema.json` — 核心知识条目 schema
- `data/taxonomy.v1.json` — 可机器读取的第一版 taxonomy
- `assets/REFERENCE_ASSET_REGISTER.md` — 当前聊天参考图/视频登记（未提交二进制）
- `ROADMAP.md` — Database → Map/Timeline → Web → AI → 3D → Offline

## Content status model / 内容状态

`PLANNED → SOURCE_FOUND → EXTRACTED → STRUCTURED → REVIEWED → BILINGUAL → MAP_READY → TIMELINE_READY → PUBLISHED`

Media assets use a separate status:

`REFERENCE_ONLY → IMPORTED → VERIFIED → COMMITTED → PUBLISHED`

## UX direction / 体验方向

The product should feel like:

**botanical field atlas × future nature lab × cinematic travel documentary × interactive world map**

Not like a hospital portal, occult shop, or old paper encyclopedia.

Primary exploration doors:

**Plants · Aroma · Water · Body · Food · Movement · Mind · Sound · Animals · Nature · Stone · Ritual · Energy · Time**

---

### Safety note / 安全说明

This project is an educational and cultural knowledge atlas. It is not a substitute for diagnosis, emergency care, prescription decisions, licensed clinical practice, or individualized medical advice.
