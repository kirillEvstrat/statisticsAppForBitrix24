<?php
session_start();
require 'headerInfo.php';

function writeToLog2($data) {
    $log = "\n------------------------\n";
    $log .= print_r($data, 1);
    $log .= "\n------------------------\n";
    file_put_contents('/home/bitrix/www/apps/statistics/hook.log', $log, FILE_APPEND);
    return true;
}


$complexStatistics = array();
$dateNow = new DateTime();
$date= clone $dateNow;
$dateBeforeSelectStr = (clone $dateNow)->sub(new DateInterval('P2M'))->format("c");
$date->setDate(2018, 6, 1);
$dateStr = $date->format("c");
$dateNowStr = $dateNow->format("c");
//make name of table
$year = $date->format('Y');
$month = $date->format('F');
$nameOfDB ='U_STATISTICS_'.$month.'_'.$year;


while(strtotime($dateStr) < strtotime($dateBeforeSelectStr)){


    $stmt = $mysqli->stmt_init();
    if ( //common plan
        ($stmt->prepare("SELECT plan FROM U_SALES_PLAN_COMMON WHERE year=? AND month=?") === FALSE)
        or ($stmt->bind_param('ss',$year, $month) === FALSE)
        or ($stmt->execute() === FALSE)
        or (($result = $stmt->get_result()) === FALSE)

    )
    {

    }
    $row= $result -> fetch_array();
    $commonPlan=$row['plan'];
    $complexStatistics["U_PLAN_".$month.'_'.$year] = $commonPlan;


    if ( //all workers statistics
        ($stmt->prepare("SELECT * FROM  ".$nameOfDB) === FALSE)
        or ($stmt->execute() === FALSE)
        or (($result = $stmt->get_result()) === FALSE)
        or ($stmt->close() === FALSE)
    )
    {

    }
    while($row= $result -> fetch_array()) {

        $complexStatistics[$nameOfDB][$row['id_of_worker']]['last_name']=$row['last_name'] ;

        extract($row);
        $pushArr = [
            'plan'=>$plan,
            'done'=>$done,
            'percent'=> $percent,
            'last_name' => $last_name,
            'department'=>$department,
            'workPosition'=>$workPosition,
            'leadCount'=>$leadCount ,
            'dealCount'=>$dealCount,
            'invoiceCount'=>$invoiceCount,
            'conversion'=>$conversion,
            'finalConversion'=>$finalConversion,
            'acceptance'=>$acceptance,
             'averageCheck'=>$averageCheck,
             'selfBonus'=>$selfBonus,
             'commonBonus'=>$commonBonus];
        $complexStatistics[$nameOfDB][$id_of_worker]= array();
        $complexStatistics[$nameOfDB][$id_of_worker]= array_merge($complexStatistics[$nameOfDB][$id_of_worker], $pushArr);
    }
    $date->add(new DateInterval('P1M'));
    $dateStr = $date->format("c");
    $year = $date->format('Y');
    $month = $date->format('F');
    $nameOfDB ='U_STATISTICS_'.$month.'_'.$year;
}
$dateNext = clone $date;
$dateNext->add(new DateInterval('P1M'));
$dateNextStr = $dateNext->format("c");

