# Cómo contribuir

¡Gracias por ayudar a mejorar el Laboratorio Karnaugh!

## Reportar un error o sugerir una mejora

Abre un [issue](https://github.com/andresdasugo/Karnaugh/issues/new/choose) y
elige la plantilla correspondiente. Si el error tiene que ver con una función
concreta, incluye su **código para compartir** (en la calculadora:
«Compartir o cargar un ejercicio» → «Copiar código de esta función»): así se
puede reproducir exactamente.

## Proponer cambios

1. Haz un *fork* del repositorio y crea una rama para tu cambio.
2. Toda la aplicación está en `index.html`. Ábrelo en el navegador o ejecuta
   `npm start` y visita <http://localhost:8080>.
3. Si cambias el núcleo lógico (el objeto `K`), agrega o actualiza las pruebas en
   `tests/` y ejecuta `npm test`. Para que también se ejecuten los bancos de
   prueba de VHDL y Verilog instala GHDL e Icarus Verilog (en Ubuntu:
   `sudo apt install ghdl iverilog`); sin ellos esas pruebas se omiten.
4. Comprueba el cambio en un celular (o con la vista adaptable del navegador) y en
   los temas claro y oscuro.
5. Anota el cambio en `CHANGELOG.md` y abre un *pull request* explicando qué
   cambia y por qué.

## Estilo

- Textos de la interfaz en español, claros y dirigidos al estudiante (tú).
- Sin dependencias de compilación: HTML, CSS y JavaScript que funcionen al abrir
  el archivo directamente.
- Sigue la configuración de `.editorconfig` (2 espacios, UTF-8, LF).
