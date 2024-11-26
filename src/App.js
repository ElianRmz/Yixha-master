import React, { useState, useEffect } from 'react';
import { buscarRecetasPorIngredientes, buscarRecetaPorID, obtenerListaDeIngredientes } from './RecetasService';
import './App.css';

const ingredientesBasicos = ["Chicken", "Beef", "Pork", "Tomato", "Cheese", "Onion", "Garlic", "Carrot"];

function App() {
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [listaIngredientes, setListaIngredientes] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  useEffect(() => {
    const cargarIngredientes = async () => {
      const ingredientes = await obtenerListaDeIngredientes();
      setListaIngredientes(ingredientes);
    };
    cargarIngredientes();
  }, []);

  useEffect(() => {
    // If the ingredient list is empty, center the form
    if (ingredientes.length === 0) {
      setBusquedaRealizada(false);
      setRecetas([]); // Clear the displayed recipes
    }
  }, [ingredientes]);

  const agregarIngrediente = (ingrediente) => {
    if (ingrediente && !ingredientes.includes(ingrediente)) {
      setIngredientes([...ingredientes, ingrediente]);
      setNuevoIngrediente('');
      setSugerencias([]);
    }
  };

  const eliminarIngrediente = (ingrediente) => {
    setIngredientes(ingredientes.filter((ing) => ing !== ingrediente));
  };

  const manejarCambio = (e) => {
    const valor = e.target.value;
    setNuevoIngrediente(valor);

    if (valor.length > 1) {
      const coincidencias = listaIngredientes.filter((ing) =>
        ing.toLowerCase().startsWith(valor.toLowerCase())
      );
      setSugerencias(coincidencias);
    } else {
      setSugerencias([]);
    }
  };

  const manejarSeleccionBasico = (e) => {
    const ingrediente = e.target.value;
    if (e.target.checked) {
      agregarIngrediente(ingrediente);
    } else {
      eliminarIngrediente(ingrediente);
    }
  };

  const buscarRecetas = async () => {
    setError(null);
    const resultados = await buscarRecetasPorIngredientes(ingredientes);
    if (resultados.length === 0) {
      setError("No recipes found with the selected ingredients.");
    }
    setRecetas(resultados);
    setBusquedaRealizada(true);
  };

  const mostrarDetalles = async (receta) => {
    const detallesCompletos = await buscarRecetaPorID(receta.idMeal);
    setRecetaSeleccionada(detallesCompletos);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setRecetaSeleccionada(null);
  };

  return (
    <div className='bg-yellow-100'>
      <header className="sticky top-0 bg-white p-4 px-5">
        <nav className="max-w-7xl mx-auto flex justify-between items-center ">
          <div className="bg-yellow-300 px-6 py-2 border-2 border-black flex items-center rounded-sm">
            <span className="mr-2">🍲</span>
            <span className="font-bold text-black">Yixha</span>
          </div>
          <div className="bg-black px-8 py-2 border-3 border-black ml-11 rounded-sm">
            <span className="text-yellow-300 font-medium">Surprise Me</span>
          </div>
          <div className="bg-yellow-300 px-6 py-2 border-2 border-black rounded-sm">
            <span className="text-black font-medium">About Us</span>
          </div>
        </nav>
      </header>

      <div className="flex w-full py-6">

        {/* Recipe Container */}
        <div className={`transition-all duration-500 ${busquedaRealizada ? 'w-1/2' : 'w-0 overflow-hidden'}`}>
          {/* Recipe Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-50 gap-4 m-6">
            {recetas.map((receta) => (
              <div
                key={receta.idMeal}
                className="border rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={receta.strMealThumb}
                  alt={receta.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{receta.strMeal}</h3>
                  <button
                    onClick={() => mostrarDetalles(receta)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Details Modal */}
          {showModal && recetaSeleccionada && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{recetaSeleccionada.strMeal}</h2>
                  <button
                    onClick={cerrarModal}
                    className="text-red-500 hover:text-red-700"
                  >
                    Close
                  </button>
                </div>

                {/* Modal Content */}
                <img
                  src={recetaSeleccionada.strMealThumb}
                  alt={recetaSeleccionada.strMeal}
                  className="w-full rounded-lg mb-4"
                />

                <div className="space-y-2">
                  <p><strong>Category:</strong> {recetaSeleccionada.strCategory}</p>
                  <p><strong>Area:</strong> {recetaSeleccionada.strArea}</p>

                  <h3 className="font-semibold mt-4">Ingredients:</h3>
                  <ul className="list-disc pl-5">
                    {Object.keys(recetaSeleccionada)
                      .filter((key) => key.startsWith('strIngredient') && recetaSeleccionada[key])
                      .map((key, index) => (
                        <li key={index}>{recetaSeleccionada[key]}</li>))}
                  </ul>

                  <h3 className="font-semibold mt-4">Instructions:</h3>
                  <p>{recetaSeleccionada.strInstructions || 'Instructions not available.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ingredient Form */}
        <div className={`${busquedaRealizada ? "w-1/2 ml-auto" : "w-full mx-auto"} transition-all duration-500`}>
          <div className="px-12 my-32 z-0">
            <div className="relative mb-4 mx-12">
              <input
                type="text"
                value={nuevoIngrediente}
                onChange={manejarCambio}
                placeholder="Search"
                className="w-full px-3 py-2 bg-yellow-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 border-2 border-black"
              />
              {sugerencias.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                  {sugerencias.map((sugerencia) => (
                    <li
                      key={sugerencia}
                      onClick={() => agregarIngrediente(sugerencia)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {sugerencia}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Basic Ingredients */}
            <div className="mb-4">
              <div className="flex flex-col gap-3 mx-12">
                {/* Row 1: Small and Large Checkbox */}
                <div className="flex gap-3">
                  {ingredientesBasicos.slice(0, 2).map((ing, index) => (
                    <label
                      key={ing}
                      className={`inline-flex border-2 p-3 border-black rounded-sm items-center cursor-pointer ${ingredientes.includes(ing) ? 'bg-black text-white' : 'text-black'} hover:bg-black hover:text-white
                    ${index === 0 ? 'w-1/3' : 'w-2/3'}`}
                    >
                      <input
                        type="checkbox"
                        value={ing}
                        checked={ingredientes.includes(ing)}
                        onChange={manejarSeleccionBasico}
                        className={`form-checkbox hidden ${index === 0 ? 'h-4 w-4' : 'h-6 w-6'} text-blue-600`}
                      />
                      <span className="ml-2">{ing}</span>
                    </label>
                  ))}
                </div>
                {/* Row 2: Large and Small Checkbox */}
                <div className="flex gap-3">
                  {ingredientesBasicos.slice(2, 4).map((ing, index) => (
                    <label
                      key={ing}
                      className={`
                          inline-flex 
                          border-2 
                          p-3 
                          border-black 
                          rounded-sm 
                          items-center 
                          cursor-pointer
                          ${ingredientes.includes(ing) ? 'bg-black text-white' : 'text-black'}
                          hover:bg-black 
                          hover:text-white
                          ${index === 0 ? 'w-2/3' : 'w-1/3'}
                        `}
                    >
                      <input
                        type="checkbox"
                        value={ing}
                        checked={ingredientes.includes(ing)}
                        onChange={manejarSeleccionBasico}
                        className={`
                            form-checkbox 
                            hidden 
                            ${index === 0 ? 'h-6 w-6' : 'h-4 w-4'} 
                            text-blue-600
                          `}
                      />
                      <span className="ml-2">{ing}</span>
                    </label>
                  ))}
                </div>

                {/* Row 3: Small and Large Checkbox */}
                <div className="flex gap-3">
                  {ingredientesBasicos.slice(4, 6).map((ing, index) => (
                    <label
                      key={ing}
                      className={`inline-flex border-2 p-3 border-black rounded-sm items-center cursor-pointer ${ingredientes.includes(ing) ? 'bg-black text-white' : 'text-black'} hover:bg-black hover:text-white
                    ${index === 0 ? 'w-1/3' : 'w-2/3'}`}
                    >
                      <input
                        type="checkbox"
                        value={ing}
                        checked={ingredientes.includes(ing)}
                        onChange={manejarSeleccionBasico}
                        className={`form-checkbox hidden ${index === 0 ? 'h-4 w-4' : 'h-6 w-6'} text-blue-600`}
                      />
                      <span className="ml-2">{ing}</span>
                    </label>
                  ))}
                </div>

                {/* Row 4: Large and Small Checkbox */}
                <div className="flex gap-3">
                  {ingredientesBasicos.slice(6, 8).map((ing, index) => (
                    <label
                      key={ing}
                      className={`inline-flex border-2 p-3 border-black rounded-sm items-center cursor-pointer ${ingredientes.includes(ing) ? 'bg-black text-white' : 'text-black'} hover:bg-black hover:text-white
                    ${index === 0 ? 'w-2/3' : 'w-1/3'}`}
                    >
                      <input
                        type="checkbox"
                        value={ing}
                        checked={ingredientes.includes(ing)}
                        onChange={manejarSeleccionBasico}
                        className={`form-checkbox hidden ${index === 0 ? 'h-6 w-6' : 'h-4 w-4'} text-blue-600`}
                      />
                      <span className="ml-2">{ing}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center mx-12">
              <button
                onClick={buscarRecetas}
                className="w-full max-w-md bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-400 transition"
              >
                Search Recipes
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
