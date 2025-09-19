# @onurlulardan/react-lookup-select

Modal içinde grid ile tekli/çoklu seçim yapan headless ama tema-takılabilir React bileşeni.

## Özellikler

- **Trigger (ComboBox görünümü)**: tıklanınca modal açılır
- **Modal içi Grid**: tekli / çoklu satır seçimi (checkbox'lı veya satıra tıkla)
- **Seçim Mode'ları**: single | multiple
- **Dönüş Değeri**: id ve text alanları kullanıcı tarafından map edilebilir
- **Tam Özelleştirme**: tema, ikon, grid kolonları, hücre render'ları
- **Veri Kaynağı**: data (dizi) veya dataSource (async: sayfalama/sort/search)
- **Erişilebilirlik**: klavye navigasyonu, ARIA rolleri, focus trap
- **Performans**: büyük veri için virtualization opsiyonu

## Kurulum

```bash
npm i @onurlulardan/react-lookup-select
```

```tsx
import { LookupSelect } from '@onurlulardan/react-lookup-select';
import '@onurlulardan/react-lookup-select/styles.css';
```

## Örnek Kullanımlar

### Tekli Seçim – text = name + ' ' + surname

```tsx
<LookupSelect
  mode="single"
  data={users}
  columns={[
    { key: 'name', title: 'Ad' },
    { key: 'surname', title: 'Soyad' },
    { key: 'email', title: 'E-posta' },
  ]}
  mapper={{
    getId: (u) => u.userId,
    getText: (u) => `${u.name} ${u.surname}`,
  }}
  returnShape="id-text"
  onChange={(val) => console.log(val)}
/>
```

### Çoklu Seçim – Custom dönüş

```tsx
<LookupSelect
  mode="multiple"
  data={products}
  columns={[
    { key: 'sku', title: 'SKU' },
    { key: 'title', title: 'Ürün' },
    { key: 'price', title: 'Fiyat' },
  ]}
  mapper={{ getId: (p) => p.id, getText: (p) => p.title }}
  returnShape="custom"
  returnMap={{ map: (p) => ({ key: p.id, label: p.title, p }) }}
  onChange={(vals) => save(vals)}
/>
```

### Server-side veri + arama/sayfalama

```tsx
const dataSource = async (q: QueryState) => {
  const res = await fetch(
    `/api/users?page=${q.page}&size=${q.pageSize}&search=${q.search ?? ''}`
  );
  const json = await res.json();
  return { rows: json.items, total: json.total };
};

<LookupSelect
  mode="multiple"
  dataSource={dataSource}
  pageSize={50}
  columns={[
    { key: 'name', title: 'Ad', sortable: true },
    { key: 'surname', title: 'Soyad', sortable: true },
    { key: 'department', title: 'Birim' },
  ]}
  mapper={{ getId: (u) => u.id, getText: (u) => `${u.name} ${u.surname}` }}
  onQueryChange={(q) => console.log('query changed', q)}
/>;
```

## Temalandırma ve Özelleştirme

### Hazır Temalar

```tsx
{
  /* Default tema */
}
<LookupSelect variant="default" {...props} />;

{
  /* Dark tema */
}
<LookupSelect variant="dark" {...props} />;

{
  /* Minimal tema */
}
<LookupSelect variant="minimal" {...props} />;

{
  /* Compact tema */
}
<LookupSelect variant="compact" {...props} />;
```

### Boyut Seçenekleri

```tsx
{
  /* Küçük boyut */
}
<LookupSelect size="small" {...props} />;

{
  /* Orta boyut (varsayılan) */
}
<LookupSelect size="medium" {...props} />;

{
  /* Büyük boyut */
}
<LookupSelect size="large" {...props} />;
```

### CSS Değişkenleri ile Özelleştirme

```tsx
<LookupSelect
  theme={{
    colorPrimary: '#8b5cf6',
    colorBg: '#faf5ff',
    colorText: '#4c1d95',
    borderRadius: 12,
    spacing: 10,
  }}
  {...props}
/>
```

### CSS Sınıfları ile Özelleştirme

```tsx
<LookupSelect
  classNames={{
    root: 'my-custom-lookup',
    trigger: 'my-custom-trigger',
    modal: 'my-custom-modal',
    grid: 'my-custom-grid',
  }}
  {...props}
/>
```

```css
.my-custom-lookup {
  --lookup-select-color-primary: #10b981;
  --lookup-select-border-radius: 8px;
  --lookup-select-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.my-custom-trigger {
  border: 2px solid #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}
```

### Inline Stiller

```tsx
<LookupSelect
  styles={{
    root: { border: '2px solid #f59e0b', borderRadius: '8px' },
    trigger: { background: '#fef3c7', color: '#92400e' },
    modal: { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  }}
  {...props}
/>
```

### Tüm CSS Özelleştirme Değişkenleri

```css
:root {
  /* Renkler */
  --lookup-select-color-primary: #0066cc;
  --lookup-select-color-primary-hover: #0052a3;
  --lookup-select-color-bg: #ffffff;
  --lookup-select-color-text: #333333;
  --lookup-select-color-border: #d1d5db;

  /* Layout */
  --lookup-select-border-radius: 6px;
  --lookup-select-spacing: 8px;
  --lookup-select-font-size: 14px;

  /* Component özel boyutlar */
  --lookup-select-trigger-height: 36px;
  --lookup-select-modal-width: 600px;
  --lookup-select-grid-row-height: 40px;

  /* Gölgeler */
  --lookup-select-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --lookup-select-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## Geliştirme Aşamasında

Bu paket şu anda geliştirme aşamasındadır. Tam implementasyon için bekleyiniz!

## Lisans

MIT