/////////////////////����������� ������������� ���������� �� 2 ��������� ������/////////////////////
for($iter = 0 ; $iter<2; $iter++){

    //list of current workers
    $workers= chooseWorkers($idOfDepartments);

    //select common plan
    $stmt = $mysqli->stmt_init();
    if (
        ($stmt->prepare("SELECT plan FROM U_SALES_PLAN_COMMON WHERE year=? AND month=?") === FALSE)
        or ($stmt->bind_param('ss',$year, $month) === FALSE)
        or ($stmt->execute() === FALSE)
        or (($result = $stmt->get_result()) === FALSE)

    )
    {
        var_dump($stmt);
    }

    $row= $result -> fetch_array();
    $complexStatistics["U_PLAN_".$month.'_'.$year] = $row['plan'];
//get plan for current month
    $stmt = $mysqli->stmt_init();
    if (
        ($stmt->prepare("SELECT id_of_worker, plan FROM U_SALES_PLAN WHERE year=? AND month=?") === FALSE)
        or ($stmt->bind_param('ss',$year, $month) === FALSE)
        or ($stmt->execute() === FALSE)
        or (($result = $stmt->get_result()) === FALSE)
        or ($stmt->close() === FALSE)
    )
    {
        var_dump($stmt);
    }
//���������� ���� complex statistics
    while($row= $result -> fetch_array()) {
        $complexStatistics[$nameOfDB][$row['id_of_worker']]['plan']=$row['plan'];
    }




// ��������� ������ ��� ���������� ������
    $totalDone= 0 ;
    $coeff = 0;
    foreach ($workers as $id => $info) {
        if (isset($complexStatistics[$nameOfDB][$id]['plan']))
        {
        $totalPrice = 0;
        $invoiceCount = 0;

        $complexStatistics[$nameOfDB][$id]['last_name'] = $workers[$id]['LAST_NAME'];
        $complexStatistics[$nameOfDB][$id]['department'] = $workers[$id]['department'];
        $complexStatistics[$nameOfDB][$id]['workPosition'] = $workers[$id]['workPosition'];
        $plan = $complexStatistics[$nameOfDB][$id]['plan'];

        $leadCount =  leadList($id, $dateStr, $dateNextStr)['total'];
        $complexStatistics[$nameOfDB][$id]['leadCount'] = $leadCount;
        $dealList = dealList($id, $dateStr, $dateNextStr);
        $dealCount = $dealList['total'];
        $complexStatistics[$nameOfDB][$id]['dealCount'] = $dealCount;
        //��������� �������� ������(���������� ������������ ������)

        foreach ($dealList['result'] as $i => $data) {
            if ($data['STAGE_ID'] === 'WON') {
                $invoiceCount++;
                $totalPrice += (int)$data['OPPORTUNITY'];
            }
        }
        $complexStatistics[$nameOfDB][$id]['invoiceCount'] = $invoiceCount;
        $complexStatistics[$nameOfDB][$id]['conversion'] = round($dealCount / $leadCount * 100, 2);
        $complexStatistics[$nameOfDB][$id]['finalConversion'] = round($invoiceCount / $leadCount * 100, 2);
        $complexStatistics[$nameOfDB][$id]['acceptance'] = round($invoiceCount / $dealCount * 100, 2);
        if ($complexStatistics[$nameOfDB][$id]['department'] != 157) { //�� �������� ������� � ���������� �����
            $totalDone += $totalPrice;
        }

        $complexStatistics[$nameOfDB][$id]['done'] = $totalPrice;
        $complexStatistics[$nameOfDB][$id]['averageCheck'] = round($totalPrice / $invoiceCount, 2);

        $percent = $plan !== 0.0 ? round(($totalPrice / (int)$plan * 100), 2) : 0.0;
        $complexStatistics[$nameOfDB][$id]['percent'] = $percent;
        $complexStatistics[$nameOfDB][$id]['selfBonus'] = round(calculateBonus($totalPrice, $percent), 2);

    }
}

        if ($totalDone >= $commonPlan) {
            $coeff = 0.02;
        }

        foreach ($complexStatistics[$nameOfDB] as $id => $info) {

            $done = $complexStatistics[$nameOfDB][$id]['done'];
            $commonBonus = $done * $coeff;
            $complexStatistics[$nameOfDB][$id]['commonBonus'] = $commonBonus;

        }
        ///������� ����������� ��� ����������
  /*      foreach ($complexStatistics[$nameOfDB] as $id => $info){
        if(!$complexStatistics[$nameOfDB][$id]['done'])
        {
            unset($complexStatistics[$nameOfDB][$id]);
        }
        } */

        $date->add(new DateInterval('P1M'));
        $dateStr = $date->format("c");
        $dateNext->add(new DateInterval('P1M'));
        $dateNextStr = $dateNext->format("c");
        $year = $date->format('Y');
        $month = $date->format('F');
        $nameOfDB = 'U_STATISTICS_' . $month . '_' . $year;

}

//print_r($complexStatistics);
echo json_encode($complexStatistics, JSON_PARTIAL_OUTPUT_ON_ERROR);