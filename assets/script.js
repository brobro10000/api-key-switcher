//initializes localStorage with keyCount
function localKeyCount(keyLength, calls, expirationHours, secretKey) {
    let dateScale = (expirationHours * 3600 * 1000)
    let time = parseInt(localStorage.getItem(`createdAt${secretKey}`))
    let date = new Date(time + dateScale)

    if (localStorage.getItem(`keyCount${secretKey}`) == null || localStorage.getItem(`createdAt${secretKey}`) == null) {
        return setStorage(keyLength, calls, expirationHours, secretKey)
    } else {
        let time = parseInt(localStorage.getItem(`createdAt${secretKey}`))
        let date = new Date(time + dateScale)

        console.log(`Your keys will refresh on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`)
        return removeStorage(keyLength, calls, expirationHours, secretKey, time)
    }
}

function setStorage(keyLength, calls, expirationHours, secretKey,) {
    let currentDate = new Date()
    let dateToday = (Date.parse(Date()))

    keyValues = populateKeyCount(keyLength, calls);
    localStorage.setItem(`keyCount${secretKey}`, JSON.stringify(keyValues))
    localStorage.setItem(`createdAt${secretKey}`, dateToday)

    console.log(`Key calls created on ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`)

    return localKeyCount(keyLength, calls, expirationHours, secretKey)
}

function removeStorage(keyLength, calls, expirationHours, secretKey, time) {
    let value = JSON.parse(localStorage.getItem(`keyCount${secretKey}`))
    let dateToday = (Date.parse(Date()))
    let dateScale = (expirationHours * 3600 * 1000)

    if (dateToday > (dateScale + time)) {
        localStorage.removeItem(`createdAt${secretKey}`);
        localStorage.removeItem(`keyCount${secretKey}`)

        return localKeyCount(keyLength, calls, expirationHours, secretKey)
    } else {
        return value
    }

}
//Populate keys with maxCall amount from localKeyCount
function populateKeyCount(arrLength, calls) {
    let arr = new Array(arrLength)
    let unique = uniqueArr(arrLength)

    for (var j = 0; j < arrLength; j++) {
        arr[j] = ([unique[j], calls])
    }

    return Object.fromEntries(arr)
};
function uniqueArr(arrLength) {
    let uniqueArr = []
    let i = 0;

    while (uniqueArr.length < arrLength) {
        uniqueArr.push(getRandom(1, 10000))
        if (uniqueArr.indexOf(uniqueArr[i]) == -1) {
            i++
        } else {
            uniqueArr[i] = getRandom(1, 10000)
        }
    }

    return uniqueArr
}
//Best best key with most calls remaining
function pickBestKey(keyCount) {
    let keyObj = Object.entries(keyCount)
    let bestKey = keyObj[0]
    let bestKeyIndex = 0;

    keyObj.forEach((element, index) => {
        if (element[1] > bestKey[1]) {
            bestKey = element
            bestKeyIndex = index
        }
    })

    if (bestKey[1] == 0) {
        return -1
    } else {
        return bestKeyIndex
    }
};

//updates localStorage with 
function updateKeyCount(keyIndex, keyCount, secretKey) {
    let keyArr = Object.entries(keyCount)

    keyArr[keyIndex][1]--

    return localStorage.setItem(`keyCount${secretKey}`, JSON.stringify(Object.fromEntries(keyArr)))
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fetchAPI() {
    const secretKey = 'abc123' //Enter a unique string for each fetch that usees a different set of keys
    const keys = ['trueKey1', 'trueKey2', 'trueKey3', 'trueKey4']; //Your actual API Key at each index for each amount of keys
    const maxCalls = 3 //someInteger of Max calls for API
    const expirationHours = 24
    const keyCount = localKeyCount(keys.length, maxCalls, expirationHours, secretKey) //initializes keyCount with localStorage keyCount object

    if (pickBestKey(keyCount) == -1) {
        return console.log('Out of key calls. Clear local storage to end this message.')
    }

    let apiURL = `https://testURL.com/coding/is/fun/?q=answerKey&apiKey=${keys[pickBestKey(keyCount)]}` //picks best key from array of keys based on highest remaining calls

    /*After fetch(apiURL).then(response => {
        if(response.ok){*/
    updateKeyCount(pickBestKey(keyCount), keyCount, secretKey)
    /*      return response.json()  
}
}) */

    console.log(keyCount) //Objest of calls left for each Key 
};

//Your API Call
fetchAPI() 
