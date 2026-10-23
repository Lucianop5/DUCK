# ADR-0008 — shadcn/ui + Tailwind 4 + react-hook-form/Zod

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

Se requiere una interfaz consistente y accesible sin construir un sistema de componentes desde cero,
con formularios validados en cliente y servidor.

## Alternativas

1. Componentes propios: control total, mucho tiempo en accesibilidad y estados.
2. MUI/Chakra: ecosistema cerrado y estilos difíciles de adaptar al diseño deseado.
3. **shadcn/ui:** componentes copiados al repositorio, Radix para accesibilidad, Tailwind para
   estilos y control total del código.

## Decisión

shadcn/ui (preset Nova, base Radix) sobre Tailwind CSS 4, con `react-hook-form` y `zod` para
formularios. El CSS base se vendorizó en `src/styles/shadcn-base.css` para no incluir el CLI como
dependencia de runtime.

## Consecuencias

- Los componentes viven en `src/components/ui` y son editables.
- Zod define el esquema una vez y se reutiliza en el formulario y en la API.
- Al agregar componentes nuevos, revisar que no reintroduzcan `@import "shadcn/tailwind.css"`.
