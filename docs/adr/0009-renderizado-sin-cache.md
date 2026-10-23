# ADR-0009 — Renderizado dinámico sin caché privada

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

El template de Next 16 activa `cacheComponents` y `partialPrefetching`. En una app financiera, una
caché mal delimitada puede mostrar datos de un usuario a otro o servir totales obsoletos.

## Alternativas

1. Mantener `cacheComponents`: rendimiento, pero exige Suspense en cada lectura dinámica y razonar
   con cuidado los límites de caché.
2. **Desactivarlo:** renderizado en cada request, comportamiento predecible.
3. Cachear por etiqueta (`use cache` + `cacheTag` por usuario): posible, pero innecesario a esta
   escala.

## Decisión

Desactivar `cacheComponents` y `partialPrefetching`. Las páginas privadas se renderizan en cada
request; las públicas (landing, login) son estáticas.

## Consecuencias

- No hay riesgo de filtrar datos entre usuarios por caché.
- Mayor costo por request, irrelevante para uso personal.
- Si el rendimiento lo exige, se evaluará caché por etiqueta con invalidación explícita.
