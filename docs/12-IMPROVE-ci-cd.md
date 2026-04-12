# P1-8: CI/CD Pipeline Eksik

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Mevcut Durum

- GitHub Actions workflow YOK
- GitLab CI, CircleCI veya baska CI config YOK
- Husky `prepare` script'i var ama `.husky` dizini YOK
- Manuel build ve publish yapiliyor

## Olusturulmasi Gereken Dosyalar

### 1. `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type Check
        run: npx tsc --noEmit
      
      - name: Test
        run: npm run test -- --run --coverage
      
      - name: Build
        run: npm run build
      
      - name: Check bundle size
        run: |
          ls -la dist/
          du -sh dist/
```

### 2. Husky + lint-staged Setup

```bash
# .husky/pre-commit
npx lint-staged
```

**package.json'a ekle:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### 3. Opsiyonel: NPM Publish Workflow

```yaml
# .github/workflows/publish.yml
name: Publish

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Dogrulama

- [ ] CI workflow push'ta calisiyor
- [ ] PR'larda lint + test + build calisiyor
- [ ] Husky pre-commit hook calisiyor
- [ ] lint-staged sadece degisen dosyalari kontrol ediyor
