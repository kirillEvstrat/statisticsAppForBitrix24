import Operations from "./Operations";


export default class Table{

    _thead = "<thead>\n" +
        "\t<tr>\n" +
        "\t\t<th ROWSPAN=\"2\">Фамилии</th>\n" +
        "\t\t<th colspan=\"2\">Кол-о лидов</th>\n" +
        "\t\t<th colspan=\"2\">Конверсия(Сделки/Лиды) %</th>\n" +
        "\t\t<th colspan=\"2\">Кол-о сделок</th>\n" +
        "\t\t<th colspan=\"2\">Акцептация(Счета/Сделки) %</th>\n" +
        "\t\t<th colspan=\"2\">Счета/Лиды (%)</th>\n" +
        "\t\t<th colspan=\"2\">Кол-о счетов</th>\n" +
        "\t\t<th >План</th>\n" +
        "\t\t<th colspan=\"2\">Выполнено</th>\n" +
        "\t\t<th colspan=\"2\">% выполнения плана</th>\n" +
        "\t\t<th colspan=\"2\">Средний чек</th>\n" +
        "\t\t<th colspan=\"3\">Бонусы</th>\n" +
        "\n" +
        "\n" +
        "\t</tr>\n" +
        "\t<tr>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>Общ.</th>\n" +
        "\t\t<th>Прирост</th>\n" +
        "\t\t<th>от личн. плана</th>\n" +
        "\t\t<th>от общ. плана</th>\n" +
        "\t\t<th>сумма</th>\n" +
        "\t</tr>\n" +
        "\t</thead>";

    _tbody ;

    makeMonthGeneralTable(currentMonthStatistics, lastMonthStatistics) {

        let table = document.createElement('table');
        table.setAttribute('id', 'commonTable');
        $(table).html(this._thead);
        this.setTbody(currentMonthStatistics, lastMonthStatistics);
        table.appendChild(this._tbody);
        document.querySelector("#commonTableWrapper").appendChild(table);

    }

    static addCells(row, cells) {
        for (let j = 0; j < cells.length; j++) {
            let cell = document.createElement('td');
            cell.textContent = cells[j];
            if(cells[j][(cells[j].length)-1]==="%"){
                if(cells[j][0]==="-"){
                    $(cell).addClass('minus');
                }
                else if(cells[j][0]===("0" || "н")){
                    //не менять цвет
                }
                else
                    $(cell).addClass('plus');
            }
            row.appendChild(cell);
        }
        return row;

    }

    setTbody(currentMonthStatistics, lastMonthStatistics ){
        let tbody= document.createElement('tbody');

        Object.keys(currentMonthStatistics).forEach(function (element, index) {

            let {acceptance,averageCheck,commonBonus,conversion, dealCount,department,done,finalConversion,invoiceCount,
                last_name,leadCount,percent,plan, selfBonus} = currentMonthStatistics[element];
            let sumBonus = (selfBonus+commonBonus).toFixed(2);

            if(typeof lastMonthStatistics[element] !== 'undefined' ) {
                var {
                    acceptance: acceptancePr, averageCheck:averageCheckPr , commonBonus: commonBonusPr, conversion: conversionPr, dealCount: dealCountPr, department: departmentPr,
                    done: donePr, finalConversion: finalConversionPr, invoiceCount: invoiceCountPr, last_name: last_namePr, leadCount: leadCountPr, percent: percentPr, plan: planPr, selfBonus: selfBonusPr
                } = lastMonthStatistics[element];

            }
            else{
                var acceptancePr ='н/д', averageCheckPr ='н/д' , commonBonusPr='н/д', conversionPr='н/д', dealCountPr='н/д',donePr='н/д', finalConversionPr='н/д',
                    invoiceCountPr='н/д',leadCountPr='н/д',percentPr='н/д', planPr='н/д',selfBonusPr='н/д' ;
            }


            let row = document.createElement('tr');
            let cells = [last_name, leadCount, Operations.calculateIncrement(leadCount, leadCountPr),conversion, Operations.calculateIncrement(conversion, conversionPr,1),
                dealCount, Operations.calculateIncrement(dealCount, dealCountPr),acceptance, Operations.calculateIncrement(acceptance, acceptancePr,1),
                finalConversion,Operations.calculateIncrement(finalConversion, finalConversionPr, 1),invoiceCount, Operations.calculateIncrement(invoiceCount, invoiceCountPr), plan,
                done, Operations.calculateIncrement(done, donePr), percent, Operations.calculateIncrement(percent, percentPr, 1), averageCheck, Operations.calculateIncrement(averageCheck, averageCheckPr),
                selfBonus, commonBonus, sumBonus];


            row = Table.addCells(row, cells);
            tbody.appendChild(row);

        });
        this._tbody = tbody;
    }

     static delete() {
        let wrapper= document.querySelector("#commonTableWrapper");
        while(wrapper.firstChild){
            wrapper.removeChild(wrapper.firstChild); //удаляем текущую таблицу
        }
    }
}