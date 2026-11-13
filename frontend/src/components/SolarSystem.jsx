import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight, BookOpen, Camera, Check, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Compass, Crosshair, GitCompareArrows, Home, ListFilter,
  Menu, Orbit, Pause, Play, RotateCcw, Search, Settings2, Share2, X
} from 'lucide-react';
import { planetData } from '../data/planets';
import SolarScene, { PLANET_KEYS, planetTexture } from './SolarScene';
import './SolarSystem.css';

const PLANETS = PLANET_KEYS.filter(id => id !== 'sun');
const TYPES = [
  { id: 'all', label: 'Todos' },
  { id: 'rocky', label: 'Rocosos' },
  { id: 'giant', label: 'Gigantes' }
];
const TUTORIAL = [
  { id: 'sun', title: 'Nuestra estrella', text: 'El Sol contiene la mayor parte de la masa del sistema solar y proporciona la energía que reciben los planetas.' },
  { id: 'mercury', title: 'Los planetas interiores', text: 'Mercurio, Venus, Tierra y Marte son planetas rocosos y están más próximos al Sol.' },
  { id: 'earth', title: 'El hogar de la vida conocida', text: 'La Tierra mantiene agua líquida en superficie y posee una atmósfera que influye en su clima.' },
  { id: 'mars', title: 'Un mundo para explorar', text: 'Marte conserva evidencias geológicas de la presencia de agua en su pasado.' },
  { id: 'jupiter', title: 'El planeta más grande', text: 'Júpiter es un gigante gaseoso con una extensa familia de satélites naturales.' },
  { id: 'saturn', title: 'Un sistema de anillos', text: 'Los anillos de Saturno están compuestos principalmente por hielo y material rocoso.' },
  { id: 'uranus', title: 'La rotación inclinada', text: 'Urano destaca por la inclinación extrema de su eje de rotación.' },
  { id: 'neptune', title: 'El mundo más lejano', text: 'Neptuno es el planeta más distante del Sol en el sistema de ocho planetas.' }
];
const QUESTIONS = [
  { q:'¿Cuál es el planeta más próximo al Sol?', options:['Venus','Mercurio','Tierra','Marte'], answer:'Mercurio', target:'mercury', why:'Mercurio ocupa la primera órbita planetaria.' },
  { q:'¿Qué planeta tiene el mayor diámetro?', options:['Neptuno','Saturno','Júpiter','Urano'], answer:'Júpiter', target:'jupiter', why:'Júpiter es el planeta más grande del sistema solar.' },
  { q:'¿Cuál es el planeta conocido por sus extensos anillos?', options:['Saturno','Marte','Tierra','Mercurio'], answer:'Saturno', target:'saturn', why:'Saturno presenta un complejo y visible sistema de anillos.' },
  { q:'¿Dónde se encuentran Fobos y Deimos?', options:['Venus','Júpiter','Marte','Neptuno'], answer:'Marte', target:'mars', why:'Fobos y Deimos son los dos satélites naturales de Marte incluidos en este modelo.' },
  { q:'¿Qué planeta tiene una inclinación extrema de su eje?', options:['Urano','Tierra','Venus','Júpiter'], answer:'Urano', target:'uranus', why:'Urano presenta una inclinación axial próxima a 98 grados.' },
  { q:'¿Cuál es el planeta más distante del Sol?', options:['Saturno','Urano','Neptuno','Júpiter'], answer:'Neptuno', target:'neptune', why:'Neptuno es el octavo planeta desde el Sol.' }
];
const INITIAL_OPTIONS = {
  showLabels: true, showOrbits: true, showAsteroids: true, showMoons: true,
  showSelectionWireframe: false,
  showGrid: false, follow: true, background: 'texture', quality: 'high'
};
const DATA_ROWS = [
  ['Tipo','type'], ['Diámetro','diameter'], ['Masa','mass'], ['Temperatura','temperature'],
  ['Período orbital','orbital_period'], ['Rotación / día','day_length'], ['Composición','composition']
];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function ToolButton({ icon: Icon, children, active = false, ...rest }) {
  return <button type="button" className={'tool-button' + (active ? ' active' : '')} {...rest}>
    <Icon size={17} strokeWidth={1.8}/>{children && <span>{children}</span>}
  </button>;
}

