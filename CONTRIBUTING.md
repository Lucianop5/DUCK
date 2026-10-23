# Guía de contribución

Proyecto personal de aprendizaje con flujo de trabajo profesional desde el primer commit.

## Ramas

| Rama | Uso |
|---|---|
| `main` | Siempre ejecutable. Solo recibe cambios vía Pull Request. |
| `feat/<tema>` | Nueva funcionalidad (ej. `feat/crud-gastos`). |
| `fix/<tema>` | Corrección de errores. |
| `docs/<tema>` | Documentación. |
| `chore/<tema>` | Configuración, dependencias, infraestructura. |

## Commits — Conventional Commits (en español)

```text
<tipo>(<alcance>): <descripción en imperativo>

feat(expenses): agregar filtro por método de pago
fix(auth): invalidar sesión al cambiar contraseña
docs(api): documentar endpoint de presupuestos
test(budgets): cubrir alerta al 100 %
chore(deps): actualizar Prisma
```

Tipos: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`, `perf`, `build`, `ci`.
Alcances: `auth`, `expenses`, `categories`, `budgets`, `analytics`, `ui`, `db`, `infra`, `docs`.

## Flujo de un cambio

1. Crear issue (o tomar uno del backlog) y moverlo a *In progress*.
2. `git switch -c feat/mi-cambio`
3. Implementar en pasos pequeños + pruebas.
4. `npm run typecheck && npm test && npm run lint`
5. `git push -u origin feat/mi-cambio`
6. Abrir PR con la plantilla, enlazando el issue (`Closes #12`).
7. Verificar que CI pase.
8. *Squash merge* a `main` y borrar la rama.

## Reglas de código

- Código y nombres en inglés; interfaz, mensajes y documentación en español.
- Sin secretos, credenciales ni `.env` reales en el repositorio.
- Dinero siempre como `Decimal`/string, nunca `number` con decimales.
- Validar en cliente **y** servidor con el mismo esquema Zod; el servidor es la fuente de verdad.
- Toda funcionalidad nueva llega con al menos una prueba.
- Antes de afirmar que algo funciona, ejecutarlo.

## Definition of Done

- [ ] Funcionalidad implementada y probada manualmente.
- [ ] `npm run typecheck`, `npm test` y `npm run lint` en verde.
- [ ] Pruebas automatizadas agregadas o actualizadas.
- [ ] Documentación y `docs/progress.md` actualizados.
- [ ] PR revisado y mergeado con historial limpio.
