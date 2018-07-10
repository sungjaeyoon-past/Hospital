$(function () {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='diagnosis']").validate({
        // Specify validation rules
        rules: {
            patient_id: "required",
            disease: "required",
            date: "required",
            description: "required"
        },
        // Specify validation error messages
        /*messages: {
            patient_id: "환자 id가 입력되지 않았습니다.",
            disease: "required",
            date: "required",
            description: "required"
        },*/
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });
});