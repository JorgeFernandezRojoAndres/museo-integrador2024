const options = {
    background: {
      color: "38a5f1", // el color de fondo del lienzo
    },
    
    interactivity: {
      events: {
        onClick: {
          // esto maneja el evento de clic del mouse
          enable: true,
          mode: "push", // esto agrega partículas
        },
        
        onHover: {
          // this handles the mouse hover event
          enable: true,
          mode: "repulse", // esto maneja el evento de desplazamiento del mouse
        },
      },
      modes: {
        push: {
          quantity: 2, // número de partículas a añadir
        },
        repulse: {
          distance: 100, //la distancia de las partículas del ratón
        },
      },
    },
    particles: {
        color: {
            value: "2d2a29" // Color de las partículas en rojo
          },
      links: {
        enable: true, // esto permite enlaces entre partículas
        opacity: 0.3,
        distance: 200,
      },
      move: {
        enable: true, // this makes particles move
        speed: { min: 0.1, max: 0.3 }, // esta es la velocidad de las partículas
      },
      opacity: {
        value: { min: 0.5, max: 0.9 }, // esto establece la opacidad de las partículas
      },
      size: {
        value: { min: 1, max: 3 }, // esto establece el tamaño de las partículas
        
      },
    
     
    },
    fullScreen: {
           enable: true,
           zIndex: -1,
  }
   
  };
  

  // tsParticles.load tiene dos parámetros, el primero es el id del contenedor, el segundo es un objeto con las opciones
  tsParticles.load("tsparticles", options);
