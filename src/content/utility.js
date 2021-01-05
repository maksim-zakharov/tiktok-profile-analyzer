/**
 * Возвращает контейнер под каунтеры профиля или создает его, если еще не создан
 * @param name Название контейнера
 * @returns {Element}
 */
let getOrCreateContainer = (name) => {
    let container = document.querySelector(`.count-infos.${name}`)
    if (!container) {
        const shareHeader = document.querySelector('.share-layout-header.share-header');
        container = document.createElement('h2');
        // Если ТЕГ
        if (!document.querySelector(`.count-infos`)) {
            shareHeader.appendChild(container);
        } else { // Если профиль
            shareHeader.insertBefore(container, document.querySelector('.share-desc'));
        }
        container.classList.add('count-infos');
        container.classList.add(name);
    }

    return container;
}

const countBy = (arr, predicate) => {
    return Object.entries(arr.reduce((acc, val) => {
        const value = predicate(val);
        acc[value.toString()] = (acc[value.toString()] || 0) + 1;
        return acc;
    }, {}));
};

function downloadCsv(data, name) {
    var pom = document.createElement('a');
    var csvContent = data.join("\r\n"); //here we load our csv data
    var blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', `${name}.csv`);
    pom.click();
}

module.exports = {getOrCreateContainer, countBy, downloadCsv};
