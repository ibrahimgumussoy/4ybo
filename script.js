// Hava Durumu API'si için URL ve API anahtarı
const weatherApiKey = 'dfd8f478d290592bbf1d5eade1a87a92'; // OpenWeatherMap API anahtarı
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'; // OpenWeatherMap hava durumu API'sinin URL'si

// Futbol API'si için URL ve API anahtarı
const footballApiKey = '3mCdRQjhoXtRx8WK'; // Futbol API'si anahtarı
const footballApiUrl = 'https://livescore-api.com/api-client/fixtures/matches.json'; // API URL'si

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

const targetUrl = 'https://livescore-api.com/api-client/fixtures/matches.json?competition_id=1&key=3mCdRQjhoXtRx8WK';
fetch(proxyUrl + targetUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Veri alınamadı:', error);
  });

  
// Enter tuşu ile hava durumu arama
document.getElementById('cityName').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getWeather(); // Enter tuşuna basıldığında getWeather fonksiyonunu çağır
        this.value = '';
    }
});

// Butona tıklama ile hava durumu arama
document.getElementById('getWeather').addEventListener('click', getWeather); // Butona tıklama ile getWeather fonksiyonunu çağır

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

                    let weatherHtml = `
                        <h3>${data.name}, ${data.sys.country}</h3>
                        <p>${temperature}°C, ${description}</p>
                        <img src="${icon}" alt="Weather Icon">
                        <p>Nem: ${humidity}%</p>
                        <p>Rüzgar Hızı: ${windSpeed} m/s</p>
                    `;

                    weatherInfoDiv.innerHTML = weatherHtml; // Hava durumu bilgisini ekrana yazdır
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

// Hava durumu bilgisini getiren asenkron fonksiyon
async function getWeather() {
    const cityName = document.getElementById('cityName').value.trim(); // Şehir adını al
    const weatherInfoDiv = document.getElementById('weatherInfo'); // Hava durumu bilgilerini göstereceğimiz div

    if (!cityName) {
        weatherInfoDiv.innerHTML = "<p>Lütfen bir şehir adı girin.</p>"; // Şehir adı girilmemişse kullanıcıya uyarı mesajı göster
        return;
    }

    weatherInfoDiv.innerHTML = "<p>Yükleniyor...</p>"; // Veri yükleniyor mesajı göster

    try {
        // Hava durumu API'sinden veri al
        const response = await fetch(`${weatherApiUrl}?q=${cityName}&appid=${weatherApiKey}&units=metric&lang=tr`);
        
        if (!response.ok) {
            // Eğer 404 hatası ise şehir bulunamadı mesajı göster
            if (response.status === 404) {
                weatherInfoDiv.innerHTML = `<p>Şehir bulunamadı. Lütfen farklı bir şehir adı girin.</p>`;
            } else {
                // Diğer HTTP hataları için genel hata mesajı göster
                throw new Error(`HTTP hata: ${response.status}`);
            }
            return;
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
        } else {
            weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`; // Hava durumu bilgisi alınamadıysa kullanıcıya uyarı mesajı göster
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`; // Hata durumunda kullanıcıya uyarı mesajı göster
    }
}


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
        } else {
            weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`; // Hava durumu bilgisi alınamadıysa kullanıcıya uyarı mesajı göster
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`; // Hata durumunda kullanıcıya uyarı mesajı göster
    }
}


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

// Kenar çubuğunu açıp kapatan işlevi
document.querySelector('.logo img').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open'); // Kenar çubuğunu açıp kapat
});

// Kenar çubuğunu kapatmak için 'closeSidebar' butonuna işlev ekleme
document.getElementById('closeSidebar').addEventListener('click', function() {
    document.getElementById('sidebar').classList.remove('open'); // Kenar çubuğunu kapat
});

// Enter tuşu ile takım adı arama
document.getElementById('fixtureQuery').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getFixture(); // Enter tuşuna basıldığında getFixture fonksiyonunu çağır
    }
});

// Butona tıklama ile takım adı arama
document.getElementById('showFixture').addEventListener('click', getFixture); // Butona tıklama ile getFixture fonksiyonunu çağır

