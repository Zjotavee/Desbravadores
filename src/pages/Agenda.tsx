import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Sparkles, X, Plus, Save, Trash2 } from 'lucide-react';
import { Meeting, MeetingTemplate } from '@/types';
import { generateJSON } from '@/services/gemini';
import { v4 as uuidv4 } from 'uuid';
import { supabaseService } from '@/services/supabaseService';

export const Agenda = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [customTemplates, setCustomTemplates] = useState<MeetingTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [meetingsData, templatesData] = await Promise.all([
          supabaseService.getMeetings(),
          supabaseService.getTemplates()
        ]);
        setMeetings(meetingsData || []);
        setCustomTemplates(templatesData || []);
      } catch (error) {
        console.error('Failed to load data from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Meeting>>({
    title: '',
    date: '',
    time: '',
    theme: '',
    ageGroup: '10-15',
  });

  const templates = [
    { name: 'Padrão', theme: 'Geral', title: 'Reunião Regular' },
    { name: 'Espiritual', theme: 'Vida Cristã', title: 'Encontro com Deus' },
    { name: 'Recreativa', theme: 'Jogos e Brincadeiras', title: 'Domingo Divertido' },
    { name: 'Ao Ar Livre', theme: 'Natureza', title: 'Exploração na Mata' },
  ];

  const loadTemplate = (t: typeof templates[0]) => {
    setFormData(prev => ({
      ...prev,
      theme: t.theme,
      title: t.title
    }));
  };

  const loadCustomTemplate = (t: MeetingTemplate) => {
    setFormData({
      title: t.title,
      theme: t.theme,
      ageGroup: t.ageGroup,
      location: t.location,
      materials: t.materials,
      notes: t.notes,
      program: t.program,
      date: '', // Reset date/time for new meeting
      time: ''
    });
  };

  const handleSaveTemplate = async (meeting: Meeting) => {
    const templateName = prompt("Nome do modelo:", meeting.title);
    if (!templateName) return;

    const newTemplate: MeetingTemplate = {
      id: uuidv4(),
      name: templateName,
      title: meeting.title,
      location: meeting.location,
      ageGroup: meeting.ageGroup,
      theme: meeting.theme,
      activities: meeting.activities,
      materials: meeting.materials,
      notes: meeting.notes,
      program: meeting.program
    };

    // Optimistic update
    setCustomTemplates(prev => [...prev, newTemplate]);
    
    try {
      await supabaseService.saveTemplate(newTemplate);
      alert("Modelo salvo com sucesso!");
    } catch (error) {
      console.error('Failed to save template to Supabase:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este modelo?")) {
      // Optimistic update
      setCustomTemplates(prev => prev.filter(t => t.id !== id));
      
      try {
        await supabaseService.deleteTemplate(id);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleGenerate = async () => {
    if (!formData.theme) return;
    setIsGenerating(true);
    try {
      const prompt = `Crie uma reunião completa para o Clube de Desbravadores com o tema: "${formData.theme}". 
      Faixa etária: ${formData.ageGroup}.
      Retorne APENAS um JSON com a seguinte estrutura:
      {
        "title": "Título Criativo",
        "program": {
          "opening": "Descrição da abertura",
          "dynamic": "Descrição da dinâmica",
          "mainActivity": "Atividade principal",
          "message": "Mensagem espiritual",
          "prayer": "Foco da oração",
          "closing": "Encerramento"
        },
        "materials": ["item1", "item2"],
        "notes": "Dicas extras"
      }`;

      const result = await generateJSON<Partial<Meeting>>(prompt, {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          program: {
            type: "OBJECT",
            properties: {
              opening: { type: "STRING" },
              dynamic: { type: "STRING" },
              mainActivity: { type: "STRING" },
              message: { type: "STRING" },
              prayer: { type: "STRING" },
              closing: { type: "STRING" }
            }
          },
          materials: { type: "ARRAY", items: { type: "STRING" } },
          notes: { type: "STRING" }
        }
      });

      setFormData(prev => ({
        ...prev,
        ...result,
        // Ensure these fields are preserved if user entered them
        date: prev.date,
        time: prev.time,
        location: prev.location || 'Clube Local'
      }));
    } catch (error) {
      console.error("Failed to generate meeting", error);
      alert("Erro ao gerar reunião. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date) return;
    
    const newMeeting: Meeting = {
      id: uuidv4(),
      title: formData.title,
      date: formData.date,
      time: formData.time || '09:00',
      location: formData.location || 'Sede',
      ageGroup: formData.ageGroup || '10-15',
      theme: formData.theme || 'Geral',
      activities: [],
      leaders: [],
      materials: formData.materials || [],
      notes: formData.notes || '',
      program: formData.program as any
    };

    // Optimistic update
    setMeetings(prev => [...prev, newMeeting]);
    setIsCreating(false);
    setFormData({ title: '', date: '', time: '', theme: '', ageGroup: '10-15' });

    try {
      await supabaseService.saveMeeting(newMeeting);
    } catch (error) {
      console.error('Failed to save meeting to Supabase:', error);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    if (confirm("Deseja excluir esta reunião?")) {
      setMeetings(prev => prev.filter(m => m.id !== id));
      try {
        await supabaseService.deleteMeeting(id);
      } catch (error) {
        console.error('Failed to delete meeting:', error);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Agenda</h1>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(0,229,255,0.4)", 
            "0 0 35px rgba(0,229,255,0.7)", 
            "0 0 20px rgba(0,229,255,0.4)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => setIsCreating(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-neon-blue text-space-dark flex items-center justify-center border-2 border-white/20 transition-all duration-300"
      >
        <Plus size={28} strokeWidth={3} />
      </motion.button>

      {/* Meeting List */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nenhuma reunião agendada.</p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-l-4 border-l-pathfinder-yellow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{meeting.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><CalendarIcon size={12} /> {meeting.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {meeting.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">
                      {meeting.theme}
                    </span>
                    <button 
                      onClick={() => handleSaveTemplate(meeting)}
                      className="p-1.5 text-gray-400 hover:text-neon-blue transition-colors rounded-full hover:bg-white/5"
                      title="Salvar como Modelo"
                    >
                      <Save size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                      title="Excluir Reunião"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {meeting.program && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg text-xs space-y-1 text-gray-300">
                    <p><strong className="text-neon-blue">Abertura:</strong> {meeting.program.opening}</p>
                    <p><strong className="text-neon-blue">Atividade:</strong> {meeting.program.mainActivity}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-space-light border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Nova Reunião</h2>
                <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Custom Templates */}
                {customTemplates.length > 0 && (
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Meus Modelos</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {customTemplates.map(t => (
                        <div key={t.id} className="relative group shrink-0">
                          <button
                            onClick={() => loadCustomTemplate(t)}
                            className="px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 hover:bg-neon-blue/20 text-xs text-neon-blue whitespace-nowrap transition-all pr-8"
                          >
                            {t.name}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-neon-blue/50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standard Templates */}
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Modelos Rápidos</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {templates.map(t => (
                      <button
                        key={t.name}
                        onClick={() => loadTemplate(t)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-neon-blue/10 hover:border-neon-blue/50 text-xs text-gray-300 whitespace-nowrap transition-all"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tema da Reunião</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.theme}
                      onChange={e => setFormData({...formData, theme: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon-blue"
                      placeholder="Ex: Amizade, Natureza..."
                    />
                    <Button 
                      variant="neon" 
                      size="sm" 
                      onClick={handleGenerate}
                      isLoading={isGenerating}
                      disabled={!formData.theme}
                    >
                      <Sparkles size={16} />
                    </Button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Use a IA para preencher o resto!</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Data</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Horário</label>
                    <input 
                      type="time" 
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Título</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                    placeholder="Título da reunião"
                  />
                </div>

                {formData.program && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 text-sm">
                    <h3 className="font-bold text-neon-blue mb-2">Programa Sugerido</h3>
                    <p><span className="text-gray-400">Dinâmica:</span> {formData.program.dynamic}</p>
                    <p><span className="text-gray-400">Mensagem:</span> {formData.program.message}</p>
                    <p><span className="text-gray-400">Atividade:</span> {formData.program.mainActivity}</p>
                  </div>
                )}

                <Button className="w-full mt-4" onClick={handleSave}>
                  Salvar Reunião
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
