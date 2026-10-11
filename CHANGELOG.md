# Registro de cambios

Todas las versiones importantes del Laboratorio Karnaugh. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa
[versionado semántico](https://semver.org/lang/es/).

## [5.1.1] - 2026-10-11

### Cambiado
- «Implicante primo» pasa a llamarse «implicante principal» en toda la
  aplicación (calculadora, paso a paso, práctica, teoría, autoevaluación,
  glosario e informe PDF). El glosario aclara que en otros libros se llama
  «implicante primo».

### Corregido
- Menú superior: entre unos 860 y 1230 px de ancho, las primeras pestañas
  (Calculadora, Paso a paso…) quedaban escondidas detrás del título y no se
  podía llegar a ellas. Ahora, si el menú no cabe junto al título, pasa a su
  propia fila; ninguna pestaña puede quedar fuera de la pantalla.
- Teoría: el índice lateral y los saltos a cada sección respetan la altura
  real del encabezado.
- Paso a paso: «Los más cortos usan N implicantes principales» (concordancia
  del plural).

## [5.1.0] - 2026-10-11

### Cambiado
- Práctica: el programa ya no muestra el término de cada grupo ni la ecuación
  armada con los grupos del estudiante. Al agregar un grupo solo confirma que es
  válido y lista sus celdas; el estudiante escribe los términos y la ecuación
  final. Los términos aparecen cuando su ecuación es correcta o cuando pide la
  solución.
- Práctica: los avisos «implicante principal» / «se puede agrandar» se muestran al pulsar
  «Revisar», que ahora señala los grupos por sus celdas.

### Corregido
- Práctica: «Comprobar» decía «no mínima» comparando con la otra forma (SOP o
  POS); ahora compara con la forma que se practica y menciona la otra solo como
  dato.
- Práctica: el botón «Ver solución» / «Ocultar solución» quedaba con el texto
  equivocado al tocar el mapa o agregar un grupo.

## [5.0.1] - 2026-10-10

### Corregido
- Informe PDF: la sección de protoboard ahora describe la conexión de los
  interruptores según la opción elegida (pull-up o pull-down) y el valor de
  resistencia correspondiente a la serie 74LS o 74HC. Antes siempre describía
  pull-down.

## [5.0.0] - 2026-10-10

Primera versión publicada en este repositorio.

### Agregado
- Nueva identidad visual: la ecuación mínima como protagonista de la calculadora,
  tipografías Atkinson Hyperlegible Next y STIX Two Text, y colores reservados
  para su significado eléctrico.
- Notación matemática ∑m(…), ∏M(…) y d(…) en la calculadora, el paso a paso, la
  teoría y el informe en PDF.
- Contraste AA en los textos de color, en tema claro y oscuro.
- Tamaño de la ecuación ajustado a su longitud y términos que no se parten.
- Repositorio: README, licencia MIT, pruebas automáticas del núcleo lógico,
  integración continua y publicación en GitHub Pages.
- jsPDF incluido en `vendor/` para que el informe funcione sin depender del CDN.

## [4.0.0]

### Agregado
- Pestaña **Multisalida**: circuitos de varias salidas con términos compartidos,
  ejemplos predefinidos (7 segmentos, sumador, comparador y otros), protoboard,
  exportación a Logisim y VHDL.

## [3.0.0]

### Agregado
- Pestañas **Práctica** y **Teoría** ampliada (galería de grupos, autoevaluación,
  glosario y bibliografía).
- Guía de montaje en protoboard paso a paso.
- Deshacer y rehacer, y guía de inicio.

## [1.0.0] – [2.0.0]

- Versiones iniciales: calculadora de mapas de Karnaugh, paso a paso, circuito,
  protoboard, teoría e informe en PDF.

[5.1.1]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.1.1
[5.1.0]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.1.0
[5.0.1]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.0.1
[5.0.0]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.0.0
