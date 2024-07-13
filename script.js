const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~!@#$%^&*()_-+|\/?><,.[]{};';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set circle color to grey 
setIndicator("#ccc");


// set password Length

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min))+ "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`; 
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min; 
}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateRandomLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateRandomUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol(){
    let randomNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}



function calcstrength(){

    // start mai sab untick hai toh false

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // fir tick kiya checkbox toh usse true kro

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    // strength -> strong kab rahega jab usme num, uppper, lower, or pass size 8 se jada hoga
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }

    // strength -> medium kab rahega jab usme koi 2 attributes rahenge or size 6 se kam hoga
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }
    
}

// copy-clipboard
async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function shufflePassword(array){
    // Fisher Yates Method

    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];  
        array[i] = array[j];
        array[j] =temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special condition

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
}) 

inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
});


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }    

    // Finding the new password
    // remove old password

    password = "";

    // lets put the stuff mentioned by checkbox

    // if(uppercaseCheck.checked){
    //     password += generateRandomUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateRandomLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
     
    if(uppercaseCheck.checked){
        funcArr.push(generateRandomUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateRandomLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }


    // shuffle the password

    password = shufflePassword(Array.from(password));

    // show in UI

    passwordDisplay.value = password;

    // calculate strength

    calcstrength();




});





