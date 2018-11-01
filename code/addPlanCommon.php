<?php

require 'headerInfo.php';
$plan= (int)$_POST['commonPlan'];
$dateNow = new DateTime();
$year = $dateNow->format('Y');
$month = $dateNow->format('F');
$ans ="";


    $stmt = $mysqli->stmt_init();
    if (
        ($stmt->prepare('SELECT id FROM U_SALES_PLAN_COMMON WHERE  year=? AND  month =?')=== FALSE)
        or ($stmt->bind_param('ss', $year, $month) === FALSE)
        or ($stmt->execute() === FALSE)
        or (($result = $stmt->get_result()) === FALSE)
    )
    {
        writeToLog($stmt);
    }
    if($result->num_rows !== 0){
        $id =  $result ->fetch_array()['id'];
        if (
            ($stmt->prepare('UPDATE U_SALES_PLAN_COMMON SET plan=? WHERE id=?  ')=== FALSE)
            or ($stmt->bind_param('ii',$plan, $id) === FALSE)
            or ($stmt->execute() === FALSE)

        )
        {
            writeToLog($stmt);
        }
    }
    else{
        if (
            ($stmt->prepare('INSERT INTO U_SALES_PLAN_COMMON ( year, month , plan ) values ( ?, ?, ?)  ')=== FALSE)
            or ($stmt->bind_param('ssi',$year, $month, $plan) === FALSE)
            or ($stmt->execute() === FALSE)

        )
        {
            writeToLog($stmt);
        }
    }

$stmt->close();
echo json_encode('ok');