// Maç fikstürü bilgilerini getiren fonksiyon
async function getFixture() {
    const fixtureQuery = document.getElementById('fixtureQuery').value.trim(); // Takım adını al
    const aiResponseDiv = document.getElementById('aiResponse'); // Maç fikstürü bilgilerini göstereceğimiz div

    if (!fixtureQuery) {
        aiResponseDiv.innerHTML = "<p>Lütfen bir takım adı girin.</p>"; // Takım adı girilmemişse kullanıcıya uyarı mesajı göster
        return;
    }

    aiResponseDiv.innerHTML = "<p>Yükleniyor...</p>"; // Veri yükleniyor mesajı göster

    // Proxy URL'sini ve API URL'sini birleştirin
    const competitionIds = [2, 6, 347]; // İhtiyacınıza göre competition_id değerleri
    const promises = competitionIds.map(id => {
        const apiUrl = `${footballApiUrl}?competition_id=${id}&key=${footballApiKey}&secret=MMBgfMRm2x8n4RW8dyl5pFnNCRE9ZBUL`;
        const fullUrl = `${proxyUrl}${encodeURIComponent(apiUrl)}`; // Proxy URL'sini API URL'si ile birleştirin
        return fetch(fullUrl) // Proxy üzerinden API'yi çağır
            .then(response => {
                if (!response.ok) {
                    console.warn(`Proxy ile hata alındı: ${response.status}. Doğrudan API'yi deniyorum...`);
                    return fetch(apiUrl); // Proxy hatası durumunda doğrudan API'yi çağır
                }
                return response;
            })
            .then(response => response.json()) // JSON verisini al
            .catch(error => {
                console.error(`API hatası: ${error.message}`); // Hata mesajını konsola yazdır
                return { data: { fixtures: [] } }; // Hata durumunda boş bir veri döndür
            });
    });

    try {
        const results = await Promise.all(promises); // Tüm API çağrılarını bekle
        let allFixtures = [];

        results.forEach(result => {
            if (result && result.data && result.data.fixtures) {
                allFixtures = allFixtures.concat(result.data.fixtures); // Tüm maç fikstürlerini birleştir
            }
        });

        console.log(allFixtures); // API yanıtını konsola yazdır

        if (allFixtures.length > 0) {
            let fixtureHtml = '<h3>Maç Fikstürü</h3><ul>';

            // Girilen takım adıyla eşleşen maçları filtrele
            const filteredMatches = allFixtures.filter(match =>
                match.home_name.toLowerCase().includes(fixtureQuery.toLowerCase()) ||
                match.away_name.toLowerCase().includes(fixtureQuery.toLowerCase()));

            if (filteredMatches.length > 0) {
                filteredMatches.forEach(match => {
                    const homeTeam = match.home_name;
                    const awayTeam = match.away_name;
                    const matchDate = new Date(match.date).toLocaleString(); // Maç tarihini formatla
                    fixtureHtml += `<li>${matchDate}: ${homeTeam} vs ${awayTeam}</li>`;
                });
                fixtureHtml += '</ul>';
            } else {
                fixtureHtml = `<p>Belirtilen takıma ait maç bulunamadı.</p>`; // Maç bulunamadıysa kullanıcıya uyarı mesajı göster
            }

            aiResponseDiv.innerHTML = fixtureHtml; // Maç fikstürü bilgisini ekrana yazdır
        } else {
            aiResponseDiv.innerHTML = `<p>Fikstür verisi bulunamadı. Lütfen farklı bir takım adı girin.</p>`; // Fikstür verisi bulunamadıysa kullanıcıya uyarı mesajı göster
        }
    } catch (error) {
        aiResponseDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`; // Hata durumunda kullanıcıya uyarı mesajı göster
    }
}


            



// Döviz API'si için URL ve API anahtarı
const currencyApiUrl = 'https://v6.exchangerate-api.com/v6/c108945397e7b15f38b9c9b8/latest/TRY'; // Türk Lirası (TRY) cinsinden döviz API'sinin URL'si

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













  // Haritayı başlat
const map = L.map('map').setView([39.9334, 32.8597], 6); // Başlangıç konumu Türkiye merkezli (Ankara)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let marker; // Marker değişkenini tanımlayın

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

            weatherInfoDiv.innerHTML = weatherHtml;

            // Koordinatları harita üzerinde göster
            const latitude = data.coord.lat;
            const longitude = data.coord.lon;

            // Eğer mevcut bir marker varsa, onu kaldırın
            if (marker) {
                map.removeLayer(marker);
            }

            // Yeni marker ekleyin
            marker = L.marker([latitude, longitude]).addTo(map);
            map.setView([latitude, longitude], 10); // Haritayı şehrin koordinatlarına yakınlaştır
        } else {
            weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`;
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var map = document.getElementById('map');
    var mapButton = document.getElementById('mapButton');

    mapButton.addEventListener('click', function() {
        if (map.style.display === 'none') {
            map.style.display = 'block'; // Haritayı göster
            // Haritayı başlatmak için gerekli kodları buraya ekleyin
        } else {
            map.style.display = 'none'; // Haritayı gizle
        }
    });

    // Haritayı başlatma kodu burada yer alabilir
});


// Şehir adı ile harita üzerinde konumu gösteren fonksiyon
async function showCityOnMap(cityName) {
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
            const latitude = data.coord.lat;
            const longitude = data.coord.lon;

            // Eğer mevcut bir marker varsa, onu kaldırın
            if (marker) {
                map.removeLayer(marker);
            }

            // Yeni marker ekleyin
            marker = L.marker([latitude, longitude]).addTo(map);
            map.setView([latitude, longitude], 10); // Haritayı şehrin koordinatlarına yakınlaştır

            // Koordinatlarla hava durumu bilgisini getirin
            fetchWeatherByCoordinates(latitude, longitude);
        } else {
            weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`;
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`;
    }
}

// Butona tıklama ile şehir adı arama
document.getElementById('getWeather').addEventListener('click', function() {
    const cityName = document.getElementById('cityName').value.trim();
    showCityOnMap(cityName);
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
        } else {
            weatherInfoDiv.innerHTML = `<p>Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.</p>`; // Hava durumu bilgisi alınamadıysa kullanıcıya uyarı mesajı göster
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p>Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.</p>`; // Hata durumunda kullanıcıya uyarı mesajı göster
    }
}

// Harita üzerinde tıklama olayını dinle
map.on('click', function(e) {
    const lat = e.latlng.lat; // Tıklanan yerin enlem koordinatı
    const lon = e.latlng.lng; // Tıklanan yerin boylam koordinatı

    fetchWeatherByCoordinates(lat, lon); // Hava durumu bilgilerini koordinatlara göre al
});
