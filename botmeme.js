const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const token = '6156581458:AAFMtGDCCCbvwmZlYLGdNtZx6-Wdr743IqI';

const bot = new TelegramBot(token, { polling: true });

const imagesDirectory = 'images'; // Директория с изображениями
const start = async () => {

    bot.setMyCommands([
      {command: '/meme', description: 'Рандомный мем'},
  ])
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(msg.chat.id, 'Hello, I`m a meme bot. I can send you the best random meme of the day. To do this, just write /meme');
  });
  
  // Запуск планировщика задач cron
  cron.schedule('0 12-20 * * *', () => {
    sendDailyMessage();
  });
  


// Обработчик команды /meme
bot.onText(/\/meme/, (msg) => {
  sendRandomMeme(msg.chat.id);
});


  function sendDailyMessage() {
    const chatId = chatId;
    const message = 'New memes have arrived! Do you wanna take a look? Just write /meme';
  
    // Отправка сообщения
    bot.sendMessage(chatId, message);
  }

// Отправка рандомного мема
function sendRandomMeme(chatId) {
  // Получение всех файлов в директории с изображениями
  const imageFiles = fs.readdirSync(imagesDirectory);
  
  // Выбор рандомного файла
  const randomFile = getRandomElement(imageFiles);
  
  // Путь к выбранному файлу
  const filePath = path.join(imagesDirectory, randomFile);
  
  // Отправка изображения в чат
  bot.sendPhoto(chatId, filePath)
    .catch(error => {
      console.error('Ошибка при отправке изображения:', error);
    });
}

// Получение рандомного элемента из массива
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}}

start();


function runScriptEveryFiveMinutes(scriptPath) {
    const interval = 12 * 60 * 60 * 1000; // интервал
  
    function runScript() {
      const { exec } = require('child_process');
  
      exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Ошибка выполнения скрипта:`, error);
        } else {
          console.log(`Скрипт успешно выполнен.`);
        }
      });
    }
  
    // Запускаем скрипт сразу при вызове функции
    runScript();
  
    // Запускаем скрипт каждые 5 минут
    setInterval(runScript, interval);
  }
  
  // Указываем путь к скрипту, который нужно запускать
  const scriptPath = 'startAllGetMeme.js';
  
  // Вызываем функцию для запуска скрипта каждые 5 минут
  runScriptEveryFiveMinutes(scriptPath);
  