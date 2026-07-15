# POC catalogue audit

Checked: 2026-07-15

## Record count

- The corrected supplied source contains **110 non-empty records**.
- It contains **110 exact-unique records** and no exact duplicate lines.
- The catalogue now aligns exactly with the confirmed public headline of **110 POCs across all partners**.
- Repeated company names remain separate when the partner, site, track, or demo designation differs.

The verbatim input is preserved in `data/poc-source-list.txt`.

## Original-site media and description audit

The public WordPress media API reported 483 media items during the audit. The original POC Playground page publishes technical descriptions for only five companies: CorrActions, Tactile Mobility, Maradin, Coreteel, and Actasys. The public Portfolio endpoint exposes CorrActions, SafeMode, AutoTrust, and ThermoTerra entries, but several Portfolio descriptions contain placeholder or lorem-ipsum text and were not reused as factual copy.

Original-site media could be matched to these **16 supplied records across eight company names**:

1. Coreteel@ MedOne
2. Coreteel@ Laktechniek
3. Coreteel@ Bazan
4. Thermo Terra @ Venta
5. Tactile mobility @ Hyundai
6. CorrActions @ Hyundai
7. Autotrust Hyundai Mobis
8. SafeMode Galil Maaravi
9. SafeMode Negev Arava
10. SafeMode UTI
11. SafeMode Emek Hayarden
12. Maradin Hyundai
13. SafeMode Taavura Tours
14. Movilit SafeMode
15. SafeMode Tashtit
16. Actasys Hyundai

The other **94 records in `data/poc-source-list.txt` do not have a defensible original-site media match**. They use a deliberately typographic, non-photographic identifier in the gallery so an unrelated image is never presented as evidence of a POC.

## Copy and classification policy

- The five POC Playground descriptions are paraphrased conservatively in English and Hebrew.
- SafeMode, AutoTrust, and ThermoTerra use matched original-site media, but generic POC copy because the available original Portfolio descriptions are not reliable.
- Every other record names the supplied company and partner/site pairing, and explicitly says that the public technical scope is unavailable.
- Sector tags follow the partner/site operating context when the supplied line contains no category. They are navigation aids, not claims about a startup's complete market focus.
- Obvious display corrections such as `Al` to `AI` are limited to clearly named AI brands. The original line remains available in the source file.
- Ambiguous source strings are preserved in the source file rather than silently deleted. Display-only corrections are used for obvious brand spelling, such as `Apallo Power` to `Apollo Power`.

## Public sources

- Original POC Playground: https://quantum-hub.com/poc-playground/
- WordPress media API: https://quantum-hub.com/wp-json/wp/v2/media
- WordPress Portfolio API: https://quantum-hub.com/wp-json/wp/v2/portfolio
