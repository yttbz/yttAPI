#!/bin/bash

# yttAPI 停止脚本

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

# 停止服务
stop_service() {
    print_info "停止 yttAPI 服务..."

    # 检查是否在运行
    if ! docker-compose ps | grep -q "Up"; then
        print_warning "服务未在运行"
        return
    fi

    # 停止服务
    docker-compose down

    print_success "服务已停止"
}

# 清理选项
cleanup_option() {
    read -p "是否要清理容器和镜像? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        print_info "清理容器和镜像..."
        docker-compose down --rmi all --volumes
        print_success "清理完成"
    fi
}

# 显示状态
show_status() {
    echo ""
    echo "=========================================="
    echo "  yttAPI 服务已停止"
    echo "=========================================="
    echo ""
    echo "常用命令:"
    echo "  启动服务: ./start.sh"
    echo "  查看状态: docker-compose ps"
    echo "  清理资源: docker-compose down --rmi all --volumes"
    echo ""
    echo "=========================================="
}

# 主函数
main() {
    print_info "停止 yttAPI..."

    stop_service
    cleanup_option
    show_status
}

# 执行主函数
main "$@"
