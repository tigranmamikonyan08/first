const container = document.querySelector('.container')
const controller = document.querySelector('.controller')
const screen = document.querySelector('.screen')
const allControllerDivs = []
const allScreenDivs = []

//funkciayov h2 cher linum
// function divTypeMenu(){
//     const div = document.createElement('div')
//     div.classList.add('divTypeMenu')
//     const h2 = document.createElement('h2')
//     controller.addEventListener('click',(e)=>{
//         if (true) {
//             const h2Name = e.target.textContent
//             h2.textContent = h2Name 
            
//         }
//     })
//     const addTxt = document.createElement('p')
//     addTxt.textContent = 'Add Txt'
//     const addChildDiv = document.createElement('p')
//     addChildDiv.textContent = 'Add Div'

//     div.append(h2)
//     div.append(addTxt)
//     div.append(addChildDiv)
//     container.append(div)

//     return div
// }

class DivTypeMenu{
    constructor(h2Name,id){
        this.h2Name = h2Name
        this.id = id
    }

    addDivTypeMenu(){
        const div = document.createElement('div')
        div.classList.add('divTypeMenu')
        div.dataset.id = this.id
        const h2 = document.createElement('h2')
        h2.textContent = this.h2Name
        const addTxt = document.createElement('p')
        addTxt.textContent = 'Add Txt'
        addTxt.style.cursor = 'pointer'
        const addChildDiv = document.createElement('p')
        addChildDiv.textContent = 'Add Div'
        addChildDiv.style.cursor = 'pointer'
        const xBtn = document.createElement('i')
        xBtn.classList.add('fa-solid', 'fa-xmark')

        div.append(h2)
        div.append(addTxt)
        div.append(addChildDiv)
        div.prepend(xBtn)
        container.append(div)

        return div
    }
}

function addDiv() {
    const div = document.createElement('div')
    div.classList.add('controllerDiv')
    div.dataset.id = Math.random()
    const box = document.createElement('div')
    box.textContent = `Div ${allControllerDivs.length + 1}`
    box.classList.add('box')

    allControllerDivs.push({
        name: box.textContent,
        type: 'box',
        id: div.dataset.id,
        children: []
    })
    
    div.append(box)
    controller.append(div)
    addtoScreen(box.textContent,div.dataset.id)
    
    const currentScreenDiv = allScreenDivs.find((el)=>{
        return el.id === div.dataset.id
    })

    if (currentScreenDiv) {
        const screenDiv = document.createElement('div')
        const h2 = document.createElement('h2')
        screenDiv.dataset.id =div.dataset.id
        screenDiv.classList.add('screenDiv')
        h2.textContent = currentScreenDiv.name
        screenDiv.append(h2)
        screen.append(screenDiv) 
    }
    
    
    localStorage.setItem('divs',JSON.stringify(allControllerDivs))
    localStorage.setItem('screenDivs', JSON.stringify(allScreenDivs))

    return div
}

function addToController(type){
    if (type.textContent === 'Add Txt') {
        const txtName = prompt('Add txt')
        const p = document.createElement('p')
        p.textContent = txtName
        // const currentDivObj = allControllerDivs.find((obj)=>{
        //     return obj.id === type.parentElement.dataset.id
        // })
        // currentDivObj.children.push({
        //     name: txtName,
        //     type: 'txt',
        //     id: type.parentElement.dataset.id
        // })

        const res = deepFind(allControllerDivs, item => item.id === type.parentElement.dataset.id)

        res.children.push({
            name: txtName,
            type: 'txt',
            id: type.parentElement.dataset.id,
        })

        // const screenCurrentObj = allScreenDivs.find((obj)=>{
        //     return obj.id === currentDivObj.id
        // })

        // screenCurrentObj?.pTags.push({
        //     name: txtName
        // })

        // console.log(screenCurrentObj);
         
        // const currentScreenDiv = screen.querySelector(`[data-id = '${screenCurrentObj.id}']`)
        // const screenP = document.createElement('p')
        // screenP.textContent = txtName
        // currentScreenDiv.append(screenP)
        
        const currentDiv = controller.querySelector(`[data-id = '${type.parentElement.dataset.id}']`)
        currentDiv.append(p)
        localStorage.setItem('divs',JSON.stringify(allControllerDivs))
        localStorage.setItem('screenDivs', JSON.stringify(allScreenDivs))
    }

    if (type.textContent === 'Add Div'){
        const divTxt = prompt('add div')
        const div = document.createElement('div')
        div.classList.add('controllerDiv')
        div.dataset.id = Math.random()
        const box = document.createElement('div')
        box.textContent = divTxt
        box.classList.add('box')

        // const currentDivObj = allControllerDivs.find((obj)=>{
        //     return obj.id === type.parentElement.dataset.id
        // })


        // if (currentDivObj) {
        //     currentDivObj.children.push({
        //     name: divTxt,
        //     type: 'box',
        //     id: div.dataset.id,
        //     children: []
            
        // })
        // }

        

        let res = deepFind(allControllerDivs, item=> item.id === type.parentElement.dataset.id)

        res.children.push({
             name: divTxt,
            type: 'box',
            id: div.dataset.id,
            children: []
        })
        console.log(res);
        
        

        const currentDiv = controller.querySelector(`[data-id = '${type.parentElement.dataset.id}']`)
        div.append(box)
        currentDiv.append(div)
        localStorage.setItem('divs',JSON.stringify(allControllerDivs))

        
        
        


        // ---------------------------------------------------------------------


        // const screenCurrentObj = allScreenDivs.find((obj)=>{
        //     return obj.id === currentDivObj.id
        // })

        // screenCurrentObj?.pTags.push({
        //     name: divName
        // })

        // console.log(screenCurrentObj);
        
        
        // const currentScreenDiv = screen.querySelector(`[data-id = '${screenCurrentObj.id}']`)
        // const screenDiv = document.createElement('div')
        // screenDiv.textContent = divName
        // currentScreenDiv.append(screenDiv)
        
        // const currentDiv = controller.querySelector(`[data-id = '${type.parentElement.dataset.id}']`)
        // currentDiv.append(box)
        // localStorage.setItem('divs',JSON.stringify(allControllerDivs))
        // localStorage.setItem('screenDivs', JSON.stringify(allScreenDivs))
    }

}

