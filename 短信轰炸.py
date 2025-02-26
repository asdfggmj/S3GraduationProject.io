import requests

#网站配置信息
website_configs=[
    {
        "name":"水滴筹",
        "url": "https://passport.shuidihuzhu.com/api/account/v3/verify-code-send",
        "method": "POST",  
        "headers": {
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/json",
        },
        "payload_template": {
            "mobile": None,          # 占位符，后续会替换为手机号
            "key": "REG-CFANPBDE",   # 固定值
        },
    }
]

def send_verification_code(phone,configs):
    """通用验证码发送函数"""
    for site in configs:
        print(f"正在向 {site['name']} 发送验证码...")
        # 替换手机号到 Payload
        payload = site["payload_template"]
        for key in payload:
            if payload[key] is None:
                payload[key] = phone

        try:
            # 根据配置发送请求
            if site["method"].upper() == "POST":
                response = requests.post(site["url"], headers=site["headers"], json=payload, timeout=10)
            elif site["method"].upper() == "GET":
                response = requests.get(site["url"], headers=site["headers"], params=payload, timeout=10)
            else:
                print(f"未知的请求方法：{site['method']}")
                continue

            # 处理响应
            if response.status_code == 200:
                print(f"{site['name']} 验证码发送成功！返回数据：", response.json())
            else:
                print(f"{site['name']} 验证码发送失败！状态码：{response.status_code}，响应内容：{response.text}")

        except requests.RequestException as e:
            print(f"请求 {site['name']} 时发生错误：{e}")

if __name__ == "__main__":
    phone = input("请输入手机号：")
    send_verification_code(phone, website_configs)
