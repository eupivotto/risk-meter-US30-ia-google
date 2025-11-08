// FIX: Add reference to vite/client to resolve 'import.meta.env' type error.
/// <reference types="vite/client" />

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

// FIX: Access environment variables using import.meta.env for Vite projects
const TWELVE_DATA_API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

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
      const data = await response.json(); // Lemos o JSON para obter a mensagem de erro mesmo se a resposta falhar

      if (!response.ok) {
        const errorMessage = data.message || `Erro na API: ${response.statusText}`;
        if (response.status === 401) {
          throw new Error('Chave da API da Twelve Data inválida ou não autorizada.');
        }
        throw new Error(errorMessage);
      }

      // Às vezes a API retorna 200 OK mas com um erro no corpo (ex: plano de API excedido)
      if (data.status === 'error' || data.code >= 400) {
        throw new Error(data.message || 'A API da Twelve Data retornou um erro inesperado.');
      }

      setIndicators(prevIndicators =>
        prevIndicators.map(indicator => {
          const apiSymbol = symbolMapping[indicator.id];
          const marketData = data[apiSymbol];

          // Lida com o caso onde um símbolo individual retorna um erro
          if (!marketData || marketData.code >= 400) {
            console.warn(`Dados não encontrados ou inválidos para o símbolo: ${apiSymbol}`);
            return indicator; // Retorna os dados antigos para este indicador específico
          }

          if (marketData.close || marketData.previous_close) {
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
      // Se a busca falhar, ativamos a simulação para dar feedback visual
      if (!isSimulated) setIsSimulated(true);
    }
  };

  useEffect(() => {
    // FIX: Use ReturnType<typeof setInterval> to correctly type intervalId
    // for environments where setInterval may return a NodeJS.Timeout object.
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (!TWELVE_DATA_API_KEY) {
      console.warn("API Key da Twelve Data não configurada. Usando dados simulados.");
      setIsSimulated(true);
      intervalId = setInterval(() => {
        setIndicators(prev => simulateMarketData(prev));
      }, 3000); // Atualiza a simulação a cada 3 segundos
    } else {
      setIsSimulated(false);
      fetchData(); // Busca inicial
      intervalId = setInterval(fetchData, 90000); // Atualiza a cada 90 segundos
    }

    return () => clearInterval(intervalId);
  }, []); // O array de dependências vazio garante que isso execute apenas uma vez na montagem

  // Efeito separado para controlar a simulação quando um erro ocorre
  useEffect(() => {
    // FIX: Use ReturnType<typeof setInterval> to correctly type intervalId
    // for environments where setInterval may return a NodeJS.Timeout object.
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isSimulated && error) {
        intervalId = setInterval(() => {
            setIndicators(prev => simulateMarketData(prev));
        }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isSimulated, error])


  return { indicators, error, isSimulated };
};