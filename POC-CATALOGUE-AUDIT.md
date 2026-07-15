# POC catalogue audit

Checked: 2026-07-15

## Record count

- The supplied source contains **195 non-empty records**.
- It contains **195 exact-unique records** and no exact duplicate lines.
- The confirmed public headline remains **110 POCs across all partners**. The supplied list cannot be reconciled to that headline without an internal source of truth because it includes repeated technologies at different sites, demo-labelled entries, Quantum-labelled projects, and ambiguous source wording.
- The website therefore calls the live total “supplied records” and does not replace the confirmed 110 POC metric.

The verbatim input is preserved in `data/poc-source-list.txt`.

## Original-site media and description audit

The public WordPress media API reported 483 media items during the audit. The original POC Playground page publishes technical descriptions for only five companies: CorrActions, Tactile Mobility, Maradin, Coreteel, and Actasys. The public Portfolio endpoint exposes CorrActions, SafeMode, AutoTrust, and ThermoTerra entries, but several Portfolio descriptions contain placeholder or lorem-ipsum text and were not reused as factual copy.

Original-site media could be matched to these **12 supplied records across seven company names**:

1. Coreteel@ MedOne
2. Coreteel@ Laktechniek
3. Coreteel@ Bazan
4. Tactile mobility @ Hyundai
5. CorrActions @ Hyundai
6. Maradin Hyundai
7. Actasys Hyundai
8. Autotrust Hyundai Mobis
9. SafeMode Galil Maaravi
10. SafeMode Negev Arava
11. SafeMode UTI
12. SafeMode Emek Hayarden

The other **183 records in `data/poc-source-list.txt` do not have a defensible original-site media match**. They use a deliberately typographic, non-photographic identifier in the gallery so an unrelated image is never presented as evidence of a POC.

## Copy and classification policy

- The five POC Playground descriptions are paraphrased conservatively in English and Hebrew.
- SafeMode and AutoTrust use matched original-site media, but generic POC copy because the available original Portfolio descriptions are not reliable.
- Every other record names the supplied company and partner/site pairing, and explicitly says that the public technical scope is unavailable.
- Sector tags follow the partner/site operating context when the supplied line contains no category. They are navigation aids, not claims about a startup's complete market focus.
- Obvious display corrections such as `Al` to `AI` are limited to clearly named AI brands. The original line remains available in the source file.
- Ambiguous source strings are preserved rather than silently deleted. In particular, the confirmed 110 headline is not recalculated from this list.

## Public sources

- Original POC Playground: https://quantum-hub.com/poc-playground/
- WordPress media API: https://quantum-hub.com/wp-json/wp/v2/media
- WordPress Portfolio API: https://quantum-hub.com/wp-json/wp/v2/portfolio
