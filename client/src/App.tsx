import { useState } from 'react';
import type { StyleResult } from './types/StyleResult';

const tagOrder = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'strong', 'em', 'a', 'li', 'span'];

function App() {
  const [url, setUrl] = useState('');
  const [styles, setStyles] = useState<StyleResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setStyles([]);

    try {
      const res = await fetch('http://localhost:4000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.styles) setStyles(data.styles);
      else alert('No se encontraron estilos.');
    } catch {
      alert('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Agrupa estilos únicos por tag y por font, size y weight (ignorando color y fondo)
  const groupedStyles = tagOrder.reduce<Record<string, StyleResult[]>>((acc, tag) => {
    const filtered = styles.filter(s => s.tag === tag);
    const uniqueStyles: StyleResult[] = [];

    filtered.forEach(style => {
      const exists = uniqueStyles.some(
        s =>
          s.font === style.font &&
          s.size === style.size &&
          s.weight === style.weight
      );
      if (!exists) uniqueStyles.push(style);
    });

    if (uniqueStyles.length > 0) acc[tag] = uniqueStyles;
    return acc;
  }, {});

  const sampleTexts: Record<string, string> = {
    h1: 'Título Principal (h1)',
    h2: 'Subtítulo (h2)',
    h3: 'Encabezado (h3)',
    h4: 'Encabezado menor (h4)',
    h5: 'Encabezado pequeño (h5)',
    h6: 'Encabezado mínimo (h6)',
    p: 'Párrafo de texto común.',
    small: 'Texto pequeño.',
    strong: 'Texto en negrita.',
    em: 'Texto en cursiva.',
    a: 'Texto de enlace.',
    li: 'Elemento de lista.',
    span: 'Span de texto genérico.',
  };

  const renderTextSample = (style: StyleResult) => (
    <div
      className="rounded-md p-4 shadow-md bg-white mb-4"
      style={{
        fontFamily: style.font,
        fontSize: style.size,
        fontWeight: style.weight,
        color: '#111',
        backgroundColor: '#fff',
      }}
    >
      <div>{sampleTexts[style.tag] || 'Ejemplo de texto'}</div>
      <div className="text-xs text-gray-600 mt-2">
        <strong>Fuente:</strong> {style.font} · <strong>Tamaño:</strong> {style.size} ·{' '}
        <strong>Peso:</strong> {style.weight}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analizador Tipográfico</h1>
        <p className="text-gray-600">Introduce una URL para analizar los estilos de texto que usa</p>
      </header>

      <div className="max-w-xl mx-auto flex gap-2 mb-8">
        <input
          type="text"
          placeholder="https://ejemplo.com"
          className="flex-1 p-3 border rounded-md shadow-sm"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          {loading ? 'Analizando...' : 'Analizar'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {Object.entries(groupedStyles).map(([tag, styles]) => (
          <section key={tag}>
            <h2 className="text-2xl font-semibold mb-4 uppercase">{tag}</h2>
            {styles.map((style, idx) => (
              <div key={idx}>{renderTextSample(style)}</div>
            ))}
          </section>
        ))}

        {styles.length === 0 && !loading && (
          <p className="text-center text-gray-500">Introduce una URL y haz clic en Analizar para comenzar.</p>
        )}
      </div>
    </div>
  );
}

export default App;
