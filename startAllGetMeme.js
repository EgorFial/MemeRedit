const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function deleteAllFilesInDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении содержимого папки:', err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Ошибка при удалении файла ${file}:`, err);
        } else {
          console.log(`Файл ${file} успешно удален.`);
        }
      });
    }
  });
}

// Указываем путь к папке, из которой нужно удалить файлы
const directoryPath = 'images';

// Вызываем функцию для удаления файлов
deleteAllFilesInDirectory(directoryPath);

// Функция для запуска скрипта
function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(`node ${scriptName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка выполнения скрипта ${scriptName}:`, error);
        reject(error);
      } else {
        console.log(`Скрипт ${scriptName} успешно выполнен.`);
        resolve();
      }
    });

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  });
}

// Массив с именами скриптов, которые нужно запустить поочередно
const scripts = ['getHistoryMeme.js', 'getMeme.js', 'getMemeUkraine.js', 'getMemeEconomy.js', 'getMemes.js', 'getMemes_Of_The_Dank.js', 'getWholesomememes.js'];

// Функция для последовательного запуска скриптов
async function runScriptsSequentially() {
  for (const script of scripts) {
    console.log(`Запуск скрипта ${script}...`);
    await runScript(script);
    console.log(`Завершение скрипта ${script}.`);
  }
}

// Запуск скриптов последовательно
runScriptsSequentially()
  .then(() => {
    console.log('Все скрипты успешно выполнены.');
  })
  .catch(error => {
    console.error('Ошибка при выполнении скриптов:', error);
  });
