# Dynamic Map + Story Engine / 动态时代地图与故事引擎

## Product rule

**The map is a function of time.**

`Visible Map State = geography × selected era × tradition × modality × evidence × media availability`

Moving the timeline changes:
- visible traditions;
- historical sites;
- known texts;
- trade/transmission routes;
- plant/material movement;
- baths/apothecaries/gardens;
- people and institutions;
- story recommendations.

The current day must not be projected backward onto earlier centuries.

---

## Timeline controls

### Simple mode / 小白模式
Large eras:
- Ancient / 古代
- Classical / 古典时期
- Medieval / 中世纪
- Early Modern / 近代早期
- Industrial & Modern / 工业与现代
- Contemporary / 当代

### Detail mode / 深入模式
Year/decade/century scrubber.

### Playback mode / 自动播放
Press **▶ Through Time / 穿越时间**:
the date advances and map nodes fade in/out, routes emerge, and the story rail changes.

Playback can be paused at any moment.

---

## Map state transitions

When time changes:
1. nodes that did not yet exist fade out;
2. nodes documented in that period fade in;
3. uncertainty appears as a soft halo rather than a hard point;
4. transmission/trade lines animate only when supported;
5. modern political borders can be muted in historical mode;
6. historical region labels replace misleading modern labels where appropriate.

---

## Story rail beside the map

The right-hand rail is always visual and expandable.

Each card:
- image / 10–30 s video preview;
- plain title;
- place;
- era;
- one-sentence hook;
- 3–5 minute full story;
- “why this matters”;
- related object/plant/person;
- sources.

Example:

> **A Flower Becomes a Medicine, a Perfume, and an Industry**  
> Provence · Early Modern → Today  
> Follow lavender from field cultivation to distillation, perfumery and contemporary aromatherapy.

---

## Story object model

```
story_id
title_zh / title_en
hook_zh / hook_en
beginner_summary_zh / beginner_summary_en

time:
  start
  end
  precision

places[]
people[]
traditions[]
objects[]
plants[]
modalities[]

chapters:
  - scene
  - scene
  - scene

media:
  hero_image
  gallery[]
  video[]
  audio[]
  3d[]

sources[]
evidence_links[]
safety_links[]
related_story_ids[]
```

---

## Media behavior

### Image
tap → full-screen zoom → annotations → related story.

### Video
inline preview → expand → captions/transcript → “show this moment on the map”.

### Audio
listen while map remains active.

### 3D
opens only when useful; never blocks basic reading.

---

## Map-to-story interaction

**Click a map node**
→ opens a 10-second explanation  
→ suggests 1–3 stories  
→ “show earlier / show later”.

**Click a story**
→ map flies to relevant region  
→ timeline moves to story date  
→ related nodes highlight.

**Click a plant/material**
→ show origin, documented use, cultivation and transmission as separate layers.

---

## Beginner narrative template

Every historical story answers in this order:

1. **Where are we? / 我们在哪里？**
2. **When is this? / 现在是什么年代？**
3. **What are we looking at? / 眼前是什么？**
4. **What did people believe or do? / 当时的人怎么理解、怎么做？**
5. **What changed next? / 后来发生了什么？**
6. **What do we know today? / 今天我们知道什么？**

This avoids dumping encyclopedic facts before the user has a mental model.

---

## Dynamic map data requirements

Every temporal/geographic relation must support:
- `valid_from`
- `valid_to`
- `date_precision`
- `place_precision`
- `confidence`
- `source_ids[]`
- `display_in_beginner_mode`

No exact animation date may be invented from an approximate historical range.

---

## Homepage promise

> **Pick a place. Move through time. Open a story.**  
> **选一个地方，滑过年代，点开一个故事。**

This is the primary Earth Healing interaction loop.
