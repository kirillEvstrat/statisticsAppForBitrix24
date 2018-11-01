<?php
session_start();
if (!isset($_SESSION['AUTH_ID'])) {
    $_SESSION['AUTH_ID'] = $_POST['AUTH_ID'];
}

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Statistics</title>
	<link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="css/ymCal.css" />
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">

	<script src="js/jquery-3.3.1.min.js" defer></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js" defer></script>
	<script type="text/javascript" charset="ISO-8859-1" src="js/ymCal.js" defer></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" defer integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
	<script src="https://code.highcharts.com/highcharts.js" defer></script>
	<script src="https://code.highcharts.com/modules/exporting.js" defer></script>




</head>
<body>
<?php
require 'headerInfo.php';
?>

<!-- Single button -->
<div class="navigation">
	<div class="row">
		<div class="col-4">
			<div class="dropdown">
				<button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Выберите действие
				</button>
				<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<a class="dropdown-item"  id="change-plan" href="changePLan.php">Изменить план</a>
					<button type="button"  class="dropdown-item active" id="general-statistics">Общая сатистика</button>
					<button type="button"  class="dropdown-item" id="workers-statistics">Статистика по сотрудникам</button>
				</div>
			</div>
		</div>

		<div class="col-4 offset-4"  id="download-statisticsWrapper">
			<button type="button" class="btn btn-primary " id="download-statistics">Загрузить статистику</button>
		</div>
	</div>
</div>
<div id="alerts">
	<div class="alert alert-warning alert-dismissible fade show" role="alert">
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		Пожалуйста, загрузите статистику!
	</div>
</div>

<div class="windows8 hide" >
	<div class="wBall" id="wBall_1">
		<div class="wInnerBall"></div>
	</div>
	<div class="wBall" id="wBall_2">
		<div class="wInnerBall"></div>
	</div>
	<div class="wBall" id="wBall_3">
		<div class="wInnerBall"></div>
	</div>
	<div class="wBall" id="wBall_4">
		<div class="wInnerBall"></div>
	</div>
	<div class="wBall" id="wBall_5">
		<div class="wInnerBall"></div>
	</div>
</div>

<div id="calendar-wrapper" class="hide">
	<div class="row">
		<div class="col-6 offset-2" id="menuLeft">
				<p>
					<label for="sel1">Выберите отдел:</label>
					<select class="form-control" id="selectDepartment">
						<option>Вся компания</option>
						<option>Отдел продаж Минск</option>
						<option>Комната 1</option>
						<option>Комната 2</option>
						<option>Комната 3</option>
						<option>Отдел продаж Могилев</option>
					</select>
				</p>
		</div>
		<div class="col-2" id="menuRight">
			<button type="button" id="calendar" class="btn btn-primary ">Выбор месяца</button>
		</div>
	</div>

</div>
<div class="row">
	<div class="col-4 offset-4">
		<div class="ui-widget hide" id="choose-workerWrapper">
			<form  id="choose-worker" class="form-inline">
				<div class="form-group ">
					<input class="form-control" type="text"  id="tags" placeholder="Ввeдите фамилию">
					<button type="submit" class="btn">OK</button>
				</div>
			</form>
		</div>

	</div>
</div>




<div class="charts">
	<div id="monthInf">
		<div id="cont1" class="chart_wrap"></div>
		<div id="cont2" class="chart_wrap"></div>
		<div id="cont3" class="chart_wrap"></div>
		<div id="commonTableWrapper"></div>
	</div>
	<div id="commonInf">

		<div id="cont4" class="chart_wrap"></div>
		<div id="cont5" class="chart_wrap"></div>
		<div id="cont6" class="chart_wrap"></div>
		<div id="cont7" class="chart_wrap"></div>
		<div id="cont8" class="chart_wrap"></div>
		<div id="cont9" class="chart_wrap"></div>
		<div id="cont10" class="chart_wrap"></div>
	</div>
</div>


<?php
/////////////////////проверка на наличие плана///////////

$dateNow = new DateTime();
//make name of table
$year = $dateNow->format('Y');
$month = $dateNow->format('F');
$nameOfDB = 'U_STATISTICS_' . $month . '_' . $year;

//get plan for current month
$stmt = $mysqli->stmt_init();
if (
    ($stmt->prepare("SELECT plan FROM U_SALES_PLAN_COMMON WHERE year=? AND month=?") === FALSE)
    or ($stmt->bind_param('ss', $year, $month) === FALSE)
    or ($stmt->execute() === FALSE)
    or (($result = $stmt->get_result()) === FALSE)
) {
    var_dump($stmt);
}
$commonPlan = "";
while ($row = $result->fetch_array()) {
    $commonPlan = $row['plan'];
}
if (
    ($stmt->prepare("SELECT id_of_worker, plan FROM U_SALES_PLAN WHERE year=? AND month=?") === FALSE)
    or ($stmt->bind_param('ss', $year, $month) === FALSE)
    or ($stmt->execute() === FALSE)
    or (($result = $stmt->get_result()) === FALSE)
    or ($stmt->close() === FALSE)
) {
    var_dump($stmt);
}
//подставить план complex statistics
while ($row = $result->fetch_array()) {
    $complexStatistics[$nameOfDB][$row['id_of_worker']]['plan'] = $row['plan'];
}

if (count($complexStatistics[$nameOfDB]) === 0 || $commonPlan === "") {
    echo "<script>alert('План на этот месяц пуст, введите данные!')</script>";
}
?>

<script src="js/main.js" defer></script>
</body>
</html>




