'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  // Плавное появление страницы
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden transition-opacity duration-1000 ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Фоновое изображение */}
      <div className="absolute inset-0">
        <img
          src="/images.jfif" // Фоновая картинка из папки public
          alt="Фон"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Пройди наш Quiz тест
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Узнай, какой отдых идеально подходит для тебя!
        </p>
        <Link
          href="/quiz"
          className="bg-blue-500 hover:bg-blue-600 transition transform hover:scale-105 px-6 py-3 rounded-full text-xl font-semibold shadow-lg"
        >
          Начать тест
        </Link>
      </div>
      {/* Нижний колонтитул */}
      <div className="absolute bottom-4 text-sm z-10">
        <p>© 2025 Ваш бренд. Все права защищены.</p>
      </div>
    </main>
  );
}
