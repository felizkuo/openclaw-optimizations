#!/usr/bin/env node
/**
 * OpenClaw Memory Engine - Learning Script
 * 每次對話結束自動學習
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(process.env.HOME || '/home/felizkuo', '.openclaw/workspace-cos/memory');
const MISTAKES_DIR = path.join(MEMORY_DIR, 'mistakes');
const PATTERNS_DIR = path.join(MEMORY_DIR, 'patterns');

// 確保目錄存在
[MEMORY_DIR, MISTAKES_DIR, PATTERNS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * 學習腳本
 * 分析對話，提取學習點
 */
function learn(conversation) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const notes = [];
  const mistakes = [];
  
  // 分析對話內容
  if (conversation.messages) {
    conversation.messages.forEach(msg => {
      // 檢測錯誤
      if (msg.error || msg.toolError) {
        mistakes.push({
          time: msg.timestamp,
          error: msg.error || msg.toolError,
          context: msg.context
        });
      }
      
      // 檢測成功
      if (msg.success) {
        notes.push({
          time: msg.timestamp,
          success: msg.success,
          context: msg.context
        });
      }
    });
  }
  
  // 記錄學習筆記
  if (notes.length > 0) {
    const noteFile = path.join(MEMORY_DIR, `${timestamp}-learning.md`);
    const content = `# 學習筆記 - ${timestamp}\n\n` +
      notes.map(n => `- ${n.success}`).join('\n');
    fs.appendFileSync(noteFile, content + '\n');
  }
  
  // 記錄踩坑
  if (mistakes.length > 0) {
    const mistakeFile = path.join(MISTAKES_DIR, `${timestamp}.json`);
    fs.writeFileSync(mistakeFile, JSON.stringify(mistakes, null, 2));
  }
  
  return { notes: notes.length, mistakes: mistakes.length };
}

/**
 * 反思腳本
 * 回顧最近學習，產出報告
 */
function reflect(days = 7) {
  const files = fs.readdirSync(MEMORY_DIR)
    .filter(f => f.endsWith('-learning.md'))
    .sort()
    .slice(-days);
  
  let summary = `# 反思報告\n\n`;
  summary += `回顧最近 ${days} 天...\n\n`;
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf8');
    summary += `## ${file}\n${content}\n\n`;
  });
  
  return summary;
}

// CLI
const args = process.argv.slice(2);
if (args[0] === 'learn') {
  const result = learn({ messages: [] });
  console.log('學習完成:', result);
} else if (args[0] === 'reflect') {
  console.log(reflect());
} else {
  console.log('Usage:');
  console.log('  node learn.js learn');
  console.log('  node learn.js reflect');
}
