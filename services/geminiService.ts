import { GoogleGenAI } from "@google/genai";
import { Indicator } from '../types';

const generatePrompt = (indicators: Indicator[]): string => {
    const data = indicators.reduce((acc, ind) => {
        let valueStr = ind.value.toFixed(2);
        if (ind.isYield) {
            valueStr = `${ind.value.toFixed(3)}%`;
        } else if (ind.id === 'TICK') {
            valueStr = ind.value.toFixed(0);
        }

        acc[ind.id] = {
            value: valueStr,
            changePercent: ind.changePercent.toFixed(2)
        };
        return acc;
    }, {} as Record<string, { value: string; changePercent: string }>);

    return `
      Você é um analista financeiro sênior especializado no mercado de ações dos EUA, com foco no índice Dow Jones (US30).
      Sua tarefa é fornecer uma análise de sentimento pré-abertura concisa para o US30 com base nos seguintes dados de mercado em tempo real.

      Dados Atuais do Mercado:
      - US30 (Dow Jones): ${data.US30.value} (${data.US30.changePercent}%)
      - S&P 500: ${data.SPX500.value} (${data.SPX500.changePercent}%)
      - Nasdaq 100: ${data.NAS100.value} (${data.NAS100.changePercent}%)
      - VIX (Índice de Medo): ${data.VIX.value} (${data.VIX.changePercent}%)
      - MOVE (Volatilidade de Títulos): ${data.MOVE.value} (${data.MOVE.changePercent}%)
      - NYSE TICK ($TICK): ${data.TICK.value}
      - DXY (Índice do Dólar): ${data.DXY.value} (${data.DXY.changePercent}%)
      - Ouro (XAU/USD): ${data.XAUUSD.value} (${data.XAUUSD.changePercent}%)
      - Petróleo (WTI): ${data.WTI.value} (${data.WTI.changePercent}%)
      - Rendimento do Tesouro de 10 Anos: ${data.US10Y.value}
      - Rendimento do Tesouro de 30 Anos: ${data.US30Y.value}

      Baseado nesses dados, forneça a seguinte análise em português do Brasil, usando markdown para formatação:

      ### Sentimento Geral
      **Classificação:** (Ex: Altamente Otimista, Moderadamente Pessimista, Neutro com viés de alta, etc.)

      ### Análise Resumida
      Um parágrafo curto explicando o porquê do sentimento. Analise a correlação entre os ativos (por exemplo, um VIX ou MOVE em alta indica medo e aversão ao risco; a força do DXY pode impactar as exportações das empresas do US30; rendimentos em alta podem pressionar as ações). Use o valor do $TICK como um termômetro instantâneo do sentimento comprador/vendedor (valores extremos como acima de +800 ou abaixo de -800 indicam euforia ou pânico).

      ### Fatores Chave
      - **Fator 1:** Descreva o principal fator de influência.
      - **Fator 2:** Descreva o segundo fator de influência.
      - **Fator 3:** Descreva o terceiro fator de influência.

      ### Viés para a Abertura
      **Projeção:** (Ex: Viés de alta, Viés de baixa, Volatilidade esperada, Abertura indefinida).

      Seja direto e objetivo, como se estivesse informando um trader profissional que precisa de informações rápidas e acionáveis.
    `;
};

export const getMarketSentiment = async (indicators: Indicator[]): Promise<string> => {
  // FIX: Per Gemini API guidelines, use process.env.API_KEY.
  const API_KEY = process.env.API_KEY;
  
  if (!API_KEY) {
    // FIX: Update error message to reference API_KEY.
    console.error("API_KEY environment variable not set.");
    return "Erro de configuração: A variável de ambiente API_KEY (Gemini) não foi configurada. Por favor, adicione-a nas configurações do seu ambiente de produção (Vercel).";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = generatePrompt(indicators);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching sentiment from Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
         // FIX: Update error message to reference API_KEY.
         return "Ocorreu um erro ao buscar a análise de sentimento: A chave da API (API_KEY) é inválida. Por favor, verifique a chave e tente novamente.";
    }
    return "Ocorreu um erro ao buscar a análise de sentimento. Por favor, verifique o console para mais detalhes e se a sua chave de API é válida.";
  }
};