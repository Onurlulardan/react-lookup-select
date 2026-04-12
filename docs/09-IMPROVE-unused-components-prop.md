# P1-5: `components` Prop Tanimli Ama Kullanilmiyor

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Sorun

`types.ts`'de `ComponentsOverrides` tipi tanimli ve `LookupSelectProps`'da kabul ediliyor, ama `LookupSelect.tsx` bu prop'u hic destructure veya kullanmiyor.

### types.ts'deki Tanim

```typescript
type ComponentsOverrides = {
  Trigger?: React.ComponentType<any>;
  Modal?: React.ComponentType<any>;
  Grid?: React.ComponentType<any>;
  Checkbox?: React.ComponentType<any>;
  Icon?: React.ComponentType<any>;
};
```

### LookupSelectProps'da Kabul Ediliyor

```typescript
type LookupSelectProps<T> = {
  // ... diger props
  components?: ComponentsOverrides;
  // ...
};
```

### LookupSelect.tsx'de KULLANILMIYOR

`components` prop destructure bile edilmiyor. Kullanici bu prop'u set ederse hicbir etkisi yok.

## Etki

- Yaniltici API yuzey alani
- Kullanici `components` prop'unu kullaninca calismadigi icin kafasi karisiyor
- TypeScript autocompletion'da gorunuyor ama ise yaramiyor

## Etkilenen Dosyalar

| Dosya | Degisiklik |
|-------|------------|
| `src/internal/types.ts` | ComponentsOverrides + components prop'u kaldir VEYA implement et |
| `src/components/LookupSelect.tsx` | Implement etme durumunda destructure + kullan |
| `src/index.ts` | Export'tan kaldir (eger silinirse) |

## Cozum Secenekleri

### Secenek A: Kaldir (Onerilen - Basit)
Zaten `renderTrigger`, `renderModal`, `renderGrid` gibi render prop'lar var. `components` prop'u gereksiz bir duplikasyon.

### Secenek B: Implement Et
Her component icin override mekanizmasi ekle:
```typescript
const TriggerComponent = components?.Trigger || Trigger;
const ModalComponent = components?.Modal || Modal;
// ...
```

## Oneri

**Secenek A** oneriliyor. Render props zaten ayni isi daha esnek yapiyor. `components` prop'u kaldirilarak API temizlenmeli.

## Dogrulama

- [ ] `ComponentsOverrides` tipi kaldirildi (veya implement edildi)
- [ ] `components` prop `LookupSelectProps`'dan kaldirildi
- [ ] `ComponentsOverrides` export'tan kaldirildi
- [ ] Build basarili, mevcut kullanim bozulmuyor
