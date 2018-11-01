jQuery(function($) {
    $(document).ready(function () {

        $('#autorisation').submit(function (e) {
            e.preventDefault();
            let str = $('#autorisation').serialize();
            $.ajax("autorisation.php", {
                async: true,
                method: "POST",
                data: str,
                dataType: "json",
                complete: function (msg) {
                    console.log(msg.responseJSON);
                    if(msg.responseJSON==="Неверный пароль!") {
                        $('#autorisation .message').html(msg.responseJSON);
                    }
                    else if(msg.responseJSON==="ok"){
                        document.location.replace("https://crm.procredit.by/apps/statistics/changePLan.php");
                    }

                }
            });
        });


        $('#planForm').submit(function (e) {
            e.preventDefault();
            // change or add a plan

            let str = $('#planForm').serialize();
            $.ajax("addPlan.php", {
                async: true,
                method: "POST",
                data: str,
                dataType: "json",
                complete: function (msg) {
                    console.log(msg.responseJSON);
                    if(msg.responseJSON
                        ==="ok") {

                        document.location.replace("https://crm.procredit.by/apps/statistics/index.php");
                    }
                }
            });
        });
        $('#planFormCommon').submit(function (e) {
            e.preventDefault();
            // change or add a plan

            let str2 = $('#planFormCommon').serialize();
            $.ajax("addPlanCommon.php", {
                async: true,
                method: "POST",
                data: str2,
                dataType: "json",
                complete: function (msg) {
                    console.log(msg.responseJSON);
                    if(msg.responseJSON
                        ==="ok") {

                        document.location.replace("https://crm.procredit.by/apps/statistics/index.php");
                    }
                }
            });
        });
    });
});