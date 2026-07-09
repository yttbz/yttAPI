#!/bin/bash

# yttAPI 一键安装脚本
# 使用方法: curl -fsSL https://raw.githubusercontent.com/yttbz/yttAPI/main/install.sh | bash

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

# 检查是否为root用户
check_root() {
    if [ "$EUID" -eq 0 ]; then
        print_warning "建议不要使用root用户运行此脚本"
        read -p "是否继续? (y/N): " confirm
        if [[ ! $confirm =~ ^[Yy]$ ]]; then
            print_info "安装已取消"
            exit 1
        fi
    fi
}

# 检查系统依赖
check_dependencies() {
    print_info "检查系统依赖..."

    # 检查Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker未安装，请先安装Docker"
        print_info "安装命令: curl -fsSL https://get.docker.com | sh"
        exit 1
    fi

    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi

    # 检查Git
    if ! command -v git &> /dev/null; then
        print_warning "Git未安装，将尝试使用其他方式获取代码"
    fi

    print_success "依赖检查通过"
}

# 克隆或更新代码
setup_code() {
    local install_dir="$HOME/yttAPI"

    if [ -d "$install_dir" ]; then
        print_info "检测到已存在安装目录，将更新代码..."
        cd "$install_dir"
        git pull origin main
    else
        print_info "克隆项目代码..."
        if command -v git &> /dev/null; then
            git clone https://github.com/yttbz/yttAPI.git "$install_dir"
            cd "$install_dir"
        else
            print_error "Git未安装，无法克隆代码"
            exit 1
        fi
    fi
}

# 配置环境变量
setup_config() {
    print_info "配置环境变量..."

    if [ ! -f ".env" ]; then
        cp .env.example .env

        # 生成随机密钥
        local secret_key=$(openssl rand -hex 32)
        sed -i "s/your-secret-key-here/$secret_key/" .env

        print_success "环境变量配置完成"
        print_warning "请编辑 .env 文件配置图片目录等信息"
    else
        print_info "环境变量文件已存在，跳过配置"
    fi
}

# 启动服务
start_service() {
    print_info "启动服务..."

    # 构建并启动容器
    docker-compose up -d --build

    print_success "服务启动成功！"
    print_info "访问地址: http://localhost:3000"
    print_info "后台管理: http://localhost:3000/admin"
    print_info "默认密码: admin123"
}

# 显示使用说明
show_usage() {
    echo ""
    echo "=========================================="
    echo "  yttAPI 安装完成！"
    echo "=========================================="
    echo ""
    echo "常用命令："
    echo "  启动服务: ./start.sh"
    echo "  停止服务: ./stop.sh"
    echo "  查看日志: docker-compose logs -f"
    echo "  更新版本: ./update.sh"
    echo ""
    echo "配置文件: .env"
    echo "后台管理: http://localhost:3000/admin"
    echo "默认密码: admin123"
    echo ""
    echo "感谢使用 yttAPI！"
    echo "=========================================="
}

# 主函数
main() {
    print_info "开始安装 yttAPI..."

    check_root
    check_dependencies
    setup_code
    setup_config
    start_service
    show_usage
}

# 执行主函数
main "$@"
