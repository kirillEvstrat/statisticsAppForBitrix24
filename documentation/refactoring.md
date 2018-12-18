#Результаты рефакторинга.
Был производен рефакторинг кодовой базы моего приложени. Я сделал упор на улучшение читаемости и возмжности дальнейшей масштабируемости браузерной части приложения.

Использовал несколько шаблонов(методов) рефакторинга:
* Выделение класса (Extract Class)
 Класс Charts был разделен на несколько более мелких классов, описывающих отдельных сущности. 
[Table, Operation, RenderCharts, calculateStatistics](https://github.com/kirillEvstrat/statisticsAppForBitrix24/commit/d8985201f721461029cb17e025847cc62f856514)
*Выделение интерфейса (Extract Interface)
[main.js](https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/main.js) 
является интерфейсом для использования других классов, выполняющих конкретную логику приложения.
 
* Изменение сигнатуры метода (Change Method Signature)
Изменены все мотоды в [Charts.js]( https://github.com/kirillEvstrat/statisticsAppForBitrix24/commit/76b076ad9ae66e04ce9e2c35130674365342e8e7)
* Инкапсуляция поля (Encapsulate Field)
выделены private свойства _thead, _tbody,  т.к они используются только внутри класса Table
[Table.js](https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/Table.js)
* Выделение локальной переменной (Extract Local Variable)
* Выделение метода (Extract Method)
из метода  makeMonthGeneralTable выделены методы setTbody, addCells
[Table.js](https://github.com/kirillEvstrat/statisticsAppForBitrix24/blob/master/code/js/Table.js)
