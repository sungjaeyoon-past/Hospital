function makedeck(dept_id) {
    $.ajax({
        url: '/receipt/queuelist/' + dept_id,
        dataType: 'json',
        data: {},
        success: function (data) {
            var str = "";
            for (var x = 0; x < data.length; x++) {
                str += '<div class="card text-white bg-info" style="max-width: 18rem;">';
                str += '<div class="card-body">';
                str += '<h5 class="card-title">' + data[x].name + '</h5>';
                str += "<hr/><a class='btn btn-default' type='submit' href='/diagnosis/" + data[x].patient_id + "'>진료하기  </a></div>";
                str += '</div>';
            }
            $('#namecard').html(str);
        }
    })
}