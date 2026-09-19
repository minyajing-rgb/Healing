# Global Map + Timeline Spec / 全球地图与时间线规范

## 1. Product thesis

The map and timeline are the primary navigation, not decorative extras.

A user should be able to ask:

- “世界哪里有植物疗愈？”
- “Where are aromatic healing traditions documented?”
- “声音疗愈在不同文化里分别是什么？”
- “Show Yao bath, onsen, hammam and sauna on one map.”
- “What healing traditions were active around the same century?”
- “How did distillation, pharmacy and aromatherapy evolve?”
- “Where do animal-assisted and nature-based practices appear today?”
- “Show only E3–E5 evidence items.”
- “只看中国/日本/印度/欧洲的草药和浴疗。”
- “Show traditional record, modern evidence and safety side-by-side.”

---

## 2. Map modes / 地图模式

### A. World Atlas / 全球总览
Clustered global map of traditions and modalities.

### B. Material Map / 材料地图
Plants, minerals, aromatics, waters, resins and other materials.

### C. Practice Map / 方法地图
Acupuncture, baths, bodywork, sound, meditation, animal-assisted, ritual etc.

### D. Living Tradition Map / 活态传统
Where practices are currently documented as living traditions.

### E. Historical Map / 历史地图
Map tied to timeline position.

### F. Research & Institution Map / 研究机构
Universities, botanical gardens, museums, research centers, archives, integrative-care institutions.

### G. Journey / Field Map / 线下探索
Public museums, gardens, heritage sites, thermal sites and research destinations.  
No private/sacred/restricted locations.

---

## 3. Critical location relationships

Do not use one generic “location” field. Use:

- `origin_associated_with`
- `historically_documented_in`
- `living_practice_in`
- `biological_distribution`
- `cultivated_in`
- `trade_route_through`
- `research_institution_in`
- `heritage_site_in`

Example: a plant may originate in one region, be cultivated globally, and belong to several healing systems.

---

## 4. Map filters / 地图筛选

**Modality:** Plant · Aroma · Water · Body · Sound · Animal · Nature · Stone · Ritual · Mind · Movement · Energy · Apothecary

**Tradition:** Chinese · Yao · Tibetan · Kampo · Korean · Ayurveda · Siddha · Unani · Thai · Jamu · European herbal · Indigenous/community-specific · modern integrative …

**Era:** premodern / ancient / medieval / early modern / modern / contemporary + exact/approx ranges

**Evidence:** T0–T3 + E0–E5

**Safety:** reviewed / caution / high-risk / unknown

**Cultural access:** public / context-required / restricted / sacred-private

**Media:** photo / botanical plate / audio / video / 3D / source text

**Language:** 中文 / English / source language

---

## 5. Map card / 地图卡片

Each map pin opens a compact card:

```
[Image / botanical plate / scene]
中文名
English name
Local/source-language name

Place / 地点
Tradition / 体系
Modality / 方法
Era / 时期

Traditional record: T?
Modern evidence: E?
Safety: reviewed / caution / unknown

[Story]
[Timeline]
[Sources]
[Explore related]
```

The user can then expand into the full knowledge page.

---

## 6. Timeline architecture / 时间线结构

### Parallel tracks
1. Traditions & philosophies / 传统与思想
2. Medical and materia-medica texts / 医药与本草文献
3. Plants & preparations / 植物与制备
4. Aroma & distillation / 芳香与蒸馏
5. Bath & thermal practices / 浴疗
6. Body techniques / 身体技术
7. Meditation, movement & breath / 冥想运动呼吸
8. Sound & ritual / 声音与仪式
9. Apothecary/pharmacy / 药房与药剂
10. Modern research / 现代研究
11. Regulation / 监管
12. Conservation & cultural rights / 保护与文化权利

### Time precision
Each event stores:
- `date_start`
- `date_end`
- `date_precision: exact | year | decade | century | approximate | unknown`
- `dating_note`
- `contested: true/false`

Never manufacture an exact year where scholarship is approximate.

---

## 7. Map ↔ Timeline interaction

Selecting a point on the timeline:
- changes map to the relevant historical layer;
- highlights related regions/trade routes/practices;
- surfaces sources and media.

Selecting a map region:
- filters timeline to that geography;
- shows parallel traditions;
- offers “compare with another region.”

---

## 8. Compare mode / 对比模式

Side-by-side comparison:

| Dimension | Region/Tradition A | Region/Tradition B |
|---|---|---|
| Worldview | | |
| Plants/materials | | |
| Preparation | | |
| Body model | | |
| Sound/ritual | | |
| Seasonal model | | |
| Evidence | | |
| Safety | | |
| Cultural rights | | |

Compare does **not** rank traditions as better/worse.

---

## 9. Bilingual UX / 中英双语

Every structured field supports:
- `name_zh`
- `name_en`
- `summary_zh`
- `summary_en`
- `local_names[]`

Search supports:
- Chinese
- English
- Latin botanical names
- local/transliterated terms
- aliases and historical spellings

A language toggle must switch navigation and explanatory copy without changing the underlying evidence/safety record.

---

## 10. 3D / immersive extension

### Earth / 地球
3D globe with luminous modality layers.

### Human body / 人体
Modern anatomy and traditional body maps shown as **separate switchable layers**.

### Plant / 植物
3D specimen with root/stem/leaf/flower/fruit, preparation and phytochemistry links.

### Sound / 声音
Interactive spectrogram/waveform for actual acoustics; ritual meaning and clinical evidence displayed separately.

### Aroma lab / 芳香实验室
Plant → harvest → distillation/extraction → aromatic material → historical use → safety/evidence.

---

## 11. First map content waves

### Wave 1 — Visually strong global anchors
Chinese materia medica · Yao bath · Japan/Kampo/onsen/forest bathing · Ayurveda · Unani · Mediterranean herbs/aroma · European apothecary · Thai massage/herbs · Jamu · African medicinal-plant traditions by region · Amazonian/Andean ethnobotany with rights controls · Māori rongoā where public sources allow.

### Wave 2 — Cross-cultural modality maps
Bath / Aroma / Sound / Meditation / Animal-assisted / Horticultural / Stone-mineral.

### Wave 3 — Full knowledge graph
Source-level links, trade routes, institutional history, biodiversity, regulation and research.
