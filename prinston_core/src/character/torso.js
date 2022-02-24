const gloveGroups = [
  [0, 1, 2, 4, 5, 6, 8, 11, 12, 14, 15, 112, 113, 114, 184], //Gloveless 0
  [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 115, 122, 129, 185], //Black Holes on knuckles 1
  [30, 31, 32, 33, 34, 35, 36, 37, 38, 38, 40, 116, 123, 130, 186], //Plain Black 2
  [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 117, 124, 131, 187], //Plain Black Cloth 3
  [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 118, 125, 132, 188], //Black Fingerless Cloth 4
  [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 119, 126, 133, 189], //Gardening 5
  [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 120, 127, 134, 190], //White golf 6
  [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 121, 128, 135, 191], //Blue plastic 7
  [138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 136, 148, 149, 150, 192], //Some blue camo 8
  [151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 137, 161, 162, 163, 193], //Entire blue camo 9
  [171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 170, 181, 182, 183, 194], //Black embroidered 10
  [16], //Green with black rubber
  [17], //Combat gloves
  [18], //Fingerless cloth
  [96], //Black cloth long
  [97], //Tan werewolf
  [98], //Brown werewolf
  [99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109], // Green cloth
  [110], //Racing green
  [111], //Racing pink
  [164, 169], //Alien arms green
  [165], //Floating red/orange padded
  [166], //Floating white astronaut
  [167], //Floating space cadet
  [168], //Floating bubblegum
  [195], //Floating heat mitts
]

function getUnglovedTorso(gloves) {
  let index;
  for(let i in gloveGroups) {
    if(gloveGroups[i].includes(gloves)) {
      index = gloveGroups[i].indexOf(gloves);
      break;
    }
  }
  return (index==undefined?undefined:gloveGroups[0][index]);
}

function getGloveIndex(torso) {
  let index;
  for(let g in gloveGroups) {
    if(gloveGroups[g].includes(torso)) return gloveGroups[g].indexOf(torso);
  }
  return 0
}

function getGlovedTorsoFromIndex(gloveIndex, index) {
  return gloveGroups[gloveIndex][index];
}

function getGlovedTorso(torso, gloveIndex) {
  let index;
  if(gloveGroups[0].includes(torso)) index = gloveGroups[0].indexOf(torso);
  else index = 3;
  return gloveGroups[gloveIndex][index];
}
