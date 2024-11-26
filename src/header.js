const Header = () => {
    return (
      <header className="bg-yellow-100 p-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="bg-yellow-300 px-6 py-2 border-2 border-black flex items-center">
            <span className="mr-2">🍲</span>
            <span className="font-bold text-black">Yixha</span>
          </div>
  
          {/* Botón Central */}
          <div className="bg-black px-8 py-2 border-2 border-black">
            <span className="text-yellow-300 font-medium">Sorprendeme</span>
          </div>
  
          {/* Botón Derecha */}
          <div className="bg-yellow-300 px-6 py-2 border-2 border-black">
            <span className="text-black font-medium">Sobre Nosotros</span>
          </div>
        </nav>
      </header>
    );
  };

export default Header;