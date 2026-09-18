import { useState, useEffect, useRef, useCallback } from 'react';
import { planets, Planet, Moon } from './data/planets';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [showMoons, setShowMoons] = useState(true);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);

  const getPlanetPosition = useCallback((planet: Planet, time: number, centerX: number, centerY: number, currentZoom: number) => {
    const angle = (time / planet.orbitalPeriod) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * planet.orbitRadius * currentZoom;
    const y = centerY + Math.sin(angle) * planet.orbitRadius * currentZoom;
    return { x, y, angle };
  }, []);

  const getMoonPosition = useCallback((moon: Moon, planetPos: { x: number; y: number }, time: number, currentZoom: number) => {
    const moonAngle = (time / moon.orbitalPeriod) * Math.PI * 2;
    const moonDist = moon.displayDistance * Math.min(currentZoom * 0.8 + 0.2, 1.5);
    const mx = planetPos.x + Math.cos(moonAngle) * moonDist;
    const my = planetPos.y + Math.sin(moonAngle) * moonDist;
    return { x: mx, y: my, angle: moonAngle };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number, currentZoom: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    const starSeed = 42;
    for (let i = 0; i < 200; i++) {
      const sx = ((starSeed * (i + 1) * 7) % width);
      const sy = ((starSeed * (i + 1) * 13) % height);
      const size = ((i * 3) % 3) * 0.5 + 0.5;
      const alpha = 0.3 + ((i * 7) % 10) / 10 * 0.7;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Draw orbits
    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius * currentZoom, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunRadius = 30 * currentZoom;
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius);
    sunGradient.addColorStop(0, '#fff7e0');
    sunGradient.addColorStop(0.3, '#ffcc00');
    sunGradient.addColorStop(0.7, '#ff8800');
    sunGradient.addColorStop(1, '#ff440044');
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowRadius = 50 * currentZoom;
    const glowGradient = ctx.createRadialGradient(centerX, centerY, sunRadius * 0.8, centerX, centerY, glowRadius);
    glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planets.forEach((planet) => {
      const { x, y } = getPlanetPosition(planet, time, centerX, centerY, currentZoom);
      const isHovered = hoveredPlanet === planet.name;
      const isSelected = selectedPlanet?.name === planet.name;
      const baseRadius = planet.displayRadius * Math.min(currentZoom * 0.5 + 0.5, 2);
      const radius = isHovered || isSelected ? baseRadius * 1.3 : baseRadius;

      // Draw moon orbits
      if (showMoons && planet.moons.length > 0) {
        planet.moons.forEach((moon) => {
          const moonOrbitRadius = moon.displayDistance * Math.min(currentZoom * 0.8 + 0.2, 1.5);
          ctx.beginPath();
          ctx.arc(x, y, moonOrbitRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      }

      // Draw moons
      if (showMoons && planet.moons.length > 0) {
        planet.moons.forEach((moon) => {
          const moonPos = getMoonPosition(moon, { x, y }, time, currentZoom);
          const moonRadius = moon.displayRadius * Math.min(currentZoom * 0.4 + 0.6, 1.5);

          ctx.beginPath();
          ctx.arc(moonPos.x, moonPos.y, moonRadius, 0, Math.PI * 2);
          ctx.fillStyle = moon.color;
          ctx.fill();
        });
      }

      // Planet glow when hovered/selected
      if (isHovered || isSelected) {
        const glowGrad = ctx.createRadialGradient(x, y, radius, x, y, radius * 2.5);
        glowGrad.addColorStop(0, planet.color + '66');
        glowGrad.addColorStop(1, planet.color + '00');
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // Planet body
      const planetGradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(1, planet.color);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn rings
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 2, radius * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = '#e8d08088';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Planet name label
      if (isHovered || isSelected) {
        ctx.font = `${Math.max(11, 12 * currentZoom)}px Inter, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(planet.nameRu, x, y - radius - 8);
      }
    });
  }, [getPlanetPosition, getMoonPosition, hoveredPlanet, selectedPlanet, showMoons]);

  const animate = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      timeRef.current += (delta / 1000) * speed * 50;
    }

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    draw(ctx, width, height, timeRef.current, zoom);
    animationRef.current = requestAnimationFrame(animate);
  }, [draw, isPlaying, speed, zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (const planet of planets) {
      const pos = getPlanetPosition(planet, timeRef.current, centerX, centerY, zoom);
      const baseRadius = planet.displayRadius * Math.min(zoom * 0.5 + 0.5, 2);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      const hitRadius = Math.max(baseRadius * 1.5, 15);
      if (dist <= hitRadius) {
        setSelectedPlanet(selectedPlanet?.name === planet.name ? null : planet);
        return;
      }
    }
    setSelectedPlanet(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let found = false;
    for (const planet of planets) {
      const pos = getPlanetPosition(planet, timeRef.current, centerX, centerY, zoom);
      const baseRadius = planet.displayRadius * Math.min(zoom * 0.5 + 0.5, 2);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      const hitRadius = Math.max(baseRadius * 1.5, 15);
      if (dist <= hitRadius) {
        setHoveredPlanet(planet.name);
        canvas.style.cursor = 'pointer';
        found = true;
        break;
      }
    }
    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
  };

  const speedOptions = [0.25, 0.5, 1, 2, 5, 10];
  const zoomOptions = [0.5, 0.75, 1, 1.5, 2, 2.5];

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-[#0d0d2b] to-[#1a1a3e] border-b border-white/10">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center">
          🌌 Интерактивная Солнечная Система
        </h1>
        <p className="text-xs md:text-sm text-gray-400 text-center mt-1">
          Нажмите на планету для получения информации • Колёсико мыши для масштабирования
        </p>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Canvas area */}
        <div className="flex-1 relative min-h-[300px]">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onWheel={handleWheel}
            className="w-full h-full"
          />

          {/* Zoom indicator */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs border border-white/10">
            Масштаб: {zoom.toFixed(1)}x
          </div>
        </div>

        {/* Info panel */}
        {selectedPlanet && (
          <div className="md:w-80 flex-shrink-0 bg-[#12122a]/95 backdrop-blur-sm border-t md:border-t-0 md:border-l border-white/10 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{selectedPlanet.nameRu}</h2>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-gray-400 hover:text-white transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full shadow-lg"
                  style={{ backgroundColor: selectedPlanet.color }}
                />
                <span className="text-gray-300 text-sm">{selectedPlanet.name}</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedPlanet.description}
              </p>

              <div className="grid grid-cols-1 gap-2 mt-4">
                <InfoCard
                  icon="📏"
                  label="Радиус"
                  value={`${selectedPlanet.radius.toLocaleString()} км`}
                />
                <InfoCard
                  icon="☀️"
                  label="Расстояние от Солнца"
                  value={`${selectedPlanet.distanceFromSun} млн км`}
                />
                <InfoCard
                  icon="🔄"
                  label="Орбитальный период"
                  value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                />
                <InfoCard
                  icon="🌙"
                  label="Количество спутников"
                  value={`${selectedPlanet.moons.length}`}
                />
              </div>

              {/* Moons section */}
              {selectedPlanet.moons.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <span>🌙</span> Спутники
                  </h3>
                  <div className="space-y-2">
                    {selectedPlanet.moons.map((moon) => (
                      <MoonCard key={moon.name} moon={moon} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-[#0d0d2b] to-[#1a1a3e] border-t border-white/10">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/10"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span className="text-sm hidden sm:inline">Пауза</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                <span className="text-sm hidden sm:inline">Старт</span>
              </>
            )}
          </button>

          {/* Speed controls */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs hidden sm:inline">Скорость:</span>
            <div className="flex gap-1">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    speed === s
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs hidden sm:inline">Масштаб:</span>
            <div className="flex gap-1">
              {zoomOptions.map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    Math.abs(zoom - z) < 0.01
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {z}x
                </button>
              ))}
            </div>
            <button
              onClick={() => setZoom(1)}
              className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-200"
              title="Сбросить масштаб"
            >
              ↺
            </button>
          </div>

          {/* Show Moons toggle */}
          <button
            onClick={() => setShowMoons(!showMoons)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 border ${
              showMoons
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
            }`}
          >
            <span>🌙</span>
            <span className="text-xs hidden sm:inline">Спутники</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => { timeRef.current = 0; }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm hidden sm:inline">Сброс</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm text-white font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MoonCard({ moon }: { moon: Moon }) {
  return (
    <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-2">
        <div
          className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 shadow-sm"
          style={{ backgroundColor: moon.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm text-white font-medium">{moon.nameRu}</p>
            <span className="text-xs text-gray-500">{moon.name}</span>
          </div>
          <div className="mt-1 space-y-0.5">
            <p className="text-xs text-gray-400">
              📏 Радиус: <span className="text-gray-300">{moon.radius.toLocaleString()} км</span>
            </p>
            <p className="text-xs text-gray-400">
              🔄 Период: <span className="text-gray-300">{formatMoonPeriod(moon.orbitalPeriod)}</span>
            </p>
            <p className="text-xs text-gray-400">
              📍 До планеты: <span className="text-gray-300">{moon.distanceFromPlanet.toLocaleString()} тыс. км</span>
            </p>
            <p className="text-xs text-gray-400">
              ⚡ Скорость: <span className="text-gray-300">{calcMoonSpeed(moon)} км/с</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} дней`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} лет (${days.toLocaleString()} дней)`;
}

function formatMoonPeriod(days: number): string {
  if (days < 1) {
    return `${(days * 24).toFixed(1)} ч`;
  }
  return `${days.toFixed(2)} дн.`;
}

function calcMoonSpeed(moon: Moon): string {
  // v = 2 * pi * r / T
  const r = moon.distanceFromPlanet * 1000; // km
  const T = moon.orbitalPeriod * 86400; // seconds
  const v = (2 * Math.PI * r) / T;
  return v.toFixed(2);
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
  const b = Math.min(255, (num & 0x0000FF) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}

export default App;
