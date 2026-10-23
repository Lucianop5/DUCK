# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Usuario principal (confirmado):** el autor del proyecto, una persona en Chile que registra
sus gastos cotidianos desde el móvil o el computador y quiere saber a dónde se le va la plata
sin mantener una planilla.

**Segunda audiencia (intención confirmada, aún no activa):** cualquier persona que quiera
ordenar sus gastos hormiga. La app se diseñará para poder abrirse al público más adelante, sin
que eso cambie el foco actual: una herramienta real de uso propio.

**Situación de uso:** registro rápido de un gasto en el momento en que ocurre; revisión del
mes en curso para saber cuánto queda; ajuste de presupuestos por categoría; consulta de
patrones y simulación de escenarios antes de tomar decisiones.

## Product Purpose

Gastos Hormiga es una app personal de finanzas para Chile. Hace visible el dinero que se va en
gastos pequeños y repetidos, lo convierte en presupuesto mensual y permite proyectar el mes o
el año.

El éxito significa que registrar un gasto toma segundos, que el usuario sabe cuánto lleva
gastado y cuánto le queda sin abrir una planilla, y que el hábito se sostiene mes a mes.

## Positioning

Una app de gastos hormiga hecha para Chile, no adaptada a Chile: pesos chilenos sin decimales,
categorías cotidianas y alertas de presupuesto al 80 % y 100 %, con analítica de hábitos y un
simulador mensual/anual en la misma herramienta. Su resumen es reutilizable por el resto del
ecosistema DUCK (LifeDashboard), algo que una app de gastos aislada no puede ofrecer.

## Operating Context

- El proyecto vive en un ecosistema de cuatro apps: Gastos Hormiga, WarrantyTracker,
  FuelTracker y LifeDashboard.
- El repositorio es público en GitHub y el desarrollo se documenta por fases.
- El uso principal ocurre en Chile, en español, con montos en CLP.
- La app se usa tanto en móvil como en escritorio; la sesión es persistente y los datos son
  privados por cuenta.
- La API versionada `/api/v1` es la misma que consumirá la integración futura con LifeDashboard.
- El registro de un gasto ocurre en el momento de la compra, no en una sesión contable aparte.
- El presupuesto se planifica por mes calendario; el usuario compara meses y proyecta el año.

## Capabilities and Constraints

**Capacidades confirmadas del MVP:**

- Registro e inicio de sesión; cada cuenta ve solo sus datos.
- CRUD de gastos con filtros, búsqueda, orden y paginación.
- Nueve categorías predeterminadas por usuario, editables, con color e icono.
- Presupuesto general y por categoría para cada mes, con aviso al 80 % y al 100 %.
- Dashboard con indicadores del mes, gráficos y ranking de gastos frecuentes.
- Simulador mensual y anual.
- Modo oscuro y diseño responsive.
- API REST versionada en `/api/v1`, documentada con OpenAPI/Swagger.
- Endpoint de resumen reutilizable para LifeDashboard; OAuth 2.0 solo documentado, no
  implementado en el MVP.

**Restricciones durables:**

- Montos en CLP, sin decimales en la interfaz; la base guarda `DECIMAL(12,2)`.
- Fechas como día calendario en `America/Santiago`.
- Interfaz y documentación en español; código, nombres y commits en inglés.
- Stack existente: Next.js 16 full-stack, TypeScript, React 19, Tailwind 4, shadcn/ui, Prisma,
  MySQL 8.4 en Docker, Better Auth, Recharts y Lucide.
- Sin testimonios, clientes, métricas de uso, precios ni cifras inventadas.
- El proyecto es a la vez herramienta real y pieza de portafolio; ninguna de las dos facetas
  puede volver falsa a la otra.

## Brand Commitments

- Nombre: **Gastos Hormiga**. La metáfora es el gasto pequeño y repetido que, sumado, pesa.
- Voz: español de Chile, directa y sin infantilizar al usuario. Nada de culpa ni de sermón
  financiero.
- El producto se presenta como una herramienta seria de uso real, no como una demo.
- No hay logotipo, fotografías ni testimonios entregados; no deben inventarse.

## Evidence on Hand

No existe evidencia externa todavía: ni testimonios, ni clientes, ni prensa, ni métricas de
uso, ni capturas de una versión anterior. Cualquier cifra que aparezca en la interfaz debe
provenir de los datos reales del usuario o estar marcada explícitamente como ejemplo.

## Product Principles

1. **Registrar primero.** Si anotar un gasto cuesta más que ignorarlo, la app fracasa. Cada
   pantalla debe proteger el gesto de registrar en segundos.
2. **El peso manda.** CLP sin decimales, formatos chilenos y períodos locales. Ninguna
   decisión visual puede hacer que un monto se lea mal.
3. **Los datos son del usuario.** Aislamiento por cuenta, sesión privada y ninguna cifra
   compartida sin consentimiento.
4. **Nada inventado.** El producto, las capturas y las cifras son reales o no están.
5. **El hábito antes que la decoración.** La interfaz desaparece en la tarea; la claridad y la
   confianza valen más que el efecto.
