# P0-1: Duplike Focus Yonetimi (Kritik Bug)

## Oncelik: P0 (Kritik)
## Durum: [ ] Bekliyor

## Sorun

Modal acildiginda **3 bagimsiz keydown listener** ayni anda aktif oluyor ve birbirleriyle cakisiyor:

### 1. Modal.tsx (satir 38-102)
- Escape handler (satir 54-58)
- Tab focus trap (satir 61-88)
- Initial focus (satir 44-51)

### 2. useAccessibility.ts - useFocusManagement (satir 72-113)
- Tab focus trap (satir 90-106)
- Initial focus (satir 88)

### 3. useAccessibility.ts - useKeyboardNavigation (satir 7-66)
- Escape handler (satir 29-32)
- Ctrl+Enter handler (satir 35-39)

## Etki

- **Cift Escape handler**: Modal.tsx:54 + useKeyboardNavigation:30 ayni anda Escape'i yakalıyor
- **Cift Tab focus trap**: Modal.tsx:61 + useFocusManagement:90 ayni anda Tab'i yakalıyor
- **3 ayri initial focus cagrisi**: Modal.tsx:49, useFocusManagement:88, SearchInput:187 yarisiyor
- Memory leak riski (duplike event listener'lar)
- Focus race condition (hangi elemana focus gidecegi belirsiz)

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/components/Modal.tsx` | 38-102 | Focus trap + Escape handler KALDIRILACAK |
| `src/hooks/useAccessibility.ts` | 72-113 | Tek kaynak olacak, Escape handling eklenecek |
| `src/hooks/useAccessibility.ts` | 29-32 | useKeyboardNavigation'dan Escape KALDIRILACAK |
| `src/components/Modal.tsx` (SearchInput) | 186-189 | Auto-focus useEffect KALDIRILACAK |

## Cozum Plani

### Adim 1: Modal.tsx'den focus trap ve Escape'i kaldir
- Satirler 38-102'deki useEffect'i tamamen kaldir
- Sadece body scroll lock (satirler 106-116) kalsin
- Modal saf bir presentational component olsun

### Adim 2: useFocusManagement'i tek kaynak yap
- Escape key handling ekle
- Modal ref'i parametre olarak al (`document.querySelector` yerine)
- SearchInput'a oncelik ver (data-autofocus attribute ile)

### Adim 3: useKeyboardNavigation'dan Escape kaldir
- Sadece Ctrl+Enter ve ArrowDown/ArrowUp kalsin
- Escape artik useFocusManagement'ta

### Adim 4: SearchInput auto-focus kaldir
- `useEffect` (satir 186-189) sil
- Focus yonetimi tamamen useFocusManagement'a birakılsın

## Dogrulama

- [ ] Modal ac, Escape ile kapat -> tek handler calistigini dogrula
- [ ] Tab/Shift+Tab ile focus trap test et -> tek listener
- [ ] Modal acildiginda SearchInput'a focus gidiyor mu
- [ ] Modal kapandiginda onceki elemana focus donuyor mu
- [ ] DevTools'ta event listener sayisi kontrol et
