# Petoria — Thế giới linh thú

**[Chơi trên GitHub Pages](https://ttung8696-lgtm.github.io/tung/petoria/)**

Game nhập vai linh thú **chơi đơn** bằng tiếng Việt cho điện thoại và máy tính. Bản này viết mới, lấy cảm hứng từ GoPet; không phải client chính thức, không kết nối máy chủ GoPet và không cần tài khoản. Không có mã nguồn hay dữ liệu trích từ ZIP tham khảo.

## Bắt đầu

- Mộc Miêu đã sẵn sàng đi cùng bạn tại **Làng Mầm Xanh**. Chạm đường đi, dùng WASD hoặc phím mũi tên để di chuyển. Chạm nhân vật/bảng gỗ để tương tác, hoặc đến gần và nhấn **E**.
- Chạm thú hoang trên bản đồ hoặc chọn **Chiến đấu**. Đánh thường không tốn MP; kỹ năng tốn 6 MP. Mộc khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Mộc.
- Muốn thu phục? Dùng **Nương tay** để không đánh gục đối thủ. Khi HP còn tối đa 40%, dùng **Thu phục** với một ấn kết bạn. Vào **Linh thú của bạn →** để đổi bạn đồng hành.
- Thắng 2 trận mở **Rừng Ngọc Bích**, thắng 5 trận mở **Đồi Hổ Phách**. Đánh bại thủ lĩnh Tinh Hồ để hoàn thành bộ sưu tập 4 loài. Các nhiệm vụ được ghi tiến độ tự động; mở sổ để nhận thưởng.
- Dùng vàng để huấn luyện, mua quả mọng, sương lam và ấn. Dùng ngọc mua bùa cộng sức đánh. **Chăm sóc linh thú → Nghỉ ở làng** hồi đầy HP/MP cả đội miễn phí.
- Phím **1–4**: chiến đấu, huấn luyện, túi đồ, cửa hàng. **Esc** đóng bảng hoặc thu nhỏ bản đồ. Trong trận, dùng **Rút lui** để về bản đồ.

Tiến trình (kể cả lượt đấu đang dở) lưu bằng `localStorage` trong trình duyệt hiện tại. Dữ liệu không đồng bộ giữa thiết bị, giữa bản xem trước và GitHub Pages hoặc giữa chế độ riêng tư và chế độ thường. Nếu trình duyệt chặn lưu trữ, game vẫn chơi được trong phiên và hiển thị cảnh báo ở cuối trang.

## Chạy và kiểm tra

Đây là một trang tĩnh độc lập, **không cần npm install, khóa API, Firebase hay máy chủ game**. Từ gốc kho:

```sh
python3 -m http.server 4173 --bind 0.0.0.0 --directory petoria
```

Mở `http://localhost:4173/`. Dùng HTTP thay vì mở `index.html` qua `file://` vì game nạp ES modules. Để triển khai ở nơi khác, giữ nguyên cây thư mục `petoria/` trên máy chủ tĩnh. Mọi URL tài nguyên đều tương đối với thư mục game.

```sh
# Kiểm tra luật chơi, lưu/đọc tiến trình, đường đi và hành trình tới thủ lĩnh (Node.js 20+).
node --test tests/petoria.test.mjs
```

- `game.js`: trạng thái, kinh tế, nhiệm vụ, lượt đấu và phần thưởng.
- `terrain.js`, `world.js`: vùng đi được, tìm đường, camera, bàn phím và cảm ứng.
- `ui.js`, `app.js`, `style.css`: giao diện, điều khiển, âm thanh tổng hợp và lưu tiến trình.
- `assets/`: cảnh nền và nhân vật được tạo riêng cho Petoria, biểu tượng pixel, phông chữ và biểu tượng giao diện. Be Vietnam Pro & Silkscreen (OFL), Lucide (ISC/MIT); các giấy phép đi kèm trong `assets/`.

Game nằm ở `/petoria/` để không thay đổi ứng dụng ở trang gốc hoặc game đua xe ở `/game/`.
