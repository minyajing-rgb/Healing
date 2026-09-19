# Database Status V2 / 数据库状态 V2

**Repository:** `minyajing-rgb/Healing`  
**Current graph milestone:** **1,024 structured graph entities**  
**Relationship milestone:** **>8,900 graph relationships**  
**Publication status:** STRUCTURED / SOURCE-QA IN PROGRESS

## Entity composition

| Layer | Count | Purpose |
|---|---:|---|
| Core healing knowledge entities | 500 | traditions, plants/materials, modalities, preparations, texts, places, institutions etc. |
| Beginner-first Story entities | 500 | one-click story doorway for each core entity |
| Global timeline backbone stories | 24 | era-changing map/story anchors |
| **Total** | **1,024** | dynamic map + timeline + story knowledge graph |

## What “1,024 entities” means

This is not a claim that global healing knowledge is “finished.”

It means the repository now has enough structured objects to support the second product milestone:
- map;
- time slider;
- story rail;
- beginner mode;
- bilingual expansion;
- media attachment;
- evidence/safety/source layers.

## Relationship coverage

Wave 1 already contained **5,322** knowledge-graph relationships.

Wave 2 adds:
- each core entity → beginner story;
- story → parent entity;
- story → place;
- story → tradition(s);
- story → modality(ies);
- story → media slot;
- story → timeline binding;
- timeline backbone → place/range/media/source-review.

Therefore the graph is now above the requested **3,000+ relationship** threshold by a wide margin and exceeds **8,900** structural relationships.

## Beginner UX contract

Every Story object starts with:

1. **Where are we? / 我们在哪里？**
2. **When is this? / 现在是什么年代？**
3. **What are we looking at? / 眼前是什么？**
4. **How did people understand/use it then? / 当时的人怎么理解、怎么做？**
5. **What changed next? / 后来发生了什么？**
6. **What do we know today? / 今天我们知道什么？**

This is the canonical “小白 → story → depth” structure.

## Dynamic Map contract

Map state is never static.

`Map State = Geography × Era × Tradition × Modality × Evidence × Media availability`

Moving the timeline changes:
- visible nodes;
- historical routes;
- living traditions;
- highlighted stories;
- right-side image/video rail.

## QA warning

All Wave 1 core entries and Wave 2 story shells are **structured database content**, not automatically medically or historically verified publication copy.

Before an item becomes `PUBLISHED`, it still requires:
- source QA;
- date/era QA;
- botanical/material identity QA when applicable;
- evidence separation;
- safety review;
- cultural-rights review;
- bilingual editorial review.
