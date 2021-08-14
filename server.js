const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const capacity=60

var listClasses={}
listClasses["yoga"]={}
listClasses["gym"]={}
listClasses["dance"]={}
listClasses["yoga"]["18:00-18:30"]=new Set()

var waitlist={}
waitlist["yoga"]={}
waitlist["gym"]={}
waitlist["dance"]={}
waitlist["yoga"]["18:00-18:30"]=new Set()

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/register', async (req, res) => {
	const { userid, classes, start, end } = req.body
    if(!(classes in listClasses))
    return res.json({ status: 'error', error: 'Invalid class' })
    
    const dur=start+"-"+end
    
    if(!(dur in listClasses[classes]))
    return res.json({ status: 'error', error: 'Invalid time slot' })

    if(listClasses[classes][dur].has(userid))
    return res.json({ status: 'error', error: 'Already registered' })

    if(listClasses[classes][dur].size>60){
        waitlist[classes][dur].add(userid)
    return res.json({ status: 'error', error: 'Capacity full adding to waitlist' })}

    listClasses[classes][dur].add(userid)
    return res.json({ status: 'Success', msg: 'Registered Successfully' })
})

app.post('/api/cancel', async (req, res) => {
	const { userid, classes, start, end } = req.body
    var d = new Date();
    var hours=d.getHours();
    var mins=d.getMinutes();
    var extra=Math.floor((mins+30)/60)
    mins=(mins+30)%60
    hours=(hours+extra)%24
    res=""
    if(!(classes in listClasses))
    return res.json({ status: 'error', error: 'Invalid class' })
    
    const dur=start+"-"+end
    
    if(!(dur in listClasses[classes]))
    return res.json({ status: 'error', error: 'Invalid time slot' })

    if(hours<10){
        res=res+"0"+hours+":"
    }
    else{
        res=res+hours+":"
    }
    if(mins<10){
        res=res+"0"+mins
    }
    else{
        res=res+mins
    }
    if(res>start)
    return res.json({ status: 'error', error: 'Less than 30 mins for class to start' })

    listClasses[classes][dur].delete(userid)
    if(waitlist[classes][dur].size>0){
        listClasses[classes][dur].add(waitlist[classes][dur][0])
        waitlist[classes][dur].delete(waitlist[classes][dur][0])
    }
    return res.json({ status: 'Success', msg: 'Cancelled Successfully' })

})
app.listen(9999, () => {
	console.log('Server up at 9999')
})