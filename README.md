# uatz-web

Frontend do projeto UATZ construído com Angular 19: módulos com carregamento lazy, componentes
**ng-zorro-antd** e textos centralizados em `environments/language/idioma.ts`.

## Escopo

- Login
- Dashboard (visão geral dos pedidos)
- Pedidos de orçamento: fila, detalhe, revisão, distribuição e cotação
- Simulação de mensagem do WhatsApp
- Clientes e fornecedores (área do administrador)

## Stack

- Angular 19 (NgModule + lazy `loadChildren`)
- ng-zorro-antd 19 (Ant Design), SCSS
- crypto-js (cifra o localStorage via `Storage`)

## Estrutura

```
src/
  app/
    app.module.ts          módulo raiz (interceptor + i18n pt_BR)
    app-routing.module.ts  rotas lazy + guards
    app.component.*        shell (nz-layout, menu, sessão, loader global)
    components/            componentes compartilhados (componentes.module.ts)
    core/interceptors/     HttpConfigInterceptor (token, loader, toast de erro)
    guards/                AuthGuard, AdminGuard, VisitanteGuard
    pages/private/         dashboard, orcamento (4 telas), cliente, fornecedor
    pages/public/          login
    services/              service.ts (base) + base/ + um pacote por domínio
    static/                constants, enum, helpers, model (DTOs), storage, utils, validators
  environments/            environment[.prod].ts + language/idioma.ts
  styles.scss              estilos globais
  variables.scss           tokens da marca
```

## Rotas

| Rota | Tela | Acesso |
|---|---|---|
| `/public/login` | Login | visitante |
| `/` | Dashboard | autenticado |
| `/orcamentos` | Fila de pedidos | autenticado |
| `/simular-whatsapp` | Simulação WhatsApp | admin/operador |
| `/orcamentos/:id` | Detalhe do pedido | autenticado |
| `/orcamentos/:id/cotacao-enviada` | Orçamento enviado | fornecedor |
| `/clientes` | Clientes | admin |
| `/fornecedores` | Fornecedores | admin |

## Como rodar

Pré-requisitos: Node.js 22+ e a API `uatz-server` no ar em `http://localhost:8081`.

```powershell
npm install
npm start
```

A aplicação sobe em http://localhost:4200. O endereço da API fica em
`src/environments/environment.ts` (`urlServidor`).

Build de produção:

```powershell
npm run build
```

## Projetos relacionados

- `../../dsv-quarkus/uatz-server` — API REST
- `../../dsv-quarkus/uatz-model` — entidades JPA
- `../../dsv-quarkus/uatz-migration` — schema do banco (Liquibase)
