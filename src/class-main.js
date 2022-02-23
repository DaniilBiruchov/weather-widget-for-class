import { fetchDataPromise } from './module';

class Main {
  CORRECTION_VALUE = 273.15;
  TIME_CONVERSION = 1000;
  key = '1354067d4c5e5ba7d6625f68d153937b';
  urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${this.key}`;

  constructor(container) {
    this.mainElement = document.querySelector(container);
    this.loadData();
  }

  transformTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  loadData() {
    fetchDataPromise(this.urlWetherByDays).then((response) => {
      const data = JSON.parse(response);

      data.list.forEach((item, index) => {
        if (index % 8 == 0) {
          const date = new Date(item.dt * this.TIME_CONVERSION);
          const newDate =
            this.transformTime(date.getDate()) +
            '.' +
            this.transformTime(date.getMonth()) +
            ' ' +
            this.transformTime(date.getHours()) +
            ' ' +
            'p.m.';
          const temp = Math.round(item.main.temp - this.CORRECTION_VALUE);
          const iconSrc = `http://openweathermap.org/img/wn/03n@2x.png`;

          this.renderMain({ temp, newDate, iconSrc });
        }
      });
    });
  }

  templateWetherByDays(weatherMain) {
    const { temp, newDate, iconSrc } = weatherMain;

    return `
          <div class="day">
            <p><strong>${newDate}</strong></p>
            <img src="${iconSrc}">
            <p><strong>${temp} ˚C</strong></p>
          </div>
    `;
  }

  renderMain(data) {
    this.mainElement.innerHTML += this.templateWetherByDays(data);
  }
}


export {Main}