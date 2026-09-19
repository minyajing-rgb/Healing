# Earth Healing Content Factory Rules / 内容工厂规则

This file adapts the canonical, status-driven workflow used in the user's Bible project to the Earth Healing knowledge atlas.

## 1. No “chat-complete” fiction

A topic is not complete because it was discussed in chat.

Only repository records with a valid status may be treated as project assets.

## 2. Unit of production

Every content unit must have:

1. stable `id`
2. Chinese + English name
3. entity type
4. geographic relationship(s)
5. tradition(s)
6. modality/material/preparation tags
7. claim list
8. source list
9. evidence level per claim
10. safety record
11. cultural-rights record
12. timeline record when relevant
13. media status
14. publication status

## 3. Production sequence

`DISCOVER → SOURCE → EXTRACT → STRUCTURE → QA → TRANSLATE → MAP → TIMELINE → MEDIA → PUBLISH`

### DISCOVER
Add a candidate without asserting efficacy.

### SOURCE
Find primary/authoritative and scholarly sources.

### EXTRACT
Extract distinct claims, names, dates, geographies and preparation details.

### STRUCTURE
Move into schema-compliant JSON/YAML/database record.

### QA
Check:
- attribution
- evidence
- safety
- botanical/material identity
- regulatory context
- cultural rights
- date/location precision

### TRANSLATE
Normalize Chinese/English and source-language names.

### MAP
Add only verified public-safe geography.

### TIMELINE
Use exact/approximate/contested date fields honestly.

### MEDIA
Attach verified, licensed or user-owned media.

### PUBLISH
Front-end eligible.

## 4. Batch production

Recommended batch = 20–50 records.

Each batch receives:
- batch ID
- scope
- source set
- QA status
- unresolved issues
- duplicate check
- change log

## 5. Priority factories

### Factory A — Chinese Core
中草药 / 针灸 / 艾灸 / 药石 / 食疗 / 药浴 / 瑶浴 / 易经-阴阳五行-节气思想

### Factory B — Aroma & Apothecary
精油 / 芳香疗法 / 香气 / 蒸馏 / 纯露 / 药师制剂 / 欧洲药房与香水史

### Factory C — Global Systems
Ayurveda / Unani / Kampo / Korean / Thai / Jamu / region-specific African / Americas / Oceania

### Factory D — Mind & Sound
冥想 / 呼吸 / 瑜伽 / 气功 / 吟唱 / 音乐 / 鼓 / 颂钵 / 声学 / 振动 / “频率”

### Factory E — Nature & Animals
森林 / 园艺 / 蓝色空间 / 动物辅助 / companion-animal interaction

### Factory F — Ritual & Folk
女巫/民间草药师历史 / charms / incantation / shamanic / curanderismo / ancestral and sacred-place traditions

### Factory G — Evidence & Safety
systematic reviews / guidelines / adverse events / toxicology / interactions / regulation / conservation

## 6. Duplicate control

Before creating a new entity:
- search exact Chinese name
- English/common name
- Latin/scientific name
- transliteration
- historical aliases
- tradition-specific names

Prefer one canonical entity + aliases + tradition-specific relationships.

## 7. Sensitive knowledge

Do not turn restricted/sacred/lineage knowledge into step-by-step public instructions.

Allowed:
- existence
- high-level context
- public history
- community-approved sources

Restricted:
- secret formulas
- sacred coordinates
- closed initiation details
- endangered-species procurement
- hazardous self-treatment instructions

## 8. “Frequency healing” rule

Never put every “frequency” practice into one scientific category.

Tag:
- acoustics
- vibroacoustics
- music
- chanting
- binaural/entrainment
- ritual sound
- metaphysical frequency

Then evidence-review each specific claim independently.

## 9. Definition of done

A **category** is not “done” when there are files.

A production wave is done only when:
- planned record count is reconciled;
- unresolved items are logged;
- duplicate pass is finished;
- source coverage is audited;
- safety/cultural-rights QA is complete;
- bilingual fields are complete;
- map/timeline candidates are reconciled.
