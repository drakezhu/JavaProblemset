import json

# 使用strict=False来解析有换行符的JSON
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    data = json.loads(f.read(), strict=False)

print(f"Loaded {len(data)} questions")

# 清理answer字段中的特殊字符
for item in data:
    if 'answer' in item and item['answer']:
        # 将~~~转回反引号，并移除多余的换行符
        item['answer'] = item['answer'].replace('~~~', '`')

# 重新保存为标准JSON
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("JSON fixed and saved successfully!")
