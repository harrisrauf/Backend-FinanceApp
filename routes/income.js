let express = require('express');
let executeQuery = require('../DB/db')
let router = express.Router();


router.get('/', async (req, res) => {
    result = await executeQuery('select * from public.income ORDER BY date DESC');
    res.send(result.rows);
});

router.get('/total', async (req, res) => {
    var incomes = 0
    incomes= await executeQuery('SELECT SUM(amount) FROM public.income')
    res.send(incomes.rows)
});



router.get('/:id', async (req, res) => {
    id = req.params.id
    if (id == null || id == undefined) {
        res.sendStatus(400)
        return
    }
    result = await executeQuery('select * from public.income where id= $1 ', [id]);
    if (result.rows.length == 0) {
        res.sendStatus(404)
        return
    }
    res.send(result.rows[0]);
});


router.post('/', async (req, res) => {
    let { amount, desc, date } = req.body;
    amount=Number(amount)
    if (!date || !desc || !amount) {
        res.sendStatus(400)
        return
    }
        if (amount<0){
        res.sendStatus(400)
        return ('Amount can not be negative')
    }
        // if (typeof Number(amount)!=='number'){
        // res.sendStatus(400)
        // return ('Amount can not be non numerical')
        // }
    try{    
    result = await executeQuery("INSERT INTO public.income(amount, description, date) VALUES ($1, $2, $3)", [amount, desc, date]);
    res.sendStatus(200) 
    } catch(error){
        res.sendStatus(400)
    }
    res.send(result.rows[0]);
})

router.put('/:id', async (req, res) => {
    id = req.params.id
    if (id == null || id == undefined) {
        res.sendStatus(400)
        return('noID')
    }
    let { amount, desc, date } = req.body;
    amount=Number(amount)
    console.log(amount.type)
    if (!date || !desc || !amount) {
        res.sendStatus(400)
        return
    }
        if (amount<0){
        res.sendStatus(400)
        return
    }

    
    console.log({ amount, desc, date })
    checklen = await executeQuery('select * from public.income where id= $1 ', [id]);
    if (checklen.rows.length == 0) {
        res.sendStatus(404)
        return
    }
    try{
    await executeQuery('UPDATE public.income SET amount= $1, description= $2,date= $3  WHERE id= $4', [amount, desc, date, id])
    res.sendStatus(200)
    } catch(error){
        res.sendStatus(400)
    }
})

router.delete('/:id', async (req, res) => {
    id = req.params.id
    if (id == null || id == undefined) {
        res.sendStatus(400)
        return
    }
    checklen = await executeQuery('select * from public.income where id= $1 ', [id]);
    if (checklen.rows.length == 0) {
        res.sendStatus(404)
        return
    }
    executeQuery('DELETE FROM public.income WHERE id= $1 ', [id])
    res.sendStatus(200)
})


module.exports = router