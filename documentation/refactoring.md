# Результаты рефакторинга.
Был производен рефакторинг кодовой базы моего приложени. Я сделал упор на улучшение читаемости и возможности дальнейшей масштабируемости браузерной части приложения.

Использовал несколько шаблонов(методов) рефакторинга:
* Выделение класса (Extract Class)
 Класс [Charts](https://github.com/kirillEvstrat/statisticsAppForBitrix24/commit/76b076ad9ae66e04ce9e2c35130674365342e8e7) был разделен на несколько более мелких классов, описывающих отдельные сущности. 
[Table, Operation, RenderCharts, calculateStatistics](https://github.com/kirillEvstrat/statisticsAppForBitrix24/commit/d8985201f721461029cb17e025847cc62f856514)
* Выделение интерфейса (Extract Interface)
[main.js](https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/main.js) 
является интерфейсом для использования других классов, выполняющих конкретную логику приложения. В main.js вынесены обработчики DOM-элементов моей страницы.
* Изменение сигнатуры метода (Change Method Signature)
Изменены все мотоды в [Charts.js]( https://github.com/kirillEvstrat/statisticsAppForBitrix24/commit/76b076ad9ae66e04ce9e2c35130674365342e8e7) для повышения интуитивной понятности кода.
* Инкапсуляция поля (Encapsulate Field)
выделены private свойства _thead, _tbody,  т.к они используются только внутри класса Table
[Table.js](https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/Table.js)
* Выделение локальной переменной (Extract Local Variable)

* Выделение метода (Extract Method)
[calculate.js](https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/CalculateStatistics.js) в методе commonCharts, workersCharts - выделены локальные переменные results для работы внутри метода.
из метода  makeMonthGeneralTable выделены методы setTbody, addCells
[Table.js](https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/Table.js).
в RenderCharts.js(https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/RenderCharts.js) выделены методы columnChart, roundChart, [ранее(стр 170, 240)](https://github.com/kirillEvstrat/statisticsAppForBitrix24/commit/76b076ad9ae66e04ce9e2c35130674365342e8e7) было повторное использование этого кода в разных участках приложения.
