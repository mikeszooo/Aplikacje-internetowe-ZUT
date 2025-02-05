document.getElementById("getWeather").addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();
    if (!city) {
        alert("Proszę wpisać nazwę miasta!");
        return;
    }

    const apiKey = "aa5d97d9f0384577ae2cb5e405ce3ac2"; // Zastąp swoim kluczem API z OpenWeather

    // Pobieranie pogody bieżącej (XMLHttpRequest)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pl&appid=${apiKey}`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", currentWeatherUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const currentWeather = JSON.parse(xhr.responseText);
            console.log("Otrzymana odpowiedź (bieżąca pogoda):", currentWeather);
            displayCurrentWeather(currentWeather);
        } else {
            showError("Nie udało się pobrać bieżącej pogody.");
        }
    };
    xhr.onerror = () => showError("Błąd sieci przy pobieraniu bieżącej pogody.");
    xhr.send();

    // Pobieranie prognozy pogody (Fetch API)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pl&appid=${apiKey}`;
    fetch(forecastUrl)
        .then((response) => {
            if (!response.ok) throw new Error("Nie udało się pobrać prognozy pogody.");
            return response.json();
        })
        .then((forecastData) => {
            console.log("Otrzymana odpowiedź (prognoza pogody):", forecastData);
            displayForecast(forecastData);
        })
        .catch((error) => {
            console.error("Błąd Fetch API:", error.message);
            showError(error.message);
        });
});

function displayCurrentWeather(data) {
    const resultsDiv = document.getElementById("results");
    const html = `
        <h2>Bieżąca pogoda w ${data.name}</h2>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Warunki: ${data.weather[0].description}</p>
        <p>Wiatr: ${data.wind.speed} m/s</p>
    `;
    resultsDiv.innerHTML = html;
}

function displayForecast(data) {
    const resultsDiv = document.getElementById("results");
    let groupedForecast = {};

    // Grupowanie prognoz według daty
    data.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const day = date.toLocaleDateString("pl-PL", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        if (!groupedForecast[day]) {
            groupedForecast[day] = [];
        }
        groupedForecast[day].push(entry);
    });

    // Generowanie HTML
    let html = "<h2>Prognoza pogody</h2>";
    for (const day in groupedForecast) {
        html += `<h3>${day}</h3><ul>`;
        groupedForecast[day].forEach((entry) => {
            const time = new Date(entry.dt * 1000).toLocaleTimeString("pl-PL", { hour: '2-digit', minute: '2-digit' });
            html += `
                <li>
                    <strong>${time}</strong>: 
                    ${entry.main.temp}°C, ${entry.weather[0].description}
                </li>
            `;
        });
        html += "</ul>";
    }

    resultsDiv.innerHTML += html;
}

function showError(message) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<p style="color:red;">${message}</p>`;
}