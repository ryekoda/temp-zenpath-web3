// Capitalizing names and labels for display.

export function CapitalizeFirstLetter(string: string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string
  }
}


export function CapitalizeFirstLetterOfEachWord(words: string) {
  if (words && words.length > 0) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }

    return separateWord.join(' ');
  } else {
    return ''
  }
}
