---
name: DUCK
description: La tira de sumar — máquina verde, papel continuo y montos impresos.
colors:
  machine: "#17352d"
  machine-deep: "#10241e"
  machine-soft: "#22483d"
  tape: "#f3efe4"
  tape-dim: "#ddd7c8"
  ink: "#171614"
  primary: "#d04532"
  primary-foreground: "#fbf6ea"
  stamp: "#b63424"
  field: "#fbf8ee"
  background: "#e9e3d4"
  secondary: "#ded7c6"
  muted-foreground: "#6e6a61"
  rule: "#c9c3b5"
  sidebar-border: "#2c5347"
  dark-background: "#0e1f1a"
  dark-foreground: "#efe9db"
  dark-primary: "#e0604b"
  dark-primary-foreground: "#1a0f0b"
  dark-secondary: "#1d3a32"
  dark-muted: "#1a342d"
  dark-muted-foreground: "#9fb6ac"
  dark-border: "#2a4a40"
  dark-machine: "#0b1a16"
  dark-machine-deep: "#07120f"
  dark-tape: "#e8e2d2"
  dark-tape-dim: "#cfc8b7"
  dark-field: "#f7f2e6"
  dark-sidebar-border: "#244238"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 6vw, 4.3rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 2.8rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    lineHeight: 1.6
  label:
    fontFamily: "Doto, ui-monospace, monospace"
    fontSize: "0.68rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.14em"
  number:
    fontFamily: "Doto, ui-monospace, monospace"
    fontWeight: 800
    letterSpacing: "0.01em"
rounded:
  square: "0px"
  control: "3px"
  sm: "0.15rem"
  md: "0.2rem"
  lg: "0.25rem"
  xl: "0.35rem"
  keycap: "999px"
spacing:
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "2.5": "10px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "7": "28px"
  "8": "32px"
  "9": "36px"
  "10": "40px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-ghost:
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-stamp:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.tape}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
  input-auth:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "4px 12px"
  paper-panel:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  nav-active:
    backgroundColor: "{colors.machine-soft}"
    textColor: "{colors.tape}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  badge-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    height: "20px"
    padding: "2px 8px"
  category-key:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.ink}"
    rounded: "{rounded.keycap}"
  stamp:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.stamp}"
    padding: "0.15rem 0.45rem"
---

# Design System: DUCK

## Overview

**Creative North Star: "La tira de sumar"**

Una máquina sumadora de oficina: gabinete verde, cinta cálida, tinta oscura y rojo de sobreimpresión. Archivo da una voz directa a la interfaz; Doto convierte montos y etiquetas en impresión. El carácter nace de líneas de gasto, totales y límites legibles, no de ilustraciones financieras genéricas.

La expresión pública permite una máquina escénica y papel con relieve. La interfaz privada conserva ese material, pero prioriza densidad, navegación y lectura de datos. Los componentes de papel no se invierten a texto claro sobre verde al cambiar de tema: siguen siendo cinta con tinta.

**Key Characteristics:**
- Papel continuo con perforaciones y filete doble en totales.
- Verde estructural; rojo para acciones, totales y avisos.
- Archivo para leer; Doto para imprimir cifras y etiquetas breves.
- Esquinas casi rectas y teclas de categoría circulares.

