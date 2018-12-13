
import CalculateStatistics from "./CalculateStatistics";
import Operations from "./Operations";
import Table from "./Table";
import RenderCharts from "./RenderCharts";


export default class Charts {

    _renderCharts = new RenderCharts();
    _calculator = new CalculateStatistics();

    monthChartsWrapper(statistics, month, year , isRegionalDepartment) {
        const currentDate = Operations.dateToString(month, year);
        const table = new Table();
        let lastDate;
        if((month!==6 && year===2018 )|| year !== 2018 ){
            lastDate = month===1? Operations.dateToString(12, (year - 1)) : Operations.dateToString((month - 1), year);
            table.makeMonthGeneralTable(statistics['U_STATISTICS'+"_"+currentDate],statistics['U_STATISTICS'+"_"+lastDate]);
        }
    let plan = isRegionalDepartment ? 20000 : statistics['U_PLAN'+"_"+currentDate];
        this.makeMonthChart(statistics['U_STATISTICS'+"_"+currentDate], month, year, plan );
    }

    makeWorkersCharts(lastName, complexStatistics) {
        const calculatedStat = this._calculator.workersCharts(complexStatistics, lastName);
        let balance = (calculatedStat.plan[calculatedStat.plan.length-1] - calculatedStat.done[calculatedStat.done.length-1])>=0 ? (calculatedStat.plan[calculatedStat.done.length-1]-calculatedStat.done[calculatedStat.done.length-1]) : 0;

        this._renderCharts.lineChart('cont4',"План, сумма закрытых сделок и личный бонус сотрудника по месяцам", calculatedStat.namesOfColumns, "Сумма в рублях", [{name:"План", data:calculatedStat.plan}, {name:"Личный бонус", data:calculatedStat.selfBonus}, {name:"Выполнено", data:calculatedStat.done}]);
        this._renderCharts.lineChart('cont5', "Выполнение плана в процентах по месяцам", calculatedStat.namesOfColumns, "в %", [{name:"Процент выполнения плана", data: calculatedStat.percent},]);
        this._renderCharts.lineChart("cont6","Средний чек сотрудника по месяцам",calculatedStat.namesOfColumns,"Средний чек в рублях",[{name:"Средний чек", data:calculatedStat.averageCheck}]);
        this._renderCharts.lineChart('cont7', "Общее количество лидов по месяцам", calculatedStat.namesOfColumns, "Количество",
            [{name: 'Лиды', data:calculatedStat.leadCount}]);
        this._renderCharts.lineChart('cont8', "Общее количество сделок, счетов по месяцам", calculatedStat.namesOfColumns, "Количество",
            [{name: 'Сделки', data:calculatedStat.dealCount},{name: 'Счета', data:calculatedStat.invoiceCount}]);
        this._renderCharts.lineChart("cont9", "Конверсия по месяцам", calculatedStat.namesOfColumns, "показатели в %", [{name:'Конверсия(сделки/лиды)', data:calculatedStat.conversion}, {name:"счета/лиды", data:calculatedStat.finalConversion}]);
        this._renderCharts.lineChart("cont10", "Акцептация по месяцам", calculatedStat.namesOfColumns, "показатели в %", [{name:"Акцептация(счета/сделки)", data:calculatedStat.acceptance}]);
        // круговая диаграмма выполнения плана за послений месяц сотрудника.....
        this._renderCharts.roundChart('cont1', "Выполнение личного плана за "+calculatedStat.namesOfColumns[calculatedStat.namesOfColumns.length-1]+"("+calculatedStat.plan[calculatedStat.plan.length-1]+" р.)" , calculatedStat.done[calculatedStat.done.length-1], balance);
    }

    makeCommonCharts(allStat, isRegionalDepartment){
        const calculatedStat = this._calculator.commonCharts(allStat, isRegionalDepartment);

        this._renderCharts.lineChart(
            'cont4',
            "План и сумма закрытых сделок по месяцам", calculatedStat.namesOfColumns,
            "Сумма в рублях",
            [{name:"План", data:calculatedStat.planAvg}, {name:"Выполнено", data:calculatedStat.doneAvg}]);
        this._renderCharts.lineChart(
            'cont5',
            "Выполнение плана в процентах по месяцам", calculatedStat.namesOfColumns,
            "в %",
            [{name:"Процент выполнения плана", data: calculatedStat.percentAvg},]);
        this._renderCharts.lineChart(
            "cont6",
            "Средний чек компании по месяцам",calculatedStat.namesOfColumns,
            "Средний чек в рублях",
            [{name:"Средний чек", data:calculatedStat.averageCheckAvg}]);
        this._renderCharts.lineChart(
            'cont7',
            "Общее количество лидов по месяцам", calculatedStat.namesOfColumns,
            "Количество",
            [{name: 'Лиды', data:calculatedStat.leadCountAvg}]);
        this._renderCharts.lineChart(
            'cont8',
            "Общее количество сделок, счетов по месяцам", calculatedStat.namesOfColumns,
            "Количество",
            [{name: 'Сделки', data:calculatedStat.dealCountAvg},{name: 'Счета', data:calculatedStat.invoiceCountAvg},]);
        this._renderCharts.lineChart(
            "cont9",
            "Конверсия по месяцам", calculatedStat.namesOfColumns,
            "показатели в %",
            [{name:'Конверсия(сделки/лиды)', data:calculatedStat.conversionAvg}, {name:"счета/лиды", data:calculatedStat.finalConversionAvg}]);
        this._renderCharts.lineChart(
            "cont10",
            "Акцептация по месяцам", calculatedStat.namesOfColumns,
            "показатели в %",
            [{name:"Акцептация(счета/сделки)", data:calculatedStat.acceptanceAvg}]);
    }

    makeMonthChart(data, month, year, commonPlan) {
        let nameOfChart = month + ',' + year;
        let lastNames = [], plan = [], percent = [], done = [];
        let dataToTable =[] ;
        Object.keys(data).forEach(function (element, index) {
            lastNames.push(data[element]['last_name']);
            percent.push(data[element]['percent']);
            plan.push(data[element]['plan']);
            done.push(data[element]['done']);
            dataToTable.push({"name": data[element]['last_name'], "y": data[element]['percent'], "plan" : data[element]['plan'], 'done':data[element]['done']  });
        });
        const commonDone = getSum(done);
        const commonBalance = (commonPlan-commonDone)>=0 ? (commonPlan-commonDone): 0 ;
        this._renderCharts.columnChart('cont2', nameOfChart, 'Проценты выполнения плана', dataToTable );
        this._renderCharts.roundChart('cont1', "Выполнение общего плана за "+nameOfChart+"("+commonPlan+" р.)", commonDone,commonBalance);
     }

    deleteCharts() {
        let child;
        let monthInf = $('#monthInf')[0];
        let commonInf = $('#commonInf')[0];
        child= monthInf.firstElementChild;

        while(child){
            if(child.firstElementChild) {
                child.removeChild(child.firstElementChild);
            }
            child =child.nextElementSibling;
        }
        child= commonInf.firstElementChild;
        while(child){
            if(child.firstElementChild) {
                child.removeChild(child.firstElementChild);
            }
            child =child.nextElementSibling;
        }

    }

}
