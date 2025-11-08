import React, { useState, useCallback } from 'react';
import { Indicator } from '../types';
import { getMarketSentiment } from '../services/geminiService';

interface SentimentAnalysisProps {
  indicators: Indicator[];
}

// Simple Markdown to HTML renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-blue-300 mt-4 mb-2">$1</h3>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
        .replace(/-\s(.*)/g, '<li class="ml-5 list-disc">$1</li>')
        .replace(/\n/g, '<br />');

    return <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400 delay-200"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400 delay-400"></div>
        <span className="ml-2 text-gray-300">Analisando o mercado...</span>
    </div>
);


export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ indicators }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const result = await getMarketSentiment(indicators);
      setAnalysis(result);
    } catch (err) {
      setError('Falha ao obter a análise. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [indicators]);

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-bold text-white mb-2 sm:mb-0">Análise de Sentimento com IA</h2>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isLoading ? 'Analisando...' : 'Analisar Sentimento do Mercado'}
        </button>
      </div>

      <div className="mt-6 min-h-[200px] bg-gray-900/50 p-4 rounded-md border border-gray-600">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-400">{error}</p>}
        {analysis ? (
          <MarkdownRenderer content={analysis} />
        ) : (
          !isLoading && <p className="text-gray-400">Clique no botão para gerar uma análise de sentimento pré-abertura para o US30 com base nos dados atuais do mercado.</p>
        )}
      </div>
    </div>
  );
};