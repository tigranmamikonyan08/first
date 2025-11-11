const section = document.getElementsByTagName('section')[0]
const controller = document.querySelector('.controller')
const screen = document.querySelector('.screen')
const addButton = document.querySelector('.add')
const divCountArr = []
const screenDivs = []
const miniDivs = []

class DivType{
    constructor(name){
        this.name = name
    }

    addDivType(){
        const div = document.createElement('div')
        const h2 = document.createElement('h2')
        const ul = document.createElement('ul')
        const li1 = document.createElement('li')
        const li2 = document.createElement('li')
        const li3 = document.createElement('li')
        const removeBtn = document.createElement('div')
        removeBtn.textContent = 'X'
        removeBtn.classList.add('removeBtn')
        ul.classList.add('newDivli')
        li1.textContent = 'Add txt'
        li2.textContent = 'Add img'
        li3.textContent = 'Add div'
        div.classList.add('divType')
        h2.textContent = this.name
        h2.style.textAlign = 'center'
        li2.style.margin = '10px 0 10px 0'

        div.append(removeBtn)
        ul.append(li1,li2,li3)
        div.append(h2)
        div.append(ul)
        section.append(div)

        return div
    }
}

class Div{
    constructor(count){
        this.name = `Div `
        this.count = count

        const arr = JSON.parse(localStorage.getItem('controllerDivs')) || []
        const id = arr.find( (el)=>{
            return el.count === this.count
        })

        this.id = id?.id || Math.random().toString()
    }

    
    
    createDiv(){
        const div = document.createElement('div')
        div.textContent = this.name + this.count
        div.classList.add('controllerDiv')
        div.dataset.id = this.id
        controller.append(div)
        

        if(div?.previousElementSibling?.classList.contains('controllerDiv') && div.previousElementSibling.children.length > 0){
            const lastEl = div.previousElementSibling.children[div.previousElementSibling.children.length - 1]  
            div.style.marginTop = `${lastEl?.offsetTop}px`
        }


        return div
    }
}

    

class ScreenDiv{
    constructor(name,info,id){
        this.name = name
        this.info = `${info}`
        this.id = id
    }

    screenDivAdd(){
        const div = document.createElement('div')
        div.classList.add('screenDivStyle')
        div.dataset.id = this.id
        const h2 = document.createElement('h2')
        h2.textContent = this.name
        const p = document.createElement('p')
        const img = document.createElement('img')
        // img.src = this.info
        p.textContent = this.info
        if (p.textContent.startsWith('https://')) {
            div.append(img)
            img.src = this.info
        }

        screen.append(div)
        div.append(h2)
        div.append(p)

        return div
    }
}

class MiniDivs{
    constructor(txt,presentDivCount,type,id){
        this.txt = txt
        this.presentDivCount = presentDivCount
        this.type = type
        this.id = id
    }

    createMiniDiv(){
        const div = document.createElement('div')
        div.textContent = this.txt
        div.dataset.id = this.id
        div.style.width = '50px'

        
        console.log(this.presentDivCount);
        

        if(this.presentDivCount === 0){
            div.style.marginLeft = `${(this.presentDivCount + 1)* 120}px`
            div.style.marginTop = `${(this.presentDivCount + 1) * 70}px`
        }else{
            div.style.marginLeft = `120px`
            div.style.marginTop = `${(this.presentDivCount + 1) * 70}px`
        }

        if (this.type === 'div') {
            div.classList.add('controllerDiv2')
            div.style.marginLeft = `${(this.presentDivCount + 1)* 120}px`
            div.style.marginTop = `${(this.presentDivCount + 1) * 70}px`
        }

        return div
    }
}

if (localStorage.getItem('controllerDivs')) {
    JSON.parse(localStorage.getItem('controllerDivs')).forEach((obj)=>{
        divCountArr.push(obj)
        const newDiv = new Div(obj.count)
        newDiv.createDiv()
    })
}

if (localStorage.getItem('screenDivs')) {
    JSON.parse(localStorage.getItem('screenDivs')).forEach((obj)=>{
        screenDivs.push(obj)
        const newScreenDiv = new ScreenDiv(obj.name,obj.info,obj.id)
        newScreenDiv.screenDivAdd()
        
    })
}

if (localStorage.getItem('miniDivs')) {
    let miniDivsArr = JSON.parse(localStorage.getItem('miniDivs'))
    
    controller.childNodes.forEach((el)=>{
        if (el.classList?.contains('controllerDiv')) {
                miniDivsArr.forEach((obj)=>{
                if (obj.id === el.dataset.id) {
                    let miniDiv = new MiniDivs(obj.txt,obj.presentDivCount,obj.type,obj.id)
                    miniDivs.push(obj)
                    el.append(miniDiv.createMiniDiv())
                }
            })
        }
    });   
}

