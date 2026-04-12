# P1-6: Kod Hijyeni - Turkce Yorumlar ve Duplike Config

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Sorun 1: Turkce Yorum Satirlari

Kodun tamami Ingilizce yazilmis (degisken isimleri, JSDoc, i18n keys) ama 2 yorum satiri Turkce:

### state.ts:130
```typescript
// Modal açıkken onChange tetikleme - sadece geçici selection state güncelle
// onChange sadece confirmSelection'da tetiklenecek
```

### state.ts:225
```typescript
// Modal açılırken mevcut seçimleri backup al
```

## Sorun 2: Duplike .prettierrc Dosyalari

Proje kokunde hem `.prettierrc` hem `.prettierrc.json` var. Prettier her ikisini de arar ve hangisini kullanacagi belirsiz olabilir.

## Etkilenen Dosyalar

| Dosya | Degisiklik |
|-------|------------|
| `src/internal/state.ts` | Satir 130-131 ve 225: Turkce -> Ingilizce |
| `.prettierrc.json` | SIL (`.prettierrc` kalsin) |

## Cozum

### state.ts:130-131
```typescript
// Don't trigger onChange while modal is open - only update temporary selection state
// onChange will be triggered in confirmSelection
```

### state.ts:225
```typescript
// Backup current selections when modal opens
```

### .prettierrc.json
Sil. `.prettierrc` dosyasi yeterli.

## Dogrulama

- [ ] Tum yorum satirlari Ingilizce
- [ ] Tek bir prettierrc dosyasi var
- [ ] `npm run lint` basarili
