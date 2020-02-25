# Close Pull Requests

A GitHub action to close all repository pull requests and delete respective branches.

## Usage

```yml
      - name: Close Pull Requests
        uses: ./.github/close-pull-requests
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
