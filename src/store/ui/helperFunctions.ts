export function wordWrap(str: string, maxWidth: number, maxLines: number): string {
  const newLineStr = '\n'
  let done = false
  let res = ''
  const linesSeparate = str.split(newLineStr)
  let lines = ''

  // log("original lines: " + str.split(newLineStr).length)

  for (let j = 0; j < linesSeparate.length; j++) {
    res = ''
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done = false
    // process each line for linebreaks
    while (linesSeparate[j].length > maxWidth) {
      let found = false
      // Inserts new line at first whitespace of the line
      for (let i = maxWidth - 1; i >= 0; i--) {
        if (testWhite(linesSeparate[j].charAt(i))) {
          res = res + [linesSeparate[j].slice(0, i), newLineStr].join('')
          linesSeparate[j] = linesSeparate[j].slice(i + 1)
          found = true
          break
        }
      }
      // Inserts new line at maxWidth position, the word is too long to wrap
      if (!found) {
        res += [linesSeparate[j].slice(0, maxWidth), newLineStr].join('')
        linesSeparate[j] = linesSeparate[j].slice(maxWidth)
      }
    }

    lines += res + linesSeparate[j] + '\n'
  }

  // let lines = res + str
  const finalLines = lines.split('\n')
  let croppedResult = ''

  for (let i = 0; i < maxLines && i < finalLines.length; i++) {
    // croppedResult += finalLines[i] + '\n'
    croppedResult += finalLines[i]
    if (i !== maxLines - 1) {
      croppedResult += '\n'
    }
  }

  if (finalLines.length > maxLines || croppedResult.length > maxWidth) {
    croppedResult += '...'
  }

  return croppedResult
}

function testWhite(x: string): boolean {
  // eslint-disable-next-line prefer-regex-literals
  const white = new RegExp(/^\s$/)
  return white.test(x.charAt(0))
}

export function shortenText(text: string, maxLenght: number): string {
  let finalText: string = ''

  if (text.length > maxLenght) {
    finalText = text.substring(0, maxLenght)
    finalText = finalText.concat('...')
  } else {
    finalText = text
  }

  return finalText
}
