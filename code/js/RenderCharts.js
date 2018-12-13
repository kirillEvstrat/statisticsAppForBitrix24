/// use HighCharts.js library to render Charts////

export default class renderCharts {

    lineChart(container, title, categories, yText, series) {
        Highcharts.chart(container, {
            chart: {
                type: 'line'
            },
            title: {
                text: title
            },

            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: yText
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: series
        });
    }

    columnChart(container, nameOfChart,titleText, data){
        Highcharts.chart(container, {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Процент выполнения за '+nameOfChart
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: titleText
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: ' <p>План: {point.plan}р. </p><p> Выполнено: {point.done}р.</p>'
            },
            series: [{
                name: 'Фамилии',
                data: data,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.1f}', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        });
    }
    // круговая диаграмма
    roundChart(container, titleText,commonDone, commonBalance ) {
        Highcharts.chart(container, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: titleText
            },
            tooltip: {
                pointFormat: '{point.percentage:.1f}%'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: на {point.y:.1f} р',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                colorByPoint: true,
                data: [{
                    name: 'Выполнено',
                    y: commonDone,
                    sliced: true,
                    selected: true
                },
                    {
                        name: 'Осталось',
                        y: commonBalance,

                    }
                ]
            }]
        });
    }




}

