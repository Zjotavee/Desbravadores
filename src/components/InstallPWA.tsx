import { useState, useEffect } from 'react';
import { Download, Share } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'motion/react';

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Handle Android/Desktop install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  if (!isInstallable && !isIOS) return null;

  // Don't show if already in standalone mode (installed)
  if (window.matchMedia('(display-mode: standalone)').matches) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          animate={{ 
            boxShadow: ["0 0 20px rgba(74,222,128,0.3)", "0 0 35px rgba(74,222,128,0.6)", "0 0 20px rgba(74,222,128,0.3)"],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-xl"
        >
          <Button
            variant="neon"
            size="sm"
            onClick={handleInstallClick}
            className="bg-[#064E3B] border-neon-blue text-neon-blue font-bold tracking-wide hover:bg-[#064E3B]/80"
          >
            <Download size={16} className="mr-2" />
            Instalar App
          </Button>
        </motion.div>
      </motion.div>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-space-light border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Share size={20} />
                Instalar no iOS
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-300 text-sm">
                <li>Toque no botão <strong>Compartilhar</strong> na barra inferior do Safari.</li>
                <li>Role para baixo e toque em <strong>Adicionar à Tela de Início</strong>.</li>
                <li>Confirme tocando em <strong>Adicionar</strong>.</li>
              </ol>
              <Button 
                className="w-full mt-6" 
                onClick={() => setShowIOSInstructions(false)}
              >
                Entendi
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