function PlanetCatalogue({ selected, filter, setFilter, search, setSearch, select }) {
  const filtered = PLANET_KEYS.filter(id => {
    const p = planetData[id];
    const matches = p.name.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'));
    if (filter === 'rocky') return matches && p.info.type.includes('rocoso');
    if (filter === 'giant') return matches && (p.info.type.includes('gigante') || p.info.type.includes('Gigante'));
    return matches;
  });
  return <>
    <div className="search-box"><Search size={16}/><input id="planet-search" aria-label="Buscar planetas" placeholder="Buscar cuerpo celeste" value={search} onChange={e=>setSearch(e.target.value)} /></div>
    <div className="catalog-filters" role="group" aria-label="Filtrar cuerpos celestes">
      {TYPES.map(t=><button className={filter===t.id?'active':''} key={t.id} onClick={()=>setFilter(t.id)}>{t.label}</button>)}
    </div>
    <div className="catalog-list">
      {filtered.map(id=> {
        const p = planetData[id];
        return <button key={id} className={'planet-row'+(selected===id?' selected':'')} onClick={()=>select(id)}>
          <span className="planet-swatch" style={{background:p.color,boxShadow:'0 0 12px '+p.color+'77'}} />
          <span className="planet-row-name">{p.name}<small>{p.info.type}</small></span>
          <span className="planet-index">{id==='sun'?'00':String(PLANETS.indexOf(id)+1).padStart(2,'0')}</span>
          <ChevronRight size={16}/>
        </button>;
      })}
      {!filtered.length && <div className="empty-search">No hay resultados para esta búsqueda.</div>}
    </div>
  </>;
}

function PlanetDetail({ selected, onClose, onTravel, onCompare, capture, onNext }) {
  const info = planetData[selected];
  if (!info) return null;
  return <aside className="detail-panel" aria-label={'Información de '+info.name}>
    <div className="detail-top"><span className="caption-text">FICHA ASTRONÓMICA</span><button className="icon-btn" onClick={onClose} aria-label="Cerrar ficha"><X size={18}/></button></div>
    <div className="detail-scroll">
      <div className="planet-hero" style={{background:'linear-gradient(145deg,'+info.color+'18,#0b1928)'}}>
        <img src={planetTexture(selected)} alt={'Superficie de '+info.name} loading="lazy"/>
        <span className="hero-caption">TEXTURA ILUSTRATIVA</span>
      </div>
      <div className="planet-title-row"><span className="caption-text">{info.info.type}</span><h2>{info.name}</h2></div>
      <p className="detail-description">{info.info.description}</p>
      <div className="detail-actions">
        <button className="primary-button" onClick={onTravel}><Crosshair size={16}/> Enfocar en 3D</button>
        <button className="secondary-button" onClick={capture} title="Guardar imagen"><Camera size={17}/></button>
      </div>
      <div className="detail-stats">
        {DATA_ROWS.filter(([,key])=>info.info[key]).map(([label,key])=><div className="stat-row" key={key}><span>{label}</span><strong>{info.info[key]}</strong></div>)}
      </div>
      <p className="educational-note">Distancias, tamaños y velocidades representados de forma esquemática, no a escala.</p>
      <button className="detail-text-button" onClick={()=>onCompare(selected)}><GitCompareArrows size={16}/> Comparar con otro planeta <ArrowRight size={15}/></button>
      <button className="detail-text-button" onClick={onNext}><ChevronRight size={16}/> Siguiente cuerpo celeste <ArrowRight size={15}/></button>
    </div>
  </aside>;
}

