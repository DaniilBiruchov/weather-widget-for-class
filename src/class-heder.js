import { fetchDataPromise } from './module';

class Heder {
  key = '1354067d4c5e5ba7d6625f68d153937b';
  urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${this.key}`;
  CORRECTION_VALUE = 273.15;
  TIME_CONVERSION = 1000;
  

  constructor (container) {
    this.hederElement = document.querySelector(container);
    this.loadData()
  }

  transformTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  loadData() {
    fetchDataPromise(this.urlWetherCurrent).then((response) => {
      const data = JSON.parse(response);

      const city = data.name;
      let windDeg = data.wind.deg;
      const windSpeed = Math.round(data.wind.speed);

      if (windDeg === 0) {
        windDeg = 'North';
      } else if (windDeg > 0 && windDeg < 90) {
        windDeg = 'North-East';
      } else if (windDeg === 90) {
        windDeg = 'East';
      } else if (windDeg > 90 && windDeg < 180) {
        windDeg = 'East-South';
      } else if (windDeg === 180) {
        windDeg = 'South';
      } else if (windDeg > 180 && windDeg < 270) {
        windDeg = 'South-west';
      } else if (windDeg === 270) {
        windDeg = 'west';
      } else if (windDeg > 270 && windDeg < 360) {
        windDeg = 'west-North';
      } else if (windDeg === 360) {
        windDeg = 'North';
      }

      const date = new Date(data.dt * this.TIME_CONVERSION);
      const newDate =
        this.transformTime(date.getHours()) +
        ':' +
        this.transformTime(date.getMinutes());
      const temp = Math.round(data.main.temp - this.CORRECTION_VALUE);
      const countryCode = data.sys.country;
      const feels_like = Math.round(
        data.main.feels_like - this.CORRECTION_VALUE
      );
      const iconSrc = `http://openweathermap.org/img/wn/04n@2x.png`;

      this.renderHeder({
        city,
        windDeg,
        windSpeed,
        temp,
        countryCode,
        feels_like,
        iconSrc,
        newDate,
      });
    });
  }

  templateWetherCurrent(weatherHeder) {
    const {
      city,
      windDeg,
      windSpeed,
      temp,
      countryCode,
      feels_like,
      iconSrc,
      newDate,
    } = weatherHeder;

    return `
                  <div class="city">
                      <h2>${city}, ${countryCode} </h2>
                      <p>${newDate}</p>
                  </div>
                  <div class="temperature">
                      <img src="${iconSrc}">
                      <h1>${temp} ˚C</h1>
                      <p>Feels like ${feels_like} ˚C</p>
                  </div>
                  <div class="wind">
                      <p>${windDeg}</p>
                      <p>${windSpeed} m/s</p>
                  </div>
            `;
  }

  renderHeder(data) {
    this.hederElement.innerHTML += this.templateWetherCurrent(data);
  }
}

export { Heder }