Documento extraído del código actual, no una propuesta. Fuentes: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/(auth)/layout.tsx`, `src/app/(app)/dashboard/page.tsx`, `src/components/{layout,marketing,auth,brand,ui}`. El contrato de dirección vive en `.impeccable/surfaces/src-app-page-tsx.md`; aquí no se convierte su composición particular en regla global.

Estado: revisión visual en corrección; este documento no constituye aprobación final ni certificación de accesibilidad. Las cinco capturas en `.impeccable/review/` son evidencia provisional: algunas todavía muestran kickers que el código actual ya no renderiza. Ante diferencias, manda la implementación leída. No se ejecutaron pruebas de interacción, contraste ni navegador en esta tarea documental.

## Colors

### Primary

El rojo `primary` es la acción semántica de los controles base; `stamp` es la tinta roja más oscura de cinta, autenticación y llamadas públicas. No son intercambiables: el tema oscuro aclara `primary`, pero mantiene `stamp` sobre papel.

### Secondary

`machine`, `machine-deep` y `machine-soft` construyen gabinete, ranuras y selección. No deben sustituir automáticamente los roles `background` y `card` de la app.

### Neutral

`tape` y `tape-dim` son papel y soporte; `ink` es su texto; `field` distingue campos. `background` es la mesa clara, `secondary` la superficie apagada y `rule` el filete. `muted-foreground` corresponde a texto secundario del shell, no al texto impreso dentro de papel, que usa opacidades de `ink`.

### Semántica y temas

Los valores normativos están en el frontmatter; los nombres siguientes son propiedades CSS de `globals.css`.

| Rol CSS | Claro | Oscuro |
| --- | --- | --- |
| background / foreground | background / ink | dark-background / dark-foreground |
| card, popover / sus foregrounds | tape / ink | machine / dark-foreground |
| primary, ring, sidebar-primary | primary | dark-primary |
| primary-foreground, sidebar-primary-foreground | primary-foreground | dark-primary-foreground |
| secondary / foreground | secondary / ink | dark-secondary / dark-foreground |
| muted / muted-foreground | secondary / muted-foreground | dark-muted / dark-muted-foreground |
| accent / accent-foreground | machine / tape | tape / machine |
| destructive | stamp | dark-primary |
| border, input | rule | dark-border |
| sidebar / foreground | machine / tape | dark-machine / dark-foreground |
| sidebar-accent / foreground | machine-soft / tape | machine / dark-foreground |
| sidebar-border | sidebar-border | dark-sidebar-border |
| machine / machine-deep / machine-soft | machine / machine-deep / machine-soft | dark-machine / dark-machine-deep / machine |
| tape / tape-dim / field | tape / tape-dim / field | dark-tape / dark-tape-dim / dark-field |
| ink / stamp / rule | ink / stamp / rule | sin cambio |

La variante pública `landing-world` fija máquina, cinta, tinta, sello y filete a sus valores claros de material incluso bajo `.dark`; declara `color-scheme: dark` para el gabinete, y `light` en sus inputs y selects. No fija todos los tokens semánticos: la columna del formulario de autenticación usa `background` / `foreground` y puede seguir el tema. `ThemeProvider` usa clase, tema inicial claro, soporte del sistema y desactiva transiciones al cambiar tema.

Los colores de categoría son datos, no nuevos acentos de marca; los gráficos tienen cinco roles propios por tema en `globals.css`. No se inventa una rampa de producto: las rampas de la extensión JSON son únicamente muestras sintéticas para el panel, no tokens implementados.

**The Papel y tinta Rule.** Cada superficie de cinta conserva `tape` con `ink`, también en oscuro; el gabinete y los controles semánticos sí cambian con el tema.

## Typography

**Display Font / Body Font:** Archivo con fallback de sistema sans-serif. **Label/Mono Font:** Doto con fallback monoespaciado. Ambas familias se cargan mediante `next/font/google` con `display: swap` en el layout raíz.

La escala es por función, no una progresión matemática única. El frontmatter recoge el titular público, encabezado privado, título de panel, cuerpo de formulario y etiquetas base. Los titulares secundarios públicos usan `clamp(2rem, 4vw, 3rem)` o límite de `3.1rem`; acceso y registro usan (34px), peso (800), interlínea (0.98). El cuerpo público crece a (14–16px), con interlínea (1.6–1.65).

Las etiquetas impresas son mayúsculas, con variantes locales de (8–10px); el tamaño base no garantiza que todas alcancen buena legibilidad. Los montos usan `font-variant-numeric: tabular-nums`; el número base no impone tamaño: movimientos (13–14px), indicadores de dashboard (30–36px), total de demo fluido. La animación de total termina con tracking (-0.02em), distinto del tracking estático de número.

**The Dos voces Rule.** Archivo explica; Doto imprime. No trasladar párrafos, errores o navegación extensa a la tipografía punteada.

## Layout

Ritmo Tailwind de (4px), con medios pasos de (2px). Los espacios recurrentes están extraídos en el frontmatter; no son nuevas variables CSS. Formularios separan campos con (16px); paneles suelen usar (20–28px), ampliados en escritorio; los límites de contenedor impiden estirar líneas de lectura innecesariamente.

- **Público:** contenedor máximo (1440px); padding horizontal principal (24px), luego (40px) en `sm` y (48px) en `lg`. Hero de una columna pasa en `lg` a `minmax(0,360px) minmax(0,1fr) minmax(0,250px)`, con gap (40px). La cinta admite hasta (560px). En móvil se ordena cinta, copia y acción; el gabinete de teclas se oculta por debajo de `lg`. Navegación central aparece en `md`; acceso superior en `sm`; el enlace de acceso bajo la acción sigue disponible. Secciones espaciadas (80px), generalmente (96px) en `lg`.
- **Autenticación:** columna de formulario máximo (460px); padding exterior horizontal (20px), (32px) en `sm`; papel con (28px), (36px) en `sm`. Desde `lg`, composición (1.05fr / 0.95fr), con panel de máquina y demo a la izquierda. En móvil queda formulario, cabecera de regreso y pie.
- **Privado:** desde `lg`, sidebar fijo visualmente por posición sticky de (248px) y altura de viewport; contenido `minmax(0,1fr)`, máximo (1280px). Padding horizontal (16px), (24px) en `sm`, (36px) en `lg`, (48px) en `xl`; vertical (24px), (32px) en `lg`. En móvil, cabecera sticky de (64px), menú Sheet izquierdo de (290px) y acceso directo a gasto.
- **Dashboard:** tres indicadores desde `sm`; una columna antes. Movimientos y distribución comparten dos columnas solo desde `xl` (1.25fr / 1fr). Encabezados y acciones se apilan antes de `sm` y permiten wrapping.
- **Breakpoints observados:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), correspondientes a los defaults de Tailwind 4 usados sin redefinición local.

## Elevation & Depth

La profundidad describe objetos: papel apoyado, ranuras oscuras y teclas con base física. No es una colección de tarjetas flotantes. La clase de papel usa sombra (8px 14px 32px con negro al 19 %); papel plano no tiene esa sombra. Las teclas tienen base sólida en `machine-deep` y brillo interior blanco. Las acciones rojas públicas y de auth apoyan sobre una base oscura fija, documentada en la extensión JSON.

El código sí contiene gradientes: iluminación radial del gabinete, trama lineal del papel, perforaciones radiales y rayado de barras. Son material y codificación, no licencia para agregar degradados decorativos. El fondo global tiene puntos en retícula de (18px).

Entrada de cinta y revelado de total duran (700ms), curva `cubic-bezier(0.2,0.8,0.2,1)`; total espera (300ms). Teclas transicionan (140ms ease), suben al hover y bajan al pulsar. `prefers-reduced-motion` elimina esas dos animaciones, el scroll suave y la transición de teclas; no elimina globalmente todo spinner o transform hover. `key-press` está definido, sin uso observado en estas superficies.

## Shapes

La cinta es rectangular, sin redondeo añadido. Controles específicos usan (3px) y los CTA públicos (4px). Los radios semánticos parten de `--radius: 0.25rem`; `sm`, `md`, `lg`, `xl` multiplican esa base, no son los tamaños predeterminados históricos de shadcn. Las teclas sí son circulares; no convertir todos los controles en píldoras.

Perforaciones: pseudoelementos de (8px) a ambos lados, patrón vertical (14px), sin eventos de puntero. Totales: borde superior doble de (3px) en color actual. El sello genérico usa borde de (2px) y rotación (-2deg). Líneas de gasto y separadores punteados evocan impresión sin sustituir la estructura semántica.

## Components

### Buttons

`src/components/ui/button.tsx` ofrece `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; tamaños `default`, `xs`, `sm`, `lg` y cuatro iconográficos. Base compacta (32px), no CTA de marketing. El rojo semántico cambia con tema; hover de default reduce a (80 %); destructive usa tinta sobre fondo tintado, no relleno sólido. Outline y ghost se apoyan en `muted` al hover. Foco visible con borde y anillo (3px); disabled bloquea interacción de puntero y reduce opacidad.

