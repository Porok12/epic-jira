# epic-jira

```shell
vi .git/hooks/pre-commit
```

```shell
#!/bin/bash

commit_msg_file=$1

# Specify your desired commit message format using a regular expression
commit_msg_format="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}$"

while IFS= read -r line; do
  if [[ ! "$line" =~ $commit_msg_format ]]; then
    echo "Error: Invalid commit message format." >&2
    echo "Please follow the format: <type>(optional scope): <message>" >&2
    exit 1
  fi
done < "$commit_msg_file"
```