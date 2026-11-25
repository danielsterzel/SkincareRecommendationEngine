# Skincare Recommendation Engine

## Tests

Manual Evaluation consists of these marks:
- 2: Relevant to the problem and does not introduce any conflicting ingredients
- 1: Relevant to the problem but does introduce conflicting ingredients or indirectly supports concern
- 0: Not relevant or not applicable in any way

### Test 1: Wrinkles and Dehydration

**User Input:**

I'm 29 years old, and I've started noticing fine lines around the outer corners of my eyes, especially when I smile. They're much more noticeable after a poor night's sleep, and my face looks dehydrated. I don't want an intensive anti-aging routine or cosmetic procedures, just a sensible, gentle daily skincare routine. My forehead is still pretty smooth.

| Recommended Product | WSM Score | Manual Evaluation | Model |
|---------------------|-----------|-------------------|-------|
| The Ordinary Natural Moisturizing Factors + HA | 0.500 | 2 | GPT-5.4 mini |
| The Ordinary Argireline Solution 10% | 0.500 | | GPT-5.4 mini |
| The Ordinary Multi-Peptide + HA Serum | 0.500 | | GPT-5.4 mini |
| The Ordinary Multi-Peptide Eye Serum | 0.500 | | GPT-5.4 mini |
| The Ordinary Retinol 0.5% in Squalane | 0.500 | | GPT-5.4 mini |
| The Ordinary Marine Hyaluronics | 0.500 | | GPT-5.4 mini |
| The Ordinary Amino Acids + B5 | 0.500 | | GPT-5.4 mini |
| The Ordinary PHA 5% Exfoliating Lip Serum | 0.500 | | GPT-5.4 mini |

---

### Test 2: Clogged Pores + Acne

**User Input:**

The worst area is probably my forehead. I have these small bumps under the skin that I can't really pop. Every now and then, I also get a painful pimple along my jawline. My oily T-zone doesn't bother me nearly as much as the fact that my pores look clogged. I'm not really aiming for glass skin — I'd just prefer fewer unexpected breakouts.

**Total Latency:** 32966 + 3067 ms

| Recommended Product | WSM Score | Manual Evaluation | Model |
|---------------------|-----------|-------------------|-------|
| The Ordinary Niacinamide 10% + Zinc 1% | 0.604 | | GPT-5.4 mini |
| The Ordinary Sulfur 10% Powder-to-Cream Concentrate | 0.604 | | GPT-5.4 mini |
| The Ordinary Salicylic Acid 2% Anhydrous Solution | 0.396 | | GPT-5.4 mini |
| The Ordinary Salicylic Acid 2% Solution | 0.396 | | GPT-5.4 mini |
| The Ordinary Salicylic Acid 2% Masque | 0.396 | | GPT-5.4 mini |
| The Ordinary Salicylic Acid 0.5% Body Serum | 0.396 | | GPT-5.4 mini |
| CeraVe Blemish Clay-to-Foam Cleanser | 0.396 | | GPT-5.4 mini |
| CeraVe Foaming Cleanser | 0.396 | | GPT-5.4 mini |

---

### Test 3: Eye Area

**User Input:**

I have dark circles under my eyes even when I get enough sleep. In the morning, I also experience puffiness that only goes away after a few hours. I haven't noticed any wrinkles, though, and they aren't my priority. I'd like to know whether any skincare product can actually make a noticeable difference here, or whether I should keep my expectations realistic.

**Total Latency:** 2891 + 1695 ms

| Recommended Product | WSM Score | Manual Evaluation | Model |
|---------------------|-----------|-------------------|-------|
| The Ordinary Caffeine Solution 5% + EGCG Eye Serum | 0.813 | | GPT-5.4 mini |
| The Ordinary Multi-Peptide Eye Serum | 0.813 | | GPT-5.4 mini |
---

## LLM-as-a-Judge

Recommendations are evaluated automatically by an LLM judge (`backend/app/service/judge/`).
The judge runs in two steps:

1. **Extraction judge** – compares the user's input with the `UserSkinContext` extracted by the
   pipeline model (concerns, goals, skin type, sensitivity, allergens, previous reactions, routine).
2. **Product judge** – scores every recommended product on the same 0/1/2 scale as the manual
   evaluation above, using ingredients, targets and application area from the dataset.

Run it from `backend/`:

```bash
uv run python -m app.service.judge.evaluation
```

Results are saved to `backend/app/service/judge/results/`.

### Run 2026-11-25

Pipeline model: GPT-5.4 mini · Judge model: Claude Haiku 5.5 · 3 test cases

| Case | Extraction score | Extraction match | Products 2 / 1 / 0 | Judge tokens (in / out) | Judge latency |
|------|------------------|------------------|--------------------|-------------------------|---------------|
| Redness + dryness after actives | 1 | 62% | 2 / 6 / 2 | 6821 / 3513 | 18.6 s |
| Post-acne marks + uneven tone | 2 | 88% | 5 / 5 / 0 | 7664 / 4808 | 22.0 s |
| Clogged pores + breakouts | 1 | 72% | 5 / 5 / 0 | 6120 / 3712 | 17.5 s |

Total judge cost for the run: about $0.01.

**Issues in the engine found by the judge:**

- The same product appears twice in the ranking (for example *Niacinamide 10% + Zinc 1%*,
  *Rice Lipids + Ectoin Microemulsion*).
- Products for the wrong body area are recommended for facial concerns (lip serum, eye cream,
  body lotion). Filtering by `application_area` is still missing.
- Exfoliating acids are recommended to a user who explicitly stopped using acids.
- Extraction adds `visible_shine` for a user who said their oily T-zone does not bother them
  (matches the gold label in `aurelia_user_texts_20_gold.json`).

**Known judge mistakes:**

- Flags missing details that are implied by common sense, for example that SPF is applied in the
  morning.
- Sometimes assumes the user's gender in the report.

---

## Fine-tuning (planned)

The goal is to replace the paid API model used for structured extraction (user text → `UserSkinContext`)
with a fine-tuned Gemma 4 model (E4B, instruction-tuned) trained with LoRA / QLoRA and running locally.

### Goals

| # | Goal | How it is achieved | Metric |
|---|------|--------------------|--------|
| 1 | Replace the paid model | LoRA fine-tuning on data generated by the current API model (teacher) | Extraction score vs. teacher on the gold set, cost per request, latency |
| 2 | Output as deterministic as possible | Greedy decoding (temperature 0), constrained decoding to the JSON schema, fine-tuning for stable content | % of valid JSON outputs, agreement between outputs for paraphrased inputs |
| 3 | Cosmetic nomenclature | Training examples mapped to the project's taxonomy (`normalized-targets.json`, `skin_targets.json`) | % of concerns mapped to the correct normalized target |
| 4 | Strict rule following | Rules encoded in training data, including negative examples; post-validation against the allowed vocabulary | % of rule violations flagged by the LLM judge |
| 5 | Skin analysis from photos (later stage) | Separate vision fine-tuning of the multimodal model | To be defined |

### Rules the model must follow

- Do not diagnose medical conditions; describe only cosmetic concerns.
- Do not draw conclusions that are not supported by the user's text.
- Use only terms from the project's taxonomy.
- Return `null` / unknown when information is missing or ambiguous instead of guessing.

### Baseline

Current extraction match of the pipeline model (GPT-5.4 mini) from the LLM-as-a-Judge run on 2026-11-25:
62%, 88% and 72% on the three test cases. The fine-tuned model is compared against these numbers.
