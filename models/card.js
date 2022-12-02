const { Schema, model } = require('mongoose')

const Card = new Schema({

})
// equire.main.filename

// class Card {
//     // Object
//     static async add(course) {
//         const card = await this.fetch()
//         const i = card.courses.findIndex(k => k.id === course.id)
//         const candidate = card.courses[i]
        
//         if (candidate) {
//             // is
//             candidate.count++
//             card.courses[i] = candidate
//         } else {
//             // add course
//             course["count"] = 1
//             card.courses.push(course)
//         }

//         card.price += Number(course.price)

//         return new Promise((resolve, reject) => {
//             fs.writeFile(path.join(__dirname, '..', 'data', 'card.json'), JSON.stringify(card), (err) => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve()
//                 }
//             })
//         })

//     }

//     static async remove(id) {
//         console.log(id)
//         const card = await this.fetch()
//         let i = card.courses.findIndex(k => k.id === id)
//         const course = card.courses[i]
        
//         if (course.count === 1) {
//             card.courses = card.courses.filter(k => k.id !== id)
//         } else {
//             card.courses[i].count--
//         }
        
//         card.price -= Number(course.price)

//         return new Promise((resolve, reject) => {
//             fs.writeFile(path.join(__dirname, '..', 'data', 'card.json'), JSON.stringify(card), (err) => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve(card)
//                 }
//             })
//         })
//     }

//     static async fetch() {
//         return new Promise((resolve, rejects) => {
//             fs.readFile(path.join(__dirname, '..', 'data', 'card.json'), 
//             'utf-8', 
//             (err, content) => {
//                 if (err) {
//                     rejects(err)
//                 } else {
//                     resolve(JSON.parse(content))
//                 }
//             })
//         })
//     }

// }

module.exports = Card

