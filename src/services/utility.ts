export default {
  /**
   * Возвращает контейнер под каунтеры профиля или создает его, если еще не создан
   * @param name Название контейнера
   * @returns {Element}
   */
  getOrCreateContainer(name: string): Element {
    let container = document.querySelector(`.count-infos.${name}`)
    if (!container) {
      const shareHeader = document.querySelector('.share-layout-header.share-header');
      container = document.createElement('h2');
      // Если ТЕГ
      if (!document.querySelector(`.count-infos`)) {
        shareHeader?.appendChild(container);
      } else { // Если профиль
        shareHeader?.insertBefore(container, document.querySelector('.share-desc'));
      }
      container.classList.add('count-infos');
      container.classList.add(name);
    }

    return container;
  },

  createCounter(text: string, name: string, dataTag: string, row): void {
    let container = this.getOrCreateContainer(row);
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
      numberContainer = document.createElement('div');
      numberContainer.classList.add('number');
      container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, text);

    let numberCountLabel: HTMLElement | null = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
      numberCountLabel = document.createElement('strong');
      numberCountLabel.title = name;
      numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = text;
    numberCountLabel.setAttribute(`${dataTag}`, text);

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = name;
    numberContainer.appendChild(numberTextLabel);
  },

  countBy(arr, predicate: (val) => any): [string, number][] {
    return Object.entries(arr.reduce((acc, val) => {
      const value = predicate(val);
      acc[value.toString()] = (acc[value.toString()] || 0) + 1;
      return acc;
    }, {}));
  },

  downloadCsv(data, name: string): void {
    const pom = document.createElement('a');
    const csvContent = data.join("\r\n"); //here we load our csv data
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    pom.href = URL.createObjectURL(blob);
    pom.setAttribute('download', `${name}.csv`);
    pom.click();
  }
}
