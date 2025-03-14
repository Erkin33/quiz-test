'use client';
import "../globals.css";
import React, { useState } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function MyStyledQuiz() {
  // Массив шагов квиза
  const steps = [
    {
      id: 1,
      type: 'date',
      question: 'Когда планируете поездку?',
      key: 'travelDate',
    },
    {
      id: 2,
      type: 'radio',
      question: 'Сколько ночей планируете отдыхать?',
      key: 'nights',
      options: ['до 5 ночей', '6-9 ночей', '9-13 ночей', '14+ ночей', 'Другое…'],
    },
    {
      id: 3,
      type: 'radio',
      question: 'Сколько взрослых едет?',
      key: 'adults',
      options: ['1', '2', '3', '4+', 'Другое…'],
    },
    {
      id: 4,
      type: 'radio',
      question: 'Сколько детей едет?',
      key: 'children',
      options: ['0', '1', '2', '3+', 'Другое…'],
    },
    {
      id: 5,
      type: 'contact',
      question: 'Заполните форму и получите подборку лучших туров',
    },
    {
      id: 6,
      type: 'final',
      question: 'Спасибо!',
    },
  ];

  // Данные формы
  const [formData, setFormData] = useState({
    travelDate: '',
    nights: '',
    nightsOther: '',
    adults: '',
    adultsOther: '',
    children: '',
    childrenOther: '',
    phone: '',
    name: '',
    agreement: false,
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Вычисляем прогресс (0..100)
  const progress = Math.round((currentStep / (steps.length - 1)) * 100);

  // Функция перехода на следующий шаг (с валидацией для не-радио вопросов)
  const goNext = () => {
    const current = steps[currentStep];
    if (current.type === 'date' && !formData.travelDate) {
      alert('Пожалуйста, выберите дату');
      return;
    }
    if (current.type === 'contact') {
      if (!formData.phone) {
        alert('Пожалуйста, введите номер телефона');
        return;
      }
      if (!formData.name) {
        alert('Пожалуйста, введите имя');
        return;
      }
      if (!formData.agreement) {
        alert('Согласитесь с политикой конфиденциальности');
        return;
      }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Переход назад
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Обработка выбора радио-ответа – сразу переходим на следующий шаг
  const handleRadioSelect = (stepKey, option) => {
    if (option === 'Другое…') {
      setFormData((prev) => ({ ...prev, [stepKey]: 'other' }));
    } else {
      setFormData((prev) => ({ ...prev, [stepKey]: option }));
    }
    // Переход сразу, без вызова goNext (чтобы избежать проблемы с асинхронностью state)
    setCurrentStep((prev) => prev + 1);
  };

  // Обработчик для инпутов (дата, текст)
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Финальная отправка (здесь можно добавить отправку в CRM)
  const handleSubmit = () => {
    alert('Данные отправлены:\n' + JSON.stringify(formData, null, 2));
    setCurrentStep((prev) => prev + 1);
  };

  const current = steps[currentStep];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Увеличенный и центрированный контейнер квиза */}
      <div className="w-full max-w-3xl h-[80vh] bg-white rounded-lg shadow-lg p-8 relative flex flex-col justify-center">
        {/* Прогресс-бар "змейка" */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gray-200 rounded-b overflow-hidden">
          <div className="h-4 snake-progress" style={{ width: `${progress}%` }}></div>
        </div>
        {/* Процент в правом верхнем углу */}
        <div className="absolute top-4 right-4 text-gray-600 text-sm">
          {progress}%
        </div>

        {/* Блок с аватаром консультанта (не отображается на финальном шаге) */}
        {current.type !== 'final' && (
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <Image src="/avatar.png" alt="Avatar" width={64} height={64} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg">Екатерина</p>
              <p className="text-sm text-gray-500">Посетила 45 стран</p>
            </div>
          </div>
        )}

        {/* Заголовок/вопрос */}
        {current.type !== 'final' && (
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            {current.question}
          </h2>
        )}

        {/* Шаг: выбор даты */}
        {current.type === 'date' && (
          <div>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.travelDate}
              onChange={(e) => handleChange('travelDate', e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
                onClick={goNext}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Шаг: радио-вопросы */}
        {current.type === 'radio' && (
          <div>
            {current.options.map((option, idx) => (
              <label
                key={idx}
                className="flex items-center mb-4 border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  className="mr-3"
                  name={current.key}
                  checked={
                    formData[current.key] === option ||
                    (option === 'Другое…' && formData[current.key] === 'other')
                  }
                  onChange={() => handleRadioSelect(current.key, option)}
                />
                <span className="text-lg">{option}</span>
              </label>
            ))}
            {/* Если выбрано "Другое…" показываем текстовое поле */}
            {formData[current.key] === 'other' && (
              <input
                type="text"
                placeholder="Уточните..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[`${current.key}Other`] || ''}
                onChange={(e) => handleChange(`${current.key}Other`, e.target.value)}
              />
            )}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
                onClick={goNext}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Шаг: контактные данные */}
        {current.type === 'contact' && (
          <div>
            <p className="text-gray-600 text-lg mb-6">
              Изучив ваши критерии, мы отправим вам подборку лучших туров в течение часа!
            </p>
            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-2">Телефон</label>
              <PhoneInput
                country={'ru'}
                value={formData.phone}
                inputStyle={{
                  width: '100%',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  padding: '0.75rem',
                  fontSize: '1rem',
                }}
                onChange={(phone) => handleChange('phone', phone)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-2">Ваше имя</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="mb-6 flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={formData.agreement}
                onChange={(e) => handleChange('agreement', e.target.checked)}
              />
              <label className="text-sm text-gray-600">
                Согласен на обработку персональных данных
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition"
                onClick={handleSubmit}
              >
                Получить результаты
              </button>
            </div>
          </div>
        )}

        {/* Финальный шаг */}
        {current.type === 'final' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Спасибо! 👏</h2>
            <p className="mb-6 text-gray-600 text-lg">
              Мы отправим вам результаты в течение 15 минут.
            </p>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                onClick={() => alert('Перейдите на сайт или соцсети')}
              >
                Завершить
              </button>
              <p className="text-gray-500 text-sm">
                Или посетите наш сайт / соцсети:
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://vk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300 text-gray-700"
                >
                  VK
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300 text-gray-700"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка "Назад" */}
        {currentStep > 0 && current.type !== 'final' && (
          <div className="mt-6">
            <button className="text-blue-500 hover:underline" onClick={goBack}>
              Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
