import sys

latest_newsletter = sys.argv[1]

with open('README.md', 'r') as file:
    readme = file.read()

updated_readme = readme.replace('<!-- newsletter -->', latest_newsletter)

with open('README.md', 'w') as file:
    file.write(updated_readme)
