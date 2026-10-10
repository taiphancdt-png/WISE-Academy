/* =====================================================================
   NHÂN VẬT CÔNG NHÂN (CHIBI), vẽ bằng SVG, hoạt ảnh bằng CSS
   ---------------------------------------------------------------------
   Hai góc nhìn: "front" (nhìn chéo xuống phải) và "back" (quay lưng, đi lên).
   Hướng trái có được bằng cách lật ngang (class "mirror").
   Trạng thái (class trên phần tử gốc):
     walking , đi bộ        bend     , cúi nhặt/đặt
     carrying, cầm đồ       wiping   , lau chùi
     driving , lái xe nâng  celebrate, ăn mừng      scratch, gãi đầu
   Khung vẽ 60 x 82, bàn chân ở y ≈ 78. Muốn thay bằng sprite của họa sĩ:
   giữ hàm createCharacter() trả về phần tử có cùng các class trạng thái.
   ===================================================================== */
(function () {
  var OUT = "#1B2A3A";                         // màu viền
  var SKIN = "#FFDCC2", SKIN_D = "#F4B994", HAIR = "#3B2618",
      NAVY = "#0E3D70", NAVY_D = "#082B52", ORANGE = "#F76011",
      GLOVE = "#F6C43F", GLOVE_D = "#D29A16", BOOT = "#3A3330";
  var SW = ' stroke="' + OUT + '" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"';

  function leg(side) {
    var x = side === "l" ? 21.6 : 31.4, col = side === "l" ? NAVY_D : NAVY;
    return '<g class="leg leg-' + side + '">' +
      '<path d="M' + x + ',57 h7.2 v12 h-7.2 Z" fill="' + col + '"' + SW + '/>' +
      '<path d="M' + (x - 1.6) + ',68.6 h9.6 a2.6,2.6 0 0 1 2.6,2.6 v3.6 a2.4,2.4 0 0 1 -2.4,2.4 h-8.6 a3.2,3.2 0 0 1 -3.2,-3.2 v-2.4 a3,3 0 0 1 2,-3 Z" fill="' + BOOT + '"' + SW + '/>' +
      '<path d="M' + (x - 1.2) + ',75.4 h11.6" stroke="#1C1716" stroke-width="2"/>' +
      '<path d="M' + (x + 3.6) + ',70.4 h3.6" stroke="#fff" stroke-width="1" opacity=".35"/>' +
      '</g>';
  }

  function arm(side) {
    var x = side === "l" ? 16.2 : 43.8, col = side === "l" ? NAVY_D : NAVY, tx = side === "l" ? -1.4 : 1.4;
    return '<g class="arm arm-' + side + '">' +
      '<rect x="' + (x - 3.7) + '" y="41.5" width="7.4" height="14.5" rx="3.7" fill="' + col + '"' + SW + '/>' +
      '<rect x="' + (x - 3.7) + '" y="49" width="7.4" height="2.4" fill="#DDE5EC"/>' +
      '<rect x="' + (x - 3.7) + '" y="49.6" width="7.4" height="1" fill="' + ORANGE + '"/>' +
      '<ellipse cx="' + (x + tx * 2.2) + '" cy="56.4" rx="1.9" ry="2.5" fill="' + GLOVE + '"' + SW + '/>' +
      '<circle cx="' + x + '" cy="57.6" r="3.9" fill="' + GLOVE + '"' + SW + '/>' +
      '<path d="M' + (x - 2) + ',56.2 q2,-1 4,0" stroke="' + GLOVE_D + '" stroke-width=".8" fill="none"/>' +
      '</g>';
  }

  function torso(back) {
    var t = '<path d="M19.5,43.5 C19.5,40 22.5,38 26,38 H34 C37.5,38 40.5,40 40.5,43.5 L41.5,58 C41.5,60.6 39.8,62 37.4,62 H22.6 C20.2,62 18.5,60.6 18.5,58 Z" fill="url(#cBody)"' + SW + '/>' +
      '<path d="M19.2,52.2 H40.8 V56 H19.2 Z" fill="' + ORANGE + '"/>' +
      '<path d="M19.2,52.9 H40.8 M19.2,55.3 H40.8" stroke="#E9EEF2" stroke-width=".9"/>' +
      '<path d="M18.9,59 H41.1" stroke="' + NAVY_D + '" stroke-width="2.4"/>' +
      '<rect x="28.2" y="57.8" width="3.6" height="2.6" rx=".6" fill="#C9D3DB" stroke="' + OUT + '" stroke-width=".5"/>';
    if (back) {
      t += '<g class="nf"><text x="30" y="47.8" font-family="Arial Black,Arial,sans-serif" font-size="6" font-weight="900" fill="#fff" text-anchor="middle">WISE</text></g>' +
        '<path d="M24,38.6 q6,3 12,0" stroke="' + NAVY_D + '" stroke-width="1.2" fill="none"/>';
    } else {
      t += '<path d="M25,38.3 L30,44.5 L35,38.3" fill="#F4F6F9" stroke="' + OUT + '" stroke-width=".9" stroke-linejoin="round"/>' +
        '<path d="M30,44.5 V51.8" stroke="' + NAVY_D + '" stroke-width="1"/>' +
        '<rect x="21.6" y="45.6" width="5.4" height="4.6" rx="1" fill="' + NAVY_D + '" opacity=".6"/>' +
        '<g class="nf"><rect x="32" y="44.8" width="8.6" height="5" rx="1.2" fill="#fff" stroke="' + OUT + '" stroke-width=".5"/>' +
        '<text x="36.3" y="48.6" font-family="Arial Black,Arial,sans-serif" font-size="3.3" font-weight="900" fill="' + NAVY + '" text-anchor="middle">WISE</text></g>';
    }
    return t;
  }

  function hat(front) {
    return '<path d="M14.6,22.6 C14.6,11.2 21.2,5.8 30,5.8 C38.8,5.8 45.4,11.2 45.4,22.6 Z" fill="url(#cHat)"' + SW + '/>' +
      '<path d="M28.4,6.3 C29.4,6 30.6,6 31.6,6.3 V22.4 H28.4 Z" fill="#FFB36E" opacity=".9"/>' +
      '<path d="M19,15.5 C20.5,10.5 24,8.4 27.4,7.8" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/>' +
      '<path d="M11.6,23.4 C11.6,20.8 20,19.6 30,19.6 C40,19.6 48.4,20.8 48.4,23.4 C48.4,25.6 40,26.6 30,26.6 C20,26.6 11.6,25.6 11.6,23.4 Z" fill="#E0560F"' + SW + '/>' +
      '<path d="M14,22.6 C18,21.2 42,21.2 46,22.6" stroke="#FF9A55" stroke-width="1" fill="none"/>' +
      (front ? '<g class="nf"><text x="30" y="17.6" font-family="Arial Black,Arial,sans-serif" font-size="4.6" font-weight="900" fill="#fff" text-anchor="middle">WISE</text></g>' : '');
  }

  function headFront() {
    return '<g class="head"><g transform="translate(30,40) scale(1.08) translate(-30,-40)">' +
      '<rect x="27" y="36" width="6" height="4" fill="' + SKIN_D + '"/>' +
      '<ellipse cx="15.6" cy="28.6" rx="2.4" ry="3.2" fill="' + SKIN_D + '"' + SW + '/>' +
      '<ellipse cx="44.4" cy="28.6" rx="2.4" ry="3.2" fill="' + SKIN_D + '"' + SW + '/>' +
      '<path d="M16,25.5 C16,17 22,13 30,13 C38,13 44,17 44,25.5 C44,34.5 38,40.4 30,40.4 C22,40.4 16,34.5 16,25.5 Z" fill="url(#cSkin)"' + SW + '/>' +
      '<path d="M16.2,22.4 C16.8,25.6 19,26.2 19.8,24.4 C21.4,25.6 24.4,25 25.4,23 C27.4,24.6 31.4,24.4 33.4,22.8 C35,24.8 38.4,25 39.8,23.2 C40.8,25.8 43,25.4 43.8,22.4 L43.4,18 H16.6 Z" fill="' + HAIR + '"/>' +
      '<g class="eyes eyes-normal">' +
        '<ellipse cx="25.4" cy="30" rx="2.8" ry="3.4" fill="#fff" stroke="' + OUT + '" stroke-width=".7"/>' +
        '<ellipse cx="35.8" cy="30" rx="2.8" ry="3.4" fill="#fff" stroke="' + OUT + '" stroke-width=".7"/>' +
        '<ellipse cx="26" cy="30.4" rx="2" ry="2.7" fill="#3A2416"/><ellipse cx="36.4" cy="30.4" rx="2" ry="2.7" fill="#3A2416"/>' +
        '<circle cx="26.8" cy="29.2" r="1" fill="#fff"/><circle cx="37.2" cy="29.2" r="1" fill="#fff"/>' +
        '<circle cx="25.4" cy="31.8" r=".45" fill="#fff"/><circle cx="35.8" cy="31.8" r=".45" fill="#fff"/>' +
      '</g>' +
      '<g class="eyes eyes-happy"><path d="M22.8,30.8 q2.6,-3.6 5.2,0 M33.2,30.8 q2.6,-3.6 5.2,0" stroke="#3A2416" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>' +
      '<g class="eyes eyes-worry">' +
        '<ellipse cx="25.6" cy="30.6" rx="2.2" ry="2.8" fill="#3A2416"/><ellipse cx="36" cy="30.6" rx="2.2" ry="2.8" fill="#3A2416"/>' +
        '<circle cx="26.3" cy="29.6" r=".8" fill="#fff"/><circle cx="36.7" cy="29.6" r=".8" fill="#fff"/>' +
        '<path d="M45.6,21.5 q2.4,3.4 0,5.6 q-2.4,-2.2 0,-5.6 Z" fill="#7CC7F2" stroke="#3E8EC4" stroke-width=".5"/>' +
      '</g>' +
      '<path class="brows" d="M23,25.8 q2.4,-1.2 4.8,0 M33.4,25.8 q2.4,-1.2 4.8,0" stroke="' + HAIR + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
      '<path class="brows-worry" d="M23,25 l4.6,1.6 M38.4,25 l-4.6,1.6" stroke="' + HAIR + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
      '<path d="M31.2,32.6 q.8,1 -.2,1.6" stroke="' + SKIN_D + '" stroke-width="1" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="22" cy="34.4" rx="2.6" ry="1.5" fill="#FF8A8A" opacity=".45"/><ellipse cx="39.4" cy="34.4" rx="2.6" ry="1.5" fill="#FF8A8A" opacity=".45"/>' +
      '<path class="mouth mouth-smile" d="M28.2,35.6 q2.6,2.6 5.2,0" stroke="#7A3B26" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<path class="mouth mouth-open" d="M27.8,35 q3,4.8 6,0 Z" fill="#8A3626" stroke="#7A3B26" stroke-width=".8" stroke-linejoin="round"/>' +
      '<path class="mouth mouth-worry" d="M27.6,36.6 q1.5,-1.3 3,0 q1.5,1.3 3,0" stroke="#7A3B26" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(0,-3.6)">' + hat(true) + '</g></g></g>';
  }

  function headBack() {
    return '<g class="head"><g transform="translate(30,40) scale(1.08) translate(-30,-40)">' +
      '<rect x="27" y="36" width="6" height="4" fill="' + SKIN_D + '"/>' +
      '<ellipse cx="15.6" cy="28.6" rx="2.4" ry="3.2" fill="' + SKIN_D + '"' + SW + '/>' +
      '<ellipse cx="44.4" cy="28.6" rx="2.4" ry="3.2" fill="' + SKIN_D + '"' + SW + '/>' +
      '<path d="M16,25.5 C16,17 22,13 30,13 C38,13 44,17 44,25.5 C44,34.5 38,40.4 30,40.4 C22,40.4 16,34.5 16,25.5 Z" fill="' + HAIR + '"' + SW + '/>' +
      '<path d="M22,36 q8,3.4 16,0" stroke="#5A3A26" stroke-width="1" fill="none"/>' +
      '<g transform="translate(0,-3.6)">' + hat(false) + '</g></g></g>';
  }

  function build(back) {
    // thứ tự vẽ: chân → tay sau → thân → tay trước → đầu
    return '<g class="view view-' + (back ? 'back' : 'front') + '">' +
      '<g class="legs">' + leg("l") + leg("r") + '</g>' +
      '<g class="upper">' +
        (back ? arm("r") : arm("l")) +
        torso(back) +
        (back ? arm("l") : arm("r")) +
        (back ? headBack() : headFront()) +
      '</g></g>';
  }

  var DEFS = '<defs>' +
    '<linearGradient id="cBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F5C9C"/><stop offset=".6" stop-color="' + NAVY + '"/><stop offset="1" stop-color="' + NAVY_D + '"/></linearGradient>' +
    '<radialGradient id="cSkin" cx=".38" cy=".38" r=".75"><stop offset="0" stop-color="#FFF0E4"/><stop offset=".7" stop-color="' + SKIN + '"/><stop offset="1" stop-color="' + SKIN_D + '"/></radialGradient>' +
    '<linearGradient id="cHat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC07A"/><stop offset=".45" stop-color="#FF8A2B"/><stop offset="1" stop-color="#D9500C"/></linearGradient>' +
    '</defs>';

  window.createCharacter = function () {
    var el = document.createElement("div");
    el.className = "worker face-front";
    el.innerHTML =
      '<div class="worker-shadow"></div>' +
      '<svg class="worker-svg" viewBox="0 0 60 82" width="60" height="82" aria-hidden="true">' + DEFS +
      '<g class="bob">' + build(false) + build(true) + '</g></svg>' +
      '<div class="worker-held"></div>';
    return el;
  };
})();
