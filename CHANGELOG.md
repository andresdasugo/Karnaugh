# Registro de cambios

Todas las versiones importantes del Laboratorio Karnaugh. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa
[versionado semántico](https://semver.org/lang/es/).

## [5.4.1] - 2026-10-19

### Cambiado
- Protoboard: nuevo dibujo del LED de salida. Ahora es un LED de 5 mm visto
  desde arriba, con base de lado plano en el cátodo, cúpula con volumen y
  brillo, patas metálicas que entran en sus agujeros y marcas + (ánodo) y −
  (cátodo). Encendido, la cúpula se ilumina y emite un halo de luz que se
  desvanece; apagado, se ve rojo oscuro translúcido. La guía de montaje
  menciona también el lado plano y las marcas + y −.

## [5.4.0] - 2026-10-19

### Agregado
- Opción **«Relacionar con el diagrama del circuito»** para ver qué cable de la
  protoboard corresponde a qué conexión del diagrama:
  - El diagrama dibuja cada conexión con el color de su cable en la protoboard
    y escribe junto a cada compuerta los números de pin del integrado (los
    mismos de la lista de cableado: «U2 pin 3»).
  - Al pasar el cursor o tocar un cable en la protoboard, una conexión del
    diagrama o una fila de la lista de cableado, esa conexión se resalta en los
    tres lugares; un toque la deja fijada y otro toque (o Esc) la suelta.
  - En la guía de montaje, el diagrama marca la conexión del cable de cada paso.
  - Está en las pestañas Protoboard (con el diagrama debajo del montaje),
    Circuito y Multisalida, se recuerda al volver a abrir la página y se aplica
    también al diagrama del informe PDF.

## [5.3.0] - 2026-10-12

### Cambiado
- Menú reorganizado en dos grupos: primero las pestañas que trabajan con la
  función de la Calculadora, en el orden en que se usan (Calculadora, Paso a
  paso, Circuito, Protoboard, Informe), y luego las herramientas
  independientes (Multisalida, Teoría, Práctica). En el celular cada grupo
  ocupa su propia fila.

### Corregido
- Diagrama lógico: cuando dos o más variables no se usaban, se dibujaban
  encimadas en la misma posición (solo se veía una). Ahora aparecen todas, cada
  una con la nota «sin uso».
- Protoboard: las letras del DIP y los nombres de las salidas van entre las
  filas c y d, y el valor de las resistencias entre la fila j y el riel, sin
  tapar agujeros ni líneas.
- Menú en pantallas de menos de 400 px: los nombres de las pestañas ya no se
  cortan, y a 320 px el botón de tema vuelve a caber junto al título.

## [5.2.2] - 2026-10-12

### Agregado
- Código exportado comentado para el estudiante: VHDL, Verilog, C y Python
  explican cada parte (entidad/módulo, arquitectura, operadores) y, junto a
  cada término de la ecuación, el grupo del mapa de Karnaugh que lo produce.
  Los bancos de prueba explican qué es un testbench, cómo se aplican las
  entradas, cómo se compara cada fila y cómo ejecutarlos, y el vector de
  prueba de Logisim explica su formato.
- Código fuente documentado: encabezado de autoría y licencia con el mapa del
  archivo, encabezados de sección, comentario de cada función (qué hace,
  parámetros y resultado), descripción del estado de la aplicación y de los
  algoritmos. Encabezado de licencia (SPDX) en las pruebas y los flujos de
  GitHub Actions.

## [5.2.1] - 2026-10-12

### Cambiado
- Protoboard: las entradas de las compuertas que sobran en un integrado ya no
  se conectan a GND en los 74LS (TTL), donde una entrada al aire se comporta
  como 1 y la compuerta sobrante no afecta el circuito. Se sigue haciendo en
  los CMOS (74HC, incluidos 74HC4075/4072/4002), donde es obligatorio porque
  una entrada al aire puede oscilar y dañar el integrado. La casilla
  «Conectar a GND también las entradas sin usar de los 74LS» lo activa para
  TTL. En el ejemplo de 4 variables con 74LS el montaje baja de 47 a 35 cables.
- La guía de montaje y las notas explican cuándo y por qué se conectan.

## [5.2.0] - 2026-10-11

### Agregado
- **Bancos de prueba (testbench)** para la exportación: en Calculadora →
  Exportar, cada lenguaje tiene la opción Diseño / Testbench y el botón
  «Diseño + testbench (.zip)» con un LEEME de cómo ejecutarlo.
  - VHDL y Verilog: banco de prueba que recorre todas las combinaciones y
    compara la salida con la tabla de verdad (las X no se comparan).
  - C y Python: programa completo con la función y su prueba.
  - Logisim: vector de prueba (Simular → Vector de prueba), incluido también
    en los .zip de Logisim de Calculadora, Circuito y Multisalida.
- Multisalida: botón «VHDL y Verilog + testbench (.zip)».
- Pruebas automáticas que generan el código de cada lenguaje y lo ejecutan
  con GHDL, Icarus Verilog, gcc y Python, incluida una prueba negativa que
  altera la tabla esperada para confirmar que el banco de prueba detecta el
  error. GitHub Actions instala GHDL e Icarus Verilog.

### Corregido
- VHDL/Verilog/C/Python: con 6 variables la entrada F chocaba con la salida F
  y el código no compilaba; ahora la salida se llama F_out. Los nombres que
  son palabras reservadas del lenguaje (in, end, int, def…) se renombran.
- VHDL y Verilog usan solo caracteres ASCII, para que ninguna herramienta
  rechace el archivo por las tildes.
- Los archivos VHDL y Verilog se descargan con su extensión (.vhd, .v) en
  lugar de .txt.

## [5.1.2] - 2026-10-11

### Cambiado
- «Implicante principal» pasa a llamarse **grupo máximo**, y «implicante
  principal esencial», **grupo esencial**, en toda la aplicación y el PDF.
  El glosario recuerda que en los libros se llaman «implicante primo» e
  «implicante».
- Los grupos de la tabla de Quine–McCluskey y del método de Petrick se
  rotulan G1, G2… (antes P1, P2…, que se confundían con el producto P de
  Petrick).

### Corregido
- Teoría y glosario aclaran que «máximo» no significa «el más grande del
  mapa»: un par también es máximo si no puede crecer.
- Paso a paso y Teoría decían que un grupo es esencial si es «el grupo más
  grande» que se puede formar con un uno; ahora dicen correctamente que es
  esencial si ese uno solo cabe en un grupo máximo.
- Quine–McCluskey: los términos que no se combinan *corresponden* a los
  grupos máximos del mapa (antes se decía que *son* implicantes).

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

[5.4.1]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.4.1
[5.4.0]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.4.0
[5.3.0]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.3.0
[5.2.2]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.2.2
[5.2.1]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.2.1
[5.2.0]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.2.0
[5.1.2]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.1.2
[5.1.1]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.1.1
[5.1.0]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.1.0
[5.0.1]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.0.1
[5.0.0]: https://github.com/andresdasugo/Karnaugh/releases/tag/v5.0.0
