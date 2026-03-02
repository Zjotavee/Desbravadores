import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Loader2, Trash2, Tent, Compass, Map } from 'lucide-react';
import { Button } from '@/components/Button';
import { generateContent } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Maranata! ⛺ Sou o **Desbravatudo**, seu assistente de campo. \n\nPosso ajudar com reuniões, especialidades, nós, ou aquele devocional top. \n\n**Qual é a missão de hoje?**'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClear = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Maranata! ⛺ Sou o **Desbravatudo**, seu assistente de campo. \n\nPosso ajudar com reuniões, especialidades, nós, ou aquele devocional top. \n\n**Qual é a missão de hoje?**'
      }
    ]);
  };

  const handleSend = async (textInput?: string) => {
    const messageText = textInput || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `Você é o "Desbravatudo", um assistente virtual especialista no Clube de Desbravadores.
      Sua persona é de um desbravador experiente, animado e muito espiritual.
      Use gírias do clube como "Maranata", "Líder", "Unidade", "QG", "Bivaque".
      Sempre comece ou termine com uma saudação típica (ex: "Maranata!").
      Seja prático e direto, mas sempre amigável.
      Formate a resposta com Markdown (negrito, listas, títulos).
      Se pedirem uma atividade, estruture em: 🎯 Objetivo, 🎒 Materiais, 👣 Passo a Passo e 🙏 Aplicação Espiritual.
      Se pedirem devocional, sempre inclua um versículo bíblico na versão NVI ou Almeida.`;

      const response = await generateContent(messageText, systemPrompt);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "O QG não respondeu. Tente novamente, líder!"
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Erro de comunicação com o QG. Verifique o rádio (conexão) e tente novamente."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Reunião sobre amizade",
    "Dinâmica para 10-12 anos",
    "Devocional de coragem",
    "Ideia de acampamento",
    "Especialidade de Nós"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pathfinder-yellow to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Compass className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">DESBRAVATUDO</h2>
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Online e Pronto
            </p>
          </div>
        </div>
        <button 
          onClick={handleClear}
          className="p-2.5 text-gray-400 hover:text-red-400 transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
          title="Limpar conversa"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 p-4 no-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'assistant' 
                  ? 'bg-gradient-to-br from-pathfinder-yellow to-orange-500 text-white' 
                  : 'bg-gradient-to-br from-pathfinder-blue to-blue-600 text-white'
              }`}>
                {msg.role === 'assistant' ? <Tent size={20} /> : <User size={20} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-5 shadow-md ${
                msg.role === 'assistant' 
                  ? 'bg-space-light/80 border border-white/10 backdrop-blur-md rounded-tl-none' 
                  : 'bg-pathfinder-blue text-white rounded-tr-none shadow-blue-900/20'
              }`}>
                <div className={`markdown-body text-sm sm:text-base leading-relaxed ${
                  msg.role === 'assistant' ? 'text-gray-200' : 'text-white'
                } prose prose-invert max-w-none prose-p:my-2 prose-headings:text-pathfinder-yellow prose-strong:text-neon-blue prose-ul:list-disc prose-ul:pl-4`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pathfinder-yellow to-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Tent size={20} />
            </div>
            <div className="bg-space-light/50 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-pathfinder-yellow rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-pathfinder-yellow rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-pathfinder-yellow rounded-full animate-bounce"></span>
              </span>
              <span className="text-sm text-gray-400 font-medium ml-2">Desbravatudo está digitando...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Area */}
      <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
        {/* Suggestions */}
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 justify-center px-2"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSend(s)}
                className="text-xs sm:text-sm px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-pathfinder-yellow/20 hover:border-pathfinder-yellow/50 hover:text-pathfinder-yellow transition-all text-gray-300 font-medium"
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Input Area */}
        <div className="relative px-2 pb-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pathfinder-yellow via-pathfinder-red to-pathfinder-blue rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-space-dark rounded-2xl border border-white/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enviar mensagem para o QG..."
                className="w-full bg-transparent border-none rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-0 text-white placeholder:text-gray-500 text-base"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-pathfinder-blue to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                {isLoading ? <Sparkles className="animate-pulse" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-2">
            O Desbravatudo pode cometer erros. Sempre verifique as informações com seu líder.
          </p>
        </div>
      </div>
    </div>
  );
};
