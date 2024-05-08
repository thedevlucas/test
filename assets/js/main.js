const elements = document.getElementsByClassName("loadingscreen");
const packsAnimations = 0;
const commentsAnimations = 0;

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
    });
});


setTimeout(() => {
    if (elements && elements.length > 0) {
        const firstElement = elements[0];
        if (firstElement) {
            firstElement.classList.add("appear");
            setTimeout(() => {
                firstElement.remove();
            }, 2000);
        }
    }  
}, 2000);

document.addEventListener("scroll", () => {
    if (packsAnimations == 0){
        const planElement = document.getElementsByClassName("plan");
        
        if (window.scrollY > 1200){
            if (planElement.length > 0){
                planElement[0].style.animation = "fadeInUp 2s 0.5s";
                setTimeout(() => {
                    planElement[0].classList.add("ready");
                }, 2000);
                
                setTimeout(() => {
                    planElement[1].style.animation = "fadeInUp 2s 0.5s";
                    setTimeout(() => {
                        planElement[1].classList.add("ready");
                    }, 2000);
                    setTimeout(() => {
                        planElement[2].style.animation = "fadeInUp 2s 0.5s";
                        setTimeout(() => {
                            planElement[2].classList.add("ready");
                            packsAnimations = 1;
                        }, 2000);
                    }, 500);
                }, 500);
            }
        }
    }
    if (commentsAnimations == 0){
        const elements2 = document.getElementsByClassName("leftStyleCard");
        const elements3 = document.getElementsByClassName("rightStyleCard");
        
        if (window.scrollY > 300){
            if (elements2.length > 0){
                elements2[0].style.animation = "fadeInLeft 1s 0.5s";
                setTimeout(() => {
                    elements2[0].classList.add("ready");    
                }, 1000);
            }
        }

        if (window.scrollY > 900){
            if (elements3.length > 0){
                elements3[0].style.animation = "fadeInRight 1s 0.5s";
                setTimeout(() => {
                    elements3[0].classList.add("ready");    
                }, 1000);
            }
        }

        if (window.scrollY > 1200){
            if (elements2.length > 0){
                elements2[1].style.animation = "fadeInLeft 1s 0.5s";
                setTimeout(() => {
                    elements2[1].classList.add("ready");    
                }, 1000);
            }
        }
    }
    
});
