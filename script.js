// Hava Durumu API'si için URL ve API anahtarı
const weatherApiKey = 'dfd8f478d290592bbf1d5eade1a87a92'; // OpenWeatherMap API anahtarı
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'; // OpenWeatherMap hava durumu API'sinin URL'si

// RSS to JSON servisi URL'si
const rssToJsonUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss?hl=tr&gl=TR&ceid=TR:tr';
const newsList = document.getElementById('newsList');

// Döviz API'si için URL ve API anahtarı
const currencyApiUrl = 'https://v6.exchangerate-api.com/v6/c108945397e7b15f38b9c9b8/latest/TRY'; // Türk Lirası (TRY) cinsinden döviz API'sinin URL'si

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';


// HAVA DURUMU
// Kullanıcının mevcut konumunu tespit eden ve hava durumu bilgilerini gösteren fonksiyon
async function getWeatherByLocation() {
    const weatherInfoDiv = document.getElementById('weatherInfo'); // Hava durumu bilgilerini göstereceğimiz div

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`${weatherApiUrl}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=tr`);
                if (!response.ok) {
                    throw new Error(`HTTP hata: ${response.status}`); // HTTP hatası durumunda hata fırlat
                }
                const data = await response.json(); // JSON verisini al

                if (data.cod === 200) {
                // Hava durumu verilerini işleyip ekranda göster
                    const temperature = data.main.temp;
                    const description = data.weather[0].description;
                    const icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                    const humidity = data.main.humidity;
                    const windSpeed = data.wind.speed;

                // Gün doğumu ve gün batımı saatlerini al
                    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
                    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

                    let weatherHtml = `
                        <h3>${data.name}, ${data.sys.country}</h3>
                        <p>${temperature}°C, ${description}</p>
                        <img src="${icon}" alt="Weather Icon">
                        <p>Nem: ${humidity}%</p>
                        <p>Rüzgar Hızı: ${windSpeed} m/s</p>
                        <p>Gün Doğumu: ${sunrise}</p>
                        <p>Gün Batımı: ${sunset}</p>
                    `;

                    weatherInfoDiv.innerHTML = weatherHtml;


                    // Kullanıcı konumunu haritada göster
                    showUserLocationOnMap(lat, lon);
                } else {
                    weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`; // Hava durumu bilgisi alınamadıysa kullanıcıya uyarı mesajı göster
                }
            } catch (error) {
                weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`; // Hata durumunda kullanıcıya uyarı mesajı göster
            }
        }, function(error) {
            weatherInfoDiv.innerHTML = `<p>Konum bilgisi alınamadı: ${error.message}. Lütfen konum izinlerinizi kontrol edin.</p>`; // Konum bilgisi alınamadıysa kullanıcıya uyarı mesajı göster
        });
    } else {
        weatherInfoDiv.innerHTML = "<p>Tarayıcınız konum bilgisi desteği sunmuyor.</p>"; // Konum desteği yoksa kullanıcıya uyarı mesajı göster
    }
}

// Sayfa yüklendiğinde konum tabanlı hava durumu bilgilerini al
window.addEventListener('load', getWeatherByLocation);

// Haritayı başlat
const map = L.map('map').setView([39.9334, 32.8597], 6); // Başlangıç konumu Türkiye merkezli (Ankara)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let marker; // Marker değişkenini tanımlayın

// Kullanıcı konumunu haritada gösteren fonksiyon
function showUserLocationOnMap(lat, lon) {
    if (marker) {
        map.removeLayer(marker); // Eğer mevcut bir marker varsa, onu kaldırın
    }

    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup("Bu sizin konumunuz.")
        .openPopup();
    map.setView([lat, lon], 10); // Haritayı kullanıcının konumuna odaklayın
}


// Şehir ismi ile hava durumu bilgisini getiren asenkron fonksiyon
async function getWeather() {
    const cityName = document.getElementById('cityName').value.trim(); // Şehir adını al
    const weatherInfoDiv = document.getElementById('weatherInfo'); // Hava durumu bilgilerini göstereceğimiz div

    if (!cityName) {
        weatherInfoDiv.innerHTML = "<p>Lütfen bir şehir adı girin.</p>";
        return;
    }

    weatherInfoDiv.innerHTML = "<p>Yükleniyor...</p>";

    try {
        const response = await fetch(`${weatherApiUrl}?q=${cityName}&appid=${weatherApiKey}&units=metric&lang=tr`);

        if (!response.ok) {
            if (response.status === 404) {
                weatherInfoDiv.innerHTML = `<p>Şehir bulunamadı. Lütfen farklı bir şehir adı girin.</p>`;
            } else {
                throw new Error(`HTTP hata: ${response.status}`);
            }
            return;
        }

        const data = await response.json();

        if (data.cod === 200) {
        // Hava durumu verilerini işleyip ekranda göster
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

        // Gün doğumu ve gün batımı saatlerini al
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            let weatherHtml = `
                <h3>${data.name}, ${data.sys.country}</h3>
                <p>${temperature}°C, ${description}</p>
                <img src="${icon}" alt="Weather Icon">
                <p>Nem: ${humidity}%</p>
                <p>Rüzgar Hızı: ${windSpeed} m/s</p>
                <p>Gün Doğumu: ${sunrise}</p>
                <p>Gün Batımı: ${sunset}</p>
            `;

            weatherInfoDiv.innerHTML = weatherHtml;

            // Koordinatları harita üzerinde göster
            const latitude = data.coord.lat;
            const longitude = data.coord.lon;

            if (marker) {
                map.removeLayer(marker); // Eğer mevcut bir marker varsa, onu kaldırın
            }

            marker = L.marker([latitude, longitude]).addTo(map);
            map.setView([latitude, longitude], 10); // Haritayı şehrin koordinatlarına yakınlaştır
        } else {
            weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`;
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`;
    }
}

// Enter tuşu ile hava durumu arama
document.getElementById('cityName').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getWeather(); // Enter tuşuna basıldığında getWeather fonksiyonunu çağır
        this.value = '';
    }
});

