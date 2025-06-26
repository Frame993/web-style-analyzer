export interface StyleResult {
  tag: string;        // Etiqueta HTML, como h1, h2, p, etc.
  font: string;       // Familia tipográfica (e.g. "Arial", "Roboto")
  fontWeight: string; // Peso de la fuente (e.g. "400", "bold")
  size: string;       // Tamaño de fuente (e.g. "16px")
  weight: string;     // Peso de la fuente (e.g. "400", "bold")
  color: string;      // Color de texto (e.g. "#333")
  bgColor: string;    // Color de fondo del texto (e.g. "transparent", "#fff")
  key?: string;       // Campo opcional por si necesitas una key única (puedes ignorarlo si usas el índice como key en `.map()`)
}
