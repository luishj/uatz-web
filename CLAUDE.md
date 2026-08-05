# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 19 SPA — the web front end of the UATZ platform. It consumes the `uatz-server` REST API
(Quarkus, `http://localhost:8081/api` in dev). The app is **NgModule-based** with lazy loaded pages,
**ng-zorro-antd** (Ant Design) components and Portuguese domain naming.

Related repositories (all under `D:\dsv-git\`):

- `dsv-quarkus/uatz-server` — REST API
- `dsv-quarkus/uatz-model` — JPA entities
- `dsv-quarkus/uatz-migration` — database schema (Liquibase)

## Folder Structure (`src/app/`)

```
app/
├── app.module.ts            # root module (registers the interceptor + nz i18n pt_BR)
├── app-routing.module.ts    # lazy routes (loadChildren), guards per route
├── app.component.*          # shell: nz-layout sider + menu + session + global loader
├── components/              # shared components (componentes.module.ts as barrel)
├── core/
│   ├── core.module.ts       # singletons; imported only by AppModule
│   └── interceptors/        # HttpConfigInterceptor — token, loader, error toast
├── guards/                  # AuthGuard, AdminGuard, VisitanteGuard (classes, CanActivate)
├── pages/
│   ├── private/             # authenticated pages: dashboard/, orcamento/, cliente/, fornecedor/
│   └── public/              # login/
├── services/
│   ├── service.ts           # abstract base Service (HTTP verbs + path building)
│   ├── base/                # AutenticacaoService
│   ├── orcamento/ cotacao/ fornecedor/ cliente/
│   ├── loader.service.ts    # global loading state
│   └── toast.service.ts     # notifications (wraps NzMessageService)
└── static/
    ├── constants/           # EndpointsConstant, ModuloConstant, StorageConstant, HeadersConstant
    ├── enum/                # PerfilEnum, SituacaoOrcamentoEnum, ... (+ descricao/cor maps)
    ├── helpers/             # static utility classes
    ├── model/               # DTOs by domain (*.dto.ts)
    ├── storage/             # Storage (encrypted localStorage wrapper)
    ├── utils/               # Utils (injectable)
    ├── validators/          # CustomValidators
    └── encr-decr.util.ts    # AES helper used by Storage
```

`src/environments/` holds `environment.ts` / `environment.prod.ts` (swapped by `fileReplacements`)
and `language/idioma.ts` with every user-facing text.

## Routing

- One module per page, lazy loaded with `loadChildren`; the page module declares its component and
  its own `RouterModule.forChild([{ path: '', component: X }])`
- Public routes under `/public/`; private routes at root level, behind `canActivate: [AuthGuard]`
- Admin-only routes add `canActivate: [AdminGuard]`
- Route paths are Portuguese: `/orcamentos`, `/orcamentos/:id`,
  `/orcamentos/:id/cotacao-enviada`, `/orcamentos/simular-whatsapp`, `/clientes`, `/fornecedores`

Every component declared in a module needs `standalone: false` — Angular 19 defaults it to `true`.

## Key Base Classes

**`Service` (abstract)** — `services/service.ts`. All domain services extend it; it builds
`${urlModulo}/${API}/${path}` and exposes `get<T>()`, `post<T>()`, `put<T>()`, `delete<T>()`.

```typescript
@Injectable({ providedIn: 'root' })
export class MeuService extends Service {
  constructor(public http: HttpClient) {
    super(http, ModuloConstant.SERVER, ModuloConstant.SERVER.URL);
  }

  listar(): Observable<MeuDTO[]> {
    return this.get<MeuDTO[]>(EndpointsConstant.MEU.LISTAR);
  }

  obter(codigo: number): Observable<MeuDTO> {
    return this.get<MeuDTO>(StringHelper.formatString(EndpointsConstant.MEU.OBTER, [codigo]));
  }
}
```

Endpoint paths live in `EndpointsConstant` with `{0}` placeholders resolved by
`StringHelper.formatString` — never inline a URL in a component.

## Helpers (`static/helpers/`)

All helpers are **static utility classes** (no injection).

| Helper | Key methods |
|---|---|
| `StringHelper` | `formatString()`, `isNullOrEmpty()`, `ouEntao()`, `formatTelefone()`, `somenteNumeros()`, `titleCase()`, `sliceString()` |
| `NumberHelper` | `toBRL()`, `formatToCurrency()`, `formatWithDigits()`, `paraNumero()`, `betweenNumber()` |
| `DateHelper` | `formatDateTime()`, `formatDate()`, `formatDateDatabase()`, `parse()` |
| `FormHelper` | `markFieldsInvalid(controls)` — call it when the form is invalid on submit |
| `ArrayHelper` | `groupBy()`, `ordenarPorTexto()`, `ordenarPorTextoDesc()` |
| `ObjectHelper` | `clone()` |

`Utils` (injectable, `static/utils/utils.ts`) wraps the formatters returning `--` for null values —
use it in components/templates.

## Services worth knowing

| Service | Purpose |
|---|---|
| `AutenticacaoService` | login/logout, token, session, `isAdmin()` / `isFornecedor()` / `isAdminOuOperador()` |
| `ToastService` | `success/error/warning/info` (ng-zorro messages) |
| `LoaderService` | `isLoading` BehaviorSubject, driven by the interceptor and consumed by `app.component` |
| `Storage` | encrypted localStorage: `get/set/getObject/setObject/remove` |

## HTTP and error handling

`HttpConfigInterceptor` (`core/interceptors/`):

- attaches `Authorization: Bearer <token>` from `Storage`
- pushes the global loader while requests are in flight
- on `401` calls `AutenticacaoService.logout()`
- turns the server error into a toast, reading the `ApiErrorResponse` (`message`) of `uatz-server` or
  the `violations[]` of Quarkus' bean-validation mapper

Endpoints in `interceptor.utils.ts#endPointsWithoutFeedBack` are silent — the page handles the error
itself (login does this to show its own alert).

Because the interceptor already toasts failures, `subscribe({ error: () => { } })` in a page is
intentional, not an oversight.

## Coding Patterns

**Reactive forms:**

```typescript
form = this._formBuilder.nonNullable.group({
  campo: ['', [Validators.required]]
});

salvar(): void {
  if (this.form.invalid || this.flagSalvando) {
    FormHelper.markFieldsInvalid(this.form.controls);
    return;
  }
  ...
}
```

**OnPush**: every component uses `ChangeDetectionStrategy.OnPush`, so after an async callback call
`this.changeDetector.markForCheck()` (usually inside `finalize`).

**Texts**: never hard-code a string in a template. Add the key to
`src/environments/language/idioma.ts` and expose `idioma = idioma;` in the component.

## Naming Conventions

- Files: `kebab-case.component|service|module|guard.ts`, `*.dto.ts`, `*.helper.ts`, `*.constant.ts`,
  `*.enum.ts`, `*.validator.ts`
- Classes: `PascalCaseComponent`, `PascalCaseService`, `PascalCaseDTO`, `PascalCaseHelper`
- Observables/streams: prefix `$` (e.g. `$salvar`)
- Flag booleans: prefix `flag` (e.g. `flagCarregando`, `flagSalvando`)
- Private/protected fields: prefix `_` (e.g. `_formBuilder`, `_subscriptions`)
- Enums: `PascalCaseEnum`, members in `UPPER_SNAKE_CASE`
- Language: Portuguese for domain names/variables; English for Angular/technical constructs and for
  the DTO fields (they mirror the JSON of `uatz-server`, which is English)

## Styles

- SCSS with BEM-ish class names scoped by page (`.detalhe-orcamento__item-cotacao`)
- Brand tokens in `src/variables.scss` as CSS custom properties (`--uatz-brand-main`, ...)
- Global helpers in `src/styles.scss`: `.eyebrow`, `.uatz-painel`, `.uatz-grid-2`, `.uatz-grid-3`,
  `.uatz-texto-apoio`, `.uatz-espaco-topo`
- ng-zorro comes from the pre-built `ng-zorro-antd.min.css` (no LESS theming); override with the
  tokens above

## Build

```powershell
npm install
npm start        # ng serve, http://localhost:4200
npm run build    # production build (budgets enforced)
```

The API must be running on `http://localhost:8081` (see `environment.ts` -> `urlServidor`).
