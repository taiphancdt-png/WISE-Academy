/* =====================================================================
   MÀN 1, AM "THANH TRA ĐẦU CA"  ·  MÀN 2, PM "LẬP LỊCH BẢO TRÌ"
   ===================================================================== */
(function () {
  "use strict";
  var T = window.TPM_GAME, D = T.D, C = T.C, U = T.util;
  var $ = U.$, mk = U.mk, esc = U.esc, num = U.num, ic = U.ic, Sound = U.Sound, toast = U.toast, modal = U.modal, closeModal = U.closeModal, clamp = U.clamp;

  /* ------------------------------------------------------------------
     Hình máy tiện CNC cận cảnh (khung 1000 × 600). on[id] = true → vẽ trạng thái bất thường.
     Muốn thay bằng tranh họa sĩ: giữ toạ độ các điểm trong tpm-data.js (am.anomalies).
     ------------------------------------------------------------------ */
  function latheSVG(on) {
    var o = [];
    function p(s) { o.push(s); }
    p('<defs>' +
      '<linearGradient id="lwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDE4EA"/><stop offset="1" stop-color="#C3CDD5"/></linearGradient>' +
      '<linearGradient id="lbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58A894"/><stop offset="1" stop-color="#2F6E61"/></linearGradient>' +
      '<linearGradient id="lbodyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B7F70"/><stop offset="1" stop-color="#22544A"/></linearGradient>' +
      '<linearGradient id="ltop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC2B0"/><stop offset="1" stop-color="#5AA592"/></linearGradient>' +
      '<linearGradient id="lsteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F7F9"/><stop offset=".5" stop-color="#C5CED6"/><stop offset="1" stop-color="#8D99A4"/></linearGradient>' +
      '<linearGradient id="lsteelH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8D99A4"/><stop offset=".45" stop-color="#EEF2F5"/><stop offset="1" stop-color="#8D99A4"/></linearGradient>' +
      '<linearGradient id="lrecess" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A262B"/><stop offset="1" stop-color="#2A3A40"/></linearGradient>' +
      '<linearGradient id="loil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B13A"/><stop offset="1" stop-color="#B9740E"/></linearGradient>' +
      '<radialGradient id="lglass" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#B9D6E6"/></radialGradient>' +
      '<pattern id="lfloor" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill="#A3ADB6"/><path d="M0 0H80M0 0V40" stroke="#8F99A2" stroke-width="2"/></pattern>' +
      '</defs>');
    // tường, sàn
    p('<rect width="1000" height="560" fill="url(#lwall)"/><rect y="540" width="1000" height="60" fill="url(#lfloor)"/>');
    p('<rect y="96" width="1000" height="10" fill="#F5C02E" opacity=".9"/><rect y="106" width="1000" height="3" fill="#1A1A1A" opacity=".15"/>');
    p('<ellipse cx="505" cy="548" rx="440" ry="16" fill="rgba(0,0,0,.25)"/>');
    // ---- bệ máy ----
    p('<path d="M110 380 L130 368 H920 L900 380 Z" fill="url(#ltop)"/><path d="M900 380 L920 368 V533 L900 545 Z" fill="#245A4E"/>');
    p('<rect x="110" y="380" width="790" height="165" rx="4" fill="url(#lbody)" stroke="#1E463E" stroke-width="2"/>');
    // cửa trái + cửa sổ bình dầu bôi trơn rãnh trượt
    p('<rect x="130" y="392" width="200" height="140" rx="4" fill="url(#lbodyD)" stroke="#1E463E" stroke-width="1.5"/><rect x="300" y="450" width="12" height="30" rx="3" fill="url(#lsteel)"/>');
    p('<rect x="146" y="402" width="66" height="104" rx="6" fill="#1D2A2F"/>');
    var lvl = on.oil ? 492 : 428;
    p('<rect x="155" y="408" width="46" height="92" rx="5" fill="#E8F1F6" opacity=".9" stroke="#7E8C97" stroke-width="2"/>' +
      '<rect x="157" y="' + lvl + '" width="42" height="' + (498 - lvl) + '" rx="3" fill="url(#loil)" opacity=".92"/>' +
      '<path d="M157 ' + lvl + ' h42" stroke="#FFE3A3" stroke-width="2"/>' +
      '<path d="M201 424 h9 M201 482 h9" stroke="#D9412F" stroke-width="2.5"/><text x="214" y="428" class="lt-s">MAX</text><text x="214" y="486" class="lt-s">MIN</text>' +
      '<text x="178" y="520" class="lt-s" text-anchor="middle">DẦU RÃNH TRƯỢT</text>');
    // cửa tủ điện (bình thường)
    p('<rect x="450" y="392" width="160" height="140" rx="4" fill="url(#lbodyD)" stroke="#1E463E" stroke-width="1.5"/><path d="M500 412 l14 -24 l14 24 z" transform="translate(16 30)" fill="#F5C02E" stroke="#1A1A1A" stroke-width="2"/><text x="530" y="438" text-anchor="middle" font-size="16" font-weight="900" fill="#1A1A1A">!</text>' +
      '<rect x="512" y="462" width="16" height="16" rx="3" fill="#C9D0D7" stroke="#59636E" stroke-width="1.5"/><circle cx="520" cy="470" r="3" fill="#2A323B"/>');
    // ---- cụm thủy lực (khoang phải) ----
    p('<rect x="680" y="392" width="215" height="148" rx="4" fill="url(#lrecess)"/>');
    p('<rect x="700" y="482" width="186" height="54" rx="4" fill="#3E4C55" stroke="#1A262B" stroke-width="2"/><text x="792" y="516" class="lt-s" text-anchor="middle" fill="#AFC0CC">THÙNG DẦU THỦY LỰC</text>');
    // lọc dầu + chỉ thị nghẹt
    p('<rect x="726" y="440" width="32" height="44" rx="6" fill="#2E6FB8" stroke="#16365C" stroke-width="2"/><path d="M730 452h24M730 460h24M730 468h24M730 476h24" stroke="#7FB0E3" stroke-width="1.5"/>' +
      '<rect x="733" y="432" width="18" height="10" rx="2" fill="url(#lsteel)" stroke="#59636E"/><circle cx="742" cy="437" r="4.5" fill="' + (on.filter ? "#FF3B30" : "#3DDC84") + '" stroke="#1A262B" stroke-width="1.2"/>' +
      (on.filter ? '<circle cx="742" cy="437" r="8" fill="none" stroke="#FF3B30" stroke-width="1.5" class="blinkring"/>' : '') + '<text x="742" y="498" class="lt-s" text-anchor="middle" fill="#C9D6E0">LỌC</text>');
    // bơm + động cơ
    p('<rect x="790" y="444" width="92" height="36" rx="10" fill="url(#lsteel)" stroke="#59636E" stroke-width="2"/><path d="M800 450v24M810 450v24M820 450v24M830 450v24" stroke="#8D99A4" stroke-width="2"/><rect x="842" y="452" width="34" height="20" rx="3" fill="#2F6E61"/>');
    // đồng hồ áp suất
    var ang = on.gauge ? 200 : 268;
    p('<rect x="796" y="436" width="8" height="10" fill="#8D99A4"/><circle cx="800" cy="418" r="21" fill="#F4F7F9" stroke="#59636E" stroke-width="3"/>' +
      '<path d="M786.5 428.5 A17 17 0 0 1 785.4 409" stroke="#D9412F" stroke-width="4" fill="none"/><path d="M785.4 409 A17 17 0 0 1 805.8 402" stroke="#E7A812" stroke-width="4" fill="none"/>' +
      '<path d="M805.8 402 A17 17 0 0 1 815 426" stroke="#2E9A57" stroke-width="4" fill="none"/>' +
      '<line x1="800" y1="418" x2="' + (800 + 14 * Math.cos(ang * Math.PI / 180)).toFixed(1) + '" y2="' + (418 + 14 * Math.sin(ang * Math.PI / 180)).toFixed(1) + '" stroke="#1A1A1A" stroke-width="2.4" stroke-linecap="round"/><circle cx="800" cy="418" r="2.6" fill="#1A1A1A"/>' +
      '<text x="800" y="434" text-anchor="middle" font-size="5.5" font-weight="700" fill="#59636E">MPa</text>');
    // ống thủy lực + đầu nối (rò rỉ)
    p('<path d="M882 462 C900 462 900 478 878 478 L862 478 C820 478 700 470 690 420 L690 395" stroke="#2B2B2B" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M861 471 h14 v14 h-14 z" fill="url(#lsteel)" stroke="#59636E" stroke-width="1.5"/>');
    if (on.leak) p('<path d="M866 476 q4 6 0 12" stroke="#B9740E" stroke-width="2" fill="none" opacity=".8"/><g class="drips"><ellipse class="drip" cx="868" cy="490" rx="3" ry="4" fill="#C98612"/><ellipse class="drip d2" cx="868" cy="490" rx="3" ry="4" fill="#C98612"/></g><ellipse cx="868" cy="537" rx="20" ry="4" fill="#7A5208" opacity=".7"/><ellipse cx="862" cy="536" rx="7" ry="1.4" fill="#F2C870" opacity=".7"/>');
    // ---- băng máy & rãnh trượt ----
    p('<rect x="140" y="326" width="742" height="58" rx="3" fill="url(#lbodyD)" stroke="#1E463E" stroke-width="2"/>');
    p('<rect x="146" y="330" width="730" height="12" rx="2" fill="url(#lsteel)" stroke="#6E7B86"/><rect x="146" y="356" width="730" height="12" rx="2" fill="url(#lsteel)" stroke="#6E7B86"/>');
    p('<path d="M146 336 H876 M146 362 H876" stroke="#FFFFFF" stroke-width="1" opacity=".7"/>');
    if (on.chips) {
      var cs = "";
      for (var i = 0; i < 18; i++) { var x = 372 + (i * 37) % 104, y = 334 + (i % 3) * 11 + ((i * 7) % 5); cs += '<path d="M' + x + ' ' + y + ' q6 -8 11 -1 q5 7 11 -1" stroke="' + (i % 3 ? "#9AA5B0" : "#C08A3E") + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; }
      p('<g>' + cs + '<path d="M370 344 h108" stroke="#5E6873" stroke-width="3" opacity=".5"/></g>');
    }
    // ---- hộp trục chính ----
    p('<path d="M120 150 L134 140 H334 L322 150 Z" fill="url(#ltop)"/><path d="M322 150 L334 140 V322 L322 332 Z" fill="#245A4E"/>');
    p('<rect x="120" y="150" width="202" height="182" rx="4" fill="url(#lbody)" stroke="#1E463E" stroke-width="2"/>');
    p('<rect x="134" y="164" width="76" height="34" rx="3" fill="#1D2A2F"/><text x="172" y="186" text-anchor="middle" font-size="13" font-weight="800" fill="#7FE0CF" font-family="monospace">S 1200</text>');
    p('<circle cx="262" cy="238" r="30" fill="url(#lsteel)" stroke="#59636E" stroke-width="2.5"/><circle cx="262" cy="238" r="20" fill="#C5CED6" stroke="#59636E" stroke-width="1.5"/>' +
      [0, 1, 2, 3, 4, 5].map(function (k) { var a = k * Math.PI / 3; return '<circle cx="' + (262 + 25 * Math.cos(a)).toFixed(1) + '" cy="' + (238 + 25 * Math.sin(a)).toFixed(1) + '" r="2.3" fill="#59636E"/>'; }).join("") +
      '<text x="262" y="284" text-anchor="middle" class="lt-s" fill="#E6F2EE">Ổ TRỤC CHÍNH</text>');
    if (on.noise) p('<g class="noisewave"><path d="M298 214 q8 10 0 20" /><path d="M306 208 q12 16 0 32"/><path d="M314 202 q16 22 0 44"/></g>');
    // kính thăm dầu
    p('<circle cx="232" cy="304" r="12" fill="#2A3A40"/><circle cx="232" cy="304" r="9" fill="url(#lglass)"/>' +
      (on.glass ? '<circle cx="232" cy="304" r="9" fill="#6B5A3A" opacity=".82"/><path d="M226 299 q5 3 11 -1 M225 307 q6 2 13 0" stroke="#3E321E" stroke-width="2" opacity=".7"/>' :
        '<path d="M223.5 305 h17" stroke="#C98612" stroke-width="3"/><rect x="223.5" y="305" width="17" height="6" fill="#F2B13A" opacity=".7"/>'));
    // ---- nắp che & dây curoa (đầu trái) ----
    p('<rect x="58" y="140" width="64" height="200" rx="6" fill="url(#lbodyD)" stroke="#1E463E" stroke-width="2"/>');
    p('<rect x="70" y="196" width="44" height="104" rx="4" fill="#1D2A2F"/><circle cx="92" cy="214" r="11" fill="url(#lsteel)" stroke="#59636E"/><circle cx="92" cy="282" r="15" fill="url(#lsteel)" stroke="#59636E"/>' +
      '<path d="M81 214 L77 282 M103 214 L107 282" stroke="#2B2B2B" stroke-width="5"/>');
    if (on.belt) p('<path d="M102 248 l6 3 -4 3 6 3" stroke="#F4F7F9" stroke-width="1.6" fill="none"/><path d="M78 256 l-4 2 4 3" stroke="#F4F7F9" stroke-width="1.4" fill="none"/><path d="M100 250 l8 1" stroke="#F4F7F9" stroke-width="1"/>');
    [[92, 168], [92, 326], [68, 152], [112, 152]].forEach(function (b, k) {
      if (k === 0 && on.cover) p('<circle cx="92" cy="168" r="6" fill="#1D2A2F" stroke="#7A4B22" stroke-width="2"/><circle cx="92" cy="168" r="9" fill="none" stroke="#9C5A1E" stroke-width="1.5" opacity=".6"/>');
      else p('<circle cx="' + b[0] + '" cy="' + b[1] + '" r="5.5" fill="url(#lsteel)" stroke="#59636E" stroke-width="1.2"/><path d="M' + (b[0] - 3) + ' ' + b[1] + ' h6" stroke="#59636E" stroke-width="1.2"/>');
    });
    // ---- mâm cặp & phôi ----
    p('<rect x="322" y="198" width="52" height="104" rx="8" fill="url(#lsteelH)" stroke="#59636E" stroke-width="2"/><rect x="340" y="206" width="14" height="22" fill="#8D99A4"/><rect x="340" y="272" width="14" height="22" fill="#8D99A4"/>' +
      '<rect x="374" y="240" width="110" height="20" rx="2" fill="url(#lsteel)" stroke="#6E7B86"/><path d="M380 244 h96" stroke="#fff" stroke-width="1.5" opacity=".7"/>');
    // ---- bàn xe dao (carriage) ----
    p('<rect x="470" y="298" width="182" height="38" rx="3" fill="url(#lbody)" stroke="#1E463E" stroke-width="2"/>');
    p('<rect x="490" y="336" width="142" height="46" rx="3" fill="url(#lbodyD)" stroke="#1E463E" stroke-width="2"/><circle cx="520" cy="362" r="15" fill="none" stroke="url(#lsteel)" stroke-width="5"/><circle cx="520" cy="362" r="4" fill="#C5CED6"/><path d="M520 362 l14 -10" stroke="#C5CED6" stroke-width="3"/><circle cx="535" cy="351" r="4" fill="#2A323B"/>' +
      '<rect x="586" y="348" width="30" height="20" rx="3" fill="#1D2A2F"/><circle cx="601" cy="358" r="5" fill="#D9412F"/>');
    p('<rect x="498" y="270" width="124" height="30" rx="3" fill="url(#lsteel)" stroke="#6E7B86" stroke-width="1.5"/>');
    p('<rect x="526" y="214" width="56" height="58" rx="3" fill="url(#lsteel)" stroke="#59636E" stroke-width="2"/><rect x="470" y="246" width="60" height="10" rx="1" fill="#E8C55A" stroke="#8A6A12" stroke-width="1.2"/><path d="M470 246 l-6 5 6 5" fill="#C9CFD6"/>');
    // 2 ốc bắt dao + dấu khớp (vạch sơn)
    [[540, 232, 0], [566, 232, on.bolt ? 42 : 0]].forEach(function (b) {
      p('<g transform="rotate(' + b[2] + ' ' + b[0] + ' ' + b[1] + ')"><path d="M' + (b[0] - 8) + ' ' + b[1] + ' l4 -7 h8 l4 7 -4 7 h-8 z" fill="#B9C2CB" stroke="#4A5560" stroke-width="1.5"/><path d="M' + b[0] + ' ' + (b[1] - 7) + ' v-10" stroke="#F76011" stroke-width="2.6"/></g>');
      p('<path d="M' + b[0] + ' ' + (b[1] - 18) + ' v-6" stroke="#F76011" stroke-width="2.6"/>');
    });
    // nhãn điểm bôi trơn
    function lubeLabel(x, y) { return '<g><path d="M' + (x - 10) + ' ' + (y + 8) + ' L' + x + ' ' + (y - 9) + ' L' + (x + 10) + ' ' + (y + 8) + ' Z" fill="#F5C02E" stroke="#1A1A1A" stroke-width="1.5"/><circle cx="' + x + '" cy="' + (y + 2) + '" r="3" fill="#1A1A1A"/></g>'; }
    p(lubeLabel(484, 318));
    p(on.label ? '<rect x="612" y="308" width="24" height="20" rx="2" fill="#4C8E7E" stroke="#8FBDB0" stroke-dasharray="3 2"/><path d="M616 312 l16 12" stroke="#8FBDB0" stroke-width="1"/>' : lubeLabel(624, 318));
    // gạt phoi (bình thường)
    p('<rect x="652" y="300" width="10" height="34" rx="2" fill="#2B2B2B"/><rect x="460" y="300" width="10" height="34" rx="2" fill="#2B2B2B"/>');
    // ---- ụ động ----
    p('<path d="M760 196 L772 186 H872 L862 196 Z" fill="url(#ltop)"/><path d="M862 196 L872 186 V322 L862 332 Z" fill="#245A4E"/>');
    p('<rect x="760" y="196" width="102" height="136" rx="4" fill="url(#lbody)" stroke="#1E463E" stroke-width="2"/><rect x="700" y="238" width="62" height="24" rx="3" fill="url(#lsteel)" stroke="#59636E"/><path d="M700 250 l-14 0" stroke="#8D99A4" stroke-width="6"/>' +
      '<circle cx="884" cy="250" r="18" fill="none" stroke="url(#lsteel)" stroke-width="5"/><path d="M862 250 h22" stroke="#C5CED6" stroke-width="4"/>');
    // vú mỡ
    p('<path d="M806 318 h12 v-6 h-12 z" fill="#B9C2CB" stroke="#4A5560" stroke-width="1.2"/><rect x="809" y="300" width="6" height="12" fill="#C5CED6" stroke="#4A5560"/>' +
      (on.grease ? '<circle cx="812" cy="298" r="4.5" fill="#8E7350" stroke="#5A4630"/><path d="M806 296 l12 4" stroke="#5A4630" stroke-width="1"/>' : '<circle cx="812" cy="298" r="4.5" fill="#D9412F" stroke="#7A1E15"/><ellipse cx="812" cy="318" rx="9" ry="2.6" fill="#2E9A57" opacity=".7"/>'));
    p(lubeLabel(812, 282));
    // ---- bảng điều khiển CNC ----
    p('<rect x="904" y="292" width="10" height="90" fill="url(#lsteelH)"/><rect x="900" y="120" width="92" height="180" rx="6" fill="#2A323B" stroke="#12161B" stroke-width="2"/><rect x="910" y="132" width="72" height="62" rx="3" fill="#0E2A1F"/>' +
      '<text x="916" y="150" font-size="9" font-family="monospace" fill="#7FE0CF">X 120.50</text><text x="916" y="164" font-size="9" font-family="monospace" fill="#7FE0CF">Z -45.20</text><text x="916" y="180" font-size="9" font-family="monospace" fill="#3DDC84">READY</text>' +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (k) { return '<rect x="' + (912 + (k % 3) * 22) + '" y="' + (204 + Math.floor(k / 3) * 16) + '" width="16" height="11" rx="2" fill="#4A5560"/>'; }).join("") +
      '<circle cx="946" cy="276" r="11" fill="#D9412F" stroke="#7A1E15" stroke-width="2"/><circle cx="946" cy="276" r="6" fill="#FF6A5C"/>');
    // bảng tên máy
    p('<rect x="140" y="112" width="160" height="22" rx="2" fill="#1A1F25"/><text x="220" y="128" text-anchor="middle" font-size="12" font-weight="800" fill="#EEF1F4" font-family="Barlow Condensed,Arial">MT-01 · MÁY TIỆN CNC</text>');
    return '<svg class="lathe-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">' + o.join("") + '<g id="amMarks"></g></svg>';
  }
  T.latheSVG = latheSVG;

  /* ============ MÀN 1, AM ============ */
  T.levels.am = { run: function () {
    var S = T.S, cfg = D.am, pick = S.scen.amPick, on = {}, found = {}, chosen = {}, order = [], okSpots = [], falseHits = 0, done = false;
    pick.forEach(function (id) { on[id] = true; });
    var anoms = cfg.anomalies.filter(function (a) { return on[a.id]; });
    var t0 = Date.now(), timer = null, noiseT = null, z = { s: 1, x: 0, y: 0 };
    T.page(T.coach("engineer", "Đây là máy tiện lúc đầu ca. Dùng nút phóng to (hoặc lăn chuột, kéo để di chuyển) và <b>bấm vào chỗ bất thường</b>. Mỗi chỗ chọn 1 việc: vệ sinh, bôi trơn, siết chặt, gắn thẻ <b>XANH</b> (tự xử lý) hay <b>ĐỎ</b> (gọi bảo trì). Có cả <b>tiếng kêu lạ</b>, bật loa và để ý nhé!") +
      '<div class="am-wrap"><div class="am-left card"><div class="am-tools"><div class="clockbox"><span class="lbl2">AM đầu ca</span><b id="amClock">06:00</b><span class="lbl2" id="amLeft">còn 10 phút</span></div>' +
      '<div class="zbtns"><button class="zb" id="zIn" title="Phóng to">' + ic("zoomIn") + '</button><button class="zb" id="zOut" title="Thu nhỏ">' + ic("zoomOut") + '</button><button class="zb" id="zFit" title="Xem toàn bộ">' + ic("fit") + '</button><button class="zb" id="zEar" title="Nghe tiếng máy">' + ic("ear") + '</button></div></div>' +
      '<div class="amview" id="amView"><div class="amzoom" id="amZoom">' + latheSVG(on) + '</div><div class="am-hint">Bấm vào chỗ nghi bất thường · lăn chuột/kéo để phóng to & di chuyển</div></div></div>' +
      '<aside class="am-side"><div class="card paper"><h3>Checklist AM đầu ca · CILT</h3><ul class="cilt" id="cilt"></ul></div>' +
      '<div class="card tagboard"><h3><span class="plate">Bảng thẻ</span>Đã ghi nhận <b id="amCount">0</b></h3><div id="tagList" class="taglist"></div></div>' +
      '<button class="btn btn-primary btn-lg" id="amDone">Hoàn thành checklist AM</button></aside></div>', true);

    var svg = document.querySelector(".lathe-svg"), view = $("amView"), zoomEl = $("amZoom");
    function apply() { zoomEl.style.transform = "translate(" + z.x + "px," + z.y + "px) scale(" + z.s + ")"; }
    function zoomAt(f, cx, cy) {
      var r = view.getBoundingClientRect(); cx = cx == null ? r.width / 2 : cx; cy = cy == null ? r.height / 2 : cy;
      var ns = clamp(z.s * f, 1, 4); z.x = cx - (cx - z.x) * ns / z.s; z.y = cy - (cy - z.y) * ns / z.s; z.s = ns; bound(); apply();
    }
    function bound() { var r = view.getBoundingClientRect(); z.x = clamp(z.x, r.width * (1 - z.s), 0); z.y = clamp(z.y, r.height * (1 - z.s), 0); if (z.s === 1) { z.x = 0; z.y = 0; } }
    $("zIn").onclick = function () { Sound.click(); zoomAt(1.5); };
    $("zOut").onclick = function () { Sound.click(); zoomAt(1 / 1.5); };
    $("zFit").onclick = function () { Sound.click(); z = { s: 1, x: 0, y: 0 }; apply(); };
    $("zEar").onclick = function () { Sound.init(); if (on.noise) Sound.grind(); else Sound.humOn(), setTimeout(function () { Sound.humOff(); }, 1500); toast(on.noise ? "Có tiếng rè rè kim loại… nghe kỹ ở khu vực nào?" : "Máy chạy êm, không có tiếng lạ."); };
    view.addEventListener("wheel", function (e) { e.preventDefault(); var r = view.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    var pd = null;
    view.addEventListener("pointerdown", function (e) { pd = { x: e.clientX, y: e.clientY, zx: z.x, zy: z.y, moved: false }; view.setPointerCapture(e.pointerId); });
    view.addEventListener("pointermove", function (e) { if (!pd) return; var dx = e.clientX - pd.x, dy = e.clientY - pd.y; if (Math.abs(dx) + Math.abs(dy) > 6) pd.moved = true; if (pd.moved && z.s > 1) { z.x = pd.zx + dx; z.y = pd.zy + dy; bound(); apply(); } });
    view.addEventListener("pointerup", function (e) { if (!pd) return; var m = pd.moved; pd = null; if (!m) hit(e.clientX, e.clientY); });

    function svgPt(cx, cy) { var pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
    function hit(cx, cy) {
      if (done) return;
      var p = svgPt(cx, cy), best = null, bd = 1e9;
      cfg.anomalies.forEach(function (a) { var d = Math.hypot(a.x - p.x, a.y - p.y); if (d < a.r + 6 / z.s && d < bd) { bd = d; best = a; } });
      if (best && on[best.id]) { if (best.sound) Sound.grind(); openAction(best); return; }
      var dec = cfg.decoys.filter(function (d) { return Math.hypot(d.x - p.x, d.y - p.y) < 34; })[0];
      var seen = okSpots.some(function (o) { return Math.hypot(o.x - p.x, o.y - p.y) < 26; });
      if (seen) { toast("Chỗ này bạn đã kiểm tra rồi, bình thường."); return; }
      falseHits++; Sound.no(); okSpots.push({ x: p.x, y: p.y });
      toast(dec ? "Bình thường: " + dec.name : "Chỗ này bình thường, không có bất thường.");
      drawMarks();
    }
    function openAction(a) {
      Sound.click();
      modal('<h3>' + esc(a.name) + '</h3><p>Bạn xử lý bất thường này thế nào?</p><div class="actgrid">' + Object.keys(cfg.actions).map(function (k) {
        var x = cfg.actions[k];
        return '<button class="act act-' + k + (chosen[a.id] === k ? " sel" : "") + '" data-k="' + k + '"><span class="act-ic">' + ic(k === "green" || k === "red" ? "tagG" : k) + '</span><b>' + x.n + '</b><small>' + x.d + '</small></button>';
      }).join("") + '</div><div class="modal-btns"><button class="btn btn-ghost" data-close>Để sau</button></div>');
      $("modalCard").querySelectorAll(".act").forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k; found[a.id] = true; chosen[a.id] = k; if (order.indexOf(a.id) < 0) order.push(a.id); closeModal();
          k === "green" || k === "red" ? Sound.tag() : k === "tighten" ? Sound.wrench() : Sound.drop();
          drawMarks(); side();
        };
      });
    }
    /* Dấu nhận biết vùng đã xử lý: vòng tròn màu theo hành động + số thứ tự (khớp bảng thẻ) + biểu tượng;
       chỗ đã bấm mà bình thường: dấu ✓ xám nhỏ */
    var ACOL = { clean: "#3C8CE0", lube: "#E7A812", tighten: "#5A6672", green: "#2E9A57", red: "#D9412F" };
    function drawMarks() {
      var h = okSpots.map(function (o) { return '<g class="okmark"><circle cx="' + o.x + '" cy="' + o.y + '" r="8"/><path d="M' + (o.x - 3.5) + ' ' + o.y + ' l2.5 2.5 4.5 -5"/></g>'; }).join("");
      h += order.filter(function (id) { return chosen[id]; }).map(function (id, i) {
        var a = cfg.anomalies.filter(function (x) { return x.id === id; })[0], k = chosen[id], c = ACOL[k];
        var ring = '<circle class="donering" cx="' + a.x + '" cy="' + a.y + '" r="' + (a.r + 2) + '" style="--c:' + c + '"/>';
        var badge = '<g class="donebadge" transform="translate(' + (a.x - a.r * .72) + ' ' + (a.y - a.r * .72) + ')"><circle r="9" fill="' + c + '"/><text y="3.6" text-anchor="middle">' + (i + 1) + '</text></g>';
        var icon = (k === "green" || k === "red")
          ? '<g class="tagmark t-' + k + '" transform="translate(' + (a.x + a.r * .5) + ' ' + (a.y - a.r * .35) + ')"><path d="M0 0 L6 -16 H26 V4 H6 Z" /><circle cx="9" cy="-6" r="2.4" fill="#fff"/><path d="M0 0 q-6 6 -2 14" stroke="#555" fill="none"/></g>'
          : '<g class="actmark" transform="translate(' + (a.x + a.r * .7) + ' ' + (a.y - a.r * .7) + ')"><circle r="12" style="fill:' + c + '"/><g transform="translate(-8 -8) scale(.68)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + (ICON_PATH[k] || "") + '</g></g>';
        return '<g class="donemark">' + ring + icon + badge + '</g>';
      }).join("");
      $("amMarks").innerHTML = h;
    }
    var ICON_PATH = { clean: '<path d="M14 3.5l6.5 6.5M4 20.5l7-7M11 13.5l-2.5-2.5 6-6 2.5 2.5z"/>', lube: '<path d="M12 3.5c3 4 5.5 7 5.5 10.2A5.5 5.5 0 0 1 6.5 13.7C6.5 10.5 9 7.5 12 3.5z"/>', tighten: '<path d="M12 2.8l7.8 4.6v9.2L12 21.2l-7.8-4.6V7.4z"/><circle cx="12" cy="12" r="3.2"/>' };
    function side() {
      $("cilt").innerHTML = Object.keys(cfg.groups).map(function (g) {
        var n = anoms.filter(function (a) { return a.group === g && chosen[a.id]; }).length;
        return '<li class="' + (n ? "on" : "") + '"><i class="box">' + (n ? ic("check") : "") + '</i><span>' + esc(cfg.groups[g]) + '</span><b>' + (n ? n + " mục" : "") + '</b></li>';
      }).join("");
      var list = order.filter(function (id) { return chosen[id]; }).map(function (id) { return cfg.anomalies.filter(function (a) { return a.id === id; })[0]; });
      $("amCount").textContent = list.length;
      $("tagList").innerHTML = list.length ? list.map(function (a) {
        var k = chosen[a.id];
        return '<div class="tagrow t-' + k + '" data-id="' + a.id + '"><b class="tnum" style="background:' + ACOL[k] + '">' + (list.indexOf(a) + 1) + '</b><span class="tg">' + ic(k === "green" || k === "red" ? "tagG" : k) + '</span><span>' + esc(a.name) + '</span><em>' + esc(cfg.actions[k].n) + '</em></div>';
      }).join("") : '<p class="empty">Chưa ghi nhận bất thường nào.</p>';
      $("tagList").querySelectorAll(".tagrow").forEach(function (r) { r.onclick = function () { openAction(cfg.anomalies.filter(function (a) { return a.id === r.dataset.id; })[0]); }; });
    }
    side();
    // đồng hồ 10 phút trong game
    timer = setInterval(function () {
      var f = (Date.now() - t0) / 1000 / cfg.realSeconds, gm = f * cfg.gameMinutes, left = Math.max(0, cfg.gameMinutes - gm);
      if (!$("amClock")) { clearInterval(timer); return; }
      var s = Math.floor(gm * 60); $("amClock").textContent = "06:" + ("0" + Math.min(10, Math.floor(gm))).slice(-2) + ":" + ("0" + (s % 60)).slice(-2);
      $("amLeft").textContent = left > 0 ? "còn " + Math.ceil(left) + " phút" : "hết giờ";
      $("amClock").parentNode.classList.toggle("warn", left < 2);
      if (left <= 0) { toast("Hết 10 phút AM, nộp checklist."); finish(); }
    }, 250);
    if (on.noise) noiseT = setInterval(function () { if (!done && Math.random() < .5) Sound.grind(); }, 7000);
    T.onLeave = function () { clearInterval(timer); clearInterval(noiseT); done = true; };
    $("amDone").onclick = function () {
      var miss = anoms.length - Object.keys(chosen).length;
      if (miss > 0 && (Date.now() - t0) / 1000 < cfg.realSeconds) {
        modal('<h3>Nộp checklist?</h3><p>Bạn đã ghi nhận ' + Object.keys(chosen).length + ' bất thường. Vẫn còn thời gian để thanh tra kỹ hơn.</p><div class="modal-btns"><button class="btn btn-ghost" data-close>Kiểm tra tiếp</button><button class="btn btn-primary" id="amGo">Nộp</button></div>');
        $("amGo").onclick = function () { closeModal(); finish(); };
      } else finish();
    };
    function finish() {
      if (done) return; done = true; clearInterval(timer); clearInterval(noiseT); T.onLeave = null;
      var n = anoms.length, f = anoms.filter(function (a) { return chosen[a.id]; }).length, okc = anoms.filter(function (a) { return chosen[a.id] === a.ok; }).length;
      var pen = Math.min(1.5, falseHits * 0.25), sc = D.scoring.am * (0.5 * f / n + 0.5 * okc / n) - pen;
      var review = '<div class="card"><h3>Đáp án từng bất thường <small>' + f + '/' + n + ' phát hiện · ' + okc + '/' + n + ' xử lý đúng · ' + falseHits + ' lần bấm nhầm (−' + num(pen, 2) + ')</small></h3><div class="ilist">' +
        anoms.map(function (a) {
          var c = chosen[a.id], ok = c === a.ok, st = !c ? "bad" : ok ? "ok" : "half";
          return '<div class="irow ' + st + '"><div class="th"><span class="emo">' + ic(a.ok === "green" || a.ok === "red" ? "tagG" : a.ok) + '</span></div><div><h4>' + esc(a.name) + '</h4><div class="where">Bạn: <b>' + (c ? cfg.actions[c].n : "Không phát hiện") + '</b> · Đúng: <b>' + cfg.actions[a.ok].n + '</b></div><p>' + esc(a.why) + '</p></div><span class="badge ' + st + '">' + (!c ? "Bỏ sót" : ok ? "Đúng" : "Sai") + '</span></div>';
        }).join("") + '</div></div>';
      T.endLevel("am", sc, {
        say: "AM là 4 việc mỗi ca: <b>vệ sinh, kiểm tra, bôi trơn, siết chặt</b>. Thứ gì người vận hành làm được ngay thì làm hoặc gắn thẻ <b>XANH</b>; thứ gì cần dụng cụ, chuyên môn hoặc có áp suất/điện thì gắn thẻ <b>ĐỎ</b> cho bảo trì. Thiếu dầu và ốc lỏng chính là “bệnh” MTBF thấp của máy tiện!",
        sub: "Phát hiện " + f + "/" + n + " · xử lý đúng " + okc + "/" + n, review: review });
    }
  } };

  /* ============ MÀN 2, PM ============ */
  T.levels.pm = { run: function () {
    var cfg = D.pm, place = {}, order = U.shuffle(cfg.tasks), dd = null;
    function task(id) { return cfg.tasks.filter(function (t) { return t.id === id; })[0]; }
    function card(t) {
      return '<div class="dcard pmcard" data-id="' + t.id + '"><span class="pm-m">' + esc(t.m) + '</span><b>' + esc(t.n) + '</b></div>';
    }
    function draw() {
      var tray = order.filter(function (t) { return !place[t.id]; });
      T.page(T.coach("engineer", "Lập lịch PM cho 2 máy. Kéo từng hạng mục vào ô đúng <b>tần suất</b> và đúng <b>người làm</b>: hàng trên là người vận hành (AM), hàng dưới là bộ phận bảo trì (PM). Gợi ý: việc nhẹ, nhìn-nghe-sờ được thì giao vận hành; cần dụng cụ đo, tháo lắp, có áp suất thì giao bảo trì.") +
        '<div class="pm-wrap" id="pmRoot"><div class="card tray-card"><div class="tray-head"><span class="plate">Hạng mục bảo trì</span><span>' + tray.length + ' thẻ chưa xếp</span></div><div class="tray pmtray" data-drop="tray">' + tray.map(card).join("") + '</div></div>' +
        '<div class="pmboard"><div class="pmb-h"></div>' + cfg.freqs.map(function (f) { return '<div class="pmb-h"><b>' + f.n + '</b>' + (f.s ? '<small>' + f.s + '</small>' : '') + '</div>'; }).join("") +
        cfg.who.map(function (w) {
          return '<div class="pmb-r r-' + w.k + '"><b>' + w.k + '</b><span>' + esc(w.n) + '</span></div>' + cfg.freqs.map(function (f) {
            var key = f.k + "|" + w.k;
            return '<div class="pmcell" data-drop="' + key + '">' + order.filter(function (t) { var p = place[t.id]; return p && p.f === f.k && p.w === w.k; }).map(card).join("") + '</div>';
          }).join("");
        }).join("") + '</div>' +
        '<div class="m2-foot"><p class="small-note">' + (tray.length ? "Còn " + tray.length + " hạng mục chưa xếp. Kéo thẻ (hoặc chạm thẻ rồi chạm ô)." : "Đã xếp đủ 12 hạng mục. Tua nhanh 3 tháng để xem kết quả lịch PM.") + '</p><button class="btn btn-primary btn-lg" id="pmRun"' + (tray.length ? " disabled" : "") + '>' + ic("ff") + 'Tua nhanh 3 tháng</button></div></div>', true);
      if (dd) dd.destroy();
      dd = T.dnd($("pmRoot"), function (id, target) { if (target === "tray") delete place[id]; else { var a = target.split("|"); place[id] = { f: a[0], w: a[1] }; } draw(); });
      $("pmRun").onclick = function () { Sound.click(); simulate(); };
    }
    T.onLeave = function () { if (dd) dd.destroy(); };
    function bars(sim, mid, title) {
      var W = 520, H = 220, base = 170, mx = D.pm.baseFailures[mid] + 0.5, sc = 130 / mx, o = '<svg class="cc" viewBox="0 0 ' + W + ' ' + H + '">';
      for (var g = 0; g <= mx; g++) { var y = base - g * sc; o += '<line x1="44" x2="' + (W - 10) + '" y1="' + y + '" y2="' + y + '" class="grid"/><text x="36" y="' + (y + 4) + '" class="wfl" text-anchor="end">' + g + '</text>'; }
      [0, 1, 2].forEach(function (m) {
        var gx = 80 + m * 150;
        [["none", "#5A6672"], ["yours", "#F76011"], ["ideal", "#3DDC84"]].forEach(function (s, j) {
          var v = sim[s[0]][mid][m], h = v * sc, x = gx + j * 36;
          o += '<rect class="wfbar" style="--d:' + ((m * 3 + j) * .08) + 's" x="' + x + '" y="' + (base - h) + '" width="30" height="' + h + '" rx="3" fill="' + s[1] + '"' + (s[0] === "ideal" ? ' opacity=".55"' : '') + '/><text x="' + (x + 15) + '" y="' + (base - h - 5) + '" class="wft">' + num(v, 1) + '</text>';
        });
        o += '<text x="' + (gx + 51) + '" y="' + (base + 18) + '" class="wfl b">Tháng ' + (m + 1) + '</text>';
      });
      return '<div class="hmi"><div class="hmi-l">' + title + ' · số lần hỏng / tháng</div>' + o + '<g></g></svg><div class="lgd"><span><i style="background:#5A6672"></i>Không có lịch PM</span><span><i style="background:#F76011"></i>Lịch của bạn</span><span><i style="background:#3DDC84;opacity:.6"></i>Lịch chuẩn</span></div></div>';
    }
    function simulate() {
      if (dd) dd.destroy(); T.onLeave = null;
      var sim = C.pmSim(cfg.tasks, place, cfg.baseFailures), op = D.month.opHours;
      var l3 = sim.yours.lathe[2], m3 = sim.yours.mill[2];
      var mtbfL = op.lathe / l3, mtbfM = op.mill / m3;
      var fOk = 0, wOk = 0;
      cfg.tasks.forEach(function (t) { var p = place[t.id]; if (p.f === t.f) fOk++; if (p.w === t.w) wOk++; });
      var sc = D.scoring.pm * (0.6 * fOk + 0.4 * wOk) / cfg.tasks.length;
      Sound.ok();
      var review = '<div class="card"><h3>Mô phỏng 3 tháng theo lịch của bạn</h3><div class="pm-sim">' + bars(sim, "lathe", "Máy tiện CNC") + bars(sim, "mill", "Máy phay CNC") + '</div>' +
        '<div class="pm-kpi"><div><span>MTBF máy tiện tháng 3</span><b>' + num(mtbfL, 0) + ' giờ</b><small>trước: ' + num(op.lathe / cfg.baseFailures.lathe, 0) + ' giờ</small></div><div><span>MTBF máy phay tháng 3</span><b>' + num(mtbfM, 0) + ' giờ</b><small>trước: ' + num(op.mill / cfg.baseFailures.mill, 0) + ' giờ</small></div></div></div>' +
        '<div class="card"><h3>Đáp án lịch PM <small>tần suất đúng ' + fOk + '/12 · người làm đúng ' + wOk + '/12</small></h3><div class="ilist">' + cfg.tasks.map(function (t) {
          var p = place[t.id], fo = p.f === t.f, wo = p.w === t.w, st = fo && wo ? "ok" : fo || wo ? "half" : "bad";
          var fn = function (k) { return cfg.freqs.filter(function (f) { return f.k === k; })[0].n; };
          return '<div class="irow ' + st + '"><div class="th"><span class="emo">' + ic(t.w === "AM" ? "clean" : "pm") + '</span></div><div><h4>' + esc(t.n) + ' <small>· ' + esc(t.m) + '</small></h4><div class="where">Bạn: <b>' + fn(p.f) + ' · ' + p.w + '</b> · Đúng: <b>' + fn(t.f) + ' · ' + t.w + '</b></div><p>' + esc(t.why) + '</p></div><span class="badge ' + st + '">' + (st === "ok" ? "Đúng" : st === "half" ? "Đúng 1 nửa" : "Sai") + '</span></div>';
        }).join("") + '</div></div>';
      T.endLevel("pm", sc, { say: "Lịch PM tốt chia việc đúng người: <b>vận hành</b> làm việc hằng ngày/tuần (AM), <b>bảo trì</b> làm việc cần chuyên môn theo <b>giờ chạy (TBM)</b> hoặc <b>theo tình trạng (CBM, đo rung, đo nhiệt)</b>. Xem biểu đồ: lịch càng đúng thì số lần hỏng càng giảm, MTBF càng tăng.", sub: "MTBF máy tiện tháng 3: " + num(mtbfL, 0) + " giờ", review: review });
    }
    draw();
  } };
})();
