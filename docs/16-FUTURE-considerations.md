# P3: Gelecek Degerlendirmeler

## Oncelik: P3 (Uzun Vadeli)
## Durum: [ ] Planlanacak

Bu ozellikler su an gerekli degil ama projenin buyumesiyle degerlendirilmeli.

---

## 1. Infinite Scroll
**Aciklama:** Pagination'a alternatif. Kullanici asagi scroll ettikce yeni veriler yuklenir.
**Karmasiklik:** Yuksek - Cursor-based data fetching, VirtualGrid scroll pozisyonu ile entegrasyon gerektirir.
**Oneri:** `loadMore` callback pattern'i ile opsiyonel olarak eklenebilir.

---

## 2. Column Resizing
**Aciklama:** Sutun genisliklerini surukle-birak ile ayarlama.
**Karmasiklik:** Yuksek - Mouse/touch event handling, min/max genislik, persist state.
**Oneri:** Cok karmasik. Kullanicilara `renderGrid` ile 3. parti table kutuphanesi (react-table, tanstack-table) kullanmalarini onerin.

---

## 3. Column Visibility Toggle
**Aciklama:** Sutunlari gizle/goster dropdown menu'su.
**Karmasiklik:** Orta - Visibility state + columns filtreleme.
**Oneri:** Grid header'a bir dropdown eklenebilir. `columns` prop'una `hidden` field'i eklenebilir.

---

## 4. Row Grouping
**Aciklama:** Satirlari bir sutun degerine gore gruplama.
**Karmasiklik:** Cok Yuksek - Veri yapisi degisikligi, nested rendering, expand/collapse state.
**Oneri:** V2 icin degerlendir.

---

## 5. Export Selected Data
**Aciklama:** Secili satirlari CSV/JSON olarak export etme.
**Karmasiklik:** Dusuk - Utility fonksiyon.
**Oneri:** Ayri bir export fonksiyonu olarak sunulabilir:
```typescript
import { exportToCSV, exportToJSON } from 'react-lookup-select/utils';
```

---

## 6. CHANGELOG.md
**Aciklama:** Versiyon takibi ve degisiklik kaydi.
**Oneri:** `changesets` veya `standard-version` ile conventional commits'e dayali otomatik CHANGELOG.

---

## 7. Modal Acma/Kapama Animasyonu
**Aciklama:** CSS transition ile fade + scale animasyonu.
**Karmasiklik:** Orta - `onTransitionEnd` ile unmount geciktirme gerekebilir.
**Oneri:** CSS-only animasyon eklenebilir:
```css
.lookup-select__modal-overlay {
  animation: fadeIn 150ms ease-out;
}
.lookup-select__modal {
  animation: scaleIn 200ms ease-out;
}
```

---

## 8. Tooltip for Truncated Content
**Aciklama:** Uzun hucre icerigi kesildiginde tooltip gostermek.
**Karmasiklik:** Orta - Overflow detection + tooltip positioning.
**Oneri:** `title` attribute basit cozum. Custom tooltip icin `renderCell` kullanilabilir.

---

## Onceliklendirme Notu

Bu ozelliklerden hangilerinin eklenmesi gerektigine topluluk geri bildirimi ve kullanim verileri dogrultusunda karar verilmeli. Hepsini ayni anda eklemeye calismak projeyi gereksiz karmasiklastirabilir.
