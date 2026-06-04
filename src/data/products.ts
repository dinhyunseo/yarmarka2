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
    id: 4,
    title: 'Деревянная шкатулка "Классика"',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop',
    category: 'home',
    author: 'Александр Громов',
    description: 'Специализируюсь на создании изящных аксессуаров из ценных пород дерева ручной работы. Каждое изделие бережно отшлифовано и покрыто натуральным воском.',
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
    title: 'Набор чашек "Лесная прохлада"',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
    category: 'ceramics',
    author: 'Елена Светлова',
    description: 'Керамический набор чашек ручной работы. Использую только экологичные глазури и высокотемпературный обжиг для безопасности и прочности.',
    isNew: true
  },
  {
    id: 8,
    title: 'Кожаная сумка "Охотник"',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    category: 'leather',
    author: 'Александр Громов',
    description: 'Вместительная кожаная сумка ручной работы через плечо. Изготовлена из натуральной кожи растительного дубления нашими лучшими мастерами.',
    isPopular: true
  },
  {
    id: 9,
    title: 'Глиняная ваза "Мраморный берег"',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
    category: 'ceramics',
    author: 'Елена Светлова',
    description: 'Керамическая ваза с интересной мраморной текстурой и плавными глянцевыми линиями. Добавит изысканности вашему интерьеру.',
    isNew: true
  },
  {
    id: 10,
    title: 'Вышитая скатерть "Полевые узоры"',
    price: 4900,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop',
    category: 'home',
    author: 'Анна Веснецова',
    description: 'Уютная льняная скатерть с ручной вышивкой крестиком из качественных нитей мулине французского производства.',
    isNew: true
  },
  {
    id: 11,
    title: 'Кованый подсвечник "Сияние"',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1544078751-58fed2b84d57?w=400&h=400&fit=crop',
    category: 'blacksmith',
    author: 'Илья Хрусталев',
    description: 'Изящный металлический подсвечник, изготовленный методом художественной ковки. Играет яркими бликами пламени свечи в интерьере.',
    isPopular: true
  },
  {
    id: 12,
    title: 'Плюшевый мишка "Черри"',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=400&h=400&fit=crop',
    category: 'toys',
    author: 'Анна Веснецова',
    description: 'Очаровательный мишка ручной вязки из ультрамягкой гипоаллергенной пряжи. Отличный подарок для детей и взрослых.',
    isNew: true
  }
];
