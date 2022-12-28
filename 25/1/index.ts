import { processFile } from '../../process-file';

type SNAFU = {
  digit: number
  power: number
}

const stringToNumber = (string: string): number => {
  if (string === '-') return -1
  if (string === '=') return -2
  return parseInt(string);
}

const  NumberToSnafu = (number: number) => {
  if (number === 4) return 2
  if (number === 3) return 1
  if (number === 2) return "="
  if (number === 1) return "-"
  if (number === 0) return 0
  throw new Error('Invalid number')

}

const digitToSnafu = (digit: string, index: number): SNAFU => {
  return {
    digit: stringToNumber(digit),
    power: Math.pow(5, index),
  }
}

const numberToSNAFU = (number: number) => {
  const result = []
  const match = [0,1,2]
  while (number !== 0) {
    const current = number % 5
    if (match.includes(current)) {
      number = (number - current) / 5;
      result.unshift(current);
      continue;
    } 
    if (current === 3) {
      number = (number + 2) / 5;
      result.unshift("=");
      continue;
    }
    if (current === 4) {
      number = (number + 1) / 5;
      result.unshift('-');
      continue;
    }
    throw new Error('Invalid number')
  }
  return result;
}

const result = async () => {
  const stream = await processFile('25/data.txt');
  const numbers: number[] = []
  for await (const line of stream) {
    const invertedNumber =line.split('')
    const digits: SNAFU[] = [];
    invertedNumber.forEach((digit, index) => digits.push(digitToSnafu(digit, (invertedNumber.length - index -1))))
    const validNumber = digits.reduce(
      (acc, current) => (acc += current.digit * current.power),
      0
    );
    numbers.push(validNumber)
    const debug = true
  }
  const result = numbers.reduce((acc, current) => (acc += current), 0);
  const data = numberToSNAFU(result);
  return data.join('')
};

result().then(data => console.log(data));
