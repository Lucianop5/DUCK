# ADR-0006 — Montos decimales y CLP

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

Los errores de redondeo con coma flotante son inaceptables en dinero. El peso chileno no usa
centavos, pero los cálculos (promedios, porcentajes, simulador) necesitan precisión.

## Alternativas

1. `float`/`number`: descartado por imprecisión binaria.
2. Enteros de pesos: exacto, pero impide centavos y complica proporciones.
3. **`Decimal` + `NUMERIC(12,2)`**.

## Decisión

`Decimal(12,2)` en Prisma, `Prisma.Decimal` en el servidor y `string` en JSON. Las sumas se hacen
en `Decimal` y se redondean una sola vez con `ROUND_HALF_UP`. La interfaz formatea con
`Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })`.

## Consecuencias

- Nunca se usa `number` para almacenar o sumar dinero.
- Los formularios aceptan enteros de peso y el servidor valida `>= 1`.
- Si se agrega multi-moneda, se añade `currency` con migración controlada.
