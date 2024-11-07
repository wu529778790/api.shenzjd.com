# 使用 Node.js 最新的 LTS 版本镜像作为基础镜像
FROM node:20-alpine

# 创建并设置工作目录
WORKDIR /app

# 复制 dist 文件夹到容器中
COPY dist/ ./


# 暴露应用程序端口
EXPOSE 3000

# 启动应用
CMD ["node", "/main.js"]
