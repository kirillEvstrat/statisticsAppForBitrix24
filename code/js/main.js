import {Charts} from 'Charts'
import {CalculateStatistics} from "./CalculateStatistics";
import {Table} from "./Table";

jQuery(function($) {
    const charts = new Charts();
    const _calculator = new CalculateStatistics();
    let allStatistics = {}, complexStatistics = {}, lastNames = []; //allstat - хранится вся статистика(не изменять этот массив!)
    let monthGlobal, yearGlobal;
    let isCalendarUsed = false;
    let isRegionalDepartment = false;
    let regionalDepartmentCounter = 0;

    $(document).ready(function () {
        //calendar
        let ymc = ymCal(
            $("#calendar"),
            null,
            "bottom",
            null,
            null,
            function (event, month, year, misc) {
                if (event === "ok") {
                    Table.delete();
                    let now = new Date();

                    if (year < 2018 || (year === 2018 && month < 6)) {
                        $('#alerts').html('<div class="alert alert-warning alert-dismissable">\n' +
                            '\t\t<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
                            '\t\tСтатитика ведется с 06.2018! (сравнительные таблица доступны с 07.2018)\n' +
                            '\t</div>');
                    }
                    else if (year > now.getFullYear() || (month > now.getMonth() + 1 && year === now.getFullYear())) {
                        $('#alerts').html('<div class="alert alert-warning alert-dismissable">\n' +
                            '\t\t<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
                            '\t\tЯ не знаю, что будет в будущем(((\n' +
                            '\t</div>');
                    }
                    else {
                        isCalendarUsed = true;
                        yearGlobal = year;
                        monthGlobal = month;

                       charts.monthChartsWrapper(complexStatistics, month, year);
                    }

                }

            },
            5000,
            -8
        );

         $('#download-statistics').click(function (e) {
            $('.windows8').removeClass('hide');
            $.ajax("getData.php", {
                async: true,
                method: "POST",
                success: function (msg) {
                    msg = JSON.parse(msg);
                    allStatistics = msg;
                    complexStatistics = msg;
                    console.dir(msg);
                    $('#download-statistics').addClass('active');
                    lastNames = _calculator.getLastNames(complexStatistics);
                    autocomplete(lastNames);
                    $('.windows8').addClass('hide');
                    $('#alerts').html('<div class="alert alert-success alert-dismissable">\n' +
                        '\t\t<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
                        '\t\tДанные успешно загружены!\n' +
                        '\t</div>');
                    if ($('#general-statistics').hasClass('active')) {
                        $("#choose-workerWrapper").addClass("hide");
                        $("#calendar-wrapper").removeClass("hide");
                        charts.makeCommonCharts(allStatistics, isRegionalDepartment);
                    }
                    else if ($('#workers-statistics').hasClass('active')) {
                        $("#choose-workerWrapper").removeClass("hide");
                        $("#calendar-wrapper").addClass("hide");

                    }


                }
            });
        });

        $('#workers-statistics').click(function () {
            $("#general-statistics").removeClass('active');
            $("#workers-statistics").addClass('active');
            if ($('#download-statistics').hasClass('active')) {
                $("#choose-workerWrapper").removeClass("hide");
                $("#calendar-wrapper").addClass("hide");
                charts.deleteCharts();//delete common charts

            }


        });

        $('#general-statistics').click(function () {
            $("#general-statistics").addClass('active');
            $("#workers-statistics").removeClass('active');
            if ($('#download-statistics').hasClass('active')) {
                $("#choose-workerWrapper").addClass("hide");
                $("#calendar-wrapper").removeClass("hide");
                charts.deleteCharts(); //delete  charts
                charts.makeCommonCharts(allStatistics, isRegionalDepartment);
            }


        });

        $('#choose-worker').submit(function (e) {
            e.preventDefault();
            var value = $('#tags').val();
            $("#choose-worker")[0].reset();
            charts.makeWorkersCharts(value, allStatistics);
        });

        $('#delete-month').click(function () {
            isCalendarUsed = false;
            yearGlobal = null;
            monthGlobal = null;
            charts.deleteCharts(); //delete  charts
            charts.makeCommonCharts(complexStatistics, isRegionalDepartment);
        });

        $('#selectDepartment').change(function (e) {
            console.log(monthGlobal, "---", yearGlobal);
            let value = this.value;
            let departments = [];
            let result = [];
            $.ajax("getDepartments.php", {
                async: true,
                method: "POST",
                success: function (msg) {
                    departments = JSON.parse(msg);
                    Object.keys(departments).forEach(function (key) {
                        let flag = 0; // 1- главный депортамент 0 - субдепартамент

                        if (key === value) {
                            flag = 1;
                        }
                        Object.keys(departments[key]).forEach(function (id) {

                            if ((departments[key][id]['name'] === value && flag === 0) || flag === 1) {

                                result.push(Number(id));
                                if (departments[key][id]['parent'] == 251) { //региональный офис

                                    isRegionalDepartment = true;
                                }
                                else {
                                    isRegionalDepartment = false;
                                }
                            }
                        });
                    });
                    complexStatistics = this._calculator.selectStatisticsOfDepartment(result, allStatistics); //отсеить  пользователей только из нужных департаментов
                    if (isCalendarUsed === true) {
                        Table.delete();
                        charts.monthChartsWrapper(complexStatistics, monthGlobal, yearGlobal);
                    }
                    else {
                        charts.makeCommonCharts(complexStatistics, isRegionalDepartment);
                    }
                 }
            });
        });
    });
    ////END Document.ready///
   function autocomplete(lastNames) {
       $( "#tags" ).autocomplete({
            source: lastNames
        });
    }



});







