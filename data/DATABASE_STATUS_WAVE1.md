# Database Status — Wave 1 / 第一轮数据库状态

## Current production target

- **500 Canonical Entries**
- **5,000+ explicit relationships**
- bilingual zh/en display names
- beginner Story Card fields
- map slots
- timeline slots
- media slots
- evidence slots
- safety slots

## Coverage plan

| Cluster | Target |
|---|---:|
| Chinese materia medica | 105 |
| Chinese core systems | 20 |
| Aroma & essential oils | 71 |
| Apothecary & preparations | 45 |
| Global traditional systems | 80 |
| Water & bath | 35 |
| Sound & chant | 35 |
| Nature & animals | 35 |
| Folk / ritual / stone / energy | 35 |
| Texts / history / institutions | 39 |
| **Total** | **500** |

## Status meaning

Wave 1 entries are **STRUCTURED**, not yet medically or historically “verified complete”.

Each entry carries:
- `qa_status: PENDING_SOURCE_AND_SAFETY_REVIEW`

This prevents database scale from being mistaken for evidence validation.

## Wave 2

After Wave 1 source/safety QA:
- expand to **1,000+ entities**;
- normalize aliases;
- add claim-level evidence records;
- add public-safe historical geocoding;
- add source-backed temporal ranges;
- exceed **3,000 cross-entity semantic relationships** in addition to structural slots;
- build story chapters and media links.

## Publishing gate

No entry becomes `PUBLISHED` simply because it exists in the data file.
