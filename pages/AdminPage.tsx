
import React, { useState, useRef } from 'react';
import { LandingPageData, Review, ProcessStep } from '../types';
import { LandingPage } from './LandingPage';

interface Props {
  data: LandingPageData;
  onUpdate: (data: LandingPageData) => void;
  onReset: () => void;
}

type Tab = 'hero' | 'content' | 'process' | 'reviews' | 'contact' | 'style';

export const AdminPage: React.FC<Props> = ({ data, onUpdate, onReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('style');

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });

  const resizeImageDataUrl = (dataUrl: string, maxSize = 1600, quality = 0.85) =>
    new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const targetW = Math.max(1, Math.round(img.width * scale));
        const targetH = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas não suportado'));

        // Preenche fundo branco (evita transparência ficar preta ao exportar JPEG)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);

        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('Imagem inválida'));
      img.src = dataUrl;
    });

  const dataUrlToBlob = async (dataUrl: string) => {
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  const handleChange = (path: string, value: any) => {
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdate(newData);
  };

  const handleImageUpload = async (path: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Permite escolher o mesmo arquivo novamente
    e.target.value = '';
    if (!file) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Você precisa estar logado para enviar imagens.');
        return;
      }

      const raw = await fileToDataUrl(file);
      const finalDataUrl = file.type === 'image/svg+xml' ? raw : await resizeImageDataUrl(raw);
      const blob = await dataUrlToBlob(finalDataUrl);

      const form = new FormData();
      const filename = file.type === 'image/svg+xml' ? (file.name || 'image.svg') : 'image.jpg';
      form.append('file', blob, filename);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        alert('Falha ao enviar imagem.');
        return;
      }

      const payload = (await res.json()) as { url: string };
      handleChange(path, payload.url);
    } catch {
      alert('Não foi possível carregar essa imagem. Tente outra (ou reduza o tamanho).');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-100 font-sans">
      {/* Editor Sidebar */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto p-6 bg-white border-r border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase">Painel de Edição</h1>
          <button onClick={onReset} className="text-[10px] bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 font-bold uppercase transition-all">Resetar Tudo</button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {(['style', 'hero', 'content', 'process', 'reviews', 'contact'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap border-2 ${
                activeTab === tab ? 'bg-gray-800 text-white border-gray-800 shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
              }`}
            >
              {tab === 'style' ? '🎨 Cores/Imagens' : tab === 'hero' ? '🏠 Início' : tab === 'content' ? '📝 Textos' : tab === 'process' ? '⚙️ Processo' : tab === 'reviews' ? '💬 Feedback' : '📞 Contato'}
            </button>
          ))}
        </div>

        <div className="space-y-8 pb-32">
          {activeTab === 'style' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker label="Cor Bronze (Botões)" value={data.theme.primaryColor} onChange={(v) => handleChange('theme.primaryColor', v)} />
                <ColorPicker label="Cor Grafite (Fundo Escuro)" value={data.theme.secondaryColor} onChange={(v) => handleChange('theme.secondaryColor', v)} />
                <ColorPicker label="Fundo Seção Clara" value={data.theme.bgColor} onChange={(v) => handleChange('theme.bgColor', v)} />
                <ColorPicker label="Fundo Seção Alternada" value={data.theme.accentBgColor} onChange={(v) => handleChange('theme.accentBgColor', v)} />
                <ColorPicker label="Texto Principal" value={data.theme.textDark} onChange={(v) => handleChange('theme.textDark', v)} />
                <ColorPicker label="Texto sobre Escuro" value={data.theme.textLight} onChange={(v) => handleChange('theme.textLight', v)} />
                <ColorPicker label="Escurecer Hero (Overlay)" value={data.theme.heroOverlayColor} onChange={(v) => handleChange('theme.heroOverlayColor', v)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <ImageUpload label="Fundo Hero" value={data.theme.heroBgImage} onChange={(e) => handleImageUpload('theme.heroBgImage', e)} />
                <ImageUpload label="Imagem Puzzle" value={data.theme.puzzleImage} onChange={(e) => handleImageUpload('theme.puzzleImage', e)} />
                <ImageUpload label="Imagem Lei" value={data.theme.lawImage} onChange={(e) => handleImageUpload('theme.lawImage', e)} />
                <ImageUpload label="Imagem Medicamentos" value={data.theme.pillsImage} onChange={(e) => handleImageUpload('theme.pillsImage', e)} />
                <div className="space-y-2">
                  <ImageUpload label="Imagem Advogada" value={data.theme.lawyerImage} onChange={(e) => handleImageUpload('theme.lawyerImage', e)} />
                  <button
                    type="button"
                    onClick={() => handleChange('theme.lawyerImage', '')}
                    className="w-full text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Sem foto
                  </button>
                </div>
                <ImageUpload label="Imagem Aperto Mão" value={data.theme.handshakeImage} onChange={(e) => handleImageUpload('theme.handshakeImage', e)} />
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <Field label="Título Principal" value={data.hero.title} onChange={(v) => handleChange('hero.title', v)} />
              <Field label="Subtítulo Colorido" value={data.hero.subtitle} onChange={(v) => handleChange('hero.subtitle', v)} />
              <Field label="Descrição" value={data.hero.description} textarea onChange={(v) => handleChange('hero.description', v)} />
              <Field label="WhatsApp (55...)" value={data.hero.whatsappNumber} onChange={(v) => handleChange('hero.whatsappNumber', v)} />
              <Field label="Texto do Botão" value={data.hero.ctaText} onChange={(v) => handleChange('hero.ctaText', v)} />
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seção Desafio</p>
                  <Field label="Título" value={data.challenges.title} onChange={(v) => handleChange('challenges.title', v)} />
                  <Field label="Texto" value={data.challenges.description} textarea onChange={(v) => handleChange('challenges.description', v)} />
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Janela de Oportunidade</p>
                  <Field label="Título" value={data.challenges.urgencyTitle} onChange={(v) => handleChange('challenges.urgencyTitle', v)} />
                  <Field label="Texto" value={data.challenges.urgencyText} textarea onChange={(v) => handleChange('challenges.urgencyText', v)} />
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">O Que Diz a Lei</p>
                  <Field label="Título Lei" value={data.legal.title} onChange={(v) => handleChange('legal.title', v)} />
                  <Field label="Descrição Lei" value={data.legal.description} textarea onChange={(v) => handleChange('legal.description', v)} />
                  <Field label="Título Recusa" value={data.legal.recusalTitle} onChange={(v) => handleChange('legal.recusalTitle', v)} />
                  <Field label="Texto Recusa" value={data.legal.recusalText} textarea onChange={(v) => handleChange('legal.recusalText', v)} />
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institucional (Sobre)</p>
                  <Field label="Nome Advogada" value={data.about.lawyerName} onChange={(v) => handleChange('about.lawyerName', v)} />
                  <Field label="OAB" value={data.about.lawyerOab} onChange={(v) => handleChange('about.lawyerOab', v)} />
                  <Field label="Texto Quem Somos" value={data.about.description} textarea onChange={(v) => handleChange('about.description', v)} />
               </div>
            </div>
          )}

          {activeTab === 'process' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {data.process.map((step, idx) => (
                   <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                      <p className="text-[10px] font-black uppercase opacity-40">Passo {idx + 1}</p>
                      <Field label="Título" value={step.title} onChange={(v) => {
                         const p = [...data.process]; p[idx].title = v; handleChange('process', p);
                      }} />
                      <Field label="Descrição" value={step.description} textarea onChange={(v) => {
                         const p = [...data.process]; p[idx].description = v; handleChange('process', p);
                      }} />
                   </div>
                ))}
             </div>
          )}

          {activeTab === 'reviews' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {data.reviews.map((review, idx) => (
                   <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                      <Field label="Nome do Cliente" value={review.author} onChange={(v) => {
                         const r = [...data.reviews]; r[idx].author = v; handleChange('reviews', r);
                      }} />
                      <Field label="Depoimento" value={review.text} textarea onChange={(v) => {
                         const r = [...data.reviews]; r[idx].text = v; handleChange('reviews', r);
                      }} />
                   </div>
                ))}
             </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <Field label="E-mail" value={data.contact.email} onChange={(v) => handleChange('contact.email', v)} />
              <Field label="Telefone" value={data.contact.phone} onChange={(v) => handleChange('contact.phone', v)} />
              <Field label="Instagram" value={data.contact.instagram} onChange={(v) => handleChange('contact.instagram', v)} />
              <Field label="Horário de Atendimento" value={data.contact.hours} onChange={(v) => handleChange('contact.hours', v)} />
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Sidebar */}
      <div className="hidden lg:block lg:w-1/2 h-full bg-gray-200 relative overflow-hidden">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl">Visualização ao Vivo</div>
        <div className="w-full h-full overflow-y-auto origin-top scale-[0.8] xl:scale-[0.85] bg-white shadow-2xl">
          <LandingPage data={data} />
        </div>
      </div>
    </div>
  );
};

const ColorPicker = ({ label, value, onChange }: any) => (
  <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{label}</label>
    <div className="flex items-center gap-3">
      <input type="color" value={value.length === 9 ? value.substring(0, 7) : value} onChange={(e) => {
          // Mantém a transparência se for o overlay, senão apenas a cor
          if (label.includes("Overlay")) {
            onChange(e.target.value + "CC"); // Adiciona transparência fixa CC (80%)
          } else {
            onChange(e.target.value);
          }
      }} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
      <span className="text-xs font-mono text-gray-500 uppercase">{value}</span>
    </div>
  </div>
);

const ImageUpload = ({ label, value, onChange }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">{label}</label>
      <div onClick={() => fileRef.current?.click()} className="relative group cursor-pointer aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-gray-800 transition-all flex items-center justify-center">
        {value ? <img src={value} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-2xl">📸</span>}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Alterar</span>
        </div>
        <input type="file" ref={fileRef} onChange={onChange} accept="image/*" className="hidden" />
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, textarea }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:ring-2 focus:ring-gray-800 min-h-[80px] transition-all shadow-sm" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:ring-2 focus:ring-gray-800 transition-all shadow-sm" />
    )}
  </div>
);