function Tour({ index, setIndex, select, finish }) {
  const t = TUTORIAL[index];
  return <div className="panel-content">
    <span className="caption-text">RECORRIDO DE APRENDIZAJE</span><h2>Explora el sistema solar</h2>
    <div className="progress-track"><div style={{width:(index+1)*100/TUTORIAL.length+'%'}} /></div>
    <p className="small-muted">Estación {index+1} de {TUTORIAL.length}</p>
    <div className="tour-card">
      <span className="tour-counter">{String(index+1).padStart(2,'0')}</span>
      <h3>{t.title}</h3><p>{t.text}</p>
      <button className="secondary-button" onClick={()=>select(t.id)}><Crosshair size={15}/> Ver {planetData[t.id].name}</button>
    </div>
    <div className="panel-nav">
      <button disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ChevronLeft size={16}/> Anterior</button>
      {index===TUTORIAL.length-1?<button className="primary-button" onClick={finish}><Check size={16}/> Finalizar</button>:
        <button className="primary-button" onClick={()=>setIndex(i=>i+1)}>Siguiente <ChevronRight size={16}/></button>}
    </div>
  </div>;
}

function Quiz({ index, setIndex, answers, setAnswers, select, reset }) {
  const question = QUESTIONS[index];
  const chosen=answers[index];
  if (!question) {
    const correct=answers.reduce((n,a,i)=>n+(a===QUESTIONS[i].answer?1:0),0);
    return <div className="panel-content">
      <span className="caption-text">EVALUACIÓN FINALIZADA</span><h2>Resultados</h2>
      <div className="quiz-score"><strong>{correct}/{QUESTIONS.length}</strong><p>{correct===QUESTIONS.length?'Dominio completo de las preguntas.':'Puedes repasar los planetas e intentarlo de nuevo.'}</p></div>
      <button className="primary-button wide" onClick={reset}><RotateCcw size={16}/> Volver a empezar</button>
    </div>;
  }
  return <div className="panel-content">
    <span className="caption-text">PRUEBA DE CONOCIMIENTOS</span><h2>Desafío astronómico</h2>
    <div className="progress-track"><div style={{width:answers.length*100/QUESTIONS.length+'%'}} /></div>
    <p className="small-muted">Pregunta {index+1} de {QUESTIONS.length}</p>
    <h3 className="question-title">{question.q}</h3>
    <div className="quiz-options">
      {question.options.map((option,i)=><button key={option} disabled={!!chosen}
        className={chosen ? (option===question.answer?'correct':option===chosen?'incorrect':'') : ''}
        onClick={()=>setAnswers(prev=>[...prev.slice(0,index),option])}>
        <span>{String.fromCharCode(65+i)}</span>{option}</button>)}
    </div>
    {chosen && <div className="answer-message"><strong>{chosen===question.answer?'Correcto':'Respuesta: '+question.answer}</strong>
      <p>{question.why}</p><button onClick={()=>select(question.target)}>Enfocar el planeta <ArrowRight size={14}/></button></div>}
    {chosen && <button className="primary-button wide" onClick={()=>setIndex(i=>i+1)}>{index===QUESTIONS.length-1?'Ver resultados':'Siguiente pregunta'} <ArrowRight size={15}/></button>}
  </div>;
}

