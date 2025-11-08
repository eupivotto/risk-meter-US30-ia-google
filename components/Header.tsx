
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        US30 Market Open Dashboard
      </h1>
      <p className="mt-1 text-sm text-gray-400">
        Análise de sentimento pré-abertura com IA para o Dow Jones
      </p>
    </header>
  );
};
