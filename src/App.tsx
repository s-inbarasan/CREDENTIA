import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { toast, Toaster } from 'sonner';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Copy,
  Download,
  FileImage,
  FlaskConical,
  Grid2X2,
  ImagePlus,
  Images,
  KeyRound,
  Layers3,
  LoaderCircle,
  Menu,
  Monitor,
  Moon,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  UserRound,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';
import { supabase } from './supabase';
import {
  formatTimeAgo,
  getModel,
  MODEL_REGISTRY,
  PROVIDERS,
  type GenerationRecord,
  type GenerationSettings,
} from './lib/forgeai';

const STORAGE_KEY = 'forgeai-history-v1';
const SESSION_KEY = 'forgeai-session-id';
const PROMPT_KEY = 'forgeai-prompts-v1';

type View = 'landing' | 'generate' | 'history' | 'models' | 'keys' | 'settings';
type QueueState = 'idle' | 'preparing' | 'sending' | 'generating' | 'processing' | 'completed' | 'failed';

type AuthState = {
  email: string;
  password: string;
  mode: 'sign-in' | 'sign-up';
};

const starterPrompt = 'Create a cinematic realistic portrait of a young woman standing in a futuristic Tokyo street at night, realistic skin texture, natural lighting, shallow depth of field.';

const initialSettings: GenerationSettings = {
  provider: 'nvidia',
  model: 'black-forest-labs/flux.2-klein-4b',
  ratio: '1:1',
  resolution: '1024 × 1024',
  images: 1,
  seed: 0,
  steps: 4,
  cfgScale: 0,
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function getSessionId() {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, next);
  return next;
}

function AppLogo({ compact = false, onClick }: { compact?: boolean; onClick?: () => void }) {
  return (
    <button className="brand-lockup" onClick={onClick} aria-label="Open ForgeAI overview">
      <div className={cx('flex items-center gap-3', compact && 'justify-center')}>
        <div className="logo-orbit"><span>F</span></div>
        {!compact && <div><div className="brand-name">Forge<span>AI</span></div><div className="brand-caption">generation workspace</div></div>}
      </div>
    </button>
  );
}

function IconButton({ label, onClick, children, active = false, className = '' }: { label: string; onClick?: () => void; children: React.ReactNode; active?: boolean; className?: string }) {
  return <button aria-label={label} title={label} onClick={onClick} className={cx('icon-button', active && 'icon-button-active', className)}>{children}</button>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="control-field"><span>{label}</span><div className="select-wrap"><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></div></label>;
}

function NavItem({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string }) {
  return <button className={cx('nav-item', active && 'nav-item-active')} onClick={onClick}><span className="nav-icon">{icon}</span><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</button>;
}

function EmptyPreview() {
  return <div className="empty-preview">
    <div className="preview-grid" />
    <div className="preview-center">
      <div className="preview-mark"><Sparkles size={20} /></div>
      <div className="preview-title">Your next image starts here</div>
      <div className="preview-copy">Describe a scene, mood, or visual direction.<br />ForgeAI will return the finished frame here.</div>
      <div className="preview-hint"><kbd>⌘</kbd><kbd>↵</kbd><span>to generate</span></div>
    </div>
    <div className="preview-corner preview-corner-tl" /><div className="preview-corner preview-corner-tr" /><div className="preview-corner preview-corner-bl" /><div className="preview-corner preview-corner-br" />
  </div>;
}

function GenerationCard({ item, onOpen, onDelete, onDownload, onRegenerate }: { item: GenerationRecord; onOpen: () => void; onDelete: () => void; onDownload: () => void; onRegenerate: () => void }) {
  return <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="history-card">
    <button className="history-image-button" onClick={onOpen}><img src={item.image} alt={item.prompt} loading="lazy" /><span className="history-open"><ArrowUpRight size={17} /></span></button>
    <div className="history-card-body"><div className="history-card-top"><span className="model-chip">{getModel(item.model).name.replace('FLUX.', 'FLUX')}</span><span className="history-date">{formatTimeAgo(item.createdAt)}</span></div><p>{item.prompt}</p><div className="history-meta"><span>{item.resolution}</span><span className="dot" /><span>NVIDIA</span><span className="history-actions"><IconButton label="Download" onClick={onDownload}><Download size={14} /></IconButton><IconButton label="Regenerate" onClick={onRegenerate}><RefreshCw size={14} /></IconButton><IconButton label="Delete" onClick={onDelete}><Trash2 size={14} /></IconButton></span></div></div>
  </motion.article>;
}

