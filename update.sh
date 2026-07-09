#!/bin/bash

# yttAPI 更新脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 备份配置
backup_config() {
    print_info "备份配置文件..."

    local backup_dir="backup/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"

    # 备份环境变量文件
    if [ -f ".env" ]; then
        cp .env "$backup_dir/"
    fi

    # 备份数据库
    if [ -d "data" ]; then
        cp -r data "$backup_dir/"
    fi

    print_success "配置备份完成: $backup_dir"
}

# 更新代码
update_code() {
    print_info "更新代码..."

    # 检查是否是git仓库
    if [ -d ".git" ]; then
        # 保存本地修改
        git stash

        # 拉取最新代码
        git pull origin main

        # 恢复本地修改
        git stash pop || true
    else
        print_warning "不是git仓库，跳过代码更新"
    fi
}

# 重新构建和启动
rebuild_service() {
    print_info "重新构建并启动服务..."

    # 停止现有服务
    docker-compose down

    # 重新构建镜像
    docker-compose build --no-cache

    # 启动服务
    docker-compose up -d

    # 等待服务启动
    print_info "等待服务启动..."
    sleep 5

    # 检查服务状态
    if docker-compose ps | grep -q "Up"; then
        print_success "服务更新成功！"
        docker-compose ps
    else
        print_error "服务启动失败"
        docker-compose logs
        exit 1
    fi
}

# 清理旧镜像
cleanup_old_images() {
    read -p "是否清理旧的Docker镜像? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        print_info "清理旧镜像..."
        docker image prune -f
        print_success "清理完成"
    fi
}

# 显示更新信息
show_info() {
    echo ""
    echo "=========================================="
    echo "  yttAPI 更新完成"
    echo "=========================================="
    echo ""
    echo "更新内容:"
    echo "  - 代码已更新到最新版本"
    echo "  - 服务已重新构建并启动"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  重启服务: docker-compose restart"
    echo "  停止服务: ./stop.sh"
    echo ""
    echo "=========================================="
}

# 主函数
main() {
    print_info "更新 yttAPI..."

    backup_config
    update_code
    rebuild_service
    cleanup_old_images
    show_info
}

# 执行主函数
main "$@"
