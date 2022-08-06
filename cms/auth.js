const SERVER_URL = 'http://localhost:8081'

$('#login').click(function(e){
    let em = $('#exampleInputEmail').val()
    let pw = $('#exampleInputPassword').val()
    fetch(`${SERVER_URL}/admin/login`, {
        method: "POST",
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify({
            email: em,
            password: pw
        })
    }).then(res => res.json()).then(r => {
        console.log('res login', r)
        if(r.error) return console.log(r)
        else {
            localStorage.setItem('auth', r.token)
            localStorage.setItem('auth_email', r.email)
            window.location.href = 'index.html'
        }
    })
})