function deepFind(arr, predicate) {
    for (let i = 0; i < arr.length; i++) {    
        const item = arr[i];
        if (predicate(item)) {   
            return item;
        }

        if (item.children && item.children.length > 0) {
            const found = deepFind(item.children, predicate);
            if (found) return found;    
        }    
    }
    
    return undefined;
}

function addtoScreen(h2Name,id,children = []){
    allScreenDivs.push({
        name: h2Name,
        id: id,
        pTags: children
    })
    
}


if (localStorage.getItem('screenDivs')) {
    const storageScreenDivs = JSON.parse(localStorage.getItem('screenDivs'))
    
    storageScreenDivs.forEach((obj)=>{
        const div = document.createElement('div')
        const h2 = document.createElement('h2')
        div.dataset.id = obj.id
        div.classList.add('screenDiv')
        h2.textContent = obj.name
        div.append(h2)
        screen.append(div)

        obj.pTags.forEach((p)=>{
            const txt = document.createElement('p')
            txt.textContent = p.name
            div.append(txt)
        })

        allScreenDivs.push(obj)
    })
    
}

if (localStorage.getItem('divs')) {
    const storageDivs = JSON.parse(localStorage.getItem('divs'))
    storageDivs.forEach(obj => {
        const div = document.createElement('div')
        div.classList.add('controllerDiv')
        div.dataset.id = obj.id
        const box = document.createElement('div')
        box.textContent = obj.name
        box.classList.add('box')
  
        div.append(box)
        controller.append(div)

        if (obj.children.length) {
            obj.children.forEach((childObj)=>{
                if(childObj.type === 'txt') {
                    const p = document.createElement('p')
                    p.textContent = childObj.name
                    div.append(p)
                }
                if (childObj.type === 'box') {
                    const childDiv = document.createElement('div')
                    childDiv.classList.add('controllerDiv')
                    const childBox = document.createElement('div')
                    childBox.textContent = childObj.name
                    childBox.classList.add('box')
                    
                    childDiv.append(childBox)
                    div.append(childDiv) 
                    console.log(div);
                    
                }
            })     
        }
        allControllerDivs.push(obj)
    });
}


let hasDivTypeMenu = false
controller.addEventListener('click', (e)=>{
    if (e.target.localName === 'i') {
        addDiv()
        
    }
    if (e.target.classList.contains('box')) {
        if (!hasDivTypeMenu) {
            const addDivTypeMenu = new DivTypeMenu(`${e.target.childNodes[0].textContent} add`,e.target.parentElement.dataset.id)
            let typeMenuAdd = addDivTypeMenu.addDivTypeMenu()
            controller.style.opacity = '0.3'
            hasDivTypeMenu = true
            typeMenuAdd.addEventListener('click',(e)=>{
                if (e.target.localName === 'i'){
                    e.target.parentElement.remove()
                    controller.style.opacity = '1'
                    hasDivTypeMenu = false
                }
                if (e.target.localName === 'p'){
                    addToController(e.target)
                    e.target.parentElement.remove()
                    hasDivTypeMenu = false
                    controller.style.opacity = '1'
                }
            })
        }
    }
})

