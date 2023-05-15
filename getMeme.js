const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://www.reddit.com/r/meme/'; // URL целевого треда Reddit
const imagesDirectory = 'images'; // Директория для сохранения изображений
const numberOfImages = 5; // Количество картинок для сохранения

// Создание директории для сохранения изображений
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const images = [];
    $('img[alt="Post image"]').each((index, element) => {
      const imageUrl = $(element).attr('src');
      if (imageUrl && !imageUrl.startsWith('data:image')) {
        images.push(imageUrl);
      }
    });

    const selectedImages = images.slice(0, numberOfImages);

    selectedImages.forEach((imageUrl, index) => {
      axios({
        method: 'get',
        url: imageUrl,
        responseType: 'stream'
      })
      .then(response => {
        const imageName = `image_${getRandomNumber()}.jpg`; // Имя файла для сохранения изображения
        const imagePath = path.join(imagesDirectory, imageName);
        response.data.pipe(fs.createWriteStream(imagePath));
        console.log('Изображение сохранено:', imageName);
      })
      .catch(error => {
        console.error('Ошибка при загрузке изображения:', error);
      });
    });

    console.log(`Сохранено ${selectedImages.length} изображений.`);
  })
  .catch(error => {
    console.error('Ошибка при выполнении запроса:', error);
  });

  function getRandomNumber() {
    return Math.floor(Math.random() * 1000) + 1;
  }
  