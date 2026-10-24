---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/(app)"]
---

# Landing y sistema de interfaz — DUCK

## Alcance

Superficie Persuade: landing pública y, como superficie relacionada, el shell privado y el
dashboard que heredan el mismo mundo. La decisión cubre también las doce pantallas del MVP:
registro, acceso, gastos, categorías, presupuestos, analítica, simulador y ajustes.

## Audiencia y trabajo

El autor, en Chile, anota un gasto en el momento en que ocurre desde el móvil o el computador.
Quiere saber cuánto lleva gastado y cuánto le queda sin abrir una planilla. La landing debe
hacer que ese gesto se entienda en un viewport y llevarlo a crear la cuenta.

## Contenido y prueba

No hay testimonios, métricas ni capturas de una versión anterior. La demostración usa datos
sintéticos rotulados «datos de ejemplo» y montos reales en CLP. La landing muestra la app
funcionando: líneas de gasto, total, presupuesto y categorías.

## Restricciones

- Montos en CLP sin decimales; fechas y períodos en `America/Santiago`.
- Interfaz y copia en español de Chile; código en inglés.
- Modo oscuro y responsive.
- Sin precios, clientes, benchmarks ni cifras inventadas.

## Direction contract

**THESIS:** Cada gasto es una línea impresa y el total del mes es la única verdad. La app se
construye como una máquina sumadora de oficina, no como un dashboard de tarjetas ni como una
landing financiera genérica; el gesto de anotar es el espectáculo.

**OWN-WORLD:** Verde esmalte de máquina `#17352D`, cinta de papel `#F3EFE4`, tinta `#171614` y
rojo de sobreimpresión `#D04532`. Doto para números y etiquetas impresas; Archivo para la voz de
interfaz y titulares. Bordes de cinta con perforaciones, doble filete para totales, teclas
circulares de categoría y sello rojo para alertas. Ningún gradiente decorativo ni tarjeta
flotante: superficies con borde impreso y sombra física de objeto.

**STORY:** El visitante entiende que los gastos pequeños, sumados, pesan; cree que anotarlos
toma segundos y que el presupuesto le avisa antes de pasarse; crea su cuenta o registra su
primer gasto.

**FIRST VIEWPORT:** A 1440 px, cabecera de máquina con marca, navegación y llave de acceso.
Columna izquierda de 390 px: titular «Cada gasto pequeño suma.», subtítulo, tecla roja
«Anotar mi primer gasto» y nota «Hecho en Chile · Montos en CLP». Centro: la cinta de 520 px
sale de una ranura y baja con líneas de gasto, doble filete y total rojo, seguida de la banda
de presupuesto con su etiqueta de porcentaje. Derecha: gabinete de 250 px con las nueve teclas
de categoría. En móvil, la cinta es lo primero y la copia y la acción van debajo.

**FORM:** «La tira de sumar», posición 3 de 7 en la lista ordenada de direcciones.
Seed reference: `seed:283efe3a782effe0`.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Decisiones abiertas

- Ninguna de producto. La implementación debe confirmar que la cinta puede sostener tablas
  densas, estados vacíos y el simulador sin convertirse en un truco decorativo.
