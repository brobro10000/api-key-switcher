//initializes localStorage with keyCount
function localKeyCount(keysAlias, calls) {
    let keyValues = ''

    if (localStorage.getItem('keyCount') == null) {
        keyValues = populateKeyCount(keysAlias, calls);
        localStorage.setItem('keyCount', JSON.stringify(keyValues))

        return localKeyCount()
    } else {
        let value = localStorage.getItem('keyCount')
        keyValues = JSON.parse(value)

        return keyValues
    }
}

//Populate keys with maxCall amount from localKeyCount
function populateKeyCount(arrOfKeys, calls) {
    let count = {}

    arrOfKeys.forEach((element) => {
        count[element] = (count[element] || calls)
    })

    return count
};

//Best best key with most calls remaining
function pickBestKey(keyCount) {
    let keyObj = Object.entries(keyCount)
    let bestKey = keyObj[0]

    keyObj.forEach((element) => {
        if (element[1] > bestKey[1]) {
            bestKey = element
        }
    })

    return bestKey[0]
};

//updates localStorage with 
function updateKeyCount(keyIndex, keyCount) {
    let keyArr = Object.entries(keyCount)

    keyArr.forEach((element, index) => {
        if (index == keyIndex) {
            element[1]--
        }
    })

    return localStorage.setItem('keyCount', JSON.stringify(Object.fromEntries(keyArr)))
}

function fetchAPI() {
    const keysAlias = ['key1', 'key2', 'key3', 'key4']; //Alias Values for Keys for localStorage
    const keys = ['trueKey1', 'trueKey2', 'trueKey3', 'trueKey4']; //Your actual API Key at each index for each amount of keys
    const maxCalls = 100 //someInteger of Max calls for API
    const keyCount = localKeyCount(keysAlias, maxCalls) //initializes keyCount with localStorage keyCount object

    let apiKey = `https://testURL.com/coding/is/fun/?q=answerKey&apiKey=${keys[keysAlias.indexOf(pickBestKey(keyCount))]}` //picks best key from array of keys based on highest remaining calls

    /*After fetch(apiKey).then(response => {
        if(response.ok){*/
    updateKeyCount(keysAlias.indexOf(pickBestKey(keyCount)), keyCount)
    /*      return response.json()  
        }
    }) */
    console.log(keyCount) //Objest of calls left for each Key 
}

//Your API Call
fetchAPI()