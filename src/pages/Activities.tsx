import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Search, Filter, Plus, Sparkles, X, Clock, Users, Box, Trash2 } from 'lucide-react';
import { Activity } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { generateJSON } from '@/services/gemini';
import { supabaseService } from '@/services/supabaseService';

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Caça ao Tesouro Bíblico',
    category: 'recreativa',
    objective: 'Aprender versículos de forma divertida',
    ageGroup: '10-12 anos',
    materials: ['Bíblia', 'Pistas em papel', 'Baú'],
    steps: ['Esconder pistas', 'Dividir equipes', 'Iniciar busca'],
    duration: '1h'
  },
  {
    id: '2',
    title: 'Nós e Amarras',
    category: 'especialidade',
    objective: 'Aprender nós básicos',
    ageGroup: '10-15 anos',
    materials: ['Cordas', 'Troncos'],
    steps: ['Demonstrar nó direito', 'Praticar', 'Fazer móvel de acampamento'],
    duration: '1h 30m'
  }
];

export const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await supabaseService.getActivities();
        if (data && data.length > 0) {
          setActivities(data);
        } else {
          setActivities(INITIAL_ACTIVITIES);
        }
      } catch (error) {
        console.error('Failed to load activities from Supabase:', error);
        setActivities(INITIAL_ACTIVITIES);
      } finally {
        setIsLoading(false);
      }
    };
    loadActivities();
  }, []);

  // Form State
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    category: 'recreativa',
    objective: '',
    ageGroup: '',
    duration: '',
    materials: [],
    steps: []
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.category) return;
    
    const newActivity: Activity = {
      id: uuidv4(),
      title: formData.title,
      category: formData.category as any,
      objective: formData.objective || '',
      ageGroup: formData.ageGroup || '',
      duration: formData.duration || '',
      materials: formData.materials || [],
      steps: formData.steps || [],
    };

    // Optimistic update
    setActivities(prev => [newActivity, ...prev]);
    setIsCreating(false);
    setFormData({ title: '', category: 'recreativa', materials: [], steps: [] });

    try {
      await supabaseService.saveActivity(newActivity);
    } catch (error) {
      console.error('Failed to save activity to Supabase:', error);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm("Deseja excluir esta atividade?")) {
      setActivities(prev => prev.filter(a => a.id !== id));
      try {
        await supabaseService.deleteActivity(id);
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
  };

  const handleGenerateActivity = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    
    try {
      const prompt = `Crie uma atividade para Desbravadores com o título/tema: "${formData.title}".
      Retorne JSON:
      {
        "objective": "Objetivo curto",
        "ageGroup": "Faixa etária ideal",
        "duration": "Duração estimada",
        "materials": ["item1", "item2"],
        "steps": ["passo 1", "passo 2"]
      }`;

      const result = await generateJSON<Partial<Activity>>(prompt, {
        type: "OBJECT",
        properties: {
          objective: { type: "STRING" },
          ageGroup: { type: "STRING" },
          duration: { type: "STRING" },
          materials: { type: "ARRAY", items: { type: "STRING" } },
          steps: { type: "ARRAY", items: { type: "STRING" } }
        }
      });

      setFormData(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filtered = activities.filter(a => {
    const matchesFilter = filter === 'all' || a.category === filter;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Atividades</h1>
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

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar atividade..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neon-blue/50 text-white"
          />
        </div>
        <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white">
          <Filter size={20} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'recreativa', 'natureza', 'especialidade', 'missionaria'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === cat 
                ? 'bg-neon-blue text-space-dark' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setSelectedActivity(activity)}
          >
            <Card className="hover:border-neon-blue/30 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded">
                    {activity.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-neon-blue transition-colors">{activity.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                    <Clock size={12} /> {activity.duration}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteActivity(activity.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mt-2 line-clamp-2">{activity.objective}</p>
              
              <div className="mt-4 flex gap-2 text-xs text-gray-400">
                <span className="bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                  <Users size={12} /> {activity.ageGroup}
                </span>
                <span className="bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                  <Box size={12} /> {activity.materials.length} materiais
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
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
                <h2 className="text-xl font-bold text-white">Nova Atividade</h2>
                <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Título / Tema</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon-blue"
                      placeholder="Ex: Corrida de Orientação"
                    />
                    <Button variant="neon" size="sm" onClick={handleGenerateActivity} disabled={isGenerating || !formData.title}>
                      <Sparkles size={16} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Categoria</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                    >
                      <option value="recreativa">Recreativa</option>
                      <option value="natureza">Natureza</option>
                      <option value="especialidade">Especialidade</option>
                      <option value="missionaria">Missionária</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Duração</label>
                    <input 
                      type="text" 
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                      placeholder="Ex: 1h"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Objetivo</label>
                  <textarea 
                    value={formData.objective}
                    onChange={e => setFormData({...formData, objective: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white h-20"
                  />
                </div>

                {formData.materials && formData.materials.length > 0 && (
                  <div className="p-3 bg-white/5 rounded-xl">
                    <h4 className="text-xs font-bold text-neon-blue mb-2">Materiais Sugeridos</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.materials.map((m, i) => (
                        <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.steps && formData.steps.length > 0 && (
                   <div className="p-3 bg-white/5 rounded-xl">
                    <h4 className="text-xs font-bold text-neon-blue mb-2">Passo a Passo</h4>
                    <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1">
                      {formData.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <Button className="w-full" onClick={handleCreate}>Salvar Atividade</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-space-light border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neon-blue bg-neon-blue/10 px-2 py-1 rounded inline-block mb-2">
                    {selectedActivity.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white">{selectedActivity.title}</h2>
                </div>
                <button onClick={() => setSelectedActivity(null)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-pathfinder-yellow mb-2 flex items-center gap-2">
                    <Sparkles size={16} /> Objetivo
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedActivity.objective}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-xs text-gray-400 block mb-1">Duração</span>
                    <span className="text-white font-bold">{selectedActivity.duration}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-xs text-gray-400 block mb-1">Faixa Etária</span>
                    <span className="text-white font-bold">{selectedActivity.ageGroup}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-pathfinder-yellow mb-2 flex items-center gap-2">
                    <Box size={16} /> Materiais
                  </h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedActivity.materials.map((m, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-pathfinder-yellow mb-2 flex items-center gap-2">
                    <Clock size={16} /> Passo a Passo
                  </h3>
                  <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                    {selectedActivity.steps.map((step, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <span className="w-4 h-4 rounded-full bg-space-dark border border-neon-blue text-[10px] flex items-center justify-center text-neon-blue shrink-0 z-10">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