function Comparison({ left, right, setLeft, setRight, select }) {
  return <div className="panel-content">
    <span className="caption-text">HERRAMIENTA DE ESTUDIO</span><h2>Comparador planetario</h2>
    <p className="small-muted">Compara las características registradas de dos cuerpos celestes.</p>
    <div className="compare-pickers">
      <label>CUERPO A<select value={left} onChange={e=>setLeft(e.target.value)}>{PLANETS.map(id=><option key={id} value={id}>{planetData[id].name}</option>)}</select></label>
      <label>CUERPO B<select value={right} onChange={e=>setRight(e.target.value)}>{PLANETS.map(id=><option key={id} value={id}>{planetData[id].name}</option>)}</select></label>
    </div>
    <div className="compare-header">
      {[left,right].map(id=><button key={id} onClick={()=>select(id)}>
        <span className="planet-swatch" style={{background:planetData[id].color}} />{planetData[id].name}<Crosshair size={13}/>
      </button>)}
    </div>
    <div className="compare-table">
      {DATA_ROWS.filter(([,k])=>planetData[left].info[k]||planetData[right].info[k]).map(([label,key])=><div key={key}>
        <span>{label}</span><strong>{planetData[left].info[key]||'—'}</strong><strong>{planetData[right].info[key]||'—'}</strong>
      </div>)}
    </div>
    <p className="educational-note">Los valores son aproximados y proceden del material descriptivo incluido en el proyecto.</p>
  </div>;
}

function Settings({ options, setOptions, reset }) {
  const toggle=(key)=>setOptions(prev=>({...prev,[key]:!prev[key]}));
  const switches=[
    ['showLabels','Etiquetas de los planetas'],
    ['showSelectionWireframe','Mostrar malla de selección'],
    ['showOrbits','Trayectorias orbitales'],
    ['showAsteroids','Cinturón de asteroides'],
    ['showMoons','Satélites naturales'],
    ['showGrid','Cuadrícula de referencia'],
    ['follow','Seguimiento automático de cámara']
  ];
  return <div className="panel-content">
    <span className="caption-text">CONFIGURACIÓN</span><h2>Personalizar visualización</h2>
    <div className="settings-section"><span className="small-label">ELEMENTOS VISIBLES</span>
      {switches.map(([key,label])=><label className="setting-switch" key={key}><span>{label}</span><input type="checkbox" checked={options[key]} onChange={()=>toggle(key)}/></label>)}
    </div>
    <div className="settings-section">
      <label className="small-label" htmlFor="render-quality">CALIDAD DE RENDERIZADO</label>
      <select id="render-quality" value={options.quality} onChange={e=>setOptions(prev=>({...prev,quality:e.target.value}))}>
        <option value="low">Baja — equipos básicos</option><option value="medium">Media — equilibrada</option><option value="high">Alta — detalles y texturas</option>
      </select>
      <label className="small-label" htmlFor="star-background">FONDO ESPACIAL</label>
      <select id="star-background" value={options.background} onChange={e=>setOptions(prev=>({...prev,background:e.target.value}))}>
        <option value="texture">Vía Láctea (textura)</option><option value="stars">Campo estelar</option><option value="off">Fondo limpio</option>
      </select>
    </div>
    <button className="secondary-button wide" onClick={reset}><RotateCcw size={15}/> Restaurar preferencias</button>
    <p className="educational-note">Reducir la calidad gráfica disminuye la cantidad de asteroides y la resolución interna. Se preserva la capacidad de exploración.</p>
  </div>;
}

function Help() {
  return <div className="panel-content">
    <span className="caption-text">DOCUMENTACIÓN DE USO</span><h2>Controles del explorador</h2>
    <div className="help-entry"><strong>Rotar la vista</strong><p>Arrastra el mouse o un dedo sobre el espacio 3D.</p></div>
    <div className="help-entry"><strong>Acercar y alejar</strong><p>Usa la rueda del mouse, el gesto de pellizco o el zoom táctil.</p></div>
    <div className="help-entry"><strong>Seleccionar un planeta</strong><p>Haz clic en una esfera o selecciónalo desde el catálogo.</p></div>
    <div className="help-entry"><strong>Teclado</strong><p>Espacio: pausa. Inicio: vista general. /: búsqueda. Esc: cerrar paneles. Flechas izquierda/derecha: planeta anterior/siguiente.</p></div>
    <div className="help-entry"><strong>Compartir</strong><p>El enlace conserva el planeta seleccionado para que otros puedan visitarlo directamente.</p></div>
    <div className="help-entry"><strong>Alcance del modelo</strong><p>Las órbitas son circulares, las velocidades son relativas y las distancias y los radios no guardan escala astronómica entre sí.</p></div>
    <a className="external-link" href="https://science.nasa.gov/solar-system/" target="_blank" rel="noopener noreferrer">Explorar el sistema solar en NASA <ArrowRight size={14}/></a>
  </div>;
}

