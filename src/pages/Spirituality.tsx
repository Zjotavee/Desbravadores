import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/Card';
import { BookOpen, CheckCircle, Heart, Share2, Plus, Sparkles } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SpiritualContent } from '@/types';
import { Button } from '@/components/Button';
import { MeditationGenerator } from './MeditationGenerator';

const INITIAL_CONTENT: SpiritualContent[] = [
  {
    id: '1',
    type: 'meditacao',
    title: 'A Coragem de Davi',
    content: 'Assim como Davi enfrentou Golias, nós enfrentamos gigantes modernos. A fé é nossa pedra.',
    reference: '1 Samuel 17:45',
    date: '2024-03-20',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: '2',
    type: 'versiculo',
    title: 'Versículo do Dia',
    content: 'Tudo posso naquele que me fortalece.',
    reference: 'Filipenses 4:13',
    date: '2024-03-20',
    isFavorite: true,
    isCompleted: false
  },
  {
    id: '3',
    type: 'desafio',
    title: 'Desafio da Semana',
    content: 'Ore por 3 amigos que não conhecem a Jesus esta semana.',
    date: '2024-03-20',
    isFavorite: false,
    isCompleted: false
  }
];

export const Spirituality = () => {
  const [contents, setContents] = useLocalStorage<SpiritualContent[]>('spiritual-content', INITIAL_CONTENT);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleComplete = (id: string) => {
    setContents(prev => prev.map(c => 
      c.id === id ? { ...c, isCompleted: !c.isCompleted } : c
    ));
  };

  const toggleFavorite = (id: string) => {
    setContents(prev => prev.map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const handleSaveGenerated = (newContent: SpiritualContent) => {
    setContents(prev => [newContent, ...prev]);
    setIsGenerating(false);
  };

  if (isGenerating) {
    return <MeditationGenerator onSave={handleSaveGenerated} onCancel={() => setIsGenerating(false)} />;
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Background Video */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-20"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-sun-rays-through-forest-trees-1238-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#022C22]/90 via-[#022C22]/70 to-[#022C22]/95" />
      </div>

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Espiritualidade</h1>
          <div className="text-sm text-gray-400">
            {contents.filter(c => c.isCompleted).length} / {contents.length} concluídos
          </div>
        </div>
        <Button onClick={() => setIsGenerating(true)} variant="neon" size="sm">
          <Sparkles size={16} className="mr-2" /> Gerar
        </Button>
      </header>

      <div className="grid gap-4">
        {contents.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-l-4 ${item.isCompleted ? 'border-l-green-500 opacity-70' : 'border-l-neon-blue'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-1 rounded">
                  {item.type}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className={`p-1.5 rounded-full transition-colors ${item.isFavorite ? 'text-pathfinder-yellow bg-pathfinder-yellow/10' : 'text-gray-500 hover:text-white'}`}
                  >
                    <Heart size={18} fill={item.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button className="p-1.5 rounded-full text-gray-500 hover:text-white transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              
              {/* Render content appropriately - if it's long markdown (generated), truncate or show differently */}
              <div className="text-gray-300 text-sm mb-3 line-clamp-3">
                 {item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content}
              </div>
              
              {item.reference && (
                <div className="flex items-center gap-2 text-neon-blue text-xs font-medium mb-4">
                  <BookOpen size={14} />
                  {item.reference}
                </div>
              )}

              <button
                onClick={() => toggleComplete(item.id)}
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                  item.isCompleted 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <CheckCircle size={16} />
                {item.isCompleted ? 'Concluído' : 'Marcar como lido'}
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
