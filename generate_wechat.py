import json

# 读取高质量题目
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# 生成JS文件 - 处理特殊字符
lines = ['// questions.js - 面试题数据', 'const questionsData = [']
for q in questions:
    # 转义特殊字符
    question = q['question'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
    answer = q['answer'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
    category = q['category'].replace('\\', '\\\\').replace('"', '\\"')
    
    lines.append(f"  {{")
    lines.append(f"    id: {q['id']},")
    lines.append(f"    category: \"{category}\",")
    lines.append(f"    question: \"{question}\",")
    lines.append(f"    answer: \"{answer}\",")
    lines.append(f"    difficulty: {q['difficulty']}")
    lines.append(f"  }},")

lines.append('];')
lines.append('')
lines.append('module.exports = { questionsData };')

# 写入文件
with open('d:/traeProjects/InterviewPrep/wechat-miniprogram/questions.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Generated {len(questions)} questions')