export default function SolarSystem() {
  const [selected,setSelected]=useState(null);
  const [speed,setSpeed]=useState(1);
  const lastSpeed=useRef(1);
  const [focus,setFocus]=useState(null);
  const [homeSignal,setHomeSignal]=useState(0);
  const [openTool,setOpenTool]=useState(()=>window.innerWidth < 760 ? null : 'catalog');
  const [filter,setFilter]=useState('all');
  const [search,setSearch]=useState('');
  const [options,setOptions]=useState(INITIAL_OPTIONS);
  const [tourIndex,setTourIndex]=useState(0);
  const [quizIndex,setQuizIndex]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [compareLeft,setCompareLeft]=useState('earth');
  const [compareRight,setCompareRight]=useState('mars');
  const [toast,setToast]=useState('');
  const canvasRef=useRef(null);
  const scrollIds=PLANET_KEYS;
  const select = useCallback((id, {keepOpen = false} = {})=>{
    if (!planetData[id]) return;
    setSelected(id);
    setFocus({key:id,id:Date.now()});
    if (!keepOpen && window.innerWidth < 760) setOpenTool(null);
  },[]);
  const home = useCallback(()=>{setFocus(null);setSelected(null);setHomeSignal(x=>x+1);},[]);
  const togglePause=useCallback(()=>{
    setSpeed(prev=>{
      if (prev>0) {lastSpeed.current=prev;return 0;}
      return lastSpeed.current || 1;
    });
  },[]);
  const showToast=(message)=>setToast(message);
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const id=params.get('planet');
    if (id && planetData[id]) select(id);
  },[select]);
  useEffect(()=>{
    if (!toast) return;
    const t=window.setTimeout(()=>setToast(''),2800);return ()=>clearTimeout(t);
  },[toast]);
  useEffect(()=>{
    const handler=e=>{
      if (/input|textarea|select/i.test(document.activeElement?.tagName||'')) return;
      if (e.key===' '){e.preventDefault();togglePause();}
      if (e.key==='Home'){e.preventDefault();home();}
      if (e.key==='Escape'){setOpenTool(null);setSelected(null);}
      if (e.key==='/'){e.preventDefault();setOpenTool('catalog');window.setTimeout(()=>document.getElementById('planet-search')?.focus(),50);}
      if (e.key==='ArrowRight'||e.key==='ArrowLeft'){
        const index=Math.max(0,scrollIds.indexOf(selected));
        const next=(index+(e.key==='ArrowRight'?1:-1)+scrollIds.length)%scrollIds.length;
        select(scrollIds[next]);
      }
    };
    window.addEventListener('keydown',handler);return ()=>window.removeEventListener('keydown',handler);
  },[selected,select,togglePause,home,scrollIds]);
  const nextPlanet=()=>select(PLANET_KEYS[(PLANET_KEYS.indexOf(selected)+1)%PLANET_KEYS.length]);
  const toggleTool=(tool)=>{
    setOpenTool(v=>v===tool?null:tool);
    if (tool==='tour') {setTourIndex(0);select(TUTORIAL[0].id,{keepOpen:true});}
  };
  useEffect(()=>{
    if (openTool === 'tour') select(TUTORIAL[tourIndex].id,{keepOpen:true});
  },[openTool,tourIndex,select]);
  const resetSettings=()=>{setOptions(INITIAL_OPTIONS);showToast('Preferencias restauradas');};
  const onCompare=(planet)=>{
    setCompareLeft(planet==='sun'?'earth':planet);
    setCompareRight(planet==='mars'?'jupiter':'mars');
    setOpenTool('compare');
  };
  const capture=()=>{
    try{
      const original=canvasRef.current;
      if(!original){showToast('La escena todavía está cargando');return;}
      const out=document.createElement('canvas');const scale=Math.min(1,3000/Math.max(original.width,original.height));
      out.width=Math.round(original.width*scale);out.height=Math.round(original.height*scale);
      const ctx=out.getContext('2d');if(!ctx)throw Error('canvas');
      ctx.drawImage(original,0,0,out.width,out.height);
      const bar=Math.max(48,Math.round(out.height*.105));
      ctx.fillStyle='#091724ed';ctx.fillRect(0,out.height-bar,out.width,bar);
      ctx.fillStyle='#d9eef6';ctx.font='600 '+Math.max(18,Math.round(out.width*.022))+'px system-ui';
      ctx.fillText('SISTEMA SOLAR 3D',24,out.height-bar*.47);
      ctx.font=Math.max(11,Math.round(out.width*.011))+'px system-ui';ctx.fillStyle='#8db8c9';
      ctx.fillText('Simulación educativa · Escalas y tiempos esquemáticos',24,out.height-12);
      out.toBlob(blob=>{
        if(!blob){showToast('Error al crear el PNG');return;}
        const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='sistema-solar-3d.png';
        document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),3000);
        showToast('Captura descargada');
      },'image/png');
    }catch{showToast('No se pudo capturar la imagen');}
  };
  const share=async()=>{
    const url=new URL(window.location.href);
    if(selected)url.searchParams.set('planet',selected);else url.searchParams.delete('planet');
    try{await navigator.clipboard.writeText(url.toString());showToast('Enlace copiado');}
    catch{showToast('Puedes copiar la dirección del navegador');}
  };
  const starName=selected?planetData[selected].name:null;
  return <div className="solar-app">
    <SolarScene speed={speed} selected={selected} focus={focus}
      onSelect={select} homeSignal={homeSignal} options={options} canvasRef={canvasRef} />
    <a className="skip-link" href="#solar-navigation">Ir a la navegación</a>
    <header className="solar-header">
      <div className="brand">
        <span className="brand-mark"><Orbit size={24}/></span>
        <span><strong>SISTEMA SOLAR <em>3D</em></strong><small>OBSERVATORIO INTERACTIVO</small></span>
      </div>
      <div className="top-center"><span className="live-dot"/><span>EXPLORACIÓN DEL SISTEMA SOLAR</span></div>
      <div className="header-buttons">
        <ToolButton icon={Menu} onClick={()=>toggleTool('catalog')} active={openTool==='catalog'} aria-label="Mostrar catálogo">Explorar</ToolButton>
        <ToolButton icon={Share2} onClick={share} aria-label="Copiar enlace de la vista">Compartir</ToolButton>
        <ToolButton icon={CircleHelp} onClick={()=>toggleTool('help')} active={openTool==='help'} aria-label="Abrir ayuda" />
      </div>
    </header>
    <div className={'workspace-label'+(openTool?' shifted':'')}>
      <span className="caption-text">EXPLORACIÓN ESPACIAL</span>
      <h1>{starName||'El sistema solar'}</h1>
      <p>{starName?'Vista de un cuerpo celeste':'Recorre ocho planetas y nuestra estrella'}</p>
    </div>
    <nav className={'nav-panel'+(openTool?' open':'')} id="solar-navigation" aria-label="Herramientas y exploración">
      {openTool && <><div className="panel-header">
        <div><span className="caption-text">CENTRO DE CONTROL</span><h2>{openTool==='catalog'?'Explorador':openTool==='tour'?'Aprendizaje':openTool==='quiz'?'Evaluación':openTool==='compare'?'Comparación':openTool==='settings'?'Configuración':'Guía'}</h2></div>
        <button className="icon-btn" aria-label="Cerrar panel" onClick={()=>setOpenTool(null)}><X size={18}/></button>
      </div>
      <div className="panel-scroller">
        {openTool==='catalog' && <PlanetCatalogue selected={selected} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} select={select}/>}
        {openTool==='tour' && <Tour index={tourIndex} setIndex={setTourIndex} select={select} finish={()=>setOpenTool('catalog')} />}
        {openTool==='quiz' && <Quiz index={quizIndex} setIndex={setQuizIndex} answers={answers} setAnswers={setAnswers} select={select} reset={()=>{setQuizIndex(0);setAnswers([]);}} />}
        {openTool==='compare' && <Comparison left={compareLeft} right={compareRight} setLeft={setCompareLeft} setRight={setCompareRight} select={select}/>}
        {openTool==='settings' && <Settings options={options} setOptions={setOptions} reset={resetSettings}/>}
        {openTool==='help' && <Help/>}
      </div></>}
      <div className="nav-tools" role="group" aria-label="Herramientas principales">
        {[
          {id:'catalog',label:'Cuerpos',icon:ListFilter},
          {id:'tour',label:'Recorrido',icon:Compass},
          {id:'compare',label:'Comparar',icon:GitCompareArrows},
          {id:'quiz',label:'Preguntas',icon:BookOpen},
          {id:'settings',label:'Ajustes',icon:Settings2}
        ].map(item=><button key={item.id} title={item.label} aria-pressed={openTool===item.id}
          className={openTool===item.id?'active':''} onClick={()=>toggleTool(item.id)}>
          <item.icon size={19}/><span>{item.label}</span></button>)}
      </div>
    </nav>
    <div className={'camera-tools'+(selected?' with-detail':'')} role="group" aria-label="Navegación de cámara">
      <button title="Volver al sistema completo" aria-label="Vista general" onClick={home}><Home size={18}/></button>
      <button title="Enfocar planeta" aria-label="Enfocar planeta" disabled={!selected} onClick={()=>select(selected)}><Crosshair size={18}/></button>
      <button title="Guardar captura" aria-label="Guardar PNG" onClick={capture}><Camera size={18}/></button>
    </div>
    {selected && <PlanetDetail selected={selected} onClose={()=>setSelected(null)} onTravel={()=>select(selected)}
      compare={onCompare} onCompare={onCompare} onNext={nextPlanet} capture={capture} />}
    <footer className="simulation-footer">
      <div className="time-info"><Clock3 size={18}/><div><strong>Control del tiempo</strong><small>Velocidad de simulación</small></div></div>
      <div className="time-controls">
        <button className="play-button" onClick={togglePause} aria-label={speed===0?'Reanudar':'Pausar'} title={speed===0?'Reanudar':'Pausar'}>{speed===0?<Play size={17}/>:<Pause size={17}/>}</button>
        <input type="range" aria-label="Velocidad de simulación" min="0" max="5" step=".1"
          value={speed} onChange={e=>setSpeed(clamp(Number(e.target.value),0,5))} />
        <span className="speed-value">{speed.toFixed(1)}x</span>
        <div className="speed-presets">{[0.5,1,3].map(n=><button key={n} className={speed===n?'active':''} onClick={()=>setSpeed(n)}>{n}x</button>)}</div>
        <button className="footer-reset" aria-label="Reiniciar tiempo" title="Velocidad normal" onClick={()=>setSpeed(1)}><RotateCcw size={17}/></button>
      </div>
      <div className="footer-caption"><span className="live-dot"/><span>MODELO DIDÁCTICO · NO A ESCALA</span></div>
    </footer>
    {toast && <div role="status" className="toast"><Check size={15}/>{toast}</div>}
  </div>;
}
