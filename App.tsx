import React from 'react';
import { Header } from './components/Header';
import { MarketClock } from './components/MarketClock';
import { IndicatorCard } from './components/IndicatorCard';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { useMarketData } from './hooks/useMarketData';

const InfoBanner: React.FC<{ message: string; details: string; type: 'warning' | 'error' }> = ({ message, details, type }) => {
    const baseClasses = "border px-4 py-3 rounded-lg relative my-6";
    const typeClasses = {
        warning: "bg-yellow-900/50 border-yellow-500 text-yellow-300",
        error: "bg-red-900/50 border-red-500 text-red-300"
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
            <strong className="font-bold">{type === 'warning' ? 'Aviso: Modo de Simulação Ativado' : 'Erro de Conexão'}</strong>
            <span className="block sm:inline ml-2">{message}</span>
            <p className="mt-2 text-sm">{details}</p>
        </div>
    );
};


function App() {
  const { indicators, error, isSimulated } = useMarketData();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        {isSimulated && !error && (
            <InfoBanner 
                type="warning"
                message="A chave da API Twelve Data (VITE_TWELVE_DATA_API_KEY) não foi encontrada."
                details="O dashboard está usando dados simulados. Para obter dados de mercado em tempo real, configure a chave no seu ambiente de produção (ex: Vercel)."
            />
        )}
        {error && (
             <InfoBanner 
                type="error"
                message={error}
                details="Não foi possível buscar os dados de mercado. Verifique sua chave de API e a conexão com a internet. O dashboard foi revertido para o modo de simulação."
             />
        )}
        
        <main className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <MarketClock />
            </div>
            
            {indicators.map((indicator) => (
              <IndicatorCard key={indicator.id} indicator={indicator} />
            ))}

            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <SentimentAnalysis indicators={indicators} />
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-xs text-gray-500 space-y-1">
          <p>
            Market data provided by <a href="https://twelvedata.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">Twelve Data</a>.
            Data may be delayed. Not financial advice.
          </p>
           <p>
            {/* FIX: Update environment variable name to API_KEY for Gemini per guidelines. */}
            Ensure API_KEY (Gemini) and VITE_TWELVE_DATA_API_KEY are set in your environment.
          </p>
          <p>&copy; 2024 US30 Market Open Dashboard. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;