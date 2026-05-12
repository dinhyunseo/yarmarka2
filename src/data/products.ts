import { type Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Колье ручной работы',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    category: 'jewelry',
    author: 'Дмитрий Ковалев',
    description: 'Уникальное колье, выполненное в технике филиграни из натуральных камней. Каждое изделие неповторимо и несет в себе тепло рук мастера.',
    isPopular: true
  },
  {
    id: 2,
    title: 'Вязаный свитер',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
    category: 'clothing',
    author: 'Мария Иванова',
    description: 'Теплый и уютный свитер из натуральной мериносовой шерсти. Идеально подойдет для холодных зимних вечеров.',
    isNew: true
  },
  {
    id: 3,
    title: 'Декоративная ваза "Океан"',
    price: 5800,
    image: 'https://images.unsplash.com/photo-1612196808214-b9e1d614e380?w=400&h=400&fit=crop',
    category: 'ceramics',
    author: 'Елена Светлова',
    description: 'Керамическая ваза ручной работы, покрытая матовой глазурью. Моя керамика — это сочетание природных форм и современного минимализма.',
    isPopular: true
  },
  {
    id: 4,
    title: 'Кошелек "Классика"',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    category: 'leather',
    author: 'Александр Громов',
    description: 'Спецализируюсь на создании долговечных аксессуаров из кожи растительного дубления. Каждое изделие прошивается вручную седельным швом.',
    isNew: true
  },
  {
    id: 5,
    title: 'Кольцо "Дыхание"',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    category: 'jewelry',
    author: 'Дмитрий Ковалев',
    description: 'Работаю в технике филиграни и горячей эмали. Создаю украшения, которые становятся семейными реликвиями.',
    isPopular: true
  },
  {
    id: 6,
    title: 'Набор чашек "Лес"',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
    category: 'ceramics',
    author: 'Елена Светлова',
    description: 'Использую только экологичные глазури и высокотемпературный обжиг для безопасности и прочности.',
    isNew: true
  },
  {
    id: 7,
    title: 'Ремень ручной работы',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop',
    category: 'leather',
    author: 'Александр Громов',
    description: 'Прочный кожаный ремень из итальянской кожи. Прослужит долгие годы, приобретая благородную патину.'
  },
  {
    id: 8,
    title: 'Сумка "Охотник"',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    category: 'leather',
    author: 'Александр Громов',
    description: 'Вместительная кожаная сумка через плечо. Идеально подходит для ежедневного использования.',
    isPopular: true
  },
  {
    id: 9,
    title: 'Панно "Мраморный берег"',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
    category: 'ceramics',
    author: 'Елена Светлова',
    description: 'Интересная текстура и плавные линии. Добавит изысканности вашему столу.',
    isNew: true
  }
];