controller.addEventListener('click', (e)=>{ 
    if (divCountArr.length >= 27 && e.target.classList.contains('add')) {
        alert('End')
    }
    if (divCountArr.length < 27 && e.target.classList.contains('add')) {
        const controllerDiv = new Div(divCountArr.length+1)
        
        controllerDiv.createDiv()
        divCountArr.push(controllerDiv)
        
        localStorage.setItem('controllerDivs', JSON.stringify(divCountArr))
    }
    if (e.target.classList.contains('controllerDiv')){
        const divName = e.target.firstChild.textContent
        
        const divType = new DivType(divName +' add')
        let newDiv = divType.addDivType()
        let presentDiv = e.target   
        controller.style.opacity = '0.5'
        newDiv.addEventListener('click',(e)=>{
            if (e.target.classList.contains('removeBtn')) {
                section.lastElementChild.remove()
                presentDiv.style.backgroundColor = 'white'
                controller.style.pointerEvents = 'all'
                controller.style.opacity = '1'
            }
            if (e.target.textContent === 'Add txt') {
                let txt = prompt('type txt')
                if (txt) {
                    controller.style.opacity = '1'
                    controller.style.pointerEvents = 'all'
                    section.lastElementChild.remove()

                    let k = screenDivs.find((el)=>{
                        return el.id === presentDiv.dataset.id
                    })
                    
                    if (k) {
                        k.info += `\n${txt}`
                        screen.childNodes.forEach((el)=>{
                            if (el.dataset.id === k.id) {
                                el.lastElementChild.textContent += `\n${txt}`
                            }
                        })
                    }else{
                        let screenDiv = new ScreenDiv(divName,`${txt}`,presentDiv.dataset.id)
                        screenDiv.screenDivAdd()
                        screenDivs.push(screenDiv)
                    }
                    localStorage.setItem('screenDivs', JSON.stringify(screenDivs))

                    const miniDiv = new MiniDivs(txt,presentDiv.childElementCount,'txt',presentDiv.dataset.id)
                    presentDiv.append(miniDiv.createMiniDiv())
                    miniDivs.push(miniDiv)
                    localStorage.setItem('miniDivs', JSON.stringify(miniDivs))                    
                }
            }
            if (e.target.textContent === 'Add img') {
                let url = prompt('type URL')
                if(url.startsWith('https://')){
                    presentDiv.style.backgroundColor = 'gray'
                    presentDiv.style.pointerEvents = 'none'
                    controller.style.opacity = '1'
                    controller.style.pointerEvents = 'all'
                    section.lastElementChild.remove()
                    let screenDivImg = new ScreenDiv(divName, url)
                    console.log(url);
                    
                    screenDivImg.screenDivAdd() 
                    console.log(screenDivImg.info);
                    screenDivs.push(screenDivImg)
                    console.log(screenDivs);
                    console.log(divCountArr);
                    
                    
                    localStorage.setItem('screenDivs', JSON.stringify(screenDivs))
                }else{
                    alert('type URL')
                }
            }
            if (e.target.textContent === 'Add div') {
                let divTxt = prompt('type div txt')
                if (divTxt) {
                    controller.style.opacity = '1'
                    controller.style.pointerEvents = 'all'
                    section.lastElementChild.remove()
                    let k = screenDivs.find((el)=>{
                        return el.id === presentDiv.dataset.id
                    })
                    
                    if (k) {
                        k.info += `\n${divTxt}`
                        screen.childNodes.forEach((el)=>{
                            if (el.dataset.id === k.id) {
                                el.lastElementChild.textContent += `\n${divTxt}`
                            }
                        })
                    }else{
                        let screenDiv = new ScreenDiv(divName,`${divTxt}`,presentDiv.dataset.id)
                        screenDiv.screenDivAdd()
                        screenDivs.push(screenDiv)
                    }

                    const miniDiv = new MiniDivs(divTxt,presentDiv.childElementCount,'div',presentDiv.dataset.id)
                    presentDiv.append(miniDiv.createMiniDiv())
                    
                    localStorage.setItem('screenDivs', JSON.stringify(screenDivs))
                    miniDivs.push(miniDiv)
                    localStorage.setItem('miniDivs', JSON.stringify(miniDivs))


                }
                
            }
            
        })
        
    }
})


