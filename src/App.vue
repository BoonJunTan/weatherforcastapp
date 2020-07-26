<template>
  <div id="app" :class="typeof results.current != 'undefined' && results.current.temp < 25 ? 'cold' : ''">
    <main>
      <connection-status></connection-status>
      <div class="search-box">
        <input 
          type="text" 
          class="search-bar" 
          placeholder="Key in location and press Enter" 
          v-model="userInput" 
          @keypress="fetchSearchedWeather" 
        />
      </div>

      <div class="location-button">
        <b-container>
          <b-row align-h="center">
              <b-button v-on:click="geolocation" variant="success">Get Current Location</b-button>
          </b-row>
        </b-container>
      </div>

      <div class="weather-wrap" v-if="typeof results.current != 'undefined'">
        <div class="location-box">
          <div class="location">{{ results.timezone }}</div>
          <div class="date">{{ getTodayDate() }}</div>
        </div>

        <div class="weather-box">
          <div class="temp">{{ Math.round(results.current.temp) }}°c</div>
          <div class="weather">{{ results.current.weather[0].main }}</div>
        </div>

        <div class="weather-forecast">
          <table>
            <tr>Date
              <td align-h="center" v-for="day in results.daily" :key="day.id" >
                <p>{{ convertUnixTimeToDDMMYYYY(day.dt) }}</p>
              </td>
            </tr>
            <tr>Min Temp (°c)
              <td align-h="center" v-for="day in results.daily" :key="day.id">
                <p>{{ Math.round(day.temp.min) }}</p>
              </td>
            </tr>
            <tr>Max Temp (°c)
              <td align-h="center" v-for="day in results.daily" :key="day.id">
                <p>{{ Math.round(day.temp.max) }}</p>
              </td>
            </tr>
            <tr>Weather
              <td align-h="center" v-for="day in results.daily" :key="day.id">
                <p>{{ day.weather[0].main }}</p>
              </td>
            </tr>
            <tr>Sunrise
              <td align-h="center" v-for="day in results.daily" :key="day.id">
                <p>{{ convertUnixTimeToTime(day.sunrise) }}</p>
              </td>
            </tr>
            <tr>Sunset
              <td align-h="center" v-for="day in results.daily" :key="day.id">
                <p>{{ convertUnixTimeToTime(day.sunset) }}</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import ConnectionStatus from './components/ConnectionStatus.vue'

export default {
  name: 'app',
  components: {
    ConnectionStatus
  },
  data() {
    return {
      api_key: '58396d76208cf05f3df1ab2505370b0a',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      userInput: '',
      latitude: '',
      longitude: '',
      results: {},
      formatOptions: { format: "dd-MM-yyyy", type: "date"} 
    }
  },
  mounted() {
    if (localStorage.getItem("myWeatherData")) {
      try {
        this.results = JSON.parse(localStorage.getItem('myWeatherData'));
      } catch (e) {
        localStorage.removeItem('myWeatherData');
      }
    }
  },
  methods: {
    geolocation() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getWeatherData();
        },
        error => {
          console.log(error.message)
        },
      )
    },

    getWeatherData() {
      fetch(`${this.url_base}onecall?lat=${this.latitude}&lon=${this.longitude}&exclude=minutely&units=metric&APPID=${this.api_key}`)
          .then(response => {
            return response.json();
          }).then(this.setResults);
    },

    fetchSearchedWeather(e) {
      if (e.key == "Enter") {
        fetch(`${this.url_base}weather?q=${this.userInput}&units=metric&APPID=${this.api_key}`)
          .then(response => response.json())
          .then(data => (
            this.latitude = data.coord.lat,
            this.longitude = data.coord.lon,
            this.getWeatherData()
            )
          );
      }
    },

    setResults (results) {
      this.results = results;
      const parsed = JSON.stringify(this.results)
      localStorage.setItem('myWeatherData', parsed);
    },

    getTodayDate() {
      let d = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    },

    convertUnixTimeToDDMMYYYY(timestamp) {
      var date = new Date(timestamp * 1000);
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    },

    convertUnixTimeToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return hours + ":" + minutes + " " + ampm;
    },
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'montserrat', sans-serif;
}

#app {
  background-image: url('./assets/hot-background.jpg');
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
}

#app.cold {
  background-image: url('./assets/cold-background.jpg');
}

main {
  min-height: 100vh;
  padding: 25px;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75));
}

.search-box {
  width: 100%;
  margin-bottom: 30px;
}

.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;
  
  color: #313131;
  font-size: 20px;
  appearance: none;
  border:none;
  outline: none;
  background: none;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;
}

.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px 0px 16px 0px;
}

.location-button {
  margin-bottom: 15px;
}

.location-box .location {
  color: #FFF;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}

.location-box .date {
  color: #FFF;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
}

.weather-box {
  text-align: center;
  margin-bottom: 30px;
}

.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #FFF;
  font-size: 102px;
  font-weight: 900;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color:rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px 0px;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-box .weather {
  color: #FFF;
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-forecast {
  width: 100%;
  display: inline-block;
  padding: 10px 25px;
  color: #FFF;
  font-size: 12px;
  text-align: center;
  background-color:rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

table {
  width: 100%;
}
</style>
