const regForm = document.getElementById('reg-form')
regForm.addEventListener('submit', registerClass)

const cancForm = document.getElementById('canc-form')
cancForm.addEventListener('submit', cancelClass)

async function registerClass(event) {
    event.preventDefault()

    const userid = document.getElementById('userid').value
    const classes = document.getElementById('class').value
    const start = document.getElementById('start').value
    const end = document.getElementById('end').value

    console.log(userid,classes,start,end)
    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid,
            classes,
            start,
            end
        })
    }).then((res) => res.json())
    console.log(result)
}

async function cancelClass(event) {
    event.preventDefault()

    const userid = document.getElementById('useridCancel').value
    const classes = document.getElementById('classCancel').value
    const start = document.getElementById('startCancel').value
    const end = document.getElementById('endCancel').value

    console.log(userid,classes,start,end)
    const result = await fetch('/api/cancel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid,
            classes,
            start,
            end
        })
    }).then((res) => res.json())
    console.log(result)
}