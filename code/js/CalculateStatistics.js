import Operations from "./Operations";

export default class CalculateStatistics {


    _regionalPlan ;

    constructor(plan = 0){
        this._regionalPlan = plan;
    }

    get regionalPlan(){
        return this._regionalPlan;
    }
    set regionalPlan(plan){
        this._regionalPlan =plan;
    }


    commonCharts(statistics,  isRegionalDepartment) {
        let result = {
            namesOfColumns: [], leadCountAvg: [], dealCountAvg: [], invoiceCountAvg: [], planAvg: [], doneAvg: [],
            percentAvg: [], conversionAvg: [], finalConversionAvg: [], acceptanceAvg: [], averageCheckAvg: []
        };
        // проход по всей стастике (выборка статистики по месяцам)
        Object.keys(statistics).forEach(function (element, index) {

            let leadCount = [], dealCount = [], invoiceCount = [], done = [], conversion = [], finalConversion = [],
                acceptance = [], averageCheck = [], plan;
            if (element.split('_')[1] === "STATISTICS") {
                let monthStatistics = statistics[element];
                //проход по статистике каждого работника
                Object.keys(monthStatistics).forEach(function (worker, index) {
                    leadCount.push(monthStatistics[worker]['leadCount']);
                    dealCount.push(monthStatistics[worker]['dealCount']);
                    invoiceCount.push(monthStatistics[worker]['invoiceCount']);
                    done.push(monthStatistics[worker]['done']);
                    conversion.push(monthStatistics[worker]['conversion']);
                    finalConversion.push(monthStatistics[worker]['finalConversion']);
                    acceptance.push(monthStatistics[worker]['acceptance']);
                    averageCheck.push(monthStatistics[worker]['averageCheck']);
                });
                result.namesOfColumns.push(element.split('_')[2] + ', ' + element.split('_')[3]);
                result.leadCountAvg.push(Operations.getSum(leadCount));
                result.dealCountAvg.push(Operations.getSum(dealCount));
                result.invoiceCountAvg.push(Operations.getSum(invoiceCount));
                result.doneAvg.push(Operations.getSum(done));
                result.conversionAvg.push(Number(Operations.getAvg(conversion)));
                result.finalConversionAvg.push(Number(Operations.getAvg(finalConversion)));
                result.acceptanceAvg.push(Number(Operations.getAvg(acceptance)));
                result.averageCheckAvg.push(Number(Operations.getAvg(averageCheck)));
                plan = isRegionalDepartment ? 20000 : Number(statistics["U_PLAN_" + element.split('_')[2] + '_' + element.split('_')[3]]);
                result.planAvg.push(plan);
                result.percentAvg.push(Number((Operations.getSum(done) / plan * 100).toFixed(2)));
            }
        });
        return result;
    }

    workersCharts(statistics, lastName) {
        let result= {
            namesOfColumns: [], leadCount : [], dealCount : [], invoiceCount : [], done : [], conversion: [],
            finalConversion: [], acceptance: [], averageCheck: [], plan: [], percent: [], selfBonus: []
        };
        Object.keys(statistics).forEach(function (element, index) {

            if (element.split('_')[1] === "STATISTICS") {
                let monthStatistics = statistics[element];
                Object.keys(monthStatistics).forEach(function (worker, index) {
                    if (monthStatistics[worker]['last_name'] === lastName) {
                        result.leadCount.push(monthStatistics[worker]['leadCount']);
                        result.dealCount.push(monthStatistics[worker]['dealCount']);
                        result.invoiceCount.push(monthStatistics[worker]['invoiceCount']);
                        result.plan.push(monthStatistics[worker]['plan']);
                        result.done.push(monthStatistics[worker]['done']);
                        result.percent.push(monthStatistics[worker]['percent']);
                        result.conversion.push(monthStatistics[worker]['conversion']);
                        result.finalConversion.push(monthStatistics[worker]['finalConversion']);
                        result.acceptance.push(monthStatistics[worker]['acceptance']);
                        result.averageCheck.push(monthStatistics[worker]['averageCheck']);
                        result.selfBonus.push(monthStatistics[worker]['selfBonus']);
                        result.namesOfColumns.push(element.split('_')[2] + ', ' + element.split('_')[3]);
                    }
                 });
            }
        });
        return result;
    }

    selectStatisticsOfDepartment(departments, allStatistics ) {
        let tempStatistics = {};
        let idOfWorkersFromDepartment =[];
        let date = new Date();
        let currentMonthTableName = `U_STATISTICS_${Operations.dateToString(date.getMonth()+1, date.getFullYear())}`;

        //пойчаем айди актуальных сотрудников принадлежащих к департаменту
        Object.keys(allStatistics[currentMonthTableName]).forEach(function (id, index) {
            if(departments.indexOf(Number(allStatistics[currentMonthTableName][id]['department']))!==-1){
                idOfWorkersFromDepartment.push(id);
            }
        });

        //вытаскиваем их статистику
        Object.keys(allStatistics).forEach(function (element, index) {

            if (element.split('_')[1] === "STATISTICS") {
                let monthStatistics = allStatistics[element];
                tempStatistics[element]={};
                Object.keys(monthStatistics).forEach(function (worker, index) {
                    if(idOfWorkersFromDepartment.indexOf(worker)!==-1){
                        tempStatistics[element][worker]={};
                        for(let key in monthStatistics[Number(worker)]){
                            let value = monthStatistics[Number(worker)][key];
                            tempStatistics[element][worker][key]=value;
                        }
                    }
                });
            }
            else{
                tempStatistics[element]=allStatistics[element];
            }
        });
        return tempStatistics;
    }

    getLastNames(complexStatistics) {
        let lastNames=[];
        Object.keys(complexStatistics).forEach(function (element, index) {
            if(element.split('_')[1]==="STATISTICS"){
                let monthStatistics =complexStatistics[element];
                Object.keys(monthStatistics).forEach(function (worker, index) {
                    lastNames.push(monthStatistics[worker]['last_name']);
                });
            }
        });
        lastNames = (function (arr) { //select unique names
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                let str = arr[i];
                obj[str] = true; // запомнить строку в виде свойства объекта
            }
            return Object.keys(obj);
        })(lastNames);
        return lastNames;
    }

}