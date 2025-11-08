import { useState, useEffect } from 'react';
import { Indicator } from '../types';
import { INITIAL_INDICATORS } from '../constants';

// Mapeamento dos nossos IDs para os símbolos da Twelve Data API
const symbolMapping: Record<string, string> = {
  'US30': 'US30',
  'SPX500': 'SPX',
  'NAS100': 'NDX',
  'TICK': 'TICK',
  'VIX': 'VIX',
  'MOVE': 'MOVE',
  'DXY': 'DXY',
  'XAUUSD': 'XAU/USD',
  'WTI': 'CL',
  'US10Y': 'US10Y',
  'US30Y': 'US30Y',
};

const TWELVE_DATA_API_KEY = process.env.VITE_TWELVE_DATA_API_KEY;

// Função para simular mudanças nos dados do mercado
const simulateMarketData = (indicators: Indicator[]): Indicator[] => {
  return indicators.map(indicator => {
    // Mudanças menores e mais realistas para a simulação
    const changePercent = (Math.random() - 0.48) * 0.5; // Mudança aleatória entre ~ -0.24% e +0.26%
    const change = (indicator.value * changePercent) / 100;
    const newValue = indicator.value + change;

    return {
      ...indicator,
      value: newValue,
      change: change,
      changePercent: changePercent,
    };
  });
};


export const useMarketData = (): { indicators: Indicator[]; error: string | null; isSimulated: boolean; } => {
  const [indicators, setIndicators] = useState<Indicator[]>(INITIAL_INDICATORS);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(!TWELVE_DATA_API_KEY);

  const fetchData = async () => {
    const symbols = Object.values(symbolMapping).join(',');
    const url = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${TWELVE_DATA_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Chave da API da Twelve Data inválida ou não autorizada.');
        }
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      const data = await response.json();
      
      const isBulkResponse = Array.isArray(data.data);

      setIndicators(prevIndicators =>
        prevIndicators.map(indicator => {
          const apiSymbol = symbolMapping[indicator.id];
          let marketData;
          
          if (data.symbol && data.symbol === apiSymbol) {
              marketData = data;
          } 
          else if (isBulkResponse) {
             marketData = data.data.find((d: any) => d.symbol === apiSymbol);
          } 
          else {
             marketData = data[apiSymbol];
          }

          if (marketData && (marketData.close || marketData.previous_close)) {
            const newValue = parseFloat(marketData.close || marketData.previous_close);
            const change = parseFloat(marketData.change || '0');
            const changePercent = parseFloat(marketData.percent_change || '0');
            
            return {
              ...indicator,
              value: newValue,
              change: change,
              changePercent: changePercent,
            };
          }
          return indicator;
        })
      );
      if (error) setError(null); // Limpa erros anteriores em caso de sucesso
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      setError(err instanceof Error ? err.message : "Falha ao buscar dados do mercado.");
    }
  };

  useEffect(() => {
    if (!TWELVE_DATA_API_KEY) {
      console.warn("API Key da Twelve Data não configurada. Usando dados simulados.");
      setIsSimulated(true);
      const interval = setInterval(() => {
        setIndicators(prev => simulateMarketData(prev));
      }, 3000); // Atualiza a simulação a cada 3 segundos
      return () => clearInterval(interval);
    } else {
        setIsSimulated(false);
        fetchData(); // Busca inicial
        const interval = setInterval(fetchData, 90000); // Atualiza a cada 90 segundos
        return () => clearInterval(interval);
    }
  }, []);

  return { indicators, error, isSimulated };
};