function AuthModal({ auth, setAuth, onClose, onSuccess }: { auth: AuthState; setAuth: (value: AuthState) => void; onClose: () => void; onSuccess: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    const result = auth.mode === 'sign-in' ? await supabase.auth.signInWithPassword({ email: auth.email, password: auth.password }) : await supabase.auth.signUp({ email: auth.email, password: auth.password });
    if (result.error) setError(result.error.message.includes('placeholder') ? 'Supabase is not configured for this deployment yet.' : result.error.message);
    else { toast.success(auth.mode === 'sign-in' ? 'Welcome back' : 'Account created'); onSuccess(); onClose(); }
    setBusy(false);
  };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.div initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="auth-modal"><button className="modal-close" onClick={onClose}><X size={18} /></button><div className="modal-kicker"><ShieldCheck size={15} /> SECURE WORKSPACE ACCESS</div><h2>{auth.mode === 'sign-in' ? 'Sign in to ForgeAI' : 'Create your ForgeAI account'}</h2><p className="muted">Your generation history and provider settings stay private to your account.</p><form onSubmit={submit} className="auth-form"><label>Email<input type="email" autoFocus required value={auth.email} onChange={(event) => setAuth({ ...auth, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input type="password" minLength={6} required value={auth.password} onChange={(event) => setAuth({ ...auth, password: event.target.value })} placeholder="At least 6 characters" /></label>{error && <div className="error-box">{error}</div>}<button className="primary-button full-width" disabled={busy}>{busy ? <><LoaderCircle size={17} className="spin" /> Working…</> : auth.mode === 'sign-in' ? 'Sign in' : 'Create account'}</button></form><button className="text-button" onClick={() => setAuth({ ...auth, mode: auth.mode === 'sign-in' ? 'sign-up' : 'sign-in' })}>{auth.mode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}</button></motion.div></div>;
}

export default function App() {
  const [view, setView] = useState<View>('generate');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [enhance, setEnhance] = useState(false);
  const [reference, setReference] = useState<string | undefined>();
  const [settings, setSettings] = useState(initialSettings);
  const [queueState, setQueueState] = useState<QueueState>('idle');
  const [result, setResult] = useState<GenerationRecord | null>(null);
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [selectedModel, setSelectedModel] = useState('all');
  const [modelFilter, setModelFilter] = useState<'All' | 'Image' | 'Text' | 'Vision' | 'Video'>('All');
  const [search, setSearch] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ email: '', password: '', mode: 'sign-in' });
  const [session, setSession] = useState<unknown>(null);
  const [apiKey, setApiKey] = useState('');
  const [keyStatus, setKeyStatus] = useState<'unknown' | 'connected' | 'missing' | 'saving' | 'testing'>('unknown');
  const [keyMessage, setKeyMessage] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<GenerationRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const model = getModel(settings.model);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); setPromptHistory(JSON.parse(localStorage.getItem(PROMPT_KEY) || '[]')); } catch { setHistory([]); }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); if (prompt.trim() && queueState === 'idle') void generate(); } if (event.key === 'Escape') setSelectedRecord(null); };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  });

  useEffect(() => {
    const loadKeyStatus = async () => { try { const response = await fetch(`/api/providers/nvidia/credentials?sessionId=${getSessionId()}`); const data = await response.json(); setKeyStatus(data.connected ? 'connected' : 'missing'); } catch { setKeyStatus('missing'); } };
    if (view === 'keys' || view === 'generate') void loadKeyStatus();
  }, [view]);

  const updateSettings = (next: Partial<GenerationSettings>) => setSettings((current) => ({ ...current, ...next }));
  const openView = (next: View) => { setView(next); setMobileNavOpen(false); };
  const addPromptToHistory = (value: string) => { const next = [value, ...promptHistory.filter((item) => item !== value)].slice(0, 12); setPromptHistory(next); localStorage.setItem(PROMPT_KEY, JSON.stringify(next)); };

  const handleFile = (file?: File) => { if (!file) return; if (!file.type.startsWith('image/')) { toast.error('Choose an image file'); return; } const reader = new FileReader(); reader.onload = () => setReference(String(reader.result)); reader.readAsDataURL(file); };

  const saveRecord = (record: GenerationRecord) => { const next = [record, ...history].slice(0, 24); setHistory(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const downloadRecord = (record: GenerationRecord) => { const link = document.createElement('a'); link.href = record.image; link.download = `forgeai-${record.id}.jpg`; link.click(); };

  async function generate() {
    if (!session) { setShowAuth(true); toast.error('Sign in to generate', { description: 'Your generation history belongs to your private account.' }); return; }
    if (!prompt.trim()) { toast.error('Describe what you want to create first.'); return; }
    setQueueState('preparing'); setResult(null);
    let promptToSend = prompt.trim();
    if (enhance) promptToSend = `${promptToSend}, editorial art direction, clear focal subject, considered lighting, high detail`;
    const started = Date.now();
    try {
      await new Promise((resolve) => setTimeout(resolve, 260)); setQueueState('sending');
      const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: getSessionId(), prompt: promptToSend, settings, referenceImage: reference }) });
      setQueueState('generating'); const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to reach the generation service.');
      setQueueState('processing');
      const record: GenerationRecord = { id: crypto.randomUUID().slice(0, 8), image: `data:image/jpeg;base64,${data.image}`, prompt: prompt.trim(), provider: 'nvidia', model: settings.model, resolution: settings.resolution, ratio: settings.ratio, seed: data.seed ?? settings.seed, createdAt: new Date().toISOString(), durationMs: Date.now() - started };
      saveRecord(record); addPromptToHistory(prompt.trim()); setResult(record); setQueueState('completed'); toast.success('Image generated', { description: `${getModel(settings.model).name} · ${record.resolution}` });
    } catch (error) { setQueueState('failed'); toast.error(error instanceof Error ? error.message : 'Unable to reach the generation service.'); }
  }

  async function saveKey() {
    setKeyStatus('saving'); setKeyMessage('');
    try { const response = await fetch('/api/providers/nvidia/credentials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: getSessionId(), apiKey }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setKeyStatus('connected'); setApiKey(''); setKeyMessage(data.message); toast.success('NVIDIA key saved securely'); } catch (error) { setKeyStatus('missing'); setKeyMessage(error instanceof Error ? error.message : 'Could not save this key.'); }
  }
  async function testKey() { setKeyStatus('testing'); setKeyMessage('Sending a minimal verification request to NVIDIA…'); try { const response = await fetch('/api/providers/nvidia/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: getSessionId(), apiKey: apiKey || undefined }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setKeyStatus('connected'); setKeyMessage(data.message); toast.success('Connection verified'); } catch (error) { setKeyStatus('missing'); setKeyMessage(error instanceof Error ? error.message : 'Connection test failed.'); } }
  async function removeKey() { await fetch(`/api/providers/nvidia/credentials?sessionId=${getSessionId()}`, { method: 'DELETE' }); setKeyStatus('missing'); setKeyMessage('The stored key was removed from this workspace.'); toast.success('NVIDIA key removed'); }

  const filteredHistory = history.filter((item) => !search || item.prompt.toLowerCase().includes(search.toLowerCase()) || getModel(item.model).name.toLowerCase().includes(search.toLowerCase()));
  const filteredModels = MODEL_REGISTRY.filter((item) => (selectedModel === 'all' || item.provider === selectedModel) && (modelFilter === 'All' || item.category === modelFilter || item.capabilities.includes(modelFilter.toLowerCase() as never)));
  const isGenerating = queueState !== 'idle' && queueState !== 'completed' && queueState !== 'failed';
  const queueLabel: Record<QueueState, string> = { idle: 'Ready to generate', preparing: 'Preparing', sending: 'Sending request', generating: 'Generating', processing: 'Processing', completed: 'Completed', failed: 'Generation failed' };

  const renderLanding = () => <div className="landing-page"><div className="landing-copy"><div className="eyebrow-row"><span className="eyebrow">FORGEAI / PERSONAL STUDIO</span><span className="eyebrow-line" /></div><h1>Your AI generation <em>workspace.</em></h1><p>Bring your own API keys. Choose your model. Generate without being locked into a single AI platform.</p><div className="landing-actions"><button className="primary-button" onClick={() => openView('generate')}><Sparkles size={16} /> Open workspace</button><button className="outline-button" onClick={() => openView('keys')}><KeyRound size={15} /> Configure API keys</button></div><div className="landing-note"><ShieldCheck size={15} /><span>Server-side provider requests · verified NVIDIA NIM adapters</span></div></div><div className="landing-visual"><div className="landing-visual-top"><span>VISUAL WORKSPACE PREVIEW</span><span className="preview-live"><i /> READY</span></div><div className="landing-frame"><div className="landing-rings" /><div className="landing-frame-center"><div className="preview-mark"><Sparkles size={20} /></div><strong>Make something worth seeing.</strong><span>Prompt in. Your frame out.</span></div><span className="landing-axis axis-x">X / OUTPUT</span><span className="landing-axis axis-y">Y / INPUT</span></div><div className="landing-visual-foot"><span><Layers3 size={14} /> 03 verified models</span><span><Zap size={14} /> 01 provider live</span></div></div></div>;

  const renderGenerate = () => <div className="workspace-grid">
    <section className="composer-column">
      <div className="eyebrow-row"><span className="eyebrow">CREATE</span><span className="eyebrow-line" /><span className="muted micro">NVIDIA NIM · IMAGE GENERATION</span></div>
      <div className="page-heading"><h1>Make something <em>worth seeing.</em></h1><p>Bring your own API key. Choose a model. Keep the creative loop yours.</p></div>
      <div className="composer-card panel">
        <div className="composer-top"><div className="input-label"><WandSparkles size={15} /> PROMPT</div><span className="counter">{prompt.length.toLocaleString()} / 10,000</span></div>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={starterPrompt} maxLength={10000} />
        <div className="composer-bottom"><div className="composer-tools"><button className={cx('subtle-button', enhance && 'subtle-button-active')} onClick={() => setEnhance(!enhance)}><Sparkles size={14} /> Enhance prompt <span className={cx('toggle', enhance && 'toggle-on')}><span /></span></button><button className={cx('subtle-button', reference && 'subtle-button-active')} onClick={() => fileInputRef.current?.click()}><ImagePlus size={14} /> Reference {reference && <Check size={13} />}</button><input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} /></div><button className="clear-button" onClick={() => { setPrompt(''); setReference(undefined); }}>Clear</button></div>
        {reference && <div className="reference-preview"><img src={reference} alt="Reference preview" /><span>Reference image attached</span><button onClick={() => setReference(undefined)}><X size={14} /></button></div>}
      </div>
      <div className="generation-controls panel">
        <div className="control-header"><div><span className="input-label"><SlidersIcon /> GENERATION CONTROLS</span><p>Options adapt to the selected model.</p></div><div className="connected-pill"><span /> {keyStatus === 'connected' ? 'NVIDIA connected' : 'API key required'}</div></div>
        <div className="control-grid"><SelectField label="Provider" value="NVIDIA NIM" options={['NVIDIA NIM']} onChange={() => {}} /><SelectField label="Model" value={model.name} options={MODEL_REGISTRY.filter((item) => item.category === 'Image').map((item) => item.name)} onChange={(value) => { const selected = MODEL_REGISTRY.find((item) => item.name === value); if (selected) updateSettings({ model: selected.id, steps: selected.steps.default, cfgScale: selected.cfgScale?.default }); }} /><SelectField label="Aspect ratio" value={settings.ratio} options={model.ratios} onChange={(value) => updateSettings({ ratio: value })} /><SelectField label="Resolution" value={settings.resolution} options={model.resolutions} onChange={(value) => updateSettings({ resolution: value })} /><SelectField label="Images" value={String(settings.images)} options={['1']} onChange={(value) => updateSettings({ images: Number(value) })} /><label className="control-field"><span>Seed</span><div className="seed-field"><input type="number" min="0" max="4294967295" value={settings.seed} onChange={(event) => updateSettings({ seed: Number(event.target.value) })} /><button onClick={() => updateSettings({ seed: 0 })}>Random</button></div></label></div>
        <button className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}><span><Settings2 size={14} /> Advanced settings</span><ChevronDown size={14} className={cx('chevron', showAdvanced && 'chevron-open')} /></button>
        <AnimatePresence>{showAdvanced && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="advanced-content"><label className="range-field"><span>Steps <b>{settings.steps}</b></span><input type="range" min={model.steps.min} max={model.steps.max} value={settings.steps} onChange={(event) => updateSettings({ steps: Number(event.target.value) })} /></label>{model.cfgScale && model.cfgScale.max > 0 && <label className="range-field"><span>Guidance <b>{settings.cfgScale}</b></span><input type="range" min={model.cfgScale.min} max={model.cfgScale.max} step="0.5" value={settings.cfgScale} onChange={(event) => updateSettings({ cfgScale: Number(event.target.value) })} /></label>}<p className="technical-note">Model-aware parameters are sent only when supported by NVIDIA’s verified API schema.</p></motion.div>}</AnimatePresence>
      </div>
      <div className="composer-footer"><span className="keyboard-note"><kbd>⌘</kbd><kbd>↵</kbd> Generate</span><button className="primary-button generate-button" onClick={() => void generate()} disabled={isGenerating}>{isGenerating ? <><LoaderCircle size={17} className="spin" /> {queueLabel[queueState]}…</> : <><Zap size={17} /> Generate image</>}</button></div>
      {(queueState !== 'idle' || result) && <div className="queue-status"><div className={cx('queue-dot', queueState === 'failed' && 'queue-dot-error', queueState === 'completed' && 'queue-dot-success')} /><div><strong>{queueLabel[queueState]}</strong><span>{queueState === 'failed' ? 'Check your NVIDIA key and model settings, then try again.' : queueState === 'completed' ? 'Saved to your generation history.' : 'Live status · progress is indeterminate while NVIDIA processes the request.'}</span></div>{queueState === 'failed' && <button className="text-button" onClick={() => setQueueState('idle')}>Dismiss</button>}</div>}
    </section>
    <section className="result-column"><div className="result-heading"><div><span className="eyebrow">OUTPUT</span><h2>{result ? 'Freshly forged.' : 'Visual canvas'}</h2></div>{result && <div className="result-actions"><IconButton label="Download" onClick={() => downloadRecord(result)}><Download size={16} /></IconButton><IconButton label="Use prompt" onClick={() => setPrompt(result.prompt)}><Pencil size={16} /></IconButton></div>}</div>{result ? <motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} className="result-card"><button className="result-image-button" onClick={() => setSelectedRecord(result)}><img src={result.image} alt={result.prompt} /></button><div className="result-meta"><div><span className="muted micro">{getModel(result.model).name} · NVIDIA NIM</span><p>{result.prompt}</p></div><span className="result-time">{(result.durationMs / 1000).toFixed(1)}s</span></div></motion.div> : <EmptyPreview />}<div className="result-footnote"><span><ShieldCheck size={14} /> Keys never leave the server.</span><span><Clock3 size={14} /> History is saved locally for this workspace.</span></div></section>
  </div>;

  const renderHistory = () => <div className="page-section"><div className="section-heading"><div><span className="eyebrow">ARCHIVE</span><h1>Generation history.</h1><p>Every frame you make, in one private timeline.</p></div><div className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search prompts or models" /></div></div>{filteredHistory.length ? <div className="history-grid">{filteredHistory.map((item) => <GenerationCard key={item.id} item={item} onOpen={() => setSelectedRecord(item)} onDelete={() => { const next = history.filter((record) => record.id !== item.id); setHistory(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); toast.success('Removed from history'); }} onDownload={() => downloadRecord(item)} onRegenerate={() => { setPrompt(item.prompt); updateSettings({ model: item.model, ratio: item.ratio, resolution: item.resolution, seed: item.seed }); openView('generate'); }} />)}</div> : <div className="empty-state"><div className="empty-icon"><Images size={21} /></div><h3>{search ? 'No matching generations' : 'Your archive is empty'}</h3><p>{search ? 'Try another prompt or model name.' : 'Once you generate an image, it will appear here with its settings and source prompt.'}</p>{!search && <button className="primary-button" onClick={() => openView('generate')}><Plus size={16} /> Start creating</button>}</div>}</div>;

  const renderModels = () => <div className="page-section"><div className="section-heading"><div><span className="eyebrow">MODEL REGISTRY</span><h1>Choose your engine.</h1><p>Verified provider adapters, with capabilities kept in one place.</p></div><a className="docs-link" href="https://docs.api.nvidia.com/nim" target="_blank" rel="noreferrer">NVIDIA docs <ArrowUpRight size={14} /></a></div><div className="filter-row"><div className="filter-tabs">{(['All', 'Image', 'Text', 'Vision', 'Video'] as const).map((filter) => <button key={filter} className={cx(modelFilter === filter && 'filter-active')} onClick={() => setModelFilter(filter)}>{filter}</button>)}</div><div className="provider-filter"><span>Provider</span>{['all', 'nvidia'].map((provider) => <button key={provider} className={cx(selectedModel === provider && 'provider-active')} onClick={() => setSelectedModel(provider)}>{provider === 'all' ? 'All' : 'NVIDIA'}</button>)}</div></div><div className="models-grid">{filteredModels.map((item) => <motion.article layout key={item.id} className="model-card"><div className="model-card-top"><div className="model-symbol">{item.name.startsWith('FLUX.2') ? '02' : item.name.includes('Kontext') ? 'K' : '01'}</div><span className="available-dot"><span /> Available</span></div><div className="model-card-copy"><span className="muted micro">{item.eyebrow}</span><h3>{item.name}</h3><p>{item.description}</p></div><div className="capability-row">{item.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div><div className="model-card-footer"><span className="muted micro">{item.category} · {item.steps.min}–{item.steps.max} steps</span><button className="outline-button" onClick={() => { updateSettings({ model: item.id, steps: item.steps.default, cfgScale: item.cfgScale?.default, ratio: item.ratios[0], resolution: item.resolutions[0] }); openView('generate'); }}>Use model <ArrowUpRight size={14} /></button></div></motion.article>)}</div></div>;

  const renderKeys = () => <div className="page-section narrow-section"><div className="section-heading"><div><span className="eyebrow">CONNECTIONS</span><h1>Bring your own keys.</h1><p>Encrypted server-side storage for provider credentials. ForgeAI never puts a saved key in the browser bundle.</p></div></div><div className="key-card panel"><div className="key-card-header"><div className="provider-logo">N</div><div><h2>NVIDIA NIM</h2><p>Image generation and editing</p></div><span className={cx('status-pill', keyStatus === 'connected' && 'status-connected')}>{keyStatus === 'connected' ? <><span /> Connected</> : <><span /> Not connected</>}</span></div><div className="key-divider" /><div className="key-input-label">API key <span>Stored only on the server</span></div><div className="secret-input"><KeyRound size={16} /><input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={keyStatus === 'connected' ? '••••••••••••••••••••••••' : 'nvapi-…'} /><button onClick={() => setShowKey(!showKey)}>{showKey ? 'Hide' : 'Show'}</button></div><div className="key-actions"><button className="primary-button" onClick={() => void saveKey()} disabled={!apiKey.trim() || keyStatus === 'saving'}>{keyStatus === 'saving' ? <><LoaderCircle size={16} className="spin" /> Saving…</> : <><ShieldCheck size={16} /> Save key</>}</button><button className="outline-button" onClick={() => void testKey()} disabled={keyStatus === 'testing'}><FlaskConical size={15} /> {keyStatus === 'testing' ? 'Testing…' : 'Test connection'}</button>{keyStatus === 'connected' && <button className="danger-button" onClick={() => void removeKey()}><Trash2 size={15} /> Remove</button>}</div>{keyMessage && <div className={cx('key-message', keyStatus === 'missing' && 'key-message-error')}>{keyStatus === 'connected' ? <CheckCircle2 size={15} /> : <CircleHelp size={15} />}{keyMessage}</div>}<p className="security-note"><ShieldCheck size={14} /> Your key is used by server-side provider requests only. It is never returned in full after saving.</p></div><div className="coming-card"><div className="coming-icon"><Plus size={18} /></div><div><strong>Add another provider later</strong><p>OpenAI, Google, Replicate, and OpenRouter can plug into the same adapter contract.</p></div><span>Planned</span></div></div>;

  const renderSettings = () => <div className="page-section narrow-section"><div className="section-heading"><div><span className="eyebrow">PREFERENCES</span><h1>Make it yours.</h1><p>Small defaults that keep your creative loop moving.</p></div></div><div className="settings-stack"><div className="settings-card panel"><div className="settings-row"><div><strong>Appearance</strong><p>ForgeAI uses a dark-first canvas for image work.</p></div><div className="segmented"><button className="segment-active"><Moon size={14} /> Dark</button><button disabled><Monitor size={14} /> System</button></div></div><div className="settings-row"><div><strong>Default provider</strong><p>Used whenever you open the composer.</p></div><span className="setting-value"><span className="provider-mini">N</span>NVIDIA NIM</span></div><div className="settings-row"><div><strong>Default model</strong><p>Change this from the model registry or composer.</p></div><span className="setting-value">{getModel(settings.model).name}</span></div><div className="settings-row"><div><strong>Default canvas</strong><p>Initial aspect ratio and resolution.</p></div><span className="setting-value">{settings.ratio} · {settings.resolution}</span></div></div><div className="usage-card panel"><div className="usage-icon"><Zap size={18} /></div><div><span className="eyebrow">USAGE & LIMITS</span><h2>Your provider sets the terms.</h2><p>Pricing, rate limits, availability, and any usage quotas are determined by NVIDIA and your account. ForgeAI does not claim unlimited or permanently free generation.</p><a href="https://build.nvidia.com/" target="_blank" rel="noreferrer">Review NVIDIA account limits <ArrowUpRight size={14} /></a></div></div><div className="settings-card panel"><div className="settings-row"><div><strong>Account</strong><p>{session ? 'Signed in with Supabase authentication.' : 'Connect Supabase to enable account-scoped history and settings.'}</p></div><span className={cx('account-status', session && 'account-status-on')}><span />{session ? 'Authenticated' : 'Not connected'}</span></div></div></div></div>;

  return <div className="app-shell"><Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#171817', border: '1px solid #33352f', color: '#f4f2eb' } }} />
    <aside className={cx('sidebar', mobileNavOpen && 'sidebar-open')}><div className="sidebar-top"><AppLogo onClick={() => openView('landing')} /><button className="mobile-close" onClick={() => setMobileNavOpen(false)}><X size={18} /></button></div><div className="workspace-switcher"><div className="workspace-avatar">A</div><div><strong>Personal workspace</strong><span>Private · local history</span></div><ChevronDown size={15} /></div><nav className="main-nav"><span className="nav-section-label">WORKSPACE</span><NavItem icon={<Sparkles size={17} />} label="Generate" active={view === 'generate'} onClick={() => openView('generate')} /><NavItem icon={<Images size={17} />} label="History" active={view === 'history'} onClick={() => openView('history')} badge={history.length ? String(history.length) : undefined} /><NavItem icon={<Layers3 size={17} />} label="Models" active={view === 'models'} onClick={() => openView('models')} /><span className="nav-section-label nav-section-lower">CONFIGURE</span><NavItem icon={<KeyRound size={17} />} label="API keys" active={view === 'keys'} onClick={() => openView('keys')} badge={keyStatus === 'connected' ? '1' : undefined} /><NavItem icon={<Settings2 size={17} />} label="Settings" active={view === 'settings'} onClick={() => openView('settings')} /></nav><div className="sidebar-bottom"><div className="status-card"><div className="status-card-top"><span className="status-led" /> SYSTEM READY</div><p>Provider requests stay server-side.</p><button onClick={() => openView('keys')}>{keyStatus === 'connected' ? 'Manage connection' : 'Connect NVIDIA'} <ArrowUpRight size={13} /></button></div><div className="sidebar-user"><div className="user-avatar"><UserRound size={15} /></div><div><strong>{session ? 'Authenticated user' : 'Local workspace'}</strong><span>{session ? 'Supabase account' : 'Preview until sign-in'}</span></div><MoreHorizontal size={16} /></div></div></aside>
    <main className="main-content"><header className="topbar"><button className="mobile-menu" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button><div className="topbar-context"><span className="context-dot" /> {view === 'landing' ? 'ForgeAI overview' : view === 'generate' ? 'Image generation' : view[0].toUpperCase() + view.slice(1)}</div><div className="topbar-actions"><span className="build-label">FORGEAI / 0.1</span><button className="help-button"><CircleHelp size={16} /> <span>Help</span></button>{session ? <button className="avatar-button"><UserRound size={15} /></button> : <button className="sign-in-button" onClick={() => setShowAuth(true)}>Sign in</button>}</div></header><div className="page-content"><AnimatePresence mode="wait"><motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>{view === 'landing' && renderLanding()}{view === 'generate' && renderGenerate()}{view === 'history' && renderHistory()}{view === 'models' && renderModels()}{view === 'keys' && renderKeys()}{view === 'settings' && renderSettings()}</motion.div></AnimatePresence></div></main>
    {showAuth && <AuthModal auth={auth} setAuth={setAuth} onClose={() => setShowAuth(false)} onSuccess={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />}
    {selectedRecord && <div className="viewer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedRecord(null)}><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="viewer"><button className="modal-close" onClick={() => setSelectedRecord(null)}><X size={18} /></button><div className="viewer-image"><img src={selectedRecord.image} alt={selectedRecord.prompt} /></div><div className="viewer-info"><span className="eyebrow">GENERATION DETAIL</span><h2>{getModel(selectedRecord.model).name}</h2><p className="viewer-prompt">{selectedRecord.prompt}</p><div className="viewer-details"><span><b>Provider</b>NVIDIA NIM</span><span><b>Resolution</b>{selectedRecord.resolution}</span><span><b>Seed</b>{selectedRecord.seed || 'Random'}</span><span><b>Created</b>{new Date(selectedRecord.createdAt).toLocaleString()}</span></div><div className="viewer-actions"><button className="primary-button" onClick={() => { setPrompt(selectedRecord.prompt); setSelectedRecord(null); openView('generate'); }}><Pencil size={15} /> Use this prompt</button><button className="outline-button" onClick={() => downloadRecord(selectedRecord)}><Download size={15} /> Download</button></div></div></motion.div></div>}
  </div>;
}

function SlidersIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" /><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" /></svg>; }
