/* =====================================================================
   KẾT NỐI LMS, điểm nối cho đội IT của WISE
   ---------------------------------------------------------------------
   Game gọi WISE_LMS.sendResult(result) mỗi khi người chơi hoàn thành.
   result = {
     player:   "Nguyễn Văn A",
     score:    82,                 // tổng điểm /100
     rating:   "Đạt",
     timeSec:  315,                // thời gian chơi (giây)
     breakdown:{ hocNhanh:10, phanLoai:30, tinhToan:28, phanTich:16, thuongThoiGian:3 },
     finishedAt: "2026-10-10T08:30:00.000Z"
   }
   Hiện tại:
     1) gửi postMessage cho trang web chứa iframe (type: "wise-oee-result")
     2) nếu WISE_LMS.endpoint có giá trị → POST JSON tới địa chỉ đó
   ===================================================================== */
window.WISE_LMS = {
  endpoint: "",          // ví dụ: "https://lms.wisedemy.com.vn/api/game-results"
  headers: {},           // ví dụ: { "Authorization": "Bearer ..." }

  sendResult: function (result) {
    var payload = Object.assign({ type: "wise-oee-result", game: "thu-thach-oee" }, result);
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage(payload, "*");
    } catch (e) { /* bỏ qua */ }
    if (this.endpoint) {
      try {
        fetch(this.endpoint, {
          method: "POST",
          headers: Object.assign({ "Content-Type": "application/json" }, this.headers),
          body: JSON.stringify(payload)
        }).catch(function () {});
      } catch (e) { /* bỏ qua */ }
    }
    return payload;
  }
};
