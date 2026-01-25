# Hướng Dẫn Triển Khai Ứng Dụng Node.js lên AWS EC2

Tài liệu này sẽ hướng dẫn bạn từng bước để đưa ứng dụng quản lý sản phẩm lên máy chủ ảo EC2 của AWS.

## Giai Đoạn 1: Khởi tạo EC2 Instance (Trên AWS Console)

1. **Đăng nhập AWS Console** và tìm dịch vụ **EC2**.
2. Nhấn nút **Launch Instance** (Màu cam).
3. **Đặt tên**: Ví dụ `NodeJS-Product-App`.
4. **Chọn OS (AMI)**: Chọn **Ubuntu** (Ubuntu Server 22.04 LTS hoặc 24.04 LTS) để dễ sử dụng.
5. **Instance Type**: Chọn `t2.micro` (Thường được miễn phí trong gói Free Tier).
6. **Key Pair (Login)**:
   - Nhấn "Create new key pair".
   - Đặt tên (vd: `my-ec2-key`).        
   - Chọn định dạng `.pem` (cho Mac/Linux/Win 10+) hoặc `.ppk` (cho PuTTY cũ).
   - **Quan trọng**: Tải file về và lưu kỹ, không được làm mất.
7. **Network settings / Security Group**:
   - Chọn "Create security group".
   - Đánh dấu: "Allow SSH traffic from" -> "My IP" (để bảo mật) hoặc "Anywhere".
   - Đánh dấu: "Allow HTTP traffic from the internet".
   - **Quan trọng**: Bạn cần mở port 3000 (cổng chạy app của bạn).
     - Nhấn "Edit" trong phần Network Settings.
     - Nhấn "Add security group rule".
     - Type: `Custom TCP`, Port range: `3000`, Source: `Anywhere` (0.0.0.0/0).
8. Nhấn **Launch instance**.

## Giai Đoạn 2: Kết nối vào Server

1. Mở terminal trên máy tính của bạn (PowerShell hoặc CMD trên Windows).
2. Di chuyển đến thư mục chứa file key `.pem` bạn vừa tải.
3. Chạy lệnh:
   ```bash
   ssh -i "ten-file-key.pem" ubuntu@<PUBLIC-IP-CUA-EC2>
   ```
   *Lưu ý: Thay `<PUBLIC-IP-CUA-EC2>` bằng địa chỉ IP bạn thấy trên AWS Console.*

## Giai Đoạn 3: Cài đặt Môi trường (Trên Server EC2)

Sau khi SSH thành công, chạy các lệnh sau để cài Node.js:

1. **Cập nhật hệ thống**:
   ```bash
   sudo apt update
   ```

2. **Cài đặt Node.js** (Phiên bản LTS):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Kiểm tra cài đặt**:
   ```bash
   node -v
   npm -v
   ```

## Giai Đoạn 4: Đưa Code lên Server

Bạn có 2 cách chính: dùng Git (khuyên dùng) hoặc copy file thủ công.

### Cách 1: Dùng Git (Nếu bạn đã đẩy code lên GitHub/GitLab)
1. Cài git: `sudo apt install git`
2. Clone repo:
   ```bash
   git clone <LINK_REPO_CUA_BAN>
   cd <TEN_THU_MUC_REPO>
   ```
3. Cài dependencies:
   ```bash
   npm install
   ```

### Cách 2: Copy thủ công (Nếu chưa có Git)
Bạn có thể copy file từ máy lên server, nhưng cách này phức tạp hơn. Đơn giản nhất là tạo file thủ công hoặc dùng Git.

## Giai Đoạn 5: Cấu hình Biến Môi Trường (.env)

Bạn cần tạo file `.env` trên server chứa AWS Key của bạn.

1. Tại thư mục dự án trên server, tạo file:
   ```bash
   nano .env
   ```
2. Dán nội dung tương tự file `.env` ở máy local của bạn vào:
   ```env
   AWS_REGION=ap-southeast-2
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   S3_BUCKET_NAME=giahuytruonn-bucket
   DYNAMODB_TABLE=Products
   ```
3. Lưu lại: Nhấn `Ctrl + O` -> `Enter` -> `Ctrl + X`.

## Giai Đoạn 6: Chạy Ứng dụng

### Chạy thử nghiệm
```bash
node app.js
```
Truy cập trình duyệt: `http://<PUBLIC-IP>:3000`. Nếu web hiện lên là thành công!

### Chạy Production (Giữ app luôn chạy)
Dùng **PM2** để quản lý process.

1. Cài PM2 global:
   ```bash
   sudo npm install -g pm2
   ```
2. Khởi động app:
   ```bash
   pm2 start app.js --name "product-app"
   ```
3. Cấu hình PM2 khởi động cùng hệ thống:
   ```bash
   pm2 startup
   pm2 save
   ```

## Giai Đoạn 7 (Nâng cao): Chạy trên Port 80 (Tùy chọn)
Hiện tại web chạy port 3000. Để chạy port 80 (không cần gõ :3000), dùng IPTables forward:

```bash
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```
Hoặc dùng Nginx làm Reverse Proxy (khuyên dùng cho production thực tế).
