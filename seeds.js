const mongoose = require('mongoose');

const Story = require('./models/story')

mongoose.connect('mongodb://localhost:27017/jelli', {useNewUrlParser: true, useUnifiedTopology: true})
    .then( ()=> {
        console.log("Mongo connected");
    })
    .catch( (err)=> {
        console.log("Mongo error : ", err);
    })

const seedArray = [
    {
        title: 'Grapefruits are awesome',
        author: '@anon',
        // date: Date.now,
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur distinctio odio eveniet obcaecati sequi tempore perferendis nostrum. Officia at, earum modi sed eum magnam obcaecati magni. Iusto pariatur incidunt magnam!'
    },
    {
        title: 'Grapefruits are awesome2',
        author: '@anon',
        // date: Date.now,
        text: '2Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur distinctio odio eveniet obcaecati sequi tempore perferendis nostrum. Officia at, earum modi sed eum magnam obcaecati magni. Iusto pariatur incidunt magnam!'
    },
    {
        title: 'Grapefruits are awesome3',
        author: '@anon',
        // date: Date.now,
        text: '3Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur distinctio odio eveniet obcaecati sequi tempore perferendis nostrum. Officia at, earum modi sed eum magnam obcaecati magni. Iusto pariatur incidunt magnam!'
    },
    {
        title: 'Grapefruits are awesome4',
        author: '@anon',
        // date: Date.now,
        text: '4Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur distinctio odio eveniet obcaecati sequi tempore perferendis nostrum. Officia at, earum modi sed eum magnam obcaecati magni. Iusto pariatur incidunt magnam!'
    }
]

Story.insertMany(seedArray)
    .then( (res)=>{
        console.log(res);
    })
    .catch( (e)=> {
        console.log(e);
    })