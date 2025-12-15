#!/bin/bash

# Переходим в директорию скрипта
cd "$(dirname "$0")"

echo "============================================"
echo "    Quiz Application Startup Script"
echo "============================================"
echo

# Создаем timestamp для имени backup
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")

# Создаем папку для backup в домашней директории если её нет
backup_dir="$HOME/backup/quiz_backups"
if [ ! -d "$backup_dir" ]; then
    mkdir -p "$backup_dir"
    echo "✓ Backup directory created: $backup_dir"
fi

echo "[1/2] Creating backup..."
echo "Timestamp: $timestamp"

# Создаем backup используя tar с исключениями
# Исключаем: node_modules, UI/*/Assets/Content, backup, .npm-cache, dist, logs
tar -czf "$backup_dir/quiz_backup_$timestamp.tar.gz" \
    --exclude='node_modules' \
    --exclude='UI/LearnMode/Assets/Content' \
    --exclude='UI/TestRunner/Assets/Content' \
    --exclude='backup' \
    --exclude='.npm-cache' \
    --exclude='dist' \
    --exclude='logs' \
    --exclude='*.log' \
    --exclude='*.db' \
    .

if [ $? -eq 0 ]; then
    echo "✓ Backup created successfully: quiz_backup_$timestamp.tar.gz"
    echo "✓ Backup location: $backup_dir"
else
    echo "✗ Backup creation failed!"
fi

echo

echo "[2/2] Starting application..."
echo "Setting up environment..."

# Устанавливаем переменные окружения для цветного вывода
export FORCE_COLOR=1
export NODE_ENV=development

# Убираем ELECTRON_RUN_AS_NODE (устанавливается VSCode/Claude Code)
# Эта переменная мешает Electron работать как GUI приложение
unset ELECTRON_RUN_AS_NODE

# Устанавливаем DISPLAY если не задан (для запуска из Claude Code)
export DISPLAY="${DISPLAY:-:1}"

# Запускаем приложение
npm start

echo
echo "Application finished."
echo "============================================"