<?php
require 'connect.php';


function writeToLog($data) {
    $log = "\n------------------------\n";
    $log .= print_r($data, 1);
    $log .= "\n------------------------\n";
    file_put_contents(getcwd() . '/hook.log', $log, FILE_APPEND);
    return true;
}

function executeHTTPRequest ($queryUrl, array $params = array()) {
    $result = array();
    $queryData = http_build_query($params);

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_POST => 1,
        CURLOPT_HEADER => 0,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $queryUrl,
        CURLOPT_POSTFIELDS => $queryData,
    ));

    $curlResult = curl_exec($curl);
    curl_close($curl);

    if ($curlResult != '') $result = json_decode($curlResult, true);

    return $result;
}
function calculateBonus($done, $percent){
    if($percent>=100.0)
        return  $done*0.2;
    if($percent>=80.0)
        return $done*0.15;
    if($percent>=50.0)
        return $done*0.1;
    if($percent>=30.0)
        return $done*0.07;
    return 0;
}
function chooseWorkers($idOfDepartments ){ //make array of current workers
    $workers=[];
    foreach ($idOfDepartments as $i => $info){
        foreach ($info as $count => $id){

            $result = userList($id)['result'];


            foreach ($result as $idOfWorker => $information) {
                $idOfWorker = $information['ID'];
                if($idOfWorker != '6564') //не загружать руководителя отдела продаж(Струневский)
                { // руководитель отдела , в статистику не всключается
                    $workers[$idOfWorker]['LAST_NAME'] = $information["LAST_NAME"];
                    $workers[$idOfWorker]['department'] = $information['UF_DEPARTMENT'][0];
                    $workers[$idOfWorker]['workPosition'] = $information["WORK_POSITION"];
                }
            }

        }
    }
   return $workers;
}
function userList(String $departmentId ){
    $url ='https://crm.procredit.by/rest/58113/ig6gm21thtz5phum/user.get.json?'.

        'order[UF_DEPARTMENT]=ASC'.
        '&filter[UF_DEPARTMENT]='.$departmentId.
        '&filter[ACTIVE]=true';


    return executeHTTPRequest($url);
}
function userList2($id ){
    $url ='https://crm.procredit.by/rest/58113/ig6gm21thtz5phum/user.get.json?'.

        'order[UF_DEPARTMENT]=ASC'.
        '&filter[ID]='.$id;


    return executeHTTPRequest($url);
}




function leadList(String $id, String $dateStart, String $dateEnd, $arr= array() ){

    $url ='https://crm.procredit.by/rest/58113/ig6gm21thtz5phum/crm.lead.list.json?'.
        "select[]=ID".
        '&filter[!STATUS_ID]=21';
    $array = array("filter[ASSIGNED_BY_ID]" => $id,'filter[>DATE_CREATE]'=>$dateStart,'filter[<DATE_CREATE]'=>$dateEnd,'filter[!STATUS_ID]'=> 'JUNK');
    $array = array_merge($array, $arr);
    return executeHTTPRequest($url, $array);


}
function dealList(String $id, String $dateStart, String $dateEnd, $arr= array() ){

    $url ='https://crm.procredit.by/rest/58113/ig6gm21thtz5phum/crm.deal.list.json?'.
        "select[]=ID".
        "&select[]=STAGE_ID".
        "&select[]=OPPORTUNITY";

    $array = array("filter[ASSIGNED_BY_ID]" => $id,'filter[>DATE_CREATE]'=>$dateStart,'filter[<DATE_CREATE]'=>$dateEnd);
    $array = array_merge($array, $arr);
    return executeHTTPRequest($url, $array);


}

function invoiceList(String $id, String $dateStart, String $dateEnd){
    $url ='https://crm.procredit.by/rest/58113/ig6gm21thtz5phum/crm.invoice.list.json?'.

        'order[DATE_INSERT]=ASC'.
        '&filter[>DATE_INSERT]='.urlencode($dateStart).
        '&filter[<DATE_INSERT]='.urlencode($dateEnd).
        '&filter[responsible_id]='.$id.
        '&select[]=DATE_INSERT&select[]=ID&select[]=PRICE';


    return executeHTTPRequest($url);
}

function sortByDepartments($a, $b){

        if ($a['department'] == $b['department']) {
            return 0;
        }
        return ($a['department'] < $b['department']) ? -1 : 1;

}

$idOfDepartments = [ 'Комнаты'=> ["Ком. №1" =>175, "Ком. №2" =>177,"Ком. №3"=> 185],"Отдел продаж Минск"=>[5], "Офис Могилёв"=> [157] ];

