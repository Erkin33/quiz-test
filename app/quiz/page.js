'use client';
import "../globals.css";
import React, { useState } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MyStyledQuiz() {
  // Массив шагов квиза с подсказками для каждого шага
  const steps = [
    {
      id: 1,
      type: 'date',
      question: 'Когда планируете поездку?',
      key: 'travelDate',
      hint: 'Выберите примерно в диапазоне дат',
    },
    {
      id: 2,
      type: 'radio',
      question: 'Сколько ночей планируете отдыхать?',
      key: 'nights',
      options: ['до 5 ночей', '6-9 ночей', '9-13 ночей', '14+ ночей', 'Другое…'],
      hint: 'Выберите ваш ответ',
    },
    {
      id: 3,
      type: 'radio',
      question: 'Сколько взрослых едет?',
      key: 'adults',
      options: ['1', '2', '3', '4+', 'Другое…'],
      hint: 'Укажите число взрослых',
    },
    {
      id: 4,
      type: 'radio',
      question: 'Сколько детей едет?',
      key: 'children',
      options: ['0', '1', '2', '3+', 'Другое…'],
      hint: 'Укажите число детей, если есть',
    },
    {
      id: 5,
      type: 'contact',
      question: 'Заполните форму и получите подборку лучших туров',
      hint: 'Укажите телефон и имя, чтобы мы могли связаться с вами',
    },
    {
      id: 6,
      type: 'final',
      question: 'Спасибо!',
    },
  ];

  // Состояние формы
  const [formData, setFormData] = useState({
    travelDate: null,
    nights: '',
    nightsOther: '',
    adults: '',
    adultsOther: '',
    children: '',
    childrenOther: '',
    phone: '',
    name: '',
    agreement: true, // галочка по умолчанию
  });

  const [currentStep, setCurrentStep] = useState(0);
  const progress = Math.round((currentStep / (steps.length - 1)) * 100);
  const current = steps[currentStep];

  // Переход на следующий шаг (проверка для шага contact)
  const goNext = () => {
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
      setCurrentStep(prev => prev + 1);
    }
  };

  // Переход назад
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Обработка выбора радио-вопроса
  const handleRadioSelect = (stepKey, option) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: option === 'Другое…' ? 'other' : option,
    }));
    setCurrentStep(prev => prev + 1);
  };

  // Обработка изменений текстовых полей
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Обработка выбора даты: сохраняем дату и переходим дальше
  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, travelDate: date }));
    setCurrentStep(prev => prev + 1);
  };

  // Финальная отправка
  const handleSubmit = () => {
    alert('Данные отправлены:\n' + JSON.stringify(formData, null, 2));
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 overflow-hidden">
      {/* Контейнер квиза адаптивный: для мобильных max-w-lg, для md и выше – max-w-3xl; высота авто для мобильных, фиксированная для десктопа */}
      <div className="w-full max-w-lg md:max-w-3xl h-auto md:h-[80vh] bg-white rounded-lg shadow-lg p-4 md:p-8 relative flex flex-col justify-center overflow-hidden">
        {/* Прогресс-бар с процентами рядом */}
        <div className="absolute bottom-0 left-0 w-full flex items-center p-2">
          <div className="flex-grow progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="ml-2 text-xs text-gray-600">{progress}%</span>
        </div>

        {/* Шапка с аватаркой, зелёным кружком и подсказкой */}
        {current.type !== 'final' && (
          <div className="flex flex-col md:flex-row items-start mb-6">
            <div className="relative mr-0 md:mr-4 mb-2 md:mb-0">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image src="/avatar.png" alt="Avatar" width={64} height={64} />
              </div>
              {/* Зеленый кружок (индикатор онлайн) */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg">Екатерина</p>
              <p className="text-sm text-gray-500">Посетила 45 стран</p>
              {current.hint && (
                <p className="text-sm text-blue-600 mt-1">{current.hint}</p>
              )}
            </div>
          </div>
        )}

        {/* Заголовок вопроса (если не финальный шаг) */}
        {current.type !== 'final' && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">
            {current.question}
          </h2>
        )}

        {/* Шаг: inline-календарь */}
        {current.type === 'date' && (
          <div className="flex justify-center">
            <DatePicker
              inline
              selected={formData.travelDate}
              onChange={handleDateSelect}
              minDate={new Date()}
            />
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
              <button className="button-flare" onClick={goNext}>
                Далее
                <span className="flare"></span>
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
              <button className="button-flare" onClick={handleSubmit}>
                Получить результаты
                <span className="flare"></span>
              </button>
            </div>
          </div>
        )}

        {/* Финальный шаг */}
        {current.type === 'final' && (
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Спасибо! 👏
            </h2>
            <p className="mb-6 text-gray-600 text-lg">
              Мы отправим вам результаты в течение 15 минут.
            </p>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <button
                className="button-flare"
                onClick={() =>
                  (window.location.href = 'https://travel.tomsk.ru/')
                }
              >
                Посетите наш сайт
                <span className="flare"></span>
              </button>
              <p className="text-gray-500 text-sm">
                Или посетите наши соцсети:
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://vk.com/pegas_tomsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300 text-gray-700"
                >
                  VK
                </a>
                <a
                  href="https://t.me/pegas_tomsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300 text-gray-700"
                >
                  Telegram
                </a>
                <a
                  href="https://ok.ru/group/70000007329147"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300 text-gray-700"
                >
                  OK
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка "Назад" (не показывается на финальном шаге) */}
        {currentStep > 0 && current.type !== 'final' && (
          <div className="mt-4">
            <button className="text-blue-500 hover:underline" onClick={goBack}>
              Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
