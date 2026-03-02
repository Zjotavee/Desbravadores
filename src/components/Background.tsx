import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

export const Background = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-space-dark">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#022C22",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: ["#4ADE80", "#F9A825", "#C62828", "#FFFFFF"],
            },
            links: {
              color: "#4ADE80",
              distance: 120,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 100,
            },
            opacity: {
              value: { min: 0.1, max: 0.5 },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
              }
            },
            shape: {
              type: ["circle", "star"],
            },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.1,
                sync: false
              }
            },
          },
          detectRetina: true,
        }}
      />
      
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-dark via-transparent to-space-dark pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-pathfinder-blue/5 via-transparent to-pathfinder-red/5 pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};
