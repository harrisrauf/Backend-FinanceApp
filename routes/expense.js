let express = require('express');
let executeQuery = require('../DB/db')
let router = express.Router();



router.get('/', async (req, res) => {
    result = await executeQuery('select * from public.expense ORDER BY date DESC');
    console.log(result)
    res.send(result.rows);
})


router.get('/total', async (req, res) => {
    var expenses = 0
    expenses= await executeQuery('SELECT SUM(price) FROM public.expense')
    res.send(expenses.rows)
});



router.get('/:id', async (req, res) => {
    id = req.params.id
    if (id == null || id == undefined) {
        res.sendStatus(400)
        return
    }

    result = await executeQuery('select * from public.expense where id= $1 ', [id]);
    if (result.rowCount == 0) {
        res.sendStatus(404)
        return
    }
    res.send(result.rows[0]);
});

router.post('/', async (req, res) => {
    let { price, description, date } = req.body;
    price=Number(price)

    if (!date || !description || !price) {
        res.sendStatus(400)
        return
    }
        if (price<0){
        res.sendStatus(400)
        return
    }
    try{
    result = await executeQuery("INSERT INTO public.expense(price, description, date) VALUES ( $1,$2,$3)", [price, description, date]);
    } catch(error){
        res.sendStatus(400)
    }

    res.send(result[0]);

})

/*lifecycle hooks vue*/

router.put('/:id', async (req, res) => {
    id = req.params.id
    if (id == null || id == undefined) {
        res.sendStatus(400)
        return
    }
    let {price, desc, date } = req.body;
    price=Number(price)
    if (!date || !desc || !price) {
        res.sendStatus(400)
        return
    }
    if (price<0){
        res.sendStatus(400)
        return ('Price can not be negative')
    }
    const checklen = await executeQuery('select * from public.expense where id= $1 ', [id]);
    if (checklen.rows.length == 0) {
        res.sendStatus(404)
        return
    }
    try{
    await executeQuery('UPDATE public.expense SET price= $1 , description= $2 , date= $3 WHERE id= $4 ', [price, desc, date, id])
    res.sendStatus(200)
    } catch(error){
        res.sendStatus(400)
    }
})

router.delete('/:id', async (req, res) => {
    id = req.params.id
    if (!id) {
        res.sendStatus(400)
        return
    }
    checklen = await executeQuery('select * from public.expense where id= $1 ', [id]);
    if (checklen.rows.length == 0) {
        res.sendStatus(404)
        return
    }
    executeQuery('DELETE FROM public.expense WHERE id= $1 ', [id])
    res.sendStatus(200)
})



module.exports = router


