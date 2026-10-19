# EATNOW – HỆ THỐNG ĐẶT MÓN ĂN CĂN TIN TRƯỜNG HỌC

> **Đồ án môn học:** Phát triển ứng dụng Web / Công nghệ phần mềm  
> **Repository:** [https://github.com/cheesy6918/EatNow](https://github.com/cheesy6918/EatNow)  
> **Công nghệ sử dụng chính:** `HTML` · `CSS` · `JS` · `MySQL` · `GitHub` · `NodeJS`  
> **Mô hình phát triển:** Agile / Scrum (3 Sprints) · Quản lý tiến độ Trello · Phân loại MoSCoW (32 User Stories)

---

## 👥 THÀNH VIÊN NHÓM VÀ PHÂN CÔNG VAI TRÒ

| STT | Họ và tên | Vai trò (Role) | Nhiệm vụ chính trong dự án |
| :---: | :--- | :--- | :--- |
| 1 | **Nguyễn Linh Chi** | **Project Manager (PM)** | Quản lý dự án theo Agile/Scrum, thiết lập Sprint Backlog trên Trello, điều phối tiến độ & rủi ro. |
| 2 | **Mai Thu Hà** | **Business Analyst (BA)** | Khảo sát nhu cầu người dùng (Google Forms), phân tích đặc tả yêu cầu, lập Product Backlog & ma trận MoSCoW. |
| 3 | **Nguyễn Thị Hồng** | **Lead Developer (Dev 1)** | Thiết kế kiến trúc, xây dựng giao diện phía Sinh viên (Tra cứu thực đơn, Giỏ hàng, Đặt món, Ví CanteenGo). |
| 4 | **Ngô Thị Hồng Thu** | **Developer (Dev 2)** | Xây dựng phân hệ Căn tin/Bếp (Nhận đơn realtime, hoàn tiền), phân hệ Quản trị viên (Admin) & Quản lý CSDL. |
| 5 | **Nguyễn Thị Huyền** | **Tester / QA Lead** | Lập Test Plan, xây dựng bộ 15 Test Cases (TC01 – TC15), theo dõi Bug Log và kiểm thử tự động. |

---

## 1. CÔNG NGHỆ BẮT BUỘC SỬ DỤNG

Hệ thống **EatNow** được xây dựng dựa trên đầy đủ **6 công nghệ bắt buộc đã đăng ký theo yêu cầu đồ án**:

| STT | Công nghệ | Tên đầy đủ / Phiên bản | Vai trò & Ứng dụng thực tế trong đồ án EatNow |
| :---: | :--- | :--- | :--- |
| 1 | **HTML** | **HTML5** | Xây dựng cấu trúc toàn bộ các trang web ngữ nghĩa (Semantic markup), biểu mẫu đăng nhập, modal giỏ hàng, thẻ món ăn. |
| 2 | **CSS** | **CSS3 / Tailwind CSS** | Định kiểu giao diện, hệ màu căn tin hiện đại, bố cục Flexbox/Grid và responsive 100% trên điện thoại di động & máy tính. |
| 3 | **JS** | **JavaScript (ES6+) / ReactJS / TypeScript** | Xử lý logic nghiệp vụ đặt món, giỏ hàng realtime, tính toán giảm giá voucher, trừ tiền ví CanteenGo và phân quyền 3 vai trò. |
| 4 | **MySQL** | **MySQL Database (InnoDB, utf8mb4)** | Thiết kế và quản lý 7 bảng cơ sở dữ liệu quan hệ (`NguoiDung`, `DanhMuc`, `MonAn`, `DonHang`, `ChiTietDonHang`, `ThanhToan`, `DanhGia`). |
| 5 | **GitHub** | **Git / GitHub** | Quản lý mã nguồn tập trung, lịch sử commit theo từng Sprint của 5 thành viên (Repo: `cheesy6918/EatNow`). |
| 6 | **NodeJS** | **Node.js (v18+ / v20+)** | Môi trường runtime thực thi JavaScript phía server, quản lý gói phụ thuộc npm, chạy máy chủ backend và Vite dev server. |

### Thư viện & Công cụ mở rộng tối ưu trải nghiệm:
* **React 19 & TypeScript**: Nâng cao tính module hóa component và kiểm soát kiểu dữ liệu an toàn.
* **Lucide Icons**: Hệ thống biểu tượng trực quan cho các món ăn và trạng thái đơn.
* **Motion**: Xử lý hiệu ứng mở ngăn kéo giỏ hàng và chuyển đổi trạng thái đơn hàng mượt mà.

---

## 2. PHẠM VI MVP & MA TRẬN YÊU CẦU (MOSCOW - 32 USER STORIES)

Hệ thống hoàn thành 32 User Stories qua 3 Sprint với phân loại độ ưu tiên:
* **20 Must-have (Bắt buộc phải có):**
  * Tra cứu thực đơn theo danh mục và tìm kiếm món ăn.
  * Đặt món trước (Pre-order) kèm khung giờ hẹn lấy tại căn tin.
  * Kiểm tra tồn kho trước khi tạo đơn (`ConHang = true` và `stock_quantity > 0`).
  * Thanh toán trực tuyến trừ tiền số dư Ví Demo (`soDuVi >= TongTien`).
  * Màn hình Bếp tiếp nhận đơn hàng thời gian thực (Real-time Order Queue).
  * Chuyển trạng thái đơn: Chờ thanh toán &rarr; Chờ xác nhận &rarr; Đang chế biến &rarr; Đã sẵn sàng &rarr; Đã giao.
  * Nhân viên từ chối đơn hàng (kèm lý do) &rarr; Hệ thống tự động hoàn tiền 100% về ví sinh viên.
  * Quản trị viên cập nhật thực đơn, giá bán, số lượng tồn kho và xem báo cáo doanh thu.
* **9 Should-have (Nên có):**
  * Tùy chọn ăn tại chỗ (nhập số bàn) hoặc đóng hộp mang đi.
  * Hệ thống mã giảm giá (Vouchers: `CHAOTAN20`, `EATNOW10`, `FREESHIP5K`, `CANTEEN5K`).
  * Bộ lọc thực đơn nâng cao (khoảng giá, món lành mạnh Healthy, món còn hàng).
  * Chuông cảnh báo âm thanh khi có đơn mới tại bếp.
  * In phiếu nhận món / Hóa đơn nhiệt 80mm cho sinh viên và phiếu bếp cho nhân viên nấu.
  * Đánh giá và nhận xét món ăn (1 – 5 sao) sau khi hoàn tất đơn.
* **3 Could-have (Có thể có trong tương lai):**
  * Gợi ý món ăn thông minh dựa trên lịch sử đặt món.
  * Tích hợp cổng thanh toán thực tế (VietQR Dynamic Callback).
  * Theo dõi vị trí hàng đợi trực tiếp tại quầy căn tin.

---

## 3. CÁC LUỒNG NGHIỆP VỤ CỐT LÕI (CORE USE CASES)

```
[ Sinh viên ]                             [ Nhân viên Bếp ]                    [ Hệ thống Ví / CSDL ]
      |                                           |                                      |
      |--- 1. Chọn món & Khung giờ hẹn --------->|                                      |
      |--- 2. Thanh toán Ví EATNOW ------------->|                                      |
      |                                           |                                      |--- Kiểm tra số dư ví
      |                                           |                                      |--- Trừ tiền & Cập nhật đơn
      |<-- 3. Nhận mã đơn & QR Check-in ----------|                                      |
      |                                           |                                      |
      |                                           |--- 4. Bếp xác nhận chế biến -------->| (Đang nấu)
      |                                           |--- 5. Bếp bấm 'Sẵn sàng nhận' ------>| (Sẵn sàng)
      |<-- 6. Sinh viên tới quầy nhận món --------|                                      |
      |                                           |--- 7. Bếp bấm 'Hoàn tất' ----------->| (Đã giao)
      |
      | [Trường hợp hết món đột xuất]
      |                                           |--- Bếp bấm 'Từ chối đơn' (Lý do) --->|
      |<-- Tự động hoàn tiền 100% vào Ví <-----------------------------------------------| (Hoàn tiền tức thì)
```

* **UC-01 (Đặt món):** Kiểm tra tồn kho trước khi đặt. Nếu `ConHang = false` hoặc số lượng khả dụng = 0 &rarr; chặn đơn và báo lỗi *"Món ăn hiện đã hết hàng"*. Nếu hợp lệ &rarr; tạo đơn ở trạng thái `ChoThanhToan`.
* **UC-02 (Thanh toán Ví EATNOW):** Kiểm tra `soDuVi` của `NguoiDung`.
  * Nếu `soDuVi < TongTien` &rarr; báo lỗi *"Số dư ví không đủ để thực hiện giao dịch"*.
  * Nếu đủ tiền &rarr; trừ tiền ví, tạo bản ghi `ThanhToan`, cập nhật đơn sang `DaThanhToan_ChoXacNhan`.
* **UC-03 (Xử lý đơn phía Căn tin):** Nhân viên căn tin bấm *"Từ chối đơn"* kèm lý do (ví dụ: hết nguyên liệu đột xuất) &rarr; Hệ thống tự động kích hoạt hoàn lại 100% số tiền đơn hàng vào `soDuVi` của khách hàng và chuyển trạng thái đơn sang `TuChoi`.

---

## 4. THIẾT KẾ CƠ SỞ DỮ LIỆU MYSQL (DATABASE SCHEMA)

Cơ sở dữ liệu **`eatnow_db`** được thiết kế chuẩn hóa theo Class Diagram (Engine InnoDB, charset `utf8mb4`):

```sql
-- 1. Bảng Người dùng
CREATE TABLE NguoiDung (
    Id VARCHAR(50) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    Sdt VARCHAR(20),
    VaiTro ENUM('SinhVien', 'NhanVien', 'Admin') NOT NULL DEFAULT 'SinhVien',
    soDuVi DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Bảng Danh mục món ăn
CREATE TABLE DanhMuc (
    Id VARCHAR(50) PRIMARY KEY,
    TenDanhMuc VARCHAR(100) NOT NULL,
    MoTa TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Bảng Món ăn
CREATE TABLE MonAn (
    Id VARCHAR(50) PRIMARY KEY,
    TenMon VARCHAR(150) NOT NULL,
    Gia DECIMAL(12,2) NOT NULL,
    HinhAnh VARCHAR(255),
    MoTa TEXT,
    ConHang TINYINT(1) NOT NULL DEFAULT 1,
    IdDanhMuc VARCHAR(50),
    stock_quantity INT DEFAULT 50,
    calories INT NULL,
    FOREIGN KEY (IdDanhMuc) REFERENCES DanhMuc(Id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Bảng Đơn hàng
CREATE TABLE DonHang (
    Id VARCHAR(50) PRIMARY KEY,
    MaDonHang VARCHAR(20) UNIQUE NOT NULL,
    IdNguoiDung VARCHAR(50) NOT NULL,
    NgayDat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ThoiGianNhan VARCHAR(50) NOT NULL,
    TrangThai ENUM('ChoThanhToan', 'DaThanhToan_ChoXacNhan', 'DangCheBien', 'DaSanSang', 'DaGiao', 'TuChoi') DEFAULT 'DaThanhToan_ChoXacNhan',
    TongTien DECIMAL(12,2) NOT NULL,
    HinhThuc ENUM('AnTaiCho', 'MangDi') DEFAULT 'MangDi',
    SoBan VARCHAR(30) NULL,
    MaGiamGia VARCHAR(50) NULL,
    TienGiamGia DECIMAL(12,2) DEFAULT 0.00,
    LyDoTuChoi TEXT NULL,
    FOREIGN KEY (IdNguoiDung) REFERENCES NguoiDung(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Bảng Chi tiết đơn hàng
CREATE TABLE ChiTietDonHang (
    Id VARCHAR(50) PRIMARY KEY,
    IdDonHang VARCHAR(50) NOT NULL,
    IdMonAn VARCHAR(50) NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    DonGia DECIMAL(12,2) NOT NULL,
    GhiChu TEXT NULL,
    FOREIGN KEY (IdDonHang) REFERENCES DonHang(Id) ON DELETE CASCADE,
    FOREIGN KEY (IdMonAn) REFERENCES MonAn(Id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Bảng Thanh toán & Giao dịch ví
CREATE TABLE ThanhToan (
    Id VARCHAR(50) PRIMARY KEY,
    IdDonHang VARCHAR(50) NOT NULL,
    IdNguoiDung VARCHAR(50) NOT NULL,
    SoTien DECIMAL(12,2) NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PhuongThuc ENUM('ViEatNow', 'MoMo', 'ZaloPay', 'TienMat') DEFAULT 'ViEatNow',
    TrangThai ENUM('ThanhCong', 'ThatBai', 'HoanTien') DEFAULT 'ThanhCong',
    FOREIGN KEY (IdDonHang) REFERENCES DonHang(Id) ON DELETE CASCADE,
    FOREIGN KEY (IdNguoiDung) REFERENCES NguoiDung(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Bảng Đánh giá món ăn
CREATE TABLE DanhGia (
    Id VARCHAR(50) PRIMARY KEY,
    IdDonHang VARCHAR(50) NOT NULL,
    IdMonAn VARCHAR(50) NOT NULL,
    IdNguoiDung VARCHAR(50) NOT NULL,
    SoSao INT NOT NULL CHECK (SoSao BETWEEN 1 AND 5),
    NhanXet TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdDonHang) REFERENCES DonHang(Id) ON DELETE CASCADE,
    FOREIGN KEY (IdMonAn) REFERENCES MonAn(Id) ON DELETE CASCADE,
    FOREIGN KEY (IdNguoiDung) REFERENCES NguoiDung(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 5. KỊCH BẢN KIỂM THỬ TRỌNG TÂM (TEST CASES & EXCEPTION FLOWS)

Nhóm QA đã thiết kế và kiểm thử thành công bộ 15 kịch bản (TC01 – TC15), trong đó các ca kiểm thử biên và luồng ngoại lệ trọng tâm gồm:

| Mã TC | Tên ca kiểm thử | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Result) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC08** | Đặt món vượt số lượng tồn kho | Món *Cơm tấm sườn nướng*, tồn kho = 2, người dùng nhập số lượng = 5 | Hệ thống chặn tăng số lượng, hiển thị cảnh báo: *"Chỉ còn lại 2 suất"*. | **PASSED** |
| **TC09** | Chọn khung giờ nhận món trong quá khứ | Đặt món lúc 11:30 nhưng chọn slot hẹn *10:45 - 11:00* | Khung giờ quá khứ bị làm mờ (disabled), không cho phép nhấn chọn. | **PASSED** |
| **TC11** | Thanh toán khi số dư ví nhỏ hơn tổng tiền | Giỏ hàng = 45.000₫, số dư ví = 20.000₫ | Chặn thanh toán, hiển thị modal thông báo thiếu 25.000₫ và gợi ý nạp ví. | **PASSED** |
| **TC14** | Căn tin từ chối đơn & hoàn tiền tự động | Đơn #EN-8821 giá trị 35.000₫ bị Bếp từ chối do hết món | Đơn chuyển sang `TuChoi`, ví sinh viên được cộng lại đúng 35.000₫ tức thì. | **PASSED** |

---

## 6. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN (RUN LOCALLY)

### Yêu cầu môi trường:
* **Node.js**: Phiên bản 18.x hoặc 20.x trở lên.
* **Trình quản lý gói**: `npm` đi kèm Node.js.

### Các lệnh thực thi trong Terminal:
```bash
# 1. Sao chép mã nguồn về máy
git clone https://github.com/cheesy6918/EatNow.git
cd EatNow

# 2. Cài đặt toàn bộ thư viện dependencies
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

Mở trình duyệt web và truy cập vào: **`http://localhost:3000`**

### Kiểm tra chất lượng mã nguồn & đóng gói:
```bash
npm run lint    # Kiểm tra tính toàn vẹn TypeScript (0 errors)
npm run build   # Đóng gói sản phẩm tối ưu cho Production
```

---

## 7. TÀI KHOẢN MẪU DÀNH CHO GIẢNG VIÊN VÀ BẢO VỆ ĐỒ ÁN

Hệ thống tích hợp thanh **Chuyển đổi vai trò nhanh (Role Switcher)** ngay đầu trang để giảng viên dễ dàng kiểm tra mà không cần đăng xuất:

| Nhóm tài khoản | Người đại diện | Email đăng nhập | Dữ liệu khởi tạo & Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Sinh Viên** | Nguyễn Văn An | `an.nguyen@student.edu.vn` | Số dư ví: **200.000₫**. Được phép đặt món, hẹn giờ, nạp ví, in phiếu nhận món, đánh giá. |
| **Nhân Viên Bếp** | Nguyễn Thị Hồng | `bep.hongthu@canteen.edu.vn` | Nhận đơn realtime, chuông báo âm thanh, chuyển trạng thái nấu, từ chối đơn hoàn tiền, in phiếu bếp. |
| **Quản Trị Viên** | Quản Trị Căn Tin | `admin@canteen.edu.vn` | Toàn quyền quản trị danh mục/món ăn, thiết lập voucher, thống kê doanh thu, duyệt bảng CSDL MySQL. |

---

## 8. PHÂN CÔNG THUYẾT TRÌNH DEMO DAY (10 – 12 PHÚT)

* **Phút 00:00 – 01:00 (1 phút) – Nguyễn Linh Chi (PM):** Giới thiệu đề tài EatNow, tính cấp thiết và quy trình quản trị dự án theo Agile/Scrum trên Trello.
* **Phút 01:00 – 02:30 (1.5 phút) – Mai Thu Hà (BA):** Trình bày kết quả khảo sát sinh viên qua Google Forms, cấu trúc Product Backlog và ma trận ưu tiên MoSCoW.
* **Phút 02:30 – 05:30 (3 phút) – Nguyễn Thị Hồng (Dev 1):** Live Demo luồng Sinh viên (xem thực đơn, lọc món, chọn giờ hẹn lấy, áp voucher, thanh toán ví CanteenGo).
* **Phút 05:30 – 08:00 (2.5 phút) – Ngô Thị Hồng Thu (Dev 2):** Live Demo luồng Căn tin & Quản trị (bếp tiếp nhận đơn, chuông báo, từ chối hoàn tiền tự động, quản lý món và xuất DB MySQL).
* **Phút 08:00 – 09:30 (1.5 phút) – Nguyễn Thị Huyền (Tester):** Báo cáo kế hoạch kiểm thử (Test Plan), kết quả 15 Test Cases, phân tích Bug Log và cách khắc phục lỗi.
* **Phút 09:30 – 12:00 (2.5 phút) – Cả nhóm:** Phần Hỏi & Đáp (Q&A) cùng Hội đồng Giảng viên.

---

> **Tóm tắt công nghệ:** Đồ án EatNow áp dụng chuẩn xác bộ 6 công nghệ bắt buộc đã đăng ký: **HTML**, **CSS**, **JS**, **MySQL**, **GitHub**, **NodeJS** kết hợp cùng ReactJS 19 và Tailwind CSS v4 để tối ưu trải nghiệm người dùng và hiệu năng vận hành.

© 2026 **EatNow Project Team** – Toàn quyền bảo lưu mã nguồn đồ án.
