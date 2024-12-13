
export const formatDate = (date) => {
  const formattedDate = window.dateFns.format(date, 'MM-dd-yyyy')
  return formattedDate
} 

export const capitalize = (text) => {
  const splitedText = text.split('')
  const capitalizedFirstLetter = splitedText[0].toUpperCase()
  
  splitedText.splice(0, 1, capitalizedFirstLetter)
  const result = splitedText.join('')
  return result
}