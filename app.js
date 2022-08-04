'use strict';
//  fs は、FileSystem（ファイルシステム）
const fs = require('fs');
// readlineは、一行ずつ読み込む
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDateMap = new Map(); //key:都道府県 value:集計データのオブジェクト
rl.on('line', lineString => {
  // console.log(lineString);
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    // console.log(year);
    // console.log(prefectrue);
    // console.log(popu);
    let value = null;
    if (prefectureDateMap.has(prefecture)) {
      value = prefectureDateMap.get(prefecture);
    } else {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDateMap.set(prefecture, value);
  }
});

// データがそろってから変化率の計算をする
rl.on('close', () => {
  for (const [key, value] of prefectureDateMap) {
    value.change = value.popu15 / value.popu10;
  }
  // console.log(prefectureDateMap);
  // 変化率で並び替え
  const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  // console.log(rankingArray);
  const rankingStrings = rankingArray.map(([key, value]) => {
    return `${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
});