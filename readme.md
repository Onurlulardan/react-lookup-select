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

## Geliştirme Aşamasında

Bu paket şu anda geliştirme aşamasındadır. Tam implementasyon için bekleyiniz!

## Lisans

MIT
