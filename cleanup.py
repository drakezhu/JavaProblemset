import json
import re

with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_answer(answer):
    # 移除所有 ┌────── 格式的ASCII艺术字块
    # 匹配从 ``` 到 ``` 之间的ASCII方框内容
    answer = re.sub(r'```\n┌[─\s│┌└├┤┬┴┼]+```\n', '', answer)
    
    # 移除单独的ASCII方框图（在Mermaid之后的内容）
    # 匹配 ┌ 开头到 ``` 结尾的内容
    answer = re.sub(r'\n┌[─\s│┌└├┤┬┴┼\n▼├]+', '', answer)
    
    return answer

# 处理每个问题
for item in data:
    if 'answer' in item:
        item['answer'] = clean_answer(item['answer'])

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Cleaned {len(data)} questions")
