import assert from 'node:assert/strict';
import { normalizeWhatsAppNumber } from '../lib/phone.ts';
const accepted = [
  ['+9779846701009', '+9779846701009'],
  [' +977 9846701009 ', '+9779846701009'],
  ['9846701009', '9846701009'],
  ['+91 79876 38713', '+917987638713'],
  ['00977 9846701009', '+9779846701009'],
  ['+977 (984) 670-1009', '+9779846701009'],
  ['+९७७ ९८४६७०१००९', '+9779846701009'],
  ['＋９７７ ９８４６７０１００９', '+9779846701009'],
  ['\u200e+977\u00a09846701009\u200b', '+9779846701009'],
  ['+977–9846701009', '+9779846701009'],
  ['٠٠٩٧٧ ٩٨٤٦٧٠١٠٠٩', '+9779846701009'],
  ['1234567', '1234567'],
  ['+123456789012345', '+123456789012345'],
];
for (const [value, expected] of accepted) assert.equal(normalizeWhatsAppNumber(value), expected, value);
const rejected = ['', '123456', '+1234567890123456', '++9779846701009', '98467abc09', 'user@example.com', '+0001234567', '977+9846701009', '() -- .'];
for (const value of rejected) assert.equal(normalizeWhatsAppNumber(value), null, value);
console.log(`${accepted.length + rejected.length} phone normalization cases passed.`);
