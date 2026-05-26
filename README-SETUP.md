# sorel_page — catalogue vitrine

Site React + API Express + Prisma sur MySQL **sorel_local** (tables `categories` et `catalogue`).

## Configuration

Copier `.env.example` vers `.env` et adapter `DATABASE_URL`.

## Lancer

```bash
npm install
npx prisma generate
npm run dev:full
```

- Front : http://localhost:5173/catalogue
- API : http://localhost:3001/api/categories

Ne pas lancer `db:push` si les tables existent déjà.
