import json
import re

with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    content = f.read()

# 简单的替换：找到 ``` 后跟方框图的内容并删除
# 匹配从 ```\n 开始到下一个 ``` 之间的所有包含方框字符的内容

# 更精确的清理
patterns = [
    # 匹配任何 ```\n 开头，后面有方框字符的内容
    (r'```\n[┌┌└├┤│─▼]+.*?```\n', ''),
    # 匹配 ```java 之后跟着方框的
    (r'```\n┌[─\s│\n]+```\n', '\n'),
    # 匹配 ``` 后面直接跟方框的
    (r'```\n([│┌┐└┘├┤┬┴┼╔╗╚╝╠╣║═╦╩╬]+.*?)```\n', ''),
]

for pattern, replacement in patterns:
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
