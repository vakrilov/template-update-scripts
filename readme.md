Simple script for updating NativeScript templates

Usage:
```
$./apply.sh [branch] [message]
```

For each repo listed in `templates-repos.txt` the script will:

1. Clone the repo
2. Copy recursively (`cp -r`) the contets of the `PATCH` folder into the repo
3. Create a branch with name `[branch]`
4. Commit changes with message `[message]`
5. Push