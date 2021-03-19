jQuery('#department').change(function () {
    console.log(this.getAttribute('data-id'));
    console.log(this);
    const id = $(this).val();
    if (id == '') {
        alert("Select valid department");
        return;
    } else {
        jQuery.ajax({
            type: 'post',
            url: `/emp/lead/getdeptbyid`,
            data: 'id=' + id,
            success: function (data) {
                let emp_dept = data.emp_dept;
                let finaldata = '';

                emp_dept.forEach(element => {
                    finaldata += `<option value='${element.emp_id}'>${element.emp_name}</option>`;
                });

                jQuery('#employee').html('<option value="-1" selected disabled>Select Employee</option>')
                $("#employee").append(finaldata);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
})