import { useState, useMemo } from 'react';
import { Search, MessageSquare, Lock } from 'lucide-react';
import { INITIAL_CATALOG, WHATSAPP_LINK, FATOR_CONVERSAO } from '../data';

interface CatalogSectionProps {
  currentPointsBalance: number;
}

export function CatalogSection({ currentPointsBalance }: CatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return INITIAL_CATALOG.filter(product => {
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Catálogo de Resgates Premium</h2>
          <p className="text-xs text-slate-400">Transforme suas compras em ativos de tecnologia e lazer de alto valor</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input 
              type="text"
              placeholder="Buscar prêmio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs rounded-xl py-2.5 pl-9 pr-4 w-full sm:w-48 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto whitespace-nowrap">
            {['Todos', 'Tecnologia', 'Escritório & Climatização', 'Lazer', 'Ferramentas & Manutenção'].map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeCategory === category ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const pointsRequired = Math.round(product.price / FATOR_CONVERSAO);
          const hasEnoughPoints = currentPointsBalance >= pointsRequired;
          
          return (
            <div 
              key={product.id}
              className={`bg-slate-900/60 hover:bg-slate-900 border ${product.highlight ? 'border-emerald-500/20' : 'border-slate-800'} hover:border-emerald-500/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg ${!hasEnoughPoints ? 'opacity-90' : ''}`}
            >
              <div className="h-44 overflow-hidden relative bg-slate-950">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 ${!hasEnoughPoints ? 'grayscale-[30%]' : ''}`}
                />
                {product.highlight && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/40 rounded">
                    Destaque B2B
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-950/80 text-slate-300 text-[10px] rounded border border-slate-800">
                  {product.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">Valor em Pontos</span>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-2xl font-black ${hasEnoughPoints ? 'text-amber-400' : 'text-slate-500'}`}>{pointsRequired.toLocaleString('pt-BR')}</span>
                      <span className="text-xs text-slate-400 font-bold">pontos</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1">
                {hasEnoughPoints ? (
                  <a 
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition duration-300 shadow-lg flex items-center justify-center space-x-2 active:scale-95 hover:shadow-emerald-500/10"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Resgatar Prêmio</span>
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full py-2.5 bg-slate-800/80 text-slate-500 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 cursor-not-allowed border border-slate-700/30"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pontos Insuficientes</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