// Butona tıklama ile hava durumu arama
document.getElementById('getWeather').addEventListener('click', getWeather); // Butona tıklama ile getWeather fonksiyonunu çağır

// Harita üzerinde tıklama olayını dinle
map.on('click', function(e) {
    const lat = e.latlng.lat; // Tıklanan yerin enlem koordinatı
    const lon = e.latlng.lng; // Tıklanan yerin boylam koordinatı

    fetchWeatherByCoordinates(lat, lon); // Hava durumu bilgilerini koordinatlara göre al
});

// Koordinatlarla hava durumu bilgilerini getiren fonksiyon
async function fetchWeatherByCoordinates(latitude, longitude) {
    const weatherInfoDiv = document.getElementById('weatherInfo'); // Hava durumu bilgilerini göstereceğimiz div

    try {
        const response = await fetch(`${weatherApiUrl}?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric&lang=tr`);
        
        if (!response.ok) {
            throw new Error(`HTTP hata: ${response.status}`); // Diğer HTTP hataları için genel hata mesajı
        }
        
        const data = await response.json(); // JSON verisini al

        if (data.cod === 200) {
            // Hava durumu verilerini işleyip ekranda göster
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            let weatherHtml = `
                <h3>${data.name}, ${data.sys.country}</h3>
                <p>${temperature}°C, ${description}</p>
                <img src="${icon}" alt="Weather Icon">
                <p>Nem: ${humidity}%</p>
                <p>Rüzgar Hızı: ${windSpeed} m/s</p>
            `;

            weatherInfoDiv.innerHTML = weatherHtml; // Hava durumu bilgisini ekrana yazdır

            if (marker) {
                map.removeLayer(marker); // Eğer mevcut bir marker varsa, onu kaldırın
            }

            marker = L.marker([latitude, longitude]).addTo(map);
            map.setView([latitude, longitude], 10); // Haritayı tıklanan noktaya odaklayın
        } else {
            weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`;
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`;
    }
}


// YOUTUBE OKU
document.getElementById('toggleVideo').addEventListener('click', function() {
    const videoContainer = document.getElementById('youtube-container');
    if (videoContainer.classList.contains('show')) {
        videoContainer.classList.remove('show');
        videoContainer.classList.add('hide');
        this.innerHTML = '&#x25C0;'; // Ok butonunu sağa dönüş olarak değiştir
    } else {
        videoContainer.classList.remove('hide');
        videoContainer.classList.add('show');
        this.innerHTML = '&#x25B6;'; // Ok butonunu sola dönüş olarak değiştir
    }
})



document.getElementById('toggleSidebar').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var toggleBtn = document.getElementById('toggleSidebar');

    sidebar.classList.toggle('open');
    toggleBtn.classList.toggle('shifted');
    
    // Buton içeriğini değiştir
    toggleBtn.innerHTML = sidebar.classList.contains('open') ? '&#x25C0;' : '&#x25B6;';
});

document.getElementById('closeSidebar').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var toggleBtn = document.getElementById('toggleSidebar');

    sidebar.classList.remove('open');
    toggleBtn.classList.remove('shifted');
    
    toggleBtn.innerHTML = '&#x25B6;';
});


// HABER
// Haber bilgilerini getiren asenkron fonksiyon
async function fetchNews() {
    try {
        const response = await fetch(rssToJsonUrl);
        const data = await response.json();
        
        // Haberleri çekme
        const items = data.items;
        let newsHtml = '';

        items.forEach((item, index) => {
            if (index < 4) { // İlk 4 haberi al
                const title = item.title;
                const link = item.link;
                const description = item.description;
                
                newsHtml += `
                    <li>
                        <a href="${link}" target="_blank">${title}</a>
                        <p>${description}</p>
                    </li>
                `;
            }
        });

        newsList.innerHTML = newsHtml;
    } catch (error) {
        newsList.innerHTML = `<li><p>Haberler alınamadı. Lütfen tekrar deneyin.</p></li>`;
        console.error('Hata:', error); // Hata ayıklama için
    }
}

// Sayfa yüklendiğinde haberleri al
window.addEventListener('load', fetchNews);




// DÖVİZ
// Döviz bilgilerini getiren asenkron fonksiyon
async function getRates() {
    const currencyInfoDiv = document.getElementById('currency-info');

    currencyInfoDiv.innerHTML = "<p>Yükleniyor...</p>";

    try {
        const currencyResponse = await fetch(currencyApiUrl);
        if (!currencyResponse.ok) {
            throw new Error(`HTTP hata: ${currencyResponse.status}`);
        }
        const currencyData = await currencyResponse.json();

        if (currencyData.result === 'success') {
            const rates = currencyData.conversion_rates;
            const euroRate = 1 / rates.EUR; // Oranı ters çevirerek 1 Euro'nun TL karşılığını bul
            const usdRate = 1 / rates.USD;

            let currencyHtml = '<div class="currency-rates">';
            currencyHtml += `<div><strong>1 Euro:</strong> ${euroRate.toFixed(2)} TL</div>`;
            currencyHtml += `<div><strong>1 Dolar:</strong> ${usdRate.toFixed(2)} TL</div>`;
            currencyHtml += '</div>';

            currencyInfoDiv.innerHTML = currencyHtml;
        } else {
            // ...
        }
    } catch (error) {
        // ...
    }
}

// Sayfa yüklendiğinde döviz kurlarını al
window.addEventListener('load', getRates);
