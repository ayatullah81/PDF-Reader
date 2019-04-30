const url = '../docs/pdf.pdf';

// state of page
let pdfDoc,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null,
    rotateNum = 0;

const scale = 2,
        canvas = document.querySelector('#pdf-render'),
        ctx = canvas.getContext('2d');

// Render the page
const renderPage = () => {
    pageIsRendering = true;
    pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.transform = 'rotate('+rotateNum+'deg)';
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
        // output current page num
        document.querySelector('#page-num').textContent = pageNum;
    })
}


// Show prev page
const showPrevPage = () =>{
    if(pageNum <= 1){
        return;
    }
    pageNum--;
    renderPage(pageNum);
}

// Show Next page
const showNextPage = () =>{
    if(pageNum >= 5){
        return;
    }
    pageNum++;
    renderPage(pageNum);
}

// rotate page

const rotatePage = () => {
    if(rotateNum < 180){
        rotateNum = rotateNum + 90;
        renderPage(pageNum, rotateNum);
    }else if(rotateNum >= 180){
        rotateNum = -90;
        renderPage(pageNum, rotateNum);
    }
}

// to get the pdf document

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    
    renderPage(pageNum);
})
.catch(err => {
    const div = document.createElement('div');
    div.className = 'error'
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    document.querySelector('.top-bar').style.display = 'none';
})

document.getElementById('next-page').addEventListener('click', showNextPage);
document.getElementById('prev-page').addEventListener('click', showPrevPage);
document.querySelector('.rotate-page').addEventListener('click', rotatePage);