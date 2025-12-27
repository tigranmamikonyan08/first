const container = document.querySelector('.container')
const controller = document.querySelector('.controller')
const screen = document.querySelector('.screen')
const allControllerDivs = []
const allScreenDivs = []

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
    div.classList.add('controllerDiv', 'first')
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
    addToScreen(box,div.dataset.id)

    localStorage.setItem('divs',JSON.stringify(allControllerDivs))
    return div
}

function addToController(type){
    if (type.textContent === 'Add Txt') {
        const txtName = prompt('Add txt')
        const p = document.createElement('p')
        p.textContent = txtName

        const res = deepFind(allControllerDivs, item => item.id === type.parentElement.dataset.id)

        res.children.push({
            name: txtName,
            type: 'txt',
            // id: type.parentElement.dataset.id,
        })

        
        const currentDiv = controller.querySelector(`[data-id = '${type.parentElement.dataset.id}']`)
        currentDiv.append(p)
        addToScreen(p,'',res)
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

        
        let res = deepFind(allControllerDivs, item => item.id === type.parentElement.dataset.id)
        
        console.log(res);
        
        
        res.children.push({
            name: divTxt,
            type: 'box',
            id: div.dataset.id,
            children: []
        })        
        

        const currentDiv = controller.querySelector(`[data-id = '${type.parentElement.dataset.id}']`)

        
        div.append(box)
        currentDiv.append(div)
        addToScreen(box,div.dataset.id,res)

        localStorage.setItem('divs',JSON.stringify(allControllerDivs))
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

function addToScreen(item,id = 'null',parentEl){

    

    if (item.localName === 'div') {
        const wrapper = document.createElement('div')
        wrapper.classList.add('screenDiv')
        wrapper.dataset.id = id
        const h2 = document.createElement('h2')
        h2.textContent = item.textContent
    
        let res = deepFind(allScreenDivs, item => item.id === parentEl?.id)

        console.log(res);
        

        if (res?.hasOwnProperty('id')) {
            res.children.push({
            name: item.textContent,
            id: id,
            children: []
        })
            let currentDiv = screen.querySelector(`[data-id = '${res?.id}']`)
            wrapper.append(h2)
            currentDiv.append(wrapper)
            localStorage.setItem('screenDivs', JSON.stringify(allScreenDivs))
            return
    }else{
        allScreenDivs.push({
        name: item.textContent,
        id:id,
        children: []
    })
    }

    wrapper.append(h2)
    screen.append(wrapper)
    }
    if (item.localName === 'p') {
        const p = document.createElement('p')
        p.textContent = item.textContent

        console.log(parentEl);
        
        let res = deepFind(allScreenDivs, item=> item.id === parentEl.id)

        res.children.push({
            name: item.textContent
        })
        
        let currentDiv = screen.querySelector(`[data-id = '${res.id}']`)
        
        currentDiv.append(p)
        
        
    }
    
    localStorage.setItem('screenDivs', JSON.stringify(allScreenDivs))
    
    

}


function renderElement(obj, parentEl) {
    let wrapper = document.createElement('div');
    wrapper.classList.add('controllerDiv');
    wrapper.dataset.id = obj.id;

    let box = document.createElement('div');
    box.textContent = obj.name;
    box.classList.add('box');

    wrapper.append(box);
    parentEl.append(wrapper);
    
    if (wrapper.parentElement.classList.contains('controller')){
        wrapper.classList.add('first')
    }

    // Если есть дети → обрабатываем рекурсивно
    if (obj.children && obj.children.length > 0) {
        obj.children.forEach(child => {

            if (child.type === 'txt') {
                const p = document.createElement('p');
                p.textContent = child.name;
                wrapper.append(p);
            }

            if (child.type === 'box') {
                // РЕКУРСИЯ — важнейшая часть!
                renderElement(child, wrapper);
            }
        });
    }
}

function renderScreenElement(obj, parentEl){
    const wrapper = document.createElement('div')
    wrapper.classList.add('screenDiv')
    const h2 = document.createElement('h2')
    h2.textContent = obj.name
    wrapper.append(h2)
    wrapper.dataset.id = obj.id
    const p = document.createElement('p')
    p.textContent = obj.name

    if (obj.hasOwnProperty('id')) {
        parentEl.append(wrapper)
    }else{
        parentEl.append(p)
    }

    if (obj.children?.length && obj.children?.length > 0) {
        obj.children.forEach(child=>{
            renderScreenElement(child,wrapper)
        })
    }
}


if (localStorage.getItem('divs')) {
    const storageDivs = JSON.parse(localStorage.getItem('divs'));

    storageDivs.forEach(obj => {
        renderElement(obj, controller);
        allControllerDivs.push(obj);
    });
}

if (localStorage.getItem('screenDivs')) {
    const storageScreenDivs = JSON.parse(localStorage.getItem('screenDivs'))

    storageScreenDivs.forEach(obj=>{
        renderScreenElement(obj,screen)
        allScreenDivs.push(obj)
    })
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
