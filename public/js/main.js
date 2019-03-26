$(() => {
    $('.delete-todo').on('click', (e) => {
        id = $(e.target).attr('data-id');
        // console.log(id);

        $.ajax({
            type: "Delete",
            url: "/todo/del/" + id,
            success: function (response) {
                alert('deleteting todo');
                window.location.href = '/'
            },
            error: (error) => {
                console.log(error);

            }
        });





    });
})