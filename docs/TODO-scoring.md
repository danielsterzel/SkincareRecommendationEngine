# TODO: lepszy scoring produktów

Obecny scoring opiera się na opisie producenta (`targets`), czyli na marketingu.
Cel: odróżniać dobre produkty od słabych na podstawie składu i danych.

## 0. Najpierw naprawić dane

- [ ] Parsowanie `ingredients` dzieli po przecinku, więc `1,2-hexanediol` rozpada się na `'1'` i `'2-hexanediol'`
- [ ] Ostatni składnik ma kropkę na końcu (`'caprylyl glycol.'`), trzeba ją ucinać

## 1. Użyć tego, co już jest w datasecie (bez wiedzy o składnikach)

- [ ] **Stężenie aktywnego składnika** (`concentration-ingredient` + `concentration`): czy mieści się w skutecznym zakresie, np. niacynamid 2–10%, kwas glikolowy 5–10%. Mała tabelka zakresów.
- [ ] **Ocena ważona liczbą opinii** (`rating` + `review-count`): średnia bayesowska, bo 5.0 przy 3 opiniach jest mniej pewne niż 4.3 przy 2000.
  `score = (v / (v + m)) * R + (m / (v + m)) * C`, gdzie `v` = liczba opinii, `R` = ocena produktu, `C` = średnia ocena w datasecie, `m` = próg opinii (np. 50)
- [ ] **Cena za ml** (`price[euro]` / `size[ml]`) jako opcjonalne kryterium

## 2. Pozycja składnika na liście INCI

- [ ] Składniki powyżej ~1% są w INCI ułożone malejąco według ilości. Jeśli „hero ingredient” z marketingu jest daleko na liście (np. po perfumach), to jest go śladowa ilość. To tani detektor słabych produktów.

## 3. Mała baza wiedzy o składnikach (JSON, pisana ręcznie)

- [ ] ~20–30 najważniejszych składników: na jakie concerny działają, jak mocne są dowody, jakie mają negatywne efekty
- [ ] Lista „czerwonych flag”: perfumy, olejki eteryczne, alcohol denat (szczególnie przy skórze wrażliwej)
- [ ] Rozbudować istniejący `backend/app/service/active_ingredients_registry.json`
- [ ] Nie budować encyklopedii, na start wystarczą kluczowe składniki
- [ ] Scoring liczą reguły i dane, a nie LLM. LLM może pomagać tylko w mapowaniu, np. normalizacji nazw.

## 4. Normalizacja składników

Efekty definiujemy raz dla **kanonicznego** składnika, a nie dla każdej nazwy chemicznej.

- [ ] **Słownik aliasów:** nazwa z INCI → kanoniczny klucz, np. `retinyl palmitate`, `retinol`, `retinal` → rodzina `retinoid` + konkretna forma
- [ ] **JSON z efektami** per kanoniczny składnik i forma, zależnie od stężenia, np. `retinol` przy 0.1% vs 1% ma inne ryzyko podrażnień
- [ ] Wykluczyć składniki na receptę (np. tretynoina), bo nie powinny w ogóle trafiać do rekomendacji
- Uwaga: aliasy dalej trzeba wypisać, ale to prosta lista nazwa → klucz. Same efekty są tylko w jednym miejscu.

## Etap 2: „bardzo fajne” dobieranie rutyny (po zrobieniu podstawy 0–4)

Każdy punkt to osobny, mniejszy kawałek. Wszystko to reguły na danych, które i tak będą w JSON-ie składników.

- [ ] **Dopasowanie do obecnej rutyny usera** (najłatwiejsze, zacząć od tego). `currentRoutine` z quick summary już jest. Np. nie polecać drugiego retinoidu, jeśli user go używa, albo oznaczyć produkt jako „zamiennik”, a nie „dodatkowy krok”.
- [ ] **Pora dnia:** w JSON-ie składnika pole `time_of_day` (retinoidy wieczorem, filtr i witamina C rano). Wtedy rutyna dzieli się sama na AM i PM.
- [ ] **Konflikty między składnikami:** lista par w JSON-ie, np. retinoid + kwasy AHA/BHA tego samego wieczoru, retinoid + benzoyl peroxide. Sprawdzać każdą parę w rutynie i w razie konfliktu rozdzielić je na różne pory albo dni.
  - Uwaga: „witamina C + niacynamid” to w dużej mierze mit (stare badania na czystych substancjach). Nie wpisywać jako konfliktu bez sprawdzenia źródeł.
- [ ] **Budowanie całej rutyny krok po kroku:** sloty (oczyszczanie → tonik/serum → krem → SPF rano), w każdym slocie najlepszy produkt z rankingu WSM, z uwzględnieniem konfliktów i pory dnia. Dataset ma już `category` i `sub-category`, więc przypisanie produktu do slotu jest proste.

## 5. Fine-tuning modeli (później)

- [ ] Najpierw zbudować **zestaw testowy** (eval set): przykładowe opisy userów i oczekiwany wynik (concerns, alergeny, routine). Bez niego nie da się sprawdzić, czy fine-tuning cokolwiek poprawił.
- [ ] Sprawdzić, czy prompt i structured output nie wystarczą. Fine-tuning ma sens dopiero, kiedy eval pokazuje powtarzalne błędy, których prompt nie naprawia.
- [ ] Eval set jest potrzebny tak czy inaczej, bo z tych samych danych powstaje zbiór treningowy.
