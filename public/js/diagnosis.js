var x = function () {
    $.ajax({
        url: '/receipt/queuelist',
        dataType: 'json',
        success: function (data) {
            var str = '';
            for (var name in data) {
                str += '<li>' + data[name] + '</li>';
            }
            $('#timezones').html('<ul>' + str + '</ul>');
        }
    })
}


$(document).ready(x);