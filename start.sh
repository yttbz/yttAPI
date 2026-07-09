#!/bin/bash

# yttAPI 启动脚本

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

# 检查Docker是否运行
check_docker() {
    if ! docker info &> /dev/null; then
        print_error "Docker未运行，请先启动Docker"
        exit 1
    fi
}

# 检查docker-compose文件
check_compose_file() {
    if [ ! -f "docker-compose.yml" ]; then
        print_error "找不到 docker-compose.yml 文件"
        exit 1
    fi
}

# 启动服务
start_service() {
    print_info "启动 yttAPI 服务..."

    # 检查是否已经在运行
    if docker-compose ps | grep -q "Up"; then
        print_warning "服务已经在运行中"
        docker-compose ps
        return
    fi

    # 启动服务
    docker-compose up -d

    # 等待服务启动
    print_info "等待服务启动..."
    sleep 5

    # 检查服务状态
    if docker-compose ps | grep -q "Up"; then
        print_success "服务启动成功！"
        docker-compose ps
    else
        print_error "服务启动失败"
        docker-compose logs
        exit 1
    fi
}

# 显示访问信息
show_info() {
    echo ""
    echo "=========================================="
    echo "  yttAPI 服务已启动"
    echo "=========================================="
    echo ""
    echo "访问地址:"
    echo "  主页: http://localhost:3000"
    echo "  后台: http://localhost:3000/admin"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: ./stop.sh"
    echo "  重启服务: docker-compose restart"
    echo ""
    echo "=========================================="
}

# 主函数
main() {
    print_info "启动 yttAPI..."

    check_docker
    check_compose_file
    start_service
    show_info
}

# 执行主函数
main "$@"
