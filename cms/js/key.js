const SERVER_URL = 'http://api.fbulks.site';

/* lấy phần tử modal */
var modal = document.getElementById("myModal");
/* thiết lập nút mở modal */
 var btn = document.getElementById("myBtn");
/* thiết lập nút đóng modal */
 var span = document.getElementsByClassName("close")[0];
/* Sẽ hiển thị modal khi người dùng click vào */
 btn.onclick = function() {
   modal.style.display = "block";
 }
/* Sẽ đóng modal khi nhấn dấu x */
 span.onclick = function() {
   modal.style.display = "none";
 }
/*Sẽ đóng modal khi nhấp ra ngoài màn hình*/
 window.onclick = function(event) {
   if (event.target == modal) {
     modal.style.display = "none";
   }
 }

$(function(){
    console.log('page ready')

    fetch(`${SERVER_URL}/list-key`, {
        method: "POST",
        headers:{
            "Content-type": "application/json",
            "authorization":"Bearer "+localStorage.getItem('auth')
        },
        body:JSON.stringify({})
    }).then(res => res.json()).then(r => {
       console.log(r)
       if(r.success){
        if(r.docs.length) $('tr.odd').remove()
        r.docs.forEach(doc => {
            $('#secret-key-body').append(`<tr data-value="${doc.key}" id="${doc.key}">
            <td>
            <div data-value="${doc.key}" id="view-${doc.key}" style="max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;">${doc.key}</div>
            </td>
            <td>${doc.type}</td>
            <td>${doc.createdAt}</td>
            <td>${doc.expiredTime}</td>
            <td id="status-${doc.key}">${doc.status}</td>
            <td id="action-${doc.key}">
            <div class="custom-control custom-switch">
                <input type="checkbox" ${doc.status  ? 'checked' : ''} class="custom-control-input" data-key="${doc.key}" data-id="${doc._id}" id="active-${doc.key}">
                <label class="custom-control-label" for="active-${doc.key}">Kích hoạt</label>
            </div>
            </td>
        </tr>`)
            $(`#view-${doc.key}`).click(function(e){
                console.log('key click' , e)
                let k  = e.target.dataset.value
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val(k).select();
                document.execCommand("copy");
                $temp.remove();
                $.notify("Đã copy "+k,'success');
            })

            $(`#active-${doc.key}`).change(function(e){
                let val = e.target.checked
                fetch(`${SERVER_URL}/update-key` ,{
                    method:"POST",
                    headers:{
                        "Content-type": "application/json",
                        "authorization":"Bearer "+localStorage.getItem('auth')
                    },
                    body:JSON.stringify({
                        _id : e.target.dataset.id,
                        update:{
                            status: val
                        }
                    })
                }).then(r => r.json()).then(r => {
                    if(r.success){
                        $(`#status-${e.target.dataset.key}` ).text(val ? 1 : 0)
                        $.notify(`Đã ${val ? 'kích hoạt' : 'hủy kích hoạt'} thành công`,'success');
                    }else console.log(r)
                })
            })
        })
       }else console.log(r)
    })

    $('.key-time-create').click(function(e){
        let time = e.target.dataset.time
        console.log('time',time)
        if(['1m','3m','6m','12m'].indexOf(time) == -1) return $.notify('Thời gian không hợp lệ','error');
        fetch(`${SERVER_URL}/create-key` ,{
            method:"POST",
            headers:{
                "Content-type": "application/json",
                "authorization":"Bearer "+localStorage.getItem('auth')
            },
            body:JSON.stringify({
                type: time
            })
        }).then(r => r.json()).then(r => {
            if(r.success){
                $.notify(`Đã tạo key thành công`,'success');
            }else console.log(r)
        })
    })

})