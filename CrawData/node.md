# Tài liệu API Quản lý Phim

## Tổng quan
API Quản lý Phim cung cấp khả năng quản lý và truy xuất thông tin phim từ nguồn ophim1.com. Hệ thống được xây dựng bằng TypeScript và Express, tích hợp caching để tối ưu hiệu suất.

## Thông tin cơ bản
- **Base URL**: `http://localhost:3000`
- **Định dạng phản hồi**: JSON
- **Thời gian lưu cache**: 5 phút

## Các Endpoint của API

### 1. Lấy danh sách phim
**Endpoint**: `GET /api/movies`

**Tham số truy vấn:**
- `page` (number, không bắt buộc) - Mặc định: 1
- `limit` (number, không bắt buộc) - Mặc định: 24

**Ví dụ:**
```
http://localhost:3000/api/movies?page=1&limit=24
```

---

### 2. Tìm kiếm phim
**Endpoint**: `GET /api/movies/search`

**Tham số truy vấn:**
- `search` (string, không bắt buộc) - Tìm kiếm theo tên phim
- `year` (number, không bắt buộc) - Lọc theo năm phát hành
- `category` (string, không bắt buộc) - Lọc theo thể loại
- `country` (string, không bắt buộc) - Lọc theo quốc gia
- `type` (string, không bắt buộc) - Lọc theo loại phim
- `page` (number, không bắt buộc) - Mặc định: 1
- `limit` (number, không bắt buộc) - Mặc định: 24

**Ví dụ:**
```
http://localhost:3000/api/movies/search?search=batman&year=2022&category=action&page=1&limit=24
```

---

### 3. Lấy chi tiết phim
**Endpoint**: `GET /api/movies/:slug`

**Tham số URL:**
- `slug` (string, bắt buộc) - Định danh duy nhất của phim

**Ví dụ:**
```
http://localhost:3000/api/movies/batman-begins
```

---

## Cấu trúc phản hồi

### Phản hồi thành công
```json
{
  "status": true,
  "total": number,
  "page": number,
  "limit": number,
  "items": [
    {
      "title": string,
      "year": number,
      "category": string,
      "country": string,
      "slug": string
    }
  ]
}
```

### Phản hồi lỗi
```json
{
  "status": false,
  "message": string
}
```

---

## Mã lỗi
- **400**: Yêu cầu không hợp lệ
- **404**: Không tìm thấy
- **500**: Lỗi máy chủ nội bộ

---

## Tính năng

1. **Bộ nhớ đệm (Memory Cache)**:
   - Lưu trữ dữ liệu trong 5 phút để giảm tải API và tăng tốc độ phản hồi.

2. **Cron Job**:
   - Tự động chạy vào 00:00 và 12:00 hàng ngày để cập nhật dữ liệu phim.

3. **Cơ chế thử lại (Retry Mechanism)**:
   - Thử lại tối đa 3 lần khi không thể crawl dữ liệu.

4. **Cập nhật không gián đoạn (Zero Downtime Updates)**:
   - Đảm bảo dịch vụ không bị gián đoạn khi cập nhật dữ liệu.

---

Tài liệu này mô tả các chức năng và cấu trúc chính của API Quản lý Phim. Hãy sử dụng các ví dụ được cung cấp để tích hợp API vào ứng dụng của bạn một cách dễ dàng.

