<?php
require 'headerInfo.php';
$result = $_POST;
$dateNow = new DateTime();
$year = $dateNow->format('Y');
$month = $dateNow->format('F');
$ans ="";
foreach ($result as $id => $info){
    $info=(float)$info;

    $stmt = $mysqli->stmt_init();
    if (
        ($stmt->prepare('SELECT id FROM U_SALES_PLAN WHERE id_of_worker=? AND year=? AND  month =?')=== FALSE)
        or ($stmt->bind_param('iss',$id, $year, $month) === FALSE)
        or ($stmt->execute() === FALSE)
        or (($result = $stmt->get_result()) === FALSE)
    )
    {
        writeToLog($stmt);
    }
    if($result->num_rows !== 0){
       $id =  $result ->fetch_array()['id'];
        if (
            ($stmt->prepare('UPDATE U_SALES_PLAN SET plan=? WHERE id=?  ')=== FALSE)
            or ($stmt->bind_param('di',$info, $id) === FALSE)
            or ($stmt->execute() === FALSE)

        )
        {
            writeToLog($stmt);
        }
    }
    else{
        if (
            ($stmt->prepare('INSERT INTO U_SALES_PLAN (id_of_worker, year, month , plan ) values (?, ?, ?, ?)  ')=== FALSE)
            or ($stmt->bind_param('issd',$id, $year, $month, $info) === FALSE)
            or ($stmt->execute() === FALSE)

        )
        {
            writeToLog($stmt);
        }
    }

}
$stmt->close();
echo json_encode('ok');
