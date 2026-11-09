export const weatherDatabase = {
  'Москва': { temp: '+14°', status: 'Солнечно', feelsLike: '+13°', max: '+19°', min: '+11°', isBad: false },
  'Санкт-Петербург': { temp: '+9°', status: 'Дождь', feelsLike: '+7°', max: '+12°', min: '+6°', isBad: true },
  'Казань': { temp: '+18°', status: 'Облачно', feelsLike: '+17°', max: '+22°', min: '+14°', isBad: false },
  'Сочи': { temp: '+26°', status: 'Солнечно', feelsLike: '+28°', max: '+29°', min: '+22°', isBad: false },
  'Екатеринбург': { temp: '+5°', status: 'Дождь', feelsLike: '+3°', max: '+8°', min: '+2°', isBad: true },
  'Новосибирск': { temp: '+2°', status: 'Снег', feelsLike: '0°', max: '+4°', min: '-2°', isBad: true },
  'Краснодар': { temp: '+22°', status: 'Солнечно', feelsLike: '+23°', max: '+26°', min: '+18°', isBad: false },
  'Владивосток': { temp: '+12°', status: 'Ветрено', feelsLike: '+10°', max: '+15°', min: '+9°', isBad: true },
  'Калининград': { temp: '+11°', status: 'Пасмурно', feelsLike: '+9°', max: '+14°', min: '+8°', isBad: true },
  'Грозный': { temp: '+25°', status: 'Ясно', feelsLike: '+26°', max: '+28°', min: '+20°', isBad: false },
  'Нижний Новгород': { temp: '+13°', status: 'Облачно', feelsLike: '+12°', max: '+17°', min: '+10°', isBad: false },
  'Тюмень': { temp: '+6°', status: 'Пасмурно', feelsLike: '+4°', max: '+9°', min: '+3°', isBad: true },
  'default': { temp: '+16°', status: 'Ясно', feelsLike: '+15°', max: '+20°', min: '+12°', isBad: false }
};
// В weatherData.js в самом низу добавьте:
export const convertTemp = (tempString, unit) => {
  if (!tempString) return '';
  const num = parseInt(tempString.replace(/[^-\d]/g, ''));
  
  if (unit === 'C') return tempString;
  
  if (unit === 'F') {
    const f = Math.round((num * 9) / 5 + 32);
    return `${f > 0 ? '+' : ''}${f}°`;
  }
  
  if (unit === 'K') {
    const k = Math.round(num + 273.15);
    return `${k}K`;
  }
  return tempString;
};