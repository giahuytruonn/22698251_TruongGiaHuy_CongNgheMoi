# Hướng Dẫn Triển Khai Ứng Dụng Node.js lên AWS EC2 (Amazon Linux 2023)

Tài liệu này hướng dẫn bạn đưa ứng dụng lên server sử dụng hệ điều hành **Amazon Linux 2023** (AL2023).

## Giai Đoạn 1: Khởi tạo EC2 Instance (Trên AWS Console)

1. **Đăng nhập AWS Console** > **EC2** > **Launch Instance**.
2. **Đặt tên**: Ví dụ `NodeJS-App-AL2023`.
3. **Chọn OS (AMI)**: Chọn **Amazon Linux**.
   - Phía dưới sẽ tự chọn "Amazon Linux 2023 AMI" (miễn phí trong Free Tier).
4. **Instance Type**: Chọn `t2.micro` (hoặc `t3.micro` tùy vùng).
5. **Key Pair**: Tạo mới hoặc chọn key cũ (định dạng `.pem`).
6. **Network / Security Group**:
   - Chọn "Create security group".
   - Allow SSH traffic from: "My IP" (khuyên dùng) hoặc "Anywhere".
   - Allow HTTP traffic from the internet.
   - **Mở port 3000**:
     - Edit Network settings > Add security group rule.
     - Type: `Custom TCP`, Port: `3000`, Source: `Anywhere` (0.0.0.0/0).
7. Nhấn **Launch instance**.

## Giai Đoạn 2: Kết nối vào Server

Khác với Ubuntu, user mặc định của Amazon Linux là `ec2-user`.

1. Mở terminal/Powershell tại thư mục chứa key.
2. Chạy lệnh:
   ```bash
   ssh -i "ten-key-cua-ban.pem" ec2-user@<PUBLIC-IP>
   ```

## Giai Đoạn 3: Cài đặt Môi trường (Trên Server Amazon Linux)

1. **Cập nhật hệ thống**:
   ```bash
   sudo dnf update -y
   ```

2. **Cài đặt Git**:
   ```bash
   sudo dnf install git -y
   ```

3. **Cài đặt Node.js**:
   Amazon Linux 2023 hỗ trợ cài Node.js trực tiếp rất dễ dàng.
   ```bash
   sudo dnf install nodejs -y
   ```
   0
   *Kiểm tra phiên bản:*
   ```bash
   node -v
   npm -v
   ```

   *(Nếu bản node cài ra quá cũ, bạn có thể cài `fnm` hoặc `nvm` để lấy bản mới hơn, nhưng thường bản mặc định đã đủ dùng).*

## Giai Đoạn 4: Đưa Code lên Server

1. **Clone mã nguồn từ Git**:
   ```bash
   git clone <LINK_GITHUB_CUA_BAN>
   cd <TEN_THU_MUC_DU_AN>
   ```

2. **Cài đặt Dependencies**:
   ```bash
   npm install
   ```

## Giai Đoạn 5: Cấu hình Biến Môi Trường (.env)

1. Tạo file `.env`:
   ```bash
   nano .env
   ```
   *(Nếu chưa có nano: `sudo dnf install nano -y`)*

2. Dán nội dung cấu hình (nhấp chuột phải để paste):
   ```env
   AWS_REGION=ap-southeast-2
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   S3_BUCKET_NAME=giahuytruonn-bucket
   DYNAMODB_TABLE=Products
   ```
3. Lưu: `Ctrl + O` -> `Enter` -> `Ctrl + X`.

## Giai Đoạn 6: Chạy Ứng dụng

### Chạy thử
```bash
node app.js
```
Truy cập `http://<CUA_IP_PUBLIC>:3000` để test.

### Chạy Production với PM2
1. Cài PM2:
   ```bash
   sudo npm install -g pm2
   ```
2. Khởi động app:
   ```bash
   pm2 start app.js --name "my-app"
   ```
3. Cấu hình khởi động cùng hệ thống:
   ```bash
   pm2 startup
   ```
   *Copy và chạy dòng lệnh mà PM2 in ra màn hình.*
   
   Sau đó lưu lại:
   ```bash
   pm2 save
   ```

## Giai Đoạn 7: Chạy trên Port 80 (Tùy chọn)

Nếu muốn user vào web không cần gõ `:3000`.

**Cách 1: IPTables (Forward Port)**
```bash
sudo iptables -t nat -A PREROUTING -i ens0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```
*(Lưu ý: Interface mạng trên AL2023 thường là `ens0` hoặc `eth0`, chạy `ip addr` để kiểm tra tên đúng).*

**Cách 2: Cài Nginx (Khuyên dùng)**
```bash
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```
Sau đó cấu hình Nginx proxy pass về port 3000.
