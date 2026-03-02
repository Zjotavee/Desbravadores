import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { generateContent } from '@/services/gemini';
import { Sparkles, Send, BookOpen, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SpiritualContent } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface MeditationGeneratorProps {
  onSave: (content: SpiritualContent) => void;
  onCancel: () => void;
}

export const MeditationGenerator = ({ onSave, onCancel }: MeditationGeneratorProps) => {
  const [step, setStep] = useState<'input' | 'refining' | 'result'>('input');
  const [topic, setTopic] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [generatedMeditation, setGeneratedMeditation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialSubmit = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setStep('refining');
    
    const initialPrompt = `O usuário quer criar uma meditação sobre: "${topic}".
    Aja como um mentor espiritual jovem e sábio.
    Faça 2 perguntas curtas e instigantes para entender melhor o enfoque que ele quer dar (ex: foco em encorajamento, correção, história bíblica específica, aplicação prática).
    Seja breve.`;

    try {
      const response = await generateContent(initialPrompt);
      setConversation([
        { role: 'user', content: `Quero uma meditação sobre: ${topic}` },
        { role: 'assistant', content: response || "Ótimo tema! Para direcionar melhor: você prefere focar em uma história bíblica específica ou em uma aplicação prática para o dia a dia?" }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinement = async (input: string) => {
    const newHistory = [...conversation, { role: 'user' as const, content: input }];
    setConversation(newHistory);
    setIsLoading(true);

    const prompt = `Histórico da conversa:
    ${newHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
    
    O usuário respondeu. Agora, crie a meditação completa e estruturada.
    Estrutura obrigatória (use Markdown):
    # Título Criativo
    ## Texto Bíblico (com referência)
    ## A História (uma narrativa envolvente e curta)
    ## Aplicação (como isso se aplica à vida de um desbravador hoje)
    ## Oração Final
    
    Tom de voz: Inspirador, jovem, direto.`;

    try {
      const response = await generateContent(prompt);
      if (response) {
        setGeneratedMeditation(response);
        setStep('result');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Extract title from markdown (first line usually)
    const titleMatch = generatedMeditation.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;
    
    // Extract reference (simple heuristic)
    const refMatch = generatedMeditation.match(/## Texto Bíblico.*?\n(.*?)\n/s);
    const reference = refMatch ? refMatch[1].substring(0, 50) + "..." : "Bíblia";

    const newContent: SpiritualContent = {
      id: uuidv4(),
      type: 'meditacao',
      title: title,
      content: generatedMeditation, // Store full markdown
      reference: reference,
      date: new Date().toISOString().split('T')[0],
      isFavorite: false,
      isCompleted: false
    };

    onSave(newContent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold text-neon-blue flex items-center gap-2">
          <Sparkles size={20} /> Gerador de Meditação
        </h2>
      </div>

      {step === 'input' && (
        <Card className="space-y-4 p-6">
          <div className="text-center space-y-2">
            <BookOpen size={48} className="mx-auto text-pathfinder-yellow opacity-80" />
            <h3 className="text-lg font-bold text-white">Sobre o que vamos refletir hoje?</h3>
            <p className="text-gray-400 text-sm">
              Diga um tema, um sentimento ou uma passagem bíblica.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Coragem, Amizade, Salmo 23..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleInitialSubmit()}
            />
            <Button onClick={handleInitialSubmit} disabled={isLoading || !topic} variant="neon">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      )}

      {step === 'refining' && (
        <div className="space-y-4">
          {conversation.filter(m => m.role === 'assistant').map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-neon-blue/5 border-neon-blue/20">
                <p className="text-gray-200">{msg.content}</p>
              </Card>
            </motion.div>
          ))}
          
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              autoFocus
              placeholder="Responda para guiar a IA..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRefinement(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button disabled={isLoading} variant="neon">
              {isLoading ? <Sparkles className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
      )}

      {step === 'result' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Card className="p-6 bg-space-light/80 border-pathfinder-yellow/30">
            <div className="markdown-body prose prose-invert prose-sm max-w-none prose-headings:text-pathfinder-yellow prose-p:text-gray-300">
              <ReactMarkdown>{generatedMeditation}</ReactMarkdown>
            </div>
          </Card>
          <Button onClick={handleSave} className="w-full" variant="primary">
            Salvar Meditação
          </Button>
        </motion.div>
      )}
    </div>
  );
};
