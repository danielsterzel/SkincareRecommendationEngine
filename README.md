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