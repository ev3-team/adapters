# Contributing to Ev3 Adapters

## Code of Conduct

Ev3 has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of
Conduct, and we expect project participants to adhere to it.

Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and
will not be tolerated.

## Working on your first Pull Request?

There are a lot of great resources on creating a good pull request. We've included a few below, but
don't be shy we appreciate all contributions and are happy to help those who are willing to help us!

- [How to Contribute to a Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Adding a new project?

Awesome! It's pretty straight-forward.
What I'd recommend, is to take a look at the existing projects and see how they are structured. You'll see
that they all follow a similar pattern. I usually copy over an existing project just to get started.

## Preparing a Pull Request

Try not to include more than one project/issue in a single PR. It's much easier for us to review
multiple small pull requests than one that is large and unwieldy.

1. [Fork the repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo).

2. Clone the fork to your local machine and add upstream remote:

```sh
git clone https://github.com/<your username>/adapters.git
cd adapters
git remote add upstream https://github.com/ev3-team/adapters.git
```

1. Synchronize your local `staging` branch with the upstream remote:

```sh
git checkout staging
git pull upstream staging
```

1. Install dependencies with [pnpm](https://pnpm.io/):

```sh
pnpm i
```

1. Create a new branch related to your PR:

```sh
git checkout -b project/project-name
```

6. Make changes, then commit and push to your forked repository:

```sh
git push -u origin HEAD
```

7. Go to [the repository](https://github.com/ev3-team/adapters) and
   [make a Pull Request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

8. We will review your Pull Request and either merge it, request changes to it, or close it with an
   explanation.

## Contribute from a browser IDE

Make changes and contribute in a single click with an **already setup and ready to code developer environment** using Gitpod !

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/?autostart=true#https://github.com/ev3-team/adapters)