La tecla roja de auth usa `stamp`, altura (48px), radio (3px), sombra física y ancho completo. CTA público usa altura (56px), radio (4px) y base (5px). El acceso rápido privado usa tokens de sidebar, no debe copiar a ciegas los colores de auth. Los snippets del sidecar muestran los tres controles base más representativos y la tecla roja; no alteran la API real.

### Inputs / Fields

`Input` base: altura (32px), ancho completo, mínimo cero, borde semántico, anillo de foco (3px), estados disabled e `aria-invalid`. Auth lo especializa a (44px), fondo `field`, texto `ink`, radio (3px), padding horizontal (12px), tipo (14px), borde de tinta al (40 %) y foco rojo de sello. La regla de placeholder de papel mezcla tinta (68 %) con campo, por lo que no basta leer la utilidad local de opacidad.

Correo y contraseña tienen labels asociados y autocomplete; login marca ambos campos inválidos al error. Registro es de dos pasos con presupuesto opcional, botones de monto y vista previa. Errores se renderizan con `role="alert"`; pending deshabilita el envío y muestra spinner. No se observó asociación mediante `aria-describedby` ni invalidación por campo en registro: no documentarlas como implementadas.

### Navigation

`AppShell` reutiliza `NavList`, con `aria-label`, `aria-current="page"`, iconos decorativos ocultos a lectores y cierre del menú al navegar. La selección combina fondo de gabinete, filete rojo interior de (3px) y punto rojo; no depende solo del texto. `ThemeToggle` tiene nombre accesible que anuncia el tema destino. `PeriodSwitcher` usa botones de (32px) con nombres «Mes anterior» y «Mes siguiente» y etiqueta central mínima de (130px).

