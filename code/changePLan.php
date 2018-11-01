<?php
session_start();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Statistics</title>
    <link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
	<script src="js/changePlan.js"></script>

</head>
<body>

<!-- Single button -->
<div class="navigation">
	<div class="row">
		<div class="col-4">
			<div class="dropdown">
				<button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Выберите действие
				</button>
				<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<button type="button"  class="dropdown-item active"  id="change-plan" >Изменить план</button>
					<a  class="dropdown-item" id="general-statistics" href="index.php">Общая сатистика</a>
					<a  class="dropdown-item" id="workers-statistics" href="index.php">Статистика по сотрудникам</a>
				</div>
			</div>
		</div>

	</div>
</div>
<div class="row" >
	<div class="col-4 offset-4">
        <?php
        if(!isset($_SESSION['access'])) {
            ?>
			<form id="autorisation">
				<div class="form-group">
					<label for="exampleInputPassword1">Для изменения плана введите пароль</label>
					<input type="password" name="password" class="form-control" id="exampleInputPassword1"
						   placeholder="Password">
				</div>
				<p class="message"></p>
				<button type="submit" class="btn btn-info">Отправить</button>

			</form>
            <?php
        }
		?>
	</div>
</div>
<div class="row" >
	<div class="col-md-8 offset-2">
		<?php
        if($_SESSION['access']==="ok") {
		?>
		<h4>Изменение плана на текущий месяц </h4>
        <p id="changeMessage"></p>
        <?php


            require 'headerInfo.php';
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


            echo '<form id="planFormCommon">';
            echo '<div class="form-group row" ">
 						 <label for="example-text-input" class="col-2 col-form-label">Общий план </label>
 				 			<div class="col-10">
    							<input class="form-control" type="text" value="' . $commonPlan . '" name="commonPlan" >
 							 </div>
						</div>';
            echo '<button type="submit" class="btn">Сохранить</button></form>';
            //подставить фамилии
            $workers = chooseWorkers($idOfDepartments);

            uasort($workers, 'sortByDepartments');

            foreach ($workers as $id => $info) {
                $complexStatistics[$nameOfDB][$id]['last_name'] = $info['LAST_NAME'];
                $complexStatistics[$nameOfDB][$id]['department'] = $info['department'];
            }
            echo '<form id="planForm">';

            foreach ($complexStatistics[$nameOfDB] as $id => $info) {
                echo '<div class="form-group row" data-id="' . $id . '" data-department="' . $info['department'] . '">
 						 <label for="example-text-input" class="col-2 col-form-label">' . $info['last_name'] . '</label>
 				 			<div class="col-10">
    							<input class="form-control" type="text" value="' . $info['plan'] . '" name="' . $id . '" >
 							 </div>
						</div>';
            }
            echo '<button type="submit" class="btn">Сохранить</button></form>';
        }
        ?>
    </div>
</div>

</body>
</html>