### Cards / Containers

`PaperPanel` es el contenedor de contenido de app; delega padding y perforaciones al consumidor. `PanelHeader` reúne título, nota y acción; `PageHeader` reúne título, descripción y acciones. Aunque sus tipos aceptan `kicker`, la implementación leída no lo renderiza. `EmptyTape` presenta explicación, acción opcional y líneas decorativas ocultas a lectores.

El `Card` base de biblioteca también existe: fondo semántico, radio `xl`, ring tenue y espaciado interno (16px), (12px) en tamaño `sm`. No es el patrón visual principal del dashboard; preferir `PaperPanel` para extender sus cintas existentes.

### Chips / Tags

`Badge` base compacto de (20px), padding (2px 8px), tipografía (12px) y radio derivado `4xl` (0.65rem). Variantes default, secondary, destructive, outline, ghost y link. Los presupuestos rápidos de registro son botones rectangulares separados: borde de tinta y selección rellena de `stamp`; no son `Badge` ni controles de selección ARIA implementados.

### Cinta, teclas y marca

`TapeDemo` representa movimientos sintéticos rotulados «DATOS DE EJEMPLO», total rojo, presupuesto y porcentaje legible, con perforaciones y ranuras decorativas. Opciones `compact` y `animate` afectan el espaciado y entrada de cinta; `animate={false}` no quita la animación propia del total. `CategoryKeys` dibuja nueve teclas de tres columnas: son `div`, no botones funcionales, aunque heredan hover del material.

`BrandMark` es la marca tipográfica DUCK implementada en código, no un logotipo externo entregado. El sello conserva 36 × 36 px y usa Doto a 10 px para que las cuatro letras quepan sin recorte. `BrandLockup` añade el nombre DUCK y «CLP · CHILE»; tonos tape e ink, con marca decorativa y nombre accesible en los enlaces que la contienen.

### Accesibilidad observada y límites

Documento raíz en español; landmarks de main, nav y encabezados; listas y definiciones para datos; nombres en controles iconográficos; `focus-ring` con outline (2px) y offset (2px). Barras de presupuesto incluyen porcentaje textual y nombre accesible mediante `role="img"`. El estado de presupuesto añade texto de aviso al (80 %) y al límite; no usa solo rojo.

No se afirma conformidad WCAG. Los microtextos de (7–10px), opacidades bajas, tamaños de controles de (24–36px), foco de enlaces sin clase explícita, contenido largo y variantes oscuras requieren comprobación en la revisión en curso. El código de auth incluye más de un h1 en escritorio; no se presenta una jerarquía auditada. Las capturas existentes no prueban navegación por teclado, lectores de pantalla ni persistencia del tema.

## Do's and Don'ts

### Do:
- **Do** conservar papel con tinta, filetes y totales alineados al ampliar la app.
- **Do** usar Archivo para explicación y Doto tabular para montos en CLP sin decimales.
- **Do** elegir tokens semánticos para el shell y tokens de material para la cinta.
- **Do** acompañar color de estado con texto y mantener nombres accesibles en controles de icono.
- **Do** rotular los datos sintéticos de demostración y usar solo datos de la cuenta en privado.

### Don't:
- **Don't** sustituir la máquina por tarjetas flotantes, degradados decorativos o estética financiera genérica.
- **Don't** invertir automáticamente el papel al cambiar a oscuro.
- **Don't** convertir teclas decorativas en acciones aparentes sin implementar interacción y semántica.
- **Don't** declarar revisión final, accesibilidad aprobada o pruebas superadas a partir de esta documentación.
